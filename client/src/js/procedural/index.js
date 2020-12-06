import './particle.js'
import './audio.js'
import './sprites.js'
import './title.js'

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

window.getRandomInt = getRandomInt

window.getRandomFloat = function(min, max) {
  return (Math.random() * (max - min)) + min;
}
