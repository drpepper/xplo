//import "../node_modules/babel-polyfill/dist/polyfill.js";
import * as util from "./util.js";
import "../node_modules/url-search-params-polyfill/index.js";


const APP_SIZE = new PIXI.Point(960, 540);

const PHYSICS_ZOOM = 100;
const INITIAL_ZOOM = 60;

const COLLISION_GROUPS = {
  GROUND: Math.pow(2,0),
  PLAYER_0: Math.pow(2,1),
  PLAYER_1: Math.pow(2,2),
  OBSTACLE: Math.pow(2,3),
};

const COLLISION_MASKS = {
  GROUND: COLLISION_GROUPS.PLAYER_0 | COLLISION_GROUPS.PLAYER_1 | COLLISION_GROUPS.OBSTACLE,
  PLAYER_0: COLLISION_GROUPS.GROUND | COLLISION_GROUPS.PLAYER_1 | COLLISION_GROUPS.OBSTACLE,
  PLAYER_1: COLLISION_GROUPS.GROUND | COLLISION_GROUPS.PLAYER_0 | COLLISION_GROUPS.OBSTACLE,
  OBSTACLE: COLLISION_GROUPS.OBSTACLE | COLLISION_GROUPS.GROUND | COLLISION_GROUPS.PLAYER_0 | COLLISION_GROUPS.PLAYER_1,
}

const READY_TIME = 3000;
const BATTLE_TIME = 30000;
const WINNING_TIME = 3000;

const BLOCK_HEALTH = 5; 

const MOTOR_SPEED = 15;
const CAR_JUMP_DELAY = 2000;
const CAR_JUMP_SPEED = 22;

const HELICOPTER_SPEED = 10;
const HELICOPTER_LIFT = 10;

const HELICOPTER_BULLET_SPEED = 10;
const CAR_BULLET_SPEED = 15;

const FIRE_DELAYS = {
  bullet: 200,
  rocket: 800,
};

const HIT_FLASH_TIME = 100;

// String of characters to look for in icon font
const FONT_OBSERVER_CHARS = "asdf";

const STARTING_SCENE = "battle";

const GRAPHICAL_ASSETS = [
  "loading-circle.png",
  "play.png",
  "wheel.png",
  "box.png",
  "bullet.png",
  "explosion.json",
  "helicopter.png",
  "helicopter_propeller.json",
  "hit.png",
  "block.png",
  "ready.png",
  "trophy.png",
  "tie.png",
  "rocket.png",
];

const MUSIC_ASSETS = [];

const FX_ASSETS = [
  "explosion_0.mp3",
  "explosion_1.mp3",
  "explosion_2.mp3",
  "explosion_3.mp3",
  "fire_0.mp3",
  "fire_1.mp3",
  "fire_2.mp3",
  "shoot_0.mp3",
  "shoot_1.mp3",
  "shoot_2.mp3",
  "shoot_3.mp3",
];

const VIDEO_ASSETS = [];

const FONTS = [];

// Exported manually from Tiled Editor
const MAPS = {
  bridge: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  mountain: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
  half: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  platforms: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
};


class ReadyScene extends util.CompositeEntity {
  setup(config) {
    super.setup(config);

    const bg = new PIXI.Graphics();
    bg.beginFill(0xffffff);
    bg.drawRect(0, 0, this.config.app.renderer.width, this.config.app.renderer.height);
    this.container.addChild(bg);

    const readyGraphics = makeSprite("images/ready.png");
    readyGraphics.anchor.set(0.5);
    readyGraphics.position.set(this.config.app.renderer.width / 2, this.config.app.renderer.height / 2);
    this.container.addChild(readyGraphics);

    return this.container;
  }

  requestedTransition(options) {
    super.requestedTransition(options);

    return options.timeSinceStart > READY_TIME;
  }
}


class WinningScene extends util.CompositeEntity {
  constructor(result, winner) {
    super();

    this.result = result;
    this.winner = winner;
  }

  setup(config) {
    super.setup(config);

    const bg = new PIXI.Graphics();
    bg.beginFill(0xffffff);
    bg.drawRect(0, 0, this.config.app.renderer.width, this.config.app.renderer.height);
    this.container.addChild(bg);

    if(this.result === "win") {
      const trophyGraphics = makeSprite("images/trophy.png");
      trophyGraphics.anchor.set(0.5);
      trophyGraphics.position.set(this.config.app.renderer.width / 2, this.config.app.renderer.height / 2);
      this.container.addChild(trophyGraphics);

      const winnerName = new PIXI.Text(`Player ${this.winner + 1}`, {
        fontFamily : 'Courier New', 
        fontSize: 48, 
        fill: 0x000000, 
        align: 'center',
      });
      winnerName.anchor.set(0.5);
      winnerName.position.set(this.config.app.renderer.width / 2, 500);
      this.container.addChild(winnerName);
    } else {
      const tieGraphics = makeSprite("images/tie.png");
      tieGraphics.anchor.set(0.5);
      tieGraphics.position.set(this.config.app.renderer.width / 2, this.config.app.renderer.height / 2);
      this.container.addChild(tieGraphics);
    }

    return this.container;
  }

  requestedTransition(options) {
    super.requestedTransition(options);

    return options.timeSinceStart > WINNING_TIME;
  }
}


class BattleScene extends util.CompositeEntity {
  setup(config) {
    super.setup(config);

    world = new p2.World({
      gravity: [0,-10] // Set gravity to -10 in y direction
    });
    world.defaultContactMaterial.friction = 100;

    world.on("beginContact", this.onBeginContact.bind(this));

    this.scores = [0, 0];

    // Graphics:
    const bg = new PIXI.Graphics();
    bg.beginFill(0xffffff);
    bg.drawRect(0, 0, this.config.app.renderer.width, this.config.app.renderer.height);
    this.container.addChild(bg);

    this.timerText = new PIXI.Text("GO" ,{
      fontFamily : 'Courier New', 
      fontSize: 24, 
      fill: 0x000000, 
      align: 'center'
    });
    this.timerText.anchor.set(.5, 0);
    this.timerText.position.set(this.config.app.renderer.width / 2, 0);
    this.container.addChild(this.timerText);

    this.scoreTexts = [null, null];

    this.scoreTexts[0] = new PIXI.Text("0" ,{
      fontFamily : 'Courier New', 
      fontSize: 24, 
      fill: 0x000000, 
      align: 'left'
    });
    this.scoreTexts[0].position.set(10, 0);
    this.container.addChild(this.scoreTexts[0]);

    this.scoreTexts[1] = new PIXI.Text("0" ,{
      fontFamily : 'Courier New', 
      fontSize: 24, 
      fill: 0x000000, 
      align: 'right'
    });
    this.scoreTexts[1].anchor.set(1, 0);
    this.scoreTexts[1].position.set(this.config.app.renderer.width - 10, 0);
    this.container.addChild(this.scoreTexts[1]);


    this.physicsContainer = new PIXI.Container();
    this.container.addChild(this.physicsContainer);

    // Add transform to the container
    this.physicsContainer.position.x = this.config.app.renderer.width/2; // center at origin
    this.physicsContainer.position.y = this.config.app.renderer.height/2;
    this.physicsContainer.scale.x =  INITIAL_ZOOM;  // zoom in
    this.physicsContainer.scale.y = -INITIAL_ZOOM; // Note: we flip the y axis to make "up" the physics "up"

    {   
      // Create ground shape (plane)
       const planeShape = new p2.Plane({
        collisionGroup: COLLISION_GROUPS.GROUND,
        collisionMask: COLLISION_MASKS.GROUND,
      });
      // Create a body for the ground
      const planeBody = new p2.Body({
        position: [0, -4],
        mass: 0,  // Mass == 0 makes the body static
      });
      planeBody.role = "ground";
      planeBody.addShape(planeShape); // Add the shape to the body
      world.addBody(planeBody);       // Add the body to the World
    }
    {   
      // Top wall
       const planeShape = new p2.Plane({
        collisionGroup: COLLISION_GROUPS.GROUND,
        collisionMask: COLLISION_MASKS.GROUND,
      });
      // Create a body for the ground
      const planeBody = new p2.Body({
        position: [0, 4],
        angle: Math.PI,
        mass: 0,  // Mass == 0 makes the body static
      });
      planeBody.role = "ground";
      planeBody.addShape(planeShape); // Add the shape to the body
      world.addBody(planeBody);       // Add the body to the World
    }
    // Right wall
    {   
       const planeShape = new p2.Plane({
        collisionGroup: COLLISION_GROUPS.GROUND,
        collisionMask: COLLISION_MASKS.GROUND,
      });
      // Create a body for the ground
      const planeBody = new p2.Body({
        position: [8, 0],
        angle: Math.PI / 2,
        mass: 0,  // Mass == 0 makes the body static
      });
      planeBody.role = "ground";
      planeBody.addShape(planeShape); // Add the shape to the body
      world.addBody(planeBody);       // Add the body to the World
    }
    // Left wall
    {   
       const planeShape = new p2.Plane({
        collisionGroup: COLLISION_GROUPS.GROUND,
        collisionMask: COLLISION_MASKS.GROUND,
      });
      // Create a body for the ground
      const planeBody = new p2.Body({
        position: [-8, 0],
        angle: -Math.PI / 2,
        mass: 0,  // Mass == 0 makes the body static
      });
      planeBody.role = "ground";
      planeBody.addShape(planeShape); // Add the shape to the body
      world.addBody(planeBody);       // Add the body to the World
    }


    const map = _.sample(MAPS);
    for(let i = 0; i < 16 * 32; i++) {
      const row = Math.floor(i / 32);
      const col = i % 32;
      if(map[i]) {
        this.makeBlock([-7.75 + col * 0.5, 3.75 -row * 0.5]);
      }
    }

    this.players = [null, null];

    this.players[0] = new (this._chooseVehicleClass())([-7, 1], 0, this._chooseBulletType());
    this.players[1] = new (this._chooseVehicleClass())([7, 1], 1, this._chooseBulletType());
    for(let i = 0; i < 2; i++) {
      this.players[i].on("fire", this.onFire, this);
      this.physicsContainer.addChild(this.players[i].setup(config));
      this.addEntity(this.players[i]);
    }

    return this.container;
  }

  update(options) {
    // Move physics bodies forward in time
    world.step(1/60);

    super.update(options);

    this.timerText.text = `Time remaining:\n${Math.floor((BATTLE_TIME - options.timeSinceStart) / 1000)} seconds`;

    for(let i = 0; i < 2; i++) {
      this.scoreTexts[i].text = `Player ${i + 1}:\n${this.scores[i]} points`;
    }
  }

  requestedTransition(options) {
    if(options.timeSinceStart <= BATTLE_TIME) return null;

    if(this.scores[0] == this.scores[1]) {
      return {
        name: "done",
        params: {
          result: "tie",
        },
      };
    } else {
      return { 
        name: "done",
        params: {
          result: "win", 
          winner: this.scores[0] > this.scores[1] ? 0 : 1,
        },
      };
    }
  }

  teardown() {
    world.clear();
  }

  onBeginContact(e) {
    if(e.bodyA.role === "bullet") {
      this.handleBulletContact(e.bodyA, e.bodyB);
    } else if(e.bodyB.role === "bullet") {
      this.handleBulletContact(e.bodyB, e.bodyA);
    }
  }

  handleBulletContact(bulletBody, otherBody) {
    this.destroyBullet(bulletBody);

    // Handle other body
    if(otherBody.role === "player") {
      this.players[otherBody.playerNumber].onHit();

      const explosionIndex = _.sample(_.range(4));
      fxAudio[`explosion_${explosionIndex}.mp3`].play();
    } else if(otherBody.role === "bullet") {
      this.destroyBullet(otherBody);
    } else if(otherBody.role === "block") {
      otherBody.health -= bulletBody.bulletType === "rocket" ? 5 : 1;

      if(otherBody.health <= 0) {
        this.destroyBody(otherBody);
      }

      const fireIndex = _.sample(_.range(3));
      fxAudio[`fire_${fireIndex}.mp3`].play();
    }

    // Handle scores
    if(otherBody.role === "player") {
      this.scores[otherBody.playerNumber === 0 ? 1 : 0] += bulletBody.bulletType === "rocket" ? 3 : 1;
    } 
  }

  destroyBody(body) {
    for(const childEntity of this.entities) {
      if(childEntity.body === body) {
        this.physicsContainer.removeChild(childEntity.graphics);
        this.removeEntity(childEntity);

        break;
      }
    }

    world.removeBody(body); 
  }

  makeExplosion(physicsPos) {
    const explosionSprite = makePhysicsAnimatedSprite("images/explosion.json");
    explosionSprite.position.set(physicsPos[0], physicsPos[1]);
    explosionSprite.rotation = Math.random() * 2 * Math.PI;
    explosionSprite.animationSpeed = 15/60;
    explosionSprite.loop = false;
    explosionSprite.onComplete = () => this.physicsContainer.removeChild(explosionSprite);

    this.physicsContainer.addChild(explosionSprite);
  }

  destroyBullet(bulletBody) {
    this.makeExplosion(bulletBody.position);
    this.destroyBody(bulletBody);
  }

  makeBlock(physicsPos) {
    const blockBody = new p2.Body({
      position: physicsPos,
      mass: 0,
    });
    blockBody.addShape(new p2.Box({
      width: 0.5,
      height: 0.5,
      collisionGroup: COLLISION_GROUPS.OBSTACLE,
      collisionMask: COLLISION_MASKS.OBSTACLE,
    }));
    blockBody.role = "block";
    blockBody.health = BLOCK_HEALTH;
    world.addBody(blockBody);

    const blockGraphics = makePhysicsSprite("images/block.png");
    this.physicsContainer.addChild(blockGraphics);

    this.addEntity(new util.PhysicsEntity(blockBody, blockGraphics));
  }

  onFire(group, position, velocity, bulletType) {
    const bulletBody = new p2.Body({
      mass: 0.1, 
      position,
      velocity,
      angle: Math.atan2(velocity[1], velocity[0]),
    });
    bulletBody.role = "bullet";
    bulletBody.bulletType = bulletType;
    const bulletShape = new p2.Circle({ 
      radius: 0.1,
      collisionGroup: COLLISION_GROUPS[group],
      collisionMask: COLLISION_MASKS[group],
    });
    bulletBody.addShape(bulletShape);
    world.addBody(bulletBody);

    const bulletGraphics = makePhysicsSprite(`images/${bulletType}.png`);
    this.physicsContainer.addChild(bulletGraphics);

    this.addEntity(new util.PhysicsEntity(bulletBody, bulletGraphics));

    const shootIndex = _.sample(_.range(4));
    fxAudio[`shoot_${shootIndex}.mp3`].play();
  }

  _chooseVehicleClass() {
    return _.sample([CarEntity, HelicopterEntity]);
  }

  _chooseBulletType() {
    return _.sample(["bullet", "rocket"]);
  }
}

class CarEntity extends util.CompositeEntity {
  constructor(initialPos, playerNumber, bulletType) {
    super();

    this.initialPos = initialPos;
    this.playerNumber = playerNumber;
    this.bulletType = bulletType;
  }

  setup(config) {
    super.setup(config);

    this.lastFireTime = 0;
    this.lastHitTime = 0;
    this.lastJumpTime = 0;

    const collisionGroup = COLLISION_GROUPS[`PLAYER_${this.playerNumber}`];
    const collisionMask = COLLISION_MASKS[`PLAYER_${this.playerNumber}`];

    this.chassisBody = new p2.Body({
        mass : 1,        // Setting mass > 0 makes it dynamic
        position: this.initialPos, // [-4,1], // Initial position,
        angle: Math.PI / 4,
    });
    this.chassisBody.role = "player";
    this.chassisBody.playerNumber = this.playerNumber;
    this.chassisShape = new p2.Box({ 
      width: 2, 
      height: 0.4,
      collisionGroup,
      collisionMask,
    });
    this.chassisBody.addShape(this.chassisShape);
    world.addBody(this.chassisBody);
    
    // Create wheels
    this.wheelBody1 = new p2.Body({ mass : 1, position:[this.chassisBody.position[0] - 0.5,0.5] });
    this.wheelBody1.role = "player";
    this.wheelBody1.playerNumber = this.playerNumber;
    this.wheelBody2 = new p2.Body({ mass : 1, position:[this.chassisBody.position[0] + 0.5,0.5] });
    this.wheelBody2.role = "player";
    this.wheelBody2.playerNumber = this.playerNumber;
    
    const wheelShape1 = new p2.Circle({ 
      radius: 0.4,
      collisionGroup,
      collisionMask,
    });
    const wheelShape2 = new p2.Circle({ 
      radius: 0.4,
      collisionGroup,
      collisionMask,
     });
    this.wheelBody1.addShape(wheelShape1);
    this.wheelBody2.addShape(wheelShape2);
    world.addBody(this.wheelBody1);
    world.addBody(this.wheelBody2);

    // Constrain wheels to chassis with revolute constraints.
    // Revolutes lets the connected bodies rotate around a shared point.
    this.revoluteLeft = new p2.RevoluteConstraint(this.chassisBody, this.wheelBody1, {
        localPivotA: [-1, -0],   // Where to hinge first wheel on the chassis
        localPivotB: [0, 0],
        collideConnected: false
    });
    world.addConstraint(this.revoluteLeft);

    this.revoluteRight = new p2.RevoluteConstraint(this.chassisBody, this.wheelBody2, {
        localPivotA: [1, -0], // Where to hinge second wheel on the chassis
        localPivotB: [0, 0],      // Where the hinge is in the wheel (center)
        collideConnected: false
    });
    world.addConstraint(this.revoluteRight);

    // Enable the constraint motor for the back wheel
    // this.revoluteLeft.motorEnabled = true;
    this.revoluteLeft.enableMotor();
    this.revoluteLeft.setMotorSpeed(0); // Rotational speed in radians per second

    this.revoluteRight.enableMotor();
    this.revoluteRight.setMotorSpeed(0); // Rotational speed in radians per second


    this.chassisGraphicsContainer = new PIXI.Container();
    this.container.addChild(this.chassisGraphicsContainer);

    this.hitGraphics = makePhysicsSprite("images/hit.png");
    this.hitGraphics.visible = false;
    this.chassisGraphicsContainer.addChild(this.hitGraphics);

    this.chassisGraphics = makePhysicsSprite("images/box.png");
    this.chassisGraphicsContainer.addChild(this.chassisGraphics);
    this.addEntity(new util.PhysicsEntity(this.chassisBody, this.chassisGraphicsContainer));


    this.backWheelGraphics = makePhysicsSprite("images/wheel.png");
    this.container.addChild(this.backWheelGraphics);
    this.addEntity(new util.PhysicsEntity(this.wheelBody1, this.backWheelGraphics));

    this.frontWheelGraphics = makePhysicsSprite("images/wheel.png");
    this.container.addChild(this.frontWheelGraphics);
    this.addEntity(new util.PhysicsEntity(this.wheelBody2, this.frontWheelGraphics));

    return this.container;
  }

  update(options) {
    super.update(options);

    const gamepad = _.filter(navigator.getGamepads(), _.identity)[this.playerNumber];


    let speed = 0;
    if(Math.abs(gamepad.axes[0]) > .15)
    {
      speed = gamepad.axes[0] * MOTOR_SPEED;
    }
    this.revoluteLeft.setMotorSpeed(speed);
    this.revoluteRight.setMotorSpeed(speed);

    // Jump
    const jumpPressed = gamepad.buttons[0].pressed || gamepad.buttons[6].pressed;
    if(jumpPressed && Date.now() - this.lastJumpTime > CAR_JUMP_DELAY) {
      this.lastJumpTime = Date.now();

      this.chassisBody.velocity[1] += CAR_JUMP_SPEED;
    }

    if(gamepad.buttons[7].pressed) {
      if(Date.now() - this.lastFireTime > FIRE_DELAYS[this.bulletType]) {
        this.lastFireTime = Date.now();

        const bulletVelocity = [
          gamepad.axes[2] * CAR_BULLET_SPEED,
          -gamepad.axes[3] * CAR_BULLET_SPEED,
        ];

        this.emit("fire", `PLAYER_${this.playerNumber}`, this.chassisBody.position, bulletVelocity, this.bulletType);
      }
    }

    if(this.hitGraphics.visible && Date.now() - this.lastHitTime > HIT_FLASH_TIME) {
      this.hitGraphics.visible = false;
    }
  }

  onHit() {
    this.hitGraphics.visible = true;
    this.hitGraphics.rotation = Math.random() * 2 * Math.PI;
    this.lastHitTime = Date.now();
  }

  getCenterPosition() {
    return this.chassisGraphicsContainer.position;
  }
}

class HelicopterEntity extends util.CompositeEntity {
  constructor(initialPos, playerNumber, bulletType) {
    super();

    this.initialPos = initialPos;
    this.playerNumber = playerNumber;
    this.bulletType = bulletType;
  }

  setup(config) {
    super.setup(config);

    this.lastFireTime = 0;
    this.lastHitTime = 0;

    const collisionGroup = COLLISION_GROUPS[`PLAYER_${this.playerNumber}`];
    const collisionMask = COLLISION_MASKS[`PLAYER_${this.playerNumber}`];

    this.chassisBody = new p2.Body({
      mass: 1,        // Setting mass > 0 makes it dynamic
      position: this.initialPos, // [4,1], // Initial position,
    });
    this.chassisBody.role = "player";
    this.chassisBody.playerNumber = this.playerNumber;

    this.chassisShape = new p2.Box({ 
      width: 1.5, 
      height: 0.85,
      collisionGroup,
      collisionMask,
    });
    this.chassisBody.addShape(this.chassisShape);
    world.addBody(this.chassisBody);

    
    this.hitGraphics = makePhysicsSprite("images/hit.png");
    this.hitGraphics.visible = false;
    this.container.addChild(this.hitGraphics);

    this.chassisGraphics = makePhysicsSprite("images/helicopter.png");
    this.container.addChild(this.chassisGraphics);
    this.addEntity(new util.PhysicsEntity(this.chassisBody, this.container));

    this.propellerGraphics = makePhysicsAnimatedSprite("images/helicopter_propeller.json");
    this.propellerGraphics.animationSpeed = 10/60;
    this.propellerGraphics.position.y = 0.6;
    this.container.addChild(this.propellerGraphics);

    return this.container;
  }

  update(options) {
    super.update(options);

    const gamepad = _.filter(navigator.getGamepads(), _.identity)[this.playerNumber];

    const speed = Math.abs(gamepad.axes[0]) > .15 ? 
      gamepad.axes[0] * HELICOPTER_SPEED : 0;
    const lift = Math.abs(gamepad.axes[1]) > .15 ?
      -gamepad.axes[1] * HELICOPTER_LIFT : 0;
    this.chassisBody.velocity = [speed, lift]; 

    // Tilt
    if(gamepad.axes[0] > 0.25) {
      this.chassisGraphics.scale.x = 1/PHYSICS_ZOOM;
      this.chassisBody.angle = -Math.PI / 8;
    } else if(gamepad.axes[0] < -0.25) {
      this.chassisGraphics.scale.x = -1/PHYSICS_ZOOM;
      this.chassisBody.angle = Math.PI / 8;
    } else {
      this.chassisBody.angle = 0;
    }

    if(gamepad.buttons[7].pressed) {
      if(Date.now() - this.lastFireTime > FIRE_DELAYS[this.bulletType]) {
        this.lastFireTime = Date.now();

        const bulletVelocity = [
          gamepad.axes[2] * HELICOPTER_BULLET_SPEED,
          -gamepad.axes[3] * HELICOPTER_BULLET_SPEED,
        ];

        this.emit("fire", `PLAYER_${this.playerNumber}`, this.chassisBody.position, bulletVelocity, this.bulletType);
      }
    } else if(this.shootWasPressed) {
      this.shootWasPressed = false;
    }

    if(this.hitGraphics.visible && Date.now() - this.lastHitTime > HIT_FLASH_TIME) {
      this.hitGraphics.visible = false;
    }
  }

  onHit() {
    this.hitGraphics.visible = true;
    this.hitGraphics.rotation = Math.random() * 2 * Math.PI;
    this.lastHitTime = Date.now();
  }

  getCenterPosition() {
    return this.container.position;
  }
}


// *** SCENE MANAGEMENT ***

function makeScene(sceneName, params = {}) {
  switch(sceneName) {
    case "load": return loadingScene;
    case "ready": return new ReadyScene();
    case "battle": return new BattleScene();
    case "winning": return new WinningScene(params.result, params.winner);

    default: throw new Error("no scene with name " + sceneName);
  }
}

let preloader = util.makePreloader();
let loadingScene = new util.LoadingScene(preloader);

// This function can have side effects
function provideNextScene(currentSceneName, currentSceneParams, requestedTransition) {
  switch(currentSceneName) {
    case "load": return { name: "ready" };
    case "ready": return { name: "battle" };
    case "battle": return { 
      name: "winning", 
      params: requestedTransition.params,
    };
    case "winning": return { name: "ready" };

    default:
      console.error("No transition from", currentSceneName, "with transition", requestedTransition);
      return null;
  }
}


function makeSprite(name) { 
  const sprite = new PIXI.Sprite(app.loader.resources[name].texture);
  sprite.anchor.set(0.5);
  return sprite;
}

function makePhysicsSprite(name) { 
  const sprite = new PIXI.Sprite(app.loader.resources[name].texture);
  sprite.anchor.set(0.5);
  sprite.scale.set(1/PHYSICS_ZOOM, -1/PHYSICS_ZOOM);
  return sprite;
}

function makePhysicsAnimatedSprite(name) { 
  const sprite = new PIXI.extras.AnimatedSprite(getFramesForSpriteSheet(name));
  sprite.anchor.set(0.5);
  sprite.scale.set(1/PHYSICS_ZOOM, -1/PHYSICS_ZOOM);
  sprite.play();
  return sprite;
}

function getFramesForSpriteSheet(name) {
  const textures = app.loader.resources[name].textures;
  return _.map(textures, (value) => value);
}

function makeAnimatedSprite(name) { 
  return new PIXI.extras.AnimatedSprite(getFramesForSpriteSheet(name));
}


const app = new PIXI.Application({
  width: APP_SIZE.x,
  height: APP_SIZE.y,
  view: document.getElementById("pixi-canvas"),
});


// TODO: move this to library?
let sceneLayer;
let currentSceneEntity;
let currentScene;
let currentSceneDisplay;
let lastFrameTime = 0;

// narrationAudio is a map of file names to Howl objects, configured with sprite defs
let narrationAudio;
let narrator;

// musicAudio is a map of file names to Howl objects
let musicAudio;
let jukebox;

let fxAudio;

// The format is key: { text: string, [file: string], [start: int], [end: int], [skipFile: bool] }
// If start is omitted, entire file will play 
// If file is omitted, the file name will be the key name followed by a underscore and the language code, like "intro_fr.mp3" 
// If skipFile is true, the filename is not used
let narrationTable;

let previousGameState = null;
let gameState = "loadingA"; // One of "loadingA", "loadingB", "ready", "playing", "paused", "done"
let playTime = 0;
let timeSinceStart = 0;

// TODO: these multiple entities could be put in some kind of composite "overlay entity" to ease updating
let menuEntity;
let speakerDisplay;

let pixiLoaderProgress = 0;
let fontLoaderProgress = 0;
let audioLoaderProgress = 0;

let world;

window.addEventListener("gamepadconnected", function(e) {
  console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
    e.gamepad.index, e.gamepad.id,
    e.gamepad.buttons.length, e.gamepad.axes.length);
});


function updateLoadingProgress() {
  const progress = (pixiLoaderProgress + fontLoaderProgress + audioLoaderProgress) / 3;
  console.log("loading progress", progress, { pixiLoaderProgress, fontLoaderProgress, audioLoaderProgress });
  loadingScene.updateProgress(progress);
}

function pixiLoadProgressHandler(loader, resource) {
  pixiLoaderProgress = loader.progress / 100;
  updateLoadingProgress();
}

// Forward signal to delegates
function sendSignal(signal, data) {
  for(const entity of [menuEntity, narrator, speakerDisplay, jukebox, currentSceneEntity]) {
    if(entity) entity.onSignal(signal, data);
  }
}

function update(timeScale) {
  const frameTime = Date.now();
  const frameTimeDelta = frameTime - lastFrameTime;
  lastFrameTime = frameTime;

  if(gameState == "playing") {
    playTime += frameTimeDelta;
    timeSinceStart += frameTimeDelta;
  }

  const options = { playTime, timeSinceStart, timeScale, gameState };

  if(previousGameState != gameState) {
    if(previousGameState == "playing" && gameState == "paused") {
      sendSignal("pause");
    } else if(previousGameState == "paused" && gameState == "playing") {
      sendSignal("play");
    }

    previousGameState = gameState;
  }

  for(const entity of [menuEntity, narrator, speakerDisplay, jukebox, currentSceneEntity]) {
    if(entity) entity.update(options)
  }

  const requestedTransition = currentSceneEntity.requestedTransition(options);
  if(requestedTransition) {
      console.log("scene", currentScene, "requesting transition", requestedTransition);
      const nextScene = provideNextScene(currentScene.name, currentScene.params, requestedTransition);
      if(nextScene != null) changeScene(nextScene.name, nextScene.params);
  }

  app.renderer.render(app.stage);
}

function changeScene(newSceneName, params = {}) {
  console.log("switching to scene", newSceneName, params);
  ga("send", "event", "changeScene", newSceneName);

  if(gameState == "ready" && currentScene.name == "load") {
    changeGameState("playing");

    ga("send", "event", "play");
    util.endTiming("waitingForPlay");
  }

  if(currentSceneDisplay) sceneLayer.removeChild(currentSceneDisplay);
  if(currentSceneEntity) currentSceneEntity.teardown();

  currentScene = { name: newSceneName, params };  
  currentSceneEntity = makeScene(currentScene.name, currentScene.params);

  timeSinceStart = 0;

  const options = { playTime, timeSinceStart, timeScale: 1, gameState };
  const config = { app, preloader, narrator, jukebox };

  currentSceneDisplay = currentSceneEntity.setup(config);
  if(currentSceneDisplay) sceneLayer.addChild(currentSceneDisplay);

  currentSceneEntity.update(options);
}

function changeGameState(newGameState) {
  console.log("switching from game state", gameState, "to", newGameState);
  gameState = newGameState;

  ga("send", "event", "changeGameState", newGameState);
}

function processStartingOptions()
{
  const searchParams = new URLSearchParams(window.location.search);
  if(searchParams.has("mute")) startingOptions.mute = true;
  if(searchParams.has("mute-music")) startingOptions.muteMusic = true;
  if(searchParams.has("mute-fx")) startingOptions.muteFx = true;
  if(searchParams.has("no-subtitles")) startingOptions.noSubtitles = true;
  if(searchParams.has("scene")) startingOptions.scene = searchParams.get("scene");
  if(searchParams.has("params")) startingOptions.sceneParams = JSON.parse(searchParams.get("params"));

  if(startingOptions.mute) {
    Howler.volume(0);
  }
}

function loadB1() {
  changeGameState("loadingB");

  util.endTiming("loadA");
  util.startTiming("loadB");
  
  // Load graphical assets  
  const pixiLoaderResources = [].concat(
    _.map(GRAPHICAL_ASSETS, name => `images/${name}`), 
    _.map(VIDEO_ASSETS, name => { return { 
        url: `video/${name}`,
        metadata: {
          loadElement: util.makeVideoElement(),
        }, 
      };
    }));
  app.loader.add(pixiLoaderResources).on("progress", pixiLoadProgressHandler);

  sceneLayer = new PIXI.Container();
  app.stage.addChild(sceneLayer);

  app.ticker.add(update);

  changeScene("load");

  const fontLoaderPromises = _.map(FONTS, name => {
    return new FontFaceObserver(name).load(FONT_OBSERVER_CHARS).then(() => {
      fontLoaderProgress += 1/fonts.length;
      updateLoadingProgress();
    });
  })

  const promises = _.flatten([util.makePixiLoadPromise(app.loader), fontLoaderPromises], true);

  Promise.all(promises).then(loadC)
  .catch(err => console.error("Error loading B1", err));
}

// function loadB2() {
//   return util.loadScript("fr").then((script) => {
//     narrationTable = script;
//     console.log("Loaded script", script);
//   }).catch(err => console.error("Error loading B2", err)); 
// }

function loadC() {
  util.endTiming("loadB");
  util.startTiming("loadC");

  // Load audio
  narrationAudio = util.loadNarrationAudio(narrationTable, "fr");

  const narrationLoadPromises = Array.from(narrationAudio.values(), util.makeHowlerLoadPromise);
  
  musicAudio = util.makeMusicHowls(MUSIC_ASSETS);
  const musicLoadPromises = _.map(musicAudio, util.makeHowlerLoadPromise);

  // Create map of file names to Howl objects
  fxAudio = {};
  for(let file of FX_ASSETS) {
    fxAudio[file] = new Howl({
      src: `audio/fx/${file}`,
      loop: false,
    });
  }

  const fxLoadPromises = _.map(fxAudio, util.makeHowlerLoadPromise);

  const audioPromises = _.flatten([narrationLoadPromises, musicLoadPromises, fxLoadPromises], true);
  _.each(audioPromises, p => p.then(() => {
    audioLoaderProgress += 1/audioPromises.length;
    updateLoadingProgress();
  }));

  Promise.all(audioPromises)
  .then(doneLoading)
  .catch(err => console.error("Error loading C", err));
}

function doneLoading() {
  util.endTiming("loadC");
  util.startTiming("waitingForPlay");

  changeGameState("ready");

  loadingScene.setIsReady();

  // narrator = new util.Narrator(narrationAudio, narrationTable, {
  //   muted: startingOptions.muteFx,
  //   showSubtitles: !startingOptions.noSubtitles,
  // });
  jukebox = new util.Jukebox(musicAudio, { muted: startingOptions.muteMusic });

  const config = { app, preloader, narrator, jukebox };

  // const narratorLayer = narrator.setup(config);
  jukebox.setup(config);

  // speakerDisplay = new util.SpeakerDisplay(SPEAKERS);
  // const speakerLayer = speakerDisplay.setup(config);
  // speakerLayer.position = SPEAKER_POSITION;
  // app.stage.addChild(speakerLayer);
  // app.stage.addChild(narratorLayer);

  // menuEntity = new util.MenuEntity();
  // menuEntity.on("pause", () => changeGameState("paused"));
  // menuEntity.on("play", () => changeGameState("playing"));
  // app.stage.addChild(menuEntity.setup(config));
}

ga("send", "event", "loading", "start");
util.startTiming("loadA");

// Process starting options
const startingOptions = {
  mute: false,
  muteMusic: false,
  muteFx: false,
  noSubtitles: false,
  scene: STARTING_SCENE,
  sceneParams: {},
};
processStartingOptions();

// Show loading screen as soon as JS has loaded
Promise.all([
  util.makeDomContentLoadPromise(document),
  util.makePixiLoadPromise(preloader),
])
.then(() => Promise.all([loadB1() /*, loadB2()*/ ]))
.catch(err => console.error("Error preparing loading screen", err));
 