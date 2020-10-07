/* eslint-disable no-console */
import { useObserver } from "mobx-react-lite";
import * as React from "react";
import { useEffect, useState } from "react";
import { useStores } from "../../hooks/useStores";
import { ProgramUI, ProgramId } from "../../registry/programs";
import { ProgramLogVisualizer } from "./ProgramLogVisualizer";
import commonStyles from "./common.module.scss";
import { Button, Col, Collapse, Form } from "react-bootstrap";
import { ProgramForm } from "./ProgramForm";
import {
  CalibrateBaseToCameraConfiguration as Configuration,
  CalibrateBaseToCameraStatus as Status
} from "../../../genproto/farm_ng_proto/tractor/v1/calibrate_base_to_camera";
import { Resource } from "../../../genproto/farm_ng_proto/tractor/v1/resource";
import {
  CalibrationParameter,
  ViewDirection,
  viewDirectionToJSON
} from "../../../genproto/farm_ng_proto/tractor/v1/calibrator";
import { enumNumericKeys } from "../../utils/enum";
import { toJS } from "mobx";

const programId = "calibrate_base_to_camera";

interface ICalibrationParameterFormSectionProps {
  parameter: CalibrationParameter;
  name: string;
  label: string;
  onChange: (p: CalibrationParameter) => void;
}

const CalibrationParameterFormSection: React.FC<ICalibrationParameterFormSectionProps> = ({
  parameter,
  name,
  label,
  onChange
}) => {
  return (
    <Form.Row>
      <Col>
        <Form.Group controlId={name}>
          <Form.Label>{label}</Form.Label>
          <Form.Control
            type="number"
            step="any"
            name={name}
            value={parameter.value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onChange({ ...parameter, value: parseFloat(e.target.value) || 0 })
            }
          />
        </Form.Group>
      </Col>
      <Col>
        <Form.Group controlId={`${name}Constant`}>
          <Form.Label>Constant?</Form.Label>
          <Form.Control
            type="checkbox"
            name={`${name}Constant`}
            checked={parameter.constant}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onChange({ ...parameter, constant: Boolean(e.target.checked) })
            }
          />
        </Form.Group>
      </Col>
    </Form.Row>
  );
};

const Component: React.FC = () => {
  const { programsStore: store } = useStores();
  useEffect(() => {
    store.eventLogPredicate = (e) => e.name.startsWith(`${programId}/`);
    return () => store.resetEventLog();
  }, []);

  const [configuration, setConfiguration] = useState<Configuration | null>(
    null
  );

  const handleConfigurationSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ): void => {
    e.preventDefault();
    store.busClient.send(
      "type.googleapis.com/farm_ng_proto.tractor.v1.CalibrateBaseToCameraConfiguration",
      `${programId}/configure`,
      Configuration.encode(
        Configuration.fromPartial(configuration || {})
      ).finish()
    );
  };

  const configurationForm = (
    <Collapse in={Boolean(configuration)}>
      <div>
        <ProgramForm>
          <Form onSubmit={handleConfigurationSubmit}>
            <Form.Group controlId="calibrationDataset">
              <Form.Label>Calibration Dataset</Form.Label>
              <Form.Control
                type="text"
                name="calibrationDataset"
                value={configuration?.calibrationDataset?.path || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                  const path = e.target.value;
                  setConfiguration(
                    (c) =>
                      ({
                        ...c,
                        calibrationDataset: {
                          path,
                          contentType:
                            "application/json; type=type.googleapis.com/farm_ng_proto.tractor.v1.CaptureCalibrationDatasetResult"
                        }
                      } as Configuration)
                  );
                }}
              />
            </Form.Group>

            <Form.Group controlId="apriltagRigResult">
              <Form.Label>Apriltag Rig Result</Form.Label>
              <Form.Control
                type="text"
                name="apriltagRigResult"
                value={configuration?.apriltagRigResult?.path || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                  const path = e.target.value;
                  setConfiguration(
                    (c) =>
                      ({
                        ...c,
                        apriltagRigResult: Resource.fromPartial({
                          path: path,
                          contentType:
                            "application/json; type=type.googleapis.com/farm_ng_proto.tractor.v1.CalibrateApriltagRigResult"
                        })
                      } as Configuration)
                  );
                }}
              />
            </Form.Group>

            {configuration?.initialization?.wheelBaseline && (
              <CalibrationParameterFormSection
                name="wheelBaseline"
                label="Wheel Baseline"
                parameter={configuration.initialization.wheelBaseline}
                onChange={(p) => {
                  setConfiguration(
                    (c) =>
                      ({
                        ...c,
                        initialization: {
                          ...c?.initialization,
                          wheelBaseline: p
                        }
                      } as Configuration)
                  );
                }}
              />
            )}

            {configuration?.initialization?.wheelRadius && (
              <CalibrationParameterFormSection
                name="wheelRadius"
                label="Wheel Radius"
                parameter={configuration.initialization.wheelRadius}
                onChange={(p) => {
                  setConfiguration(
                    (c) =>
                      ({
                        ...c,
                        initialization: { ...c?.initialization, wheelRadius: p }
                      } as Configuration)
                  );
                }}
              />
            )}

            {configuration?.initialization?.basePoseCamera?.x && (
              <CalibrationParameterFormSection
                name="basePoseCameraInitializationX"
                label="Initial base_pose_camera X"
                parameter={configuration.initialization.basePoseCamera.x}
                onChange={(p) => {
                  setConfiguration(
                    (c) =>
                      ({
                        ...c,
                        initialization: {
                          ...c?.initialization,
                          basePoseCamera: {
                            ...c?.initialization?.basePoseCamera,
                            x: p
                          }
                        }
                      } as Configuration)
                  );
                }}
              />
            )}

            {configuration?.initialization?.basePoseCamera?.y && (
              <CalibrationParameterFormSection
                name="basePoseCameraInitializationY"
                label="Initial base_pose_camera Y"
                parameter={configuration.initialization.basePoseCamera.y}
                onChange={(p) => {
                  setConfiguration(
                    (c) =>
                      ({
                        ...c,
                        initialization: {
                          ...c?.initialization,
                          basePoseCamera: {
                            ...c?.initialization?.basePoseCamera,
                            y: p
                          }
                        }
                      } as Configuration)
                  );
                }}
              />
            )}

            {configuration?.initialization?.basePoseCamera?.z && (
              <CalibrationParameterFormSection
                name="basePoseCameraInitializationZ"
                label="Initial base_pose_camera Z"
                parameter={configuration.initialization.basePoseCamera.z}
                onChange={(p) => {
                  setConfiguration(
                    (c) =>
                      ({
                        ...c,
                        initialization: {
                          ...c?.initialization,
                          basePoseCamera: {
                            ...c?.initialization?.basePoseCamera,
                            z: p
                          }
                        }
                      } as Configuration)
                  );
                }}
              />
            )}

            <Form.Group controlId="basePoseCameraInitializationViewDirection">
              <Form.Label>Initial base_pose_camera View Direction</Form.Label>
              <Form.Control
                as="select"
                value={
                  configuration?.initialization?.basePoseCamera?.viewDirection
                }
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  const viewDirection = parseInt(e.target.value);
                  setConfiguration(
                    (c) =>
                      ({
                        ...c,
                        initialization: {
                          ...c?.initialization,
                          basePoseCamera: {
                            ...c?.initialization?.basePoseCamera,
                            viewDirection
                          }
                        }
                      } as Configuration)
                  );
                }}
              >
                {enumNumericKeys(ViewDirection)
                  .filter((k) => k > 0)
                  .map((k) => {
                    return (
                      <option key={k} value={k}>
                        {viewDirectionToJSON(k)}
                      </option>
                    );
                  })}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={configuration?.name || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const name = e.target.value || "";
                  setConfiguration((c) => ({ ...c, name } as Configuration));
                }}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </ProgramForm>
      </div>
    </Collapse>
  );

  return useObserver(() => {
    const requestedConfiguration =
      store.runningProgram &&
      store.latestEvent &&
      store.latestEvent.name.startsWith(`${programId}/status`) &&
      store.latestEvent.typeUrl.endsWith("CalibrateBaseToCameraStatus")
        ? (store.latestEvent.event as Status).inputRequiredConfiguration
        : null;

    if (requestedConfiguration && !configuration) {
      setConfiguration(toJS(requestedConfiguration));
    }

    return (
      <div className={commonStyles.programDetail}>
        {configurationForm}
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

export class CalibrateBaseToCamera implements ProgramUI {
  static id: ProgramId = programId;
  programIds = [programId] as const;
  component = Component;
}
