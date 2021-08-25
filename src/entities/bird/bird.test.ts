import { getInitialState } from "../../state/initial-state";
import { update } from "./state";

describe("when bird isn't hitting the bat", () => {
  it("doesn't change direction", () => {
    const state = getInitialState();

    state.players[0].y = 33;
    state.bird.y = 36;

    state.bird = {
      radius: 2.5,
      vx: -0.583314699975483,
      vy: -0.1,
      x: 15.990185177431195,
      y: 35.7999999999998,
    };

    const originalVX = state.bird.vx;
    update(state);

    // Expect the direction the bird is heading to still be the same
    expect(Math.sign(state.bird.vx)).toBe(Math.sign(originalVX));
  });
});
