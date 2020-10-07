import * as React from "react";
import { BaseToCameraInitialization } from "../../../../genproto/farm_ng_proto/tractor/v1/calibrator";
import { CalibrationParameterTable } from "./CalibrationParameterTable";
import { Card } from "./Card";
import { ViewInitializationTable } from "./ViewInitializationTable";

interface IProps {
  value: BaseToCameraInitialization;
}

export const BaseToCameraInitializationTable: React.FC<IProps> = ({
  value
}) => {
  const { wheelBaseline, wheelRadius, basePoseCamera } = value;
  return (
    <>
      {basePoseCamera && (
        <Card title="base_pose_camera Initialization">
          <ViewInitializationTable view={basePoseCamera} />
        </Card>
      )}
      {wheelBaseline && wheelRadius && (
        <Card title="Other Calibration Parameters">
          <CalibrationParameterTable
            labels={["Wheel Baseline", "Wheel Radius"]}
            parameters={[wheelBaseline, wheelRadius]}
          />
        </Card>
      )}
    </>
  );
};
