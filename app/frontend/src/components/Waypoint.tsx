import { useState } from "react";
import * as React from "react";
import { PointerEvent } from "react-three-fiber";
import { Vector3 } from "three";

type WaypointProps = {
  isGoal: boolean;
  onClick: (event: PointerEvent) => void;
  position: Vector3;
};

export const Waypoint: React.FC<WaypointProps> = (props) => {
  const { isGoal, position } = props;

  const [hovered, setHover] = useState(false);

  const color = isGoal ? "hotpink" : hovered ? "blue" : "gray";

  const onClick = (event: PointerEvent): void => {
    event.stopPropagation();
    props.onClick(event);
  };

  return (
    <mesh
      position={position}
      onClick={onClick}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
      rotation-x={Math.PI / 2}
    >
      <cylinderBufferGeometry attach="geometry" args={[0.2, 0.2, 0.05, 32]} />
      <meshStandardMaterial attach="material" color={color} />
    </mesh>
  );
};
