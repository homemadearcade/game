function check(agent, objects, onCollide = () => {}) {
  let illegal = false
  // Are they touching?
  for(let i = 0; i < objects.length; i++){
    const object = objects[i]
    if(object.mod().removed) continue
    if(agent.id === object.id) continue
    if(object.constructParts) {
      object.constructParts.forEach((part) => {
        checkObject(agent, part, () => {
          if(object.tags.obstacle) illegal = true
          if(onCollide) onCollide(object)
        })
      })
    } else {
      checkObject(agent, object, () => {
        if(object.tags.obstacle) illegal = true
        if(onCollide) onCollide(object)
      })
    }
  }

  return illegal
}

function checkAnything(agent, objects, onCollide = () => {}) {
  let illegal = false
  // Are they touching?
  for(let i = 0; i < objects.length; i++){
    const object = objects[i]
    if(object.mod().removed) continue
    if(agent.id === object.id) continue
    if(object.constructParts) {
      object.constructParts.forEach((part) => {
        checkObject(agent, part, () => {
          illegal = true
          if(onCollide) onCollide(object)
        })
      })
    } else {
      checkObject(agent, object, () => {
        illegal = true
        if(onCollide) onCollide(object)
      })
    }
  }

  return illegal
}

function checkObject(agent, object, onCollide) {
  if (
    agent.x < (object.x + object.width)
    && object.x < (agent.x + agent.width)
    && agent.y < (object.y + object.height)
    && object.y < (agent.y + agent.height)
  ) {
    if(onCollide) onCollide()
    return true
  }

  return false
}

function getClosestObjectInDirection(start, distance, tag, direction) {
  let radians

  if(direction) {
    radians = 0
    if(direction === 'right') {
      radians = degreesToRadians(90)
    }

    // down
    if(direction === 'down') {
      radians = degreesToRadians(180)
    }

    // left
    if(direction === 'left') {
      radians = degreesToRadians(270)
    }
  }

  const projectile = {
    x: start.x,
    y: start.y,
    angle: direction ? radians : start.angle,
    width: start.width * 2,
    height: start.height * 2,
    velocityAngle: GAME.grid.nodeSize,
    tags: {
      rotateable: true,
      moving: true,
    }
  }

  let objects = GAME.objectsByTag[tag]
  let closestObject;
  for(let totalDiff = 0; totalDiff < distance;) {
    for(let i = 0; i < objects.length; i++) {
      const object = objects[i]
      if(object.mod().removed) continue
      if(projectile.id === object.id) continue
      if(object.constructParts) {
        object.constructParts.forEach((part) => {
          checkObject(projectile, part, () => {
            closestObject = part
          })
        })
      } else {
        checkObject(projectile, object, () => {
          closestObject = object
        })
      }

      if(closestObject) {
        return closestObject
      }
    }

    PHYSICS.updatePosition(projectile, 1)
    totalDiff = Math.abs(projectile.x - start.x) + Math.abs(projectile.y - start.y)
  }
}

export default {
  check,
  checkAnything,
  checkObject,
  getClosestObjectInDirection,
}
