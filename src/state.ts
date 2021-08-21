import { getEvents } from "./enemy";
import { Event } from "./events";
import { WORLD_HEIGHT, WORLD_WIDTH } from "./world";
import { Player } from "./entities/player";
import { Bird } from "./entities/bird";

export interface State {
  bird: Bird;
  players: Player[];
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

function ballTouchesPlayerSide(ball: State["bird"], player: Player) {
  return (
    ball.x + ball.radius * 2 > player.x &&
    ball.x < player.x + player.width &&
    ball.y + ball.radius > player.y &&
    ball.y + ball.radius < player.y + player.height
  );
}
function ballTouchesPlayerTopOrBottom(ball: State["bird"], player: Player) {
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

function gameOver(state: State) {
  return state.bird.x < -70 || state.bird.x > WORLD_WIDTH + 70;
}

export function update(
  delta: number,
  state: State,
  eventBuffer: Event[]
): State {
  updatePlayer(state.players[0], eventBuffer);
  updatePlayer(state.players[1], getEvents(state));
  // state.bird.x += state.bird.vx;
  state.bird.y += state.bird.vy;

  if (
    state.bird.y <= 0 ||
    state.bird.y + state.bird.radius * 2 >= WORLD_HEIGHT
  ) {
    state.bird.vy *= -1;
  }

  const horizontallyTouchingPlayer = state.players.find((player) =>
    ballTouchesPlayerSide(state.bird, player)
  );
  if (horizontallyTouchingPlayer) {
    state.bird.vx *= -1.15;
    state.bird.vy =
      horizontallyTouchingPlayer.vy -
      (horizontallyTouchingPlayer.y +
        horizontallyTouchingPlayer.height / 2 -
        state.bird.y) /
        10;
    state.bird.x = clamp(
      PLAYER_WIDTH + 2,
      WORLD_WIDTH - PLAYER_WIDTH - 2,
      state.bird.x
    );
  }
  const verticallyTouchingPlayer = state.players.find((player) =>
    ballTouchesPlayerTopOrBottom(state.bird, player)
  );
  if (verticallyTouchingPlayer) {
    state.bird.vy *= -1.2;
    const touchesBottom =
      state.bird.y + state.bird.radius >
      verticallyTouchingPlayer.y + verticallyTouchingPlayer.height;
    state.bird.y >
      verticallyTouchingPlayer.y + verticallyTouchingPlayer.height / 2;

    if (touchesBottom) {
      state.bird.y = clamp(
        verticallyTouchingPlayer.y + verticallyTouchingPlayer.height,
        WORLD_HEIGHT,
        state.bird.y
      );
    } else {
      state.bird.y = clamp(
        0,
        verticallyTouchingPlayer.y - state.bird.radius * 2,
        state.bird.y
      );
    }
  }
  state.bird.vx *= 0.9998;
  state.bird.vx = clamp(-3, 3, state.bird.vx);
  state.bird.y = clamp(0, WORLD_HEIGHT - state.bird.radius * 2, state.bird.y);
  if (gameOver(state)) {
    return getInitialState();
  }

  return state;
}
