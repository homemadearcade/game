import tinycolor from 'tinycolor2'
import { updatePixiObject, initPixiObject } from './objects'
import { initPixiApp } from './app'
import gridUtil from '../../utils/grid'
import * as PIXI from 'pixi.js'

window.PIXIMAP = {
  textures: {},
  initialized: false,
  app: null,
  stage: null,
}

PIXIMAP.initializePixiObjectsFromGame = function() {
  GAME.objects.forEach((object) => {
    initPixiObject(object)
  })
  GAME.heroList.forEach((hero) => {
    initPixiObject(hero)
  })

  PIXIMAP.initialized = true
}

PIXIMAP.onAssetsLoaded = function() {
  PIXIMAP.initializePixiObjectsFromGame()
}

PIXIMAP.onGameLoaded = function() {
  // GAME.world.tags.usePixiMap = true

  if(!PIXIMAP.assetsLoaded) {
    setInterval(PIXIMAP.resetDarknessSprites, 200)
    setInterval(PIXIMAP.updateDarknessSprites, 200)
    initPixiApp(MAP.canvas, (app, textures) => {
      window.local.emit('onAssetsLoaded')
      PIXIMAP.initializeDarknessSprites()
    })
  } else if(PIXIMAP.assetsLoaded) {
    PIXIMAP.shadowStage.removeChildren()
    PIXIMAP.objectStage.removeChildren()
    PIXIMAP.initializeDarknessSprites()
    PIXIMAP.initializePixiObjectsFromGame()
  }
}

PIXIMAP.onGameStart = function() {
  PIXIMAP.initializeDarknessSprites()
  PIXIMAP.resetDarknessSprites()
}

PIXIMAP.onDeleteHero = function(object) {
  PIXIMAP.deleteObject(object)
}

PIXIMAP.onDeleteObject = function(object) {
  PIXIMAP.deleteObject(object)
}

PIXIMAP.onDeleteSubObject = function(object, subObjectName) {
  const subObject = object.subObjects[subObjectName]
  PIXIMAP.deleteObject(subObject)
}

PIXIMAP.deleteObject = function(object) {
  const stage = PIXIMAP.objectStage

  const pixiChild = stage.getChildByName(object.id)
  if(!pixiChild) return
  if(pixiChild.children && pixiChild.children.length) {
    pixiChild.children.forEach((child) => {
      if(child.children) child.removeChildren()
    })
    pixiChild.removeChildren()
  }
  if(pixiChild.emitter) {
    PIXIMAP.objectStage.emitters = PIXIMAP.objectStage.emitters.filter((emitter) => {
      if(pixiChild.emitter === emitter) {
        console.log("FPIMD EMITTER")
        return false
      }
      return true
    })
    pixiChild.emitter.destroy()
    delete pixiChild.emitter
  }
  stage.removeChild(pixiChild)
}

PIXIMAP.addObject = function(object) {
  initPixiObject(object)
}

PIXIMAP.onRender = function() {
  let camera = MAP.camera
  if(CONSTRUCTEDITOR.open) {
    camera = CONSTRUCTEDITOR.camera
  }

  if(PIXIMAP.assetsLoaded) {
    MAP.canvas.style.backgroundColor = ''
    PIXIMAP.app.renderer.backgroundColor = parseInt(tinycolor(GAME.world.backgroundColor).toHex(), 16)
    GAME.objects.forEach((object) => {
      updatePixiObject(object, PIXIMAP.stage)
    })
    GAME.heroList.forEach((hero) => {
      updatePixiObject(hero, PIXIMAP.stage)
    })
    PIXIMAP.objectStage.pivot.x = camera.x
    PIXIMAP.objectStage.pivot.y = camera.y
    if(PIXIMAP.shadowStage) {
      PIXIMAP.shadowStage.pivot.x = camera.x
      PIXIMAP.shadowStage.pivot.y = camera.y
    }
  }
}



PIXIMAP.resetDarknessSprites = function() {
  if(!PIXIMAP.grid) return

  const nodes = PIXIMAP.grid.nodes

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
  if(!PIXIMAP.grid) return

  const nodes = PIXIMAP.grid.nodes
  // if(!GAME.gameState.started) return

  GAME.heroList.forEach((hero) => {
    const { gridX, gridY } = gridUtil.convertToGridXY({x: hero.x + PIXIMAP.grid.nodeSize/2, y: hero.y + PIXIMAP.grid.nodeSize/2})

    const startGridX = gridX - 7
    const startGridY = gridY - 7
    const endGridX = gridX + 7
    const endGridY = gridY + 7

    for(let x = startGridX; x < endGridX +1; x++) {
      for(let y = startGridY; y < endGridY + 1; y++) {
        let nodeX = nodes[x]
        if(!nodeX) continue
        let node = nodes[x][y]
        if(!node) continue
        // if(x - gridX >= 1 || x - gridX <= -1 ) {
        // }
        if(x - gridX == 5 || x - gridX == -5 || x - gridX == 6 || x - gridX == -6 || x - gridX == 7 || x - gridX == -7 ) {
          if(!node.light) node.light = 1
        } else if(y - gridY == 5 || y - gridY == -5 || y - gridY == 6 || y - gridY == -6 || y - gridY == 7 || y - gridY == -7) {
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

    const ambientLight = GAME.world.ambientLight || .2
    for(var x = 0; x < nodes.length; x++) {
      let row = nodes[x]
      for(var y = 0; y < row.length; y++) {
        let node = row[y]
        if(!node.darknessSprite) return
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

      }
    }
  })
}

PIXIMAP.initializeDarknessSprites = function() {
  PIXIMAP.grid = _.cloneDeep(GAME.grid)
  PIXIMAP.shadowStage.removeChildren()
  const nodes = PIXIMAP.grid.nodes
  const textures = PIXIMAP.textures
  for(var x = 0; x < nodes.length; x++) {
    let row = nodes[x]
    for(var y = 0; y < row.length; y++) {
      let node = row[y]
      const darknessSprite = new PIXI.Sprite(textures['solidcolorsprite'])
      PIXIMAP.shadowStage.addChild(darknessSprite)
      darknessSprite.x = node.x
      darknessSprite.y = node.y
      darknessSprite.x = (node.x) * MAP.camera.multiplier
      darknessSprite.y = (node.y) * MAP.camera.multiplier
      darknessSprite.transform.scale.x = (GAME.grid.nodeSize/textures['solidcolorsprite']._frame.width) * MAP.camera.multiplier
      darknessSprite.transform.scale.y = (GAME.grid.nodeSize/textures['solidcolorsprite']._frame.height) * MAP.camera.multiplier
      darknessSprite.tint = parseInt(tinycolor('black').toHex(), 16)
      node.darknessSprite = darknessSprite
      // darknessSprite.alpha = 0
    }
  }
}
