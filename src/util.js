const AUDIO_FILE_FORMATS = ["mp3"];

const PRELOADER_ASSETS = [
  "images/loading-circle.png",
  "images/splash-screen.png",
];
const LOADING_SCENE_SPIN_SPEED = Math.PI / 60; // One spin in 2s


export const EPSILON = 0.001;
export const ZERO = new PIXI.Point(0, 0);
export const ONE = new PIXI.Point(1, 1);

export function clamp(x, min, max) {
  return Math.min(max, Math.max(min, x));
}

export function distance(a, b) {
  let x = a.x - b.x;
  let y = a.y - b.y;
  return Math.sqrt(x*x + y*y);
}

export function lerp(a, b, p) {
  return a + (b - a) * p;
}

export function lerpPoint(a, b, p) {
  const x = b.x - a.x;
  const y = b.y - a.y;
  return new PIXI.Point(a.x + p * x, a.y + p * y);
}

// Find the direction around the circle that is shorter
// Based on https://stackoverflow.com/a/2007279
export function angleBetweenAngles(source, target) {
  return Math.atan2(Math.sin(target - source), Math.cos(target - source));
}

export function lerpAngle(a, b, p) {
  return a + p * angleBetweenAngles(a, b); 
}

export function makeAnglePositive(a) {
  while(a < 0) a += 2*Math.PI;
  return a;
}

export function normalizeAngle(a) {
  while(a > Math.PI) a -= 2 * Math.PI;
  while(a < -Math.PI) a += 2 * Math.PI;
  return a;
}

export function radiansToDegrees(a) {
  return a * 180 / Math.PI;
}

export function degreesToRadians(a) {
  return a * Math.PI / 180;
}


export function add(...points) {
  const r = new PIXI.Point();
  for(const p of points) {
    r.x += p.x;
    r.y += p.y;
  } 
  return r;
}

export function subtract(...points) {
  const r = new PIXI.Point(points[0].x, points[0].y);
  for(let i = 1; i < points.length; i++) {
    r.x -= points[i].x;
    r.y -= points[i].y;
  } 
  return r;
}

export function multiply(a, p) {
  return new PIXI.Point(a.x * p, a.y * p);
}

export function divide(a, p) {
  return new PIXI.Point(a.x / p, a.y / p);
}

export function floor(p) {
  return new PIXI.Point(Math.floor(p.x), Math.floor(p.y));
}

export function round(p) {
  return new PIXI.Point(Math.round(p.x), Math.round(p.y));
}

export function min(...points) {
  const r = new PIXI.Point(Infinity, Infinity);
  for(p of points) {
    r.x = Math.min(p.x, r.x);
    r.y = Math.min(p.y, r.y);
  } 
  return r;
}

export function max(...points) {
  const r = new PIXI.Point(-Infinity, -Infinity);
  for(p of points) {
    r.x = Math.max(p.x, r.x);
    r.y = Math.max(p.y, r.y);
  } 
  return r;
}

export function inRectangle(p, min, max) {
  return p.x >= min.x && p.x <= max.x && p.y >= min.y && p.y <= max.y;
}

export function average(...points) {
  var sum = new PIXI.Point();
  for(let point of points) sum = add(sum, point);
  return divide(sum, points.length);
}

export function moveTowards(a, b, speed) {
  const d = distance(a, b);
  return lerpPoint(a, b, clamp(speed / d, 0, 1));
}

export function moveTowardsAngle(a, b, speed) {
  const diff = angleBetweenAngles(a, b);
  if(diff >= 0) {
    const targetDiff = Math.min(diff, speed);
    return a + targetDiff;
  } else {
    const targetDiff = Math.min(-diff, speed);
    return a - targetDiff;    
  }
}

// Test containment using isEqual
export function contains(list, p) {
  for(let x of list) {
    if(_.isEqual(x, p)) return true;
  }
  return false;
} 

// Test containment using isEqual
export function indexOf(list, p) {
  for(let i = 0; i < list.length; i++) {
    if(_.isEqual(list[i], p)) return i;
  }
  return -1;
} 

// Find unique elements using isEqual
export function uniq(array) {
  let results = [];
  let seen = [];
  array.forEach((value, index) => {
    if(!contains(seen, value)) {
      seen.push(value)
      results.push(array[index])
    }
  });
  return results;
}

// Like Underscore's method, but uses contains()
export function difference(array) {
  rest = Array.prototype.concat.apply(Array.prototype, Array.prototype.slice.call(arguments, 1));
  return _.filter(array, (value) => !contains(rest, value));
}

// Uses contains()
export function removeFromArray(array, value) {
  let ret = [];
  for(let element of array) if(!_.isEqual(element, value)) ret.push(element);
  return ret;
}

export function cloneData(o) {
  return JSON.parse(JSON.stringify(o));
} 

export function randomInRange(a, b) {
  return a + Math.random() * (b - a);
}

export function randomPointInRange(min, max) {
  return new PIXI.Point(randomInRange(min.x, max.x), randomInRange(min.y, max.y));
}

export function randomArrayElement(array) {
  return array[_.random(0, array.length - 1)];
}

// Returns true if point is within distance d of otherPoints
export function withinDistanceOfPoints(point, d, otherPoints) {
  for(const otherPoint of otherPoints) {
    if(distance(point, otherPoint) <= d) return true;
  }
  return false;
}

export function randomPointAwayFromOthers(min, max, distanceFromPoints, existingPoints) {
  while(true) {
    const newPoint = randomPointInRange(min, max);
    if(!withinDistanceOfPoints(newPoint, distanceFromPoints, existingPoints)) return newPoint;
  }
}

export function lerpColor(start, end, fraction) {
  const r = ((end & 0xff0000) >> 16) - ((start & 0xff0000) >> 16);
  const g = ((end & 0x00ff00) >> 8) - ((start & 0x00ff00) >> 8);
  const b = (end & 0x0000ff) - (start & 0x0000ff);
  return start + ((r * fraction) << 16) + ((g * fraction) << 8) + b;
}

export function cyclicLerpColor(start, end, fraction) {
  return fraction < 0.5 ? lerpColor(start, end, fraction / 0.5) : lerpColor(end, start, (fraction - 0.5) / 0.5);
}

export function toFixedFloor(x, decimalPlaces) {
  const divider = Math.pow(10, decimalPlaces);
  return (Math.floor(x * divider) / divider).toFixed(decimalPlaces);
}

export function resizeGame(appSize) {
  const parentSize = new PIXI.Point(window.innerWidth, window.innerHeight);
  const scale = toFixedFloor(Math.min(parentSize.x / appSize.x, parentSize.y / appSize.y), 2);

  const newSize = multiply(appSize, scale);
  const remainingSpace = subtract(parentSize, newSize);

  console.log("setting scale to", scale);

  const parent = document.getElementById("game-parent");
  parent.style.height = `${newSize.y}px`;

  const container = document.getElementById("game-container");
  const transformCss = `translate(${(remainingSpace.x / 2).toFixed(2)}px, 0px) scale(${scale})`;
  for(const prop of ["transform", "webkitTransform", "msTransform"]) {
    container.style[prop] = transformCss;
  }
}

export function supportsFullscreen(element) {
  return !!(element.requestFullscreen 
    || element.mozRequestFullScreen 
    || element.webkitRequestFullscreen 
    || element.msRequestFullscreen);
}

export function requestFullscreen(element) {
  if(element.requestFullscreen) {
    element.requestFullscreen();
  } else if(element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if(element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if(element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
}

export function exitFullscreen() {
  if(document.exitFullscreen) document.exitFullscreen();
  else if(document.webkitExitFullscreen) document.webkitExitFullscreen();
  else if(document.mozCancelFullScreen) document.mozCancelFullScreen();
  else if(document.msExitFullscreen) document.msExitFullscreen();
} 

export function inFullscreen() {
  return document.fullscreenElement 
    || document.webkitFullscreenElement
    || document.mozFullScreenElement
    || document.msFullScreenElement;
}


export class Entity extends PIXI.utils.EventEmitter {
  constructor() {
    super();

    this.isSetup = false;
    this.eventListeners = [];
  }

  // @config includes narrator
  setup(config) {
    if(this.isSetup) 
      console.error("setup() called twice", this);
    
    this.config = config;
    this.isSetup = true;
  }

  // options include { playTime, timeSinceStart, timeScale, gameState }
  update(options) {
    if(!this.isSetup) 
      console.error("update() called before setup()", this);
  }

  teardown() {
    if(!this.isSetup) 
      console.error("teardown() called before setup()", this);

    this._off(); // Remove all event listeners

    this.config = null;
    this.isSetup = false;
  }

  // Optionally returns either a truthy value, or possibly an object containing the keys { name, params}
  // @options are the same as for update()
  requestedTransition(options) { 
    if(!this.isSetup) 
      console.error("requestedTransition() called before setup()", this);

    return null; 
  } 

  // @signal is string, @data is whatever
  onSignal(signal, data = null) { 
    if(!this.config) 
      console.error("onSignal() called before setup()", this);
  }

  _on(emitter, event, cb) {
    this.eventListeners.push({ emitter, event, cb });
    emitter.on(event, cb, this);
  }

  // if @cb is null, will remove all event listeners for the given emitter and event
  _off(emitter = null, event = null, cb = null) {
    const props = {};
    if(emitter) props.emitter = emitter;
    if(event) props.event = event;
    if(cb) props.cb = cb;

    _.each(_.filter(this.eventListeners, props), listener => listener.emitter.off(listener.event, listener.cb));
    this.eventListeners = _.reject(this.eventListeners, _.matcher(props));
  }
}

export class StateMachine extends Entity {
  constructor(states, transitions, startingState = "start", endingState = "end") {
    super();

    this.states = states;
    this.transitions = transitions;
    this.startingState = startingState;
    this.endingState = endingState;
  }

  _changeState(timeSinceStart, nextStateName) {
    // console.log("changing from state", this.stateName, "to state", nextStateName);

    // If reached ending state, stop here. Teardown can happen later
    if(nextStateName == this.endingState) {
      this.endingStateReached = nextStateName;
      return;
    }


    if(this.state) this.state.teardown();

    const previousStateName = this.stateName;
    this.stateName = nextStateName;

    if(nextStateName in this.states) {
      this.state = this.states[nextStateName];
      this.state.setup(this.config);
    } else {
      console.warn("Cannot find state", nextStateName);
      this.state = null;
    }

    this.sceneStartedAt = timeSinceStart;

    this.emit("stateChange", nextStateName, previousStateName);
  }

  setup(config) {
    super.setup(config);

    this.endingStateReached = null;

    this._changeState(0, this.startingState);
  }

  update(options) {
    super.update(options);

    if(!this.state) return;

    const timeSinceStateStart = options.timeSinceStart - this.sceneStartedAt;
    const stateOptions = _.extend({}, options, { timeSinceStart: timeSinceStateStart });
    this.state.update(stateOptions);

    const requestedTransition = this.state.requestedTransition(stateOptions);
    if(requestedTransition) {
      const nextStateName = _.isString(this.transitions[this.stateName]) ? 
        this.transitions[this.stateName] : this.transitions[this.stateName][requestedTransition];
      if(nextStateName != null) this._changeState(options.timeSinceStart, nextStateName)
    }
  }

  teardown() { 
    super.teardown();

    if(this.state) {
      this.state.teardown(); 
      this.state = null;
      this.stateName = null;
    }
  }

  requestedTransition(options) { 
    super.requestedTransition(options);

    return this.endingStateReached; 
  }

  onSignal(signal, data = null) { 
    super.onSignal(signal, data);

    if(this.state) this.state.onSignal(signal, data);
  }
}

export class CompositeEntity extends Entity {
  constructor(...entities) {
    super();
    this.entities = entities;
  }

  setup(config) {
    super.setup(config);

    // OPT: for performance, we don't need a container if the children don't display anything
    this.container = new PIXI.Container();

    for(const entity of this.entities) {
      if(!entity.isSetup) {
        const childDisplay = entity.setup(config);
        if(childDisplay) this.container.addChild(childDisplay);
      }
    } 

    return this.container;
  }

  update(options) {
    super.update(options);

    for(const entity of this.entities) {
      entity.update(options);
    }
  } 

  // Returns the answer of the first entity
  requestedTransition(options) { 
    super.requestedTransition(options);

    if(this.entities.length) return this.entities[0].requestedTransition(options);
    return null;
  }

  teardown() {
    super.teardown();

    for(const entity of this.entities) {
      entity.teardown();
    }
  }

  onSignal(signal, data) { 
    super.onSignal(signal, data);

    for(const entity of this.entities) {
      entity.onSignal(signal, data);
    }
  }

  addEntity(entity) {
    // If we have already been setup, setup this new entity
    if(this.isSetup && !entity.isSetup) {
      const childDisplay = entity.setup(this.config);
      if(childDisplay) this.container.addChild(childDisplay);
    }

    this.entities.push(entity);
  }

  removeEntity(entity) {
    const index = this.entities.indexOf(entity);
    if(index === -1) throw new Error("Cannot find entity to remove");

    if(entity.isSetup) entity.teardown();
    this.entities.splice(index, 1);
  }
}

// An entity that executes one scene after the other
export class EntitySequence extends Entity {
  // @options includes loop (default: false)
  constructor(entities, options = {}) {
    super();

    this.entities = entities;
    this.loop = options.loop || false;

    this.currentEntityIndex = 0;
  }

  // Does not setup entity
  addEntity(entity) {
    this.entities.push(entity); 
  }

  setup(config) {
    super.setup(config);

    this.container = new PIXI.Container();
    this._activateEntity(0);
    return this.container;
  }

  update(options) {
    const timeSinceChildStart = options.timeSinceStart - this.childStartedAt;
    const childOptions = _.extend({}, options, { timeSinceStart: timeSinceChildStart });

    super.update(options);

    if(this.currentEntityIndex >= this.entities.length) return;

    this.entities[this.currentEntityIndex].update(childOptions);

    const transition = this.entities[this.currentEntityIndex].requestedTransition(childOptions);
    if(transition && (this.loop || this.currentEntityIndex < this.entities.length - 1)) {
      this._deactivateEntity();
      this.currentEntityIndex = (this.currentEntityIndex + 1) % this.entities.length;
      this._activateEntity(options.timeSinceStart);
    } 
  } 

  // If on last entity, returns the answer of the last entity
  // Else returns null
  requestedTransition(options) { 
    super.requestedTransition(options);

    if(this.loop || this.currentEntityIndex < this.entities.length - 1) return null;

    const timeSinceChildStart = options.timeSinceStart - this.childStartedAt;
    const childOptions = _.extend({}, options, { timeSinceStart: timeSinceChildStart });
    return this.entities[this.entities.length - 1].requestedTransition(childOptions);
  }

  teardown() {
    super.teardown();

    this._deactivateEntity();
  }

  onSignal(signal, data) { 
    this.entities[this.currentEntityIndex].onSignal(signal, data);
  }

  _activateEntity(time) {
    const childDisplay = this.entities[this.currentEntityIndex].setup(this.config);
    if(childDisplay) this.container.addChild(childDisplay);
    this.childStartedAt = time;
  }

  _deactivateEntity() {
    this.entities[this.currentEntityIndex].teardown();
    this.container.removeChildren();
  }
}

// An entity that takes functions in the constructor
export class FunctionalEntity extends CompositeEntity {
  // @functions is an object, with keys: setup, update, teardown, requestedTransition, onSignal
  constructor(functions, childEntities = []) {
    super();

    this.functions = functions;

    for(let childEntity of childEntities) this.addEntity(childEntity);
  }

  setup(config) {
    super.setup(config);

    if(this.functions.setup) this.functions.setup(config, this);
  }

  update(options) {
    super.update(options);

    if(this.functions.update) this.functions.update(options, this);
  }

  teardown() {
    super.teardown();

    if(this.functions.teardown) this.functions.teardown(this);
  }

  requestedTransition(options) {
    if(this.functions.requestedTransition) return this.functions.requestedTransition(options, this);

    return null;
  } 

  onSignal(signal, data = null) {
    super.onSignal(signal, data);

    if(this.functions.onSignal) this.functions.onSignal(signal, data);
  }
}

// Waits until time is up, then requests transition
export class WaitingEntity extends Entity {
  constructor(wait) {
    super();

    this.wait = wait;
  }

  requestedTransition(options) {
    super.requestedTransition(options);

    return options.timeSinceStart >= this.wait ? "next" : null;
  }
}

export class VideoEntity extends Entity {
  constructor(videoName, options = {}) {
    super();

    this.videoName = videoName;  
    setupOptions(this, options, {
      loop: false,
    });
  }

  setup(config) {
    super.setup(config);

    this.videoElement = this.config.app.loader.resources[this.videoName].data;
    this.videoElement.loop = this.loop;
    this.videoElement.currentTime = 0;

    const texture = PIXI.VideoBaseTexture.fromVideo(this.videoElement);
    this.videoSprite = PIXI.Sprite.from(texture);

    return this.videoSprite;
  }

  onSignal(signal, data) {
    super.onSignal(signal, data);

    if(signal === "pause") {
      this.videoElement.pause();
    } else if(signal === "play") {
      this.videoElement.play();
    }
  }

  requestedTransition(options) {
    super.requestedTransition(options);

    return this.videoElement.ended;
  }

  teardown() {
    this.videoElement.pause();

    super.teardown();
  }
}


export class Narrator extends Entity {
  // filesToHowl is a Map
  // @options is { muted = false, showSubtitles = true }
  constructor(filesToHowl, narrationTable, options = {}) {
    super();

    this.filesToHowl = filesToHowl;
    this.narrationTable = narrationTable;

    _.defaults(options, {
      muted: false,
      showSubtitles: false,
    });

    this.muted = options.muted;
    this.showSubtitles = options.showSubtitles;

    this._updateMuted();
  }

  setup(config) {
    super.setup(config);

    this.container = new PIXI.Container();

    this.narratorSubtitle = new PIXI.Text("", {
      fontFamily: "Roboto Condensed", 
      fontSize: 32, 
      fill: "white",
      strokeThickness: 4,
      align: "center",
      wordWrap: true,
      wordWrapWidth: this.config.app.screen.width - 150
    });
    this.narratorSubtitle.anchor.set(0.5, 0.5);
    this.narratorSubtitle.position.set(this.config.app.screen.width / 2, this.config.app.screen.height - 75);
    this.container.addChild(this.narratorSubtitle);

    this.characterSubtitle = new PIXI.Text("", {
      fontFamily: "Roboto Condensed", 
      fontSize: 32, 
      fill: "white",
      strokeThickness: 4,
      align: "left",
      wordWrap: true,
      wordWrapWidth: this.config.app.screen.width - 350
    });
    this.characterSubtitle.anchor.set(0, 0.5);
    this.characterSubtitle.position.set(300, this.config.app.screen.height - 75);
    this.container.addChild(this.characterSubtitle);

    this._updateShowSubtitles();

    this.key = null;
    this.isPlaying = false;
    this.keyQueue = [];

    this.isPaused = false;
    this.currentHowl = null;
    this.currentSoundId = null;

    return this.container;
  }

  update({playTime, timeScale, gameState}) {
    if(gameState == "paused") {
      if(!this.isPaused) {
        if(this.currentHowl) this.currentHowl.pause(this.currentSoundId);
        this.isPaused = true;
      }
    } else if(this.isPaused && this.isPlaying) {
      if(this.currentHowl) this.currentHowl.play(this.currentSoundId);
      this.isPaused = false;
    } else if(!this.isPlaying) {
      if(this.keyQueue.length > 0) {
        this.key = this.keyQueue.shift();
        this._initNarration(playTime);
      }
    } else if(playTime - this.keyStartTime >= this.nextLineAt) {
      this.lineIndex++;
      if(this.lineIndex < this.lines.length) {
        this._updateNextLineAt();
        this._updateText(this.lines[this.lineIndex].text, this.lines[this.lineIndex].speaker);
      } else {
        this.isPlaying = false;
        this.currentSoundId = null;
        this.currentHowl = null;

        this._updateText();
      }
    }
  }

  // @priority < 0 means to skip the narration if other narration is in progress
  changeKey(key, priority = 0) {
    if(!_.has(this.narrationTable, key)) {
      console.error("No key", key, "in narration table");
      return;
    }

    if(this.isPlaying && priority < 0) {
      console.log("Skipping narration", key, "of priority", priority);
      return;
    }

    // TODO sort keys by priority
    this.keyQueue.push(key);
  }

  // Stop currently playing and empty queue  
  cancelAll() {
    this.keyQueue = [];

    if(this.isPlaying) {
      if(this.currentHowl) this.currentHowl.pause(this.currentSoundId);

      this.isPlaying = false;
      this.currentSoundId = null;
      this.currentHowl = null;

      this._updateText();
    }
  }

  narrationDuration(key) {
    const narrationInfo = this.narrationTable[key];
    // If start and end times are provided, use them
    // Else get the entire duration of the file
    if("start" in narrationInfo) {
      return narrationInfo.end - narrationInfo.start; 
    } else {
      const file = this.narrationTable[key].file || key;
      return this.filesToHowl.get(file).duration() * 1000;
    }
  }

  onSignal(signal, data = null) {
    super.onSignal(signal, data);
  }

  setMuted(isMuted) {
    this.muted = isMuted;
    this._updateMuted();
  }

  setShowSubtitles(showSubtitles) {
    this.showSubtitles = showSubtitles;
    this._updateShowSubtitles();
  }

  _initNarration(playTime) {
    this.duration = this.narrationDuration(this.key); 
    this.lines = this.narrationTable[this.key].dialog;
    this.lineIndex = 0;
    this.keyStartTime = playTime;
    this.isPlaying = true;

    this._updateNextLineAt();
    this._updateText(this.lines[0].text, this.lines[0].speaker);

    if(this.narrationTable[this.key].skipFile) {
      this.currentHowl = null;
    } else {
      const file = this.narrationTable[this.key].file || this.key;
      this.currentHowl = this.filesToHowl.get(file);

      // If the start time is provided, this is a sprite
      // Otherwise it's just a single file
      if("start" in this.narrationTable[this.key]) {
        this.currentSoundId = this.currentHowl.play(this.key);
      } else {
        this.currentSoundId = this.currentHowl.play();
      }
    }
  }

  _updateText(text = "", speaker = null) {
    if(text === "") {
      this.narratorSubtitle.text = ""; 
      this.characterSubtitle.text = ""; 
    } else if(speaker && !speaker.endsWith(".big")) {
      this.narratorSubtitle.text = ""; 
      this.characterSubtitle.text = text;
    } else {
      this.narratorSubtitle.text = text; 
      this.characterSubtitle.text = ""; 
    }

    this.emit("changeSpeaker", speaker);
  }

  // Must be called after this.duration, this.lines, this.lineIndex, etc.. have been set
  _updateNextLineAt() {
    if(this.lineIndex === this.lines.length - 1) {
      this.nextLineAt = this.duration;
    } else if("start" in this.lines[this.lineIndex + 1]) {
      this.nextLineAt = this.lines[this.lineIndex + 1].start;
    } else {
      this.nextLineAt = (this.lineIndex + 1) * this.duration / this.lines.length;
    }
  }

  _updateMuted() {
    for(let howl of this.filesToHowl.values()) howl.mute(this.muted);
  }

  _updateShowSubtitles() {
    this.container.visible = this.showSubtitles;
  }
}

export class SpeakerDisplay extends CompositeEntity {
  constructor(namesToImages) {
    super();
    this.namesToImages = namesToImages;
  }

  setup(config) {
    super.setup(config);

    // Make a hidden sprite for each texture, add it to the container
    this.namesToSprites = _.mapObject(this.namesToImages, image => {
      const sprite = new PIXI.Sprite(this.config.app.loader.resources[image].texture);
      sprite.anchor.set(0, 1); // lower-left
      sprite.visible = false;
      this.container.addChild(sprite);
      return sprite;
    });

    this.currentSpeakerName = null;

    this._on(this.config.narrator, "changeSpeaker", this._onChangeSpeaker);

    return this.container;
  }

  _onChangeSpeaker(speaker) {
    if(this.currentSpeakerName)
      this.namesToSprites[this.currentSpeakerName].visible = false;
    if(speaker)
      this.namesToSprites[speaker].visible = true;
    this.currentSpeakerName = speaker;
  }
}


export class SingleNarration extends Entity {
  constructor(narrationKey, priority = 0) {
    super();
    
    this.narrationKey = narrationKey;
    this.priority = priority;
  }

  setup(config) {
    super.setup(config);

    this.config.narrator.changeKey(this.narrationKey, this.priority);
  }

  requestedTransition(options) { 
    return options.timeSinceStart >= this.config.narrator.narrationDuration(this.narrationKey) ? "next" : null;
  }
}

export class RandomNarration extends Entity {
  constructor(narrationKeys, priority) {
    super();
    
    this.narrationKeys = narrationKeys;
    this.priority = priority;

    this.narrationPlaylist = [];
    this.currentKey = null;
  }

  setup(config) {
    super.setup(config);

    // If this is the first time or we have played everything, make a new playlist
    if(this.narrationPlaylist.length === 0) {
      this.narrationPlaylist = _.shuffle(this.narrationKeys);
    }

    // Pick the next key in the list
    this.currentKey = this.narrationPlaylist.shift(); 
    this.config.narrator.changeKey(this.currentKey, this.priority);
  }

  requestedTransition(options) { 
    super.requestedTransition(options);

    return options.timeSinceStart >= this.config.narrator.narrationDuration(this.currentKey) ? "next" : null;
  }

  teardown() {
    super.teardown();

    this.currentKey = null;
  }
}

export class Jukebox extends Entity {
  // Options include { muted: false, volume: 0.25 }
  constructor(namesToHowl, options) {
    super();

    this.namesToHowl = namesToHowl;

    _.defaults(options, {
      muted: false,
      volume: 0.25,
    });

    this.muted = options.muted;
    this.volume = options.volume;

    _.each(this.namesToHowl, howl => howl.volume(this.volume))
    this._updateMuted();
  }

  setup(config) {
    super.setup(config);

    this.musicPlaying = null;
  }

  changeMusic(name = null) {
    if(this.musicPlaying) {
      // TODO: fade
      this.musicPlaying.stop();
      this.musicPlaying = null;
    }

    if(name) {
      this.musicPlaying = this.namesToHowl[name];
      this.musicPlaying.play();
    }
  }

  teardown() {
    super.teardown();

    if(this.musicPlaying) this.musicPlaying.stop();
  }

  onSignal(signal, data = null) {
    super.onSignal(signal, data);

    if(!this.musicPlaying) return;

    if(signal === "pause") this.musicPlaying.pause();
    else if(signal === "play") this.musicPlaying.play();
  }

  setMuted(isMuted) {
    this.muted = isMuted;
    this._updateMuted();
  }

  _updateMuted() {
    _.each(this.namesToHowl, howl => howl.mute(this.muted))
  }
} 

export class MusicEntity extends Entity {
  constructor(trackName, stopOnTeardown = false) {
    super();

    this.trackName = trackName;
    this.stopOnTeardown = stopOnTeardown;
  }

  setup(config) {
    super.setup(config);

    this.config.jukebox.changeMusic(this.trackName);
  }

  teardown() {
    if(this.stopOnTeardown) {
      this.config.jukebox.changeMusic();
    }
  }
}

export class ToggleSwitch extends Entity {
  constructor(onTexture, offTexture, isOn = true) {
    super();

    this.onTexture = onTexture;
    this.offTexture = offTexture;
    this.isOn = isOn;
  }

  setup(options) {
    super.setup(options);

    this.container = new PIXI.Container();

    this.spriteOn = new PIXI.Sprite(this.onTexture);
    this.spriteOn.interactive = true;
    this._on(this.spriteOn, "pointertap", this._turnOff);
    this.container.addChild(this.spriteOn);

    this.spriteOff = new PIXI.Sprite(this.offTexture);
    this.spriteOff.interactive = true;
    this._on(this.spriteOff, "pointertap", this._turnOn);
    this.container.addChild(this.spriteOff);

    this._updateVisibility();

    return this.container;
  }

  setIsOn(isOn, silent = false) {
    this.isOn = isOn;
    _updateVisibility();

    if(!silent) this.emit("change", this.isOn);
  }

  _turnOff() {
    this.isOn = false;
    this._updateVisibility();
    this.emit("change", this.isOn);
  }

  _turnOn() {
    this.isOn = true;
    this._updateVisibility();
    this.emit("change", this.isOn);
  }

  _updateVisibility() {
    this.spriteOn.visible = this.isOn;
    this.spriteOff.visible = !this.isOn;
  }
}

export class MenuEntity extends CompositeEntity {
  setup(config) {
    super.setup(config);

    this.pauseButton = new PIXI.Sprite(this.config.app.loader.resources["images/ui/button-mainmenu.png"].texture);
    this.pauseButton.anchor.set(0.5);
    this.pauseButton.position.set(50);
    this.pauseButton.interactive = true;
    this._on(this.pauseButton, "pointertap", this._onPause);
    this.container.addChild(this.pauseButton);

    this.menuLayer = new PIXI.Container();
    this.menuLayer.visible = false;
    this.container.addChild(this.menuLayer);

    this.mask = new PIXI.Graphics();
    this.mask.beginFill(0x000000);
    this.mask.drawRect(0, 0, this.config.app.screen.width, this.config.app.screen.height);
    this.mask.endFill(); 
    this.mask.alpha = 0.6;
    this.menuLayer.addChild(this.mask);

    this.playButton = new PIXI.Sprite(this.config.app.loader.resources["images/ui/button-close.png"].texture);
    this.playButton.anchor.set(0.5);
    this.playButton.position.set(50);
    this.playButton.interactive = true;
    this._on(this.playButton, "pointertap", this._onPlay);
    this.menuLayer.addChild(this.playButton);

    const gameLogo = new PIXI.Sprite(this.config.app.loader.resources["images/logo-tragedy-fish.png"].texture);
    gameLogo.position.set(65, 130);
    this.menuLayer.addChild(gameLogo);

    const pcLogo = new PIXI.Sprite(this.config.app.loader.resources["images/ui/a-playcurious-game.png"].texture);
    pcLogo.anchor.set(0.5);
    pcLogo.position.set(160, 450);
    this.menuLayer.addChild(pcLogo);

    if(supportsFullscreen(document.getElementById("game-parent"))) {
      this.fullScreenButton = new ToggleSwitch(
        this.config.app.loader.resources["images/ui/fullscreen-on.png"].texture,
        this.config.app.loader.resources["images/ui/fullscreen-off.png"].texture,
        false,
      );
      this._on(this.fullScreenButton, "change", this._onChangeFullScreen);
      const fullScreenButtonLayer = this.fullScreenButton.setup(config);
      fullScreenButtonLayer.position.set(405, 130);
      this.menuLayer.addChild(fullScreenButtonLayer);
      this.addEntity(this.fullScreenButton);

      // TODO: use event listener to check if full screen was exited manually with ESC key
    } else {
      const fullScreenButton = new PIXI.Sprite(this.config.app.loader.resources["images/ui/fullscreen-disabled.png"].texture);
      fullScreenButton.position.set(405, 130);
      this.menuLayer.addChild(fullScreenButton);
    }

    this.musicButton = new ToggleSwitch(
      this.config.app.loader.resources["images/ui/music-on.png"].texture,
      this.config.app.loader.resources["images/ui/music-off.png"].texture,
      !this.config.jukebox.muted, 
    );
    this._on(this.musicButton, "change", this._onChangeMusicIsOn);
    const musicButtonLayer = this.musicButton.setup(config);
    musicButtonLayer.position.set(405, 230);
    this.menuLayer.addChild(musicButtonLayer);
    this.addEntity(this.musicButton);

    // TODO prevent being able to turn both subtitles and sound off

    this.fxButton = new ToggleSwitch(
      this.config.app.loader.resources["images/ui/voices-on.png"].texture,
      this.config.app.loader.resources["images/ui/voices-off.png"].texture,
      !this.config.narrator.muted, 
    );
    this._on(this.fxButton, "change", this._onChangeFxIsOn);
    const fxButtonLayer = this.fxButton.setup(config);
    fxButtonLayer.position.set(630, 230);
    this.menuLayer.addChild(fxButtonLayer);
    this.addEntity(this.fxButton);

    this.subtitlesButton = new ToggleSwitch(
      this.config.app.loader.resources["images/ui/subtitles-on.png"].texture,
      this.config.app.loader.resources["images/ui/subtitles-off.png"].texture,
      this.config.narrator.showSubtitles, 
    );
    this._on(this.subtitlesButton, "change", this._onChangeShowSubtitles);
    const subtitlesButtonLayer = this.subtitlesButton.setup(config);
    subtitlesButtonLayer.position.set(630, 130);
    this.menuLayer.addChild(subtitlesButtonLayer);
    this.addEntity(this.subtitlesButton);

    return this.container;
  } 

  _onPause() {
    this.pauseButton.visible = false;
    this.menuLayer.visible = true;

    this.emit("pause");
  }

  _onPlay() {
    this.pauseButton.visible = true;
    this.menuLayer.visible = false;

    this.emit("play");
  }

  _onChangeFullScreen(turnOn) {
    if(turnOn) requestFullscreen(document.getElementById("game-parent"));
    else exitFullscreen();
  }

  _onChangeMusicIsOn(isOn) {
    this.config.jukebox.setMuted(!isOn);
  }

  _onChangeFxIsOn(isOn) {
    this.config.narrator.setMuted(!isOn);
  }

  _onChangeShowSubtitles(showSubtitles) {
    this.config.narrator.setShowSubtitles(showSubtitles);
  }
}

export class AnimatedSpriteEntity extends Entity {
  constructor(animatedSprite) {
    super();

    this.animatedSprite = animatedSprite;
  }

  onSignal(signal, data = null) {
    if(signal == "pause") this.animatedSprite.stop();
    else if(signal == "play") this.animatedSprite.play();
  }
}

export class SkipButton extends Entity {
  setup(config) {
    super.setup(config);

    this.isDone = false;

    const sprite = new PIXI.Sprite(this.config.app.loader.resources["images/ui/button-skip.png"].texture);
    sprite.anchor.set(0.5);
    sprite.position.set(this.config.app.screen.width - 50, this.config.app.screen.height - 50);
    sprite.interactive = true;
    this._on(sprite, "pointertap", this._onSkip);
    
    return sprite;
  }

  requestedTransition(options) {
    super.requestedTransition(options);

    return this.isDone;
  }

  _onSkip() {
    this.isDone = true;
  }
}

export class LoadingScene extends CompositeEntity {
  constructor(preloader) {
    super();

    this.preloader = preloader;
  }

  setup(config) {
    super.setup(config);  

    this.state = "loading"; // one of ["loading", "ready", "done"]
    this.progress = 0;
    this.shouldUpdateProgress = true;

    this.container.addChild(new PIXI.Sprite(this.preloader.resources["images/splash-screen.png"].texture));

    this.loadingContainer = new PIXI.Container();
    this.container.addChild(this.loadingContainer);

    this.loadingFill = new PIXI.Graphics();
    this.loadingFill.position.set(this.config.app.screen.width / 2 - 50, this.config.app.screen.height * 3/4 - 50);
    this.loadingContainer.addChild(this.loadingFill);

    const loadingFillMask = new PIXI.Graphics();
    loadingFillMask.beginFill(0xffffff);
    loadingFillMask.drawCircle(0, 0, 50);
    loadingFillMask.endFill();
    loadingFillMask.position.set(this.config.app.screen.width / 2, this.config.app.screen.height * 3/4);
    this.loadingContainer.addChild(loadingFillMask);

    this.loadingFill.mask = loadingFillMask;

    this.loadingCircle = new PIXI.Sprite(this.preloader.resources["images/loading-circle.png"].texture);
    this.loadingCircle.anchor.set(0.5);
    this.loadingCircle.position.set(this.config.app.screen.width / 2, this.config.app.screen.height * 3/4);
    this.loadingContainer.addChild(this.loadingCircle);

    return this.container;
  }

  requestedTransition(options) { 
    super.requestedTransition(options);

    return this.state === "done";
  }

  update(options) {
    super.update(options);

    if(this.state === "loading") { 
      this.loadingCircle.rotation += LOADING_SCENE_SPIN_SPEED * options.timeScale;
    
      if(this.shouldUpdateProgress) {
        const height = this.progress * 100; // Because the graphic happens to be 100px tall
   
        this.loadingFill.clear();
        this.loadingFill.beginFill(0xffffff);
        this.loadingFill.drawRect(0, 100, 100, -height);
        this.loadingFill.endFill();

        this.shouldUpdateProgress = false;
      }
    } else if(this.state === "ready") {
      if(_.filter(navigator.getGamepads(), _.identity).length >= 2) {
        this.state = "done";
      }
    }
  }

  updateProgress(fraction) {
    this.progress = fraction;
    this.shouldUpdateProgress = true;
  }

  setIsReady() {
    this.state = "ready";

    this.loadingContainer.visible = false;

    const playButton = new PIXI.Sprite(this.config.app.loader.resources["images/play.png"].texture);
    playButton.anchor.set(0.5);
    playButton.position.set(this.config.app.screen.width / 2, this.config.app.screen.height * 3/4);
    // this._on(playButton, "pointertap", () => this.state = "done");
    // playButton.interactive = true;
    this.container.addChild(playButton);
  }
}

export class DoneScene extends CompositeEntity {
  setup(config) {
    super.setup(config);  

    this.isDone = false;

    this.container.addChild(new PIXI.Sprite(this.config.preloader.resources["images/splash-screen.png"].texture));

    const button = new PIXI.Sprite(this.config.app.loader.resources["images/ui/button-replay.png"].texture);
    button.anchor.set(0.5);
    button.position.set(this.config.app.screen.width / 2, this.config.app.screen.height * 3/4);
    this._on(button, "pointertap", () => this.isDone = true);
    button.interactive = true;
    this.container.addChild(button);

    return this.container;
  }

  requestedTransition(options) { 
    super.requestedTransition(options);

    return this.isDone;
  }
}

export class PhysicsEntity extends Entity {
  constructor(body, graphics) {
    super();

    this.body = body;
    this.graphics = graphics;
  }

  update(options) {
    super.update(options);

    // Transfer positions of the physics objects to Pixi.js
    this.graphics.position.x = this.body.position[0];
    this.graphics.position.y = this.body.position[1];
    this.graphics.rotation = this.body.angle;
  }
}



export function makeNarrationKeyList(prefix, count) {
  const list = [];
  for(let i = 0; i < count; i++) list.push(prefix + i);
  return list;
}


// Returns Map of file names to Howl objects, with sprite definintions
export function loadNarrationAudio(narrationTable, languageCode) {
  // Prepare map of file names to sprite names
  const fileToSprites = new Map(); 
  for(let key in narrationTable) {
    const value = narrationTable[key];
    if(value.skipFile) continue; 

    const file = value.file || key; // File name defaults to the key name
    if(!fileToSprites.has(file)) fileToSprites.set(file, {}); // Insert empty sprite def if not present
    if("start" in value) {
      fileToSprites.get(file)[key] = [value.start, value.end - value.start]; 
    }
  }

  // Create map of file names to Howl objects
  const fileToHowl = new Map();
  for(let [file, sprites] of fileToSprites) {
    fileToHowl.set(file, new Howl({
      src: _.map(AUDIO_FILE_FORMATS, (audioFormat) => `audio/voices/${languageCode}/${file}.${audioFormat}`),
      sprite: sprites
    }));
  }
  return fileToHowl;
}

export function makeHowlerLoadPromise(howl) {
  return new Promise((resolve, reject) => {
    howl.on("load", () => resolve(howl))
    howl.on("loaderror", (id, err) => reject(howl, id, err));
  });
}

export function makePixiLoadPromise(loader) {
  return new Promise((resolve, reject) => {
    loader.onError.add(reject);
    loader.load(resolve);
  });  
}

export function makeDomContentLoadPromise(document) {
  return new Promise((resolve, reject) => {
    document.addEventListener("DOMContentLoaded", resolve);
  });
}

export function loadScript(languageCode) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open('GET', `scripts/script_${languageCode}.json`);
    request.responseType = 'json';
    request.onload = () => resolve(request.response);
    request.onerror = reject;
    request.send();
  });
};

const eventTimings = {};
export function startTiming(eventName) {
  eventTimings[eventName] = Date.now();
}
export function endTiming(eventName, category="loading") {
  const diff = Date.now() - eventTimings[eventName];
  console.debug("Timing for ", eventName, diff);
  ga("send", "timing", category, eventName, diff);
}

/* Makes a video element plays easily on iOS. Requires muting */
export function makeVideoElement() {
  const videoElement = document.createElement("video");
  videoElement.muted = true;
  videoElement.setAttribute("playsinline", true);
  return videoElement;
}

export function makeMusicHowls(fileNames) {
  // Create map of file names to Howl objects
  const fileToHowl = {};
  for(let file of fileNames) {
    fileToHowl[file] = new Howl({
      src: _.map(AUDIO_FILE_FORMATS, (audioFormat) => `audio/music/${file}.${audioFormat}`),
      loop: true,
    });
  }
  return fileToHowl;
}

// Copies over the defaulted options into obj. Takes care to only copy those options specified in the provided _defaults_
export function setupOptions(obj, options, defaults) {
  return _.extend(obj, _.defaults(_.pick(options, _.keys(defaults)), defaults));
}

export function makePreloader() {
  const loader = new PIXI.loaders.Loader();
  loader.add(PRELOADER_ASSETS);
  return loader;
}
