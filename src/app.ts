import * as PIXI from "pixi.js";

export const app = new PIXI.Application({
  width: 800,
  height: 400,
  backgroundColor: 0x7cc6ce,
});

export const container = new PIXI.Container();
container.interactive = true;
app.stage.addChild(container);
