import * as PIXI from "pixi.js";

import { container } from "./app";
import * as background from "./entities/background";
import * as bird from "./entities/bird";
import * as player from "./entities/player";
import * as score from "./entities/score";

import { State } from "./state";

export function loadAssets() {
  return new Promise<void>((resolve) => {
    const loader = PIXI.Loader.shared;

    loader.add("gameSprite", "./src/sprites/spritesData.json", () => {
      resolve();
    });

    loader.load();
  });
}

export async function createRenderer() {
  await loadAssets();

  // Background
  const [groundSprite, backgroundSprite] = background.createSprites();
  container.addChild(groundSprite);
  container.addChild(backgroundSprite);

  // Score
  const scoreText = score.createSprite();
  container.addChild(scoreText);

  // Bird
  const birdSprite = bird.createSprite();
  container.addChild(birdSprite);

  // Players
  const playerSprites = [player.createSprite(), player.createSprite()];
  playerSprites.forEach((sprite) => container.addChild(sprite));

  return function render(tick: number, state: State) {
    background.render(tick, groundSprite, backgroundSprite);
    bird.render(tick, state, birdSprite);
    score.render(tick, state, scoreText);
    state.players.forEach((playerState, i) =>
      player.render(playerState, playerSprites[i])
    );
  };
}

export type Renderer = (tick: number, state: State) => void;

if (import.meta.hot) {
  import.meta.hot.accept(["./entities/bird/index.ts"], (...args) => {
    console.log(args);
  });
}
