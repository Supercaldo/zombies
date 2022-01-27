import Player from "./Player.js";
import Zombie from "./Zombie.js";
import Bullet from "./Bullet.js";
import PointsDisplay from "./PoinstDisplay.js";
import RandomDispatcher, { randomNumberBetween } from "./RandomDispatcher.js";

//global variables

let context;
let lastTickTimestamp;
let player;
let gameObjects = [];
let zombies = [];
let bullets = [];
let pointsDisplay;
let stopEverything = false;
let stage = 1;
let velocity = 1;
export let shootAudio = new Audio("./sounds/shoot5.mp3");
let gameMusic = new Audio("./sounds/music.mp3");
gameMusic.volume = 0.5

//Menu Interaction

document.querySelector("#startButton").addEventListener("click", function () {
  document.querySelector(".startMenu").style.display = "none";
  requestAnimationFrame(gameLoop);
  gameMusic.currentTime = 0
 gameMusic.play()
});

document.querySelector("#restartButton").addEventListener("click", function () {
  document.querySelector(".endMenu").style.display = "none";
  gameMusic.currentTime = 0
 gameMusic.play()
  zombies.splice(0, zombies.length);
  gameObjects.splice(0, gameObjects.length);

  pointsDisplay = new PointsDisplay(context, CONFIG.width - 30, 30);
  velocity = 1;
  stage = 1;

  stopEverything = false;
});

//Main CONFIG Canvas

const CONFIG = {
  width: 800,
  height: 600,
};

//Init Function
const init = () => {
  let canvas = document.getElementById("canvas");
  context = canvas.getContext("2d");

  canvas.setAttribute("width", CONFIG.width);
  canvas.setAttribute("height", CONFIG.height);

  //Passing the global variable "context" to Player.js (module concept)
  player = new Player(context, 500, 500, 100, 100, CONFIG);

  let bullet = new Bullet(context, 500, 500, 5, 12, CONFIG);
  bullet.isMoving = true;
  bullets.push(bullet);

  // Creating More Zombies
  let dispatcherOptions = { min: 1500, max: 10000 };
  let randomDispatcher = new RandomDispatcher(() => {
    let newX = randomNumberBetween(200, CONFIG.width - 200);
    let newY = randomNumberBetween(50, 100);

    lastTickTimestamp = performance.now();
    requestAnimationFrame(render);

    let randomZombie = new Zombie(
      context,
      newX,
      newY,
      95,
      95,
      CONFIG,
      velocity
    );
    zombies.push(randomZombie);
    gameObjects.push(randomZombie);
  }, dispatcherOptions);

  // Create PointsDisplay

  pointsDisplay = new PointsDisplay(context, CONFIG.width - 30, 30);

  lastTickTimestamp = performance.now();
  gameLoop();
};

const gameLoop = () => {
  let timePassedSinceLastRender = performance.now() - lastTickTimestamp;
  update(timePassedSinceLastRender);
  render();

  gameObjects = gameObjects.filter((e) => !e.markedForDelete);

  //set lastTickTimestamp to "now"

  lastTickTimestamp = performance.now();

  // call next iteration of the game loop
  requestAnimationFrame(gameLoop);
};

const update = (timePassedSinceLastRender) => {
  if (!stopEverything) {
    if (pointsDisplay.points > 49 * stage) {
      ++stage;

      velocity += 2;
    }

    player.update(timePassedSinceLastRender);

    let bulletsToRemove = [];
    let gameObjectsToRemove = [];

    // check if each bullet is colliding with and of the zombies and insert the bullet
    // and the zombies into a remove array

    player.bullets.forEach((bullet) => {
      gameObjects.forEach((gameObject) => {
        if (gameObject instanceof Zombie) {
          if (checkCollisionBetween(bullet, gameObject)) {
            bulletsToRemove.push(bullet);
            gameObject.markedForDelete = true;
            //gameObjectsToRemove.push(gameObject);
            pointsDisplay.increase();
          }
        }
      });

      // remove bullets beyond the end of canvas

      if (bullet.y <= -12) {
        // -12 pixel outside the canvas
        bulletsToRemove.push(bullet);
      }
      // bulletsToRemove = bulletsToRemove.filter(e => !e.markedForDelete);
      bullet.update();
    });

    // remove the bullets

    bulletsToRemove.forEach((bullet) => {
      player.bullets.splice(player.bullets.indexOf(bullet), 1);
    });

    gameObjects = gameObjects.filter((e) => !e.markedForDelete);
  

    // remove the zombies

    // Update all game objects
    gameObjects.forEach((gameObject) => {
      gameObject.update(timePassedSinceLastRender);
    });

    // Update the points
    pointsDisplay.update(timePassedSinceLastRender);

    // check Collision Between Player and Zombies

    zombies.forEach(function (zombie) {
      if (zombie.y - zombie.height / 2 > CONFIG.height) {
        stopEverything = true;

        document.querySelector(".endMenu").style.display = "block";
        gameMusic.pause()
      }

      let isColliding = checkCollisionBetween(player, zombie);
      zombie.isColliding = isColliding;
    });

    // Implement Game Over when the Player Colide the Zombies

    zombies
      .filter(function (zombie) {
        return zombie.isColliding == true;
      })
      .forEach(function (zombie, position) {
        zombies.splice(position, 1);
        gameObjects.splice(gameObjects.indexOf(zombie), 1);
        document.querySelector(".endMenu").style.display = "block";
        gameMusic.pause()
    
      });
  }
};

// Render Function
const render = () => {

  // clear the canvas

  context.clearRect(0, 0, CONFIG.width, CONFIG.height);


  player.bullets.forEach((bullet) => {
    bullet.render();
  });

  //render all game objects

  gameObjects.forEach((gameObject) => {
    gameObject.render();
  });

  // Render the points to display
  pointsDisplay.render();

  player.render();
};

let checkCollisionBetween = (gameObjectA, gameObjectB) => {
  let bbA = gameObjectA.getBoundingBox();
  let bbB = gameObjectB.getBoundingBox();

  if (
    bbA.x < bbB.x + bbB.w &&
    bbA.x + bbA.w > bbB.x &&
    bbA.y < bbB.y + bbB.h &&
    bbA.y + bbA.h > bbB.y
  ) {
    // collision happened
    return true;
  } else return false;
};

window.addEventListener("load", () => {
  init();
});
