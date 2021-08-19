import * as PIXI from "pixi.js";
import { State } from "../state";
import { toScreenPosition, toScreenWidth } from "../world";

export interface Bird {
  x: number;
  y: number;
  radius: number;
  vy: number;
  vx: number;
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
