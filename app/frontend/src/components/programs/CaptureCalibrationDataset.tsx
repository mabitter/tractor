import * as React from "react";

import { ProgramUI, ProgramId } from "../../registry/programs";
import { useStores } from "../../hooks/useStores";
import { useObserver } from "mobx-react-lite";
import commonStyles from "./common.module.scss";
import { useEffect, useState } from "react";
import { Button, Collapse, Form } from "react-bootstrap";
import {
  CaptureCalibrationDatasetConfiguration as Configuration,
  CaptureCalibrationDatasetStatus as Status
} from "../../../genproto/farm_ng_proto/tractor/v1/capture_calibration_dataset";
import { ProgramLogVisualizer } from "./ProgramLogVisualizer";
import { ProgramForm } from "./ProgramForm";

const programId = "capture_calibration_dataset";

const Component: React.FC = () => {
  const { programsStore: store } = useStores();
  useEffect(() => {
    store.eventLogPredicate = (e) =>
      e.name.startsWith(`${programId}/`) || e.name.startsWith("calibrator/");
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

  const handleConfigurationSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ): void => {
    e.preventDefault();
    store.busClient.send(
      "type.googleapis.com/farm_ng_proto.tractor.v1.CaptureCalibrationDatasetConfiguration",
      `${programId}/configure`,
      Configuration.encode(Configuration.fromJSON(configuration)).finish()
    );
  };

  return useObserver(() => {
    const requestedConfiguration =
      store.runningProgram &&
      store.latestEvent &&
      store.latestEvent.name.startsWith(`${programId}/status`) &&
      store.latestEvent.typeUrl.endsWith("CaptureCalibrationDatasetStatus")
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
                <Form.Group controlId="numFrames">
                  <Form.Label>Number of Frames</Form.Label>
                  <Form.Control
                    type="number"
                    name="numFrames"
                    value={configuration?.numFrames || 0}
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
                  <Form.Text className="text-muted">
                    A name for the dataset, used to name the output archive.
                  </Form.Text>
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

export class CaptureCalibrationDataset implements ProgramUI {
  static id: ProgramId = programId;
  programIds = [programId] as const;
  component = Component;
}
