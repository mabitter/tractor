import { TimeSkewVisualizer } from "../components/scope/visualizers/TimeSkewVisualizer";
import { JSONVisualizer } from "../components/scope/visualizers/JSONVisualizer";
import { SteeringCommandVisualizer } from "../components/scope/visualizers/SteeringCommandVisualizer";
import { TimestampedEvent, TimestampedEventVector } from "../types/common";
import { EventType, EventTypeId } from "./events";
import { ResourceArchive } from "../models/ResourceArchive";
import { ImageVisualizer } from "../components/scope/visualizers/ImageVisualizer";
import { ApriltagDetectionsVisualizer } from "../components/scope/visualizers/ApriltagDetectionsVisualizer";
import { NamedSE3PoseVisualizer } from "../components/scope/visualizers/NamedSE3PoseVisualizer";
import { TrackingCameraPoseFrameVisualizer } from "../components/scope/visualizers/TrackingCameraPoseFrameVisualizer";

export interface VisualizerOptionConfig {
  label: string;
  options: string[];
}
export type VisualizerOption = VisualizerOptionConfig & { value: string };

export interface SingleElementVisualizerProps<T extends EventType = EventType> {
  value: TimestampedEvent<T>;
  options: VisualizerOption[];
  resources: ResourceArchive | null;
}

export interface VisualizerProps<T extends EventType = EventType> {
  values: TimestampedEventVector<T>;
  options: VisualizerOption[];
  resources: ResourceArchive | null;
}

export interface Visualizer<T extends EventType = EventType> {
  component: React.FC<VisualizerProps<T>>;
  options: VisualizerOptionConfig[];
  types: EventTypeId[] | "*";
}

export const visualizerRegistry: { [k: string]: Visualizer } = {
  [TrackingCameraPoseFrameVisualizer.id]: new TrackingCameraPoseFrameVisualizer() as Visualizer,
  [NamedSE3PoseVisualizer.id]: new NamedSE3PoseVisualizer() as Visualizer,
  [ImageVisualizer.id]: new ImageVisualizer() as Visualizer,
  [ApriltagDetectionsVisualizer.id]: new ApriltagDetectionsVisualizer() as Visualizer,
  [SteeringCommandVisualizer.id]: new SteeringCommandVisualizer() as Visualizer,
  [JSONVisualizer.id]: new JSONVisualizer() as Visualizer,
  [TimeSkewVisualizer.id]: new TimeSkewVisualizer() as Visualizer
};
export const visualizerIds = Object.keys(visualizerRegistry);
export type VisualizerId = typeof visualizerIds[number];
