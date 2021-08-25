import { State } from "../../state";
import { PLAYER_WIDTH, WORLD_HEIGHT, WORLD_WIDTH } from "../../config";
import { Player } from "../player";
import { Event } from "../../events";

function ballTouchesPlayerSide(ball: State["bird"], player: Player) {
  return (
    ball.x + ball.radius * 2 > player.x &&
    ball.x < player.x + player.width * 2 &&
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

export function update(state: State, eventBuffer: Event[], delta: number) {
  // Jumping
  const jumpInput = eventBuffer.find(({ type }) => type === "space");
  if (jumpInput && (!state.bird.jumping || state.bird.hasBeenJumpingFor > 20)) {
    state.bird.vy = -1.5;
    state.bird.jumping = true;
  }

  if (state.bird.jumping) {
    state.bird.hasBeenJumpingFor += delta;

    if (state.bird.hasBeenJumpingFor > 30) {
      state.bird.jumping = false;
      state.bird.hasBeenJumpingFor = 0;
    }

    state.bird.vy += 0.08;
  }

  state.bird.x += state.bird.vx;
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
}
