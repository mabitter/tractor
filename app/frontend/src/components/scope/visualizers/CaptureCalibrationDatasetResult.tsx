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
import { CaptureCalibrationDatasetResult } from "../../../../genproto/farm_ng_proto/tractor/v1/capture_calibration_dataset";
import { CaptureCalibrationDatasetConfigurationElement } from "./CaptureCalibrationDatasetConfiguration";

export const CaptureCalibrationDatasetResultElement: React.FC<SingleElementVisualizerProps<
  CaptureCalibrationDatasetResult
>> = (props) => {
  const {
    value: [timestamp, value],
    resources
  } = props;

  const { configuration, numFrames, tagIds, stampEnd, dataset } = value;

  return (
    <Card timestamp={timestamp} json={value}>
      <Card title="Summary">
        <KeyValueTable
          records={[
            ["Num Frames", numFrames],
            ["Tag IDs", tagIds.join(", ")],
            ["Stamp End", stampEnd],
            ["Dataset URL", dataset?.path]
          ]}
        />
      </Card>
      {configuration && (
        <Card title="Configuration">
          {
            <CaptureCalibrationDatasetConfigurationElement
              value={[0, configuration]}
              options={[]}
              resources={resources}
            />
          }
        </Card>
      )}
    </Card>
  );
};

export class CaptureCalibrationDatasetResultVisualizer
  implements Visualizer<CaptureCalibrationDatasetResult> {
  static id: VisualizerId = "captureCalibrationDatasetResult";
  types: EventTypeId[] = [
    "type.googleapis.com/farm_ng_proto.tractor.v1.CaptureCalibrationDatasetResult"
  ];

  options: VisualizerOptionConfig[] = [
    { label: "view", options: ["overlay", "grid"] }
  ];

  component: React.FC<VisualizerProps<CaptureCalibrationDatasetResult>> = (
    props
  ) => {
    const view = props.options[0].value as "overlay" | "grid";
    return (
      <Layout
        view={view}
        element={CaptureCalibrationDatasetResultElement}
        {...props}
      />
    );
  };
}
