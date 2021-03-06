import tinycolor from 'tinycolor2'
import { updatePixiObject, initPixiObject, initEmitter, updatePixiEmitter } from './objects'
import { updateFilters, updateAlpha } from './utils.js'
import { initPixiApp } from './app'
import gridUtil from '../../utils/grid'
import collisionsUtil from '../../utils/collisions'
import './animations.js';

import * as PIXI from 'pixi.js'
import { GlowFilter, OutlineFilter, GodrayFilter, EmbossFilter, ReflectionFilter, ShockwaveFilter } from 'pixi-filters'
import { Ease, ease } from 'pixi-ease'

import { setColor, getHexColor, getGameObjectStage } from './utils'

global.PIXIMAP = {
  textures: {},
  initialized: false,
  app: null,
  stage: null,
  childrenById: {},
  animations: [],
  emitters: [],
  followingAnimations: {},
  gridNodeSpritesById: {}
}


PIXIMAP.onResetLiveParticle = function(objectId) {
  let object = OBJECTS.getObjectOrHeroById(objectId)
  const stage = getGameObjectStage(object)
  const pixiChild = stage.getChildByName(objectId)
  if(!pixiChild) return
  if(pixiChild.emitter) {
    PIXIMAP.deleteEmitter(pixiChild.emitter)
    delete pixiChild.emitter
  }

  if(pixiChild.poweredUpEmitter) {
    PIXIMAP.deleteEmitter(pixiChild.poweredUpEmitter)
    delete pixiChild.poweredUpEmitter
  }

  updatePixiObject(object)
}

PIXIMAP.initializePixiObjectsFromGame = function() {
  PIXIMAP.shadowStage.removeChildren()
  PIXIMAP.emitterBackgroundStage.removeChildren()
  PIXIMAP.objectStage.removeChildren()
  PIXIMAP.emitterObjectStage.removeChildren()
  PIXIMAP.foregroundStage.removeChildren()
  PIXIMAP.emitterForegroundStage.removeChildren()

  PIXIMAP.childrenById = {}
  GAME.heroList.forEach((hero) => {
    initPixiObject(hero)
  })

  GAME.objects.forEach((object) => {
    initPixiObject(object)
  })
  //
  // if(GAME.objectsById['globalConstructStationaryObstacle']) {
  //   PIXIMAP.deleteObject(GAME.objectsById['globalConstructStationaryObstacle'])
  //   initPixiObject(GAME.objectsById['globalConstructStationaryObstacle'])
  // }
  //
  // if(GAME.objectsById['globalConstructStationaryForeground']) {
  //   PIXIMAP.deleteObject(GAME.objectsById['globalConstructStationaryForeground'])
  //   initPixiObject(GAME.objectsById['globalConstructStationaryForeground'])
  // }
  //
  // if(GAME.objectsById['globalConstructStationaryBackground']) {
  //   PIXIMAP.deleteObject(GAME.objectsById['globalConstructStationaryBackground'])
  //   initPixiObject(GAME.objectsById['globalConstructStationaryBackground'])
  // }

  // const refFilter = new ShockwaveFilter()
  // PIXIMAP.hero.filters = [refFilter]

  PIXIMAP.initialized = true
}

PIXIMAP.onGameIdentified = function(game) {
  // GAME.world.tags.usePixiMap = true

  if(!PIXIMAP.assetsLoaded) {
    // setInterval(PIXIMAP.updateGridSprites, 300)
    initPixiApp(MAP.canvas, (app, textures) => {
      global.local.emit('onPixiMapReady')
    })
  } else if(PIXIMAP.assetsLoaded) {
    // PIXIMAP.initializeDarknessSprites()
    PIXIMAP.initializePixiObjectsFromGame()
  }
}


PIXIMAP.onGameUnload = function() {
  PIXIMAP.onResetObjects()
}

PIXIMAP.onGameLoaded = function() {

  // PIXIMAP.grid = _.cloneDeep(GAME.grid)
}

// PIXIMAP.addTexture = async function(imageData) {
//   var img = document.createElement('img');
//   img.crossOrigin = "anonymous"
//   img.src = imageData.url;
//   img.onload = function() {
//     console.log(imageData.name)
//     resetConstructParts()
//   }
// //'https://cors-anywhere.herokuapp.com/'
//      // console.log('https://cors-anywhere.herokuapp.com/' + imageData.url)
//   PIXIMAP.textures[imageData.name] = await PIXI.Texture.from(img)
// }

PIXIMAP.onFirstPageGameLoaded = function() {
  // setInterval(() => {
  //   // PIXIMAP.initializeDarknessSprites()
  //   // PIXIMAP.resetDarkness()
  //   // PIXIMAP.updateDarknessSprites()
  // }, 200)
}

PIXIMAP.onGameStarted = function() {
  // PIXIMAP.initializeDarknessSprites()
  // PIXIMAP.resetDarkness()
}

PIXIMAP.onDeletedHero = function(hero) {
  PIXIMAP.deleteObject(hero)
}

PIXIMAP.onDeleteObject = function(object) {
  PIXIMAP.deleteObject(object)
}

PIXIMAP.onDeleteSubObject = function(object, subObjectName) {
  const subObject = object.subObjects[subObjectName]
  if(!subObject) return console.log('already removed subobject from map')
  PIXIMAP.deleteObject(subObject)
}

PIXIMAP.deleteObject = function(object, stage) {
  if(!object) console.log('pixi trying to delete but no object', object)
  if(!stage) stage = getGameObjectStage(object)

  if(object.constructParts) {
    object.constructParts.forEach((part) => {
      PIXIMAP.deleteObject(part, stage)
    })
  }

  PIXIMAP.childrenById[object.id] = null
  const pixiChild = stage.getChildByName(object.id)
  if(!pixiChild) return

  if(pixiChild.children && pixiChild.children.length) {
    pixiChild.children.forEach((child) => {
      if(child.children) child.removeChildren()
    })
    pixiChild.removeChildren()
  }
  if(pixiChild.emitter) {
    PIXIMAP.deleteEmitter(pixiChild.emitter)
    delete pixiChild.emitter
  }
  if(pixiChild.trailEmitter) {
    PIXIMAP.deleteEmitter(pixiChild.trailEmitter)
    delete pixiChild.trailEmitter
  }
  if(pixiChild.poweredUpEmitter) {
    PIXIMAP.deleteEmitter(pixiChild.poweredUpEmitter)
    delete pixiChild.poweredUpEmitter
  }
  if(pixiChild.engineTrailEmitter) {
    PIXIMAP.deleteEmitter(pixiChild.engineTrailEmitter)
    delete pixiChild.engineTrailEmitter
  }

  if(pixiChild.light) {
    stage.removeChild(pixiChild.light)
    delete pixiChild.light
  }

  if(pixiChild.darkArealight) {
    stage.removeChild(pixiChild.darkArealight)
    delete pixiChild.darkArealight
  }

  stage.removeChild(pixiChild)
}

PIXIMAP.deleteEmitter = function(emitterToDelete) {
  PIXIMAP.objectStage.emitters = PIXIMAP.objectStage.emitters.filter((emitter) => {
    if(emitterToDelete === emitter) {
      return false
    }
    return true
  })
  emitterToDelete.destroy()
}

PIXIMAP.addObject = function(object) {
  initPixiObject(object)
}

PIXIMAP.onResetObjects = function() {
  PIXIMAP.gridStage.removeChildren()
  PIXIMAP.emitterBackgroundStage.removeChildren()
  PIXIMAP.objectStage.removeChildren()
  PIXIMAP.emitterObjectStage.removeChildren()
  PIXIMAP.foregroundStage.removeChildren()
  PIXIMAP.emitterForegroundStage.removeChildren()
  PIXIMAP.childrenById = {}
  PIXIMAP.objectStage._reInitialize = true
}

PIXIMAP.updatePixiObject = function(object) {
  updatePixiObject(object)
}

const visibleNodes = {}
PIXIMAP.updateGridNodeVisibility = function() {
  const nodes = GAME.grid.nodes
  const textures = PIXIMAP.textures

  const hero = GAME.heros[HERO.id]

  if(false && hero) {
    const { startX, endX, startY, endY } = PIXIMAP.getChunkBoundaries(hero)
    for(var x = startX; x < endX; x++) {
      if(!GAME.grid.nodes[x]) return
      for(var y = startY; y < endY; y++) {
        const gridNode = GAME.grid.nodes[x][y]
        if(!gridNode) return
        const pixiSprite = PIXIMAP.childrenById[gridNode.id]

        if(!pixiSprite) return
        if(pixiSprite) {
          pixiSprite.visible = true
          pixiSprite.renderable = true
          if(!visibleNodes[gridNode.id]) {
            visibleNodes[gridNode.id] = setTimeout(() => {
              pixiSprite.visible = false
              pixiSprite.renderable = false
              visibleNodes[gridNode.id] = false
            }, 5000)
          }
          visibleNodes[gridNode.id] = true
        }
      }
    }
  }
}

PIXIMAP.onUpdateWorld = function(updatedWorld) {
  if(updatedWorld.objectColorTint) {
    resetConstructParts()
  }
}

PIXIMAP.onRender = function(delta, force) {

  if(!MAP._isOutOfDate) {
    // console.log('prevented extra render')
    return
  }

  if(PAGE.loadingGame && !force) return

  PIXIMAP.updateGridNodeVisibility()

  let camera = MAP.camera
  if(CONSTRUCTEDITOR.open) {
    camera = CONSTRUCTEDITOR.camera
  } else if(PATHEDITOR.open){
    camera = PATHEDITOR.camera
  }

  if(PIXIMAP.assetsLoaded) {
    MAP.canvas.style.backgroundColor = ''
    // PIXIMAP.app.renderer.backgroundColor = getHexColor(GAME.world.backgroundColor)
    if(!PIXIMAP.backgroundOverlay.isAnimatingColor) {
      // console.log(GAME.heros[HERO.id].keysDown.shift)
      if(!GAME.gameState.started && GAME.heros[HERO.id].keysDown && (GAME.heros[HERO.id].keysDown['caps lock'] && GAME.heros[HERO.id].keysDown['shift'])) {
        PIXIMAP.backgroundOverlay.tint = 0x000000
      } else {
        PIXIMAP.backgroundOverlay.tint = getHexColor(GAME.world.backgroundColor)
      }
    }

    if(GAME.world.overlayColor) {
      if(GAME.world.overlayColor === '#ffffff') {
        PIXIMAP.cameraOverlay.tint = null
        PIXIMAP.cameraOverlay.alpha = 0
      } else {
        PIXIMAP.cameraOverlay.tint = getHexColor(GAME.world.overlayColor)
        PIXIMAP.cameraOverlay.alpha = .4
      }
    } else {
      PIXIMAP.cameraOverlay.tint = null
      PIXIMAP.cameraOverlay.alpha = 0
    }

    if(PIXIMAP.objectStage._reInitialize) {
      PIXIMAP.objectStage._reInitialize = false
      PIXIMAP.initializePixiObjectsFromGame()
    } else {
      let newCameraLock = null
      GAME.objects.forEach((object) => {
        if(!PIXIMAP.makeInvisibleIfRemoved(object)) {
          if(global.popoverOpen[object.id]) {
            MAP.closePopover(object.id)
          }
          return
        }

        if(object.tags.cameraLock && collisionsUtil.checkObject(object, GAME.heros[HERO.id])) {
          newCameraLock = object
        }

        if(PAGE.resizingMap) {
          updatePixiObject(object)
        }

        const pixiChild = PIXIMAP.childrenById[object.id]
        if(pixiChild) {
          updateFilters(pixiChild, object)
        }
      })
      const seeThrough = GAME.objectsByTag.seeThroughOnHeroCollide
      if(seeThrough) seeThrough.forEach((o) => {
        const pixiChild = PIXIMAP.childrenById[o.id]
        if(!pixiChild) return
        updateAlpha(pixiChild, o)
      })

      if(newCameraLock) {
        MAP.camera.setLimitRect(newCameraLock)
      } else if(GAME.world.lockCamera){
        MAP.camera.setLimit(GAME.world.lockCamera.limitX, GAME.world.lockCamera.limitY, GAME.world.lockCamera.centerX, GAME.world.lockCamera.centerY)
      } else {
        MAP.camera.clearLimit()
      }

      GAME.heroList.forEach((hero) => {
        if(!PIXIMAP.makeInvisibleIfRemoved(hero)) return
        updatePixiObject(hero, PIXIMAP.stage)
      })
    }

    const hero = GAME.heros[HERO.id]
    // PIXIMAP.objectStage.rotation = hero.cameraRotation

    if(PIXIMAP.gridStage) {
      // PIXIMAP.gridStage.rotation = hero.cameraRotation
      PIXIMAP.gridStage.pivot.x = camera.x
      PIXIMAP.gridStage.pivot.y = camera.y
      Object.keys(visibleNodes).forEach((id) => {
        if(visibleNodes[id]) {
          // const pixiChild = PIXIMAP.childrenById[id]
          // console.log(pixiChild)
          // if(!pixiChild) return
          // pixiChild.pivot.x = camera.x
          // pixiChild.pivot.y = camera.y
        }
      })
    }

    PIXIMAP.objectStage.pivot.x = camera.x
    PIXIMAP.objectStage.pivot.y = camera.y
    if(PIXIMAP.shadowStage) {
      // PIXIMAP.shadowStage.rotation = hero.cameraRotation
      PIXIMAP.shadowStage.pivot.x = camera.x
      PIXIMAP.shadowStage.pivot.y = camera.y
    }
    if(PIXIMAP.foregroundStage) {
      // PIXIMAP.foregroundStage.rotation = hero.cameraRotation
      PIXIMAP.foregroundStage.pivot.x = camera.x
      PIXIMAP.foregroundStage.pivot.y = camera.y
    }
    if(PIXIMAP.backgroundStage) {
      PIXIMAP.backgroundOverlay.x = GAME.grid.startX * camera.multiplier
      PIXIMAP.backgroundOverlay.y = GAME.grid.startY * camera.multiplier

      PIXIMAP.backgroundStage.pivot.x = camera.x
      PIXIMAP.backgroundStage.pivot.y = camera.y

      let width = GAME.grid.width * GAME.grid.nodeSize
      let height = GAME.grid.height * GAME.grid.nodeSize
      PIXIMAP.backgroundOverlay.transform.scale.x = (width/PIXIMAP.backgroundOverlay.texture._frame.width) * camera.multiplier
      PIXIMAP.backgroundOverlay.transform.scale.y = (height/PIXIMAP.backgroundOverlay.texture._frame.width)  * camera.multiplier
    }
    if(PIXIMAP.emitterBackgroundStage) {
      PIXIMAP.emitterBackgroundStage.pivot.x = camera.x
      PIXIMAP.emitterBackgroundStage.pivot.y = camera.y
    }
    if(PIXIMAP.emitterForegroundStage) {
      PIXIMAP.emitterForegroundStage.pivot.x = camera.x
      PIXIMAP.emitterForegroundStage.pivot.y = camera.y
    }
    if(PIXIMAP.emitterObjectStage) {
      PIXIMAP.emitterObjectStage.pivot.x = camera.x
      PIXIMAP.emitterObjectStage.pivot.y = camera.y
    }

    // PIXIMAP.app.ticker.update()
    // PIXIMAP.renderer.render(PIXIMAP.stage)
    // const gameEligibleForLoading = (GAME.grid.width > 80 || GAME.objects.length > 300)
    // const loadingState = (PAGE.resizingMap || PAGE.startingAndStoppingGame)
    // const pixiMapInvisible = gameEligibleForLoading && loadingState
    // if(pixiMapInvisible) {
    //   PIXIMAP.stage.visible = false
    // } else PIXIMAP.stage.visible = true

    MAP._isOutOfDate = false

    // PIXIMAP.objectStage.children.forEach((child) => {
    //   if(child._lastRenderId !== PIXIMAP.renderId) {
    //     console.log(child._lastRenderId, PIXIMAP.renderId)
    //     PIXIMAP.objectStage.removeChild(child)
    //   }
    // })

    PIXIMAP.renderId += .0001

    // PIXIMAP.renderUpdateGridSprites()

    if(hero.zoomMultiplierTarget || hero.animationZoomMultiplier) {
      PAGE.resizingMap = true
    } else PAGE.resizingMap = false
  }
}

PIXIMAP.resetDarkness = function() {
  if(!PIXIMAP.grid) return

  const nodes = GAME.grid.nodes

  for(var x = 0; x < nodes.length; x++) {
    let row = nodes[x]
    for(var y = 0; y < row.length; y++) {
      let node = row[y]
      if(node.light > 1) {
        // if(Date.now() < node._illumatedTime + 3000) continue
      }
      node.light = 0
      node._illumatedTime = null
    }
  }
}

PIXIMAP.updateDarknessSprites = function() {
  if(!PIXIMAP.grid || !GAME.world.tags.blockLighting) return

  const nodes = GAME.grid.nodes
  // if(!GAME.gameState.started) return

  let lights = []
  if(GAME.objectsByTag && GAME.objectsByTag['light']) {
    lights =  GAME.objectsByTag['light']
  }
  const lightObjects = [...lights, ...GAME.heroList]
  lightObjects.forEach((object) => {
    if(object.mod().removed) return
    if(object.tags && object.tags.potential) return

    const { gridX, gridY } = gridUtil.convertToGridXY({x: object.x + PIXIMAP.grid.nodeSize/2, y: object.y + PIXIMAP.grid.nodeSize/2})

    const startGridX = gridX - 5
    const startGridY = gridY - 5
    const endGridX = gridX + 5
    const endGridY = gridY + 5

    for(let x = startGridX; x < endGridX +1; x++) {
      for(let y = startGridY; y < endGridY + 1; y++) {
        let nodeX = nodes[x]
        if(!nodeX) continue
        let node = nodes[x][y]
        if(!node) continue

        // if(x - gridX >= 1 || x - gridX <= -1 ) {
        // }
        // || x - gridX == 6 || x - gridX == -6 || x - gridX == 7 || x - gridX == -7
        if(x - gridX == 5 || x - gridX == -5) {
          if(!node.light) node.light = 1
        // || y - gridY == 6 || y - gridY == -6 || y - gridY == 7 || y - gridY == -7
        } else if(y - gridY == 5 || y - gridY == -5) {
          if(!node.light) node.light = 1
        } else {
          node.light = 2
          node._illumatedTime = Date.now()
        }
        // if(x - gridX === 0 || x - gridX == 1 || x - gridX == -1) {
        //   node.light = 3
        // }


      }
    }
  })

  let ambientLight = GAME.gameState.ambientLight
  if(typeof ambientLight !== 'number') ambientLight = 1

  const hero = GAME.heros[HERO.id]

  if(hero) {
    const { startX, endX, startY, endY } = PIXIMAP.getShadowBoundaries(hero)
    for(var x = startX; x < endX; x++) {
      let row = nodes[x]
      for(var y = startY; y < endY; y++) {
        let node = row[y]
        if(!node.darknessSprite) {
          continue
        }

        // if(GAME.gameState.ambientLight > 1) {
        //   node.darknessSprite.alpha = ambientLight - 1
        //   node.darknessSprite.tint = getHexColor("orange")
        // } else {
          if(node.light == 1) {
            node.darknessSprite.alpha = .90 - ambientLight
          } else if(node.light == 2) {
            node.darknessSprite.alpha = .60 - ambientLight
          } else if(node.light == 3) {
            node.darknessSprite.alpha = .30 - ambientLight
          } else if(node.light >= 4) {
            node.darknessSprite.alpha = 0 - ambientLight
          } else {
            node.darknessSprite.alpha = 1 - ambientLight
          }
        // }
      }
    }
  }
}

PIXIMAP.initializeDarknessSprites = function() {
  if(!GAME.world.tags.blockLighting) return

  PIXIMAP.shadowStage.removeChildren()
  // PIXIMAP.gridStage.removeChildren()
  const nodes = GAME.grid.nodes
  const textures = PIXIMAP.textures

  const hero = GAME.heros[HERO.id]

  if(hero) {
    const { startX, endX, startY, endY } = PIXIMAP.getShadowBoundaries(hero)
    for(var x = startX; x < endX; x++) {
      for(var y = startY; y < endY; y++) {
        const gridNode = GAME.grid.nodes[x][y]

        const darknessSprite = new PIXI.Sprite(textures['solidcolorsprite'])
        PIXIMAP.shadowStage.addChild(darknessSprite)
        darknessSprite.x = (gridNode.x) * MAP.camera.multiplier
        darknessSprite.y = (gridNode.y) * MAP.camera.multiplier
        darknessSprite.transform.scale.x = (GAME.grid.nodeSize/textures['solidcolorsprite']._frame.width) * MAP.camera.multiplier
        darknessSprite.transform.scale.y = (GAME.grid.nodeSize/textures['solidcolorsprite']._frame.height) * MAP.camera.multiplier
        darknessSprite.tint = getHexColor("black")
        gridNode.darknessSprite = darknessSprite
        gridNode.darknessSprite.alpha = 0
      }
    }
  }
}

PIXIMAP.initBackgroundSprite = function(node, nodeSprite) {
  if(!nodeSprite) {
    return
  }
  const textures = PIXIMAP.textures
  const sprite = new PIXI.Sprite(textures[nodeSprite])
  // sprite.transform.scale.x = (GAME.grid.nodeSize/sprite.texture._frame.width) * MAP.camera.multiplier
  // sprite.transform.scale.y = (GAME.grid.nodeSize/sprite.texture._frame.width) * MAP.camera.multiplier
  const backgroundSprite = PIXIMAP.gridStage.addChild(sprite)
  // const key = 'x:' + node.gridX + ':y' + node.gridY
  backgroundSprite.name = node.id
  PIXIMAP.childrenById[node.id] = backgroundSprite
  // console.log('just reset')
  // backgroundSprite.visible = false
  // backgroundSprite.renderable = false
  return backgroundSprite
}

PIXIMAP.onUpdateGrid = function() {
  // PIXIMAP.grid = _.cloneDeep(GAME.grid)


  if(GAME.world.tags.blockLighting && !global.resettingDarkness) {
    setTimeout(() => {
      if(PIXIMAP.initialized) {
        // PIXIMAP.initializeDarknessSprites()
        // PIXIMAP.resetDarkness()
        // PIXIMAP.updateDarknessSprites()
      }
      global.resettingDarkness = false
    }, 100)
    global.resettingDarkness = true
  }
  PIXIMAP.updateGridSprites()
}

PIXIMAP.onUpdateGridNode = function(x, y, update) {
  // const nodes = GAME.grid.nodes
  // if(nodes[x] && nodes[x][y]) {
  //   Object.assign(nodes[x][y], update)
  // }
  PIXIMAP.updateGridSprites()
}

PIXIMAP.setTerrainColor = function(nodeData, backgroundSprite) {
  if(nodeData.elevationType) {
    // const prop = nodeData.elevation.toFixed(2)

    // if(nodeData.elevationBitmask != 15) {
    //   backgroundSprite.tint = 0x333
    // } else {
      // console.log(terrainType)
      backgroundSprite.tint = global.elevationColors[nodeData.elevationType]
    // }
  }
}

PIXIMAP.updateGridSprites = function() {
  // if(!PIXIMAP.grid) return

  const nodes = GAME.grid.nodes
  const hero = GAME.heros[HERO.id]
  const textures = PIXIMAP.textures

  // const { gridX, gridY } = gridUtil.convertToGridXY({x: hero.x + PIXIMAP.grid.nodeSize/2, y: hero.y + PIXIMAP.grid.nodeSize/2})

  if(!nodes) return

  for(var x = 0; x < nodes.length; x++) {
    for(var y = 0; y < nodes[x].length; y++) {
      const nodeData = GAME.grid.nodes[x][y]

      let backgroundSprite = PIXIMAP.childrenById[nodeData.id]
      if(nodeData && nodeData.elevationType) {
        console.log(nodeData.elevationType)
        nodeData.sprite = 'solidcolorsprite'
      }

      // add
      if(nodeData.sprite && !backgroundSprite) {
        backgroundSprite = PIXIMAP.initBackgroundSprite(nodeData, nodeData.sprite)
      }

      // delete
      if((nodeData.sprite === 'none' || !nodeData.sprite) && backgroundSprite) {
        PIXIMAP.gridStage.removeChild(backgroundSprite)
      }

      if(backgroundSprite) {
        if(nodeData.disabled) {
          backgroundSprite.visible = false
        } else {
          backgroundSprite.visible = true
        }

        if(nodeData) {
          PIXIMAP.setTerrainColor(nodeData, backgroundSprite)
        }

        let camera = MAP.camera
        if(CONSTRUCTEDITOR.open) {
          camera = CONSTRUCTEDITOR.camera
        } else if(PATHEDITOR.open) {
          camera = PATHEDITOR.camera
        }

        backgroundSprite.x = nodeData.x * camera.multiplier
        backgroundSprite.y = nodeData.y * camera.multiplier
        backgroundSprite.transform.scale.x = (GAME.grid.nodeSize/backgroundSprite.texture._frame.width) * camera.multiplier
        backgroundSprite.transform.scale.y = (GAME.grid.nodeSize/backgroundSprite.texture._frame.width) * camera.multiplier
      }

      // change
      if(backgroundSprite) {
        if(backgroundSprite.texture.id !== nodeData.sprite) {
          backgroundSprite.texture = textures[nodeData.sprite]
        }
        // setColor(backgroundSprite, pixiNode)
      }


      // if(node.darknessSprite) {
      //   if(Math.abs(gridX - x) > 32) {
      //     node.darknessSprite.visible = false
      //     if(node.backgroundSprite) node.backgroundSprite.visible = false
      //   } else if(Math.abs(gridY - y) > 20) {
      //     node.darknessSprite.visible = false
      //     if(node.backgroundSprite) node.backgroundSprite.visible = false
      //   } else {
      //     node.darknessSprite.visible = true
      //     if(node.backgroundSprite) node.backgroundSprite.visible = true
      //   }
      // }
    }
  }
}

PIXIMAP.updateConstructEditor = function() {
  PIXIMAP.initializePixiObjectsFromGame()
  resetConstructParts()
  PIXIMAP.updateConstructEditorNodes()
}
PIXIMAP.updateConstructEditorNodes = function() {
  if(CONSTRUCTEDITOR.open) {
    let nodes = CONSTRUCTEDITOR.grid.nodes

    nodes.forEach((row) => {
      row.forEach((node) => {
        if(node.data.filled) {
          const fakeObject = { tags: CONSTRUCTEDITOR.object.tags, defaultSprite: node.data.defaultSprite || 'solidcolorsprite', color: node.data.color, ...node}
          fakeObject.currentEditingConstruct = true
          initPixiObject(fakeObject)
          updatePixiObject(fakeObject)
        } else if(PIXIMAP.childrenById[node.id]) {
          PIXIMAP.childrenById[node.id].visible = false
        }
      })
    })
  }
}

// PIXIMAP.fakeObjectAnimations = []
PIXIMAP.onFakeObjectAnimation = function (type, object) {
  if(type === 'groundDisturbanceRight') {
    const landEmitter = initEmitter(object, type, { matchObjectColor: true, useUpdateOwnerPos: false }, { hasNoOwner: true })
    setTimeout(() => {
      PIXIMAP.deleteEmitter(landEmitter)
    }, 10000)
  }
  if(type === 'groundDisturbanceLeft') {
    const landEmitter = initEmitter(object, type, { matchObjectColor: true, useUpdateOwnerPos: false }, { hasNoOwner: true })
    setTimeout(() => {
      PIXIMAP.deleteEmitter(landEmitter)
    }, 10000)
  }
  if(type === 'groundDisturbanceRight2') {
    const landEmitter = initEmitter(object, type, { matchObjectColor: true, useUpdateOwnerPos: false }, { hasNoOwner: true })
    setTimeout(() => {
      PIXIMAP.deleteEmitter(landEmitter)
    }, 1000)
  }
  if(type === 'groundDisturbanceLeft2') {
    const landEmitter = initEmitter(object, type, { matchObjectColor: true, useUpdateOwnerPos: false }, { hasNoOwner: true })
    setTimeout(() => {
      PIXIMAP.deleteEmitter(landEmitter)
    }, 1000)
  }
}

PIXIMAP.onUpdateLibrary = function(updatedLibrary) {
  for(let key in updatedLibrary) {
    const value= updatedLibrary[key]

    if(key === 'images') {
      let requireLoad = false
      Object.keys(value).forEach((property) => {
        const image = value[property]
        if(!image) return
        if(image.texture) {
          if(!PIXIMAP.textures[image.name]) {
            requireLoad = true
          }
        }
      })
      if(requireLoad) {
        PIXIMAP.loadImageAssets(() => {
          resetConstructParts()
        })
      }
    }
  }
}

PIXIMAP.onObjectAnimation = function(type, objectId, options = {}) {
  let object = OBJECTS.getObjectOrHeroById(objectId)

  if(!options) options = {}

  let pixiChild = PIXIMAP.childrenById[objectId]
  if(!pixiChild) return

  if(type === 'flash' && !pixiChild.animationFlashColor) {
    if(options.color) {
      pixiChild.animationColor = options.color
    } else {
      pixiChild.animationColor = 'white'
    }
    setTimeout(() => {
      delete pixiChild.animationColor
    }, options.duration || 50)

    return
  }

  if(type === 'explode') {
    let useOwnerSprite = false
    if(object.defaultSprite && object.defaultSprite != 'solidcolorsprite') useOwnerSprite = true

    let options = { persistAfterRemoved: true, matchObjectColor: true, useUpdateOwnerPos: true, useOwnerSprite }
    if(object.emitterTypeExplosion) {
      options = global.particleEmitterLibrary.addGameLibrary()[object.emitterTypeExplosion]
    }

    pixiChild.explodeEmitter = initEmitter(object, object.emitterTypeExplosion || 'explode', options, { hasNoOwner: true })
    setTimeout(() => {
      PIXIMAP.deleteEmitter(pixiChild.explodeEmitter)
      delete pixiChild.explodeEmitter
    }, 10000)

    return
  }


    if(type === 'isolatedExplosion') {
      let useOwnerSprite = false
      if(object.defaultSprite && object.defaultSprite != 'solidcolorsprite') useOwnerSprite = true

      let options = { persistAfterRemoved: true, matchObjectColor: true, useUpdateOwnerPos: true, useOwnerSprite }
      if(object.emitterTypeExplosion) {
        options = global.particleEmitterLibrary.addGameLibrary()[object.emitterTypeExplosion]
      }

      pixiChild.explodeEmitter = initEmitter(object, 'isolatedExplosion', options, { hasNoOwner: true })
      setTimeout(() => {
        PIXIMAP.deleteEmitter(pixiChild.explodeEmitter)
        delete pixiChild.explodeEmitter
      }, 10000)

      return
    }

  if(type === 'spinOff') {
    let useOwnerSprite = false
    if(object.defaultSprite && object.defaultSprite != 'solidcolorsprite') useOwnerSprite = true
    const explosionEmitter = initEmitter(object, 'spinOff', { persistAfterRemoved: true, scaleToGameObject: true, matchObjectColor: true, useUpdateOwnerPos: true, useOwnerSprite }, { hasNoOwner: true })
    setTimeout(() => {
      PIXIMAP.deleteEmitter(explosionEmitter)
    }, 1000)

    return
  }

  if(type == 'score') {
    let useOwnerSprite = false
    if(object.defaultSprite && object.defaultSprite != 'solidcolorsprite') useOwnerSprite = true

    let options = { persistAfterRemoved: true, matchObjectColor: true, useUpdateOwnerPos: true, useOwnerSprite }
    if(object.emitterTypeScore) {
      options = global.particleEmitterLibrary.addGameLibrary()[object.emitterTypeScore]
    }

    pixiChild.scoreEmitter = initEmitter(object, object.emitterTypeScore || 'editObject', options, { hasNoOwner: true })
    setTimeout(() => {
      PIXIMAP.deleteEmitter(pixiChild.scoreEmitter)
      delete pixiChild.scoreEmitter
    }, 10000)

    return
  }

  // fail safe animate the rest
  if(options.animationType === 'particle') {
    const customEmitter = initEmitter(object, options.libraryAnimationName, options, { hasNoOwner: true })
    setTimeout(() => {
      PIXIMAP.deleteEmitter(customEmitter)
    }, 10000)

    return
  }

  if(type) {
    options = global.particleEmitterLibrary.addGameLibrary()[type]
    const customEmitter = initEmitter(object,type, options, { hasNoOwner: true })
    setTimeout(() => {
      PIXIMAP.deleteEmitter(customEmitter)
    }, 10000)
  }

  // -> start pulse, stop pulse here
  //shake
  //spin
  //pulseAlpha
  //pulseDarken
  //pulseLighten

  // -> startAnimation here
  // fadeIn





  // animationFadeIn: object.animationFadeIn,
  // animationFadeOut: object.animationFadeOut,

  // animationExplode: object.animationExplode,
  // animationFireworks
  // animationShake: object.animationShake,
  //
  // animationPulseSize: object.animationPulseSize,
  // animationPulseColor: object.animationPulseColor,
  //
  // animationGlow: object.animationGlow,
  // animationShine: object.animationShine,
  //
  // animationFadeCycle: object.animationFadeCycle,
  //
  // Fade to Color
}

PIXIMAP.onConstructEditorClose = function() {
  setTimeout(() => {
    resetConstructParts()
  },  50)
}

PIXIMAP.onConstructEditorStart = function() {
  MAP.closeAllPopovers()
  resetConstructParts()
  PIXIMAP.deleteObject(OBJECTS.getObjectOrHeroById(CONSTRUCTEDITOR.objectId))
}
PIXIMAP.onPathEditorClose = function() {
  setTimeout(() => {
    resetConstructParts()
  },  50)
}

PIXIMAP.onPathEditorStart = function() {
  MAP.closeAllPopovers()
  resetConstructParts()
}

PIXIMAP.loadImageAssets = function(cb) {
  const loader = new PIXI.Loader()
  loader.pre((resource, next) => {
    // if (window.device && (device.platform === 'iOS' || device.platform === 'Android')) {
        resource.crossOrigin = 'anonymous';
        // resource.loadType = PIXI.loaders.Resource.LOAD_TYPE.XHR;
    // }
    next();
});
  Object.keys(GAME.library.images).reduce((prev, next) => {
    const imageData = GAME.library.images[next]
    if(!PIXIMAP.textures[imageData.name]) return prev.add(imageData.url)
    else return prev
  }, loader).load((loaded) => {
    Object.keys(GAME.library.images).forEach((name) => {
      const imageData = GAME.library.images[name]
      if(!PIXIMAP.textures[imageData.name]) {
        PIXIMAP.textures[name] = PIXI.Texture.from(imageData.url)
        PIXIMAP.textures[name].id = name
        // console.log(PIXI.Texture.from(imageData.url))
        global.tileMap[name] = PIXI.Texture.from(imageData.url).frame
      }
    })
    if(cb) cb()
  })
}

PIXIMAP.cleanUpMapAndAskPixiToSendGameReady = function() {
  setTimeout(() => {
    PIXIMAP.loadImageAssets(() => {
      MAP.camera.set(GAME.heros[HERO.id])
      // PIXIMAP.initializeDarknessSprites()
      PIXIMAP.initializePixiObjectsFromGame()
      PIXIMAP.updateGridSprites()
      resetConstructParts()
      PIXIMAP.onRender(0, true)
      global.local.emit('onGameReady')
    })
  }, 100)
}

function resetConstructParts() {
  // global.terrainObjects.forEach((gameObject) => {
  //   gameObject.constructParts.forEach((part) => {
  //     const partObject = PIXIMAP.convertToPartObject(gameObject, part)
  //     updatePixiObject(partObject)
  //   })
  //
  //   return
  // })
  PIXIMAP.updateGridSprites()
  GAME.objects.forEach((gameObject) => {
    /////////////////////
    /////////////////////
    // CONSTRUCT PARTS
    if(gameObject.constructParts) {
      gameObject.constructParts.forEach((part) => {
        const partObject = PIXIMAP.convertToPartObject(gameObject, part)
        updatePixiObject(partObject)
      })

      return
    }

    updatePixiObject(gameObject)
  })
}
PIXIMAP.resetConstructParts = resetConstructParts

PIXIMAP.onConstellationAnimationStart = function(hero) {
  if(hero.id !== HERO.id) return
  MAP.hideAllPopovers()
  PIXIMAP.backgroundOverlay.isAnimatingColor = true
  PIXIMAP.shadowStage.visible = false
  const example = ease.add(PIXIMAP.backgroundOverlay, { blend: 0x000000 }, { duration: 1000, ease: 'linear' })
  example.once('complete', () => PIXIMAP.backgroundOverlay.tint = 0x000000)
}

PIXIMAP.onConstellationAnimationEnd = function(hero) {
  if(hero.id !== HERO.id) return
  MAP.showAllPopovers()
  const example = ease.add(PIXIMAP.backgroundOverlay, { blend: getHexColor(GAME.world.backgroundColor) }, { duration: 1000, ease: 'linear' })
  example.once('complete', () => {
    PIXIMAP.backgroundOverlay.tint = getHexColor(GAME.world.backgroundColor)
    PIXIMAP.backgroundOverlay.isAnimatingColor = false
    setTimeout(() => {
      PIXIMAP.shadowStage.visible = true
    }, 1500)
  })
}

PIXIMAP.downloadAsImage = function() {
  download_sprite_as_png(PIXIMAP.app.renderer, PIXIMAP.app.stage, 'mapimage.png')
}

function download_sprite_as_png(renderer, sprite, fileName) {
  renderer.render(sprite);
  const data = renderer.view.toDataURL('image/png', 1)
  console.log(data)
  var a = document.createElement("a"); //Create <a>
  a.href = data; //Image Base64 Goes here
  a.download = fileName; //File name Here
  a.click(); //Downloaded file
  a.remove();
}

PIXIMAP.convertCanvasImageToFile = function(cb) {
  const renderer = PIXIMAP.app.renderer
  const sprite = PIXIMAP.app.stage
  const name = `piximapimage-${global.uniqueID()}.png`

  renderer.render(sprite);
  const dataURI = renderer.view.toDataURL('image/png', 1)

  function urltoFile(url, filename, mimeType){
    return (fetch(url)
        .then(function(res){return res.arrayBuffer();})
        .then(function(buf){return new File([buf], filename,{type:mimeType});})
    );
  }

  urltoFile(dataURI, name, 'image/png').then(function(file){ cb(file) });
}

PIXIMAP.snapCamera = function(name) {
  const prevTint = PIXIMAP.cameraOverlay.tint
  PIXIMAP.cameraOverlay.tint = 0xFFFFFF
  let prevAlpha = PIXIMAP.cameraOverlay.alpha
  PIXIMAP.cameraOverlay.alpha = 1
  setTimeout(() => {
    PIXIMAP.cameraOverlay.tint = prevTint
    PIXIMAP.cameraOverlay.alpha = prevAlpha
    PIXIMAP.convertCanvasImageToFile((file) => {
      PAGE.uploadToAws(file, name)
    })
  }, 60)

}


PIXIMAP.getChunkBoundaries = function(hero) {
  const { gridX, gridY, gridWidth, gridHeight } = HERO.getViewBoundaries(hero)
  const padding = 10
  let startX = gridX - padding
  let endX = gridX + gridWidth + padding
  let startY = gridY - padding
  let endY = gridY + gridHeight + padding
  if(startX < 0) startX = 0
  if(endX > GAME.grid.width) endX = GAME.grid.width
  if(startY < 0) startY = 0
  if(endY > GAME.grid.height) endY = GAME.grid.height

  return {
    startX,
    startY,
    endX,
    endY
  }
}

PIXIMAP.getShadowBoundaries = function(hero) {
  const { gridX, gridY, gridWidth, gridHeight } = HERO.getViewBoundaries(hero)
  const padding = GAME.world.chunkRenderPadding || 6
  let startX = gridX - padding
  let endX = gridX + gridWidth + padding
  let startY = gridY - padding
  let endY = gridY + gridHeight + padding
  if(startX < 0) startX = 0
  if(endX > GAME.grid.width) endX = GAME.grid.width
  if(startY < 0) startY = 0
  if(endY > GAME.grid.height) endY = GAME.grid.height

  return {
    startX,
    startY,
    endX,
    endY
  }
}

PIXIMAP.convertToPartObject = function(gameObject, part) {
  let sprite = part.sprite || 'solidcolorsprite'
  let color = part.color
  if(!sprite && !color) color = GAME.world.defaultObjectColor
  let defaultSprite = part.defaultSprite || gameObject.defaultSprite || 'solidcolorsprite'
  let removed = gameObject.mod().removed
  if(gameObject.mod().tags.seperateParts) {
    removed = part.removed
  }
  const partObject = {tags: {...gameObject.tags},  ...part, removed, part: true, color: color, sprite: sprite, defaultSprite: defaultSprite}
  if(gameObject.id === CONSTRUCTEDITOR.objectId) partObject.tags.invisible = true

  return partObject
}

PIXIMAP.makeInvisibleIfRemoved = function(object) {
  if(object.mod().removed && PIXIMAP.childrenById[object.id]) {
    if(object.tags.showXWhenRemoved || object.tags.showGraveWhenRemoved || (object.sprites && object.sprites.removed)) {
      PIXIMAP.childrenById[object.id].filters = []
    } else {
      PIXIMAP.childrenById[object.id].visible = false
    }
    if(object.subObjects) {
      Object.keys(object.subObjects).forEach((subObjectName) => {
        const so = object.subObjects[subObjectName]
        if(PIXIMAP.childrenById[so.id]) PIXIMAP.childrenById[so.id].visible = false
      })
    }
    if(PIXIMAP.childrenById[object.id].emitter) {
      updatePixiEmitter(PIXIMAP.childrenById[object.id].emitter, object)
    }
    if(PIXIMAP.childrenById[object.id].light) {
      PIXIMAP.childrenById[object.id].light.visible = false
    }
    if(PIXIMAP.childrenById[object.id].darkArealight) {
      PIXIMAP.childrenById[object.id].darkArealight.visible = false
    }
    return false
  }
  if(object.constructParts && object.mod().removed) {
    object.constructParts.forEach((part) => {
      if(PIXIMAP.childrenById[part.id]) PIXIMAP.childrenById[part.id].visible = false
    })
    return false
  }
  if(object.subObjects) {
    Object.keys(object.subObjects).forEach((subObjectName) => {
      const so = object.subObjects[subObjectName]
      if(object.mod().removed) {
        if(PIXIMAP.childrenById[so.id]) PIXIMAP.childrenById[subObject.id].visible = false
        return
      }
    })
  }

  return true
}
