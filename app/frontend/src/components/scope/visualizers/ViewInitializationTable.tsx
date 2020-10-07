import * as React from "react";
import {
  viewDirectionToJSON,
  ViewInitialization
} from "../../../../genproto/farm_ng_proto/tractor/v1/calibrator";
import { CalibrationParameterTable } from "./CalibrationParameterTable";
import { KeyValueTable } from "./KeyValueTable";

interface IProps {
  view: ViewInitialization;
}

export const ViewInitializationTable: React.FC<IProps> = ({ view }) => {
  const { x, y, z } = view;
  return (
    <>
      {x && y && z && (
        <CalibrationParameterTable
          labels={["x", "y", "z"]}
          parameters={[x, y, z]}
        />
      )}
      <KeyValueTable
        records={[["Direction", viewDirectionToJSON(view.viewDirection)]]}
      />
    </>
  );
};
