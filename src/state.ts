import { Event } from "./events";
import { WORLD_HEIGHT, WORLD_WIDTH } from "./world";
import produce from "immer";
import * as player from "./entities/player";
import * as bird from "./entities/bird";
import * as score from "./entities/score";

export interface State {
  bird: bird.Bird;
  players: player.Player[];
}

export const PLAYER_WIDTH = 7;
export const PLAYER_HEIGHT = 20;

export const getInitialState = () => ({
  bird: {
    x: WORLD_WIDTH / 2,
    y: WORLD_HEIGHT / 2,
    radius: 2.5,
    vy: -0.1,
    vx: -0.6,
  },
  players: [
    {
      width: PLAYER_WIDTH,
      height: PLAYER_HEIGHT,
      points: 0,
      x: 2,
      y: 0,
      vy: 0,
    },
    {
      width: PLAYER_WIDTH,
      height: PLAYER_HEIGHT,
      points: 0,
      x: WORLD_WIDTH - PLAYER_WIDTH - 2,
      y: 0,
      vy: 0,
    },
  ],
});

function gameOver(state: State) {
  return state.bird.x < 0 || state.bird.x > WORLD_WIDTH;
}

function resetState(state: State) {
  const initialState = getInitialState();

  initialState.players[0].points = state.players[0].points;
  initialState.players[1].points = state.players[1].points;

  return initialState;
}

const updaters = {
  bird: bird.update,
  player: player.update,
  score: score.update,
};

export function update(
  _delta: number,
  state: State,
  eventBuffer: Event[]
): State {
  const nextState = produce(state, (draftState) => {
    Object.values(updaters).forEach((updater) =>
      updater(draftState, eventBuffer)
    );
  });

  if (gameOver(nextState)) {
    return resetState(nextState);
  }

  return nextState;
}

// Hot swap update function in development
if (import.meta.hot) {
  import.meta.hot.accept(["./entities/bird.ts"], ([newModule]) => {
    updaters.bird = newModule.update;
  });
}
