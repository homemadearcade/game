import collisions from './collisions'

function convertToGridXY(object, options = { }) {
  // pretend we are dealing with a 0,0 plane
  let x = object.x - (options.startX || GAME.grid.nodes[0][0].x)
  let y = object.y - (options.startY || GAME.grid.nodes[0][0].y)

  let diffX = x % (options.nodeWidth || GAME.grid.nodeSize)
  x -= diffX
  let gridX = x/(options.nodeWidth || GAME.grid.nodeSize)

  let diffY = y % (options.nodeHeight || GAME.grid.nodeSize)
  y -= diffY
  let gridY = y/(options.nodeHeight || GAME.grid.nodeSize)

  let gridWidth = Math.floor(object.width / (options.nodeWidth || GAME.grid.nodeSize))
  let gridHeight = Math.floor(object.height / (options.nodeHeight || GAME.grid.nodeSize))

  return { x, y, gridX, gridY, diffX, diffY, gridWidth, gridHeight }
}

function generateGridNodes(gridProps) {
  const grid = []

  const nodeData = gridProps.nodeData
  for(var i = 0; i < gridProps.width; i++) {
    grid.push([])
    for(var j = 0; j < gridProps.height; j++) {
      const node = {x: gridProps.startX + (i * GAME.grid.nodeSize), y: gridProps.startY + (j * GAME.grid.nodeSize), width: GAME.grid.nodeSize, height: GAME.grid.nodeSize, gridX: i, gridY: j}
      const key = 'x:'+node.gridX+'y:'+node.gridY
      if(nodeData && nodeData[key]) {
        node.sprite = nodeData[key].sprite
        node.color = nodeData[key].color
      }
      grid[i].push(node)
    }
  }

  return grid
}

function snapXYToGrid(x, y, options = { closest: true }) {
  let diffX = x % GAME.grid.nodeSize;

  if(diffX < 0) {
    x -= diffX
    x -= GAME.grid.nodeSize
  } else {
    if(diffX > GAME.grid.nodeSize/2 && options.closest) {
      x += (GAME.grid.nodeSize - diffX)
    } else {
      x -= diffX
    }
  }

  let diffY = y % GAME.grid.nodeSize;
  if(diffY < 0) {
    y -= diffY
    y -= GAME.grid.nodeSize
  } else {
    if(diffY > GAME.grid.nodeSize/2 && options.closest) {
      y += (GAME.grid.nodeSize - diffY)
    } else {
      y -= diffY
    }
  }
  return { x, y }
}

function getRandomGridWithinXY(min, max) {
  let xyrandom = (Math.random() * (max - min)) + min
  let diff = xyrandom % GAME.grid.nodeSize
  return xyrandom - diff
}

function getAllDiffs({x, y, width, height}) {
  let leftDiff = x % GAME.grid.nodeSize
  let topDiff = y % GAME.grid.nodeSize
  let rightDiff = (x + width) % GAME.grid.nodeSize
  let bottomDiff = (y + height) % GAME.grid.nodeSize
  return { leftDiff, topDiff, rightDiff, bottomDiff }
}

function snapObjectToGrid(object) {
  let diffX = object.x % GAME.grid.nodeSize;
  if(diffX > GAME.grid.nodeSize/2) {
    object.x += (GAME.grid.nodeSize - diffX)
  } else {
    object.x -= diffX
  }

  let diffY = object.y % GAME.grid.nodeSize;
  if(diffY > GAME.grid.nodeSize/2) {
    object.y += (GAME.grid.nodeSize - diffY)
  } else {
    object.y -= diffY
  }

  let diffWidth = object.width % GAME.grid.nodeSize;
  if(diffWidth > GAME.grid.nodeSize/2) {
    object.width += (GAME.grid.nodeSize - diffWidth)
  } else {
    object.width -= diffWidth
  }

  let diffHeight = object.height % GAME.grid.nodeSize;
  if(diffHeight > GAME.grid.nodeSize/2) {
    object.height += (GAME.grid.nodeSize - diffHeight)
  } else {
    object.height -= diffHeight
  }
}


function snapTinyObjectToGrid(object, tinySize) {
  let medium = GAME.grid.nodeSize - tinySize
  const { x, y } = snapXYToGrid(object.x, object.y)
  object.y = y + medium/2
  object.x = x + medium/2
  object.width = tinySize
  object.height = tinySize
}

function snapDragToGrid(object) {
  // if negative width
  if(object.width < 0) {
    object.x += object.width
    object.width = Math.abs(object.width)
  }
  if(object.height < 0) {
    object.y += object.height
    object.height = Math.abs(object.height)
  }

  let diffX = object.x % GAME.grid.nodeSize
  object.x -= diffX

  if(diffX > GAME.grid.nodeSize/2) {
    diffX -= GAME.grid.nodeSize/2
  }

  let diffY = object.y % GAME.grid.nodeSize;
  object.y -= diffY

  if(diffY > GAME.grid.nodeSize/2) {
    diffY -= GAME.grid.nodeSize/2
  }

  let diffWidth = object.width % GAME.grid.nodeSize;
  if(diffWidth > GAME.grid.nodeSize/2) {
    // object.width += (GAME.grid.nodeSize - diffWidth)
  } else {
    // object.width -= diffWidth
  }

  let diffHeight = object.height % GAME.grid.nodeSize;
  if(diffHeight > GAME.grid.nodeSize/2) {
    // object.height += (GAME.grid.nodeSize - diffHeight)
  } else {
    // object.height -= diffHeight
  }

  object.width = Math.ceil(object.width/GAME.grid.nodeSize) * GAME.grid.nodeSize
  object.height = Math.ceil(object.height/GAME.grid.nodeSize) * GAME.grid.nodeSize

  if(diffY + diffHeight > GAME.grid.nodeSize) {
    object.height += GAME.grid.nodeSize
  }
  if(diffX + diffWidth > GAME.grid.nodeSize) {
    object.width += GAME.grid.nodeSize
  }

  object.gridX = object.x/GAME.grid.nodeSize
  object.gridY = object.y/GAME.grid.nodeSize
  object.gridWidth = object.width/GAME.grid.nodeSize
  object.gridHeight = object.height/GAME.grid.nodeSize
}

function createGridNodeAt(x, y) {
  let diffX = x % GAME.grid.nodeSize
  x -= diffX

  let diffY = y % GAME.grid.nodeSize
  y -= diffY

  return {
    x, y, width: GAME.grid.nodeSize, height: GAME.grid.nodeSize,
  }
}

function keepXYWithinBoundaries(object, options = { bypassGameBoundaries : false, pathfindingLimit: null }) {
  const {gridX, gridY} = convertToGridXY(object)
  return keepGridXYWithinBoundaries(gridX, gridY, options)
}

function keepGridXYWithinBoundaries(attemptingX, attemptingY, options = { bypassGameBoundaries : false, pathfindingLimit: null }) {
  let debug = true
  if(GAME.world.gameBoundaries && typeof GAME.world.gameBoundaries.x == 'number' && (GAME.world.gameBoundaries.behavior === 'boundaryAll' || GAME.world.gameBoundaries.behavior === 'pacmanFlip') && !options.bypassGameBoundaries) {
    const {gridX, gridY, gridWidth, gridHeight } = convertToGridXY(GAME.world.gameBoundaries)
    if(attemptingX > gridX + gridWidth - 1) {
      if(debug) console.log('rejecting reason 1a')
      return false
    } else if(attemptingX < gridX) {
      if(debug) console.log('rejecting reason 1b')
      return false
    } else if(attemptingY > gridY + gridHeight - 2) {
      if(debug) console.log('rejecting reason 1c')
      return false
    } else if(attemptingY < gridY) {
      if(debug) console.log('rejecting reason 1d')
      return false
    }
  }

  if(GAME.world.gameBoundaries && typeof GAME.world.gameBoundaries.x == 'number' && GAME.world.gameBoundaries.behavior === 'purgatory' && !options.bypassGameBoundaries) {
    let hero = GAME.heroList.filter((hero) => {
      return hero.tags.centerOfAttention
    })[0]
    if(!hero) {
      hero = GAME.heros[HERO.id]
      // single player only feature
    }
    const {gridX, gridY, gridWidth, gridHeight } = convertToGridXY(GAME.world.gameBoundaries)
    if(attemptingX > gridX + gridWidth - (((HERO.cameraWidth * hero.zoomMultiplier)/2)/GAME.grid.nodeSize) - 1) {
      if(debug) console.log('rejecting reason 2a')
      return false
    } else if(attemptingX < gridX + (((HERO.cameraWidth * hero.zoomMultiplier)/2)/GAME.grid.nodeSize) + 1) {
      if(debug) console.log('rejecting reason 2b')
      return false
    } else if(attemptingY > gridY + gridHeight - (((HERO.cameraHeight * hero.zoomMultiplier)/2)/GAME.grid.nodeSize) - 1) {
      if(debug) console.log('rejecting reason 2c')
      return false
    } else if(attemptingY < gridY + (((HERO.cameraHeight * hero.zoomMultiplier)/2)/GAME.grid.nodeSize) + 1) {
      if(debug) console.log('rejecting reason 2d')
      return false
    }
  }

  const pathfindingLimit = options.pathfindingLimit
  if(pathfindingLimit){
    if(attemptingX > pathfindingLimit.gridX + pathfindingLimit.gridWidth - 1) {
      if(debug) console.log('rejecting reason 3a')
      return false
    } else if(attemptingX < pathfindingLimit.gridX) {
      if(debug) console.log('rejecting reason 3b')
      return false
    } else if(attemptingY > pathfindingLimit.gridY + pathfindingLimit.gridHeight - 1) {
      if(debug) console.log('rejecting reason 3c')
      return false
    } else if(attemptingY < pathfindingLimit.gridY) {
      if(debug) console.log('rejecting reason 3d')
      return false
    }
  }

  //prevents someone from trying to path find off the grid.... BREAKS CODE
  // i think this might be useless? im not sure
  // if(attemptingX >= (GAME.grid.startX/GAME.grid.nodeSize) && attemptingX < GAME.grid.width + Math.abs((GAME.grid.startX/GAME.grid.nodeSize))) {
  //   if(attemptingY >= (GAME.grid.startY/GAME.grid.nodeSize) && attemptingY < GAME.grid.height + Math.abs((GAME.grid.startY/GAME.grid.nodeSize))) {
  //     return true
  //   }
  // }

  if(!GAME.grid.nodes[attemptingX]) {
    if(debug) console.log('rejecting reason 4')
    return false
  }
  if(!GAME.grid.nodes[attemptingX][attemptingY]) {
    if(debug) console.log('rejecting reason 4')
    return false
  }

  return true
}

export default {
  snapObjectToGrid,
  snapDragToGrid,
  snapTinyObjectToGrid,
  createGridNodeAt,
  generateGridNodes,
  snapXYToGrid,
  getAllDiffs,
  convertToGridXY,
  getRandomGridWithinXY,
  keepGridXYWithinBoundaries,
  keepXYWithinBoundaries,
}
