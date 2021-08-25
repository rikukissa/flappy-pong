import { app } from "./app";
import { WORLD_WIDTH, WORLD_HEIGHT } from "./config";

type Position = {
  x: number;
  y: number;
};

export function toWorldPosition(screenPosition: Position) {
  return {
    x: (screenPosition.x / app.view.width) * WORLD_WIDTH,
    y: (screenPosition.y / app.view.height) * WORLD_HEIGHT,
  };
}

export function toScreenPosition(worldPosition: Position) {
  return {
    x: toScreenWidth(worldPosition.x),
    y: toScreenHeight(worldPosition.y),
  };
}

export function toScreenWidth(worldWidth: number) {
  return Math.ceil((worldWidth / WORLD_WIDTH) * app.view.width);
}

export function toScreenHeight(worldHeight: number) {
  return Math.ceil((worldHeight / WORLD_HEIGHT) * app.view.height);
}
