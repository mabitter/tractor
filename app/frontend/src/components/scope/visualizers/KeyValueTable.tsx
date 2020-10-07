import * as React from "react";
import { Table } from "react-bootstrap";
import { formatValue } from "../../../utils/formatValue";

interface IProps {
  records: [string, unknown][];
}

export const KeyValueTable: React.FC<IProps> = ({ records }) => {
  return (
    <Table bordered size="sm" responsive="md">
      <tbody>
        {records.map(([key, value]) => (
          <tr key={key}>
            <td>{key}</td>
            <td>{formatValue(value)}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
