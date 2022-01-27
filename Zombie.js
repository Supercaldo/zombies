import GameObject from "./GameObject.js";

const images = ["zombie1.png", "zombie2.png"];

class Zombie extends GameObject {
  //object
  constructor(context, x, y, width, height, CONFIG, speedIncrease) {
    super(context, x, y, width, height, CONFIG);

    this.markedForDelete = false;

    this.state = "walk";

    this.velocity = speedIncrease;
  }

  init() {
    // Sprite Code

    //#region Draw Image for sprites

    this.whichImage = Math.random() > 0.5 ? 1 : 0;

    this.sprites = {
      walk: {
        src: `./assets/zombie${this.whichImage}sprite.png`,
        frames: 2,
        fps: 1.1,
        frameSize: {
          width: 700 / 2,
          height: 400,
        },
        image: null,
      },
    };

    Object.values(this.sprites).forEach((sprite) => {
      sprite.image = new Image();
      sprite.image.src = sprite.src;
    });
  }

  update() {
    this.y += 0.4 * this.velocity;
  }

  render() {
    super.render();

    // move canvas origin to x
    this.context.translate(this.x, this.y);

    // Sprite

    let coords = this.getImageSpriteCoordinates(this.sprites[this.state]);

    this.context.drawImage(
      this.sprites[this.state].image,
      coords.sourceX,
      coords.sourceY,
      coords.sourceWidth,
      coords.sourceHeight,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );
    this.context.resetTransform();
  }

  getImageSpriteCoordinates(sprite) {
    let frameX = Math.floor(
      ((performance.now() / 1000) * sprite.fps) % sprite.frames
    );

    let coords = {
      sourceX: frameX * sprite.frameSize.width,
      sourceY: 0,
      sourceWidth: sprite.frameSize.width,
      sourceHeight: sprite.frameSize.height,
    };
    return coords;
  }

  getBoundingBox() {
    let bb = super.getBoundingBox();

    bb.w = bb.w * 0.5;
    bb.x = bb.x - bb.w * 0.7;
    bb.y = bb.y - bb.h * 0.5;

    return bb;
  }
}

export default Zombie;
