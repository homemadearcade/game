// // import @geckos.io/snapshot-interpolation
// import { SnapshotInterpolation } from '@geckos.io/snapshot-interpolation'
//
// // initialize the library
// const SI = new SnapshotInterpolation(60)
import axios from 'axios'
//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
/////// CORE LOOP
///////////////////////////////
///////////////////////////////
let updateInterval = 1000/24
let renderInterval = 1000/24
let mapNetworkInterval = 1000/24
let completeNetworkInterval = 1000/.1
var frameCount = 0;
var fps, startTime, now, deltaRender, deltaMapNetwork, deltaCompleteNetwork, thenRender, thenMapNetwork, thenCompleteNetwork, thenUpdate, deltaUpdate;
var requestAnimationFrame = requestAnimationFrame || setImmediate;
global.startGameLoop = function() {
  if(!GAME.objects || !GAME.world || !GAME.grid || !GAME.heros || (PAGE.role.isPlayer && !GAME.heros[HERO.id])) {
    console.log('game loaded without critical data, trying again soon', !GAME.objects, !GAME.world, !GAME.grid, !GAME.heros, (PAGE.role.isPlayer && !GAME.heros[HERO.id]))
    setTimeout(startGameLoop, 1000)
    return
  }

  if(PAGE.role.isHost && !PAGE.role.isTempHost) {
    global.socket.emit('hostJoined')
  }

  startTime = Date.now();
  thenMapNetwork = startTime;
  thenCompleteNetwork = startTime;
  thenUpdate = startTime;
  thenRender = startTime;

  // begin main loop
  mainLoop()
  if(!global.isServerHost && PAGE.role.isHost && !PAGE.role.isArcadeMode && !PAGE.role.isHomeEditor && HERO.id && GAME.heros && GAME.heros[HERO.id]) setInterval(() => {
    axios.post(global.HAGameServerUrl + '/updateGameOnServerOnly', {
      game: {
        id: GAME.id,
        metadata: GAME.metadata,
        version: GAME.version,
        heros: GAME.heros,
        gameState: GAME.gameState,
        objects: GAME.objects,
        world: GAME.world,
        // grid: {...GAME.grid, nodes: null, nodeData: {}},
        defaultHero: GAME.defaultHero,
        library: GAME.library,
        theme: GAME.theme,
        customFx: GAME.customFx,
      }
    })
  }, 1000)
}

let debug = false
var mainLoop = function () {
  let startAll = performance.now()

  let start1 = performance.now()

  // calc elapsed time since last loop
  now = Date.now();
  deltaRender = now - thenRender;
  deltaMapNetwork = now - thenMapNetwork;
  deltaCompleteNetwork = now - thenCompleteNetwork;
  deltaUpdate = now - thenUpdate;


  let start2 = performance.now()

  if (deltaUpdate > updateInterval) {
    if(deltaUpdate > 23) deltaUpdate = 23
    thenUpdate = now - (deltaUpdate % updateInterval);

    // TESTING...Report #seconds since start and achieved fps.
    var sinceStart = now - startTime;
    var currentUps = Math.round(1000 / (sinceStart / ++frameCount) * 100) / 100;
    if(frameCount > 10) {
      frameCount = 0
      startTime = Date.now()
    }

    PAGE.ups = currentUps;

    update(deltaUpdate / 1000);
  }
  let totalTime2 = performance.now() - start2
  if(debug) console.log('update length update', totalTime2)


  // if enough time has deltaRender, draw the next frame
  if (deltaRender > renderInterval) {
    if(deltaUpdate > 23) deltaRender = 23
      // Get ready for next frame by setting then=now, but...
      // Also, adjust for gameInterval not being multiple of 16.67
      thenRender = now - (deltaRender % renderInterval);
      render(deltaRender / 1000)
  }

  let totalTime1 = performance.now() - start1
  if(debug) console.log('update length render', totalTime1)


  let start3 = performance.now()

  if (PAGE.role.isHost && deltaCompleteNetwork > completeNetworkInterval) {
    thenCompleteNetwork = now - (deltaCompleteNetwork % completeNetworkInterval);
    // reset mapNetworkUpdate as well
    thenMapNetwork = thenCompleteNetwork
    // console.log('COMPLETE NETWORK UPDATE')
    completeNetworkUpdate()
  } else if (PAGE.role.isHost && deltaMapNetwork > mapNetworkInterval) {
    thenMapNetwork = now - (deltaMapNetwork % mapNetworkInterval);
    mapNetworkUpdate()
  }

  let totalTime3 = performance.now() - start3
  if(debug) console.log('update length network', totalTime3)

  // Request to do this again ASAP
  setTimeout(mainLoop, 0);

  let totalTimeAll = performance.now() - startAll
  if(debug) console.log('update length all', totalTimeAll)
};

//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
/////// UPDATE GAME OBJECTS AND RENDER
///////////////////////////////
///////////////////////////////

let ticks = 0
function update(delta) {
  global.local.emit('onUpdate', delta)

  if(PAGE.role.isHost && !PAGE.role.isArcadeMode) {
    global.emitEvent('onNetworkUpdateHerosPos', GAME.heroList.map((hero) => {
      const data = {
        id: hero.id,
        x: hero.x,
        y: hero.y,
      }

      if(hero.subObjects) {
        data.subObjects = {}
        OBJECTS.forAllSubObjects(hero.subObjects, (so, name) => {
          data.subObjects[name] = {
            x: so.x,
            y: so.y,
          }
        })
      }

      return data
    }))
  }

}

function render(delta) {
  global.local.emit('onRender', delta)
}

global.updateHistory = {
  objectMap: {},
  heroMap: {},
  gameState: {},
  objectComplete: {},
  heroComplete: {},
}

function getDiff(historyProp, nextUpdate) {
  let diff
  if(global.updateHistory[historyProp]) {
    diff = global.getObjectDiff(nextUpdate, global.updateHistory[historyProp])
  } else {
    diff = nextUpdate
  }
  global.updateHistory[historyProp] = nextUpdate
  if(Array.isArray(diff)) diff = diff.filter((object) => !!object)
  return diff
}

let lastMapUpdate
function mapNetworkUpdate() {
  const gameStateUpdate = getDiff('gameState', _.cloneDeep(GAME.gameState) )
  const mapStateUpdate = getDiff('objectMap', GAME.objects.map(GAME.mod).map(OBJECTS.getMapState))
  const heroStateUpdate = getDiff('heroMap', GAME.heroList.map(GAME.mod).map(HERO.getMapState))
  if(Object.keys(gameStateUpdate).length) global.emitEvent('onNetworkUpdateGameState', gameStateUpdate)
  if(mapStateUpdate.length) global.emitEvent('onNetworkUpdateObjects', mapStateUpdate)
  if(heroStateUpdate.length) global.emitEvent('onNetworkUpdateHeros', heroStateUpdate)
}

function completeNetworkUpdate() {
  if(PAGE.role.isArcadeMode) return

  const objectCompleteUpdate = getDiff('objectComplete', GAME.objects.map(GAME.mod) )
  if(objectCompleteUpdate.length) global.emitEvent('onNetworkUpdateObjects', objectCompleteUpdate)
  const heroCompleteUpdate = getDiff('heroComplete', GAME.heroList.map(GAME.mod) )
  if(heroCompleteUpdate.length) global.emitEvent('onNetworkUpdateHeros', heroCompleteUpdate)
  // if(GAME.gameState.started && GAME.world.tags.storeEntireGameState) {
  //   let storedGameState = localStorage.getItem('gameStates')
  //   localStorage.setItem('gameStates', JSON.stringify({...JSON.parse(storedGameState), [GAME.id]: {...GAME, grid: {...GAME.grid, nodes: null }}}))
  // }
}
