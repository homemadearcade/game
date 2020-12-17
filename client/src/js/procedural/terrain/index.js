import { Noise } from 'noisejs'
import { viewNoiseData } from './modals'
import gridUtil from '../../utils/grid'

// import Grid from './drid'

window.addTerrainDataToPhysics = function (terrainData) {
  updateTerrainDataPhysics(terrainData)
}

window.removeTerrainDataFromPhysics = function (terrainData) {
  updateTerrainDataPhysics(terrainData, true)
}

window.heatIntegers = {
  Coldest: 0.05,
  Colder:0.15,
  Cold: 0.35,
  Warm: 0.50,
  Warmer: 0.70,
  Warmest: 1
}

window.heatIntegerLookup = {}

for(let i = 0; i <= 100; i+= 1) {
  const key = (i/100).toFixed(2)
  if(i <= window.heatIntegers['Coldest'] * 100) {
    window.heatIntegerLookup[key] = 'Coldest'
  } else if(i <= window.heatIntegers['Colder'] * 100) {
    window.heatIntegerLookup[key] = 'Colder'
  } else if(i <= window.heatIntegers['Cold'] * 100) {
    window.heatIntegerLookup[key] = 'Cold'
  } else if(i <= window.heatIntegers['Warm'] * 100) {
    window.heatIntegerLookup[key] = 'Warm'
  } else if(i <= window.heatIntegers['Warmer'] * 100) {
    window.heatIntegerLookup[key] = 'Warmer'
  } else if(i <= window.heatIntegers['Warmest'] * 100) {
    window.heatIntegerLookup[key] = 'Warmest'
  }
}

window.elevationIntegers = {
  'Deep Water': 0.2,
  'Water': 0.4,
  Sand: 0.5,
  Grass: 0.7,
  Forest: 0.8,
  Mountain: 0.9,
  Snow: 1
}
window.elevationIntegerLookup = {}

for(let i = 0; i <= 100; i+= 1) {
  const key = (i/100).toFixed(2)
  if(i <= window.elevationIntegers['Deep Water'] * 100) {
    window.elevationIntegerLookup[key] = 'Deep Water'
  } else if(i <= window.elevationIntegers['Water'] * 100) {
    window.elevationIntegerLookup[key] = 'Water'
  } else if(i <= window.elevationIntegers['Sand'] * 100) {
    window.elevationIntegerLookup[key] = 'Sand'
  } else if(i <= window.elevationIntegers['Grass'] * 100) {
    window.elevationIntegerLookup[key] = 'Grass'
  } else if(i <= window.elevationIntegers['Forest'] * 100) {
    window.elevationIntegerLookup[key] = 'Forest'
  } else if(i <= window.elevationIntegers['Mountain'] * 100) {
    window.elevationIntegerLookup[key] = 'Mountain'
  } else if(i <= window.elevationIntegers['Snow'] * 100) {
    window.elevationIntegerLookup[key] = 'Snow'
  }
}

function setHeatGradient(nodes) {
  nodes.forEach((row, x) => {
    const center = nodes.length/2
    const total = nodes.length
    row.forEach((node, y) => {
      if(y > center) {
        const gradientValue = Math.abs(1 - ((y - center)/center))
        node.heat = gradientValue * node.heatNoise
      } else {
        const gradientValue = Math.abs(1 - ((center - y)/center))
        node.heat = gradientValue * node.heatNoise
      }

      if(node.elevationType === 'Grass') {
        node.heat -= 0.1 * node.elevation
      }

      if(node.elevationType === 'Forest') {
        node.heat -= 0.2 * node.elevation
      }

      if(node.elevationType === 'Mountain') {
        node.heat -= 0.3 * node.elevation
      }

      if(node.elevationType === 'Snow') {
        node.heat -= 0.4 * node.elevation
      }

      if(node.heat < 0) node.heat = 0

      node.heatType = window.heatIntegerLookup[node.heat]
    })
  })
}

function FloodFillAllNodes(nodes)
{
    // Use a stack instead of recursion
    const stack = []

    const landMasses = {}
    const waterMasses = {}
    const mountainRanges = {}

    nodes.forEach((row, x) => {
      row.forEach((node, y) => {

            //Tile already flood filled, skip
            if (node.isFloodFilled) return;

            // Land
            if (node.isMountain)
            {
                const group = [];
                group.type = 'isMountain'
                stack.push(node);

                while(stack.length > 0) {
                  FloodFill(stack.pop(), group, stack, nodes);
                }

                let id = window.uniqueID()
                mountainRanges[id] = group

                group.forEach((groupNode) => {
                  groupNode.isWater = false
                  groupNode.isLand = false
                  groupNode.isMountain = true
                  groupNode.mountainRangeId = id
                })
            }

            // Land
            else if (node.isLand)
            {
                const group = [];
                group.type = 'isLand'
                stack.push(node);

                while(stack.length > 0) {
                  FloodFill(stack.pop(), group, stack, nodes);
                }

                let id = window.uniqueID()
                landMasses[id] = group

                group.forEach((groupNode) => {
                  groupNode.isWater = false
                  groupNode.isLand = true
                  groupNode.isMountain = false
                  groupNode.landMassId = id
                })
            }
            // Water
            else {
                const group = [];
                group.type = 'isWater'
                stack.push(node);

                while(stack.length > 0)   {
                  FloodFill(stack.pop(), group, stack, nodes);
                }

                let id = window.uniqueID()
                waterMasses[id] = group

                group.forEach((groupNode) => {
                  groupNode.isWater = true
                  groupNode.isLand = false
                  groupNode.isMountain = false
                  groupNode.waterMassId = id
                })
            }
        })
    })

    return {
      waterMasses,
      landMasses,
      mountainRanges
    }
}


function FloodFill(node, group, stack, nodes)
{
    // Validate
    if (node.isFloodFilled) return;
    if (group.type === 'isMountain' && !node.isMountain) return;
    if (group.type === 'isLand' && !node.isLand) return;
    if (group.type === 'isWater' && !node.isWater) return;

    // Add to TileGroup
    group.push(node);
    node.isFloodFilled = true;

    // floodfill into neighbors
    const { top, left, right, bottom } = getNeighbors(node, nodes)

    if (top && !top.isFloodFilled && node.terrainType == top.terrainType) stack.push (top);

    if (bottom && !bottom.isFloodFilled && node.terrainType == bottom.terrainType) stack.push (bottom);

    if (left && !left.isFloodFilled && node.terrainType == left.terrainType) stack.push (left);

    if (right && !right.isFloodFilled && node.terrainType == right.terrainType) stack.push (right);
}

function applyChangesToNodeData(nodes) {
  nodes.forEach((row, x) => {
    row.forEach((node, y) => {
      let data = {}
      if(GAME.grid.nodeData[node.id]) data = GAME.grid.nodeData[node.id]
      else GAME.grid.nodeData[node.id] = data
      // nodeData.elevation = node.elevation
      // nodeData.elevationType = node.elevationType
      data.elevationType = node.elevationType
      // data.elevationType = node.elevationType
      data.heatType = node.heatType
      // node.heatNoise = null
      // node.isLand = null
      // node.isWater = null
      // node.isFloodFilled = null
      // node.elevationBitmask = null
    })
  })
}

function setAllNodesElevationBitmask(nodes) {
  nodes.forEach((row, x) => {
    row.forEach((node, y) => {
      let count = 0;

      const { top, left, right, bottom } = getNeighbors(node, nodes)

      if (top && node.elevationType == top.elevationType) count += 1;
      if (right && node.elevationType == right.elevationType) count += 2;
      if (bottom && node.elevationType == bottom.elevationType) count += 4;
      if (left && node.elevationType == left.elevationType) count += 8;

      node.elevationBitmask = count;
    })
  })
}

function setAllNodesElevationTypes(nodes) {
  nodes.forEach((row, x) => {
    row.forEach((node, y) => {
      const elevationType = window.elevationIntegerLookup[node.elevation.toFixed(2)]

      if(elevationType === 'Deep Water' || elevationType === 'Water') {
        node.isWater = true
      }
      if(elevationType === 'Grass' || elevationType === 'Forest' || elevationType === 'Sand') {
        node.isLand = true
      }
      if(elevationType === 'Mountain' || elevationType === 'Snow') {
        node.isMountain = true
      }
      node.elevationType = elevationType
    })
  })
}

// function updateAllNodesNeighbors(nodes) {
//   nodes.forEach((row, x) => {
//     row.forEach((node, y) => {
//       updateNodeNeighbors(node, nodes)
//     })
//   })
// }

function prepareNodesForGeneration(nodes) {
  nodes.forEach((row, x) => {
    row.forEach((node, y) => {
      // node.left = null
      // node.right = null
      // node.up = null
      // node.down = null
      node.elevation = null
      node.heat = null
      node.heatNoise = null
      node.isLand = null
      node.isWater = null
      node.isFloodFilled = null
      node.elevationBitmask = null
    })
  })
}

function getNeighbors(node, nodes)
{
  let top
  let bottom
  let right
  let left

  top = nodes[node.gridX][node.gridY-1]
  bottom = nodes[node.gridX][node.gridY+1]

  if(nodes[node.gridX-1]) {
    left = nodes[node.gridX-1][node.gridY]
  }
  if(nodes[node.gridX+1]) {
    right = nodes[node.gridX+1][node.gridY]
  }

  return {
    top,
    bottom,
    left,
    right
  }
  // node.getNeighbors = () => {

  // }
  // //
  // node.top = top
  // node.bottom = bottom
  // node.left = left
  // node.right = right
}

function generateNoiseMap({type, seed, nodes, property, width, height}) {
  if(typeof seed != 'number') seed = Math.random()

  var noise = new Noise(seed);

  if(nodes && nodes.length) width = nodes.length
  if(nodes && nodes[0].length) height = nodes[0].length

  if(type == 'perlin') {
    if(!nodes) {
      const perlinGrid = new Grid({startX: 0, startY: 0, width, height})
      nodes = perlinGrid.nodes
    }

    for (var x = 0; x < width; x++) {
      for (var y = 0; y < height; y++) {
        // noise.simplex2 and noise.perlin2 return values between -1 and 1.
        var value = noise.perlin2(x / 100, y / 100);

        // here I convert it to 0-1 and save it
        nodes[x][y][property] = (value + 1)/2
        //Math.abs(value) * 256; // Or whatever. Open demo.html to see it used with canvas.
      }
    }
    return nodes
  }

  if(type == 'simplex') {
    if(!nodes) {
      const simplexGrid = new Grid({startX: 0, startY: 0, width, height})
      nodes = simplexGrid.nodes
    }

    for (var x = 0; x < width; x++) {
      for (var y = 0; y < height; y++) {
        // noise.simplex2 and noise.simplex2 return values between -1 and 1.
        var value = noise.simplex2(x / 100, y / 100);

        // here I convert it to 0-1 and save it
        nodes[x][y][property] = (value + 1)/2
        //Math.abs(value) * 256; // Or whatever. Open demo.html to see it used with canvas.
      }
    }
    return nodes
  }
}

function updateTerrainDataPhysics(terrainData, remove) {
  window.terrainObjects = []
  window.terrainObstacles = []

  const grid = {...GAME.grid, x: GAME.grid.startX, y: GAME.grid.startY, width: GAME.grid.width * GAME.grid.nodeSize, height: GAME.grid.height * GAME.grid.nodeSize}
  Object.keys(terrainData.mountainRanges).forEach((id) => {

    const mountainRange = terrainData.mountainRanges[id]
    const { x, y, width, height } = window.getBoundingBox(mountainRange, grid)

    const object = {
      id,
      x, y, width, height,
      terrainGroupType: 'mountainRange',
      constructParts: mountainRange,
      tags: {
        obstacle: true,
        mountain: true,
        terrain: true,
      }
    }

    GAME.objectsById[id] = object
    if(!remove) window.terrainObjects.push(object)
    if(!remove) window.terrainObstacles.push(object)
    object.constructParts.forEach((part) => {
      part.ownerId = id
      if(remove) PHYSICS.removeObject(part)
      else PHYSICS.addObject(part)
    })

  })
  Object.keys(terrainData.landMasses).forEach((id) => {

    const landMass = terrainData.landMasses[id]
    const { x, y, width, height } = window.getBoundingBox(landMass, grid)

    const object = {
      id,
      x, y, width, height,
      terrainGroupType: 'landMass',
      constructParts: landMass,
      tags: {
        land: true,
        terrain: true,
      }
    }

    GAME.objectsById[id] = object
    if(!remove) window.terrainObjects.push(object)
    object.constructParts.forEach((part) => {
      part.ownerId = id
      // if(remove) PHYSICS.removeObject(part)
      // else PHYSICS.addObject(part)
    })

  })
  Object.keys(terrainData.waterMasses).forEach((id) => {
    const bodyOfWater = terrainData.waterMasses[id]

    const { x, y, width, height } = window.getBoundingBox(bodyOfWater, grid)

    const object = {
      id,
      x, y, width, height,
      terrainGroupType: 'waterBody',
      constructParts: bodyOfWater,
      tags: {
        obstacle: false,
        water: true,
        terrain: true,
      }
    }

    if(!remove) window.terrainObjects.push(object)
    GAME.objectsById[id] = object
    object.constructParts.forEach((part) => {
      part.ownerId = id
      // if(remove) PHYSICS.removeObject(part)
      // else PHYSICS.addObject(part)
    })
  })
}

async function generateTerrainJSON(showModals) {
  const nodesToUse = GAME.grid.nodes
  // const nodesToUse = gridUtil.generateGridNodes({width: 100, height: 100, startX: 0, startY: 0})

  if(GAME.grid.terrainData) {
    updateTerrainDataPhysics(GAME.grid.terrainData, true)
  }

  prepareNodesForGeneration(nodesToUse)

  const nodes = nodesToUse
  const nodesCopy = nodesToUse

  const terrainData = {}

  generateNoiseMap({type: 'perlin', seed: Math.random(), nodes: nodes, property: 'elevation'})
  // updateAllNodesNeighbors(nodes)
  setAllNodesElevationTypes(nodes)
  setAllNodesElevationBitmask(nodes)

  if(showModals) await viewNoiseData({noiseNodes: nodes, title: 'perlin-terrain', type: 'terrain', terrainData})

  let massData = FloodFillAllNodes(nodes)
  terrainData.landMasses = massData.landMasses
  terrainData.waterMasses = massData.waterMasses
  terrainData.mountainRanges = massData.mountainRanges

  if(showModals) await viewNoiseData({noiseNodes: nodes, title: 'perlin-landwater', type: 'landwatergroups', terrainData})

  generateNoiseMap({type: 'perlin', seed: Math.random(), nodes: nodes, property: 'heatNoise'})
  setHeatGradient(nodes)

  if(showModals) await viewNoiseData({noiseNodes: nodes, title: 'perlin-heat', type: 'heat', terrainData})

  prepareNodesForGeneration(nodesToUse)


  if(!GAME.grid.terrainSeed) GAME.grid.terrainSeed = Math.random()

  generateNoiseMap({type: 'simplex', seed: GAME.grid.terrainSeed, nodes: nodesCopy, property: 'elevation'})
  // updateAllNodesNeighbors(nodesCopy)
  setAllNodesElevationTypes(nodesCopy)
  setAllNodesElevationBitmask(nodesCopy)

  if(showModals) await viewNoiseData({noiseNodes: nodesCopy, title: 'simplex-terrain', type: 'terrain', terrainData})

  massData = FloodFillAllNodes(nodesCopy)
  terrainData.landMasses = massData.landMasses
  terrainData.waterMasses = massData.waterMasses
  terrainData.mountainRanges = massData.mountainRanges

  if(showModals) await viewNoiseData({noiseNodes: nodesCopy, title: 'simplex-landwater', type: 'landwatergroups', terrainData})

  generateNoiseMap({type: 'simplex', seed: Math.random(), nodes: nodesCopy, property: 'heatNoise'})
  setHeatGradient(nodesCopy)

  if(showModals) await viewNoiseData({noiseNodes: nodesCopy, title: 'simplex-heat', type: 'heat', terrainData})

  updateTerrainDataPhysics(massData, false)

  GAME.grid.nodes = nodesCopy
  GAME.grid.terrainData = massData
  applyChangesToNodeData(nodesCopy)
  console.log('done w procedural map')
  window.socket.emit('updateGrid', GAME.grid)

}



export {
  generateTerrainJSON
}
