import { InteractionEvent } from "pixi.js";

import { container } from "./app";
import { toWorldPosition } from "./world";

export type Event = { type: "mousemove"; x: number; y: number };

export let eventBuffer: Event[] = [];
function onDragMove(event: InteractionEvent) {
  eventBuffer.push({
    ...toWorldPosition(event.data.getLocalPosition(container)),
    type: "mousemove",
  });
}
container.on("pointermove", onDragMove);

export function clearBuffer() {
  eventBuffer = [];
}
