import * as PIXI from "pixi.js";
import { InteractionEvent } from "pixi.js";

const initialState = {
  ball: {
    x: 90,
    y: 0 + 1,
    radius: 0.3,
    vy: -0.3,
    vx: -0.3,
  },
  players: [
    { width: 2, height: 10, points: 0, x: 0, y: 0 },
    { width: 2, height: 10, points: 0, x: 98, y: 0 },
  ],
};

type Player = typeof initialState.players[0];
type State = typeof initialState;

//Create a Pixi Application
const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
});

const graphics = new PIXI.Graphics();

app.stage.addChild(graphics);

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

type Event = { type: "mousemove"; x: number; y: number };

function setup() {
  //Start the game loop by adding the `gameLoop` function to
  //Pixi's `ticker` and providing it with a `delta` argument.
  let state = initialState;
  let eventBuffer: Event[] = [];
  graphics.on("pointermove", onDragMove);
  function onDragMove(event: InteractionEvent) {
    eventBuffer.push({
      ...toWorldPosition(event.data.getLocalPosition(graphics)),
      type: "mousemove",
    });
  }

  app.ticker.add((delta) => {
    state = gameLoop(delta, state, eventBuffer);
    eventBuffer = [];
  });
}

graphics.interactive = true;

type Position = {
  x: number;
  y: number;
};

function toWorldPosition(screenPosition: Position) {
  return {
    x: (screenPosition.x / window.innerWidth) * 100,
    y: (screenPosition.y / window.innerHeight) * 100,
  };
}

function toScreenPosition(worldPosition: Position) {
  return {
    x: toScreenWidth(worldPosition.x),
    y: toScreenHeight(worldPosition.y),
  };
}

function toScreenWidth(worldWidth: number) {
  return (worldWidth / 100) * window.innerWidth;
}

function toScreenHeight(worldHeight: number) {
  return (worldHeight / 100) * window.innerHeight;
}

function ballTouchesPlayer(ball: State["ball"], player: Player) {
  return (
    ball.x + ball.radius * 2 > player.x &&
    ball.x < player.x + player.width &&
    ball.y + ball.radius * 2 > player.y &&
    ball.y < player.y + player.height
  );

  return true;
}

function update(delta: number, state: State, eventBuffer: Event[]): State {
  eventBuffer.forEach((event) => {
    if (event.type === "mousemove") {
      state.players[0].y = event.y;
    }
  });

  state.ball.x += state.ball.vx;
  state.ball.y += state.ball.vy;

  if (state.ball.y < 0 || state.ball.y > 100) {
    state.ball.vy *= -1;
  }

  if (state.players.some((player) => ballTouchesPlayer(state.ball, player))) {
    state.ball.vx *= -1;
  }

  return state;
}

function drawPlayer(player: Player) {
  graphics.beginFill(0xffffff, 1);
  const playerPosition = toScreenPosition(player);
  graphics.drawRect(
    playerPosition.x,
    playerPosition.y,
    toScreenWidth(player.width),
    toScreenHeight(player.height)
  );
  graphics.endFill();
}

function paint(state: State) {
  graphics.clear();
  graphics.lineStyle(0);
  graphics.beginFill(0xffffff, 1);
  const ballPosition = toScreenPosition(state.ball);
  const radius = toScreenWidth(state.ball.radius);
  graphics.drawCircle(
    ballPosition.x - radius,
    ballPosition.y - radius,
    toScreenWidth(state.ball.radius)
  );
  state.players.forEach(drawPlayer);
  graphics.endFill();
}

function gameLoop(delta: number, state: State, eventBuffer: Event[]) {
  const newState = update(delta, state, eventBuffer);
  paint(newState);
  return newState;
}

setup();
