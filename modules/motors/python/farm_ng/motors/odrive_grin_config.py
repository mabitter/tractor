#!/usr/bin/env python3
"""
Example usage of the ODrive python library to monitor and control ODrive devices
Settings for the grin wheelbarrow electric geared hub motor
"""

import math
import sys
import time

import odrive
from odrive.enums import *


def setup_odrive(drive):
    print('configuring odrive global settings')
    # Set Brake Resistance (resistor attached in hardware)
    drive.config.brake_resistance = 2  # ohms
    print('setting brake resistance ' + str(drive.config.brake_resistance))

    # Set max regen current (necessary if no brake resistor, which takes precedence)
    # drive.config.max_regen_current = 60
    # To read a value, simply read the property
    print('Bus voltage is ' + str(drive.vbus_voltage) + ' volts')


def configure_motor(axis):
    # MOTOR PARAMETERS
    print('configuring axis settings')
    axis.motor.config.current_lim = 60

    # Set the motor parameters
    axis.motor.config.pole_pairs = 8
    # print("setting pole pairs " + str(axis.motor.config.pole_pairs))

    axis.motor.config.motor_type = MOTOR_TYPE_HIGH_CURRENT
    # print("setting motor type " + str(axis.motor.config.motor_type))

    # Set Velocity Limit
    # D6374 has a max rpm of around (150kv * 40v bus voltage * .8 max modulation = 4800rpm)
    # which is 80 revolutions per second.  80 * 8192cpr = 655,360 counts / second is our max velocity
    # The wheelbarrow motor maxes out around a velocity of 50 turns / sec...
    # this velocity has to do with the control loop, which we want to let rip.  lowering this causes errors
    # axis.controller.config.vel_limit = 50 #turns / sec
    # print("setting velocity limit " + str(axis.controller.config.vel_limit))

    # Motor Tuning Parameters
    # print('setting motor tuning parameters')

    '''
	Since the hall feedback only has 48 counts per revolution,
	we want to reduce the velocity tracking bandwidth to get smoother velocity estimates.
	We can also set these fairly modest gains that will be a bit sloppy but shouldn’t shake
	your rig apart if it’s built poorly.
	Make sure to tune the gains up when you have everything else working to a stiffness
	that is applicable to your application.
	Lets also start in velocity control mode since that is probably what you want for a wheeled robot.
	Note that in velocity mode pos_gain isn’t used but I have given you a recommended value anyway
	in case you wanted to run position control mode.
	'''

    # default settings provided by odrive for the hoverboard.
    axis.encoder.config.bandwidth = 100
    axis.controller.config.enable_vel_limit = True
    axis.controller.config.enable_overspeed_error = False

    # TODO | (mabitter) test if this fix is robust
    # adding this to deal with the MOTOR_ERROR_CONTROL_DEADLINE_MISSED issue happening periodically
    # https://discourse.odriverobotics.com/t/error-control-deadline-missed-dumped-on-applying-variable-load/2238/10
    axis.controller.config.vel_limit_tolerance = 0.0
    axis.controller.config.control_mode = 1  # accepts input_pos, input_vel, etc.
    axis.motor.config.requested_current_range = 100
    axis.controller.config.vel_limit = 10  # turns of the motor
    axis.controller.config.vel_ramp_rate = 1.0
    axis.controller.config.pos_gain = 7.0
    axis.controller.config.vel_gain = 0.0275
    axis.controller.config.vel_integrator_gain = 0.01


def configure_encoder(axis):
    # ENCODER / HALL EFFECT SETTINGS
    print('configuring encoder / hall-effect-sensors ')
    # For large motors, this value can be increased to overcome friction and cogging.
    axis.motor.config.calibration_current = 20.0
    # print("setting current limit for calibration " + str(axis.motor.config.calibration_current))

    # Relax the accuracy of encoder counts during calibration (assuming %??) optional, helps sometimes
    # axis.encoder.config.calib_range = 0.05

    # Max motor voltage used for measuring motor resistance.
    # For motor calibration, it must be possible for the motor current to reach
    # the calibration current without the applied voltage exceeding this config setting.
    # Hub motors are quite high resistance compared to the hobby aircraft motors,
    # so we want to use a bit higher voltage for the motor calibration,
    # and set up the current sense gain to be more sensitive.
    # The motors are also fairly high inductance, so we need to reduce the bandwidth
    # of the current controller from the default to keep it stable.

    # print('configuring calib max voltage, current range, and control bandwidth ')
    axis.motor.config.resistance_calib_max_voltage = 4
    # axis.motor.config.requested_current_range = 25
    axis.motor.config.current_control_bandwidth = 100

    # Encoder Counter Per Revolution
    # Hall-effect sensors CPR is determined by :
    # 6 states for every pole in the motor... so 6 * pole-pairs (8)
    # 6 states * 8 pholes = CPR, then with the gear ratio of 29.90972222 we are at

    # print('setting encoder mode, CPR, and index ')
    axis.encoder.config.mode = ENCODER_MODE_HALL
    axis.encoder.config.cpr = 6 * 8
    axis.encoder.config.use_index = False


def configure_startup(axis):
    # STARTUP SETTINGS
    print('configuring startup settings')
    axis.config.startup_motor_calibration = False
    axis.config.startup_encoder_index_search = False
    axis.config.startup_sensorless_control = False
    axis.config.startup_closed_loop_control = True

    # INPUT MODE
    # default mode is INPUT_MODE_PASSTHROUGH, which enables most functions.
    axis.controller.config.input_mode = 1
    axis.controller.config.control_mode = 2  # CONTROL_MODE_VELOCITY_CONTROL


def calibrate_motor(axis):
    # MOTOR CALIBRATION
    print('calibrating motor ')
    axis.requested_state = AXIS_STATE_MOTOR_CALIBRATION
    while axis.current_state != AXIS_STATE_IDLE:
        time.sleep(0.1)

    # do not recalibrate after startup
    axis.motor.config.pre_calibrated = True
    print('motor calibration finished ')


def calibrate_encoder(axis):
    # ENCODER CALIBRATION
    print('calibrating encoder ')
    axis.requested_state = AXIS_STATE_ENCODER_OFFSET_CALIBRATION

    # block until it finishes
    while axis.current_state != AXIS_STATE_IDLE:
        time.sleep(0.1)

    # print('encoder offset is ')
    # print(axis.encoder.config.offset)
    # print('encoder direction is ')
    # print(axis.motor.config.direction)

    # False if no index signal is present on encoder,
    # True if index signal present, and you don't want to recal on startup
    axis.encoder.config.pre_calibrated = True


def mirror_axis(axis0, axis1):
    print('implementing electronic mirroring')
    # make axis 0 master and axis1 slave
    axis1.controller.config.axis_to_mirror = 0
    axis1.controller.config.mirror_ratio = 1
    axis1.controller.config.input_mode = INPUT_MODE_MIRROR  # mirror mode

    # put the following axis in position control mode
    axis1.controller.config.control_mode = CONTROL_MODE_POSITION_CONTROL
    axis1.requested_state = AXIS_STATE_CLOSED_LOOP_CONTROL

    # put the master axis in velocity control mode
    axis0.controller.config.control_mode = CONTROL_MODE_VELOCITY_CONTROL
    axis0.requested_state = AXIS_STATE_CLOSED_LOOP_CONTROL


def save_configuration(drive):
    # Save Configuration
    print('saving configuration ')
    drive.save_configuration()


def configure_canbus(drive):
    # STARBOARD setup CANbus controller
    my_drive.axis0.config.can_node_id = 20
    my_drive.axis1.config.can_node_id = 21
    my_drive.can.set_baud_rate(500000)

    # PORTSIDE setup CAN controller
    my_drive.axis0.config.can_node_id = 10
    my_drive.axis1.config.can_node_id = 11
    my_drive.can.set_baud_rate(500000)


def setup_thermistor(drive):
    # Setup Motor Thermistor
    my_drive.axis0.motor_thermistor.config.enabled = True
    my_drive.axis0.motor_thermistor.config.temp_limit_lower = 32
    my_drive.axis0.motor_thermistor.config.temp_limit_upper = 120
    my_drive.axis0.motor_thermistor.config.gpio_pin = 1
    my_drive.axis0.motor_thermistor

    my_drive.axis1.motor_thermistor.config.gpio_pin = 2


'''
# # TRAJECTORY CONTROLLER SETTINGS
# # Setting Input Mode to trajectories
# print('setting input mode to trajectory controller ')
# axis.controller.config.input_mode = 5

# # Set Trajectory Planner Parameters
# print('setting trajectory controller settings ')
axis.trap_traj.config.vel_limit = 40 # RPM limited at 80 turns / sec
axis.trap_traj.config.accel_limit = 150 # tested up to 150 turns/sec
axis.trap_traj.config.decel_limit = 150 # tested up to 150

'''


###### to do list ########
# TODO | thermistor - create a voltage divider circuit solution for the 4 thermistors and integration
# TODO | wire the starboard side motors backwards to reverse the direction
# DONE | tune motors to get better holding torque (ramp gain more quickly)
# TODO | set trajectory settings
# TODO | integrate motor thermistors
# DONE | hardware adding capactitors
# DONE | after caps are installed, re-test encoders and twin / mirrored drives
# TODO | integrate CANbus communications
# TODO | switching control modes - make sure we zero out the encoders so shit doesn't go FUBAR when switching
# TODO | figure out how to manage accel and decel params in velocity mode, position mode
# TODO | investigate bug when swithing control modes that cases the drive to error out.


# CONNECT TO ODRIVE
# Find a connected ODrive (this will block until you connect one)
print('finding an odrive...')
my_drive = odrive.find_any()

# Find an ODrive that is connected on the serial port /dev/ttyUSB0
# my_drive = odrive.find_any("serial:/dev/ttyUSB0")

# CONFIGURE ODRIVE & AXES

setup_odrive(my_drive)

configure_startup(my_drive.axis0)
configure_motor(my_drive.axis0)
configure_encoder(my_drive.axis0)
calibrate_motor(my_drive.axis0)
calibrate_encoder(my_drive.axis0)

configure_startup(my_drive.axis1)
configure_motor(my_drive.axis1)
configure_encoder(my_drive.axis1)
calibrate_motor(my_drive.axis1)
calibrate_encoder(my_drive.axis1)

# mirror_axis(my_drive.axis0, my_drive.axis1)

save_configuration(my_drive)
print('saving configuration & exiting')


print('if motor did not go both directions during calibration, run the script again')
sys.exit()

# CONNECT TO ODRIVE
# Find a connected ODrive (this will block until you connect one)
print('finding an odrive...')
my_drive = odrive.find_any()

# Find an ODrive that is connected on the serial port /dev/ttyUSB0
#my_drive = odrive.find_any("serial:/dev/ttyUSB0")