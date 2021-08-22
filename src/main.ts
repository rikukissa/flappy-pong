import { app } from "./app";
import { clearBuffer, Event, eventBuffer } from "./events";
import { createRenderer, Renderer } from "./render";
import { getInitialState, State, update } from "./state";

window.document.body.appendChild(app.view);

async function setup() {
  const renderer = await createRenderer();

  let state = getInitialState();
  app.ticker.add((delta) => {
    state = gameLoop(renderer, delta, state, eventBuffer);
    clearBuffer();
  });
}

let updateFn = update;

if (import.meta.hot) {
  // Hot swap update function in development
  import.meta.hot.accept(["./state.ts"], ([newModule]) => {
    updateFn = newModule.update;
  });
}

function gameLoop(
  renderer: Renderer,
  delta: number,
  state: State,
  eventBuffer: Event[]
) {
  const newState = updateFn(delta, state, eventBuffer);
  renderer(delta, newState);
  return newState;
}

setup();
