import { Noise }  from 'noisejs'
import { viewNoiseData } from './modals.js'
import gridUtil from '../../utils/grid.js'
import MathEx from './mathEx.js'
import SimplexNoise from 'simplex-noise'
import radialGradient from './radialGradient.js'
import verticalGradient from './verticalGradient.js'

import './Vector.js'

global.biomeTypes = {
  'Ice': true,
  'Tundra': true,
  "Grassland": true,
  "Desert": true,
  "Savanna": true,
  "Woodland": true,
  "Boreal Forest": true,
  "Seasonal Forest": true,
  "Tropical Rainforest": true,
  "Temperate Rainforest": true,
}

const biomeLookup = {
    //COLDEST        //COLDER          //COLD                  //HOT                          //HOTTER                       //HOTTEST
    Dryest: {
      Coldest: 'Ice',
      Colder: 'Tundra',
      Cold: 'Grassland',
      Warm: 'Desert',
      Warmer: 'Desert',
      Warmest: 'Desert',
    },
    Dryer: {
      Coldest: 'Ice',
      Colder: 'Tundra',
      Cold: 'Grassland',
      Warm: 'Desert',
      Warmer: 'Desert',
      Warmest: 'Desert'
    },
    Dry: {
      Coldest: 'Ice',
      Colder: 'Tundra',
      Cold: 'Woodland',
      Warm: 'Woodland',
      Warmer: 'Savanna',
      Warmest: 'Savanna'
    },
    Wet: {
      Coldest: 'Ice',
      Colder: 'Tundra',
      Cold: 'Boreal Forest',
      Warm: 'Woodland',
      Warmer: 'Savanna',
      Warmest: 'Savanna'
    },
    Wetter: {
      Coldest: 'Ice',
      Colder: 'Tundra',
      Cold: 'Boreal Forest',
      Warm: 'Seasonal Forest',
      Warmer: 'Tropical Rainforest',
      Warmest: 'Tropical Rainforest'
    },
    Wettest: {
      Coldest: 'Ice',
      Colder: 'Tundra',
      Cold: 'Boreal Forest',
      Warm: 'Temperate Rainforest',
      Warmer: 'Tropical Rainforest',
      Warmest: 'Tropical Rainforest'
    },
};

global.terrainTypeLookUp = {
  1: 'Deep Water',
  2: 'Water',
  3: 'Shore',
  4: 'Mainland',
  5: 'Highland',
  6: 'Mountain',
  7: 'Snow',
}

global.terrainIntLookUp = {
  'Deep Water': 1,
  "Water": 2,
  "Shore": 3,
  "Mainland": 4,
  "Highland": 5,
  "Mountain": 6,
  "Snow":7
}

global.addTerrainDataToPhysics = function (terrainData) {
  updateTerrainDataPhysics(terrainData)
}

global.removeTerrainDataFromPhysics = function (terrainData) {
  updateTerrainDataPhysics(terrainData, true)
}

global.moistureIntegers = {
  Dryest: 0.27,
  Dryer: 0.4,
  Dry: 0.6,
  Wet: 0.8,
  Wetter: 0.9,
  Wettest: 1
}

global.moistureIntegerLookup = {}

for(let i = 0; i <= 100; i+= 1) {
  const key = (i/100).toFixed(2)
  if(i <= global.moistureIntegers['Dryest'] * 100) {
    global.moistureIntegerLookup[key] = 'Dryest'
  } else if(i <= global.moistureIntegers['Dryer'] * 100) {
    global.moistureIntegerLookup[key] = 'Dryer'
  } else if(i <= global.moistureIntegers['Dry'] * 100) {
    global.moistureIntegerLookup[key] = 'Dry'
  } else if(i <= global.moistureIntegers['Wet'] * 100) {
    global.moistureIntegerLookup[key] = 'Wet'
  } else if(i <= global.moistureIntegers['Wetter'] * 100) {
    global.moistureIntegerLookup[key] = 'Wetter'
  } else if(i <= global.moistureIntegers['Wettest'] * 100) {
    global.moistureIntegerLookup[key] = 'Wettest'
  }
}


// global.heatIntegers = {
//   Coldest: 0.1,
//   Colder:0.21,
//   Cold: 0.42,
//   Warm: 0.57,
//   Warmer: 0.80,
//   Warmest: 1
// }
global.heatIntegers = {
  Coldest: 0.05,
  Colder:0.15,
  Cold: 0.35,
  Warm: 0.50,
  Warmer: 0.70,
  Warmest: 1
}
// global.heatIntegers = {
//   Coldest: 0.3,
//   Colder:0.40,
//   Cold: 0.50,
//   Warm: 0.60,
//   Warmer: 0.70,
//   Warmest: 1
// }

global.heatIntegerLookup = {}

for(let i = 0; i <= 100; i+= 1) {
  const key = (i/100).toFixed(2)
  if(i <= global.heatIntegers['Coldest'] * 100) {
    global.heatIntegerLookup[key] = 'Coldest'
  } else if(i <= global.heatIntegers['Colder'] * 100) {
    global.heatIntegerLookup[key] = 'Colder'
  } else if(i <= global.heatIntegers['Cold'] * 100) {
    global.heatIntegerLookup[key] = 'Cold'
  } else if(i <= global.heatIntegers['Warm'] * 100) {
    global.heatIntegerLookup[key] = 'Warm'
  } else if(i <= global.heatIntegers['Warmer'] * 100) {
    global.heatIntegerLookup[key] = 'Warmer'
  } else if(i <= global.heatIntegers['Warmest'] * 100) {
    global.heatIntegerLookup[key] = 'Warmest'
  }
}

global.elevationIntegers = {
  'Deep Water': 0.2,
  'Water': 0.4,
  Shore: 0.5,
  Mainland: 0.7,
  Highland: 0.8,
  Mountain: 0.9,
  Snow: 1
}
global.elevationIntegerLookup = {}

for(let i = 0; i <= 100; i+= 1) {
  const key = (i/100).toFixed(2)
  if(i <= global.elevationIntegers['Deep Water'] * 100) {
    global.elevationIntegerLookup[key] = 'Deep Water'
  } else if(i <= global.elevationIntegers['Water'] * 100) {
    global.elevationIntegerLookup[key] = 'Water'
  } else if(i <= global.elevationIntegers['Shore'] * 100) {
    global.elevationIntegerLookup[key] = 'Shore'
  } else if(i <= global.elevationIntegers['Mainland'] * 100) {
    global.elevationIntegerLookup[key] = 'Mainland'
  } else if(i <= global.elevationIntegers['Highland'] * 100) {
    global.elevationIntegerLookup[key] = 'Highland'
  } else if(i <= global.elevationIntegers['Mountain'] * 100) {
    global.elevationIntegerLookup[key] = 'Mountain'
  } else if(i <= global.elevationIntegers['Snow'] * 100) {
    global.elevationIntegerLookup[key] = 'Snow'
  }
}

function getRiverNeighborCount(node, nodes, river, options) {
  const { top, left, right, bottom } = getNeighbors(node, nodes)

  let count = 0;
  //left.rivers.length > 0 ||
  //right.rivers.length > 0 ||
  //top.rivers.length > 0 ||
  //bottom.rivers.length > 0 ||


  if(options.forceEndInWater) {
    // DONT let it touch its own river
    if (left != null && (river.nodes.some(({id}) => id == left.id) ) ) count++;
    if (right != null && (river.nodes.some(({id}) => id == right.id) ) ) count++;
    if (top != null && (river.nodes.some(({id}) => id == top.id) ) ) count++;
    if (bottom != null && (river.nodes.some(({id}) => id == bottom.id) ) ) count++;
  } else {
    // LET IT touch its own river, this will create a pool in anything that has a lower height than the original node
    if (left != null && left.rivers.length > 0 && left.rivers.some(({id}) => id == river.id)) count++;
    if (right != null && right.rivers.length > 0 && right.rivers.some(({id}) => id == river.id)) count++;
    if (top != null && top.rivers.length > 0 && top.rivers.some(({id}) => id == river.id)) count++;
    if (bottom != null && bottom.rivers.length > 0 && bottom.rivers.some(({id}) => id == river.id)) count++;
  }

  return count;
}

function getLowestNeighbor(node, nodes) {
  const { top, left, right, bottom } = getNeighbors(node, nodes)

  let leftElevation = 1
  let rightElevation = 1
  let bottomElevation = 1
  let topElevation = 1

  if(left) leftElevation = left.elevation;
  if(right) rightElevation = right.elevation;
  if(bottom) bottomElevation = bottom.elevation;
  if(top) topElevation = top.elevation;

  if (leftElevation < rightElevation && leftElevation < topElevation && leftElevation < bottomElevation)
    return 'left';
  else if (rightElevation < leftElevation && rightElevation < topElevation && rightElevation < bottomElevation)
    return 'right';
  else if (topElevation < leftElevation && topElevation < rightElevation && topElevation < bottomElevation)
    return 'top';
  else if (bottomElevation < topElevation && bottomElevation < rightElevation && bottomElevation < leftElevation)
    return 'bottom'
  else
    return 'bottom'
}

function GenerateRivers(nodes) {
  let attempts = 0
  let maxRiverAttempts = 1000
  let riverCount = 500
  let rivers = []
  let minRiverHeight = .6
  let minRiverTurns = 2
  let maxRiverIntersections = 2
  let minRiverLength = 20
  let forceEndInWater = true

   // Generate some rivers
   while (riverCount > 0 && attempts < maxRiverAttempts) {
     let x = global.getRandomInt(0, nodes.length - 1)
     let y = global.getRandomInt(0, nodes[0].length - 1)

     let node = nodes[x][y]

     if(node.isWater) {
       continue
     }
     if(node.rivers.length) {
       continue
     }

     if(node.elevation > minRiverHeight) {
       const river = {
         id: global.uniqueID(),
         nodes: [],
         turnCount: 0,
         intersectionIds: {},
       }
       river.currentDirection = getLowestNeighbor(node, nodes)
       // Recursively find a path to water
       const foundWater = FindPathToWater(node, nodes, river.currentDirection, river, { forceEndInWater });

       if(forceEndInWater && !foundWater) {
         continue
       }

       // Validate the generated river
       if (river.turnCount < minRiverTurns || river.nodes.length < minRiverLength || Object.keys(river.intersectionIds).length > maxRiverIntersections)
       {
          // console.log('CANCALLED RIVER', river.nodes.length < minRiverLength )
          // if(river.turnCount < minRiverTurns) console.log('not enough turns', river.turnCount)
          // if(Object.keys(river.intersectionIds).length > maxRiverIntersections) console.log('too many intersections', river.intersections)
          // if(river.nodes.length < minRiverLength) console.log('not long enough', river.nodes.length)
          //  //Validation failed - remove this river
           // for (let i = 0; i < river.nodes.length; i++)
           // {
           //     n = river.nodes[i];
           //     rivers = node.rivers.filter((r) => r != n)
           // }
       }
       else if (river.nodes.length >= minRiverLength)
       {
           //Validation passed - Add river to list
           rivers.push(river);
           river.nodes.forEach((nodeInRiver) => {
             nodeInRiver.rivers.push(river)
           })
           riverCount--;
       }
     }


     attempts++;
   }

   return rivers
}

function FindPathToWater(node, nodes, direction, river, options)
{
    if (node.rivers.some(({id}) => id == river.id)) {
      return;
    }

    // check if there is already a river on this tile
    if (node.rivers.length > 0) {
      node.rivers.forEach(({id}) => {
        river.intersectionIds[id] = true
      })
    }

    river.nodes.push(node)

    // get neighbors
    const { top, left, right, bottom } = getNeighbors(node, nodes)

    if(direction === 'left' && !left) {
      // console.log('cant find left')
      return
    }
    if(direction === 'right' && !right) {
      // console.log('cant find right')
      return
    }
    if(direction === 'top' && !top) {
      // console.log('cant find top')
      return
    }
    if(direction === 'bottom' && !bottom) {
      // console.log('cant find bottom')
      return
    }

    let leftValue = Number.MAX_SAFE_INTEGER;
    let rightValue = Number.MAX_SAFE_INTEGER;
    let topValue = Number.MAX_SAFE_INTEGER;
    let bottomValue = Number.MAX_SAFE_INTEGER;

    // query height values of neighbors
    // if(left && river.nodes.some(({id}) => id == left.id)) console.log('hasleft already')
    if (left && getRiverNeighborCount(left, nodes, river, options) < 2 && !river.nodes.some(({id}) => id == left.id)) {
      leftValue = left.elevation;
    }
    //else console.log('preventing left add')
    if (right && getRiverNeighborCount(right, nodes, river, options) < 2 && !river.nodes.some(({id}) => id == right.id)) {
      rightValue = right.elevation;
    }
    //else console.log('preventing right add')
    if (top && getRiverNeighborCount(top, nodes, river, options) < 2 && !river.nodes.some(({id}) => id == top.id)) {
      topValue = top.elevation;
    }
    //else console.log('preventing top add')
    if (bottom && getRiverNeighborCount(bottom, nodes, river, options) < 2 && !river.nodes.some(({id}) => id == bottom.id)) {
      bottomValue = bottom.elevation;
    }
    //else console.log('preventing bottom add')

//     // if neighbor is existing river that is not this one, flow into it
//     // && (!bottom.isLand && !bottom.isMountain)
//     if (bottom && bottom.rivers.length) {
//       // console.log('force joining other river to the bottom')
//       bottomValue = 0;
//     }
//
//     // && (!top.isLand && !top.isMountain)
//     if (top && top.rivers.length) {
//       // console.log('force joining other river to the top')
//       topValue = 0;
//     }
//
// // && (!left.isLand && !left.isMountain)
//     if (left && left.rivers.length) {
//       // console.log('force joining other river to the left')
//       leftValue = 0;
//     }
//
// // && (!right.isLand && !right.isMountain)
//     if (right && right.rivers.length) {
//       // console.log('force joining other river to the right')
//       rightValue = 0;
//     }

    //override flow direction if a tile is significantly lower
    if (direction == 'left') {
        if (Math.abs (rightValue - leftValue) < 0.1) {
          // console.log('force turning right', rightValue, leftValue, (rightValue - leftValue))
            rightValue = Number.MAX_SAFE_INTEGER;
        }
    }
    if (direction == 'right') {
        if (Math.abs (rightValue - leftValue) < 0.1) {
          // console.log('force turning left', rightValue, leftValue, (rightValue - leftValue))
            leftValue = Number.MAX_SAFE_INTEGER;
        }
    }
    if (direction == 'top') {
        if (Math.abs (topValue - bottomValue) < 0.1) {
          // console.log('force turning up', topValue, bottomValue, (topValue - bottomValue))
            bottomValue = Number.MAX_SAFE_INTEGER;
        }
    }
    if (direction == 'bottom') {
        if (Math.abs (topValue - bottomValue) < 0.1) {
          // console.log('force turning ', topValue, bottomValue, (topValue - bottomValue))
            topValue = Number.MAX_SAFE_INTEGER;
        }
    }


    // find mininum
    let min = Math.min(leftValue, rightValue, topValue, bottomValue);
    // console.log(leftValue, rightValue, topValue, bottomValue)
    // if no minimum found - exit
    if (min == Number.MAX_SAFE_INTEGER) {
      // console.log('cant find water')
      if(options.forceEndInWater) return false
      return true;
    }

    //Move to next neighbor
    if (min == leftValue) {
        if (left.isLand || left.isMountain)
        {
            if (river.currentDirection != 'left'){
                river.turnCount++;
                river.currentDirection = 'left';
            }
            // console.log('LEFT')

            return FindPathToWater (left, nodes, direction, river, options);
        }
    } else if (min == rightValue) {
        if (right.isLand || right.isMountain)
        {
            if (river.currentDirection != 'right'){
                river.turnCount++;
                river.currentDirection = 'right';
            }
            // console.log('RIGHT')

            return FindPathToWater (right, nodes, direction, river, options);
        }
    } else if (min == bottomValue) {
        if (bottom.isLand || bottom.isMountain)
        {
            if (river.currentDirection != 'bottom'){
                river.turnCount++;
                river.currentDirection = 'bottom';
            }
            // console.log('DOWN')

            return FindPathToWater (bottom, nodes, direction, river, options);
        }
    } else if (min == topValue) {
        if (top.isLand || top.isMountain)
        {
            if (river.currentDirection != 'top'){
                river.turnCount++;
                river.currentDirection = 'top';
            }
            // console.log('UP')

            return FindPathToWater (top, nodes, direction, river, options);
        }
    }

    return true
}

function BuildRiverGroups(nodes)
{
  const riverGroups = []

  nodes.forEach((row, x) => {
    row.forEach((node, y) => {
    //loop each tile, checking if it belongs to multiple rivers
            // console.log(node.rivers)
            // multiple rivers == intersection
            if (node.rivers.length > 1)
            {
                let riverGroup = null;
                // Does a rivergroup already exist for this group?
                for (let n=0; n < node.rivers.length; n++)
                {
                    let nodeRiver = node.rivers[n];
                    for (let i = 0; i < riverGroups.length; i++)
                    {
                        for (let j = 0; j < riverGroups[i].rivers.length; j++)
                        {
                            let river = riverGroups[i].rivers[j];
                            if (river.id == nodeRiver.id)
                            {
                                riverGroup = riverGroups[i];
                            }
                            if (riverGroup != null) break;
                        }
                        if (riverGroup != null) break;
                    }
                    if (riverGroup != null) break;
                }
 
                // existing group found -- add to it
                if (riverGroup != null)
                {
                    for (let n=0; n < node.rivers.length; n++)
                    {
                        if (!riverGroup.rivers.some((({id}) => id != node.rivers[n].id))) {
                          riverGroup.rivers.push(node.rivers[n]);
                        }
                    }
                }
                else   //No existing group found - create a new one
                {
                    const riverGroup = {
                      id: global.uniqueID(),
                      rivers: [],
                    }
                    for (let n=0; n < node.rivers.length; n++)
                    {
                        riverGroup.rivers.push(node.rivers[n]);
                    }
                    riverGroups.push (riverGroup);
                }
            }
        })
    })

  return riverGroups
}

function DigRiverGroups(riverGroups, nodes)
{
    for (let i = 0; i < riverGroups.length; i++) {

        let group = riverGroups[i];
        let longest = null;

        //Find longest river in this group
        for (let j = 0; j < group.rivers.length; j++)
        {
            let river = group.rivers[j];
            if (longest == null) {
              longest = river;
            } else if (longest.nodes.length < river.nodes.length) {
              longest = river;
            }
        }

        if (longest != null)
        {
            //Dig out longest path first
            DigRiver (longest, nodes);

            for (let j = 0; j < group.rivers.length; j++)
            {
                let river = group.rivers[j];
                if (river != longest)
                {
                    DigRiverWithParent (river, longest, nodes);
                }
            }
        }
    }
}

function DigRiver(river, nodes)
{
    let counter = 0;

    // How wide are we digging this river?
    const size = global.getRandomInt(1,5);
    river.length = river.nodes.length;

    // randomize size change
    const two = river.length / 2;
    const three = two / 2;
    const four = three / 2;
    const five = four / 2;

    const twomin = two / 3;
    const threemin = three / 3;
    const fourmin = four / 3;
    const fivemin = five / 3;

    // randomize lenght of each size
    let count1 = global.getRandomInt (fivemin, five);
    if (size < 4) {
        count1 = 0;
    }
    let count2 = count1 + global.getRandomInt(fourmin, four);
    if (size < 3) {
        count2 = 0;
        count1 = 0;
    }
    let count3 = count2 + global.getRandomInt(threemin, three);
    if (size < 2) {
        count3 = 0;
        count2 = 0;
        count1 = 0;
    }
    let count4 = count3 + global.getRandomInt (twomin, two);

    // Make sure we are not digging past the river path
    if (count4 > river.length) {
        const extra = count4 - river.length;
        while (extra > 0)
        {
            if (count1 > 0) { count1--; count2--; count3--; count4--; extra--; }
            else if (count2 > 0) { count2--; count3--; count4--; extra--; }
            else if (count3 > 0) { count3--; count4--; extra--; }
            else if (count4 > 0) { count4--; extra--; }
        }
    }

    // Dig it out
    for (let i = river.nodes.length - 1; i >= 0 ; i--)
    {
        const node = river.nodes[i];

        if (counter < count1) {
            DigRiverForNode(node, river, 4, nodes);
        }
        else if (counter < count2) {
            DigRiverForNode(node, river, 3, nodes);
        }
        else if (counter < count3) {
            DigRiverForNode(node, river, 2, nodes);
        }
        else if ( counter < count4) {
            DigRiverForNode(node, river, 1, nodes);
        }
        else {
            DigRiverForNode(node, river, 0, nodes);
        }
        counter++;
    }
}

function DigRiverWithParent(river, parent, nodes)
{
    let intersectionIndex = 0;
		let intersectionSize = 0;

    // determine point of intersection
    for (let i = 0; i < river.nodes.length; i++) {
      let node1 = river.nodes[i];
      for (let j = 0; j < parent.nodes.length; j++) {
        let node2 = parent.nodes[j];
        if (node1.id == node2.id)
        {
          intersectionIndex = i;
          intersectionSize = node2.riverSize;
        }
      }
    }

    let intersectionCount = river.nodes.length - intersectionIndex;

    // How wide are we digging this river?
    const size = global.getRandomInt(intersectionSize,5);
    river.length = river.nodes.length;

    let counter = 0;

    // randomize size change
    const two = river.length / 2;
    const three = two / 2;
    const four = three / 2;
    const five = four / 2;

    const twomin = two / 3;
    const threemin = three / 3;
    const fourmin = four / 3;
    const fivemin = five / 3;


    // randomize lenght of each size
    let count1 = global.getRandomInt (fivemin, five);
    if (size < 4) {
        count1 = 0;
    }
    let count2 = count1 + global.getRandomInt(fourmin, four);
    if (size < 3) {
        count2 = 0;
        count1 = 0;
    }
    let count3 = count2 + global.getRandomInt(threemin, three);
    if (size < 2) {
        count3 = 0;
        count2 = 0;
        count1 = 0;
    }
    let count4 = count3 + global.getRandomInt (twomin, two);

    // Make sure we are not digging past the river path
    if (count4 > river.length) {
        const extra = count4 - river.length;
        while (extra > 0)
        {
            if (count1 > 0) { count1--; count2--; count3--; count4--; extra--; }
            else if (count2 > 0) { count2--; count3--; count4--; extra--; }
            else if (count3 > 0) { count3--; count4--; extra--; }
            else if (count4 > 0) { count4--; extra--; }
        }
    }

    // adjust size of river at intersection point
    if (intersectionSize == 1) {
      count4 = intersectionCount;
      count1 = 0;
      count2 = 0;
      count3 = 0;
    } else if (intersectionSize == 2) {
      count3 = intersectionCount;
      count1 = 0;
      count2 = 0;
    } else if (intersectionSize == 3) {
      count2 = intersectionCount;
      count1 = 0;
    } else if (intersectionSize == 4) {
      count1 = intersectionCount;
    } else {
      count1 = 0;
      count2 = 0;
      count3 = 0;
      count4 = 0;
    }

    // Dig it out
    for (let i = river.nodes.length - 1; i >= 0 ; i--)
    {
        const node = river.nodes[i];

        if (counter < count1) {
            DigRiverForNode(node, river, 4, nodes);
        }
        else if (counter < count2) {
            DigRiverForNode(node, river, 3, nodes);
        }
        else if (counter < count3) {
            DigRiverForNode(node, river, 2, nodes);
        }
        else if ( counter < count4) {
            DigRiverForNode(node, river, 1, nodes);
        }
        else {
            DigRiverForNode(node, river, 0, nodes);
        }
        counter++;
    }
}

function DigRiverForNode(node, river, size, nodes) {
  node.setAsRiver (river);
  node.riverSize = size

  const {top, bottom, right, left} = getNeighbors(node, nodes)

  if (size == 1) {
    if (bottom != null)
    {
      bottom.setAsRiver (river);
      if (bottom.rightNeighbor(nodes) != null) bottom.rightNeighbor(nodes).setAsRiver (river);
    }
    if (right != null) right.setAsRiver (river);
  }

  if (size == 2) {
    if (bottom != null) {
      bottom.setAsRiver (river);
      if (bottom.rightNeighbor(nodes) != null) bottom.rightNeighbor(nodes).setAsRiver (river);
    }
    if (right != null) {
      right.setAsRiver (river);
    }
    if (top != null) {
      top.setAsRiver (river);
      if (top.leftNeighbor(nodes) != null) top.leftNeighbor(nodes).setAsRiver (river);
      if (top.rightNeighbor(nodes) != null) top.rightNeighbor(nodes).setAsRiver (river);
    }
    if (left != null) {
      left.setAsRiver (river);
      if (left.bottomNeighbor(nodes) != null) left.bottomNeighbor(nodes).setAsRiver (river);
    }
  }

  if (size == 3) {
    if (bottom != null) {
      bottom.setAsRiver (river);
      if (bottom.rightNeighbor(nodes) != null) bottom.rightNeighbor(nodes).setAsRiver (river);
      if (bottom.bottomNeighbor(nodes) != null)
      {
        bottom.bottomNeighbor(nodes).setAsRiver (river);
        if (bottom.bottomNeighbor(nodes).rightNeighbor(nodes) != null) bottom.bottomNeighbor(nodes).rightNeighbor(nodes).setAsRiver (river);
      }
    }
    if (right != null) {
      right.setAsRiver (river);
      if (right.rightNeighbor(nodes) != null)
      {
        right.rightNeighbor(nodes).setAsRiver (river);
        if (right.rightNeighbor(nodes).bottomNeighbor(nodes) != null) right.rightNeighbor(nodes).bottomNeighbor(nodes).setAsRiver (river);
      }
    }
    if (top != null) {
      top.setAsRiver (river);
      if (top.leftNeighbor(nodes) != null) top.leftNeighbor(nodes).setAsRiver (river);
      if (top.rightNeighbor(nodes) != null)top.rightNeighbor(nodes).setAsRiver (river);
    }
    if (left != null) {
      left.setAsRiver (river);
      if (left.bottomNeighbor(nodes) != null) left.bottomNeighbor(nodes).setAsRiver (river);
    }
  }

  if (size == 4) {

    if (bottom != null) {
      bottom.setAsRiver (river);
      if (bottom.rightNeighbor(nodes) != null) bottom.rightNeighbor(nodes).setAsRiver (river);
      if (bottom.bottomNeighbor(nodes) != null)
      {
        bottom.bottomNeighbor(nodes).setAsRiver (river);
        if (bottom.bottomNeighbor(nodes).rightNeighbor(nodes) != null) bottom.bottomNeighbor(nodes).rightNeighbor(nodes).setAsRiver (river);
      }
    }
    if (right != null) {
      right.setAsRiver (river);
      if (right.rightNeighbor(nodes) != null)
      {
        right.rightNeighbor(nodes).setAsRiver (river);
        if (right.rightNeighbor(nodes).bottomNeighbor(nodes) != null) right.bottomNeighbor(nodes).setAsRiver (river);
      }
    }
    if (top != null) {
      top.setAsRiver (river);
      if (top.rightNeighbor(nodes) != null) {
        top.rightNeighbor(nodes).setAsRiver (river);
        if (top.rightNeighbor(nodes).rightNeighbor(nodes) != null) top.rightNeighbor(nodes).rightNeighbor(nodes).setAsRiver (river);
      }
      if (top.topNeighbor(nodes) != null)
      {
        top.topNeighbor(nodes).setAsRiver (river);
        if (top.topNeighbor(nodes).rightNeighbor(nodes) != null) top.topNeighbor(nodes).rightNeighbor(nodes).setAsRiver (river);
      }
    }
    if (left != null) {
      left.setAsRiver (river);
      if (left.bottomNeighbor(nodes) != null) {
        left.bottomNeighbor(nodes).setAsRiver (river);
        if (left.bottomNeighbor(nodes).bottomNeighbor(nodes) != null) left.bottomNeighbor(nodes).bottomNeighbor(nodes).setAsRiver (river);
      }

      if (left.leftNeighbor(nodes) != null) {
        left.leftNeighbor(nodes).setAsRiver (river);
        if (left.leftNeighbor(nodes).bottomNeighbor(nodes) != null) left.leftNeighbor(nodes).bottomNeighbor(nodes).setAsRiver (river);
        if (left.leftNeighbor(nodes).topNeighbor(nodes) != null) left.leftNeighbor(nodes).topNeighbor(nodes).setAsRiver (river);
      }

      if (left.topNeighbor(nodes) != null)
      {
        left.topNeighbor(nodes).setAsRiver (river);
        if (left.topNeighbor(nodes) != null) left.topNeighbor(nodes).setAsRiver (river);
      }
    }
  }
}

function setMoisture(nodes) {
  nodes.forEach((row, x) => {
    row.forEach((node, y) => {
      node.moisture = node.moistureNoise
      //adjust moisture based on height
      if (node.elevationType == 'Deep Water') {
          node.moisture += 0.8 * node.elevation;
      }
      else if (node.elevationType == 'Water') {
          node.moisture += 0.3 * node.elevation;
      }
      else if (node.elevationType == 'Shore') {
          node.moisture += 0.1 * node.elevation;
      }

      if(node.riverSize) {
        node.moisture += .05;
      }

      if(node.moisture > 1) node.moisture = 1

      node.moistureType = global.moistureIntegerLookup[node.moisture.toFixed(2)]
    })
  })
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

    })
  })
}

function setHeatType(nodes) {
  nodes.forEach((row, x) => {
    const center = nodes.length/2
    const total = nodes.length
    row.forEach((node, y) => {
      if(node.elevationType === 'Mainland') {
        node.heat -= 0.1 * node.elevation
      }

      if(node.elevationType === 'Highland') {
        node.heat -= 0.2 * node.elevation
      }

      if(node.elevationType === 'Mountain') {
        node.heat -= 0.3 * node.elevation
      }

      if(node.elevationType === 'Snow') {
        node.heat -= 0.4 * node.elevation
      }

      if(node.heat < 0) node.heat = 0
      node.heatType = global.heatIntegerLookup[node.heat.toFixed(2)]
    })
  })
}

window.getFloodFilledNodeData = floodFilledNodeData
function floodFilledNodeData(nodes)
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

                let id = global.uniqueID()
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

                let id = global.uniqueID()
                landMasses[id] = group

                group.forEach((groupNode) => {
                  groupNode.isWater = false
                  groupNode.isLand = true
                  groupNode.isMountain = false
                  groupNode.landMassId = id
                })
            }
            // Water
            else if(node.isWater){
                const group = [];
                group.type = 'isWater'
                stack.push(node);

                while(stack.length > 0)   {
                  FloodFill(stack.pop(), group, stack, nodes);
                }

                let id = global.uniqueID()
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

function floodFillBiomeData(nodes)
{
    // Use a stack instead of recursion
    const stack = []

    const biomes = {}

    nodes.forEach((row, x) => {
      row.forEach((node, y) => {
        //Tile already flood filled, skip
        if (node.isBiomeFloodFilled) return;

        if(!biomes[node.biomeType]) {
          biomes[node.biomeType] = {}
        }

        const group = [];
        group.biomeType = node.biomeType
        stack.push(node);

        while(stack.length > 0) {
          FloodFillBiome(stack.pop(), group, stack, nodes);
        }

        let id = global.uniqueID()
        biomes[node.biomeType][id] = group

        group.forEach((groupNode) => {
          groupNode.biomeId = id
        })
    })

  })

  return biomes
}


function FloodFillBiome(node, group, stack, nodes)
{
    // Validate
    if (node.isBiomeFloodFilled) return;
    if (group.biomeType !== node.biomeType) return;

    // Add to TileGroup
    group.push(node);
    node.isBiomeFloodFilled = true;

    // floodfill into neighbors
    const { top, left, right, bottom } = getNeighbors(node, nodes)

    if (top && !top.isBiomeFloodFilled && node.biomeType == top.biomeType) stack.push (top);

    if (bottom && !bottom.isBiomeFloodFilled && node.biomeType == bottom.biomeType) stack.push (bottom);

    if (left && !left.isBiomeFloodFilled && node.biomeType == left.biomeType) stack.push (left);

    if (right && !right.isBiomeFloodFilled && node.biomeType == right.biomeType) stack.push (right);
}

function applyChangesToNodeData(nodes) {
  nodes.forEach((row, x) => {
    row.forEach((node, y) => {
      let elevationInt = window.terrainIntLookUp[node.elevationType]
      GAME.grid.nodeData[node.id] = elevationInt
      // nodeData.elevation = node.elevation
      // nodeData.elevationType = node.elevationType
      // data.elevationType = node.elevationType
      // data.heatType = node.heatType
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

function setAllNodesBiomeBitmask(nodes) {
  nodes.forEach((row, x) => {
    row.forEach((node, y) => {
      let count = 0;

      const { top, left, right, bottom } = getNeighbors(node, nodes)

      if (top && node.biomeType == top.biomeType) count += 1;
      if (right && node.biomeType == right.biomeType) count += 2;
      if (bottom && node.biomeType == bottom.biomeType) count += 4;
      if (left && node.biomeType == left.biomeType) count += 8;

      node.biomeBitmask = count;
    })
  })
}

function setAllNodesElevationTypes(nodes) {
  nodes.forEach((row, x) => {
    row.forEach((node, y) => {
      const elevationType = global.elevationIntegerLookup[node.elevation.toFixed(2)]

      if(elevationType === 'Deep Water' || elevationType === 'Water') {
        node.isWater = true
      }
      if(elevationType === 'Mainland' || elevationType === 'Highland' || elevationType === 'Shore') {
        node.isLand = true
      }
      if(elevationType === 'Mountain' || elevationType === 'Snow') {
        node.isMountain = true
      }
      node.elevationType = elevationType
    })
  })
}

function setAllNodesBiomeType(nodes) {
  nodes.forEach((row, x) => {
    row.forEach((node, y) => {
      try {
        const biomeType = biomeLookup[node.moistureType][node.heatType]

        node.biomeType = biomeType
      } catch(e) {
        console.log('no moisture', node.moistureType)
        console.log('no heat', node.heatType)
      }
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
      node.elevationType = null
      node.heat = null
      node.heatNoise = null
      node.heatType = null
      node.moisture = null
      node.moistureNoise = null
      node.moistureType = null
      node.isLand = null
      node.isWater = null
      node.rivers = []
      node.isFloodFilled = null
      node.elevationBitmask = null
      node.biomeBitmask = null
      node.biomeType = null
      node.isBiomeFloodFilled = null
    })
  })
}

function getNeighbors(node, nodes)
{
  let top
  let bottom
  let right
  let left

  try {
      if(node.gridX >= 0) top = nodes[node.gridX][node.gridY-1]
      if(node.gridX >= 0) bottom = nodes[node.gridX][node.gridY+1]

      if(nodes[node.gridX-1]) {
        left = nodes[node.gridX-1][node.gridY]
      }
      if(nodes[node.gridX+1]) {
        right = nodes[node.gridX+1][node.gridY]
      }
  } catch(e) {
    console.trace(node.gridX, node.gridY)
    if(!nodes) console.log('no nodes')
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

function generateNoiseMap({type, seed, nodes, property, width, height, useCenterRadialGradient, useVerticalGradient}) {
  if(typeof seed != 'number') seed = Math.random()

  var noise = new Noise(seed);

  if(nodes && nodes.length) width = nodes.length
  if(nodes && nodes[0].length) height = nodes[0].length

  let gradientMap
  if(useCenterRadialGradient) {
    gradientMap = radialGradient(width, width/2, height/2, width/2)
  } else if(useVerticalGradient) {
    gradientMap = verticalGradient(height, 0, width, 0, 1)
  }

  const start = Date.now()
  let min = Number.MAX_VALUE
  let max = Number.MIN_VALUE

  if(type == 'perlin') {
    if(!nodes) {
      const perlinGrid = new Grid({startX: 0, startY: 0, width, height})
      nodes = perlinGrid.nodes
    }

    for (var x = 0; x < width; x++) {
      for (var y = 0; y < height; y++) {
        let value = 0

        if(gradientMap) {
          value += gradientMap.getTile(x, y).value
          if(value != 0 && !value) {
            value = -1
          }
        }

        // noise.simplex2 and noise.perlin2 return values between -1 and 1.
        value += noise.perlin2(x / 100, y / 100);

        // here I convert it to 0-1 and save it
        nodes[x][y][property] = value

        if (min > value) { min = value }
        if (max < value) { max = value }
        //Math.abs(value) * 256; // Or whatever. Open demo.html to see it used with canvas.

      }
    }
  }

  if(type == 'simplex') {
    if(!nodes) {
      const simplexGrid = new Grid({startX: 0, startY: 0, width, height})
      nodes = simplexGrid.nodes
    }

    for (var x = 0; x < width; x++) {
      for (var y = 0; y < height; y++) {

        let value = 0

        if(gradientMap) {
          value += gradientMap.getTile(x, y).value
          if(value != 0 && !value) {
            value = -1
          }
        }

        // noise.simplex2 and noise.simplex2 return values between -1 and 1.
        value += noise.simplex2(x / 100, y / 100);

        // here I convert it to 0-1 and save it
        nodes[x][y][property] = value
        //Math.abs(value) * 256; // Or whatever. Open demo.html to see it used with canvas.

        if (min > value) { min = value }
        if (max < value) { max = value }
      }
    }
  }

  if(type === 'clouds') {
    const simplex = new SimplexNoise(() => { return seed })
    // initialize a grid
    // generate clouds in the grid using the noise generator
    for (var x = 0; x < width; x++) {
      for (var y = 0; y < height; y++) {
            let value = 0

            if(gradientMap) {
              value = gradientMap.getTile(x, y).value
              if(value != 0 && !value) {
                value = -1
              }
            }
            // 8 octaves typed by hand
            value += simplex.noise2D(x, y) * 1/256
            value += simplex.noise2D(x / 2, y / 2) * 1/128
            value += simplex.noise2D(x / 4, y / 4) * 1/64
            value += simplex.noise2D(x / 8, y / 8) * 1/32
            value += simplex.noise2D(x / 16, y / 16) * 1/16
            value += simplex.noise2D(x / 32, y / 32) * 1/8
            value += simplex.noise2D(x / 64, y / 64) * 1/4
            value += simplex.noise2D(x / 128, y / 128) * 1/2

            // track the upper and lower ranges, for debugging
            if (min > value) { min = value }
            if (max < value) { max = value }

            nodes[x][y][property] = value
        }
    }

  }

  let adjustedMin = Number.MAX_VALUE
  let adjustedMax = Number.MIN_VALUE
  let absoluteMin = Math.abs(min)
  let highestPossible = (absoluteMin + max)
  for (var x = 0; x < width; x++) {
    for (var y = 0; y < height; y++) {
        const value = nodes[x][y][property]
        const newValue = (value + absoluteMin)/highestPossible
        nodes[x][y][property] = newValue
        if (adjustedMin > newValue) { adjustedMin = newValue }
        if (adjustedMax < newValue) {
          adjustedMax = newValue
         }
      }
  }

  const elapsed  = Date.now() - start
  //adjusted range ${ adjustedMin }, ${ adjustedMax}
  console.log(`generation complete, range ${ min }, ${ max}, ajusted ${ adjustedMin }, ${ adjustedMax} in ${ elapsed } ms`)

  return nodes
}

function updateTerrainDataPhysics(terrainData, remove) {
  global.terrainObjects = []
  global.terrainObstacles = []

  const grid = {...GAME.grid, x: GAME.grid.startX, y: GAME.grid.startY, width: GAME.grid.width * GAME.grid.nodeSize, height: GAME.grid.height * GAME.grid.nodeSize}
  Object.keys(terrainData.mountainRanges).forEach((id) => {

    const mountainRange = terrainData.mountainRanges[id]
    const { x, y, width, height } = global.getBoundingBox(mountainRange, grid)

    const object = {
      id,
      x, y, width, height,
      terrainGroupType: 'mountainRange',
      constructParts: mountainRange,
      tags: {
        obstacle: true,
        Mountain: true,
        terrain: true,
      }
    }

    GAME.objectsById[id] = object
    if(!remove) global.terrainObjects.push(object)
    if(!remove) global.terrainObstacles.push(object)
    object.constructParts.forEach((part) => {
      part.ownerId = id
      if(remove) PHYSICS.removeObject(part)
      else PHYSICS.addObject(part)
    })
  })
  Object.keys(terrainData.landMasses).forEach((id) => {

    const landMass = terrainData.landMasses[id]
    const { x, y, width, height } = global.getBoundingBox(landMass, grid)

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
    if(!remove) global.terrainObjects.push(object)
    object.constructParts.forEach((part) => {
      part.ownerId = id
      // if(remove) PHYSICS.removeObject(part)
      // else PHYSICS.addObject(part)
    })

  })
  Object.keys(terrainData.waterMasses).forEach((id) => {
    const bodyOfWater = terrainData.waterMasses[id]

    const { x, y, width, height } = global.getBoundingBox(bodyOfWater, grid)

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

    if(!remove) global.terrainObjects.push(object)
    GAME.objectsById[id] = object
    object.constructParts.forEach((part) => {
      part.ownerId = id
      // if(remove) PHYSICS.removeObject(part)
      // else PHYSICS.addObject(part)
    })
  })
}

function adjustMoistureMapFromRivers(nodes) {
  nodes.forEach((row, x) => {
    row.forEach((node, y) => {
      if (node.riverSize)
      {
        addMoistureToNodes(node, nodes, 60, x, y);
      }
    })
  })
}

function addMoistureToNodes(node, nodes, radius, x, y) {
  if(!node) return
    let center = new Vector(x, y);
    let curr = radius;

    while (curr > 0) {

        let x1 = x - curr
        let x2 = x + curr

        // if(curr == 1) console.log(10 / (center.subtractAndCopy(new Vector(x1, y))).magnitude, (center.subtractAndCopy(new Vector(x1, y))).magnitude)

        if(nodes[x1]) addMoistureToNode(nodes[x1][y], .25 / (center.subtractAndCopy(new Vector(x1, y))).magnitude);
        if(nodes[x2]) addMoistureToNode(nodes[x2][y], .25 / (center.subtractAndCopy(new Vector(x2, y))).magnitude);

        for (let i = 0; i < curr; i++)
        {
            // console.log('next y', MathEx.Mod (y + i + 1, nodes[0].length))
            if(nodes[x1]) {
              addMoistureToNode (nodes[x1][y + i + 1], .25 / (center.subtractAndCopy(new Vector(x1, y + i + 1))).magnitude);
              addMoistureToNode (nodes[x1][y - (i + 1)], .25 / (center.subtractAndCopy(new Vector(x1, y - (i + 1)))).magnitude);
            }

            if(nodes[x2]) {
              addMoistureToNode (nodes[x2][y + i + 1], .25 / (center.subtractAndCopy(new Vector(x2, y + i + 1))).magnitude);
              addMoistureToNode (nodes[x2][y - (i + 1)], .25 / (center.subtractAndCopy(new Vector(x2, y - (i + 1)))).magnitude);
            }
        }
        curr--;
    }
}

function addMoistureToNode(node, amount)
{
  if(!node) return
  // console.log(amount)

  if(!node.moistureOld) node.moistureOld = node.moisture
  node.moisture += amount;
  if (node.moisture > 1) node.moisture = 1;


  //set moisture type
  node.moistureType = global.moistureIntegerLookup[node.moisture.toFixed(2)]
}


async function generateWorld(nodes, noiseType, showModals) {
  const terrainData = {}
  let rivers
  let riverGroups
  let biomeGroups = {}

  prepareNodesForGeneration(nodes)

  generateNoiseMap({type: noiseType, seed: Math.random(), nodes: nodes, property: 'elevation', useCenterRadialGradient: true})
  // updateAllNodesNeighbors(nodes)
  setAllNodesElevationTypes(nodes)
  setAllNodesElevationBitmask(nodes)

  if(showModals) await viewNoiseData({noiseNodes: nodes, title: noiseType + '-terrain', type: 'terrain', terrainData})

  let massData = floodFilledNodeData(nodes)
  terrainData.landMasses = massData.landMasses
  terrainData.waterMasses = massData.waterMasses
  terrainData.mountainRanges = massData.mountainRanges

  // if(showModals) await viewNoiseData({noiseNodes: nodes, title: noiseType + '-landwater', type: 'landwatergroups', terrainData})

  generateNoiseMap({type: 'perlin', seed: Math.random(), nodes: nodes, property: 'heat', useVerticalGradient: false})
  setHeatGradient(nodes)
  setHeatType(nodes)

  if(showModals) await viewNoiseData({noiseNodes: nodes, title: noiseType + '-heat', type: 'heat', terrainData})

  rivers = GenerateRivers(nodes)
  riverGroups = BuildRiverGroups(nodes)
  console.log(riverGroups)
  DigRiverGroups(riverGroups, nodes)

  setAllNodesElevationBitmask(nodes)


  generateNoiseMap({type: 'perlin', seed: Math.random(), nodes: nodes, property: 'moistureNoise'})

  setMoisture(nodes)
  adjustMoistureMapFromRivers(nodes)
  nodes.forEach((row, x) => {
    row.forEach((node, y) => {
      if(node.moistureOld) {
        if(node.moisture - node.moistureOld > .05) {
          // console.log('diff', node.moisture - node.moistureOld)
        }
      }
    })
  })

  if(showModals) await viewNoiseData({noiseNodes: nodes, title: noiseType + '-moisture', type: 'moisture', terrainData})


  // if(showModals) await viewNoiseData({noiseNodes: nodes, title: noiseType + '-rivers', type: 'terrain', terrainData})

  setAllNodesBiomeType(nodes)
  setAllNodesBiomeBitmask(nodes)
  biomeGroups = floodFillBiomeData(nodes)
  console.log(biomeGroups)

  if(showModals) await viewNoiseData({noiseNodes: nodes, title: noiseType + '-biome', type: 'biomes', terrainData, biomeGroups})
}

async function generateTerrainJSON(showModals = true) {
  // const nodesToUse = GAME.grid.nodes
  const nodesToUse = gridUtil.generateGridNodes({width: 1000, height: 1000, startX: 0, startY: 0})

  if(GAME.grid.terrainData) {
    // updateTerrainDataPhysics(GAME.grid.terrainData, true)
  }

  const nodes = nodesToUse
  const nodesCopy = nodesToUse
  const nodesCopy2 = nodesToUse

  if(!GAME.grid.terrainSeed) GAME.grid.terrainSeed = Math.random()

  // await generateWorld(nodes,'perlin', showModals)


  // await generateWorld(nodesCopy,'simplex', showModals)


  await generateWorld(nodesCopy2,'clouds', showModals)




  // updateTerrainDataPhysics(massData, false)

  // GAME.grid.nodes = nodesCopy
  // GAME.grid.terrainData = massData
  // applyChangesToNodeData(nodesCopy)
  console.log('done w procedural map')
  // global.socket.emit('updateGrid', GAME.grid)
}

function getGameObjectDataFromNodes(nodes) {
  nodes.forEach((row, x) => {
    row.forEach((node, y) => {
      if(!node.data) return
      const elevationType = global.terrainTypeLookUp[node.data]
      if(elevationType === 'Deep Water' || elevationType === 'Water') {
        node.isWater = true
      }
      if(elevationType === 'Mainland' || elevationType === 'Highland' || elevationType === 'Shore') {
        node.isLand = true
      }
      if(elevationType === 'Mountain' || elevationType === 'Snow') {
        node.isMountain = true
      }

      node.elevationType = elevationType
    })
  })

  // setAllNodesElevationBitmask(nodes)

  return floodFilledNodeData(nodes)
}

export {
  generateTerrainJSON,
  getGameObjectDataFromNodes
}
