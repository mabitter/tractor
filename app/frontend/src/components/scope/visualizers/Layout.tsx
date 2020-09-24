import * as React from "react";
import { EventType } from "../../../registry/events";
import { Grid, GridProps } from "./Grid";
import { Overlay, OverlayProps } from "./Overlay";

interface IProps {
  view: "grid" | "overlay";
}

type LayoutProps<T extends EventType> = IProps &
  (GridProps<T> | OverlayProps<T>);

export const Layout = <T extends EventType>(
  props: LayoutProps<T>
): React.ReactElement<LayoutProps<T>> => {
  return props.view === "grid" ? <Grid {...props} /> : <Overlay {...props} />;
};
