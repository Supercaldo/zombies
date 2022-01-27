import GameObject from "./GameObject.js";

class PointsDisplay extends GameObject {
  constructor(context, x, y, width, height, CONFIG) {
    super(context, x, y, width, height, CONFIG);

    this.points = 0;
  }

  init() {}
  update() {}

  render() {
    this.context.fillStyle = "darkblue";
    this.context.beginPath();
    this.context.ellipse(
      this.x - 6,
      this.y + 6,
      35,
      35,
      2 * Math.PI,
      0,
      2 * Math.PI
    );
    this.context.fill();
    this.context.font = "bold 30px monospace";
    this.context.fillStyle = "orange";
    this.context.textAlign = "center";
    this.context.fillText(this.points, this.x - 6, this.y + 15);
  }
  increase() {
    this.points++;
  }
}

export default PointsDisplay;
