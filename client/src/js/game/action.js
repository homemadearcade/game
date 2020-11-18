import collisionsUtil from '../utils/collisions.js'
import { dropObject } from '../heros/inventory.js'

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
      if(closestObject.width <= 1 && closestObject.height <= 1) closestObject._destroy = true
      if(closestObject.width <= 1) closestObject.width = 1
      if(closestObject.height <= 1) closestObject.height = 1
    }
    if(behavior === 'grow') {
      closestObject.width += power;
      closestObject.height += power;
      closestObject.x -= power/2
      closestObject.y -= power/2
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
    }
    if(behavior === 'grapplingHook') {
      // grapple and allow climbing with this hook
    }
  }
}

function createBullet({ shooter, actionProps, direction }) {
  let shot = {
    id: 'bullet-' + window.uniqueID(),
    width: 4,
    height: 4,
    tags: actionProps.shootTags,
  }

  shot.tags.rotateable = true

  const velocity = actionProps.shootVelocity || 100

  if(shooter.angle) {
    Object.assign(shot, {
      x: shooter.x + (shooter.width/2),
      y: shooter.y,
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

  dropping.tags.rotateable = true

  Object.assign(dropping.tags, actionProps.tags)

  if(actionProps.explosionProps) {
    dropping.subObjects = {
      explosion: {
        subObjectName: 'explosion',
        relativeX: -dropper.width,
        width: dropper.width * 3,
        relativeY: -dropper.height,
        height: dropper.height * 3,
        tags: actionProps.explosionProps.tags,
        opacity: actionProps.explosionProps.opacity,
        color: actionProps.explosionProps.color,
      }
    }
    dropping.subObjectChances = {explosion:{randomWeight:1,conditionList:null}}
    dropping.spawnPoolInitial = 1
    dropping.tags.spawnAllOnDestroy = true
  }

  let angle
  if(dropper.angle === 0 || dropper.angle) {
    angle = dropper.angle
  }

  if(direction === 'up') {
    Object.assign(dropping, {
      x: dropper.x,
      y: dropper.y - dropper.mod().height,
      angle: angle ? angle : 0,
    })
  }

  if(direction === 'down') {
    Object.assign(dropping, {
      x: dropper.x,
      y: dropper.y + dropper.mod().height,
      angle: angle ? angle : 1.5708 * 2,
    })
  }

  if(direction === 'right') {
    Object.assign(dropping, {
      x: dropper.x + dropper.mod().width,
      y: dropper.y,
      angle: angle ? angle : 1.5708,
    })
  }

  if(direction === 'left') {
    Object.assign(dropping, {
      x: dropper.x - dropper.mod().width,
      y: dropper.y,
      angle: angle ? angle : 1.5708 * 3,
    })
  }

  dropObject(dropper, dropping, 1, false)
  // OBJECTS.create([wall], { fromLiveGame: true })
}

export {
  shootBullet,
  dropAndModify,
  closestObjectBehavior
}
