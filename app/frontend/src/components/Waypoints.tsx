import { useState } from "react";
import * as React from "react";
import { Waypoint } from "./Waypoint";
import { webSocketClient } from "../config";
import { Vector3 } from "three";

type WaypointsProps = {
  waypoints: Vector3[];
};

export const Waypoints: React.FC<WaypointsProps> = ({ waypoints }) => {
  const [goal, setGoal] = useState<number | null>(null);

  const selectGoal = (index: number): void => {
    setGoal(goal === index ? null : index);
    webSocketClient.send({ waypoint: waypoints[index].toArray() });
  };

  const waypointObjects = waypoints.map((waypoint, index) => (
    <Waypoint
      key={index}
      position={waypoint}
      isGoal={goal === index}
      onClick={(_) => selectGoal(index)}
    />
  ));

  return <group>{waypointObjects}</group>;
};
