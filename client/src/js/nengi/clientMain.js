import GameClient from './GameClient.js';

const gameClient = new GameClient()
let previous = performance.now()
let tick = 0
window.local.on('onRender', (() => {
  let now = performance.now()
  let delta = (now - previous) / 1000
  previous = now
  gameClient.update(delta, tick++, now)
}))
// window.onload = function() {
//     console.log('window loaded')

//     const loop = function() {
//         window.requestAnimationFrame(loop)
//         let now = performance.now()
//
//         tick++
//
//     }
//
//     loop()
// }
