import render from './render'
import Camera from './camera.js'
import Shake from './cameraShake.js'
import popover from './popover.js'
import constellation from './constellation.js'
import './pixi/index'
import { drawShadow } from './shadow.js'

global.MAP = {
  canvas: null,
  ctx: null,
  camera: new Camera()
}

MAP.onPlayerIdentified = function() {
  // Canvas SETUP
  MAP.canvas = document.createElement("canvas");
  MAP.ctx = MAP.canvas.getContext("2d");

    function onResize() {
      if(GAME.world.tags && GAME.world.tags.shadow) return
      let gameElementWidth = global.innerWidth
      if(PAGE.isLogOpen) gameElementWidth = gameElementWidth * .8
      MAP.canvasMultiplier = gameElementWidth/640;
      if(MAP.canvasMultiplier > global.maxCanvasMultiplier) MAP.canvasMultiplier = global.maxCanvasMultiplier
      MAP.canvas.width = 640 * MAP.canvasMultiplier;
      MAP.canvas.height = 320 * MAP.canvasMultiplier;
      // const GC = document.getElementById('GameContainer')
      // GC.style.width = 640 * MAP.canvasMultiplier;
      // GC.style.height = 320 * MAP.canvasMultiplier;
      // console.log(GC.style)
      constellation.onResize(MAP.ctx)
    }
    global.addEventListener("resize", onResize);
    global.local.on('onOpenLog', onResize)
    global.local.on('onCloseLog', onResize)
    onResize()

  MAP.canvas.id = 'game-canvas'
  document.getElementById('GameContainer').appendChild(MAP.canvas);

  MAPEDITOR.set(MAP.ctx, MAP.canvas, MAP.camera)
}

MAP.onWorldCameraEffect = function(type, options = {}) {
  if(type === 'cameraShake') {
    MAP.cameraEffect(type, options)
  }
}

MAP.onHeroCameraEffect = function(type, heroId, options = {}) {
  if(HERO.id === heroId) {
    MAP.cameraEffect(type, options)
  }
}

MAP.cameraEffect = function(type, options = {}) {
  if(type === 'cameraShake' && MAP._readyForShake !== false) {
    MAP.camera.shakeAmplitude = options.amplitude || 32
    const duration = options.duration || 2000
    MAP.camera.xShake = new Shake(duration, options.frequency || 40)
    MAP.camera.yShake = new Shake(duration, options.frequency || 40)
    MAP.camera.xShake.start()
    MAP.camera.yShake.start()
    MAP._readyForShake = false
    setTimeout(() => {
      MAP._readyForShake = true
    }, duration)
  }
}

MAP.onRender = function(delta) {
  const { ctx, canvas } = MAP
  const hero = GAME.heros[HERO.id]

  let camera = MAP.camera
  //set camera so we render everything in the right place
  if(CONSTRUCTEDITOR.open) {
    camera = CONSTRUCTEDITOR.camera
  } else if(PATHEDITOR.open) {
    camera = PATHEDITOR.camera
  } else {
    if(hero) camera.set(hero)
  }

  camera.update(hero, delta)

  if(camera.xShake && camera.xShake.isShaking) {
    camera.xShake.update()
  }
  if(camera.yShake && camera.yShake.isShaking) {
    camera.yShake.update()
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if(PIXIMAP.assetsLoaded && (!GAME.gameState.paused || CONSTRUCTEDITOR.open || PATHEDITOR.open)) {
    render.update(camera)
    // drawShadow(ctx, GAME.objects.filter((o) => {
    //   if(o.tags.obstacle) return true
    // }), GAME.heros[HERO.id])
  } else {
    canvas.style.backgroundColor = '#222'
  }

  if(hero && GAME.heros[HERO.id] && GAME.heros[HERO.id].animationZoomMultiplier) {
    constellation.onRender()
  }
}
