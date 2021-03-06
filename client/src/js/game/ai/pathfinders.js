import pathfinding from '../../utils/pathfinding.js'
import gridUtil from '../../utils/grid.js'

function pathfindingAI(object) {
  let hero = GAME.heroList.filter((({tags}) => tags.centerOfAttention))[0]

  if(!object.pathId && object.mod().tags.targetResetEveryRound || object.mod().tags.targetBehind) object.path = []

  const autoTarget = object.mod().tags['targetAuto'] && !object.mod().tags['targetHeroOnAware'] && !object.mod().tags['targetVictimOnAware']
  if(hero && object.tags && object.mod().tags['zombie'] && autoTarget) {
    setTarget(object, hero)
  }

  if(hero && object.tags && object.mod().tags['homing'] && autoTarget) {
    if(!object.path || (object.path && !object.path.length)) {
      setPathTarget(object, hero)
    }
  }

  if(object.tags && object.mod().tags['wander']) {
    if(!object.path || (object.path && !object.path.length)) {
      object.path = [pathfinding.walkAround(object)]
      const { gridX, gridY } = gridUtil.convertToGridXY(object)
      object.gridX = gridX
      object.gridY = gridY
    }
  }

  if(object.tags && object.mod().tags['pacer']) {
    if(!object.path || (object.path && !object.path.length)) {
      object.path = [pathfinding.walkWithPurpose(object)]
      const { gridX, gridY } = gridUtil.convertToGridXY(object)
      object.gridX = gridX
      object.gridY = gridY
    }
  }

  if(object.tags && object.mod().tags['spelunker']) {
    if(!object.path || (object.path && !object.path.length)) {
      object.path = [pathfinding.exploreCave(object)]
      const { gridX, gridY } = gridUtil.convertToGridXY(object)
      object.gridX = gridX
      object.gridY = gridY
    }
  }

  if(object.tags && object.mod().tags['lemmings']) {
    if(!object.path || (object.path && !object.path.length)) {
      object.path = [pathfinding.walkIntoWall(object)]
      const { gridX, gridY } = gridUtil.convertToGridXY(object)
      object.gridX = gridX
      object.gridY = gridY
    }
  }

  if(object.tags && object.mod().tags['goomba']) {
    if(object.velocityMax === 0) object.velocityMax = 100

    if(!object._goalDirection) {
      object._goalDirection = 'right'
    }

    if(object._goalDirection === 'right' ) {
      object.velocityX = object.mod().velocityInitial || 100
    }

    if(object._goalDirection === 'left') {
      object.velocityX = -object.mod().velocityInitial || -100
    }
  }

  if(object.tags && object.mod().tags['goombaSideways']) {
    if(object.velocityMax === 0) object.velocityMax = 100

    if(!object._goalDirection) {
      object._goalDirection = 'down'
    }

    if(object._goalDirection === 'down' ) {
      object.velocityY = object.mod().velocityInitial || 100
    }

    if(object._goalDirection === 'up') {
      object.velocityY = -object.mod().velocityInitial || -100
    }
  }
}

function setPathTarget(object, target, pursue) {
  const pfOptions = {}

  if(object.pathfindingGridId && GAME.objectsById[object.pathfindingGridId]) {
    pfOptions.customPfGridId = object.pathfindingGridId
    pfOptions.pathfindingLimit = GAME.objectsById[object.pathfindingGridId].customGridProps
  } else if(object.pathfindingLimitId && GAME.objectsById[object.pathfindingLimitId]) {
    const pfLimit = GAME.objectsById[object.pathfindingLimitId]
    pfOptions.pathfindingLimit = gridUtil.convertToGridXY(pfLimit)
  }

  let pathTo
  let pathFrom
  if(pfOptions.customPfGridId) {
    const { gridX, gridY } = gridUtil.convertToGridXY(object, pfOptions.pathfindingLimit)
    object.gridX = gridX
    object.gridY = gridY

    const targetGridPos = gridUtil.convertToGridXY(target, pfOptions.pathfindingLimit)
    target.gridX = targetGridPos.gridX
    target.gridY = targetGridPos.gridY

    pathTo = {
      x: gridX,
      y: gridY,
    }

    pathFrom = {
      x: target.gridX,
      y: target.gridY,
    }
  } else {
    const { gridX, gridY } = gridUtil.convertToGridXY(object)
    object.gridX = gridX
    object.gridY = gridY

    const targetGridPos = gridUtil.convertToGridXY(target)
    target.gridX = targetGridPos.gridX
    target.gridY = targetGridPos.gridY

    pathTo = {
      x: gridX,
      y: gridY,
    }

    pathFrom = {
      x: target.gridX,
      y: target.gridY,
    }
  }

  if(object.mod().tags.targetBehind) {
    // const direction = target.inputDirection || target._movementDirection
    //
    // if(direction === 'up') {
    //   pathFrom.y += 2
    // } else if(direction === 'down') {
    //   pathFrom.y -= 2
    // } else if(direction === 'left') {
    //   pathFrom.x += 2
    // } else if(direction === 'right') {
    //   pathFrom.x -= 2
    // }

    const options = [
      { y: pathFrom.y + 2, x: pathFrom.x },
      { y: pathFrom.y - 2, x: pathFrom.x },
      { y: pathFrom.y, x: pathFrom.x + 2},
      { y: pathFrom.y, x: pathFrom.x - 2},
      // { y: pathFrom.y + 2, x: pathFrom.x + 2},
      // { y: pathFrom.y - 2, x: pathFrom.x - 2},
      // { y: pathFrom.y - 2, x: pathFrom.x + 2},
      // { y: pathFrom.y + 2, x: pathFrom.x - 2}
    ]

    let smallestDiff = Infinity
    let choice = options[0]
    options.forEach((opt) => {
      const diffX = Math.abs(pathTo.x - opt.x)
      const diffY = Math.abs(pathTo.y - opt.y)
      if((diffX + diffY) < smallestDiff) {
        smallestDiff = diffX + diffY
        choice = opt
      }
    })

    pathFrom.x = choice.x
    pathFrom.y = choice.y
  }

  object.path = pathfinding.findPath(pathTo, pathFrom, pfOptions)
  if(!object.path.length) {
    object.velocityY = 0
    object.velocityX = 0
  }
  if(pursue) object._targetPursueId = target.id
}

function setTarget(object, target, pursue) {
  object.targetXY = { x: target.x, y: target.y }

  if(object.mod().tags.targetBehind) {
    // const direction = target.inputDirection || target._movementDirection
    //
    // if(direction === 'up') {
    //   object.targetXY.y += (GAME.grid.nodeSize * 2)
    // } else if(direction === 'down') {
    //   object.targetXY.y -= (GAME.grid.nodeSize * 2)
    // } else if(direction === 'left') {
    //   object.targetXY.x += (GAME.grid.nodeSize * 2)
    // } else if(direction === 'right') {
    //   object.targetXY.x -= (GAME.grid.nodeSize * 2)
    // }

    const options = [
      { y: object.targetXY.y + (GAME.grid.nodeSize * 2), x: object.targetXY.x },
      { y: object.targetXY.y - (GAME.grid.nodeSize * 2), x: object.targetXY.x },
      { y: object.targetXY.y, x: object.targetXY.x + (GAME.grid.nodeSize * 2)},
      { y: object.targetXY.y, x: object.targetXY.x - (GAME.grid.nodeSize * 2)},
    ]

    let smallestDiff = Infinity
    let choice = options[0]
    options.forEach((opt) => {
      const diffX = Math.abs(object.x - opt.x)
      const diffY = Math.abs(object.y - opt.y)
      if((diffX + diffY) < smallestDiff) {
        smallestDiff = diffX + diffY
        choice = opt
      }
    })

    object.targetXY.x = choice.x
    object.targetXY.y = choice.y
  }

  if(pursue) object._targetPursueId = target.id
}

export {
  pathfindingAI,
  setPathTarget,
  setTarget,
}
