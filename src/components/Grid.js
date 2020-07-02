class Grid {
    constructor(width, height, resolution = 15) {
      this.resolution = resolution;
      this.width = width;
      this.height = height;
      this.cols = floor(this.width / this.resolution);
      this.rows = floor(this.height / this.resolution);
      this.items = new Array(this.cols);
      this.next = new Array(this.cols);
      this.maxTotal = 0;
    }
  
    init = (dimensions) => {
        this.setMinimumDensity();
        this.make2DArray(this.items);

        this.make2DArray(this.next);
        this.populateGrid();
        this.countNeighbors();

        this.render();
    };
  
    setMinimumDensity = () => {
      if (this.cols * this.rows <= 10000) {
        this.resolution = 10;
        this.cols = floor(this.width / this.resolution);
        this.rows = floor(this.height / this.resolution);
      }
    };
  
    make2DArray = (arr) => {
      for (let x = 0; x < this.cols; x++) {
        arr[x] = new Array(this.rows);
      }
    };
    
    // populate grid with random live/dead cells
    populateGrid = () => {
      this.loopRunner((x, y) => {
        let rand = floor(random(1.6));
        let alive, age;
        this.maxTotal = 1;
        
        if (rand){
            alive = true
            age = 1
        }else{
            alive = false
            age = 0
        }
        this.items[x][y] = new Cell(alive, age);
      });
    };
  
    render = () => {
        this.loopRunner((x, y, w, h) => {
            
            if (this.items[x][y].age > this.maxTotal) {
                this.maxTotal = this.items[x][y].age;
            };
            
            let normalized
            
            // can't divide by 0 so setting normalized to 0
            if (this.maxTotal == 0 || this.items[x][y].age == 0) {
                normalized = 0;
            }
            else {
                // normalize maxTotal and scale the hsl value accordingly
                normalized = this.items[x][y].age / this.maxTotal;
            }
            // normalized should be a value between 0 and 1
            const hue = (1 - normalized) * 240;
            // 240 is purple
            fill(`hsl(${Math.floor(hue)}, 100%, 50%)`);
            rect(w, h, this.resolution, this.resolution);
        });
    };
  
    clicked = (mouseX, mouseY) => {
      this.loopRunner((x, y, w, h) => {
        // check if mousePressed location is within bounds
        if (
          mouseX > w &&
          mouseX < w + this.resolution &&
          mouseY > h &&
          mouseY < h + this.resolution
        ) {
          this.items[x][y].draw_cell(this.maxTotal);
        }
      });
    };

    re_push = (mouseX, mouseY) => {
      this.loopRunner((x, y, w, h) => {
        // check if mousePressed location is within bounds
        if (
          mouseX > w &&
          mouseX < w + this.resolution &&
          mouseY > h &&
          mouseY < h + this.resolution
        ) {
            this.items[x][y].re_draw_cell(this.maxTotal);
        }
      });
    };
  
    countNeighbors = () => {
      this.loopRunner((x, y) => {
        // reset neighborCount
        this.items[x][y].neighborCount = 0;
  
        // loop over adjacent cells +/- 1
        for (let i = -1; i < 2; i++) {
          for (let j = -1; j < 2; j++) {
            // use modulo to wrap around for edge cells
            let col = (x + i + this.cols) % this.cols;
            let row = (y + j + this.rows) % this.rows;
  
            // omit self from count
            if (i !== 0 || j !== 0) {
              // only count live neighbors
              if (this.items[col][row].alive === true) {
                this.items[x][y].neighborCount++;
              }
            }
          }
        }
      });
    };
  
    runSimulation = (dimensions) => {
        this.countNeighbors();
        this.next = this.items

        this.loopRunner((x, y, w, h) => {
            let cell = this.items[x][y];
            let age = cell.age
            
            // underpopulation
            if (cell.neighborCount < 2) {
                this.next[x][y] = new Cell(false, age);
            }
            // overpopulation
            else if (cell.neighborCount > 3) {
                this.next[x][y] = new Cell(false, age);
            }
            // reproduction
            else if (cell.neighborCount === 3) {
                this.next[x][y] = new Cell(true, ++age);
            }
            // if surrounded by two or three cells, it'll stay alive
            else if (cell.alive) {
                this.next[x][y] = new Cell(true, ++age);
            }

        });

        // swap the hidden buffer to display
        this.items = this.next;
        this.render();
    };
  
    resize = (w, h) => {
      this.width = w;
      this.height = h;
      this.cols = floor(this.width / this.resolution);
      this.rows = floor(this.height / this.resolution);
    };
  
    clear = (dimensions) => {
      this.loopRunner((x, y) => {
        this.items[x][y].kill();
        this.items[x][y].age = 0;
      });
      this.maxTotal = 1;
      this.render();
    };
  
    reseed = (dimensions) => {
    //   this.clear();
      this.populateGrid();
      this.countNeighbors();
      this.render();
    };
  
    clamp = (value, min, max) => {
      if (value < min) {
        value = min;
      } else if (value > max) {
        value = max;
      }
  
      return value;
    };
  
    loopRunner = (callback) => {
      for (let x = 0; x < this.cols; x++) {
        for (let y = 0; y < this.rows; y++) {
          let w = x * this.resolution;
          let h = y * this.resolution;
          callback(x, y, w, h);
        }
      }
    };
}
  