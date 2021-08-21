import * as PIXI from "pixi.js";
import { app } from "../app";

export function render(
  tick: number,
  ground: PIXI.TilingSprite,
  background: PIXI.TilingSprite
) {
  background.width = app.view.width;
  background.height = background.texture.height;

  ground.width = app.view.width;
  ground.height = ground.texture.height;

  ground.transform.position.y = app.view.height - ground.height;
  background.transform.position.y =
    app.view.height - background.height - ground.height;

  ground.tilePosition.x = ground.tilePosition.x - tick;
  background.tilePosition.x = background.tilePosition.x - tick * 1.5;
}

export function createSprites() {
  const background = new PIXI.TilingSprite(
    PIXI.utils.TextureCache["background.png"]
  );
  const ground = new PIXI.TilingSprite(PIXI.utils.TextureCache["ground.png"]);

  return [ground, background];
}
