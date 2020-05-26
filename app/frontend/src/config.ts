// TODO: Use environment variable to select mock
// import { MockWebSocketClient } from "./clients/MockWebSocketClient";
// const webSocketClient = new MockWebSocketClient();

import { WebSocketClient } from "./clients/WebSocketClient";

const webSocketClient = new WebSocketClient("ws://localhost:8989/simsocket");

const host = "http://localhost";
const port = 8989;

export { webSocketClient, host, port };
