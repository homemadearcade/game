import './particle.js'
import './audio.js'
import './sprites.js'
import './title.js'
import './lighting.js'

import { generateTerrainJSON, getGameObjectDataFromNodes } from './terrain/index.js'

class Procedural{
  generateTerrain() {
    generateTerrainJSON()
  }

  getGameObjectDataFromNodes(nodes) {
    return getGameObjectDataFromNodes(nodes)
  }

  // renderNoise(noiseGrid) {
  //
  // }
}

global.PROCEDURAL = new Procedural()

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

global.getRandomInt = getRandomInt

global.getRandomFloat = function(min, max) {
  return (Math.random() * (max - min)) + min;
}
