import './particle.js'
import './audio.js'
import './sprites.js'
import './title.js'
import './lighting.js'

import { generateTerrainJSON } from './terrain/index.js'

class Procedural{
  generateTerrain() {
    generateTerrainJSON()
  }


  // renderNoise(noiseGrid) {
  //
  // }
}

window.PROCEDURAL = new Procedural()

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

window.getRandomInt = getRandomInt

window.getRandomFloat = function(min, max) {
  return (Math.random() * (max - min)) + min;
}
