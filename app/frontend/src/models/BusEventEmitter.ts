import { Event as BusAnyEvent } from "../../genproto/farm_ng_proto/tractor/v1/io";

type ICallback = (event: BusAnyEvent) => void;

type ICallbackMap = {
  [event: string]: ICallback[];
};

// A generic emitter of eventbus events.
// May be used by various transports (e.g. webRTC, websocket, or a test transport).
export class BusEventEmitter {
  private callbacks: ICallbackMap = {};

  public on(eventType: string, callback: ICallback): void {
    this.callbacks[eventType] = [
      ...(this.callbacks[eventType] || []),
      callback
    ];
  }

  // TODO: Replace this super crude unsubscription with a handle
  public off(eventType: string): void {
    delete this.callbacks[eventType];
  }

  public emit(event: BusAnyEvent): void {
    (this.callbacks["*"] || []).forEach((cb) => cb(event));
    if (event.data) {
      (this.callbacks[event.data.typeUrl] || []).forEach((cb) => cb(event));
    }
  }
}
