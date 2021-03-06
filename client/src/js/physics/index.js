/*!!!!!!!!!!!!!!
REGARDING PHYSICS, SOMETHING EARLIER ON THE i LIST ( objects ) loose the battle for corrections. They correct for everything else first
just make sure to set something to stationary if its not supposed to be move, or else it will be subject to spawn ( i ) order
*/

import { Collisions } from 'collisions';
import decomp from 'poly-decomp';
import { onHeroTrigger } from '../game/heros/onHeroTrigger.js';
import { objectOnTerrain } from '../game/terrain.js';


import {
  checkIfShouldRunPhysics,
  attachToParent,
  attachToRelative,
  attachSubObjects,
  addObject,
  removeObject,
  heroCorrection,
  heroCollisionEffects,
  objectCorrection,
  objectCollisionEffects,
  containObjectWithinGridBoundaries,
  shouldCheckConstructPart,
  applyCorrection,
  relativePositioning
} from './physicsTools.js'

const objects = {}

// Create the collision system
const system = new Collisions()
global.PHYSICS = {
  addObject,
  removeObject,
  system,
  objects,
  heroCorrection,
  correctAndEffectAllObjectAndHeros,
  prepareObjectsAndHerosForMovementPhase,
  prepareObjectsAndHerosForCollisionsPhase,
  updatePosition,
  postPhysics,
  draw: drawSystem,
  relativePositioning,
}

let cameraSet = false
function drawSystem(ctx, camera) {
  if(!cameraSet) {
    ctx.scale(camera.multiplier, camera.multiplier)
    cameraSet = true
  }
  // console.log(camera.x)
  // ctx.setTransform(0,0,0,0, camera.x, camera.y)

  ctx.fillStyle = '#000000'
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  // ctx.canvas.width = 1000
  // ctx.canvas.height = 1000
	ctx.strokeStyle = '#FFFFFF'
	ctx.beginPath()
	system.draw(ctx)
	ctx.stroke()

  ctx.strokeStyle = '#00FF00'
  ctx.beginPath()
  // system.drawBVH(ctx)
  ctx.stroke()
}

function correctAndEffectAllObjectAndHeros (delta) {
  // update physics system
  prepareObjectsAndHerosForCollisionsPhase()
  heroPhysics()
  objectPhysics()
  postPhysics()
  removeAndRespawn()
}

function setAngleVelocity(hero) {
  const angleCorrection = global.degreesToRadians(90)
  if(typeof hero.angle != 'number') hero.angle = 0
  hero.velocityX = hero.velocityAngle * Math.cos(hero.angle - angleCorrection)
  hero.velocityY = hero.velocityAngle * Math.sin(hero.angle - angleCorrection)
}

function updatePosition(object, delta) {
  if(!checkIfShouldRunPhysics(object) || object.mod().relativeId) return
  if(object._skipPosUpdate) return
  if(!object.mod().tags['moving']) return

  const allowGravity = true
  // if(object.accX) {
  //   object.velocityX += ( object.accX )
  //     if(object.accX > 0) {
  //     object.accX -= ( object.accDecayX )
  //     if(object.accX < 0) {
  //       object.accX = 0
  //     }
  //   } else if (object.accX < 0) {
  //     object.accX += ( object.accDecayX )
  //     if(object.accX > 0) {
  //       object.accX = 0
  //     }
  //   }
  // }


  // needs to be here so it can be calcualte into set
  let gravityVelocityY = object.gravityVelocityY
  if(!gravityVelocityY) gravityVelocityY = GAME.world.gravityVelocityY
  if(!gravityVelocityY) gravityVelocityY = 1000

  let applyWorldGravity = false
  if(GAME.world.tags.allMovingObjectsHaveGravityY && object.mod().tags.moving && !object.mod().tags.ignoreWorldGravity && (!object.flags || !object.flags.isAdmin)) {
    applyWorldGravity = true
  }

  if(object.mod().tags.rotateable && !object.tags.gravityY && !object.tags.noAngleMovement && typeof object.velocityAngle === 'number') setAngleVelocity(object)

  if(object._skipNextGravity) {
    object._skipNextGravity = false
  } else if(object.tags && object.mod().tags.gravityY || applyWorldGravity) {
    let distance = (object.velocityY * delta) +  ((gravityVelocityY * (delta * delta))/2)
    object.y += distance
    if(allowGravity) object.velocityY += (gravityVelocityY * delta)
    // if(allowGravity && object.mod().tags.rotateable) object.velocityAngle += (gravityVelocityY * delta)
  }

  let isXWithinMaxVelocity = false
  const maxVelocityX = object.mod().velocityMax + (object.mod().velocityMaxXExtra || 0)
  if(object.velocityX) {

    if(object._breakMaxVelocity) {
      if(object.velocityX < maxVelocityX && object.velocityX > maxVelocityX * -1) {
        isXWithinMaxVelocity = true
      }
    } else {
      if(object.velocityX >= maxVelocityX) object.velocityX = maxVelocityX
      else if(object.velocityX <= maxVelocityX * -1) object.velocityX = maxVelocityX * -1
    }

    if(object.velocityX > 1200) object.velocityX = 1200
    object.x += object.velocityX * delta
  }


  // if(object.accY) {
  //   object.velocityY += ( object.accY )
  //   if(object.accY > 0) {
  //     object.accY -= ( object.accDecayY )
  //     if(object.accY < 0) {
  //       object.accY = 0
  //     }
  //   } else if (object.accY < 0) {
  //     object.accY += ( object.accDecayY )
  //     if(object.accY > 0) {
  //       object.accY = 0
  //     }
  //   }
  // }


  const maxVelocityY = object.mod().velocityMax + (object.mod().velocityMaxYExtra || 0)
  if(object.velocityY) {

    if(object._breakMaxVelocity && isXWithinMaxVelocity) {
      if(object.velocityY < maxVelocityY && object.velocityY > maxVelocityY * -1) object._breakMaxVelocity = false
    } else {
      if(object.velocityY >= maxVelocityY) {
        object.velocityY = maxVelocityY
      }
      else if(object.velocityY <= maxVelocityY * -1) {
        object.velocityY = maxVelocityY * -1
      }
    }

    if(object.tags && !object.mod().tags.gravityY) {
      if(object.velocityY > 1200) object.velocityY = 1200
      if(allowGravity) object.y += object.velocityY * delta
    }
  }

  const isVelocityDecayNumber = typeof object.mod().velocityDecay == 'number'
  if(isVelocityDecayNumber || object.arrowKeysBehavior === 'advancedPlatformer') {
    let velocityDecayY = 0
    let velocityDecayX = 0
    let velocityInAirDecayExtra = 0
    let velocityOnLandDecayExtra = 0
    let velocityOnWaterDecayExtra = 0

    if(!isVelocityDecayNumber) {
      velocityDecayY = global.advancedPlatformerDefaults.velocityDecay
      velocityDecayX = global.advancedPlatformerDefaults.velocityDecay
      velocityOnLandDecayExtra = global.advancedPlatformerDefaults.velocityOnLandDecayExtra
      velocityInAirDecayExtra = global.advancedPlatformerDefaults.velocityInAirDecayExtra
      velocityOnWaterExtra = global.advancedPlatformerDefaults.velocityonWaterDecayExtra
    } else {
      velocityDecayY = object.mod().velocityDecay + (object.mod().velocityDecayYExtra || 0)
      velocityDecayX = object.mod().velocityDecay + (object.mod().velocityDecayXExtra || 0)
      if(object.mod().velocityInAirDecayExtra) velocityInAirDecayExtra = object.mod().velocityInAirDecayExtra
      if(object.mod().velocityOnLandDecayExtra) velocityOnLandDecayExtra = object.mod().velocityOnLandDecayExtra
      if(object.mod().velocityOnWaterDecayExtra) velocityOnWaterDecayExtra = object.mod().velocityOnWaterDecayExtra
    }

    let onLand = object.onObstacle
    let inAir = !object.onObstacle
    let onWater = object.onWater

    if(object.mod().tags.walkOverhead) {
      onLand = object.onLand
      inAir = false
    }

    if(onLand && velocityOnLandDecayExtra) {
      velocityDecayY += velocityOnLandDecayExtra
      velocityDecayX += velocityOnLandDecayExtra
    } else if(onWater && velocityOnWaterDecayExtra) {
      velocityDecayY += velocityOnWaterDecayExtra
      velocityDecayX += velocityOnWaterDecayExtra
    } else if(inAir && velocityInAirDecayExtra) {
      velocityDecayY += velocityInAirDecayExtra
      velocityDecayX += velocityInAirDecayExtra
    }

    if(object.velocityX < 0) {
      object.velocityX += (velocityDecayX * delta)
      if(object.velocityX > 0) object.velocityX = 0
    } else {
      object.velocityX -= (velocityDecayX * delta)
      if(object.velocityX < 0) object.velocityX = 0
    }

    if(object.velocityY < 0) {
      object.velocityY += (velocityDecayY * delta)
      if(object.velocityY > 0) object.velocityY = 0
    } else {
      object.velocityY -= (velocityDecayY * delta)
      if(object.velocityY < 0) object.velocityY = 0
    }

    if(object._flatVelocityX) {
      if(object._flatVelocityX < 0) {
        object.x += (object._flatVelocityX + velocityDecayX) * delta
      } else {
        object.x += (object._flatVelocityX - velocityDecayX) * delta
      }
    }
    if(object._flatVelocityY) {
      if(object._flatVelocityY < 0) {
        object.y += (object._flatVelocityY + velocityDecayY) * delta
      } else {
        object.y += (object._flatVelocityY - velocityDecayY) * delta
      }
    }
  } else {
    if(object._flatVelocityX) {
      object.x += object._flatVelocityX * delta
    }
    if(object._flatVelocityY) {
      object.y += object._flatVelocityY * delta
    }
  }

  if(object.tags && !object.mod().tags['moving']) {
    object.velocityY = 0
    object.velocityX = 0
    object.velocityAngle = 0
    object.accY = 0
    object.accX = 0
    object.x = object._initialX
    object.y = object._initialY
  }


  if(object.mod().tags.flipYAtMaxVelocity && Math.abs(object.velocityY) == object.mod().velocityMax) {
    object._flipY = true
  }
}

function getAllHeros() {
  return GAME.heroList.filter(({id}) => {
    if(id === 'ghost') return false
    else return true
  })
}

function prepareObjectsAndHerosForMovementPhase() {
  // set objects new position and widths
  let everything = [...GAME.objects]
  let allHeros = getAllHeros()
  if(global.terrainObstacles) everything.push(...global.terrainObstacles)
  everything.push(...allHeros)
  PHYSICS.correctedConstructs = {}

  // everything.forEach((object) => {
  //   if(object.subObjects) {
  //     OBJECTS.forAllSubObjects(object.subObjects, (subObject) => {
  //       if(subObject.mod().tags.potential || subObject.mod().tags.notInCollisions) return
  //       everything.push(subObject)
  //     })
  //   }
  // })

  everything.forEach((object, i) => {
    object._collidingWithWater = false

    object._deltaX = 0
    object._deltaY = 0
    object._parentId = null
    object._initialX = object.x
    object._initialY = object.y

    object._shakePower = null

    object._flipY = false

    object._skipPosUpdate = false
    object._flatVelocityX = null
    object._flatVelocityY = null
    // object._prevLandingObjectId = object._landingObjectId
    // object._landingObjectId = null
    object._prevInteractableObjectId = object.interactableObjectId
    object.interactableObjectId = null

    if(object.constructParts) {
      object.constructParts.forEach((part) => {
        part._initialX = part.x
        part._initialY = part.y
        part._shakePower = null
      })
    }

    if(object.subObjects && object.subObjects.awarenessTriggerArea) {
      object._objectsAwareOfNext = []
    }

    object._objectsWithinNext = []
    object._objectsTouchingNext = []

    if(object.subObjects) {
      OBJECTS.forAllSubObjects(object.subObjects, (subObject) => {
        if(subObject.mod().tags.potential || subObject.mod().tags.notInCollisions) return
        subObject._objectsWithinNext = []
        subObject._objectsTouchingNext = []
        subObject._shakePower = null
      })
    }
  })
}

function prepareObjectsAndHerosForCollisionsPhase() {
  // set objects new position and widths


  let everything = [...GAME.objects]
  let allHeros = getAllHeros()
  if(global.terrainObstacles) everything.push(...global.terrainObstacles)
  everything.push(...allHeros)
  everything.forEach((object) => {
    if(object.subObjects) {
      OBJECTS.forAllSubObjects(object.subObjects, (subObject) => {
        if(subObject.mod().tags.potential || subObject.mod().tags.notInCollisions) return
        everything.push(subObject)
      })
    }
  })

  everything.forEach((object, i) => {
    const moddedObject = object.mod()
    if(!object.id) {
      console.log('OBJECT', object, 'WITHOUT ID')
      return
    }

    if(object.mod().tags.notInCollisions) {
      return
    }

    if(object.constructParts) {
      object.constructParts.forEach((part) => {
        if(!PHYSICS.objects[part.id]) {
          console.log('physics object not found for part : ' + part.id)
          return
        }

        let physicsObject = PHYSICS.objects[part.id]
        physicsObject.x = part.x + (object.x - object._initialX)
        physicsObject.y = part.y + (object.y - object._initialY)
        physicsObject.id = part.id
        physicsObject.gameObject = object
        physicsObject.constructPart = part
      })
    } else {
      if(!PHYSICS.objects[object.id]) {
        console.log('physics object not found for id: ' + object.id)
        return
      }

      object.onObstacle = false

      let physicsObject = PHYSICS.objects[object.id]
      physicsObject.x = object.x
      physicsObject.y = object.y
      physicsObject.id = object.id
      physicsObject.gameObject = object

      let width = moddedObject.width
      let height = moddedObject.height

      if(moddedObject.tags.rotateable) {
        if(object.angle === 0 || physicsObject._angle !== object.angle) {
          physicsObject.setPoints([ [ -width/2, -height/2], [width/2, -height/2], [width/2, height/2] , [-width/2, height/2]])
        }
        physicsObject.angle = moddedObject.angle
        physicsObject.x = moddedObject.x + width/2
        physicsObject.y = moddedObject.y + height/2
      } else {
        if(physicsObject.angle) physicsObject.angle = null
        if(Math.floor(Math.abs(width)) !== Math.floor(Math.abs(physicsObject._max_x - physicsObject._min_x)) || Math.floor(Math.abs(height)) !== Math.floor(Math.abs(physicsObject._max_y - physicsObject._min_y))) {
          physicsObject.setPoints([ [ 0, 0], [width, 0], [width, height] , [0, height]])
        }
      }
    }
  })


  system.update()
}

function heroPhysics() {
  let allHeros = getAllHeros()
  allHeros.forEach((hero) => {
    if(hero.mod().flags.isAdmin) return
    heroCollisionEffects(hero)
    if(hero.mod().relativeId) return
    heroCorrection(hero)
  })
}


global.collideTags = {
  monsterDestroyer: true,
  destroyOnCollideWithObstacle: true,
  monsterVictim: true,
  goombaSideways: true,
  goomba: true,
  trackObjectsTouching: true,
  trackObjectsWithin: true,
  awarenessTriggerArea: true,
  heroInteractTriggerArea: true,
  collideEffects: true,
}
const collideTagsList = Object.keys(global.collideTags)
function shouldCheckCollisionEffects(gameObject, po) {
  if(!gameObject) return
  const gameObjectTags = gameObject.mod().tags
  return collideTagsList.some((tag) => {
    if(gameObjectTags[tag]) {
      return true
    }
  })
}

function objectPhysics() {
  Object.keys(PHYSICS.objects).forEach((id) => {
    let po = PHYSICS.objects[id]
    if(!shouldCheckCollisionEffects(po.gameObject, po)) return
    if(!po.gameObject) {
      if(PHYSICS.debug) console.log('no game object found for phyics object id: ' + id)
      return
    }
    if(po.gameObject.mod().tags.hero) return
    if(!checkIfShouldRunPhysics(po.gameObject) || (po.constructPart && po.constructPart.removed)) return
    objectCollisionEffects(po)
  })

  correctionPhase()
  system.update()
  correctionPhase(true)

  function correctionPhase(final = false) {
    for(let id in PHYSICS.objects){
      let po = PHYSICS.objects[id]
      if(!po.gameObject) continue
      if(po.gameObject.mod().relativeId) continue
      if(!checkIfShouldRunPhysics(po.gameObject)) continue
      if(po.gameObject.mod().tags.hero) continue
      if(po.gameObject.mod().tags['skipCorrectionPhase']) {
        applyCorrection(po.gameObject, po)
        continue
      }
      if(!po.gameObject.mod().tags['moving']) continue
      if(po.constructPart && (po.constructPart.removed || !shouldCheckConstructPart(po.constructPart))) continue
      if(po.gameObject.mod().tags.moving || po.gameObject.mod().tags.heroPushable) objectCorrection(po, final)
    }
  }
}

function postPhysics() {
  let allHeros = getAllHeros()
  // GET DELTA
  allHeros.forEach((hero) => {
    if(hero.mod().removed) return
    if(hero.interactableObjectId) {
      let input = GAME.heroInputs[hero.id]
      const interactableObject = OBJECTS.getObjectOrHeroById(hero.interactableObjectId)
      // INTERACT WITH SMALLEST OBJECT
      // global.emitGameEvent('onObjectInteractable', hero.interactableObjectId, hero)
      if(interactableObject.mod().tags.autoTalkOnInteractable && !hero.flags.isAdmin && !hero._cantInteract && !hero.flags.paused && !hero._cantautoTalk) {
        // if(interactableObject.mod().tags.autoTalkOnce) {
          interactableObject.tags.autoTalkOnInteractable = false
          // interactableObject.tags.autoTalkOnce = false
          global.emitGameEvent('onHeroInteract', hero, interactableObject)
          onHeroTrigger(hero, interactableObject, {}, { skipToInteraction: 'talk'})
          hero._cantInteract = true
        // }
      }

      if(input && (input['e'] === true || input['v'] === true || input['enter'] === true) && !hero._cantInteract && !hero.flags.paused) {
        global.emitGameEvent('onHeroInteract', hero, interactableObject)
        onHeroTrigger(hero, interactableObject, {}, {fromInteractButton: true})
        hero._cantInteract = true
      }
    }
    processAwarenessAndWithinEvents(hero)

    if(hero.subObjects) {
      Object.keys(hero.subObjects).forEach((subObjectName) => {
        const subObject = hero.subObjects[subObjectName]
        processAwarenessAndWithinEvents(subObject)

        // if(subObject.closestObjectsWithinAction && subObject._objectsWithin) {
        //   subObject._objectsWithin.forEach((id) => {
        //     const object = OBJECTS.getObjectOrHeroById(id)
        //
        //     const diffX = hero.x - object.x
        //     const diffY = hero.y - object.y
        //     const diffTotal = diffX + diffY
        //     if(diffTotal > currentHighestDiff) {
        //       currentHighestDiff = diffTotal
        //       currentClosestObject = id
        //     }
        //   })
        // }
      })
    }
  })

  // NON CHILD GO FIRST
  GAME.objects.forEach((object, i) => {
    if(!checkIfShouldRunPhysics(object)) return
    if(!object.mod().parentId && !object._parentId) {
      containObjectWithinGridBoundaries(object)
      object._deltaX = object.x - object._initialX
      object._deltaY = object.y - object._initialY
    }
    processAwarenessAndWithinEvents(object)

    if(object.subObjects) {
      Object.keys(object.subObjects).forEach((subObjectName) => {
        const subObject = object.subObjects[subObjectName]
        processAwarenessAndWithinEvents(subObject)
      })
    }
  })

  allHeros.forEach((hero) => {
    if(hero.mod().removed) return
    if(!hero.mod().parentId && !hero._parentId) {
      containObjectWithinGridBoundaries(hero)
      hero._deltaX = hero.x - hero._initialX
      hero._deltaY = hero.y - hero._initialY
    }
  })

  // THEN ATTACH CHILDREN OBJECTS TO PARENT
  GAME.objects.forEach((object, i) => {
    if(!checkIfShouldRunPhysics(object)) return
    if(object.mod().parentId || object._parentId ) {
      attachToParent(object)
      containObjectWithinGridBoundaries(object)
    }
  })

  allHeros.forEach((hero) => {
    if(hero.mod().removed) return
    if(hero.mod().parentId || hero._parentId ) {
      attachToParent(hero)
      containObjectWithinGridBoundaries(hero)
    }
  })


  // ATTACH OBJECTS THAT ARE SEPERATE FROM BOUNDARIES
  GAME.objects.forEach((object, i) => {
    if(!checkIfShouldRunPhysics(object)) return
    if(object.mod().relativeId) {
      attachToRelative(object)
    }
    if(object.subObjects) {
      attachSubObjects(object, object.subObjects)
    }

    objectOnTerrain(object)
  })

  allHeros.forEach((hero) => {
    if(hero.mod().removed) return
    if(hero.mod().relativeId) {
      attachToRelative(hero)
    }
    if(hero.subObjects) {
      attachSubObjects(hero, hero.subObjects)
    }

    objectOnTerrain(hero)
  })
}

function processAwarenessAndWithinEvents(object) {
  if(object.mod().subObjects && object.mod().subObjects.awarenessTriggerArea) {
    if(object._objectsAwareOf) {
      const left = object._objectsAwareOf.filter((id) => {
        return object._objectsAwareOfNext.indexOf(id) == -1
      })
      const entered = object._objectsAwareOfNext.filter((id) => {
        return object._objectsAwareOf.indexOf(id) == -1
      })

      left.forEach((objectLeftId) => {
        const objectLeft = OBJECTS.getObjectOrHeroById(objectLeftId)
        if(object.tags && object.tags.hero) {
          global.emitGameEvent('onHeroUnaware', object, objectLeft)
        } else {
          global.emitGameEvent('onObjectUnaware', object, objectLeft)
        }
      })
      entered.forEach((objectEnteredId) => {
        const objectEntered = OBJECTS.getObjectOrHeroById(objectEnteredId)
        if(object.tags && object.tags.hero) {
          global.emitGameEvent('onHeroAware', object, objectEntered)
        } else {
          global.emitGameEvent('onObjectAware', object, objectEntered)
        }
      })
    }
    object._objectsAwareOf = object._objectsAwareOfNext
  }

  if(object.mod().tags.trackObjectsWithin && object._objectsWithin) {
    const left = object._objectsWithin.filter((id) => {
      return object._objectsWithinNext.indexOf(id) == -1
    })
    const entered = object._objectsWithinNext.filter((id) => {
      return object._objectsWithin.indexOf(id) == -1
    })

    left.forEach((objectLeftId) => {
      const objectLeft = OBJECTS.getObjectOrHeroById(objectLeftId)
      if(objectLeft.tags && objectLeft.tags.hero) {
        global.emitGameEvent('onHeroLeave', objectLeft, object)
      } else {
        global.emitGameEvent('onObjectLeave', objectLeft, object)
      }
    })
    entered.forEach((objectEnteredId) => {
      const objectEntered = OBJECTS.getObjectOrHeroById(objectEnteredId)
      if(objectEntered.tags && objectEntered.tags.hero) {
        global.emitGameEvent('onHeroEnter', objectEntered, object)
      } else {
        global.emitGameEvent('onObjectEnter', objectEntered, object)
      }
    })
  }

  object._objectsWithin = object._objectsWithinNext


  if(object.mod().tags.trackObjectsTouching && object._objectsTouching) {
    const left = object._objectsTouching.filter((id) => {
      return object._objectsTouchingNext.indexOf(id) == -1
    })
    const entered = object._objectsTouchingNext.filter((id) => {
      return object._objectsTouching.indexOf(id) == -1
    })

    left.forEach((objectLeftId) => {
      const objectLeft = OBJECTS.getObjectOrHeroById(objectLeftId)
      if(object.tags && object.tags.hero) {
        global.emitGameEvent('onHeroTouchEnd', object, objectLeft)
      } else {
        global.emitGameEvent('onObjectTouchEnd', object, objectLeft)
      }
    })
    entered.forEach((objectEnteredId) => {
      const objectEntered = OBJECTS.getObjectOrHeroById(objectEnteredId)
      if(object.tags && object.tags.hero) {
        global.emitGameEvent('onHeroTouchStart', object, objectEntered)
      } else {
        global.emitGameEvent('onObjectTouchStart', object, objectEntered)
      }
    })
  }


  object._objectsTouching = object._objectsTouchingNext
}


function removeAndRespawn() {
  let allHeros = getAllHeros()
  allHeros.forEach((hero) => {

    if(hero._destroy) {
      if(hero.mod().tags.respawn) {
        hero._respawn = true
      } else hero._remove = true
      hero._destroy = null
      hero._destroyedById = null
      global.emitGameEvent('onHeroDestroyed', hero, OBJECTS.getObjectOrHeroById(hero._destroyedById))
    }

    if(hero._respawn) {
      HERO.respawn(hero)
      hero._respawn = null
    }
    if(hero._remove) {
      HERO.removeHero(hero)
      hero._remove = null
    }

    if(hero.subObjects) {
      Object.keys(hero.subObjects).forEach((subObjectName) => {
        const subObject = hero.subObjects[subObjectName]
        processSubObjectRemoval(subObject)
      })
    }
  })

  GAME.objects.forEach(processObjectRemoval)
}

function processSubObjectRemoval(object) {
  if(object._destroy) {
    object._remove = true
    object._destroy = null
    object._destroyedById = null
    global.emitGameEvent('onObjectDestroyed', object, OBJECTS.getObjectOrHeroById(object._destroyedById))
  }

  if(object._remove) {
    object._remove = null
    OBJECTS.removeObject(object)
  }
}

function processObjectRemoval(object) {
  if(object._destroy) {
    if(object.mod().tags.respawn) {
      object._respawn = true
    } else {
      object._remove = true
    }
    object._destroy = null
    object._destroyedById = null
    global.emitGameEvent('onObjectDestroyed', object, OBJECTS.getObjectOrHeroById(object._destroyedById))
  }

  if(object._respawn) {
    OBJECTS.respawn(object)
    object._respawn = null
  }
  if(object._remove) {
    OBJECTS.removeObject(object)
    object._remove = null
  }

  if(object.subObjects) {
    Object.keys(object.subObjects).forEach((subObjectName) => {
      const subObject = object.subObjects[subObjectName]
      processSubObjectRemoval(subObject)
    })
  }

  if(object.constructParts) {
    object.constructParts.forEach((part) => {
      if(part._destroy) {
        part._remove = true
        part._destroy = null
        part._destroyedById = null
        global.emitGameEvent('onObjectDestroyed', part, OBJECTS.getObjectOrHeroById(part._destroyedById))
      }

      if(part._remove) {
        part.removed = true
        part._remove = null
      }
    })
  }
}

export default {
  postPhysics,
  correctAndEffectAllObjectAndHeros,
  updatePosition,
  prepareObjectsAndHerosForMovementPhase,
}
