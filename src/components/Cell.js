class Cell {
    constructor(alive=false, age=0) {
      this.alive = alive;
      this.age = age;
      this.neighborCount = 0;
    }
  
    kill = () => {
      this.alive = false;
    };
  
    toggle = () => {
      this.alive = !this.alive;
    };

    draw_cell = (max_age=this.age) => {
        this.alive = true;
        this.age = max_age;
    }

    re_draw_cell = (max_age) => {
        if (this.age == max_age) {
            this.alive = !this.alive;
            this.age = 0;
        }
        else {
            this.alive = !this.alive;
            this.age = max_age;
        }
    }
}
  