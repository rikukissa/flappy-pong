import { Event } from "./events";
import { State } from "./state";
import { WORLD_WIDTH } from "./world";

export function getEvents(state: State): Event[] {
  const slope = state.bird.vy / state.bird.vx;

  const y = state.bird.y - slope * (state.bird.x - WORLD_WIDTH);

  const currentY = state.players[1].y;
  const distance = y - currentY;

  if (state.bird.vx < 0) {
    return [];
  }

  return [{ type: "mousemove", x: 0, y: currentY + distance / 20 }];
}
