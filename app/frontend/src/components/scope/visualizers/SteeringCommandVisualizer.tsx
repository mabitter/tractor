import * as React from "react";
import { SteeringCommand } from "../../../../genproto/farm_ng_proto/tractor/v1/steering";
import { EventTypeId } from "../../../registry/events";
import {
  Visualizer,
  VisualizerId,
  VisualizerOptionConfig,
  VisualizerProps
} from "../../../registry/visualization";
import { colorGenerator } from "../../../utils/colorGenerator";
import { Plot } from "./Plot";

export class SteeringCommandVisualizer implements Visualizer<SteeringCommand> {
  static id: VisualizerId = "steeringcommand";
  types: EventTypeId[] = [
    "type.googleapis.com/farm_ng_proto.tractor.v1.SteeringCommand"
  ];

  options: VisualizerOptionConfig[] = [
    { label: "strokeWidth", options: ["1", "2", "3", "4"] }
  ];

  component: React.FC<VisualizerProps<SteeringCommand>> = ({
    values,
    options
  }) => {
    const plotData = [
      values.map(([t, _]) => t / 1000),
      values.map(([_, v]) => v.brake),
      values.map(([_, v]) => v.deadman),
      values.map(([_, v]) => v.velocity),
      values.map(([_, v]) => v.angularVelocity)
    ];

    const strokeWidth = parseInt(options[0].value);
    const colors = colorGenerator();
    const plotOptions = {
      width: 800,
      height: 600,
      series: [
        {
          show: false
        },
        ...["brake", "deadman", "v", "ω"].map((label) => ({
          label,
          stroke: colors.next().value,
          width: strokeWidth
        }))
      ]
    };

    return <Plot data={plotData} options={plotOptions} />;
  };
}
