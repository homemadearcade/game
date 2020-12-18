import collisions from '../utils/collisions'

class Grid {
  constructor(startX, startY, gridWidth, gridHeight, nodeWidth, nodeHeight) {
    this.startX = startX
    this.startY = startY
    this.nodeWidth = nodeWidth
    this.nodeHeight = nodeHeight
    this.gridWidth = Math.floor(gridWidth *  (GAME.grid.nodeSize/this.nodeWidth))
    this.gridHeight = Math.floor(gridHeight *  (GAME.grid.nodeSize/this.nodeHeight))
    this.x = startX
    this.y = startY
    this.width = startX + (this.gridWidth * nodeWidth)
    this.height = startX + (this.gridHeight * nodeHeight)
    this.nodes = this.generateNodes(this.gridWidth, this.gridHeight)
  }

  getGridXYfromXY(x, y) {
    // pretend we are dealing with a 0,0 plane
    x = x - this.startX
    y = y - this.startY

    let diffX = x % this.nodeWidth
    x -= diffX
    let gridX = x/this.nodeWidth

    let diffY = y % this.nodeHeight
    y -= diffY
    let gridY = y/this.nodeHeight

    // const gridX = Math.floor(x/this.nodeSize)
    // const gridY = Math.floor(y/this.nodeSize)

    return {
      gridX,
      gridY
    }
  }

  generateNodes(gridWidth, gridHeight) {
    const grid = []

    for(var i = 0; i < gridWidth; i++) {
      grid.push([])
      for(var j = 0; j < gridHeight; j++) {
        grid[i].push({x: this.startX + (i * this.nodeWidth), y: this.startY + (j * this.nodeHeight), width: this.nodeWidth, height: this.nodeHeight, gridX: i, gridY: j, data: {}})
      }
    }

    return grid
  }

  updateNode(gridX, gridY, update) {
    global.mergeDeep(this.nodes[gridX][gridY].data, update)
  }

  updateNodeXY(x, y, update) {
    const { gridX, gridY } = this.getGridXYfromXY(x, y)
    this.updateNode(gridX, gridY, update)
  }

  findNeighborNodes(gridX, gridY) {
    const nodes = this.nodes
    const neighbors = []

    ['up', 'left', 'down', 'right'].forEach((dir) => {
      let neighbor = this.findNeighborInDirection(gridX, gridY, dir)
      if(neighbor) neighbors.push(neighbor)
    })

    return neighbors
  }

  findNeighborInDirection(gridX, gridY, direction) {
    const nodes = this.nodes

    if(direction === 'up' && nodes[gridX][gridY - 1]) {
      return nodes[gridX][gridY - 1]
    }

    if(direction === 'down' && nodes[gridX][gridY + 1]) {
      return nodes[gridX][gridY + 1]
    }

    if(direction === 'right' && nodes[gridX + 1] && nodes[gridX + 1][gridY]) {
      return nodes[gridX + 1][gridY]
    }

    if(direction === 'left' && nodes[gridX - 1] && nodes[gridX - 1][gridY]) {
      return nodes[gridX - 1][gridY]
    }
  }

  findFurthestNodeInDirection(startNode, direction, targetProp, targetValue) {
    const neighbor = this.findNeighborInDirection(startNode.gridX, startNode.gridY, direction)
    if(neighbor) {
      if(neighbor.data && neighbor.data[targetProp] === targetValue) {
        return this.findFurthestNodeInDirection(neighbor, direction, targetProp, targetValue)
      } else {
        return startNode
      }
    } else return null
  }

  removeNodeData(gridX, gridY) {
    this.nodes[gridX][gridY].data = {}
  }

  forEachNode(fx) {
    for(var i = 0; i < this.gridWidth; i++) {
      for(var j = 0; j < this.gridHeight; j++) {
        fx(this.nodes[i][j])
      }
    }
  }

  snapXYToGrid(x, y, options = { closest: true }) {
    let diffX = x % this.nodeWidth;

    if(diffX < 0) {
      x -= diffX
      x -= this.nodeWidth
    } else {
      if(diffX > this.nodeWidth/2 && options.closest) {
        x += (this.nodeWidth - diffX)
      } else {
        x -= diffX
      }
    }

    let diffY = y % this.nodeHeight;
    if(diffY < 0) {
      y -= diffY
      y -= this.nodeHeight
    } else {
      if(diffY > this.nodeHeight/2 && options.closest) {
        y += (this.nodeHeight - diffY)
      } else {
        y -= diffY
      }
    }
    return { x, y }
  }
}

export default Grid
