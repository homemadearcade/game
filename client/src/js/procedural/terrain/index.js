import { Noise } from 'noisejs'
import { viewNoiseData } from './modals'

import Grid from './Grid'

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

async function generateTerrainJSON() {
  const grid = new Grid({startX: 0, startY: 0, width: 300, height: 300})

  generateNoiseMap({type: 'perlin', seed: Math.random(), nodes: grid.nodes, property: 'moisture'})
  await viewNoiseData({noiseNodes: grid.nodes, nodeProperty: 'moisture', title: 'perlin', type: 'terrain'})

  generateNoiseMap({type: 'simplex', seed: Math.random(), nodes: grid.nodes, property: 'height'})
  await viewNoiseData({noiseNodes: grid.nodes, nodeProperty: 'height', title: 'simplex', type: 'terrain'})
}



export {
  generateTerrainJSON
}
