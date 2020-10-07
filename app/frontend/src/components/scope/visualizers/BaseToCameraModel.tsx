/* eslint-disable no-console */
import * as React from "react";
import {
  SingleElementVisualizerProps,
  Visualizer,
  VisualizerId,
  VisualizerOptionConfig,
  VisualizerProps
} from "../../../registry/visualization";
import {
  BaseToCameraModel,
  solverStatusToJSON
} from "../../../../genproto/farm_ng_proto/tractor/v1/calibrator";
import { Layout } from "./Layout";
import { Card } from "./Card";
import { KeyValueTable } from "./KeyValueTable";
import { EventTypeId } from "../../../registry/events";
import { BaseToCameraInitializationTable } from "./BaseToCameraInitializationTable";

export const BaseToCameraModelElement: React.FC<SingleElementVisualizerProps<
  BaseToCameraModel
>> = (props) => {
  const {
    value: [timestamp, value]
  } = props;

  const {
    solverStatus,
    rmse,
    wheelBaseline,
    wheelRadius,
    basePoseCamera,
    // samples,
    initialization
  } = value;

  return (
    <Card timestamp={timestamp} json={value}>
      <Card title="Summary">
        <KeyValueTable
          records={[
            ["Solver Status", solverStatus && solverStatusToJSON(solverStatus)],
            ["Total RMSE", rmse],
            ["Wheel Baseline", wheelBaseline],
            ["Wheel Radius", wheelRadius],
            ["base_pose_camera.x", basePoseCamera?.aPoseB?.position?.x],
            ["base_pose_camera.y", basePoseCamera?.aPoseB?.position?.y],
            ["base_pose_camera.z", basePoseCamera?.aPoseB?.position?.z]
          ]}
        />
      </Card>
      {initialization && (
        <Card title="Initialization">
          <BaseToCameraInitializationTable value={initialization} />
        </Card>
      )}
    </Card>
  );
};

export class BaseToCameraModelVisualizer
  implements Visualizer<BaseToCameraModel> {
  static id: VisualizerId = "baseToCameraModel";
  types: EventTypeId[] = [
    "type.googleapis.com/farm_ng_proto.tractor.v1.BaseToCameraModel"
  ];

  options: VisualizerOptionConfig[] = [
    { label: "view", options: ["overlay", "grid"] }
  ];

  component: React.FC<VisualizerProps<BaseToCameraModel>> = (props) => {
    const view = props.options[0].value as "overlay" | "grid";
    return <Layout view={view} element={BaseToCameraModelElement} {...props} />;
  };
}
