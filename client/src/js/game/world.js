import gridUtil from '../utils/grid.js'
import pathfinding from '../utils/pathfinding.js'

function setDefault() {
  window.defaultWorld = {
    id: 'world-' + window.uniqueID(),
  	lockCamera: null,
  	gameBoundaries: null,
    proceduralBoundaries: null,
    worldSpawnPointX: null,
    worldSpawnPointY: null,
    defaultObjectColor: '#525252',
    tags: {
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
      gameBoundaryDestroyObjects: true,
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
    animations: {}
  }

  window.local.on('onGridLoaded', () => {
    window.defaultWorld.spawnPointX = GAME.grid.startX + (GAME.grid.width * GAME.grid.nodeSize)/2
    window.defaultWorld.spawnPointY = GAME.grid.startY + (GAME.grid.height * GAME.grid.nodeSize)/2
  })
}

export default {
  setDefault
}
