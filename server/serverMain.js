import GameInstance from './GameInstance.js';
import nengiConfig from '../common/nengiConfig.js';

const gameInstance = new GameInstance(/*args*/)

//let start = hrtimeMs() // uncomment to benchmark

//let stop = hrtimeMs()
//console.log('game update took', stop-start, 'ms')

global.nengiGameInstance = gameInstance
