import * as PIXI from "pixi.js";

import { PLAYER_WIDTH, State } from "../state";
import {
  toScreenPosition,
  toScreenWidth,
  WORLD_HEIGHT,
  WORLD_WIDTH,
} from "../world";
import { Player } from "./player";

export interface Bird {
  x: number;
  y: number;
  radius: number;
  vy: number;
  vx: number;
}

function ballTouchesPlayerSide(ball: State["bird"], player: Player) {
  return (
    ball.x + ball.radius * 2 > player.x &&
    ball.x < player.x + player.width * 2 &&
    ball.y + ball.radius > player.y &&
    ball.y + ball.radius < player.y + player.height
  );
}

function ballTouchesPlayerTopOrBottom(ball: State["bird"], player: Player) {
  return (
    ball.x + ball.radius < player.x + player.width &&
    ball.x + ball.radius > player.x &&
    ball.y + ball.radius * 2 > player.y &&
    ball.y < player.y + player.height
  );
}

function clamp(min: number, max: number, value: number) {
  return Math.min(Math.max(value, min), max);
}

export function update(state: State) {
  state.bird.x += state.bird.vx;
  state.bird.y += state.bird.vy;

  if (
    state.bird.y <= 0 ||
    state.bird.y + state.bird.radius * 2 >= WORLD_HEIGHT
  ) {
    state.bird.vy *= -1;
  }

  const horizontallyTouchingPlayer = state.players.find((player) =>
    ballTouchesPlayerSide(state.bird, player)
  );
  if (horizontallyTouchingPlayer) {
    state.bird.vx *= -1.15;
    state.bird.vy =
      horizontallyTouchingPlayer.vy -
      (horizontallyTouchingPlayer.y +
        horizontallyTouchingPlayer.height / 2 -
        state.bird.y) /
        10;
    state.bird.x = clamp(
      PLAYER_WIDTH + 2,
      WORLD_WIDTH - PLAYER_WIDTH - 2,
      state.bird.x
    );
  }
  const verticallyTouchingPlayer = state.players.find((player) =>
    ballTouchesPlayerTopOrBottom(state.bird, player)
  );
  if (verticallyTouchingPlayer) {
    state.bird.vy *= -1.2;
    const touchesBottom =
      state.bird.y + state.bird.radius >
      verticallyTouchingPlayer.y + verticallyTouchingPlayer.height;
    state.bird.y >
      verticallyTouchingPlayer.y + verticallyTouchingPlayer.height / 2;

    if (touchesBottom) {
      state.bird.y = clamp(
        verticallyTouchingPlayer.y + verticallyTouchingPlayer.height,
        WORLD_HEIGHT,
        state.bird.y
      );
    } else {
      state.bird.y = clamp(
        0,
        verticallyTouchingPlayer.y - state.bird.radius * 2,
        state.bird.y
      );
    }
  }
  state.bird.vx *= 0.9998;
  state.bird.vx = clamp(-3, 3, state.bird.vx);
  state.bird.y = clamp(0, WORLD_HEIGHT - state.bird.radius * 2, state.bird.y);
}

export function render(
  tick: number,
  state: State,
  sprite: PIXI.AnimatedSprite
) {
  const ballPosition = toScreenPosition(state.bird);
  const radius = toScreenWidth(state.bird.radius);

  sprite.height = radius * 2;
  sprite.width = sprite.height * 1.41666;

  sprite.animationSpeed = Math.abs(state.bird.vx) + Math.abs(state.bird.vy);
  sprite.x = ballPosition.x + radius;
  sprite.y = ballPosition.y + radius;

  if (Math.sign(sprite.scale.x) !== Math.sign(state.bird.vx)) {
    sprite.scale.x = sprite.scale.x * -1;
  }

  sprite.pivot.x = sprite.texture.width / 2;
  sprite.pivot.y = sprite.texture.height / 2;

  sprite.angle = Math.atan(state.bird.vy / state.bird.vx) * (180 / Math.PI);
}

export function createSprite() {
  const bird = new PIXI.AnimatedSprite([
    PIXI.utils.TextureCache["birdUp.png"],
    PIXI.utils.TextureCache["birdMiddle.png"],
    PIXI.utils.TextureCache["birdDown.png"],
  ]);
  bird.animationSpeed = 0.5;
  bird.loop = true;
  bird.play();
  return bird;
}
