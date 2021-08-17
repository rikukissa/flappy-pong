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
