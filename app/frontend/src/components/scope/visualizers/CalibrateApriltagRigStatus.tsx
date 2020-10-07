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
import {
  CalibrateApriltagRigResult,
  CalibrateApriltagRigStatus
} from "../../../../genproto/farm_ng_proto/tractor/v1/calibrate_apriltag_rig";
import { useFetchResource } from "../../../hooks/useFetchResource";
import { Card } from "./Card";
import { CalibrateApriltagRigResultElement } from "./CalibrateApriltagRigResult";

const CalibrateApriltagRigStatusElement: React.FC<SingleElementVisualizerProps<
  CalibrateApriltagRigStatus
>> = (props) => {
  const {
    value: [timestamp, value],
    resources
  } = props;

  const result = useFetchResource<CalibrateApriltagRigResult>(
    value.result,
    resources || undefined
  );

  return (
    result && (
      <Card timestamp={timestamp} json={value}>
        <CalibrateApriltagRigResultElement
          value={[0, result]}
          options={[]}
          resources={resources}
        />
      </Card>
    )
  );
};

export class CalibrateApriltagRigStatusVisualizer
  implements Visualizer<CalibrateApriltagRigStatus> {
  static id: VisualizerId = "calibrateApriltagRigStatus";
  types: EventTypeId[] = [
    "type.googleapis.com/farm_ng_proto.tractor.v1.CalibrateApriltagRigStatus"
  ];

  options: VisualizerOptionConfig[] = [
    { label: "view", options: ["overlay", "grid"] }
  ];

  component: React.FC<VisualizerProps<CalibrateApriltagRigStatus>> = (
    props
  ) => {
    const view = props.options[0].value as "overlay" | "grid";
    return (
      <Layout
        view={view}
        element={CalibrateApriltagRigStatusElement}
        {...props}
      />
    );
  };
}
