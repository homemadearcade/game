import gridUtil from '../utils/grid.js'

function getTerrainGridNode(object) {
  // pretend we are dealing with a 0,0 plane
  let x = object.x - GAME.grid.startX
  let y = object.y - GAME.grid.startY

  let diffX = x % GAME.grid.nodeSize
  x -= diffX
  let gridX = x/GAME.grid.nodeSize

  let diffY = y % GAME.grid.nodeSize
  y -= diffY
  let gridY = y/GAME.grid.nodeSize

  // const gridX = Math.floor(x/this.nodeSize)
  // const gridY = Math.floor(y/this.nodeSize)

  if(!GAME.grid.nodes[gridX]) return

  let nodeData = GAME.grid.nodes[gridX][gridY]
  return nodeData
}

export function objectOnTerrain(object) {

  const gridNodeData = getTerrainGridNode(object)

  if(!gridNodeData) return

  const wasInWater = object.onWater

  object.onWater = false
  object.onLand = false

  if((object._collidingWithWater) || gridNodeData.elevationType === 'Water' || gridNodeData.elevationType === 'Deep Water') {
    object.onWater = true
  }

  if(wasInWater != object.onWater) {
    if(object.onWater) {
      if(object.tags.hero) global.emitGameEvent('onHeroEnterWater', object)
    } else {
      if(object.tags.hero) global.emitGameEvent('onHeroLeaveWater', object)
    }
  }

  if(!object.onWater && object.mod().tags.walkOverhead) {
    object.onLand = true
  }
}
