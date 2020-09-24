import * as React from "react";
import { Card, ListGroup } from "react-bootstrap";
import styles from "./JSONVisualizer.module.scss";
import {
  SingleElementVisualizerProps,
  Visualizer,
  VisualizerId,
  VisualizerOptionConfig,
  VisualizerProps
} from "../../../registry/visualization";
import { EventType } from "../../../registry/events";
import { formatValue } from "../../../utils/formatValue";
import { Layout } from "./Layout";

const JSONElement: React.FC<SingleElementVisualizerProps> = ({
  value: [timestamp, value]
}) => {
  return (
    <Card bg={"light"} className={[styles.card, "shadow-sm"].join(" ")}>
      <Card.Body>
        <ListGroup horizontal>
          <ListGroup.Item>
            <pre>{JSON.stringify(value, null, 2)}</pre>
          </ListGroup.Item>
        </ListGroup>
      </Card.Body>
      <Card.Footer className={styles.footer}>
        <span className="text-muted">{formatValue(new Date(timestamp))}</span>
      </Card.Footer>
    </Card>
  );
};

export class JSONVisualizer implements Visualizer {
  static id: VisualizerId = "json";
  types = "*" as const;

  options: VisualizerOptionConfig[] = [
    { label: "view", options: ["overlay", "grid"] }
  ];

  component: React.FC<VisualizerProps<EventType>> = (props) => {
    const viewOption = props.options[0].value as "overlay" | "grid";
    return <Layout view={viewOption} element={JSONElement} {...props} />;
  };
}
