p5.disableFriendlyErrors = true;

let grid;
let cnv;
let speed = null; // higher number = slower render speed
let isRunning = false;
let startingResolution;
let blurAmount = 255;

function setup() {
  cnv = createCanvas(windowWidth, windowHeight / 2);
  cnv.parent("canvas");
  startingResolution = windowWidth * (windowHeight / 2);
  colorMode(HSB);
  grid = new Grid(width, height, 20);
  grid.init();
}

function draw() {
  if (isRunning) {
    if (frameCount % speed === 0) {
      blur(blurAmount);
      colorMode(HSB);
      stroke(0);
      grid.runSimulation();
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

function blur(amount) {
  colorMode(RGB);
  fill(0, amount);
  noStroke();
  rect(0, 0, width, height);
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
  background(0);
  isRunning = false;
  playBtn.textContent = "start";
  generation.textContent = 0;
});

reseed.addEventListener("click", () => {
  clear();
  background(0);
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
