import { IWebSocketMessage } from "./IWebSocketMessage";

export interface IWebSocketClient {
  on: (event: string, callback: (data: IWebSocketMessage) => void) => void;
  send: (data: IWebSocketMessage) => void;
}
