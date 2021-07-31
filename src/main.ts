import * as PIXI from 'pixi.js';
import { InteractionData, InteractionEvent } from 'pixi.js';

let type = 'WebGL';
if (!PIXI.utils.isWebGLSupported()) {
  type = 'canvas';
}

const ball = {
  x: 100,
  y: 250,
  vy: 0,
  vx: 0
};

//Create a Pixi Application
let app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight
});

const graphics = new PIXI.Graphics();

const hitArea = new PIXI.Circle(ball.x, ball.y, 50);
// Circle
graphics.lineStyle(0); // draw a circle, set the lineStyle to zero so the circle doesn't have an outline
graphics.beginFill(0xde3249, 1);
graphics.drawCircle(ball.x, ball.y, 50);
graphics.endFill();

app.stage.addChild(graphics);

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

function setup() {
  //Start the game loop by adding the `gameLoop` function to
  //Pixi's `ticker` and providing it with a `delta` argument.
  app.ticker.add(delta => gameLoop(delta));
}

graphics
  .on('pointerdown', onDragStart)
  .on('pointerup', onDragEnd)
  .on('pointerupoutside', onDragEnd)
  .on('pointermove', onDragMove);

let dragging = false;
let dragStart: InteractionData | null = null;

function onDragStart(event: InteractionEvent) {
  dragStart = event.data;
  dragging = true;
}

function onDragEnd() {
  dragging = false;
  // set the interaction data to null
  dragStart = null;
}

function onDragMove() {
  if (dragging) {
    const newPosition = dragStart!.getLocalPosition(graphics.parent);
    ball.x = newPosition.x;
    ball.y = newPosition.y;
  }
}

graphics.interactive = true;

function gameLoop(delta) {
  //Move the cat 1 pixel
  //ball.x += 1;
  graphics.clear();
  graphics.lineStyle(0); // draw a circle, set the lineStyle to zero so the circle doesn't have an outline
  graphics.beginFill(0xde3249, 1);
  graphics.drawCircle(ball.x, ball.y, 50);
  graphics.endFill();
  hitArea.x = ball.x;
  hitArea.y = ball.y;
}

setup();
