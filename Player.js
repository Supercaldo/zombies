import GameObject from "./GameObject.js";
import Bullet from "./Bullet.js";
import { shootAudio } from "./index.js";

class Player extends GameObject {
  constructor(context, x, y, width, height, CONFIG) {
    // context, in order to associate it with global variable in index.js
    super(context, x, y, width, height, CONFIG);

    this.dx = 0;
    this.dy = 0;
    this.state = "idle";
    this.currentKeys = {};
    this.velocity = 0.3;
    this.lastDirection = 1;

    this.bullets = [];
  }
  // Keyboard methods

  init() {
    document.addEventListener("keydown", (event) => {
      this.currentKeys[event.code] = true;

      event.preventDefault();
    });
    document.addEventListener("keyup", (event) => {
      this.currentKeys[event.code] = false;
    });

    // Sprite application
    // Put image
    this.sprites = {
      idle: {
        src: "./assets/soldieridlesprite.png",
        frames: 2,
        fps: 2,
        image: null,
        frameSize: {
          width: 700 / 2,
          height: 400,
        },
      },
    };

    Object.values(this.sprites).forEach((sprite) => {
      sprite.image = new Image();
      sprite.image.src = sprite.src;
    });
  }

  // To change the keyboard movements from the position
  update(timePassedSinceLastRender) {
    // set the value of dx (along x axis)
    if (this.currentKeys["ArrowRight"] === true) {
      this.dx = 1;
    } else if (this.currentKeys["ArrowLeft"] === true) {
      this.dx = -1;
    } else {
      this.dx = 0;

      if (this.dx !== 0) this.lastDirection = this.dx;

      //BULLETS

      if (this.currentKeys["Space"] === true) {
        shootAudio.currentTime = 0;
        shootAudio.play();
        let bullet = new Bullet(
          this.context,
          this.x + 15,
          500,
          3,
          12,
          this.CONFIG
        );
        bullet.isMoving = true;
        this.bullets.push(bullet);
      }
    }

    // calculate new position
    this.x += timePassedSinceLastRender * this.dx * this.velocity;

    // setting boundaries
    // Right and left boundarie
    if (this.x + this.width / 0.55 > this.CONFIG.width)
      this.x = this.CONFIG.width - this.width / 0.55;
    else if (this.x - this.width / 0.6 < 0) this.x = 0 + this.width / 0.6;
  }

  render() {
    super.render();

    // move canvas origin to x
    this.context.translate(this.x, this.y);

    // Sprite

    let coords = this.getImageSpriteCoordinates(this.sprites.idle);

    this.context.drawImage(
      this.sprites.idle.image,
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
    bb.x = bb.x - bb.w * 0.5;
    bb.y = bb.y - bb.h * 0.5;

    return bb;
  }
}

export default Player;
