import * as React from "react";
import { EventType } from "../../../registry/events";
import {
  Visualizer,
  VisualizerId,
  VisualizerOptionConfig,
  VisualizerProps
} from "../../../registry/visualization";
import { colorGenerator } from "../../../utils/colorGenerator";
import { Plot } from "./Plot";

export class TimeSkewVisualizer implements Visualizer {
  static id: VisualizerId = "timeSkew";
  types = "*" as const;

  options: VisualizerOptionConfig[] = [];

  component: React.FC<VisualizerProps<EventType>> = ({ values }) => {
    const plotData = [
      values.map((_, i) => i),
      values.map(([t, _]) => t / 1000)
    ];

    const colors = colorGenerator();
    const plotOptions = {
      width: 800,
      height: 600,
      series: [
        {
          show: false
        },
        {
          label: "t",
          stroke: colors.next().value,
          width: 1
        }
      ],
      scales: {
        x: {
          time: false
        },
        y: {
          time: true
        }
      },
      axes: [
        {},
        {
          size: 100
        }
      ]
    };

    return <Plot data={plotData} options={plotOptions} />;
  };
}
