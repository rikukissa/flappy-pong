import * as PIXI from "pixi.js";
import { getEvents } from "../enemy";
import { Event } from "../events";
import { PLAYER_HEIGHT, State } from "../state";

import {
  toScreenHeight,
  toScreenPosition,
  toScreenWidth,
  WORLD_HEIGHT,
} from "../world";

export interface Player {
  width: number;
  height: number;
  points: number;
  x: number;
  y: number;
  vy: number;
}

function updatePlayer(player: Player, eventBuffer: Event[]) {
  const prevY = player.y;
  eventBuffer.forEach((event) => {
    if (event.type === "mousemove") {
      player.y = Math.min(WORLD_HEIGHT - PLAYER_HEIGHT, Math.max(0, event.y));
    }
  });
  player.vy = (player.y - prevY) / 5;
}

export function update(state: State, eventBuffer: Event[]) {
  updatePlayer(state.players[0], eventBuffer);
  updatePlayer(state.players[1], getEvents(state));
}

export function render(player: Player, playerSprite: PIXI.Sprite) {
  const screenPosition = toScreenPosition({ x: player.x, y: player.y });

  playerSprite.x = screenPosition.x;
  playerSprite.y = screenPosition.y;
  playerSprite.width = toScreenWidth(player.width);
  playerSprite.height = toScreenHeight(player.height);
}

export function createSprite() {
  return new PIXI.Sprite(PIXI.utils.TextureCache["pipeDown.png"]);
}
