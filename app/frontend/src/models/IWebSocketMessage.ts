import { Status } from "../../genproto/farmng/tractor/v1/status";

export interface ISetWaypoint {
  waypoint: number[];
}

export type IWebSocketMessage = Status | ISetWaypoint;
