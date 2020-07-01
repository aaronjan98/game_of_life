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
}
  