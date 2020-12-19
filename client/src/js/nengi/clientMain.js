import GameClient from './GameClient.js';

global.GAME_CLIENT = new GameClient()
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
