import * as React from "react";
import { Alert } from "react-bootstrap";
import styles from "./ProgramForm.module.scss";

export const ProgramForm: React.FC = (props) => {
  return (
    <div className={styles.programForm}>
      <Alert variant="warning">User Input Requested</Alert>
      {props.children}
    </div>
  );
};
