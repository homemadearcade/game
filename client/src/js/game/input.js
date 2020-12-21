import keycode from 'keycode'
import { onHeroTrigger } from './heros/onHeroTrigger.js'
import { shootBullet, swingBlade, dropAndModify, closestObjectBehavior } from './action.js';

global.defaultWASD =  {
  w: 'Move Up',
  s: 'Move Down',
  a: 'Move Left',
  d: 'Move Right',
}
global.defaultArrowKeys =  {
  up: 'Move Up',
  down: 'Move Down',
  left: 'Move Left',
  right: 'Move Right',
}

global.advancedPlatformerDefaults = {
  velocityDecay: 300,
  velocityInAirDecayExtra: 0,
  velocityOnLandDecayExtra: 100,
  velocityDelta: 1000,
  velocityInputGoal: 300,
}

function setDefault() {
  global.arrowKeysBehavior = {
    'flatDiagonal' : {
      ...global.defaultArrowKeys,
    },
    'velocity': {
      ...global.defaultArrowKeys,
    },
    'skating': {
      ...global.defaultArrowKeys,
    },
    'flatRecent': {
      ...global.defaultArrowKeys,
    },
    'advancedPlatformer': {
      ...global.defaultArrowKeys,
    },
    'inch': {
      ...global.defaultArrowKeys,
    },
    'angle' : {
      up: 'Face Up',
      down: 'Face Down',
      left: 'Face Left',
      right: 'Face Right',
    },
    'angleAndVelocity' : {
      up: 'Move Forward',
      down: 'Move Backward',
      left: 'Rotate Left',
      right: 'Rotate Right',
    },
    'none' : {
    }
  }

  global.arrowKeysBehavior2 = {
    'flatDiagonal' : {
      ...global.defaultWASD,
    },
    'velocity': {
      ...global.defaultWASD,
    },
    'skating': {
      ...global.defaultWASD,
    },
    'flatRecent': {
      ...global.defaultWASD,
    },
    'advancedPlatformer': {
      ...global.defaultWASD,
    },
    'inch': {
      ...global.defaultWASD,
    },
    'angleAndVelocity' : {
      w: 'Move Forward',
      s: 'Move Backward',
      a: 'Rotate Left',
      d: 'Rotate Right',
    },
    'angle' : {
      w: 'Face Up',
      s: 'Face Down',
      a: 'Face Left',
      d: 'Face Right',
    },
    'none' : {
    }

  }

  global.actionButtonBehavior = {
    'dropWall': 'Drop Wall',
    'shoot': 'Shoot Bullet',
    'swing': 'Swing Weapon',
    'accelerate': 'Accelerate',
    'accelerateBackwards': 'Go Backwards',
    'deccelerateToZero': 'Slow Down',
    'brakeToZero': 'Fast Stop',
    'mod': 'Activate Power',
    'toggle': 'Toggle',
    'dropAndModify': 'Drop',
    'shrink': 'Shrink',
    'grow': 'Grow',
    'vacuum': 'Suck In',
    'dash': 'Dash',
    'teleportDash': 'Dash ( Teleport )',
    'groundJump': 'Jump ( On Ground )',
    'floatJump': 'Jump ( On Ground or In Air )',
    'wallJump': 'Jump ( on Ground or On Wall )'
  }
}

function addCustomInputBehavior(behaviorList) {
  behaviorList.forEach((behavior) => {
    const { behaviorProp, behaviorName } = behavior
    if(behaviorProp === 'actionButtonBehavior') {
      global.actionButtonBehavior.unshift(behaviorName)
    }
    if(behaviorProp === 'arrowKeysBehavior') {
      global.arrowKeysBehavior.unshift(behaviorName)
    }
  })
}

function onPlayerIdentified(){
  GAME.keysDown = {}
  // this is the one for the host
  GAME.heroInputs = {}

  global.addEventListener("keydown", function (e) {
    const key = keycode(e.keyCode)

    if(global.isTargetTextInput(e)) return

    if(key === 'space' || key === 'left' || key === 'right' || key === 'up' || key === 'down') {
      e.preventDefault()
    }

    if(PAGE.role.isGhost && !HERO.ghostControl) {

    } else if(PAGE.role.isPlayer) {
      if(!PAGE.typingMode && !CONSTRUCTEDITOR.open) {
        GAME.keysDown[key] = true
      }
      //locally update the host input! ( teehee this is the magic! )
      if(PAGE.role.isHost && !CONSTRUCTEDITOR.open) {
        if(!GAME.heroInputs[HERO.id]) GAME.heroInputs[HERO.id] = {}
        GAME.heroInputs[HERO.id][key] = true
        GAME.heros[HERO.id].keysDown = GAME.heroInputs[HERO.id]
        onKeyDown(key, GAME.heros[HERO.id])
      } else {
        onKeyDown(key, GAME.heros[HERO.id])
        global.socket.emit('sendHeroKeyDown', key, HERO.id)
      }
    }
  }, false)

  global.addEventListener("keyup", function (e) {
    const key = keycode(e.keyCode)

    if(PAGE.role.isGhost && !HERO.ghostControl) {

    } else if(PAGE.role.isPlayer) {
      GAME.keysDown[key] = false
      //locally update the host input! ( teehee this is the magic! )
      if(PAGE.role.isHost) {
        if(!GAME.heroInputs[HERO.id]) GAME.heroInputs[HERO.id] = {}
        onKeyUp(key, GAME.heros[HERO.id])
        GAME.heros[HERO.id].keysDown = GAME.heroInputs[HERO.id]
        GAME.heroInputs[HERO.id][key] = false
      } else {
        global.socket.emit('sendHeroKeyUp', key, HERO.id)
      }
    }
    // global.socket.emit('sendHeroKeyUp', key, HERO.id)
  }, false)
}

function onKeyUp(key, hero) {
  const moddedHero = hero.mod()
  if(key === 'e' || key === 'v' || key === 'enter') {
    hero._cantInteract = false
  }
  GAME.heroInputs[hero.id][key] = false

  if(key === 'z' && moddedHero.zButtonBehavior) {
    handleActionEnd(hero, moddedHero.zButtonBehavior)
  }
  if(key === 'x' && moddedHero.xButtonBehavior) {
    handleActionEnd(hero, moddedHero.xButtonBehavior)
  }
  if(key === 'c' && moddedHero.cButtonBehavior) {
    handleActionEnd(hero, moddedHero.cButtonBehavior)
  }
  if(key === 'space' && moddedHero.spaceBarBehavior) {
    handleActionEnd(hero, moddedHero.spaceBarBehavior)
  }

  global.local.emit('onKeyUp', key, hero)
}

function handleActionEnd(hero, action) {
  let subObject = false
  Object.keys(hero.subObjects).forEach((name) => {
    const so = hero.subObjects[name]
    if(so.subObjectName === action) {
      action = so.actionButtonBehavior
      subObject = so
    }
  })
  if(!subObject) return

  if(subObject.actionState.manualRevertId) {
    const change = subObject.actionProps.effectJSON
    if(change.tags && change.tags.gravityY) {
      OBJECTS.resetPhysicsProperties(hero)
    }
    global.emitGameEvent('onEndMod', subObject.actionState.manualRevertId)
    subObject.actionState.manualRevertId = null
  }

  if(action === 'shrink') {
    hero._shootingLaser = false
    subObject._shootingLaser = false
  }
}

function handleActionButtonBehavior(hero, action, delta) {
  const moddedHero = hero.mod()

  let subObject = false
  Object.keys(hero.subObjects).forEach((name) => {
    const so = hero.subObjects[name]
    if(so.subObjectName === action) {
      action = so.actionButtonBehavior
      subObject = so
    }
  })

  let actionFired = false

  if(subObject && !subObject.actionState) subObject.actionState = {}

  if(subObject && subObject.actionState.waiting) {
    console.log('action button waiting')
    return
  }

  if(action === 'toggle' && subObject && !delta) {
    actionFired = true
    subObject._toggledOff = !subObject._toggledOff
    global.emitGameEvent('onHeroPutAwayToggle', hero, subObject)
  }

  if(action === 'shoot' && !delta) {
    actionFired = true
    if(subObject) {
      shootBullet({direction: hero.inputDirection, shooter: subObject, actionProps: subObject.actionProps })
      global.emitGameEvent('onHeroShootBullet', hero, subObject)
    } else {
      shootBullet({direction: hero.inputDirection, shooter: hero, actionProps: {
        tags: { monsterDestroyer: true, moving: true }
      }})
      global.emitGameEvent('onHeroShootBullet', hero)
    }
  }

  if(action === 'swing' && !delta) {
    actionFired = true
    if(subObject) {
      swingBlade({direction: hero.inputDirection, swinger: subObject, actionProps: subObject.actionProps })
      global.emitGameEvent('onHeroSwingBlade', hero, subObject)
    } else {
      swingBlade({direction: hero.inputDirection, swinger: hero, actionProps: {
        tags: { monsterDestroyer: true, moving: true }
      }})
      global.emitGameEvent('onHeroSwingBlade', hero)
    }
  }

  if((action === 'shrink' || action === 'grow' || action === 'vacuum') && delta) {
    actionFired = true

    hero._shootingLaser = true
    subObject._shootingLaser = true

    if(!GAME.gameState.started) return
    if(subObject) {
      closestObjectBehavior({
        direction: hero.inputDirection,
        shooter: subObject,
        actionProps: subObject.actionProps,
        behavior: action,
        delta,
      })
      // global.emitGameEvent('onHeroShootLaserTool', hero, subObject)
    } else {
      closestObjectBehavior({
        direction: hero.inputDirection,
        shooter: hero,
        actionProps: {
          distance: 100
        },
        behavior: action,
        delta,
      })
      // global.emitGameEvent('onHeroShootLaserTool', hero)
    }
  }

  if(action === 'dropAndModify' && !delta) {
    actionFired = true

    if(subObject) {
      dropAndModify({
        direction: hero.inputDirection,
        dropper: hero,
        actionProps: subObject.actionProps,
        dropping: subObject,
      })
    }
  }

  if(action === 'mod' && !delta) {
    actionFired = true
    if(subObject && !subObject.actionState.manualRevertId) {
      const manualRevertId = 'modrevert-' + global.uniqueID()
      global.emitGameEvent('onStartMod', {
        ownerId: hero.id,
        effectJSON: subObject.actionProps.effectJSON,
        manualRevertId
      })
      subObject.actionState.manualRevertId = manualRevertId
    }
  }

  if(action === 'accelerate' && delta) {
    actionFired = true

    hero.velocityAngle += (moddedHero.velocityDelta || 400) * delta
  }
  if(action === 'deccelerateToZero' && delta) {
    actionFired = true

    if((hero.velocityAngle < .1 && hero.velocityAngle > 0) ||  (hero.velocityAngle > -.1 && hero.velocityAngle < 0)) {
      hero.velocityAngle = 0
      hero.velocityX = 0
      hero.velocityY = 0
      return
    }
    if(hero.velocityAngle > 0 && delta) {
      hero.velocityAngle -= (moddedHero.velocityDelta || 400)  * delta
      return
    }
    if(hero.velocityAngle < 0 && delta) {
      hero.velocityAngle += (moddedHero.velocityDelta || 400)  * delta
      return
    }
  }
  if(action === 'brakeToZero' && delta) {
    actionFired = true

    if((hero.velocityAngle < 20 && hero.velocityAngle > 0) ||  (hero.velocityAngle > -20 && hero.velocityAngle < 0)) {
      hero.velocityAngle = 0
      hero.velocityX = 0
      hero.velocityY = 0
      return
    }
    if(hero.velocityAngle > 0) {
      hero.velocityAngle -= (moddedHero.velocityDelta || 400)  * delta * 4
      return
    }
    if(hero.velocityAngle < 0) {
      hero.velocityAngle += (moddedHero.velocityDelta || 400)  * delta * 4
      return
    }
  }
  if(action === 'accelerateBackwards' && delta) {
    actionFired = true

    hero.velocityAngle -= (moddedHero.velocityDelta || 400)  * delta
  }

  if((action === 'dash' || action === 'teleportDash') && !delta) {
    if(hero._dashable === false && hero.onObstacle) {
      if(GAME.gameState.timeoutsById[hero.id + '-dashable']) GAME.clearTimeout(hero.id + '-dashable')
      hero._dashable = true
    }

    if(hero._dashable === true) {
      actionFired = true

      if(action === 'teleportDash') {
        let power = 5
        if(subObject && subObject.actionProps.power) {
          power = subObject.actionProps.power
        }
        if(hero.inputDirection === 'up') {
          hero.y -= power * GAME.grid.nodeSize;
          global.emitGameEvent('onHeroTeleDash', hero)
        } else if(hero.inputDirection === 'down') {
          hero.y += power * GAME.grid.nodeSize;
          global.emitGameEvent('onHeroTeleDash', hero)
        } else if(hero.inputDirection === 'left') {
          hero.x -= power * GAME.grid.nodeSize;
          global.emitGameEvent('onHeroTeleDash', hero)
        } else if(hero.inputDirection === 'right') {
          hero.x += power * GAME.grid.nodeSize;
          global.emitGameEvent('onHeroTeleDash', hero)
        }
      } else {
        let dashVelocity = moddedHero.dashVelocity
        global.emitGameEvent('onHeroDash', hero)
        if(!dashVelocity) dashVelocity = 300
        if(moddedHero.tags.rotateable && hero.angle) {
          hero.velocityAngle = dashVelocity
        } else {
          if(hero.inputDirection === 'up') {
            hero.velocityY -= dashVelocity;
          } else if(hero.inputDirection === 'down') {
            hero.velocityY += dashVelocity;
          } else if(hero.inputDirection === 'left') {
            hero.velocityX -= dashVelocity;
          } else if(hero.inputDirection === 'right') {
            hero.velocityX += dashVelocity;
          }
        }
      }
      GAME.addTimeout(hero.id + '-dashable', moddedHero.dashTimeout || .6, () => {
        hero._dashable = true
      })
      hero._breakMaxVelocity = true
      hero._dashable = false
    }

    if(hero._dashable === undefined || hero._dashable === null || !GAME.gameState.timeoutsById[hero.id + '-dashable']) {
      hero._dashable = true
    }
  }

  if(hero.onObstacle && action === 'groundJump' && !delta) {
    actionFired = true

    hero.velocityY = moddedHero.jumpVelocity
    global.emitGameEvent('onHeroGroundJump', hero)
    // lastJump = Date.now();
  }

  if(action === 'wallJump' && !delta) {
    const velocity = moddedHero.wallJumpVelocity || 400

    if(hero.onObstacle) {
      hero.velocityY = moddedHero.jumpVelocity
      global.emitGameEvent('onHeroGroundJump', hero)
    }
    if(hero._canWallJumpLeft) {
      actionFired = true
      hero.velocityX = -velocity
      hero.velocityY = - velocity
      hero._canWallJumpLeft = false
      global.emitGameEvent('onHeroWallJump', hero)
    }
    if(hero._canWallJumpRight) {
      actionFired = true
      hero.velocityX = velocity
      hero.velocityY = - velocity
      global.emitGameEvent('onHeroWallJump', hero)
      hero._canWallJumpRight = false
    }
  }

  if(action === 'floatJump' && !delta) {
    if(hero._floatable === false && hero.onObstacle) {
      if(GAME.gameState.timeoutsById[hero.id + '-floatable']) GAME.clearTimeout(hero.id + '-floatable')
      hero._floatable = true
    }

    if(hero._floatable === true) {
      actionFired = true
      hero.velocityY = moddedHero.jumpVelocity
      global.emitGameEvent('onHeroFloatJump', hero)
      GAME.addTimeout(hero.id + '-floatable', moddedHero.floatJumpTimeout || .6, () => {
        hero._floatable = true
      })
      hero._floatable = false
      // lastJump = Date.now();
    }

    if(hero._floatable === undefined || hero._floatable === null || !GAME.gameState.timeoutsById[hero.id + '-floatable']) {
      hero._floatable = true
    }
  }

  if(subObject && subObject.actionProps && subObject.actionProps.debounceTime && actionFired) {
    const timeoutId = 'debounce-action-' + subObject.id + subObject.actionButtonBehavior
    subObject.actionState.waiting = true
    subObject.actionState.timeoutId = timeoutId
    GAME.addTimeout(timeoutId, subObject.actionProps.debounceTime, () => {
      subObject.actionState.waiting = false
    })
  }
}

function onUpdate(hero, keysDown, delta) {
  const moddedHero = hero.mod()

  if(hero.flags.paused) return

  const upPressed = keysDown['w'] || keysDown['up']
  const rightPressed = keysDown['d'] || keysDown['right']
  const downPressed = keysDown['s'] || keysDown['down']
  const leftPressed = keysDown['a'] || keysDown['left']

  if((!GAME.gameState.started || hero.flags.isAdmin) && (keysDown['shift'] || keysDown['caps lock'])) {
    if (upPressed) {
      if(hero.tags.adminInch) hero.y -= 1
      else hero.y -= GAME.grid.nodeSize
    }
    if (downPressed) {
      if(hero.tags.adminInch) hero.y += 1
      else hero.y += GAME.grid.nodeSize
    }

    if (leftPressed) {
      if(hero.tags.adminInch) hero.x -= 1
      else hero.x -= GAME.grid.nodeSize
    }

    if (rightPressed) {
      if(hero.tags.adminInch) hero.x += 1
      else hero.x += GAME.grid.nodeSize
    }

    hero._skipPosUpdate = true
    hero._skipCorrections = true

    return
  }

  /*
    left arrow	'left'
    up arrow	'up'
    right arrow	'right'
    down arrow	'down'
    w 87
    a 65
    s 83
    d 68
  */
  /// DEFAULT GAME FX
  if(hero.flags.paused || GAME.gameState.paused) return

  const xSpeed = moddedHero.velocityInitial + (moddedHero.velocityInitialXExtra || 0)
  const ySpeed = moddedHero.velocityInitial + (moddedHero.velocityInitialYExtra || 0)

  if (upPressed && !moddedHero.tags.disableUpKeyMovement) {
    if(moddedHero.arrowKeysBehavior === 'acc' || moddedHero.arrowKeysBehavior === 'acceleration') {
      hero.accY -= (ySpeed) * delta;
    } else if (moddedHero.arrowKeysBehavior === 'velocity') {
      hero.velocityY -= (ySpeed) * delta;
    }
  }
  if (downPressed && !moddedHero.tags.disableDownKeyMovement) {
    if(moddedHero.arrowKeysBehavior === 'acc' || moddedHero.arrowKeysBehavior === 'acceleration') {
      hero.accY += (ySpeed) * delta;
    } else if (moddedHero.arrowKeysBehavior === 'velocity') {
      hero.velocityY += (ySpeed) * delta;
    }
  }
  if (leftPressed) {
    if(moddedHero.arrowKeysBehavior === 'acc' || moddedHero.arrowKeysBehavior === 'acceleration') {
      hero.accX -= (xSpeed) * delta;
    } else if (moddedHero.arrowKeysBehavior === 'velocity') {
      hero.velocityX -= (xSpeed) * delta;
    }
  }
  if (rightPressed) {
    if(moddedHero.arrowKeysBehavior === 'acc' || moddedHero.arrowKeysBehavior === 'acceleration') {
      hero.accX += (xSpeed) * delta;
    } else if (moddedHero.arrowKeysBehavior === 'velocity') {
      hero.velocityX += (xSpeed) * delta;
    }
  }

  if(moddedHero.arrowKeysBehavior === 'angleAndVelocity') {
    if(typeof hero.angle !== 'number') hero.angle = 0
    if(typeof hero.velocityAngle !== 'number') hero.velocityAngle = 0

    if (upPressed && !moddedHero.tags.disableUpKeyMovement) {
      hero.velocityAngle += (moddedHero.rotationSpeed || 100) * delta;
    }
    if (downPressed && !moddedHero.tags.disableDownKeyMovement) {
      hero.velocityAngle -= (moddedHero.rotationSpeed || 100) * delta;
    }
    if (leftPressed) {
      hero.angle -= 1 * delta;
    }
    if (rightPressed) {
      hero.angle += 1 * delta
    }
  }

  if(moddedHero.arrowKeysBehavior === 'skating') {
    if(hero.inputDirection === 'up' && !moddedHero.tags.disableUpKeyMovement) {
      hero.y -= Math.ceil(ySpeed * delta);
    } else if(hero.inputDirection === 'down' && !moddedHero.tags.disableDownKeyMovement) {
      hero.y += Math.ceil(ySpeed * delta);
    } else if(hero.inputDirection === 'left') {
      hero.x -= Math.ceil(xSpeed * delta);
    } else if(hero.inputDirection === 'right') {
      hero.x += Math.ceil(xSpeed * delta);
    }
  }

  if(moddedHero.arrowKeysBehavior === 'angle') {
    if(typeof hero.angle !== 'number') hero.angle = 0
    if(typeof hero.velocityAngle !== 'number') hero.velocityAngle = 0

    if (upPressed) {
      hero.angle = angleTowardsDegree(hero.angle, global.degreesToRadians(0), delta)
    }
    if (downPressed) {
      // console.log(hero.angle, global.degreesToRadians(180))
      hero.angle = angleTowardsDegree(hero.angle, global.degreesToRadians(180), delta)
    }
    if (leftPressed) {
      hero.angle = angleTowardsDegree(hero.angle, global.degreesToRadians(270), delta)
    }
    if (rightPressed) {
      hero.angle = angleTowardsDegree(hero.angle, global.degreesToRadians(90), delta)
    }

    const angleCorrection = global.degreesToRadians(90)
    hero.velocityX = hero.velocityAngle * Math.cos(hero.angle - angleCorrection)
    hero.velocityY = hero.velocityAngle * Math.sin(hero.angle - angleCorrection)
  }


  function positionInput() {

    if(moddedHero.arrowKeysBehavior === 'flatDiagonal') {
      if (upPressed && !moddedHero.tags.disableUpKeyMovement) {
        hero._flatVelocityY = -ySpeed
      } else if (downPressed && !moddedHero.tags.disableDownKeyMovement) {
        hero._flatVelocityY = ySpeed
      } else {
        hero._flatVelocityY = 0
      }

      if (leftPressed) {
        hero._flatVelocityX = -xSpeed
      } else if (rightPressed) {
        hero._flatVelocityX = xSpeed
      } else {
        hero._flatVelocityX = 0
      }
    }

    if(moddedHero.arrowKeysBehavior === 'advancedPlatformer') {
      let lowestXVelocityAllowed = xSpeed
      let lowestYVelocityAllowed = ySpeed
      let normalDelta = (moddedHero.velocityDelta || global.advancedPlatformerDefaults.velocityDelta) * delta
      let goalVelocity = moddedHero.velocityInputGoal ||  global.advancedPlatformerDefaults.velocityInputGoal

      if (upPressed && hero.inputDirection == 'up' && !moddedHero.tags.disableUpKeyMovement) {
        if(hero.velocityY > -lowestYVelocityAllowed) {
          if(hero.velocityY < lowestYVelocityAllowed && hero.velocityY > 0) {
            // moving in other direction
            hero.velocityY -= normalDelta
            return
          } else if(hero.velocityY > lowestYVelocityAllowed) {
            // moving VERY FAST in other direction
            hero.velocityY -= normalDelta * 2
            return
          } else {
            hero.velocityY = -lowestYVelocityAllowed
          }
        }

        hero.velocityY -= normalDelta

        if(hero.velocityY < -goalVelocity) hero.velocityY = -goalVelocity
        return
      }

      if (downPressed && hero.inputDirection == 'down' && !moddedHero.tags.disableDownKeyMovement) {
        if(hero.velocityY < lowestYVelocityAllowed) {
          if(hero.velocityY > -lowestYVelocityAllowed && hero.velocityY < 0) {
            // moving in other direction
            hero.velocityY += normalDelta
            return
          } else if(hero.velocityY < -lowestYVelocityAllowed) {
            // moving VERY FAST in other direction
            hero.velocityY += normalDelta * 2
            return
          } else {
            hero.velocityY = lowestYVelocityAllowed
          }
        }

        hero.velocityY += normalDelta

        if(hero.velocityY > goalVelocity) hero.velocityY = goalVelocity
        return
      }

      if (leftPressed && hero.inputDirection == 'left') {
        if(hero.velocityX > -lowestXVelocityAllowed) {
          if(hero.velocityX < lowestXVelocityAllowed && hero.velocityX > 0) {
            // moving in other direction
            hero.velocityX -= normalDelta
            hero._turningLeft = true
            return
          } else if(hero.velocityX > lowestXVelocityAllowed) {
            // moving VERY FAST in other direction
            hero.velocityX -= normalDelta * 2
            return
          } else if(!hero._turningLeft){
            hero.velocityX = -lowestXVelocityAllowed
          }
        } else {
          hero._turningLeft = false
        }
        hero.velocityX -= normalDelta

        if(hero.velocityX < -goalVelocity) hero.velocityX = -goalVelocity
        return
      }

      if (rightPressed && hero.inputDirection == 'right') {
        if(hero.velocityX < lowestXVelocityAllowed) {
          if(hero.velocityX > -lowestXVelocityAllowed && hero.velocityX < 0) {
            // moving in other direction
            hero.velocityX += normalDelta
            hero._turningRight = true
            return
          } else if(hero.velocityX < -lowestXVelocityAllowed) {
            // moving VERY FAST in other direction
            hero.velocityX += normalDelta * 2
            return
          } else if(!hero._turningRight){
            hero.velocityX = lowestXVelocityAllowed
          }
        } else {
          hero._turningRight = false
        }

        hero.velocityX += normalDelta

        if(hero.velocityX > goalVelocity) hero.velocityX = goalVelocity
        return
      }

      hero._turningLeft = false
      hero._turningRight = false
    }

    if(moddedHero.arrowKeysBehavior === 'flatRecent') {
      hero._flatVelocityX = 0
      if(!moddedHero.tags.disableUpKeyMovement) {
        hero._flatVelocityY = 0
      }

      if (upPressed && hero.inputDirection == 'up' && !moddedHero.tags.disableUpKeyMovement) {
        hero._flatVelocityY = -Math.ceil(ySpeed * delta) * 100
        return
      }

      if (downPressed && hero.inputDirection == 'down' && !moddedHero.tags.disableDownKeyMovement) {
        hero._flatVelocityY = Math.ceil(ySpeed * delta) * 100
        return
      }

      if (leftPressed && hero.inputDirection == 'left') {
        hero._flatVelocityX = -Math.ceil(xSpeed * delta) * 100
        return
      }

      if (rightPressed && hero.inputDirection == 'right') {
        hero._flatVelocityX = Math.ceil(xSpeed * delta) * 100
        return
      }

      if (upPressed && !moddedHero.tags.disableUpKeyMovement) {
        hero._flatVelocityY = -Math.ceil(ySpeed * delta) * 100
      }

      if (downPressed && !moddedHero.tags.disableDownKeyMovement) {
        hero._flatVelocityY = Math.ceil(ySpeed * delta) * 100
      }

      if (leftPressed) {
        hero._flatVelocityX = -Math.ceil(xSpeed * delta) * 100
      }

      if (rightPressed) {
        hero._flatVelocityX = Math.ceil(xSpeed * delta) * 100
      }
    }
  }

  positionInput()

  // if(moddedHero.tags.allowCameraRotation) {
  //   if ('right' in keysDown) {
  //     hero.cameraRotation += delta
  //   }
  //   if ('left' in keysDown) {
  //     hero.cameraRotation -= delta
  //   }
  // }

  if(keysDown['z'] && moddedHero.zButtonBehavior) {
    handleActionButtonBehavior(hero, moddedHero.zButtonBehavior, delta)
  }
  if(keysDown['x'] && moddedHero.xButtonBehavior) {
    handleActionButtonBehavior(hero, moddedHero.xButtonBehavior, delta)
  }
  if(keysDown['c'] && moddedHero.cButtonBehavior) {
    handleActionButtonBehavior(hero, moddedHero.cButtonBehavior, delta)
  }
  if(keysDown['space'] && moddedHero.tags.spaceBarHoldable == true && moddedHero.spaceBarBehavior) {
    handleActionButtonBehavior(hero, moddedHero.spaceBarBehavior, delta)
  }
}

function onKeyDown(key, hero) {
  const moddedHero = hero.mod()

  if('e' === key || 'v' === key || 'enter' === key) {
    if(hero.dialogue && hero.dialogue.length) {
      let talkerId = hero.dialogueId
      let dialogueId = hero.dialogueId
      let _fireDialogueCompleteWithSpeakerId = hero._fireDialogueCompleteWithSpeakerId
      if(!_fireDialogueCompleteWithSpeakerId && hero.dialogue[0].dialogueId) dialogueId = hero.dialogue[0].dialogueId

      /// clear dialogue
      hero.dialogue.shift()
      if(!hero.dialogue.length) {
        hero.flags.showDialogue = false
        hero.flags.paused = false
        hero.onObstacle = false
        hero.dialogueId = null
        hero._fireDialogueCompleteWithSpeakerId = false
      }

      /// event
      if(_fireDialogueCompleteWithSpeakerId && dialogueId) {
        const object = OBJECTS.getObjectOrHeroById(dialogueId)
        global.emitGameEvent('onHeroDialogueNext', hero, object)
        if(!hero.dialogue.length) global.emitGameEvent('onHeroDialogueComplete', hero, object)
      } else if(dialogueId) {
        global.emitGameEvent('onHeroDialogueNext', hero, { id: dialogueId })
        if(!hero.dialogue.length) global.emitGameEvent('onHeroDialogueComplete', hero, { id: dialogueId })
      } else {
        global.emitGameEvent('onHeroDialogueNext', hero)
        if(!hero.dialogue.length) global.emitGameEvent('onHeroDialogueComplete', hero, { id: null })
      }

      // loop
      if(!hero.dialogue.length) {
        if(hero._loopDialogue && talkerId) {
          const talker = OBJECTS.getObjectOrHeroById(talkerId)
          if(talker) {
            global.emitGameEvent('onHeroInteract', hero, talker)
            onHeroTrigger(hero, talker, {}, {fromInteractButton: true})
            hero._loopDialogue = false
          }
        }
      }

      hero._cantInteract = true

      global.emitGameEvent('onUpdatePlayerUI', hero)
    }

    if(hero.cutscenes && hero.cutscenes.length) {
      hero.cutscenes.shift()
      if(!hero.cutscenes.length) {
        hero.flags.showCutscene = false
        hero.flags.paused = false
        hero.onObstacle = false
      }
      hero._cantInteract = true
      global.emitGameEvent('onCutsceneCompleted', hero)
      global.emitGameEvent('onUpdatePlayerUI', hero)
    }
  }

  if(hero.flags.paused || GAME.gameState.paused) {
    global.local.emit('onKeyDown', key, hero)
    return
  }

  //delta = , .018
  if('z' === key && moddedHero.zButtonBehavior) {
    handleActionButtonBehavior(hero, moddedHero.zButtonBehavior)
  }
  if('x' === key && moddedHero.xButtonBehavior) {
    handleActionButtonBehavior(hero, moddedHero.xButtonBehavior)
  }
  if('c' === key && moddedHero.cButtonBehavior) {
    handleActionButtonBehavior(hero, moddedHero.cButtonBehavior)
  }
  if('space' === key && moddedHero.tags.spaceBarHoldable != true && moddedHero.spaceBarBehavior) {
    handleActionButtonBehavior(hero, moddedHero.spaceBarBehavior)
  }

  const upPressed = 'w' === key || 'up' === key
  const rightPressed = 'd' === key || 'right' === key
  const downPressed = 's' === key || 'down' === key
  const leftPressed = 'a' === key || 'left' === key

  if(moddedHero.arrowKeysBehavior === 'inch') {
    const power = hero.inchPower || GAME.grid.nodeSize
    if (upPressed) {
      hero.y -= power
    } else if (downPressed) {
      hero.y += power
    } else if (leftPressed) {
      hero.x -= power
    } else if (rightPressed) {
      hero.x += power
    }
  }

  if (upPressed) {
    hero.inputDirection = 'up'
  }
  if (downPressed) {
    hero.inputDirection = 'down'
  }
  if (leftPressed) {
    hero.inputDirection = 'left'
  }
  if (rightPressed) {
    hero.inputDirection = 'right'
  }

  global.local.emit('onKeyDown', key, hero)
}

// cool that I pulled this off put please remove someday
Object.defineProperty(Number.prototype, 'mod', { value: function(n) {
  return ((this % n) + n) % n;
}})

function angleTowardsDegree(current, goal, delta) {
  const oneEighty = global.degreesToRadians(180)
  const threeSixty = global.degreesToRadians(360)

  current = (current % threeSixty)
  let distance = goal - current

  const verySmallDistance = (distance < .1 && distance >= 0) || (distance <= 0 && distance > -.1)
  const altDistance = threeSixty - distance
  const wrappedAllAround = (altDistance < .1 && altDistance >= 0) || (altDistance <= 0 && altDistance > -.1)

  if(verySmallDistance || wrappedAllAround) {
    return goal
  }

  if(distance > oneEighty) {
    goal = -(threeSixty - goal)
  }

  if(distance < -oneEighty) {
    goal = threeSixty + goal
  }

  if(current < goal) return current + (1 * delta)
  if(current > goal) return current - (1 * delta)
}

export default {
  addCustomInputBehavior,
  setDefault,
  onPlayerIdentified,
  onUpdate,
  onKeyDown,
  onKeyUp,
}
