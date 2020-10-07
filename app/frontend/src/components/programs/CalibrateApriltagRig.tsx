/* eslint-disable no-console */
import { useObserver } from "mobx-react-lite";
import * as React from "react";
import { useEffect, useState } from "react";
import { useStores } from "../../hooks/useStores";
import { ProgramUI, ProgramId } from "../../registry/programs";
import { ProgramLogVisualizer } from "./ProgramLogVisualizer";
import commonStyles from "./common.module.scss";
import { Button, Collapse, Form } from "react-bootstrap";
import { ProgramForm } from "./ProgramForm";
import {
  CalibrateApriltagRigConfiguration as Configuration,
  CalibrateApriltagRigStatus as Status
} from "../../../genproto/farm_ng_proto/tractor/v1/calibrate_apriltag_rig";
import { Resource } from "../../../genproto/farm_ng_proto/tractor/v1/resource";

const programId = "calibrate_apriltag_rig";

const Component: React.FC = () => {
  const { programsStore: store } = useStores();
  useEffect(() => {
    store.eventLogPredicate = (e) => e.name.startsWith(`${programId}/`);
    return () => store.resetEventLog();
  }, []);

  const [configuration, setConfiguration] = useState<Configuration | null>(
    null
  );

  const handleConfigurationChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setConfiguration({
      ...(configuration || {}),
      [e.target.name]: e.target.value
    } as Configuration);
  };

  // TODO: Replace this with a resource browser
  const handleResourcePathChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setConfiguration({
      ...(configuration || {}),
      calibrationDataset: Resource.fromJSON({
        path: e.target.value,
        contentType:
          "application/json; type=type.googleapis.com/farm_ng_proto.tractor.v1.CaptureCalibrationDatasetResult"
      })
    } as Configuration);
  };

  const handleConfigurationSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ): void => {
    e.preventDefault();
    store.busClient.send(
      "type.googleapis.com/farm_ng_proto.tractor.v1.CalibrateApriltagRigConfiguration",
      `${programId}/configure`,
      Configuration.encode(Configuration.fromJSON(configuration)).finish()
    );
  };

  return useObserver(() => {
    const requestedConfiguration =
      store.runningProgram &&
      store.latestEvent &&
      store.latestEvent.name.startsWith(`${programId}/status`) &&
      store.latestEvent.typeUrl.endsWith("CalibrateApriltagRigStatus")
        ? (store.latestEvent.event as Status).inputRequiredConfiguration
        : null;

    if (requestedConfiguration && !configuration) {
      setConfiguration(requestedConfiguration);
    }

    return (
      <div className={commonStyles.programDetail}>
        <Collapse in={Boolean(requestedConfiguration)}>
          <div>
            <ProgramForm>
              <Form onSubmit={handleConfigurationSubmit}>
                <Form.Group controlId="resourcePath">
                  <Form.Label>ResourcePath</Form.Label>
                  <Form.Control
                    type="text"
                    name="resource"
                    value={configuration?.calibrationDataset?.path || ""}
                    onChange={handleResourcePathChange}
                  />
                </Form.Group>

                <Form.Group controlId="tagIds">
                  <Form.Label>Tag IDs</Form.Label>
                  <Form.Control
                    type="text"
                    name="tagIds"
                    // TODO: Make this a controlled form element, with better UI
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const tagIds = (e.target.value || "")
                        .split(",")
                        .map((_) => parseInt(_.trim()));
                      setConfiguration(
                        (c) => ({ ...c, tagIds } as Configuration)
                      );
                    }}
                  />
                </Form.Group>

                <Form.Group controlId="rootTagId">
                  <Form.Label>Root Tag ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="rootTagId"
                    value={configuration?.rootTagId || ""}
                    onChange={handleConfigurationChange}
                  />
                </Form.Group>

                <Form.Group controlId="name">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={configuration?.name || ""}
                    onChange={handleConfigurationChange}
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </Form>
            </ProgramForm>
          </div>
        </Collapse>

        <ProgramLogVisualizer
          eventLog={store.eventLog}
          selectedEntry={store.selectedEntry}
          onSelectEntry={(e) => (store.selectedEntry = e)}
          visualizer={store.visualizer?.component || null}
          resources={store.resourceArchive}
        />
      </div>
    );
  });
};

export class CalibrateApriltagRig implements ProgramUI {
  static id: ProgramId = programId;
  programIds = [programId, `${programId}-playback`] as const;
  component = Component;
}
