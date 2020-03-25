import pathfinding from './pathfinding.js'
import collision from './collisions'
import gridTool from './grid.js'

function init(hero, objects){


}


function cancelPathNode(object) {
  if(object.tags && object.tags.obstacle) {
    // window.socket.emit('updateGridNode', {x: object.gridX, y: object.gridY}, {hasObstacle: true})
    // window.grid.nodes[object.gridX][object.gridY].hasObstacle = true
    // window.socket.emit('updateGridNode', {x: object.path[0].x, y: object.path[0].y}, {hasObstacle: false})
    // window.grid.nodes[object.path[0].x][object.path[0].y].hasObstacle = false
  }
}

function startOnPathNode(object) {
  if(object.tags && object.tags.obstacle) {
    // if(object.path.length > 1) {
    //   window.socket.emit('updateGridNode', {x: object.path[0].x, y: object.path[0].y}, {hasObstacle: false})
    //   window.grid.nodes[object.path[0].x][object.path[0].y].hasObstacle = false
    //   window.socket.emit('updateGridNode', {x: object.path[1].x, y: object.path[1].y}, {hasObstacle: true})
    //   window.grid.nodes[object.path[1].x][object.path[1].y].hasObstacle = true
    //   return
    // }

    // if its really important that paths dont cross......
    // window.socket.emit('updateGridNode', {x: object.gridX, y: object.gridY}, {hasObstacle: false})
    // window.grid.nodes[object.gridX][object.gridY].hasObstacle = false
    // window.socket.emit('updateGridNode', {x: object.path[0].x, y: object.path[0].y}, {hasObstacle: true})
    // window.grid.nodes[object.path[0].x][object.path[0].y].hasObstacle = true
  }
}
function moveOnPath(object) {
  const { x, y, diffX, diffY } = gridTool.convertToGridXY(object)
  object.gridX = x
  object.gridY = y

  if(object.gridY == object.path[0].y && object.gridX == object.path[0].x && diffX <= 2 && diffY <= 2) {
    object.velocityX = 0
    object.velocityY = 0
    object.path.shift();
    if(object.path.length >= 1) {
      startOnPathNode(object)
    }
    return
  }

  let pathX = (object.path[0].x * window.grid.nodeSize) + window.grid.nodes[0][0].x
  let pathY = (object.path[0].y * window.grid.nodeSize) + window.grid.nodes[0][0].y
  if(object.gridX == object.path[0].x && diffX <= 2) {
    object.velocityX = 0
  } else if(object.x > pathX) {
    object.velocityX = -object.speed || -100
  } else if(object.x < pathX) {
    object.velocityX = object.speed || 100
  }

  if(object.gridY == object.path[0].y && diffY <= 2) {
    object.velocityY = 0
  } else if(object.y > pathY) {
    object.velocityY = -object.speed || -100
  } else if(object.y < pathY) {
    object.velocityY = object.speed || 100
  }
}

function update(hero, objects, modifier) {
  objects.forEach((object) => {
    if(object.path && object.path.length) {
      moveOnPath(object)
    }

    if(object.tags && object.tags['zombie']) {
      if(!object.velocityMax){
        object.velocityMax = 100
        object.velocityX = 0
        object.velocityY = 0
      }
      if(object.x > window.hero.x) {
        object.velocityX -= (object.speed || 100) * modifier
      } else {
        object.velocityX += (object.speed || 100) * modifier
      }

      if(object.y > window.hero.y) {
        object.velocityY -= (object.speed || 100) * modifier
      } else {
        object.velocityY += (object.speed || 100) * modifier
      }
    }

    if(object.tags && object.tags['homing']) {
      if(window.resetPaths || !object.path || (object.path && !object.path.length)) {
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
        }}, object.pathfindingLimit)

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
      if(object.velocityMax === 0) object.velocityMax = 100

      if(!object.direction) {
        object.direction = 'right'
      }

      if(object.direction === 'right' ) {
        object.velocityX = object.speed || 100
      }

      if(object.direction === 'left') {
        object.velocityX = -object.speed || -100
      }
    }

    if(object.tags && object.tags['goombaSideways']) {
      if(object.velocityMax === 0) object.velocityMax = 100

      if(!object.direction) {
        object.direction = 'down'
      }

      if(object.direction === 'down' ) {
        object.velocityY = object.speed || 100
      }

      if(object.direction === 'up') {
        object.velocityY = -object.speed || -100
      }
    }

    if(object.tags && object.tags['stationary']) {
      object.velocityY = 0
      object.velocityX = 0
      object.accY = 0
      object.accX = 0
    }
  })
}

export default {
  init,
  update,
  cancelPathNode,
}
