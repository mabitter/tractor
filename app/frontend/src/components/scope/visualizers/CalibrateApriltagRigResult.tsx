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
import { CalibrateApriltagRigResult } from "../../../../genproto/farm_ng_proto/tractor/v1/calibrate_apriltag_rig";
import { MonocularApriltagRigModelElement } from "./MonocularApriltagRigModel";
import {
  MonocularApriltagRigModel,
  solverStatusToJSON
} from "../../../../genproto/farm_ng_proto/tractor/v1/calibrator";
import { useFetchResource } from "../../../hooks/useFetchResource";
import { KeyValueTable } from "./KeyValueTable";
import { Card } from "./Card";
import { CalibrateApriltagRigConfigurationElement } from "./CalibrateApriltagRigConfiguration";

export const CalibrateApriltagRigResultElement: React.FC<SingleElementVisualizerProps<
  CalibrateApriltagRigResult
>> = (props) => {
  const {
    value: [timestamp, value],
    resources
  } = props;

  const initial = useFetchResource<MonocularApriltagRigModel>(
    value.monocularApriltagRigInitial,
    resources || undefined
  );
  const solved = useFetchResource<MonocularApriltagRigModel>(
    value.monocularApriltagRigSolved,
    resources || undefined
  );

  const { configuration, solverStatus, rmse, stampEnd } = value || {};
  return (
    <Card timestamp={timestamp} json={value}>
      <Card title="Summary">
        <KeyValueTable
          records={[
            ["Solver Status", solverStatus && solverStatusToJSON(solverStatus)],
            ["Total RMSE", rmse],
            ["Stamp End", stampEnd]
          ]}
        />
      </Card>
      {configuration && (
        <Card title="Configuration">
          <CalibrateApriltagRigConfigurationElement
            value={[0, configuration]}
            options={[]}
            resources={resources}
          />
        </Card>
      )}
      {initial && (
        <Card title="Initial">
          <MonocularApriltagRigModelElement
            value={[0, initial]}
            options={[]}
            resources={resources}
          />
        </Card>
      )}
      {solved && (
        <Card title="Solved">
          <MonocularApriltagRigModelElement
            value={[0, solved]}
            options={[]}
            resources={resources}
          />
        </Card>
      )}
    </Card>
  );
};

export class CalibrateApriltagRigResultVisualizer
  implements Visualizer<CalibrateApriltagRigResult> {
  static id: VisualizerId = "calibrateApriltagRigResult";
  types: EventTypeId[] = [
    "type.googleapis.com/farm_ng_proto.tractor.v1.CalibrateApriltagRigResult"
  ];

  options: VisualizerOptionConfig[] = [
    { label: "view", options: ["overlay", "grid"] }
  ];

  component: React.FC<VisualizerProps<CalibrateApriltagRigResult>> = (
    props
  ) => {
    const view = props.options[0].value as "overlay" | "grid";
    return (
      <Layout
        view={view}
        element={CalibrateApriltagRigResultElement}
        {...props}
      />
    );
  };
}
