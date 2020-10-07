import * as React from "react";
import { useResizeObserver } from "../../hooks/useResizeObserver";
import { ResourceArchive } from "../../models/ResourceArchive";
import { EventType } from "../../registry/events";
import { VisualizerProps } from "../../registry/visualization";
import { EventLogEntry } from "../../stores/ProgramsStore";
import { ProgramLog } from "./ProgramLog";
import styles from "./ProgramLogVisualizer.module.scss";

interface IProps {
  eventLog: EventLogEntry[];
  selectedEntry: number | null;
  onSelectEntry: (index: number | null) => void;
  visualizer: React.FC<VisualizerProps<EventType>> | null;
  resources: ResourceArchive;
}

export const ProgramLogVisualizer: React.FC<IProps> = (props) => {
  const { eventLog, selectedEntry, visualizer, resources } = props;
  const selectedEvent = selectedEntry ? eventLog[selectedEntry] : null;
  const [, containerRef, resizeObservation] = useResizeObserver();
  return (
    <div className={styles.programLogVisualizer} ref={containerRef}>
      <div className={styles.programLog}>
        <ProgramLog
          {...props}
          height={resizeObservation?.contentRect.height || 600}
        />
      </div>
      {visualizer && selectedEvent && selectedEvent.stamp && (
        <div className={styles.programVisualizer}>
          {React.createElement(visualizer, {
            values: [[selectedEvent.stamp.getTime(), selectedEvent.event]],
            options: [{ label: "", options: [], value: "overlay" }],
            resources
          })}
        </div>
      )}
    </div>
  );
};
