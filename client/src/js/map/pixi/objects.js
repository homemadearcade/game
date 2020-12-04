import * as PIXI from 'pixi.js'
import tinycolor from 'tinycolor2'
import { GlowFilter, OutlineFilter, DropShadowFilter } from 'pixi-filters'
import { createDefaultEmitter, updatePixiEmitterData } from './particles'
import { setColor, startAnimation, startPulse, stopPulse, updateSprite, updateChatBox, updateScale, updateColor, updateLight, getVisibility, getHexColor, updatePosition, updateAlpha, getGameObjectStage } from './utils'
import { Ease, ease } from 'pixi-ease'

const updatePixiObject = (gameObject) => {
  if(PAGE.role.isHost) gameObject = gameObject.mod()

  let camera = MAP.camera
  if(CONSTRUCTEDITOR.open) {
    camera = CONSTRUCTEDITOR.camera
  } else if(PATHEDITOR.open) {
    camera = PATHEDITOR.camera
  }


  /////////////////////
  /////////////////////
  // CONSTRUCT PARTS
  if(gameObject.constructParts) {

//    just for these dumbass non updating SOBs
    if(!window.isObjectSelectable(gameObject)) {
      gameObject.constructParts.forEach((part) => {
        if(PIXIMAP.childrenById[part.id]) PIXIMAP.childrenById[part.id].visible = false
      })
    } else {
      gameObject.constructParts.forEach((part) => {
        if(PIXIMAP.childrenById[part.id]) PIXIMAP.childrenById[part.id].visible = true
      })
    }


    if((PAGE.resizingMap && !PAGE.loadingScreen) || (gameObject.tags.moving || gameObject.tags.seperateParts)) {
      gameObject.constructParts.forEach((part) => {
        const partObject = PIXIMAP.convertToPartObject(gameObject, part)
        const partPixiChild = updatePixiObject(partObject)
        partPixiChild.ownerName = gameObject.id
        partPixiChild.name = part.id
      })
    }

    return
  }

  /////////////////////
  /////////////////////
  // SUB OBJECTS
  if(gameObject.subObjects) {
    OBJECTS.forAllSubObjects(gameObject.subObjects, (subObject) => {
      if(subObject.tags.potential) return
      const subObjectPixiChild = updatePixiObject(subObject)
      subObjectPixiChild.name = subObject.id
      subObjectPixiChild.owerName = gameObject.id
    })
  }


  /////////////////////
  /////////////////////
  // GET CHILD
  const stage = getGameObjectStage(gameObject)
  let pixiChild = PIXIMAP.childrenById[gameObject.id]
  if(!pixiChild) {
    return initPixiObject(gameObject)
  }

  /////////////////////
  /////////////////////
  // UPDATE CHATBOX
  updateChatBox(pixiChild, gameObject)


  // if(gameObject.tags.hero) console.log(gameObject._flipY)
  if(gameObject._flipY) {
    pixiChild.skew.x+= 1
  } else {
    pixiChild.skew.x = 0
  }


  if(pixiChild.light) {
    updateLight(pixiChild.light, gameObject)
    if(pixiChild.darkArealight) {
      updateLight(pixiChild.darkArealight, gameObject)
    }
  }

  /////////////////////
  /////////////////////
  // UPDATE EMITTER
  if(pixiChild.trailEmitter && gameObject.tags.hasTrail) {
    updatePixiEmitter(pixiChild.trailEmitter, gameObject)
  }
  if(pixiChild.engineTrailEmitter && gameObject.tags.hasEngineTrail) {
    updatePixiEmitter(pixiChild.engineTrailEmitter, gameObject)
  }

  if(pixiChild.emitter && gameObject.tags.emitter) {
    if(gameObject.emitterData) updatePixiEmitterData(pixiChild.emitter, gameObject)
    updatePixiEmitter(pixiChild.emitter, gameObject)
  }

  if(pixiChild.children && pixiChild.children.length) {
    updatePosition(pixiChild, gameObject)
    pixiChild.children.forEach((child) => {
      updateProperties(child, gameObject)
    })
  } else {
    updatePosition(pixiChild, gameObject)
    updateProperties(pixiChild, gameObject)
  }

  return pixiChild
}

const updatePixiEmitter = (pixiChild, gameObject) => {
  /////////////////////
  /////////////////////
  // SELECT CAMERA
  let camera = MAP.camera
  if(CONSTRUCTEDITOR.open) {
    camera = CONSTRUCTEDITOR.camera
  } else if(PATHEDITOR.open) {
    camera = PATHEDITOR.camera
  }

  const stage = getGameObjectStage(gameObject)

  const emitter = pixiChild.emitter

  /////////////////////
  /////////////////////
  // INVISIBILITY
  const isInvisible = getVisibility(pixiChild, gameObject)

  // remove if its invisible now
  if (isInvisible && !emitter.persistAfterRemoved) {
    if(emitter) {
      emitter._emit = false
      emitter.cleanup()
    }
    return
  } else {
    if(emitter) emitter._emit = true
  }

  /////////////////////
  /////////////////////
  // ROTATION

  emitter.spawnPos.x = gameObject.width/2 * camera.multiplier
  emitter.spawnPos.y =  gameObject.height/2 * camera.multiplier
  if(emitter.useUpdateOwnerPos) {
    // if(gameObject.tags.rotateable) {
    //   // pixiChild.pivot.set(gameObject.width/2, gameObject.height/2)
    //   // pixiChild.rotation = gameObject.angle || 0
    //   // emitter.updateOwnerPos((gameObject.x + gameObject.width/2) * camera.multiplier, (gameObject.y + gameObject.height/2) * camera.multiplier)
    //   // emitter.updateOwnerPos(gameObject.x * camera.multiplier, gameObject.y * camera.multiplier)
    // } else {
      emitter.updateOwnerPos(gameObject.x * camera.multiplier, gameObject.y * camera.multiplier)
    // }
  } else {
    if(gameObject.tags.rotateable) {
      pixiChild.pivot.set(gameObject.width/2, gameObject.height/2)
      pixiChild.rotation = gameObject.angle || 0
      pixiChild.x = (gameObject.x + gameObject.width/2) * camera.multiplier
      pixiChild.y = (gameObject.y + gameObject.height/2) * camera.multiplier
    } else {
      if(typeof pixiChild.rotation === 'number') {
        pixiChild.pivot.set(0, 0)
        pixiChild.rotation= null
      }
      pixiChild.x = (gameObject.x) * camera.multiplier
      pixiChild.y = (gameObject.y) * camera.multiplier
    }
  }

  /////////////////////
  /////////////////////
  // SCALE
  if(emitter.data.scale && emitter.startScale.next) {
    emitter.startScale.value = emitter.data.scale.start * camera.multiplier
    if(emitter.startScale.next) emitter.startScale.next.value = emitter.data.scale.end * camera.multiplier
  }
}

function initEmitter(gameObject, emitterType = 'smallFire', options = {}, metaOptions = {}) {
  const container = new PIXI.Container()
  const stage = getGameObjectStage(gameObject)
  stage.addChild(container)

  let emitter = createDefaultEmitter(container, gameObject, emitterType, options)
  PIXIMAP.objectStage.emitters.push(emitter)
  // container.parentGroup = PixiLights.diffuseGroup

  if(metaOptions.hasNoOwner) container.name = gameObject.id
  else container.ownerName = gameObject.id
  container.emitter = emitter
  container.emitter.hasNoOwner = metaOptions.hasNoOwner
  container.emitter.type = emitterType
  container.emitter.useUpdateOwnerPos = options.useUpdateOwnerPos
  container.emitterType = emitterType

  updatePixiEmitter(container, gameObject)

  return container
}

function updateProperties(pixiChild, gameObject) {
  /////////////////////
  /////////////////////
  // INVISIBILITY
  const isInvisible = getVisibility(pixiChild, gameObject)
  // remove if its invisible now

  if (isInvisible) {
    pixiChild.visible = false
    return
  } else {
    pixiChild.visible = true
  }

  updateSprite(pixiChild, gameObject)
  updateScale(pixiChild, gameObject)
  updateColor(pixiChild, gameObject)
  updateAlpha(pixiChild, gameObject)

  if(gameObject.tags.hasTrail && !pixiChild.trailEmitter) {
    pixiChild.trailEmitter = initEmitter(gameObject, 'trail', { scaleToGameObject: true, matchObjectColor: true, useUpdateOwnerPos: true })
  }
  if(!gameObject.tags.hasTrail && pixiChild.trailEmitter) {
    PIXIMAP.deleteEmitter(pixiChild.trailEmitter)
    delete pixiChild.trailEmitter
  }

  if(gameObject.tags.hasEngineTrail && !pixiChild.engineTrailEmitter) {
    pixiChild.engineTrailEmitter = initEmitter(gameObject, 'engineTrail', { useUpdateOwnerPos: true })
  }
  if(!gameObject.tags.hasEngineTrail && pixiChild.engineTrailEmitter) {
    PIXIMAP.deleteEmitter(pixiChild.engineTrailEmitter)
    delete pixiChild.engineTrailEmitter
  }


  if(gameObject.tags.emitter && !pixiChild.emitter && gameObject.emitterData) {
    pixiChild.emitter = initEmitter(gameObject, 'live', gameObject.emitterData)
  }

  if(gameObject.tags.emitter && !pixiChild.emitter && gameObject.emitterType) {
    pixiChild.emitter = initEmitter(gameObject, gameObject.emitterType)
  }

  const hasWrongEmitter = (pixiChild.emitter && ((pixiChild.emitter.emitterType && !gameObject.emitterType && !gameObject.emitterData) || (gameObject.emitterType && pixiChild.emitter.emitterType !== gameObject.emitterType)) )
  if(!gameObject.tags.emitter && pixiChild.emitter || hasWrongEmitter) {
    PIXIMAP.deleteEmitter(pixiChild.emitter)
    delete pixiChild.emitter
  }


  /////////////////////
  /////////////////////
  // INTERACT HIGHLIGHT
  if(gameObject.tags.glowing || HERO.id && GAME.heros[HERO.id] && GAME.heros[HERO.id].interactableObjectId && gameObject.id === GAME.heros[HERO.id].interactableObjectId) {
    pixiChild.filters = [new GlowFilter(12, 0xFFFFFF)];
  } else {
    removeFilter(pixiChild, GlowFilter)
  }
}

const addGameObjectToStage = (gameObject, stage) => {
  if(PIXIMAP.childrenById[gameObject.id]) {
    return PIXIMAP.childrenById[gameObject.id]
  }

  /////////////////////
  /////////////////////
  // SELECT CAMERA
  let camera = MAP.camera
  if(CONSTRUCTEDITOR.open) {
    camera = CONSTRUCTEDITOR.camera
  } else if(PATHEDITOR.open) {
    camera = PATHEDITOR.camera
  }

  if(PAGE.role.isHost) gameObject = gameObject.mod()

  /////////////////////
  /////////////////////
  // DEFAULT SPRITE
  if(!gameObject.defaultSprite) {
    gameObject.defaultSprite = 'solidcolorsprite'
  }
  gameObject.sprite = gameObject.defaultSprite

  /////////////////////
  /////////////////////
  // CREATE SPRITE
  const texture = PIXIMAP.textures[gameObject.sprite]
  let sprite
  if(gameObject.tags.tilingSprite) {
    sprite = new PIXI.TilingSprite(texture, gameObject.width, gameObject.height)
  } else {
    sprite = new PIXI.Sprite(texture)
  }
  if(stage === PIXIMAP.objectStage) sprite.parentGroup = PIXIMAP.sortGroup

  if(gameObject.tags.light) {
    const lightbulb = new PIXI.Graphics();
    const rad = 30
    let color = gameObject.lightColor
    if(!color) color = 'white'
    lightbulb.beginFill(getHexColor(color));
    lightbulb.drawCircle(0, 0, rad);
    lightbulb.endFill();
    lightbulb.parentLayer = PIXIMAP.globalLighting;// <-- try comment it
    lightbulb.filters = [new PIXI.filters.BlurFilter(120)];
    sprite.light = stage.addChild(lightbulb)
    lightbulb._scaleMode = PIXI.SCALE_MODES.NEAREST

    const lightbulb2 = new PIXI.Graphics();
    // const rad = 200
    lightbulb2.beginFill(getHexColor(color));
    lightbulb2.drawCircle(0, 0, rad);
    lightbulb2.endFill();
    lightbulb2.parentLayer = PIXIMAP.darkAreaLighting;// <-- try comment it
    lightbulb2.filters = [new PIXI.filters.BlurFilter(120)];
    sprite.darkArealight = stage.addChild(lightbulb2)
    lightbulb2._scaleMode = PIXI.SCALE_MODES.NEAREST

    console.log(sprite)
  }


  /////////////////////
  /////////////////////
  // ADD TO STAGE
  let addedChild = stage.addChild(sprite)
  addedChild.texture = texture

  /////////////////////
  /////////////////////
  // NAME SPRITE FOR LOOKUP
  addedChild.name = gameObject.id
  PIXIMAP.childrenById[gameObject.id] = addedChild

  if(gameObject.id === HERO.id) {
    PIXIMAP.hero = addedChild
  }

  updatePixiObject(gameObject)

  if(gameObject.tags.fadeInOnInit) {
    startAnimation('fadeIn', addedChild, gameObject)
  }

  return addedChild
}

const initPixiObject = (gameObject) => {
  const stage = getGameObjectStage(gameObject)
  if(PAGE.role.isHost) gameObject = gameObject.mod()

  if(gameObject.constructParts) {
    gameObject.constructParts.forEach((part) => {
      const partObject = PIXIMAP.convertToPartObject(gameObject, part)
      const pixiChild = addGameObjectToStage(partObject, stage)
      pixiChild.ownerName = gameObject.id
      pixiChild.name = part.id
    })
    return
  }

  if(gameObject.subObjects) {
    OBJECTS.forAllSubObjects(gameObject.subObjects, (subObject) => {
      if(subObject.tags.potential) return
      const pixiChild = addGameObjectToStage(subObject, stage)
      pixiChild.ownerName = gameObject.id
      pixiChild.name = subObject.id
    })
  }

  return addGameObjectToStage(gameObject, stage)
}

function addFilter(pixiChild, filter) {
  if(!pixiChild.filters) {
    pixiChild.filters = []
  }
  pixiChild.filters.push(filter)
}

function removeFilter(pixiChild, filterClass) {
  if(pixiChild.filters) {
    pixiChild.filters = pixiChild.filters.filter((filter) => {
      if(filter instanceof filterClass) return false
      return true
    })
  }
}

export {
  initPixiObject,
  updatePixiObject,
  initEmitter,
}
