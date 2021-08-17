import {
  State,
  Player,
  initialState,
  PLAYER_HEIGHT,
  PLAYER_WIDTH,
} from "./state";
import { clearBuffer, Event, eventBuffer } from "./events";
import { getEvents } from "./enemy";
import { WORLD_WIDTH, WORLD_HEIGHT } from "./world";
import { createRenderer, Renderer } from "./render";
import { app } from "./app";

window.addEventListener("resize", () => {
  app.resize();
});

window.document.body.appendChild(app.view);

async function setup() {
  const renderer = await createRenderer();

  let state = initialState;
  app.ticker.add((delta) => {
    state = gameLoop(renderer, delta, state, eventBuffer);
    clearBuffer();
  });
}

function ballTouchesPlayerSide(ball: State["ball"], player: Player) {
  return (
    ball.x + ball.radius * 2 > player.x &&
    ball.x < player.x + player.width &&
    ball.y + ball.radius > player.y &&
    ball.y + ball.radius < player.y + player.height
  );
}
function ballTouchesPlayerTopOrBottom(ball: State["ball"], player: Player) {
  return (
    ball.x + ball.radius < player.x + player.width &&
    ball.x + ball.radius > player.x &&
    ball.y + ball.radius * 2 > player.y &&
    ball.y < player.y + player.height
  );
}

function clamp(min: number, max: number, value: number) {
  return Math.min(Math.max(value, min), max);
}

function update(delta: number, state: State, eventBuffer: Event[]): State {
  eventBuffer.forEach((event) => {
    if (event.type === "mousemove") {
      state.players[0].y = Math.min(
        WORLD_HEIGHT - PLAYER_HEIGHT,
        Math.max(0, event.y)
      );
    }
  });

  const enemyEvents = getEvents(state);

  enemyEvents.forEach((event) => {
    if (event.type === "mousemove") {
      state.players[1].y = Math.min(
        WORLD_HEIGHT - PLAYER_HEIGHT,
        Math.max(0, event.y)
      );
    }
  });

  state.ball.x += state.ball.vx;
  state.ball.y += state.ball.vy;

  if (
    state.ball.y <= 0 ||
    state.ball.y + state.ball.radius * 2 >= WORLD_HEIGHT
  ) {
    state.ball.vy *= -1;
  }

  if (
    state.players.some((player) => ballTouchesPlayerSide(state.ball, player))
  ) {
    state.ball.vx *= -1.15;
    state.ball.x = clamp(
      PLAYER_WIDTH + 2,
      WORLD_WIDTH - PLAYER_WIDTH - 2,
      state.ball.x
    );
  }
  const verticallyTouchingPlayer = state.players.find((player) =>
    ballTouchesPlayerTopOrBottom(state.ball, player)
  );
  if (verticallyTouchingPlayer) {
    state.ball.vy *= -1.15;
    const touchesBottom =
      state.ball.y >
      verticallyTouchingPlayer.y + verticallyTouchingPlayer.height / 2;

    if (touchesBottom) {
      state.ball.y = clamp(
        verticallyTouchingPlayer.y + verticallyTouchingPlayer.height,
        WORLD_HEIGHT,
        state.ball.y
      );
    } else {
      state.ball.y = clamp(0, verticallyTouchingPlayer.y, state.ball.y);
    }
  }
  state.ball.vx *= 0.9998;

  return state;
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
