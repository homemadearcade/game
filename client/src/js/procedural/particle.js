/*
touchStartAnimation1
touchStartAnimation2
touchStartAnimation3
destroyAnimation/1/2/3

pickupAnimation1/2/3
interactAnimation1/2/3

shootAnimation1/2/3
useAnimation1/2/3

jumpAnimation1/2/3
dashAnimation1/2/3
teleportAnimation1/2/3
turnAroundAnimation1/2/3
landAnimation1/2/3
bounceAnimation1/2/3

splashWaterAnimation1/2/3
swimAnimation1/2/3
walkPathAnimation1/2/3
walkGrassAnimation1/2/3
walkMudAnimation1/2/3
walkMetalAnimation1/2/3
*/

// acceleration: {x: 0, y: 0},
// addAtBack: false,
// alpha: {start: 0.5, end: 0.2},
// animationType: "particle",
// blendMode: "normal",
// color: {start: "#fce400", end: "#ff4e00"},
// emitterLifetime: -1,
// frequency: 0.001,
// lifetime: {min: 0.01, max: 0.01},
// maxParticles: 1000,
// maxSpeed: 0,
// noRotation: false,
// pos: {x: 0, y: 0},
// rotationSpeed: {min: 0, max: 20},
// scale: {start: 0.4, end: 0.7, minimumScaleMultiplier: 1},
// spawnCircle: {r: 24, minR: 0},
// spawnRect: { w: 200, h: 200, x: -100, y: -100},
// spawnType: "point",
// spawnWaitTime: 100,
// speed: {start: 1000, end: 200, minimumSpeedMultiplier: 1},
// speedType: "very fast",
// startRotation: {min: 0, max: 360},
// useUpdateOwnerPos: true,

window.generateRandomColor = function () {
  return '#' + Math.floor(Math.random()*16777215).toString(16);
}

window.generateRandomEmitter = function(name) {

  const emitterData = {}
  Object.keys(window.generateEmitterData[name]).forEach((randomizeName) => {
    const value = window.generateEmitterData[name][randomizeName]

    if(randomizeName === 'colorStart' || randomizeName === 'colorEnd') {
      if(!emitterData.color) emitterData.color = {}
      if(randomizeName === 'colorStart') emitterData.color.start = window.generateRandomColor()
      if(randomizeName === 'colorEnd') emitterData.color.end = window.generateRandomColor()
    }

    if(randomizeName === 'scaleStart' || randomizeName === 'scaleEnd') {
      if(!emitterData.scale) emitterData.scale = {}
      if(randomizeName === 'scaleStart') emitterData.scale.start = window.getRandomFloat(value.min, value.max)
      if(randomizeName === 'scaleEnd') emitterData.scale.end = window.getRandomFloat(value.min, value.max)
    }

    if(randomizeName === 'alphaStart' || randomizeName === 'alphaEnd') {
      if(!emitterData.alpha) emitterData.alpha = {}
      if(randomizeName === 'alphaStart') emitterData.alpha.start = window.getRandomFloat(value.min, value.max)
      if(randomizeName === 'alphaEnd') emitterData.alpha.end = window.getRandomFloat(value.min, value.max)
    }

    if(randomizeName === 'images') {
      const index = window.getRandomInt(0, value.length-1)
      emitterData.images = { [value[index]]: true }
    }

  })

  return window.mergeDeep(_.clone(window.particleEmitterLibrary.fireBall), emitterData)
}

window.generateEmitterData = {
  'projectile': {
    colorStart: true,
    colorEnd: true,
    scaleStart: {
      min: .2,
      max: .6
    },
    scaleEnd: {
      min: .2,
      max: .4
    },
    alphaStart: {
      min: 0,
      max: .7
    },
    alphaEnd: {
      min: 0,
      max: .7
    },
    images: ['default', 'particle']
    // 'smokeparticle'
  },
  'explosion': {

  },
  'powerup': {

  },
  'laser': {

  }
}
