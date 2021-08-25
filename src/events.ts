import { InteractionEvent } from "pixi.js";

import { container } from "./app";
import { toWorldPosition } from "./world";

export type Event =
  | { type: "mousemove"; x: number; y: number }
  | { type: "space" };

export let eventBuffer: Event[] = [];
function onDragMove(event: InteractionEvent) {
  eventBuffer.push({
    ...toWorldPosition(event.data.getLocalPosition(container)),
    type: "mousemove",
  });
}
container.on("pointermove", onDragMove);
window.addEventListener("keydown", (e) => {
  if (e.key === " ") {
    eventBuffer.push({ type: "space" });
  }
});

export function clearBuffer() {
  eventBuffer = [];
}
