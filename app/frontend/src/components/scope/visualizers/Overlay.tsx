import * as React from "react";
import { useState } from "react";
import RangeSlider from "react-bootstrap-range-slider";
import styles from "./Overlay.module.scss";
import { EventType } from "../../../registry/events";
import {
  SingleElementVisualizerProps,
  VisualizerProps
} from "../../../registry/visualization";

export interface IProps<T extends EventType> {
  element: React.FC<SingleElementVisualizerProps<T>>;
}
export type OverlayProps<T extends EventType> = IProps<T> & VisualizerProps<T>;

export const Overlay = <T extends EventType>(
  props: OverlayProps<T>
): React.ReactElement<OverlayProps<T>> | null => {
  const { element: Component, values } = props;

  const [index, setIndex] = useState(0);
  const value = values[index];

  // An external change (e.g. to the throttle) made the current index invalid.
  if (!value && values?.[0]) {
    setIndex(0);
    return null;
  }

  return (
    <div className={styles.overlay}>
      <RangeSlider
        className={styles.overlaySlider}
        value={index}
        onChange={(_, v) => setIndex(v)}
        min={0}
        max={values.length - 1}
        step={1}
        tooltip={"off"}
      />
      <Component value={value} {...props} />
    </div>
  );
};
