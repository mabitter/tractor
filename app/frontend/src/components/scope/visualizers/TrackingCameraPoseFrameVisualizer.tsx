/* eslint-disable no-console */
import * as React from "react";
import {
  Visualizer,
  VisualizerId,
  VisualizerOptionConfig,
  VisualizerProps
} from "../../../registry/visualization";
import { EventTypeId } from "../../../registry/events";
import { TrackingCameraPoseFrame } from "../../../../genproto/farm_ng_proto/tractor/v1/tracking_camera";
import { Plot } from "./Plot";
import { Vec3 } from "../../../../genproto/farm_ng_proto/tractor/v1/geometry";
import { colorGenerator } from "../../../utils/colorGenerator";

const norm = (v?: Vec3): number => {
  return v
    ? Math.sqrt(Math.pow(v.x, 2) + Math.pow(v.y, 2) + Math.pow(v.z, 2))
    : 0;
};

export class TrackingCameraPoseFrameVisualizer
  implements Visualizer<TrackingCameraPoseFrame> {
  static id: VisualizerId = "trackingCameraPoseFrame";
  types: EventTypeId[] = [
    "type.googleapis.com/farm_ng_proto.tractor.v1.TrackingCameraPoseFrame"
  ];

  options: VisualizerOptionConfig[] = [];

  component: React.FC<VisualizerProps<TrackingCameraPoseFrame>> = ({
    values
  }) => {
    const plotData = [
      values.map(([t, _]) => t / 1000),
      values.map(([_, v]) => norm(v.velocity)),
      values.map(([_, v]) => norm(v.acceleration))
    ];

    const colors = colorGenerator();
    const plotOptions = {
      width: 800,
      height: 600,
      series: [
        {
          value: "{M}/{DD}/{YY} {h}:{mm}:{ss}.{fff} {aa}"
        },
        ...["|v|", "|a|"].map((label) => ({
          label,
          stroke: colors.next().value
        }))
      ]
    };

    return <Plot data={plotData} options={plotOptions} />;
  };
}
