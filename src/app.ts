import * as PIXI from "pixi.js";

export const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerWidth / 2,
  backgroundColor: 0x7cc6ce,
});

window.addEventListener("resize", () => {
  app.renderer.resize(window.innerWidth, window.innerWidth / 2);
});

export const container = new PIXI.Container();
container.interactive = true;
app.stage.addChild(container);
