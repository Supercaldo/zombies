import GameObject from "./GameObject.js";

class Bullet extends GameObject {
  constructor(context, x, y, width, height, CONFIG) {
    // context, in order to associate it with global variable in index.js
    super(context, x, y, width, height, CONFIG);

    this.dx = 0;
    this.dy = 0;

    this.currentKeys = {};
    this.velocity = 0.3;
    this.lastDirection = 1;
    this.isMoving = false;
    this.yStep = 4;
    this.timer = 0;
  }

  update() {
    if (this.isMoving == true) {
      this.y -= this.yStep;
    }
  }

  render() {
    this.context.beginPath();
    this.context.fillRect(this.x, this.y, this.width, this.height);
  }
}

export default Bullet;
