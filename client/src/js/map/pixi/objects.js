import * as PIXI from 'pixi.js'
import tinycolor from 'tinycolor2'
import { GlowFilter, OutlineFilter, DropShadowFilter } from 'pixi-filters'
import { createDefaultEmitter, updatePixiEmitterData } from './particles'
import { setColor, startAnimation, startPulse, stopPulse, updateSprite, updateChatBox, updateScale, updateColor, updateLight, getVisibility, getHexColor, updatePosition, updateAlpha, getGameObjectStage } from './utils'
import { Ease, ease } from 'pixi-ease'

const updatePixiObject = (gameObject) => {
  if(!gameObject) return console.trace('yo no game object wtf')
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
    // if(!global.isObjectSelectable(gameObject)) {
    //   gameObject.constructParts.forEach((part) => {
    //     if(PIXIMAP.childrenById[part.id]) PIXIMAP.childrenById[part.id].visible = false
    //   })
    // } else {
    //   gameObject.constructParts.forEach((part) => {
    //     if(PIXIMAP.childrenById[part.id]) PIXIMAP.childrenById[part.id].visible = true
    //   })
    // }

    //gameObject.tags.moving ||
    // if(!PAGE.loadingScreen || (gameObject.tags.seperateParts)) {
      gameObject.constructParts.forEach((part) => {
        const partObject = PIXIMAP.convertToPartObject(gameObject, part)
        const partPixiChild = updatePixiObject(partObject)
        partPixiChild.ownerName = gameObject.id
        partPixiChild.name = part.id
      })
    // }

    return
  }

  /////////////////////
  /////////////////////
  // SUB OBJECTS
  if(gameObject.subObjects) {
    OBJECTS.forAllSubObjects(gameObject.subObjects, (subObject) => {
      if(subObject.tags && subObject.tags.potential) return
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
  if(pixiChild.laserEmitter) {
    updatePixiEmitter(pixiChild.laserEmitter, gameObject)
  }

  if(PIXIMAP.followingAnimations[gameObject.id]) {
    PIXIMAP.followingAnimations[gameObject.id].forEach((sprite) => {
      PIXIMAP.updatePixiSpriteAnimation(sprite, gameObject)
    })
  }

  if(pixiChild.poweredUpEmitter && gameObject.tags.poweredUp) {
    updatePixiEmitter(pixiChild.poweredUpEmitter, gameObject)
  }
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

function initPixiLight(sprite, gameObject, stage) {
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
    // if(gameObject.tags.rotateable) {
    //   pixiChild.pivot.set(gameObject.width/2, gameObject.height/2)
    //   pixiChild.rotation = gameObject.angle || 0
    // } else {
    //   if(typeof pixiChild.rotation === 'number') {
    //     pixiChild.pivot.set(0, 0)
    //     pixiChild.rotation= null
    //   }
    // }
    emitter.updateOwnerPos(gameObject.x * camera.multiplier, gameObject.y * camera.multiplier)
    // }
  } else {
    if(gameObject.tags.rotateable) {
      pixiChild.pivot.set(gameObject.width/2, gameObject.height/2)
      pixiChild.rotation = gameObject.angle || 0
      pixiChild.x = (gameObject.x + gameObject.width/2) * camera.multiplier
      pixiChild.y = (gameObject.y + gameObject.height/2) * camera.multiplier
    } else {
      pixiChild.x = (gameObject.x) * camera.multiplier
      pixiChild.y = (gameObject.y) * camera.multiplier
    }
  }



  const data = emitter.data

  if(!data) return

  /////////////////////
  /////////////////////
  // SCALE
  if(emitter.data.scale && emitter.startScale.next) {
    emitter.startScale.value = emitter.data.scale.start * camera.multiplier
    if(emitter.startScale.next) emitter.startScale.next.value = emitter.data.scale.end * camera.multiplier
  }


  /////////////////////
  /////////////////////
  // speed
  emitter.acceleration.x = data.acceleration.x * MAP.camera.multiplier
  emitter.acceleration.y = data.acceleration.y * MAP.camera.multiplier
  emitter.startSpeed.value = data.speed.start * MAP.camera.multiplier
  if(emitter.startSpeed.next) emitter.startSpeed.next.value = data.speed.end * MAP.camera.multiplier

  const usesCircle = (data.spawnType === 'ring' || data.spawnType === 'circle')
  if(emitter.spawnCircle && usesCircle) {
    if(data.spawnCircle && data.spawnCircle.r) {
      emitter.spawnCircle.radius = data.spawnCircle.r * MAP.camera.multiplier
    }
    if(data.spawnCircle && data.spawnCircle.minR) emitter.spawnCircle.minRadius = data.spawnCircle.minR * MAP.camera.multiplier
  }

  const usesRect = data.spawnType === 'rect'
  if(emitter.spawnRect && usesRect) {
    if(data.setSpawnRectToOwnerSize) {
      emitter.spawnRect.width = gameObject.width * MAP.camera.multiplier
      emitter.spawnRect.height = gameObject.height * MAP.camera.multiplier
      emitter.spawnRect.x = -(gameObject.width/2) * MAP.camera.multiplier
      emitter.spawnRect.y = -(gameObject.height/2) * MAP.camera.multiplier
    } else {
      if(data.spawnRect && data.spawnRect.w) emitter.spawnRect.width = (data.spawnRect.w * MAP.camera.multiplier)
      if(data.spawnRect && data.spawnRect.h) emitter.spawnRect.height = (data.spawnRect.h * MAP.camera.multiplier)
      if(data.spawnRect && data.spawnRect.x) emitter.spawnRect.x = (data.spawnRect.x * MAP.camera.multiplier)
      if(data.spawnRect && data.spawnRect.y) emitter.spawnRect.y = (data.spawnRect.y * MAP.camera.multiplier)
    }
  }
}

function initEmitter(gameObject, emitterType = 'smallFire', options = {}, metaOptions = {}) {
  const container = new PIXI.Container()
  const stage = getGameObjectStage(gameObject)
  stage.addChild(container)

  let emitter = createDefaultEmitter(container, gameObject, emitterType, options)
  PIXIMAP.emitters.push(emitter)
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

  if(!pixiChild.light && gameObject.tags.light) {
    initPixiLight(pixiChild, gameObject, getGameObjectStage(gameObject))
  }

  if(pixiChild.light && !gameObject.tags.light) {
    const stage = getGameObjectStage(gameObject)
    stage.removeChild(pixiChild.light)
    delete pixiChild.light
    stage.removeChild(pixiChild.darkArealight)
    delete pixiChild.darkArealight
  }

  if(!pixiChild.laserEmitter && gameObject._shootingLaser && gameObject.ownerId) {
    pixiChild.laserEmitter = initEmitter(gameObject, gameObject.emitterTypeAction || 'laser', {})
  } else if(pixiChild.laserEmitter && !gameObject._shootingLaser) {
    PIXIMAP.deleteEmitter(pixiChild.laserEmitter)
    delete pixiChild.laserEmitter
  }

  if(gameObject.tags.poweredUp && !pixiChild.poweredUpEmitter) {
    pixiChild.poweredUpEmitter = initEmitter(gameObject, gameObject.emitterTypePoweredUp || 'powerRing', { useUpdateOwnerPos: true })
  }
  if(!gameObject.tags.poweredUp && pixiChild.poweredUpEmitter) {
    PIXIMAP.deleteEmitter(pixiChild.poweredUpEmitter)
    delete pixiChild.poweredUpEmitter
  }

  if(gameObject.tags.hasTrail && !pixiChild.trailEmitter) {
    pixiChild.trailEmitter = initEmitter(gameObject, 'trail', { useOwnerSprite: gameObject.defaultSprite !== 'solidcolorsprite', scaleToGameObject: true, matchObjectColor: true, useUpdateOwnerPos: true })
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

  if(!pixiChild.tileScale && gameObject.tags.tilingSprite) {
    PIXIMAP.deleteObject(gameObject)
    return
  }

  if(pixiChild.tileScale && !gameObject.tags.tilingSprite) {
    PIXIMAP.deleteObject(gameObject)
    return
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
    sprite = new PIXI.TilingSprite(texture, gameObject.width * camera.multiplier, gameObject.height * camera.multiplier)
  } else {
    sprite = new PIXI.Sprite(texture)
  }
  if(stage === PIXIMAP.objectStage) sprite.parentGroup = PIXIMAP.sortGroup

  if(gameObject.tags.light) {
    initPixiLight(sprite, gameObject, stage)
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

const initPixiObject = (gameObject, isConstructEditor) => {
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
      if(subObject.tags && subObject.tags.potential) return
      const pixiChild = addGameObjectToStage(subObject, stage)
      pixiChild.ownerName = gameObject.id
      pixiChild.name = subObject.id
    })
  }

  return addGameObjectToStage(gameObject, stage)
}

export {
  updatePixiEmitter,
  initPixiObject,
  updatePixiObject,
  initEmitter
}
