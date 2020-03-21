import pathfinding from './pathfinding.js'
import collision from './collisions'
import gridTool from './grid.js'

function init(hero, objects){


}


function startOnPathNode(object) {
  if(object.tags && object.tags.obstacle) {
    if(object.gridX !== object.path[0].x){
       // console.log('honestly not sure how this happens and I Feel like it could be causing many many bugs')
    }
    window.socket.emit('updateGridNode', {x: object.gridX, y: object.gridY}, {hasObstacle: false})
    window.grid[object.gridX][object.gridY].hasObstacle = false
    window.socket.emit('updateGridNode', {x: object.path[0].x, y: object.path[0].y}, {hasObstacle: true})
    window.grid[object.gridX][object.gridY].hasObstacle = true
  }
}
function moveOnPath(object) {
  const { x, y, diffX, diffY } = gridTool.convertToGridXY(object)
  object.gridX = x
  object.gridY = y

  if(object.gridY == object.path[0].y && object.gridX == object.path[0].x && diffX < 2 && diffY < 2) {
    object.velocityX = 0
    object.velocityY = 0
    object.path.shift();
    if(object.path.length) {
      startOnPathNode(object)
    }
    return
  }

  if(object.gridX == object.path[0].x && diffX < 2) {
    object.velocityX = 0
  } else if(object.gridX > object.path[0].x) {
    object.velocityX = -object.speed || -100
  } else if(object.gridX < object.path[0].x) {
    object.velocityX = object.speed || 100
  }

  if(object.gridY == object.path[0].y && diffY < 2) {
    object.velocityY = 0
  } else if(object.gridY > object.path[0].y) {
    object.velocityY = -object.speed || -100
  } else if(object.gridY < object.path[0].y) {
    object.velocityY = object.speed || 100
  }
}

function update(hero, objects, modifier) {
  objects.forEach((object) => {
    if(object.tags && object.tags['stationary']) {
      object.velocityY = 0
      object.velocityX = 0
      object.accY = 0
      object.accX = 0
    }

    if(object.path && object.path.length) {
      moveOnPath(object)
    }

    if(object.tags && object.tags['monster']) {

    }

    if(object.tags && object.tags['homing']) {
      if(!object.path || (object.path && !object.path.length)) {
        const { x, y } = gridTool.convertToGridXY(object)
        object.gridX = x
        object.gridY = y

        const heroGridPos = gridTool.convertToGridXY(window.hero)
        window.hero.gridX = heroGridPos.x
        window.hero.gridY = heroGridPos.y

        object.path = pathfinding.findPath({fromPosition: {
          x: x,
          y: y,
        }, toPosition: {
          x: window.hero.gridX,
          y: window.hero.gridY,
        }})

        if(object.path && object.path.length) startOnPathNode(object)
      }
    }

    if(object.tags && object.tags['wander']) {
      if(!object.path || (object.path && !object.path.length)) {
        object.path = [pathfinding.walkAround(object)]
        const { x, y } = gridTool.convertToGridXY(object)
        object.gridX = x
        object.gridY = y
        if(object.path && object.path.length) startOnPathNode(object)
      }
    }

    if(object.tags && object.tags['goomba']) {
      if(!object.path || (object.path && !object.path.length)) {
        pathfinding.goombaWalk(object)
        const { x, y } = gridTool.convertToGridXY(object)
        object.gridX = x
        object.gridY = y
        if(object.path && object.path.length) startOnPathNode(object)
      }
    }
  })
}

export default {
  init,
  update,
}
