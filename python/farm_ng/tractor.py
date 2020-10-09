import asyncio
import logging
import sys

import numpy as np
from farm_ng_proto.tractor.v1.tractor_pb2 import TractorState
from google.protobuf.text_format import MessageToString
from google.protobuf.timestamp_pb2 import Timestamp
from liegroups import SE3

from farm_ng.canbus import CANSocket
from farm_ng.config import default_config
from farm_ng.ipc import get_event_bus, make_event
from farm_ng.kinematics import TractorKinematics
from farm_ng.motor import HubMotor
from farm_ng.periodic import Periodic
from farm_ng.proto_utils import se3_to_proto
from farm_ng.steering import SteeringClient

logger = logging.getLogger('tractor')
logger.setLevel(logging.INFO)


class TractorController:
    def __init__(self, event_loop):
        self.event_loop = event_loop
        self.command_rate_hz = 50
        self.command_period_seconds = 1.0 / self.command_rate_hz
        self.n_cycle = 0

        # self.record_counter = 0
        # self.recording = False
        self.event_bus = get_event_bus('farm_ng.tractor')
        self.lock_out = False
        self.can_socket = CANSocket('can0', self.event_loop)
        self.steering = SteeringClient()
        self.tractor_state = TractorState()

        self.odom_pose_tractor = SE3.identity()
        # TODO(ethanrublee|isherman) load from disk somehow.
        self.config = default_config()

        self.kinematics = TractorKinematics(tractor_config=self.config)
        radius = self.config.wheel_radius.value
        gear_ratio = self.config.hub_motor_gear_ratio.value
        poll_pairs = self.config.hub_motor_poll_pairs.value

        self.right_motor = HubMotor(
            'right_motor',
            radius, gear_ratio, poll_pairs, 7, self.can_socket,
        )
        self.right_motor_aft = HubMotor(
            'right_motor_aft',
            radius, gear_ratio, poll_pairs, 8, self.can_socket,
        )
        self.left_motor = HubMotor(
            'left_motor',
            radius, gear_ratio, poll_pairs, 9, self.can_socket,
        )
        self.left_motor_aft = HubMotor(
            'left_motor_aft',
            radius, gear_ratio, poll_pairs, 10, self.can_socket,
        )

        self.control_timer = Periodic(
            self.command_period_seconds, self.event_loop,
            self._command_loop, name='control_loop',
        )

        self._last_odom_stamp = None

    def _command_loop(self, n_periods):
        # n_periods is the number of periods since the last call. Should normally be 1.
        now = Timestamp()
        now.GetCurrentTime()

        if (self.n_cycle % (5*self.command_rate_hz)) == 0:
            logger.info(
                '\nright motor:\n  %s\nleft motor:\n  %s\n state:\n %s',
                MessageToString(self.right_motor.get_state(), as_one_line=True),
                MessageToString(self.left_motor.get_state(), as_one_line=True),
                MessageToString(self.tractor_state, as_one_line=True),
            )

        self.tractor_state.stamp.CopyFrom(now)
        self.tractor_state.wheel_velocity_rads_left = self.left_motor.velocity_rads()
        self.tractor_state.wheel_velocity_rads_right = self.right_motor.velocity_rads()
        self.tractor_state.average_update_rate_left_motor = self.left_motor.average_update_rate()
        self.tractor_state.average_update_rate_right_motor = self.right_motor.average_update_rate()

        if self._last_odom_stamp is not None:
            dt = (now.ToMicroseconds() - self._last_odom_stamp.ToMicroseconds())*1e-6
            min_dt = 0.0
            max_dt = 1.0  # 1 second
            if dt < min_dt or dt > max_dt:
                # this condition can occur if n_periods skipped is high
                # or negative if for some reason the clock is non-monotonic - TODO(ethanrublee) should we use a monotonic clock?
                logger.warn('odometry time delta out of bounds, clipping. n_period=%d dt=%f min_dt=%f max_dt=%f', n_periods, dt, min_dt, max_dt)

            self.tractor_state.dt = np.clip(dt, min_dt, max_dt)

            tractor_pose_delta = self.kinematics.compute_tractor_pose_delta(
                self.tractor_state.wheel_velocity_rads_left,
                self.tractor_state.wheel_velocity_rads_right,
                self.tractor_state.dt,
            )

            self.odom_pose_tractor = self.odom_pose_tractor.dot(tractor_pose_delta)
            self.tractor_state.abs_distance_traveled += np.linalg.norm(tractor_pose_delta.trans)

            self.tractor_state.odometry_pose_base.a_pose_b.CopyFrom(se3_to_proto(self.odom_pose_tractor))
            self.tractor_state.odometry_pose_base.frame_a = 'odometry/wheel'
            self.tractor_state.odometry_pose_base.frame_b = 'tractor/base'
            self.event_bus.send(
                make_event(
                    'pose/tractor/base',
                    self.tractor_state.odometry_pose_base, stamp=now,
                ),
            )

        self._last_odom_stamp = now

        self.n_cycle += 1
        brake_current = 10.0
        steering_command = self.steering.get_steering_command()
        if steering_command.brake > 0.0:
            self.tractor_state.commanded_brake_current = brake_current
            self.tractor_state.commanded_wheel_velocity_rads_left = 0.0
            self.tractor_state.commanded_wheel_velocity_rads_right = 0.0
            self.tractor_state.target_unicycle_velocity = 0.0
            self.tractor_state.target_unicycle_angular_velocity = 0.0
            self.right_motor.send_current_brake_command(brake_current)
            self.left_motor.send_current_brake_command(brake_current)

        else:
            self.tractor_state.target_unicycle_velocity = steering_command.velocity
            self.tractor_state.target_unicycle_angular_velocity = steering_command.angular_velocity

            left, right = self.kinematics.unicycle_to_wheel_velocity(
                self.tractor_state.target_unicycle_velocity,
                self.tractor_state.target_unicycle_angular_velocity,
            )

            self.tractor_state.commanded_brake_current = 0
            self.tractor_state.commanded_wheel_velocity_rads_left = left
            self.tractor_state.commanded_wheel_velocity_rads_right = right
            self.right_motor.send_velocity_command_rads(right)
            self.right_motor_aft.send_velocity_command_rads(right)
            self.left_motor.send_velocity_command_rads(left)
            self.left_motor_aft.send_velocity_command_rads(left)
        self.event_bus.send(make_event('tractor_state', self.tractor_state))


def main():
    logging.basicConfig(stream=sys.stdout, level=logging.INFO)
    event_loop = asyncio.get_event_loop()
    get_event_bus('farm_ng.tractor')
    controller = TractorController(event_loop)
    logger.info('Created controller %s', controller)
    event_loop.run_forever()


if __name__ == '__main__':
    main()
