import collisionsUtil from '../utils/collisions.js'
import { dropObject } from './heros/inventory.js'
import onObjectCollide from './objects/onObjectCollide.js';

function swingBlade({ swinger, animationArea, hitBoxes, direction }) {
  let baseHitBox

  if(typeof swinger.angle === 'number') {

    const heightRotated = (swinger.height/2) * -1
    const widthRotated = (swinger.width/2) * -1

    // I dont know why I add the width in here again * 2
    //I used to add this to the width when it wasnt following... + swinger.width/2
    var rotatedRelativeX = Math.cos(swinger.angle) * ((widthRotated)) - Math.sin(swinger.angle) * (heightRotated);
    var rotatedRelativeY = Math.sin(swinger.angle) * ((widthRotated)) + Math.cos(swinger.angle) * (heightRotated);

    baseHitBox = {
      x: swinger.x + rotatedRelativeX,
      y: swinger.y + rotatedRelativeY,
      angle: swinger.angle
    }
  } else if(direction === 'up') {
    baseHitBox = {
      x: swinger.x + (swinger.width/2),
      y: swinger.y,
      angle: 0,
    }
  } else if(direction === 'down') {
    baseHitBox = {
      x: swinger.x + (swinger.width/2),
      y: swinger.y + swinger.height,
      angle: 1.5708 * 2,
    }
  } else if(direction === 'right') {
    baseHitBox = {
      x: swinger.x + swinger.width,
      y: swinger.y + (swinger.height/2),
      angle: 1.5708 * 1,
    }
  } else if(direction === 'left') {
    baseHitBox = {
      x: swinger.x,
      y: swinger.y + (swinger.height/2),
      angle: 1.5708 * 3,
    }
  }

  baseHitBox.id = swinger.id
  baseHitBox.width = swinger.width;
  baseHitBox.height = swinger.height;


  if(GAME.gameState.started) {
    baseHitBox.tags = {
      obstacle: true,
      rotateable: true,
      monsterDestroyer: true,
    }
  } else {
    baseHitBox.tags = {
      rotateable: true,
      destroyEventually: true,
    }
  }

  setTimeout(() => {
    if(GAME.objectsByTag['monster']) {
      collisionsUtil.check(baseHitBox, GAME.objectsByTag['monster'], (object) => {
        onObjectCollide(baseHitBox, object)
      })
    }
  }, 100)

  global.emitGameEvent('onSpriteAnimation', baseHitBox, 'sword1', { followObject: true })
}

function closestObjectBehavior({ shooter, actionProps, direction, behavior, delta }) {
  const closestObject = collisionsUtil.getClosestObjectInDirection(
    shooter,
    actionProps.distance,
    actionProps.tagsSeeking[0],
    direction,
  )

  if(closestObject) {
    let power = actionProps.power
    if(!actionProps.debounceTime) {
      power = power * delta
    }
    if(behavior === 'shrink') {
      closestObject.width -= power;
      closestObject.height -= power;
      closestObject.x += power/2
      closestObject.y += power/2
      if(closestObject.width <= 5 || closestObject.height <= 5) {
        closestObject._destroy = true
      }

      closestObject._shakePower = 3
      // if(closestObject.width < 1) closestObject.width = 1
      // if(closestObject.height < 1) closestObject.height = 1
    }
    if(behavior === 'grow') {
      closestObject.width += power;
      closestObject.height += power;
      closestObject.x -= power/2
      closestObject.y -= power/2

      closestObject._shakePower = 3
    }
    if(behavior === 'vacuum') {
      const x = closestObject.x + (closestObject.width/2)
      if(x > shooter.x) {
        closestObject.x -= power
      } else if(x < shooter.x){
        closestObject.x += power
      }

      const y = closestObject.y + (closestObject.height/2)
      if(y > shooter.y) {
        closestObject.y -= power
      } else if(y < shooter.y){
        closestObject.y += power
      }

      // closestObject._shakePower = 1
    }
    if(behavior === 'grapplingHook') {
      // grapple and allow climbing with this hook
    }
  }
}

function createBullet({ shooter, actionProps, direction }) {
  let shot = {
    id: 'bullet-' + global.uniqueID(),
    width: 4,
    height: 4,
    ownerId: shooter.ownerId || shooter.id,
    ...actionProps.bulletJSON,
  }

  if(!GAME.gameState.started) {
    shot.tags = {
      destroyEventually: true,
      destroyOnCollideWithObstacle: true,
      emitter: !!shot.emitterType,
    }
  }

  shot.tags.rotateable = true

  const velocity = actionProps.shootVelocity || 100

  if(shooter.angle && shooter.tags.relativeToAngle) {
    const heightRotated = (shooter.height/2) * -1
    const widthRotated = (shooter.width/2) * -1

    var rotatedRelativeX = Math.cos(shooter.angle) * ((widthRotated)) - Math.sin(shooter.angle) * (heightRotated);
    var rotatedRelativeY = Math.sin(shooter.angle) * ((widthRotated)) + Math.cos(shooter.angle) * (heightRotated);

    Object.assign(shot, {
      x: shooter.x + shooter.mod().width/2 + rotatedRelativeX - shot.width/2,
      y: shooter.y + shooter.mod().height/2 + rotatedRelativeY - shot.height/2,
      velocityAngle: velocity,
      angle: shooter.angle,
    })
  } else if(direction === 'up') {
    Object.assign(shot, {
      x: shooter.x + (shooter.width/2),
      y: shooter.y,
      velocityAngle: velocity,
      angle: 0,
    })
  } else if(direction === 'down') {
    Object.assign(shot, {
      x: shooter.x + (shooter.width/2),
      y: shooter.y + shooter.height,
      velocityAngle: velocity,
      angle: 1.5708 * 2
    })
  } else if(direction === 'right') {
    Object.assign(shot, {
      x: shooter.x + shooter.width,
      y: shooter.y + (shooter.height/2),
      velocityAngle: velocity,
      angle: 1.5708
    })
  } else if(direction === 'left') {
    Object.assign(shot, {
      x: shooter.x,
      y: shooter.y + (shooter.height/2),
      velocityAngle: velocity,
      angle: 1.5708 * 3
    })
  }

  return shot
}


function shootBullet({ shooter, actionProps, direction }) {
  let shooted = []
  if(actionProps.shootRadius) {
    if(actionProps.shootBulletsPerRound) {
      let radius = actionProps.shootRadius || .4
      let startAngle = createBullet({shooter, actionProps, direction }).angle -= (radius/2)
      for(let i = 0; i < actionProps.shootBulletsPerRound; i++) {
        let bullet = createBullet({shooter, actionProps, direction })
        bullet.angle = startAngle + (radius * (i/actionProps.shootBulletsPerRound))
        shooted.push(bullet)
      }
    } else {
      let radius = actionProps.shootRadius || .4
      const bullet1 = createBullet({shooter, actionProps, direction })
      bullet1.angle += (radius/2)
      shooted.push(bullet1)
      const bullet2 = createBullet({shooter, actionProps, direction })
      shooted.push(bullet2)
      const bullet3 = createBullet({shooter, actionProps, direction })
      shooted.push(bullet3)
      bullet3.angle -= (radius/2)
    }
    OBJECTS.create(shooted, { fromLiveGame: true })
  } else {
    if(actionProps.shootBulletsPerRound > 1) {
      let shotBullets = 1
      shooted = [createBullet({ shooter, actionProps, direction })]
      OBJECTS.create(shooted, { fromLiveGame: true })
      const shootInterval = setInterval(() => {
        shooted = [createBullet({ shooter: OBJECTS.getObjectOrHeroById(shooter.id), actionProps, direction })]
        OBJECTS.create(shooted, { fromLiveGame: true })
        shotBullets++
        if(shotBullets >= actionProps.shootBulletsPerRound) {
          clearInterval(shootInterval)
        }
      }, 2)
    } else {
      shooted = [createBullet({ shooter, actionProps, direction })]
      OBJECTS.create(shooted, { fromLiveGame: true })
    }
  }
}

function dropAndModify({ dropper, dropping, actionProps, direction }) {
  let directions = dropper.directions

  let newObject = _.cloneDeep(dropping)

  newObject.tags.rotateable = true

  Object.assign(newObject.tags, actionProps.tags)

  if(actionProps.explosionProps) {
    newObject.subObjects = {
      explosion: {
        subObjectName: 'explosion',
        relativeX: 0,
        width: dropper.width * 3,
        relativeY: 0,
        height: dropper.height * 3,
        tags: {
          ...actionProps.explosionProps.tags,
          potential: true,
        },
        opacity: actionProps.explosionProps.opacity,
        color: actionProps.explosionProps.color,
      }
    }
    if(!GAME.gameState.started) {
      newObject.subObjects.explosion.tags = {
        destroyQuickly: true,
        potential: true
      }
    }
    newObject.subObjectChances = {explosion:{randomWeight:1,conditionList:null}}
    newObject.spawnPoolInitial = 1
    newObject.tags.spawnAllOnDestroy = true
  }

  let angle
  if(dropper.angle === 0 || dropper.angle) {
    angle = dropper.angle
  }

  if(direction === 'up') {
    Object.assign(newObject, {
      x: dropper.x,
      y: dropper.y - dropper.mod().height,
      angle: angle ? angle : 0,
    })
  }

  if(direction === 'down') {
    Object.assign(newObject, {
      x: dropper.x,
      y: dropper.y + dropper.mod().height,
      angle: angle ? angle : 1.5708 * 2,
    })
  }

  if(direction === 'right') {
    Object.assign(newObject, {
      x: dropper.x + dropper.mod().width,
      y: dropper.y,
      angle: angle ? angle : 1.5708,
    })
  }

  if(direction === 'left') {
    Object.assign(newObject, {
      x: dropper.x - dropper.mod().width,
      y: dropper.y,
      angle: angle ? angle : 1.5708 * 3,
    })
  }

  dropObject(dropper, newObject, 1, false)
  // OBJECTS.create([wall], { fromLiveGame: true })
}

export {
  shootBullet,
  dropAndModify,
  closestObjectBehavior,
  swingBlade,
}
