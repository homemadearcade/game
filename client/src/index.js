// zooming in and out to different worlds, to pacman world and then to zelda world.
// youll probably need to 'switch heros....'

// Send player to... x, y ( have them like start to move really fast and possibly pathfind)
// stop player (velocity)
// attack button ( like papa bear spears!! )
// procedural
// pathfinding
// respawning enemies area.
// planet gravity! Would be cool to have..
// can we create gravity points in space yeah ^^
// reset hero 'other'..is dumb

// function for adding objects ( I need to make sure to add all tags to an object from the start )
// revise this bs idea of the more advanced editor..

// Negatives
//
// Go back to respawn
// Lose score
// Lose Items
// Lose Power up
//
// Positives
//
// Level Up ( Get experience, +1, advancement , makes game easier)
// Get tool ( style change, changes game )
// Add Life ( get a second chance to play game )
// + score, destroy bad guy

//--------

// mode where I add just small filled in square! We need a way to let them know its a 'treasure'
// switching to pacman mode, reset objects without page refresh
// change drawborder to actually just draw lines....
// test physics collisions to breaking point and find BVH bug
// make it easier for admin to move objects
// set game boundaries to delete objects
// grid world pathfinding
// preset worlds
// shadow player ( that editor can play with in their own simulation )
// treasure chest delayed queued updates
// toggle for score
// toggle for show grid, show names, show camera area... stc

// controlling X or Y scroll
// TRUE zelda camera work

// AHA MOMENTS
// I WAS MOVING AROUND
// ADDING GRAVITY
// HAVING THE WORLD BEGIN POPULATING BEFORE YOU
// SWITCHING PHYSICS BACK AND FORTH
// FIELD OF VISION

// leveling up

// procedural

// an out of bounds selector for object garbage collection
// basic physics or properties within the grid system
// MORE PRESETS. On ice is basically just switching between position and velocity input prop...
// a preset for the camera to be exact specifications based on spawn point.
// optimize shadow feature, not all vertices!
// CREATE A FULL GAME LOOP

import './styles/index.scss'
import './styles/jsoneditor.css'
import chat from './js/chat.js'
import physics from './js/physics.js'
import input from './js/input.js'
import camera from './js/camera.js'
import playEditor from './js/playeditor/index.js'
import shadow from './js/shadow.js'
import action from './js/action.js'
import intelligence from './js/intelligence.js'
import grid from './js/grid.js'
import battle from './js/battle.js'
import feedback from './js/feedback.js'
import io from 'socket.io-client'
import sockets from './js/sockets.js'
import constellation from './js/constellation.js'

// SOCKET START
if (window.location.origin.indexOf('localhost') > 0) {
  window.socket = io.connect('http://localhost:4000');
} else {
  window.socket = io.connect();
}
window.socket = socket

// DOM
window.canvasMultiplier = 1;
window.CONSTANTS = {
	PLAYER_CANVAS_WIDTH: 640 * window.canvasMultiplier,
	PLAYER_CANVAS_HEIGHT: 360 * window.canvasMultiplier,
  PLAYER_CAMERA_WIDTH: 640,
  PLAYER_CAMERA_HEIGHT: 360,
}

var canvas = document.createElement("canvas");
window.ctx = canvas.getContext("2d");
canvas.width = window.CONSTANTS.PLAYER_CANVAS_WIDTH;
canvas.height = window.CONSTANTS.PLAYER_CANVAS_HEIGHT;
canvas.id = 'game'
document.body.appendChild(canvas);

window.usePlayEditor = localStorage.getItem('useMapEditor') === 'true'
if(!window.usePlayEditor) {
  var editor = document.getElementById("play-editor");
  editor.style = 'display:none';
}

/// GLOBAL
// window.objects = []
window.game ={}
window.current = {
  chat: ''
}
var game = {
  paused: false,
}
var flags = {

}
window.respawnHero = function () {
  // hero spawn point takes precedence
  if(window.preferences.worldSpawnPointX) {
    window.hero.x = window.preferences.worldSpawnPointX
    window.hero.y = window.preferences.worldSpawnPointY
    return
  }

  if(window.hero.spawnPointX) {
    window.hero.x = window.hero.spawnPointX;
    window.hero.y = window.hero.spawnPointY;
    return
  }

  // default pos
  window.hero.x = 400;
  window.hero.y = 400;
}

window.resetHero = function(updatedHero) {
	physics.removeObject(window.hero)
	if(updatedHero) {
		Object.assign(window.hero, updatedHero)
	} else {
    let newHero = {}
		Object.assign(newHero, defaultHero)
    window.hero = newHero
    window.heros[window.hero.id] = window.hero
	}
	localStorage.setItem('hero', JSON.stringify(window.hero));
	physics.addObject(window.hero)
}

window.resetReachablePlatformHeight = function(heroIn) {
	let velocity = heroIn.jumpVelocity
	let gravity = 1000
	let delta = (0 - velocity)/gravity
	let height = (velocity * delta) +  ((gravity * (delta * delta))/2)
	return height
}

window.resetReachablePlatformWidth = function(heroIn) {
	let velocity = heroIn.speed
	let gravity = 1000
	let deltaInAir = (0 - heroIn.jumpVelocity)/gravity
	let width = (velocity * deltaInAir)
	return width * 2
}

window.removeObject = function(id) {
  window.objects = window.objects.filter((obj) => obj.id !== id)
  if(!window.usePlayEditor) {
    physics.removeObjectById(id)
  }
}

/////////////
//PREFERENCES
/////////////
/////////////
const defaultPreferences = {
	lockCamera: {},
	gameBoundaries: {},
}
window.preferences = defaultPreferences;

/////////////
// HERO
/////////////
/////////////
const defaultHero = {
	width: 40,
	height: 40,
  paused: false,
	velocityX: 0,
	velocityY: 0,
	velocityMax: 25,
	accY: 0,
	accX: 0,
	accDecayX: 0,
	accDecayY: 0,
	speed: 100,
	arrowKeysBehavior: 'position',
	jumpVelocity: -480,
	// spawnPointX: (40) * 20,
	// spawnPointY: (40) * 20,
	gravity: 0,
	tags: {'hero': true, isPlayer: true},
	zoomMultiplier: 1,
  x: 400,
  y: 400,
}

if(!window.usePlayEditor) {
	let savedHero = JSON.parse(localStorage.getItem('hero'));
	if(savedHero){
		window.hero = savedHero
    // in case we need to reset
    defaultHero.id = savedHero.id
	} else if(!window.hero) {
    defaultHero.id = 'hero-'+Date.now()
		window.hero = {...defaultHero}
		window.respawnHero()
	}
	window.hero.reachablePlatformHeight = window.resetReachablePlatformHeight(window.hero)
	window.hero.reachablePlatformWidth = window.resetReachablePlatformWidth(window.hero)

	window.socket.emit('saveSocket', hero)

	// fuckin window.heros...
	window.heros = {
		[window.hero.id]:window.hero,
	}

	physics.addObject(window.hero)
}

/////////////
//GAME LOOP
/////////////
/////////////
var start = function () {
	grid.init()
  sockets.init()

  if(usePlayEditor) {
		playEditor.init(ctx)
	} else {
    constellation.init(ctx)
    camera.init()
		input.init()
		chat.init()
		action.init()
	}
	main()
};

// Update game objects
var update = function (delta) {
  if(!window.hero.paused) {
    input.update(hero, delta)
    intelligence.update(window.hero, window.objects)
    if(window.hero.arrowKeysBehavior !== 'grid') {
      physics.update(window.hero, window.objects, delta)
    } else {
      grid.update(window.hero, window.objects)
    }
  }

  /// zoom targets
  if(window.hero.animationZoomTarget) {
    if(window.hero.animationZoomTarget > window.hero.animationZoomMultiplier) {
      window.hero.animationZoomMultiplier = window.hero.animationZoomMultiplier/.97
      if(window.hero.animationZoomTarget < window.hero.animationZoomMultiplier) {
        if(window.hero.endAnimation) window.hero.animationZoomMultiplier = null
        else {
          window.hero.animationZoomMultiplier = window.hero.animationZoomTarget
        }
        window.socket.emit('updateHero', window.hero)
      }
    }

    if(window.hero.animationZoomTarget < window.hero.animationZoomMultiplier) {
      window.hero.animationZoomMultiplier = window.hero.animationZoomMultiplier/1.03
      if(window.hero.animationZoomTarget > window.hero.animationZoomMultiplier) {
        if(window.hero.endAnimation) window.hero.animationZoomMultiplier = null
        else {
          window.hero.animationZoomMultiplier = window.hero.animationZoomTarget
        }
        window.socket.emit('updateHero', window.hero)
      }
    }
  }

	window.socket.emit('updateObjects', objects)
  window.socket.emit('updateHeroPos', window.hero)
  localStorage.setItem('hero', JSON.stringify(window.hero));
};

// Draw everything
var render = function () {
	let vertices = [...window.objects].reduce((prev, object) => {
		prev.push({a:{x:object.x,y:object.y}, b:{x:object.x + object.width,y:object.y}})
		prev.push({a:{x:object.x + object.width,y:object.y}, b:{x:object.x + object.width,y:object.y + object.height}})
		prev.push({a:{x:object.x + object.width,y:object.y + object.height}, b:{x:object.x,y:object.y + object.height}})
		prev.push({a:{x:object.x,y:object.y + object.height}, b:{x:object.x,y:object.y}})
		return prev
	}, [])

  //reset background
	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	//set camera so we render everything in the right place
  camera.set(ctx, window.hero)

	window.preferences.renderStyle = 'outlines'
 	if (window.preferences.renderStyle === 'outlines') {
		ctx.strokeStyle = "#999";
		for(var i=0;i<vertices.length;i++){
			camera.drawVertice(ctx, vertices[i])
		}
		ctx.fillStyle = 'white';
		camera.drawObject(ctx, window.hero)
	} else if(window.preferences.renderStyle === 'physics'){
		physics.drawSystem(ctx, vertices)
	} else {
		for(let i = 0; i < window.objects.length; i++){
			camera.drawObject(ctx, window.objects[i])
		}
	}

	window.preferences.shadows = false
	if(window.preferences.shadows === true) {
		shadow.draw(ctx, vertices, hero)
	}

  for(var heroId in window.heros) {
    let currentHero = window.heros[heroId];
    camera.drawObject(ctx, currentHero);
  }

  chat.render(ctx);
	feedback.draw(ctx);
}

// The main game loop
var main = function () {
  if(!window.objects || !window.preferences || !window.grid || Object.keys(window.heros).length === 0) {
    requestAnimationFrame(main);
    return
  }

	var now = Date.now();
	var delta = now - then;
	if(delta > 23) delta = 23

	if(window.usePlayEditor) {
		playEditor.update(delta)
    playEditor.render(ctx, window.hero, window.objects);
  }else {
		update(delta / 1000);
    render();
    if(window.hero.animationZoomMultiplier) {
      constellation.animate()
    } else {
      chat.render(ctx)
    }

		// physics.drawSystem(ctx, hero)
  }

	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
setTimeout(start, 1000);
