import * as PIXI from "pixi.js";
import { app, container } from "./app";
import { Player, State } from "./state";
import { WORLD_HEIGHT, WORLD_WIDTH } from "./world";

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

function toScreenPosition(worldPosition: Position) {
  return {
    x: toScreenWidth(worldPosition.x),
    y: toScreenHeight(worldPosition.y),
  };
}

function toScreenWidth(worldWidth: number) {
  return (worldWidth / WORLD_WIDTH) * app.view.width;
}

function toScreenHeight(worldHeight: number) {
  return (worldHeight / WORLD_HEIGHT) * app.view.height;
}

export function loadAssets() {
  return new Promise<void>((resolve, reject) => {
    const loader = PIXI.Loader.shared;

    loader.add("gameSprite", "./src/spritesData.json", () => {
      resolve();
    });

    loader.load();
  });
}

export async function createRenderer() {
  await loadAssets();

  const background = new PIXI.TilingSprite(
    PIXI.utils.TextureCache["background.png"]
  );
  const ground = new PIXI.TilingSprite(PIXI.utils.TextureCache["ground.png"]);

  background.width = app.view.width;
  background.height = background.texture.height;

  ground.width = app.view.width;
  ground.height = ground.texture.height;

  ground.transform.position.y = app.view.height - ground.height;
  background.transform.position.y =
    app.view.height - background.height - ground.height;

  container.addChild(background);
  container.addChild(ground);

  const bird = new PIXI.Sprite(PIXI.utils.TextureCache["birdUp.png"]);

  const players = [
    new PIXI.Sprite(PIXI.utils.TextureCache["pipeDown.png"]),
    new PIXI.Sprite(PIXI.utils.TextureCache["pipeDown.png"]),
  ];

  players.forEach((player) => container.addChild(player));
  container.addChild(bird);

  function drawPlayer(player: Player, i: number) {
    const screenPosition = toScreenPosition({ x: player.x, y: player.y });

    players[i].x = screenPosition.x;
    players[i].y = screenPosition.y;
    players[i].width = toScreenWidth(player.width);
    players[i].height = toScreenHeight(player.height);
  }

  return function render(tick: number, state: State) {
    const ballPosition = toScreenPosition(state.ball);
    const radius = toScreenWidth(state.ball.radius);
    ground.tilePosition.x = ground.tilePosition.x - tick;
    background.tilePosition.x = background.tilePosition.x - tick * 1.5;

    bird.height = radius * 2;
    bird.width = bird.height * 1.41666;
    bird.x = ballPosition.x + radius;
    bird.y = ballPosition.y + radius;

    if (Math.sign(bird.scale.x) != Math.sign(state.ball.vx)) {
      bird.scale.x = bird.scale.x * -1;
    }

    bird.pivot.x = bird.texture.width / 2;
    bird.pivot.y = bird.texture.height / 2;

    bird.angle = Math.atan(state.ball.vy / state.ball.vx) * (180 / Math.PI);

    state.players.forEach(drawPlayer);
  };
}

export type Renderer = (tick: number, state: State) => void;
