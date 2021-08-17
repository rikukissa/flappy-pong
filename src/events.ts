import { InteractionEvent } from "pixi.js";

import { container } from "./app";
import { toWorldPosition } from "./render";

export type Event = { type: "mousemove"; x: number; y: number };

export let eventBuffer: Event[] = [];
container.on("pointermove", onDragMove);
function onDragMove(event: InteractionEvent) {
  eventBuffer.push({
    ...toWorldPosition(event.data.getLocalPosition(container)),
    type: "mousemove",
  });
}

export function clearBuffer() {
  eventBuffer = [];
}
