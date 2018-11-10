//import "../node_modules/babel-polyfill/dist/polyfill.js";
import * as util from "./util.js";
import "../node_modules/url-search-params-polyfill/index.js";


const APP_SIZE = new PIXI.Point(960, 540);

const PHYSICS_ZOOM = 100;

// String of characters to look for in icon font
const FONT_OBSERVER_CHARS = "asdf";

const STARTING_SCENE = "battle";

const GRAPHICAL_ASSETS = [
  "loading-circle.png",
  "play.png",
];

const MUSIC_ASSETS = [];

const VIDEO_ASSETS = [];

const FONTS = [];


class BattleScene extends util.CompositeEntity {
  setup(config) {
    super.setup(config);

    // Add a box
    const boxShape = new p2.Box({ width: 2, height: 1 });
    this.boxBody = new p2.Body({
        mass:1,
        position:[0,2],
        angularVelocity:1
    });
    this.boxBody.addShape(boxShape);
    world.addBody(this.boxBody);

    // Add a plane
    const planeShape = new p2.Plane();
    const planeBody = new p2.Body({ position:[0,-1] });
    planeBody.addShape(planeShape);
    world.addBody(planeBody);

    const physicsContainer = new PIXI.Container();
    this.container.addChild(physicsContainer);

    // Add transform to the container
    physicsContainer.position.x = this.config.app.renderer.width/2; // center at origin
    physicsContainer.position.y = this.config.app.renderer.height/2;
    physicsContainer.scale.x =  PHYSICS_ZOOM;  // zoom in
    physicsContainer.scale.y = -PHYSICS_ZOOM; // Note: we flip the y axis to make "up" the physics "up"
    
    // Draw the box.
    this.graphics = new PIXI.Graphics();
    this.graphics.beginFill(0xff0000);
    this.graphics.drawRect(-boxShape.width/2, -boxShape.height/2, boxShape.width, boxShape.height);
    // Add the box to our container
    physicsContainer.addChild(this.graphics);

    return this.container;
  }

  update() {
     // Move physics bodies forward in time
    world.step(1/60);
    // Transfer positions of the physics objects to Pixi.js
    this.graphics.position.x = this.boxBody.position[0];
    this.graphics.position.y = this.boxBody.position[1];
    this.graphics.rotation =   this.boxBody.angle;
  }

}


// *** SCENE MANAGEMENT ***

function makeScene(sceneName, params = {}) {
  switch(sceneName) {
    case "load": return loadingScene;
    case "battle": return new BattleScene();

    default: throw new Error("no scene with name " + sceneName);
  }
}

let preloader = util.makePreloader();
let loadingScene = new util.LoadingScene(preloader);

// This function can have side effects
function provideNextScene(currentSceneName, currentSceneParams, requestedTransition) {
  switch(currentSceneName) {
    case "load": return { name: "battle" };

    default:
      console.error("No transition from", currentSceneName, "with transition", requestedTransition);
      return null;
  }
}


function makeSprite(name) { 
  return new PIXI.Sprite(app.loader.resources[name].texture);
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

const world = new p2.World();


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

  const audioPromises = _.flatten([narrationLoadPromises, musicLoadPromises], true);
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
 