import { Event } from "../events";
import { WORLD_WIDTH } from "../config";
import * as player from "../entities/player";
import * as bird from "../entities/bird";
import * as score from "../entities/score";
import { getInitialState } from "./initial-state";

export interface State {
  bird: bird.Bird;
  players: player.Player[];
}

function gameOver(state: State) {
  return state.bird.x < 0 || state.bird.x > WORLD_WIDTH;
}

// Creates an empty state, but keeps the points
function resetState(state: State) {
  const initialState = getInitialState();
  return {
    ...initialState,
    players: initialState.players.map((player, i) => ({
      ...player,
      points: state.players[i].points,
    })),
  };
}

const updaters = {
  bird: bird.update,
  player: player.update,
  score: score.update,
};

export function update(
  delta: number,
  state: State,
  eventBuffer: Event[]
): State {
  Object.values(updaters).forEach((updater) =>
    updater(state, eventBuffer, delta)
  );

  if (gameOver(state)) {
    return resetState(state);
  }

  return state;
}
