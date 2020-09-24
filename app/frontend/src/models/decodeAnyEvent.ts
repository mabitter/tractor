import { Event as BusAnyEvent } from "../../genproto/farm_ng_proto/tractor/v1/io";
import { eventRegistry, EventType, EventTypeId } from "../registry/events";
import { Message } from "../types/common";

export function decodeAnyEvent<T extends EventType>(
  event: BusAnyEvent
): T | null {
  const { data } = event;
  if (!data || !data.value) {
    return null;
  }
  const message = eventRegistry[
    (data.typeUrl as unknown) as EventTypeId
  ] as Message<T>;
  if (!message) {
    // eslint-disable-next-line no-console
    console.error(`No decoder registered for type: ${data.typeUrl}`);
    return null;
  }
  return message.decode(data.value);
}
