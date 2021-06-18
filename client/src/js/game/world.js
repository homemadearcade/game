import gridUtil from '../utils/grid.js'
import pathfinding from '../utils/pathfinding.js'

function setDefault() {
  global.defaultWorld = {
    id: 'world-' + global.uniqueID(),
  	lockCamera: null,
  	gameBoundaries: null,
    proceduralBoundaries: null,
    worldSpawnPointX: null,
    worldSpawnPointY: null,
    defaultObjectColor: '#525252',
    tags: {
      blockLighting: false,
      hasGameLog: false,
      allowHeroChat: false,
      preventHeroGridBypass: false,
      calculateMovingObstaclePaths: false,
      noCamping: false,
      // targetOnSight: false,
      // isAsymmetric: false,
      shouldRestoreHero: false,
      storeEntireGameState: false,
      overrideCustomGameCode: false,
      // shadows: false,
      allMovingObjectsHaveGravityY: false,
      gameBoundaryBottomDestroyHero: false,
      gameBoundaryDestroyHero: false,
      gameBoundaryDestroyObjects: false,
      predictNonHostPosition: false,
      interpolateHeroPositions: false,
      // randomFadeAllObjectsIn,
      // fadeAllObjectsIn,
      // hostHeroPausedSetsGamePaused
    },
    gravityVelocityY: 1000,
    gravityVelocityX: 1000,
    chunkGamePadding: 6,
    chunkRenderPadding: 6,
    sequences: {},
    animations: {},
    backgroundColor: '#000000',
    overlayColor: '#ffffff',
    objectColorTint: '#ffffff'
  }

  global.local.on('onGridLoaded', () => {
    global.defaultWorld.spawnPointX = GAME.grid.startX + (GAME.grid.width * GAME.grid.nodeSize)/2
    global.defaultWorld.spawnPointY = GAME.grid.startY + (GAME.grid.height * GAME.grid.nodeSize)/2
  })
}

export default {
  setDefault
}
