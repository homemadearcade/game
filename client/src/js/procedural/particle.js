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

global._generateRandomEmitter = function(name, object) {
  console.log(name)
  const emitterData = global.generateRandomEmitter(name)

  GAME.library.animations['random-'+name] = emitterData
  const newName = 'random-'+name+'-'+global.getRandomInt(0, 99)
  GAME.library.animations[newName] = emitterData

  global.socket.emit('updateLibrary', {animations: GAME.library.animations})
  if(name == 'powerup' || name === 'areaGlow') {
    global.socket.emit('resetLiveParticle', object.id)
  }
}

global.generateRandomColor = function () {
  return '#' + Math.floor(Math.random()*16777215).toString(16);
}

global.generateRandomEmitter = function(name) {

  const emitterData = {}
  Object.keys(global.generateEmitterData[name]).forEach((randomizeName) => {
    const value = global.generateEmitterData[name][randomizeName]

    if(randomizeName === 'colorStart' || randomizeName === 'colorEnd') {
      if(!emitterData.color) emitterData.color = {}
      if(randomizeName === 'colorStart') emitterData.color.start = global.generateRandomColor()
      if(randomizeName === 'colorEnd') emitterData.color.end = global.generateRandomColor()
    }

    if(randomizeName === 'scaleStart' || randomizeName === 'scaleEnd') {
      if(!emitterData.scale) emitterData.scale = {}
      if(randomizeName === 'scaleStart') emitterData.scale.start = global.getRandomFloat(value.min, value.max)
      if(randomizeName === 'scaleEnd') emitterData.scale.end = global.getRandomFloat(value.min, value.max)
    }

    if(randomizeName === 'alphaStart' || randomizeName === 'alphaEnd') {
      if(!emitterData.alpha) emitterData.alpha = {}
      if(randomizeName === 'alphaStart') emitterData.alpha.start = global.getRandomFloat(value.min, value.max)
      if(randomizeName === 'alphaEnd') emitterData.alpha.end = global.getRandomFloat(value.min, value.max)
    }

    if(randomizeName === 'speedStart' || randomizeName === 'speedEnd') {
      if(!emitterData.speed) emitterData.speed = {}
      if(randomizeName === 'speedStart') emitterData.speed.start = global.getRandomFloat(value.min, value.max)
      if(randomizeName === 'speedEnd') emitterData.speed.end = global.getRandomFloat(value.min, value.max)
    }

    if(randomizeName === 'rotationSpeedMin' || randomizeName === 'rotationSpeedMax') {
      if(!emitterData.rotationSpeed) emitterData.rotationSpeed = {}
      if(randomizeName === 'rotationSpeedMin') emitterData.rotationSpeed.min = global.getRandomFloat(value.min, value.max)
      if(randomizeName === 'rotationSpeedMax') emitterData.rotationSpeed.max = global.getRandomFloat(value.min, value.max)
    }

    if(randomizeName === 'lifetimeMin' || randomizeName === 'lifetimeMax') {
      if(!emitterData.lifetime) emitterData.lifetime = {}
      if(randomizeName === 'lifetimeMin') emitterData.lifetime.min = global.getRandomFloat(value.min, value.max)
      if(randomizeName === 'lifetimeMax') emitterData.lifetime.max = global.getRandomFloat(value.min, value.max)
    }

    if(randomizeName === 'rotationSpeed') {
      if(!emitterData.rotationSpeed) emitterData.rotationSpeed = {}
      const val = global.getRandomFloat(value.min, value.max)
      emitterData.rotationSpeed.min = val
      emitterData.rotationSpeed.max = val
    }

    if(randomizeName === 'spawnCircleRadiusMax' || randomizeName === 'spawnCircleRadiusMax') {
      if(!emitterData.spawnCircle) emitterData.spawnCircle = {}
      if(randomizeName === 'spawnCircleRadiusMin') emitterData.spawnCircle.minR = global.getRandomFloat(value.min, value.max)
      if(randomizeName === 'spawnCircleRadiusMax') emitterData.spawnCircle.r = global.getRandomFloat(value.min, value.max)
    }

    if(randomizeName === 'spawnCircleRadius') {
      if(!emitterData.spawnCircle) emitterData.spawnCircle = {}
      const val = global.getRandomFloat(value.min, value.max)
      emitterData.spawnCircle.minR = val
      emitterData.spawnCircle.r = val
    }

    if(randomizeName === 'frequency') {
      const val = global.getRandomFloat(value.min, value.max)
      emitterData.frequency = val
    }

    if(randomizeName === 'maxParticles') {
      const val = global.getRandomInt(value.min, value.max)
      emitterData.maxParticles = val
    }

    if(randomizeName === 'images') {
      if(GAME.theme.genre === 'block') {
        emitterData.images = { Pixel: true }
      } else {
        const index = global.getRandomInt(0, value.length-1)
        emitterData.images = { [value[index]]: true }
      }
    }
  })

  if(name == 'projectile') {
    const clone = _.clone(global.particleEmitterLibrary.fireBall)
    if(emitterData.images) delete clone.images
    return global.mergeDeep(clone, emitterData)
  }
  if(name == 'laser') {
    const clone = _.clone(global.particleEmitterLibrary.laser)
    if(emitterData.images) delete clone.images
    return global.mergeDeep(clone, emitterData)
  }
  if(name == 'powerup') {
    const clone = _.clone(global.particleEmitterLibrary.powerRingSubtle)
    if(emitterData.images) delete clone.images
    return global.mergeDeep(clone, emitterData)
  }
  if(name == 'areaGlow') {
    const clone = _.clone(global.particleEmitterLibrary.areaGlow)
    if(emitterData.images) delete clone.images
    return global.mergeDeep(clone, emitterData)
  }
  if(name == 'explosion') {
    let clone
    if(Math.random() > .5) {
      clone = _.clone(global.particleEmitterLibrary.explosionCloud)
    } else {
      clone = _.clone(global.particleEmitterLibrary.explode)
    }
    const newEmitter = global.mergeDeep(clone, emitterData)

    newEmitter.matchObjectColor = false
    if(Math.random() > .9) {
      newEmitter.useOwnerSprite = true
    }
    if(newEmitter.images) delete newEmitter.images
    return newEmitter
  }
}

global.generateEmitterData = {
  'explosion': {
    scaleStart: {
      min: .2,
      max: 8
    },
    scaleEnd: {
      min: .2,
      max: 5
    },
    alphaStart: {
      min: 0,
      max: 1,
    },
    alphaEnd: {
      min: 0,
      max: 1,
    },
    rotationSpeed: {
      min: 0,
      max: 120
    },
    maxParticles: {
      max: 200,
      min: 5,
    },
    colorStart: true,
    colorEnd: true,
    images: ['default', 'Bubbles', 'Pixel', 'Sparks', 'Fire', 'smokeparticle', 'particle', 'particleSmallStar', 'particleCartoonStar', 'HardCircle', 'burst']
  },
  areaGlow: {
    scaleStart: {
      min: .2,
      max: 8
    },
    scaleEnd: {
      min: .2,
      max: 5
    },
    alphaStart: {
      min: 0,
      max: 1,
    },
    alphaEnd: {
      min: 0,
      max: 1,
    },
    rotationSpeed: {
      min: 0,
      max: 120
    },
    frequency: {
      //slower
      max: 1,
      //faster
      min: 0.01,
    },
    maxParticles: {
      max: 200,
      min: 5,
    },
    lifetimeMin: {
      min: 1,
      max: 50
    },
    lifetimeMax: {
      min: 10,
      max: 100
    },
    colorStart: true,
    colorEnd: true,
    images: ['default', 'Bubbles', 'Pixel', 'Sparks', 'Fire', 'smokeparticle', 'particle', 'particleSmallStar', 'particleCartoonStar', 'HardCircle', 'burst']
  },
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
    images: ['default', 'smokeparticle', 'particle', 'particleSmallStar', 'HardCircle', 'burst']

    // images: ['particle', 'smokeparticle']
    // 'smokeparticle'
  },
  'powerup': {
    alphaStart: {
      min: 0,
      max: .7
    },
    alphaEnd: {
      min: 0,
      max: .7
    },
    colorStart: true,
    colorEnd: true,
    scaleStart: {
      min: .6,
      max: 1.2
    },
    scaleEnd: {
      min: .2,
      max: 1
    },
    spawnCircleRadius: {
      min: 13,
      max: 30,
    },
    rotationSpeed: {
      min: 40,
      max: 120
    },
    frequency: {
      //slower
      max: 1,
      //faster
      min: 0.08,
    },

    // spawnRect vs ring
    images: ['default', 'smokeparticle', 'particle', 'particleSmallStar', 'particleCartoonStar', 'HardCircle', 'burst']
  },
  'laser': {
    colorStart: true,
    colorEnd: true,
    scaleStart: {
      min: .6,
      max: 1.2
    },
    scaleEnd: {
      min: 1,
      max: 2
    },
    speedStart: {
      min: 1000,
      max: 2000
    },
    speedEnd: {
      min: 1000,
      max: 2000
    },
    images: ['Bubbles', 'HardRain', 'smokeparticle', 'particleCartoonStar']
  }
}
