p5.disableFriendlyErrors = true;

let grid;
let cnv;
let speed = null; // higher number = slower render speed
let isRunning = false;
let startingResolution;
let blurAmount = 255;

function setup() {
  cnv = createCanvas(windowWidth, windowHeight / 1.5);
  cnv.parent("canvas");
  startingResolution = windowWidth * (windowHeight / 1.5);

  grid = new Grid(width, height, 15);
  grid.init();
}

function draw() {
  if (isRunning) {
    // if statement slows down the rate because as speed is decreased, its value actually increases -- meaning less frameCounts go into speed and slowing the rate
    if (frameCount % speed === 0) {
      // runs the whole animation
      grid.runSimulation();
      //keeps track of the generation
      let gen = generation.textContent;
      generation.textContent = Number(gen) + 1;
    }
  }
}

function mousePressed() {
  if (!isRunning) {
    grid.clicked(mouseX, mouseY);
    grid.render();
    grid.countNeighbors();
  }
}

function mouseDragged() {
  // background(0);
  if (!isRunning) {
    // only run if mouse is within sketch bounds
    if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
      grid.clicked(mouseX, mouseY);
      grid.render();
    }
  }
}

function mouseReleased() {
  if (!isRunning) {
    // don't bother counting neighbors until user drawing is complete
    grid.countNeighbors();
  }
}

function windowResized() {
  // don't allow canvas to grow beyond initial size - prevents array out of bounds errors
  // it could be possible to recreate the arrays on resize (larger than initial size) for a more complete fix
  if (windowWidth * (windowHeight / 2) < startingResolution) {
    resizeCanvas(windowWidth, floor(windowHeight * 0.5));
    background(0);
    grid.resize(width, height);
  }
  grid.render();
}

// DOM stuff
const playBtn = document.querySelector("#playback");
const clearBtn = document.querySelector("#clear");
const reseed = document.querySelector("#reseed");
const speedSlider = document.querySelector("#speed");
const generation = document.querySelector("#generation");
const blurSlider = document.querySelector("#blur");

playBtn.addEventListener("click", () => {
  isRunning = !isRunning;
  if (isRunning) {
    playBtn.textContent = "stop";
  } else {
    playBtn.textContent = "start";
  }
});

clearBtn.addEventListener("click", () => {
  grid.clear();
//   fill(`hsl(240, 100%, 50%)`);

  background(`hsl(240, 100%, 50%)`);
  isRunning = false;
  playBtn.textContent = "start";
  generation.textContent = 0;
});

reseed.addEventListener("click", () => {
  clear();
  background(`hsl(240, 100%, 50%)`);
  grid.reseed();
});

// set initial speed
// invert range (low values = high speeds)
// 60 = max value + 1
speed = 61 - speedSlider.value;

speedSlider.addEventListener("input", (e) => {
  speed = 61 - e.target.value;
});

blurSlider.addEventListener("input", (e) => {
  blurAmount = 260 - Number(e.target.value);
});
