import keycode from 'keycode'
import { shootBullet, dropAndModify, closestObjectBehavior } from './action.js';

window.defaultWASD =  {
  w: 'Move Up',
  s: 'Move Down',
  a: 'Move Left',
  d: 'Move Right',
}
window.defaultArrowKeys =  {
  up: 'Move Up',
  down: 'Move Down',
  left: 'Move Left',
  right: 'Move Right',
}

window.advancedPlatformerDefaults = {
  velocityDecay: 300,
  velocityInAirDecayExtra: 0,
  velocityOnGroundDecayExtra: 100,
  velocityDelta: 1000,
  velocityInputGoal: 300,
}

function setDefault() {
  window.arrowKeysBehavior = {
    'flatDiagonal' : {
      ...window.defaultArrowKeys,
    },
    'velocity': {
      ...window.defaultArrowKeys,
    },
    'skating': {
      ...window.defaultArrowKeys,
    },
    'flatRecent': {
      ...window.defaultArrowKeys,
    },
    'advancedPlatformer': {
      ...window.defaultArrowKeys,
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

  window.arrowKeysBehavior2 = {
    'flatDiagonal' : {
      ...window.defaultWASD,
    },
    'velocity': {
      ...window.defaultWASD,
    },
    'skating': {
      ...window.defaultWASD,
    },
    'flatRecent': {
      ...window.defaultWASD,
    },
    'advancedPlatformer': {
      ...window.defaultWASD,
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

  window.actionButtonBehavior = {
    'dropWall': 'Drop Wall',
    'shoot': 'Shoot Bullet',
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
      window.actionButtonBehavior.unshift(behaviorName)
    }
    if(behaviorProp === 'arrowKeysBehavior') {
      window.arrowKeysBehavior.unshift(behaviorName)
    }
  })
}

function onPlayerIdentified(){
  GAME.keysDown = {}
  // this is the one for the host
  GAME.heroInputs = {}

  window.addEventListener("keydown", function (e) {
    const key = keycode(e.keyCode)

    if(window.isTargetTextInput(e)) return

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
        window.socket.emit('sendHeroKeyDown', key, HERO.id)
      }
    }
  }, false)

  window.addEventListener("keyup", function (e) {
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
        window.socket.emit('sendHeroKeyUp', key, HERO.id)
      }
    }
    // window.socket.emit('sendHeroKeyUp', key, HERO.id)
  }, false)
}

function onKeyUp(key, hero) {
  if(key === 'e' || key === 'v' || key === 'enter') {
    hero._cantInteract = false
  }
  GAME.heroInputs[hero.id][key] = false

  if(key === 'z' && hero.mod().zButtonBehavior) {
    handleActionEnd(hero, hero.mod().zButtonBehavior)
  }
  if(key === 'x' && hero.mod().xButtonBehavior) {
    handleActionEnd(hero, hero.mod().xButtonBehavior)
  }
  if(key === 'c' && hero.mod().cButtonBehavior) {
    handleActionEnd(hero, hero.mod().cButtonBehavior)
  }
  if(key === 'space' && hero.mod().spaceBarBehavior) {
    handleActionEnd(hero, hero.mod().spaceBarBehavior)
  }

  window.local.emit('onKeyUp', key, hero)
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
    window.emitGameEvent('onEndMod', subObject.actionState.manualRevertId)
    subObject.actionState.manualRevertId = null
  }

  if(action === 'shrink') {
    hero._shootingLaser = false
  }
}

function handleActionButtonBehavior(hero, action, delta) {
  let subObject = false
  Object.keys(hero.subObjects).forEach((name) => {
    const so = hero.subObjects[name]
    if(so.subObjectName === action) {
      action = so.actionButtonBehavior
      subObject = so
    }
  })

  if(subObject && !subObject.actionState) subObject.actionState = {}

  if(subObject && subObject.actionState.waiting) {
    console.log('action button waiting')
    return
  }

  if(action === 'toggle' && subObject) {
    subObject._toggledOff = !subObject._toggledOff
    window.emitGameEvent('onHeroPutAwayToggle', hero, subObject)
  }

  if(action === 'shoot') {
    if(!GAME.gameState.started) return
    if(subObject) {
      shootBullet({direction: hero.inputDirection, shooter: subObject, actionProps: subObject.actionProps })
      window.emitGameEvent('onHeroShootBullet', hero, subObject)
    } else {
      shootBullet({direction: hero.inputDirection, shooter: hero, actionProps: {
        tags: { monsterDestroyer: true, moving: true }
      }})
      window.emitGameEvent('onHeroShootBullet', hero)
    }
  }

  if(action === 'shrink' || action === 'grow' || action === 'vacuum') {
    if(!GAME.gameState.started) return

    hero._shootingLaser = true
    if(subObject) {
      closestObjectBehavior({
        direction: hero.inputDirection,
        shooter: subObject,
        actionProps: subObject.actionProps,
        behavior: action,
        delta,
      })
      // window.emitGameEvent('onHeroShootLaserTool', hero, subObject)
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
      // window.emitGameEvent('onHeroShootLaserTool', hero)
    }
  }

  if(action === 'dropAndModify') {
    if(!GAME.gameState.started) return
    if(subObject) {
      dropAndModify({
        direction: hero.inputDirection,
        dropper: hero,
        actionProps: subObject.actionProps,
        dropping: subObject,
      })
    }
  }

  if(action === 'mod') {
    if(subObject && !subObject.actionState.manualRevertId) {
      const manualRevertId = 'modrevert-' + window.uniqueID()
      window.emitGameEvent('onStartMod', {
        ownerId: hero.id,
        effectJSON: subObject.actionProps.effectJSON,
        manualRevertId
      })
      subObject.actionState.manualRevertId = manualRevertId
    }
  }

  if(action === 'accelerate') {
    hero.velocityAngle += (hero.mod().velocityDelta || 400) * delta
  }
  if(action === 'deccelerateToZero') {
    if((hero.velocityAngle < .1 && hero.velocityAngle > 0) ||  (hero.velocityAngle > -.1 && hero.velocityAngle < 0)) {
      hero.velocityAngle = 0
      hero.velocityX = 0
      hero.velocityY = 0
      return
    }
    if(hero.velocityAngle > 0) {
      hero.velocityAngle -= (hero.mod().velocityDelta || 400)  * delta
      return
    }
    if(hero.velocityAngle < 0) {
      hero.velocityAngle += (hero.mod().velocityDelta || 400)  * delta
      return
    }
  }
  if(action === 'brakeToZero') {
    if((hero.velocityAngle < 20 && hero.velocityAngle > 0) ||  (hero.velocityAngle > -20 && hero.velocityAngle < 0)) {
      hero.velocityAngle = 0
      hero.velocityX = 0
      hero.velocityY = 0
      return
    }
    if(hero.velocityAngle > 0) {
      hero.velocityAngle -= (hero.mod().velocityDelta || 400)  * delta * 4
      return
    }
    if(hero.velocityAngle < 0) {
      hero.velocityAngle += (hero.mod().velocityDelta || 400)  * delta * 4
      return
    }
  }
  if(action === 'accelerateBackwards') {
    hero.velocityAngle -= (hero.mod().velocityDelta || 400)  * delta
  }

  if(action === 'dash' || action === 'teleportDash') {
    if(hero._dashable === false && hero.onGround) {
      if(GAME.gameState.timeoutsById[hero.id + '-dashable']) GAME.clearTimeout(hero.id + '-dashable')
      hero._dashable = true
    }

    if(hero._dashable === true) {
      if(action === 'teleportDash') {
        let power = 5
        if(subObject && subObject.actionProps.power) {
          power = subObject.actionProps.power
        }
        if(hero.inputDirection === 'up') {
          hero.y -= power * GAME.grid.nodeSize;
          window.emitGameEvent('onHeroTeleDash', hero)
        } else if(hero.inputDirection === 'down') {
          hero.y += power * GAME.grid.nodeSize;
          window.emitGameEvent('onHeroTeleDash', hero)
        } else if(hero.inputDirection === 'left') {
          hero.x -= power * GAME.grid.nodeSize;
          window.emitGameEvent('onHeroTeleDash', hero)
        } else if(hero.inputDirection === 'right') {
          hero.x += power * GAME.grid.nodeSize;
          window.emitGameEvent('onHeroTeleDash', hero)
        }
      } else {
        let dashVelocity = hero.mod().dashVelocity
        window.emitGameEvent('onHeroDash', hero)
        if(!dashVelocity) dashVelocity = 300
        if(hero.mod().tags.rotateable && hero.angle) {
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
      GAME.addTimeout(hero.id + '-dashable', hero.mod().dashTimeout || .6, () => {
        hero._dashable = true
      })
      hero._breakMaxVelocity = true
      hero._dashable = false
    }

    if(hero._dashable === undefined || hero._dashable === null || !GAME.gameState.timeoutsById[hero.id + '-dashable']) {
      hero._dashable = true
    }
  }

  if(hero.onGround && action === 'groundJump') {
    hero.velocityY = hero.mod().jumpVelocity
    window.emitGameEvent('onHeroGroundJump', hero)
    // lastJump = Date.now();
  }

  if(action === 'wallJump') {
    const velocity = hero.mod().wallJumpVelocity || 400

    if(hero.onGround) {
      hero.velocityY = hero.mod().jumpVelocity
      window.emitGameEvent('onHeroGroundJump', hero)
    }
    if(hero._canWallJumpLeft) {
      hero.velocityX = -velocity
      hero.velocityY = - velocity
      hero._canWallJumpLeft = false
      window.emitGameEvent('onHeroWallJump', hero)
    }
    if(hero._canWallJumpRight) {
      hero.velocityX = velocity
      hero.velocityY = - velocity
      window.emitGameEvent('onHeroWallJump', hero)
      hero._canWallJumpRight = false
    }
  }

  if(action === 'floatJump') {
    if(hero._floatable === false && hero.onGround) {
      if(GAME.gameState.timeoutsById[hero.id + '-floatable']) GAME.clearTimeout(hero.id + '-floatable')
      hero._floatable = true
    }

    if(hero._floatable === true) {
      hero.velocityY = hero.mod().jumpVelocity
      window.emitGameEvent('onHeroFloatJump', hero)
      GAME.addTimeout(hero.id + '-floatable', hero.mod().floatJumpTimeout || .6, () => {
        hero._floatable = true
      })
      hero._floatable = false
      // lastJump = Date.now();
    }

    if(hero._floatable === undefined || hero._floatable === null || !GAME.gameState.timeoutsById[hero.id + '-floatable']) {
      hero._floatable = true
    }
  }

  if(subObject && subObject.actionProps && subObject.actionProps.debounceTime) {
    const timeoutId = 'debounce-action-' + subObject.id + subObject.actionButtonBehavior
    subObject.actionState.waiting = true
    subObject.actionState.timeoutId = timeoutId
    GAME.addTimeout(timeoutId, subObject.actionProps.debounceTime, () => {
      subObject.actionState.waiting = false
    })
  }
}

function onUpdate(hero, keysDown, delta) {
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

  const xSpeed = hero.mod().velocityInitial + (hero.mod().velocityInitialXExtra || 0)
  const ySpeed = hero.mod().velocityInitial + (hero.mod().velocityInitialYExtra || 0)

  if (upPressed && !hero.mod().tags.disableUpKeyMovement) {
    if(hero.mod().arrowKeysBehavior === 'acc' || hero.mod().arrowKeysBehavior === 'acceleration') {
      hero.accY -= (ySpeed) * delta;
    } else if (hero.mod().arrowKeysBehavior === 'velocity') {
      hero.velocityY -= (ySpeed) * delta;
    }
  }
  if (downPressed && !hero.mod().tags.disableDownKeyMovement) {
    if(hero.mod().arrowKeysBehavior === 'acc' || hero.mod().arrowKeysBehavior === 'acceleration') {
      hero.accY += (ySpeed) * delta;
    } else if (hero.mod().arrowKeysBehavior === 'velocity') {
      hero.velocityY += (ySpeed) * delta;
    }
  }
  if (leftPressed) {
    if(hero.mod().arrowKeysBehavior === 'acc' || hero.mod().arrowKeysBehavior === 'acceleration') {
      hero.accX -= (xSpeed) * delta;
    } else if (hero.mod().arrowKeysBehavior === 'velocity') {
      hero.velocityX -= (xSpeed) * delta;
    }
  }
  if (rightPressed) {
    if(hero.mod().arrowKeysBehavior === 'acc' || hero.mod().arrowKeysBehavior === 'acceleration') {
      hero.accX += (xSpeed) * delta;
    } else if (hero.mod().arrowKeysBehavior === 'velocity') {
      hero.velocityX += (xSpeed) * delta;
    }
  }

  if(hero.mod().arrowKeysBehavior === 'angleAndVelocity') {
    if(typeof hero.angle !== 'number') hero.angle = 0
    if(typeof hero.velocityAngle !== 'number') hero.velocityAngle = 0

    if (upPressed && !hero.mod().tags.disableUpKeyMovement) {
      hero.velocityAngle += (hero.mod().rotationSpeed || 100) * delta;
    }
    if (downPressed && !hero.mod().tags.disableDownKeyMovement) {
      hero.velocityAngle -= (hero.mod().rotationSpeed || 100) * delta;
    }
    if (leftPressed) {
      hero.angle -= 1 * delta;
    }
    if (rightPressed) {
      hero.angle += 1 * delta
    }
  }

  if(hero.mod().arrowKeysBehavior === 'skating') {
    if(hero.inputDirection === 'up' && !hero.mod().tags.disableUpKeyMovement) {
      hero.y -= Math.ceil(ySpeed * delta);
    } else if(hero.inputDirection === 'down' && !hero.mod().tags.disableDownKeyMovement) {
      hero.y += Math.ceil(ySpeed * delta);
    } else if(hero.inputDirection === 'left') {
      hero.x -= Math.ceil(xSpeed * delta);
    } else if(hero.inputDirection === 'right') {
      hero.x += Math.ceil(xSpeed * delta);
    }
  }

  if(hero.mod().arrowKeysBehavior === 'angle') {
    if(typeof hero.angle !== 'number') hero.angle = 0
    if(typeof hero.velocityAngle !== 'number') hero.velocityAngle = 0

    if (upPressed) {
      hero.angle = angleTowardsDegree(hero.angle, window.degreesToRadians(0), delta)
    }
    if (downPressed) {
      // console.log(hero.angle, window.degreesToRadians(180))
      hero.angle = angleTowardsDegree(hero.angle, window.degreesToRadians(180), delta)
    }
    if (leftPressed) {
      hero.angle = angleTowardsDegree(hero.angle, window.degreesToRadians(270), delta)
    }
    if (rightPressed) {
      hero.angle = angleTowardsDegree(hero.angle, window.degreesToRadians(90), delta)
    }

    const angleCorrection = window.degreesToRadians(90)
    hero.velocityX = hero.velocityAngle * Math.cos(hero.angle - angleCorrection)
    hero.velocityY = hero.velocityAngle * Math.sin(hero.angle - angleCorrection)
  }


  function positionInput() {

    if(hero.mod().arrowKeysBehavior === 'flatDiagonal') {
      if (upPressed && !hero.mod().tags.disableUpKeyMovement) {
        hero._flatVelocityY = -ySpeed
      } else if (downPressed && !hero.mod().tags.disableDownKeyMovement) {
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

    if(hero.mod().arrowKeysBehavior === 'advancedPlatformer') {
      let lowestXVelocityAllowed = xSpeed
      let lowestYVelocityAllowed = ySpeed
      let normalDelta = (hero.mod().velocityDelta || window.advancedPlatformerDefaults.velocityDelta) * delta
      let goalVelocity = hero.mod().velocityInputGoal ||  window.advancedPlatformerDefaults.velocityInputGoal

      if (upPressed && hero.inputDirection == 'up' && !hero.mod().tags.disableUpKeyMovement) {
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

      if (downPressed && hero.inputDirection == 'down' && !hero.mod().tags.disableDownKeyMovement) {
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

    if(hero.mod().arrowKeysBehavior === 'flatRecent') {
      hero._flatVelocityX = 0
      if(!hero.mod().tags.disableUpKeyMovement) {
        hero._flatVelocityY = 0
      }

      if (upPressed && hero.inputDirection == 'up' && !hero.mod().tags.disableUpKeyMovement) {
        hero._flatVelocityY = -Math.ceil(ySpeed * delta) * 100
        return
      }

      if (downPressed && hero.inputDirection == 'down' && !hero.mod().tags.disableDownKeyMovement) {
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

      if (upPressed && !hero.mod().tags.disableUpKeyMovement) {
        hero._flatVelocityY = -Math.ceil(ySpeed * delta) * 100
      }

      if (downPressed && !hero.mod().tags.disableDownKeyMovement) {
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

  // if(hero.mod().tags.allowCameraRotation) {
  //   if ('right' in keysDown) {
  //     hero.cameraRotation += delta
  //   }
  //   if ('left' in keysDown) {
  //     hero.cameraRotation -= delta
  //   }
  // }

  if(keysDown['z'] && hero.mod().tags.zButtonHoldable == true && hero.mod().zButtonBehavior) {
    handleActionButtonBehavior(hero, hero.mod().zButtonBehavior, delta)
  }
  if(keysDown['x'] && hero.mod().tags.xButtonHoldable == true && hero.mod().xButtonBehavior) {
    handleActionButtonBehavior(hero, hero.mod().xButtonBehavior, delta)
  }
  if(keysDown['c'] && hero.mod().tags.cButtonHoldable == true && hero.mod().cButtonBehavior) {
    handleActionButtonBehavior(hero, hero.mod().cButtonBehavior, delta)
  }
  if(keysDown['space'] && hero.mod().tags.spaceBarHoldable == true && hero.mod().spaceBarBehavior) {
    handleActionButtonBehavior(hero, hero.mod().spaceBarBehavior, delta)
  }
}

function onKeyDown(key, hero) {
  if('e' === key || 'v' === key || 'enter' === key) {
    if(hero.dialogue && hero.dialogue.length) {
      if(hero._fireDialogueCompleteWithSpeakerId && hero.dialogueId) {
        const object = OBJECTS.getObjectOrHeroById(hero.dialogueId)
        window.emitGameEvent('onHeroDialogueNext', hero, object)
        if(hero.dialogue.length === 1) window.emitGameEvent('onHeroDialogueComplete', hero, object)
      } else if(hero.dialogue[0].dialogueId) {
        window.emitGameEvent('onHeroDialogueNext', hero, { id: hero.dialogue[0].dialogueId })
        if(hero.dialogue.length === 1) window.emitGameEvent('onHeroDialogueComplete', hero, { id: hero.dialogue[0].dialogueId })
      } else {
        window.emitGameEvent('onHeroDialogueNext', hero)
      }
      hero.dialogue.shift()
      if(!hero.dialogue.length) {
        hero.flags.showDialogue = false
        hero.flags.paused = false
        hero.onGround = false
        hero.dialogueId = null
        hero._fireDialogueCompleteWithSpeakerId = false
      }
      hero._cantInteract = true
      window.emitGameEvent('onUpdatePlayerUI', hero)
    }

    if(hero.cutscenes && hero.cutscenes.length) {
      hero.cutscenes.shift()
      if(!hero.cutscenes.length) {
        hero.flags.showCutscene = false
        hero.flags.paused = false
        hero.onGround = false
      }
      hero._cantInteract = true
      window.emitGameEvent('onCutsceneCompleted', hero)
      window.emitGameEvent('onUpdatePlayerUI', hero)
    }
  }

  if(hero.flags.paused || GAME.gameState.paused) {
    window.local.emit('onKeyDown', key, hero)
    return
  }

  if('z' === key && hero.mod().tags.zButtonHoldable != true && hero.mod().zButtonBehavior) {
    handleActionButtonBehavior(hero, hero.mod().zButtonBehavior, .018)
  }
  if('x' === key && hero.mod().tags.xButtonHoldable != true && hero.mod().xButtonBehavior) {
    handleActionButtonBehavior(hero, hero.mod().xButtonBehavior, .018)
  }
  if('c' === key && hero.mod().tags.cButtonHoldable != true && hero.mod().cButtonBehavior) {
    handleActionButtonBehavior(hero, hero.mod().cButtonBehavior, .018)
  }
  if('space' === key && hero.mod().tags.spaceBarHoldable != true && hero.mod().spaceBarBehavior) {
    handleActionButtonBehavior(hero, hero.mod().spaceBarBehavior, .018)
  }

  const upPressed = 'w' === key || 'up' === key
  const rightPressed = 'd' === key || 'right' === key
  const downPressed = 's' === key || 'down' === key
  const leftPressed = 'a' === key || 'left' === key

  if(hero.mod().arrowKeysBehavior === 'grid') {
    if (upPressed) {
      hero.y -= GAME.grid.nodeSize
    } else if (downPressed) {
      hero.y += GAME.grid.nodeSize
    } else if (leftPressed) {
      hero.x -= GAME.grid.nodeSize
    } else if (rightPressed) {
      hero.x += GAME.grid.nodeSize
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

  window.local.emit('onKeyDown', key, hero)
}

// cool that I pulled this off put please remove someday
Object.defineProperty(Number.prototype, 'mod', { value: function(n) {
  return ((this % n) + n) % n;
}})

const oneEighty = window.degreesToRadians(180)
const threeSixty = window.degreesToRadians(360)
function angleTowardsDegree(current, goal, delta) {
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
