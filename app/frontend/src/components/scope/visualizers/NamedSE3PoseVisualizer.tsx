/* eslint-disable no-console */
import * as React from "react";
import { Card } from "react-bootstrap";
import styles from "./NamedSE3PoseVisualizer.module.scss";
import {
  SingleElementVisualizerProps,
  Visualizer,
  VisualizerId,
  VisualizerOptionConfig,
  VisualizerProps
} from "../../../registry/visualization";
import { formatValue } from "../../../utils/formatValue";
import { EventTypeId } from "../../../registry/events";
import { JsonPopover } from "../../JsonPopover";
import { NamedSE3Pose } from "../../../../genproto/farm_ng_proto/tractor/v1/geometry";
import { Controls } from "../../Controls";
import { Ground } from "../../Ground";
import { Lights } from "../../Lights";
import { toQuaternion, toVector3 } from "../../../utils/protoConversions";
import { Overlay } from "./Overlay";
import { Canvas } from "../../Canvas";

const NamedSE3PoseElement: React.FC<SingleElementVisualizerProps<
  NamedSE3Pose
>> = ({ value: [timestamp, value] }) => {
  return (
    <Card bg={"light"} className={[styles.card, "shadow-sm"].join(" ")}>
      <Card.Body>
        <Canvas>
          <Lights />
          <Ground transparent={true} />
          <fogExp2 args={[0xcccccc, 0.02]} />
          <Controls />
          <axesHelper
            position={toVector3(value.aPoseB?.position)}
            quaternion={toQuaternion(value.aPoseB?.rotation)}
          />
        </Canvas>
      </Card.Body>
      <Card.Footer className={styles.footer}>
        <span className="text-muted">{formatValue(new Date(timestamp))}</span>
        <JsonPopover json={value} />
      </Card.Footer>
    </Card>
  );
};

export class NamedSE3PoseVisualizer implements Visualizer<NamedSE3Pose> {
  static id: VisualizerId = "namedSE3Pose";
  types: EventTypeId[] = [
    "type.googleapis.com/farm_ng_proto.tractor.v1.NamedSE3Pose"
  ];

  options: VisualizerOptionConfig[] = [];

  component: React.FC<VisualizerProps<NamedSE3Pose>> = (props) => {
    return <Overlay element={NamedSE3PoseElement} {...props} />;
  };
}
