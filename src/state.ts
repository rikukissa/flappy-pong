import { getEvents } from "./enemy";
import { Event } from "./events";
import { WORLD_HEIGHT, WORLD_WIDTH } from "./world";

export interface State {
  ball: Ball;
  players: Player[];
}
export interface Player {
  width: number;
  height: number;
  points: number;
  x: number;
  y: number;
  vy: number;
}
export interface Ball {
  x: number;
  y: number;
  radius: number;
  vy: number;
  vx: number;
}

export const PLAYER_WIDTH = 7;
export const PLAYER_HEIGHT = 20;

export const initialState = {
  ball: {
    x: WORLD_WIDTH / 2,
    y: WORLD_HEIGHT / 2,
    radius: 2.5,
    vy: -0.1,
    vx: -0.6,
  },
  players: [
    { width: PLAYER_WIDTH, height: PLAYER_HEIGHT, points: 0, x: 2, y: 0 },
    {
      width: PLAYER_WIDTH,
      height: PLAYER_HEIGHT,
      points: 0,
      x: WORLD_WIDTH - PLAYER_WIDTH - 2,
      y: 0,
    },
  ],
};

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

function updatePlayer(player: Player, eventBuffer: Event[]) {
  const prevY = player.y;
  eventBuffer.forEach((event) => {
    if (event.type === "mousemove") {
      player.y = Math.min(WORLD_HEIGHT - PLAYER_HEIGHT, Math.max(0, event.y));
    }
  });
  player.vy = (player.y - prevY) / 5;
}

export function update(
  delta: number,
  state: State,
  eventBuffer: Event[]
): State {
  updatePlayer(state.players[0], eventBuffer);
  updatePlayer(state.players[1], getEvents(state));
  state.ball.x += state.ball.vx;
  state.ball.y += state.ball.vy;

  if (
    state.ball.y <= 0 ||
    state.ball.y + state.ball.radius * 2 >= WORLD_HEIGHT
  ) {
    state.ball.vy *= -1;
  }

  const horizontallyTouchingPlayer = state.players.find((player) =>
    ballTouchesPlayerSide(state.ball, player)
  );
  if (horizontallyTouchingPlayer) {
    state.ball.vx *= -1.15;
    state.ball.vy =
      horizontallyTouchingPlayer.vy -
      (horizontallyTouchingPlayer.y +
        horizontallyTouchingPlayer.height / 2 -
        state.ball.y) /
        10;
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
    state.ball.vy *= -1.2;
    const touchesBottom =
      state.ball.y + state.ball.radius >
      verticallyTouchingPlayer.y + verticallyTouchingPlayer.height;
    state.ball.y >
      verticallyTouchingPlayer.y + verticallyTouchingPlayer.height / 2;

    if (touchesBottom) {
      state.ball.y = clamp(
        verticallyTouchingPlayer.y + verticallyTouchingPlayer.height,
        WORLD_HEIGHT,
        state.ball.y
      );
    } else {
      state.ball.y = clamp(
        0,
        verticallyTouchingPlayer.y - state.ball.radius * 2,
        state.ball.y
      );
    }
  }
  state.ball.vx *= 0.9998;
  state.ball.vx = clamp(-3, 3, state.ball.vx);

  return state;
}
