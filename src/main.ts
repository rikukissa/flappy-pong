import { app } from "./app";
import { clearBuffer, Event, eventBuffer } from "./events";
import { createRenderer, Renderer } from "./render";
import { initialState, State, update } from "./state";

window.document.body.appendChild(app.view);

async function setup() {
  const renderer = await createRenderer();

  let state = initialState;
  app.ticker.add((delta) => {
    state = gameLoop(renderer, delta, state, eventBuffer);
    clearBuffer();
  });
}

function gameLoop(
  renderer: Renderer,
  delta: number,
  state: State,
  eventBuffer: Event[]
) {
  const newState = update(delta, state, eventBuffer);
  renderer(delta, newState);
  return newState;
}

setup();
