/* eslint-disable no-console */
import * as React from "react";
import { Card, ListGroup } from "react-bootstrap";
import {
  SingleElementVisualizerProps,
  Visualizer,
  VisualizerId,
  VisualizerOptionConfig,
  VisualizerProps
} from "../../../registry/visualization";
import { Image } from "../../../../genproto/farm_ng_proto/tractor/v1/image";
import { formatValue } from "../../../utils/formatValue";
import { EventTypeId } from "../../../registry/events";
import { useEffect, useState } from "react";
import { Layout } from "./Layout";

const ImageElement: React.FC<SingleElementVisualizerProps<Image>> = ({
  value: [timestamp, value],
  resources
}) => {
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async (): Promise<void> => {
      const resource = value.resource;
      if (resources && resource) {
        try {
          setImgSrc(await resources.getDataUrl(resource.path));
        } catch (e) {
          console.error(`Error loading resource ${resource.path}: ${e}`);
        }
      }
    };
    fetchImage();
  }, [value, resources]);

  return (
    <Card bg={"light"} className={"shadow-sm"}>
      <Card.Body>
        <ListGroup>
          <ListGroup.Item>
            <img src={imgSrc || undefined} />
          </ListGroup.Item>
          <ListGroup.Item>{formatValue(new Date(timestamp))}</ListGroup.Item>
          <ListGroup.Item>{JSON.stringify(value)}</ListGroup.Item>
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

export class ImageVisualizer implements Visualizer<Image> {
  static id: VisualizerId = "image";
  types: EventTypeId[] = ["type.googleapis.com/farm_ng_proto.tractor.v1.Image"];

  options: VisualizerOptionConfig[] = [
    { label: "view", options: ["overlay", "grid"] }
  ];

  component: React.FC<VisualizerProps<Image>> = (props) => {
    const view = props.options[0].value as "overlay" | "grid";
    return <Layout view={view} element={ImageElement} {...props} />;
  };
}
