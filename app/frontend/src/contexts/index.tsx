import * as React from "react";
import { BusEventStore } from "../stores/BusEventStore";
import { MediaStreamStore } from "../stores/MediaStreamStore";
import { getWebRTCEmitters } from "../models/getWebRTCEmitters";

const [busEventEmitter, mediaStreamEmitter] = getWebRTCEmitters(
  `http://${window.location.host}/twirp/farm_ng_proto.tractor.v1.WebRTCProxyService/InitiatePeerConnection`
);

export const storesContext = React.createContext({
  busEventStore: new BusEventStore(busEventEmitter),
  mediaStreamStore: new MediaStreamStore(mediaStreamEmitter)
});
