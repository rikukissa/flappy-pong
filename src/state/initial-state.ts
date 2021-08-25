import {
  PLAYER_HEIGHT,
  PLAYER_WIDTH,
  WORLD_HEIGHT,
  WORLD_WIDTH,
} from "../config";

export const getInitialState = () => ({
  bird: {
    x: WORLD_WIDTH / 2,
    y: WORLD_HEIGHT / 2,
    radius: 2.5,
    vy: -0.1,
    vx: -0.6,
    jumping: false,
    hasBeenJumpingFor: 0,
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
