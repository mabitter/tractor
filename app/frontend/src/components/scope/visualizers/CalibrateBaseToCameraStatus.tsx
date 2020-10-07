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
import { useFetchResource } from "../../../hooks/useFetchResource";
import { Card } from "./Card";
import {
  CalibrateBaseToCameraResult,
  CalibrateBaseToCameraStatus
} from "../../../../genproto/farm_ng_proto/tractor/v1/calibrate_base_to_camera";
import { CalibrateBaseToCameraResultElement } from "./CalibrateBaseToCameraResult";

const CalibrateBaseToCameraStatusElement: React.FC<SingleElementVisualizerProps<
  CalibrateBaseToCameraStatus
>> = (props) => {
  const {
    value: [timestamp, value],
    resources
  } = props;

  const result = useFetchResource<CalibrateBaseToCameraResult>(
    value.result,
    resources || undefined
  );

  return (
    result && (
      <Card timestamp={timestamp} json={value}>
        <CalibrateBaseToCameraResultElement
          value={[0, result]}
          options={[]}
          resources={resources}
        />
      </Card>
    )
  );
};

export class CalibrateBaseToCameraStatusVisualizer
  implements Visualizer<CalibrateBaseToCameraStatus> {
  static id: VisualizerId = "calibrateBaseToCameraStatus";
  types: EventTypeId[] = [
    "type.googleapis.com/farm_ng_proto.tractor.v1.CalibrateBaseToCameraStatus"
  ];

  options: VisualizerOptionConfig[] = [
    { label: "view", options: ["overlay", "grid"] }
  ];

  component: React.FC<VisualizerProps<CalibrateBaseToCameraStatus>> = (
    props
  ) => {
    const view = props.options[0].value as "overlay" | "grid";
    return (
      <Layout
        view={view}
        element={CalibrateBaseToCameraStatusElement}
        {...props}
      />
    );
  };
}
