import * as PIXI from "pixi.js";
import { app } from "../app";
import { State } from "../state";
import { WORLD_WIDTH } from "../config";

function getPointsText(points: number[]) {
  return points.join(" – ");
}

export function update(state: State) {
  if (state.bird.x < 0) {
    state.players[1].points++;
  }

  if (state.bird.x > WORLD_WIDTH) {
    state.players[0].points++;
  }
  return state;
}

export function render(_tick: number, state: State, sprite: PIXI.Text) {
  sprite.x = app.view.width / 2;
  sprite.y = app.view.height / 10;
  sprite.anchor.set(0.5, 0);

  sprite.text = getPointsText(state.players.map(({ points }) => points));
  sprite.updateText(true);
}

export function createSprite() {
  const text = new PIXI.Text(getPointsText([0, 0]), {
    fontFamily: "VT323",
    fontSize: app.view.width / 20,
    fill: 0xffffff,
    align: "center",
  });

  return text;
}
