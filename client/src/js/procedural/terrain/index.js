import { Noise } from 'noisejs'
import { viewNoiseData } from './modals'

import Grid from './Grid'

function generateNoiseMap(width, height, type, seed) {
  if(typeof seed != 'number') seed = Math.random()

  var noise = new Noise(seed);

  if(type == 'perlin') {
    const perlinGrid = new Grid({startX: 0, startY: 0, width, height})

    for (var x = 0; x < width; x++) {
      for (var y = 0; y < height; y++) {
        // noise.simplex2 and noise.perlin2 return values between -1 and 1.
        var value = noise.perlin2(x / 100, y / 100);

        perlinGrid.nodes[x][y].noise = value
        //Math.abs(value) * 256; // Or whatever. Open demo.html to see it used with canvas.
      }
    }
    return perlinGrid.nodes
  }

  if(type == 'simplex') {
    const simplexGrid = new Grid({startX: 0, startY: 0, width, height})

    for (var x = 0; x < width; x++) {
      for (var y = 0; y < height; y++) {
        // noise.simplex2 and noise.simplex2 return values between -1 and 1.
        var value = noise.simplex2(x / 100, y / 100);

        simplexGrid.nodes[x][y].noise = value
        //Math.abs(value) * 256; // Or whatever. Open demo.html to see it used with canvas.
      }
    }
    return simplexGrid.nodes
  }
}

async function generateTerrainJSON() {
  const perlinMap = generateNoiseMap(200, 200, 'perlin', Math.random())
  await viewNoiseData(perlinMap, 'perlin')

  const simplexMap = generateNoiseMap(200, 200, 'simplex', Math.random())
  await viewNoiseData(simplexMap, 'simplex')
}

export {
  generateTerrainJSON
}
