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
import { CalibrateBaseToCameraResult } from "../../../../genproto/farm_ng_proto/tractor/v1/calibrate_base_to_camera";
import { CalibrateBaseToCameraConfigurationElement } from "./CalibrateBaseToCameraConfiguration";
import {
  BaseToCameraModel,
  solverStatusToJSON
} from "../../../../genproto/farm_ng_proto/tractor/v1/calibrator";
import { useFetchResource } from "../../../hooks/useFetchResource";
import { BaseToCameraModelElement } from "./BaseToCameraModel";

export const CalibrateBaseToCameraResultElement: React.FC<SingleElementVisualizerProps<
  CalibrateBaseToCameraResult
>> = (props) => {
  const {
    value: [timestamp, value],
    resources
  } = props;

  const initial = useFetchResource<BaseToCameraModel>(
    value.baseToCameraModelInitial,
    resources || undefined
  );
  const solved = useFetchResource<BaseToCameraModel>(
    value.baseToCameraModelSolved,
    resources || undefined
  );

  const { configuration, solverStatus, rmse, stampEnd, eventLog } = value;

  return (
    <Card timestamp={timestamp} json={value}>
      <Card title="Summary">
        <KeyValueTable
          records={[
            ["Solver Status", solverStatus && solverStatusToJSON(solverStatus)],
            ["Total RMSE", rmse],
            ["Stamp End", stampEnd],
            ["Event Log URL", eventLog?.path]
          ]}
        />
      </Card>
      {configuration && (
        <Card title="Configuration">
          {
            <CalibrateBaseToCameraConfigurationElement
              value={[0, configuration]}
              options={[]}
              resources={resources}
            />
          }
        </Card>
      )}
      {initial && (
        <Card title="Initial">
          <BaseToCameraModelElement
            value={[0, initial]}
            options={[]}
            resources={resources}
          />
        </Card>
      )}
      {solved && (
        <Card title="Solved">
          <BaseToCameraModelElement
            value={[0, solved]}
            options={[]}
            resources={resources}
          />
        </Card>
      )}
    </Card>
  );
};

export class CalibrateBaseToCameraResultVisualizer
  implements Visualizer<CalibrateBaseToCameraResult> {
  static id: VisualizerId = "calibrateBaseToCameraResult";
  types: EventTypeId[] = [
    "type.googleapis.com/farm_ng_proto.tractor.v1.CalibrateBaseToCameraResult"
  ];

  options: VisualizerOptionConfig[] = [
    { label: "view", options: ["overlay", "grid"] }
  ];

  component: React.FC<VisualizerProps<CalibrateBaseToCameraResult>> = (
    props
  ) => {
    const view = props.options[0].value as "overlay" | "grid";
    return (
      <Layout
        view={view}
        element={CalibrateBaseToCameraResultElement}
        {...props}
      />
    );
  };
}
