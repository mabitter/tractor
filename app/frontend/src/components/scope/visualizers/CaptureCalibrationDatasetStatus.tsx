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
import {
  CaptureCalibrationDatasetResult,
  CaptureCalibrationDatasetStatus
} from "../../../../genproto/farm_ng_proto/tractor/v1/capture_calibration_dataset";
import { useFetchResource } from "../../../hooks/useFetchResource";
import { CaptureCalibrationDatasetResultElement } from "./CaptureCalibrationDatasetResult";

export const CaptureCalibrationDatasetStatusElement: React.FC<SingleElementVisualizerProps<
  CaptureCalibrationDatasetStatus
>> = (props) => {
  const {
    value: [timestamp, value],
    resources
  } = props;

  const result = useFetchResource<CaptureCalibrationDatasetResult>(
    value.result,
    resources || undefined
  );
  const { numFrames, tagIds } = value;

  return (
    <Card timestamp={timestamp} json={value}>
      <Card title="Summary">
        <KeyValueTable
          records={[
            ["Num Frames", numFrames],
            ["Tag IDs", tagIds.join(", ")]
          ]}
        />
      </Card>
      {result && (
        <Card title="Result">
          {
            <CaptureCalibrationDatasetResultElement
              value={[0, result]}
              options={[]}
              resources={resources}
            />
          }
        </Card>
      )}
    </Card>
  );
};

export class CaptureCalibrationDatasetStatusVisualizer
  implements Visualizer<CaptureCalibrationDatasetStatus> {
  static id: VisualizerId = "captureCalibrationDatasetStatus";
  types: EventTypeId[] = [
    "type.googleapis.com/farm_ng_proto.tractor.v1.CaptureCalibrationDatasetStatus"
  ];

  options: VisualizerOptionConfig[] = [
    { label: "view", options: ["overlay", "grid"] }
  ];

  component: React.FC<VisualizerProps<CaptureCalibrationDatasetStatus>> = (
    props
  ) => {
    const view = props.options[0].value as "overlay" | "grid";
    return (
      <Layout
        view={view}
        element={CaptureCalibrationDatasetStatusElement}
        {...props}
      />
    );
  };
}
