/* eslint-disable no-console */
import * as React from "react";
import {
  SingleElementVisualizerProps,
  Visualizer,
  VisualizerId,
  VisualizerOptionConfig,
  VisualizerProps
} from "../../../registry/visualization";
import { EventTypeId } from "../../../registry/events";
import { Layout } from "./Layout";
import { KeyValueTable } from "./KeyValueTable";
import { Card } from "./Card";
import { CaptureCalibrationDatasetConfiguration } from "../../../../genproto/farm_ng_proto/tractor/v1/capture_calibration_dataset";

export const CaptureCalibrationDatasetConfigurationElement: React.FC<SingleElementVisualizerProps<
  CaptureCalibrationDatasetConfiguration
>> = (props) => {
  const {
    value: [timestamp, value]
  } = props;

  const { numFrames, name } = value;

  return (
    <Card timestamp={timestamp} json={value}>
      <Card title="Summary">
        <KeyValueTable
          records={[
            ["Num Frames", numFrames],
            ["Name", name]
          ]}
        />
      </Card>
    </Card>
  );
};

export class CaptureCalibrationDatasetConfigurationVisualizer
  implements Visualizer<CaptureCalibrationDatasetConfiguration> {
  static id: VisualizerId = "captureCalibrationDatasetConfiguration";
  types: EventTypeId[] = [
    "type.googleapis.com/farm_ng_proto.tractor.v1.CaptureCalibrationDatasetConfiguration"
  ];

  options: VisualizerOptionConfig[] = [
    { label: "view", options: ["overlay", "grid"] }
  ];

  component: React.FC<
    VisualizerProps<CaptureCalibrationDatasetConfiguration>
  > = (props) => {
    const view = props.options[0].value as "overlay" | "grid";
    return (
      <Layout
        view={view}
        element={CaptureCalibrationDatasetConfigurationElement}
        {...props}
      />
    );
  };
}
