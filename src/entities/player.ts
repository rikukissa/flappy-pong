import * as PIXI from "pixi.js";

import { toScreenHeight, toScreenPosition, toScreenWidth } from "../world";
export interface Player {
  width: number;
  height: number;
  points: number;
  x: number;
  y: number;
  vy: number;
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
