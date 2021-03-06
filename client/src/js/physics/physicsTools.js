import { Polygon } from 'collisions';
import { testHookCondition } from '../game/hooks.js'

function shouldCheckConstructPart(part) {
  if(PHYSICS.correctedConstructs[part.ownerId]) return false
  else return true
}

function cancelConstructPart(correctedPart, owner, partPO) {
  owner.x = owner._initialX
  owner.y = owner._initialY

  owner.constructParts.forEach((part) => {
    if(part.id == correctedPart.id) return
    PHYSICS.objects[part.id].constructPart.x = part._initialX
    PHYSICS.objects[part.id].constructPart.y = part._initialY
  })

  PHYSICS.correctedConstructs[owner.id] = true
}

function correctConstructPart(correctedPart, owner, partPO) {
  const correctionX = partPO.x - correctedPart.x
  const correctionY = partPO.y - correctedPart.y

  owner.x = owner._initialX + correctionX
  owner.y = owner._initialY + correctionY

  owner.constructParts.forEach((part) => {
    PHYSICS.objects[part.id].constructPart.x += correctionX
    PHYSICS.objects[part.id].constructPart.y += correctionY
  })

  PHYSICS.correctedConstructs[owner.id] = true
  // PHYSICS.system.update()
}

/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
// HERO EFFECTS ON COLLISION
/////////////////////////////////////////////////////
function heroCollisionEffects(hero) {
  const result = PHYSICS.objects[hero.id].createResult()
  const potentials = PHYSICS.objects[hero.id].potentials()
  let illegal = false
  let correction = {x: hero.x, y: hero.y}
  let heroPO = PHYSICS.objects[hero.id]
  for(const body of potentials) {
    if(!body.gameObject) {
      if(PHYSICS.debug) console.log('missing game object on body', body)
      continue
    }
    if(body.gameObject.ownerId == hero.id) continue
    if(body.gameObject.mod().removed || (body.constructPart && body.constructPart.removed) ) continue
    if(heroPO.collides(body, result)) {
      const collider = body.gameObject

      if(body.constructPart && collider.mod().tags['seperateParts']) {
        const tags = collider.mod().tags
        body.constructPart.tags = tags
        global.local.emit('onHeroCollide', heroPO.gameObject, body.constructPart, result)
        delete body.constructPart.tags
      } else {
        global.local.emit('onHeroCollide', heroPO.gameObject, collider, result)
      }

      // dont enter objects that you cant enter...
      const heroObstacle = body.gameObject.mod().tags['obstacle'] || body.gameObject.mod().tags['noHeroAllowed']
      if(!heroObstacle && heroPO.gameObject.mod().tags['trackObjectsWithin']) {
        heroPO.gameObject._objectsWithinNext.push(body.gameObject.id)
      }

      if(heroPO.gameObject.mod().tags['trackObjectsTouching']) {
        heroPO.gameObject._objectsTouchingNext.push(body.gameObject.id)
      }
    }
  }
}

/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
// HERO CORRECTIONS
/////////////////////////////////////////////////////
function heroCorrection(hero) {
  if(hero._skipCorrections) {
    hero._skipCorrections = null
    return
  }

  let heroPO = PHYSICS.objects[hero.id]
  if(!PAGE.role.isHost) {
    heroPO.x = hero.x
    heroPO.y = hero.y
  }

  if(hero.mod().tags['skipCorrectionPhase']) {
    applyCorrection(hero, heroPO)
    return
  }

  PHYSICS.system.update()
  heroCorrectionPhase(false, 1)
  PHYSICS.system.update()
  heroCorrectionPhase(false, 2)
  PHYSICS.system.update()
  heroCorrectionPhase(true, 3)
  PHYSICS.system.update()

  function heroCorrectionPhase(final = false, round) {
    const potentials = PHYSICS.objects[hero.id].potentials()
    let illegal = false
    let landingObject = null
    let heroPO = PHYSICS.objects[hero.id]
    let corrections = []
    for(const body of potentials) {
      if(!body.gameObject) {
        if(PHYSICS.debug) console.log('missing game object on body', body)
        continue
      }
      if(body.gameObject.mod().removed || (body.constructPart && body.constructPart.removed)) continue
      let result = PHYSICS.objects[hero.id].createResult()
      if(heroPO.collides(body, result)) {
        const heroCanCollide = (body.gameObject.mod().tags['obstacle'] && !body.gameObject.mod().tags['heroPushable']) || body.gameObject.mod().tags['noHeroAllowed']
        if(heroCanCollide) {


          if(body.gameObject.mod().tags.oneWayRight) {
            if(result.overlap_x === 1 && (hero.velocityX > 0 || hero._flatVelocityX > 0)) {
              illegal = true
            }
          } else if(body.gameObject.mod().tags.oneWayLeft) {
            if(result.overlap_x === - 1 && (hero.velocityX < 0 || hero._flatVelocityX < 0)) {
              illegal = true
            }
          } else if(body.gameObject.mod().tags.oneWayDown) {
            if(result.overlap_y === - 1 && (hero.velocityY < 0 || hero._flatVelocityY < 0)) {
              illegal = true
            }
          } else if(body.gameObject.mod().tags.oneWayPlatform) {
            if(result.overlap_y === 1 && (hero.velocityY > 0 || hero._flatVelocityY > 0)) {
              illegal = true
            }
          } else {
            illegal = true
          }
          // console.log(result.collision, result.overlap, result.overlap_x, result.overlap_y)
          corrections.push(result)
          if(result.overlap_y === 1) {
            landingObject = body
          }
          if(result.overlap_y === -1) {
            landingObject = body
          }
        }

        if(final) {
          if(body.gameObject.mod().tags['Water']) {
            hero._collidingWithWater = true
          }
        }
      }
    }

    if(illegal) {
      let result = corrections.reduce((acc, next) => {
        if(Math.abs(next.overlap_y) !== 0 && acc.overlap_y == 0) {
          acc.overlap_y = next.overlap * next.overlap_y
          acc.overlap_yOG = next.overlap_y
        }
        if(Math.abs(next.overlap_x) !== 0 && acc.overlap_x == 0) {
          acc.overlap_x = next.overlap * next.overlap_x
          acc.overlap_xOG = next.overlap_x
        }
        return acc
      }, { overlap_y: 0, overlap_x: 0, overlap_xOG: 0, overlap_yOG: 0 })

      function correctHeroY() {
        let prevVelocityY = hero.velocityY
        if(result.overlap_y > 0) {
          hero.onObstacle = true
          if(landingObject && hero.velocityY > 500) {
            global.emitGameEvent('onHeroPowerLand', hero, landingObject.gameObject, result)
          }
          if(landingObject && hero.velocityY > 100) {
            global.emitGameEvent('onHeroLand', hero, landingObject.gameObject, result)
          }
          if(landingObject && landingObject.gameObject.mod().tags['movingPlatform']) {
            hero._parentId = landingObject.gameObject.id
          } else {
            if(hero.velocityY > 0) hero.velocityY = 0
            if(hero.velocityAngle) hero.velocityAngle *= .09
          }
        } else if(result.overlap_y < 0){
          if(hero.velocityY < 0) {
            hero.velocityY = 0
            if(landingObject) {
              global.emitGameEvent('onHeroHeadHit', hero, landingObject.gameObject, result)
            }
          }
          if(hero.velocityAngle) hero.velocityAngle *= .09
        }
        heroPO.y -= result.overlap_y
        if(heroPO.gameObject.mod().bouncyness) {
          if(result.overlap_yOG === 1 || result.overlap_yOG === -1) {
            heroPO.gameObject.velocityY = (prevVelocityY * heroPO.gameObject.mod().bouncyness * -1)
          }
        }
      }

      function correctHeroX() {
        let prevVelocityY = hero.velocityX

        hero._canWallJumpLeft = false
        hero._canWallJumpRight = false

        if(result.overlap_x > 0) {
          if(hero.velocityX > 0 || hero._flatVelocityX > 0) {
            hero.velocityX = 0
            hero._canWallJumpLeft = true
          }
          if(hero.velocityAngle) hero.velocityAngle *= .09
        } else if(result.overlap_x < 0){
          if(hero.velocityX < 0 || hero._flatVelocityX < 0) {
            hero.velocityX = 0
            hero._canWallJumpRight = true
          }
          if(hero.velocityAngle) hero.velocityAngle *= .09
        }
        heroPO.x -= result.overlap_x
        if(heroPO.gameObject.mod().bouncyness) {
          if(result.overlap_xOG === 1 || result.overlap_xOG === -1) {
            heroPO.gameObject.velocityX = (prevVelocityY * heroPO.gameObject.mod().bouncyness * -1)
          }
        }
      }

      // there was a problem with a double object collision. One Would
      // collide with X, one would collide with Y but both corrections were made,
      // even though one correction would have concelled out the other..
      // it was hard to tell which correction to prioritize. Basically now
      // I prioritize the correction that DOES NOT IMPEDE the heros current direction
      if(round === 1) {
        if(hero.directions && (hero.directions.up || hero.directions.down)) {
          correctHeroX()
        } else if(hero.directions && (hero.directions.left || hero.directions.right)) {
          correctHeroY()
        }
      } else {
        correctHeroX()
        correctHeroY()
      }
    }

    if(final) {

      hero.directions = {...global.defaultHero.directions}
      // just give up correction and prevent any movement from these mother fuckers
      if(illegal) {
        hero.x = hero._initialX
        hero.y = hero._initialY
        heroPO.x = hero._initialX
        heroPO.y = hero._initialY
      } else {
        applyCorrection(hero, heroPO)
      }
    }
  }
  return hero
}

/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
// OBJECTS COLLIDING WITH OTHER OBJECTS
/////////////////////////////////////////////////////
function objectCollisionEffects(po) {
  let potentials = po.potentials()
  let result = po.createResult()
  // po VS body. the po is the one you should EFFECT

  for(const body of potentials) {
    if(!body.gameObject) {
      if(PHYSICS.debug) console.log('missing game object on body', body)
      continue
    }
    if(body.gameObject.mod().removed || (body.constructPart && body.constructPart.removed)) continue
    // subobjects and construct parts dont collider with their owners
    if(po.gameObject.ownerId === body.gameObject.id) continue
    if(po.collides(body, result)) {
      let collider = body.gameObject
      let agent = po.gameObject

      const colliderIsInteractable = OBJECTS.isInteractable(agent, collider) && !collider.ownerId
      if(agent.mod().tags['heroInteractTriggerArea'] && colliderIsInteractable) {
        let hero = GAME.heros[agent.ownerId]
        // sometimes the hero could be logged off

        const colliderIsHidden = collider.mod().tags.hidden && !hero.mod().tags.seeHiddenObjects

        if(hero && !colliderIsHidden) {
          const hooks = global.getHooksByEventName(collider.mod(), 'onObjectInteractable')

          let passed = true
          if(hooks.length) {
            passed = hooks.every((hook) => {
              return hook.conditionList.every((condition) => {
                return testHookCondition(collider, hero, collider, condition)
              })
            })
          }

          if(passed) {
            if(!hero.interactableObjectId) {
              hero.interactableObjectId = collider.id
            } else {
              const interactableObject = OBJECTS.getObjectOrHeroById(hero.interactableObjectId)
              if(collider.mod().width < interactableObject.mod().width || collider.mod().height < interactableObject.mod().height) {
                hero.interactableObjectId = collider.id
              }
            }
            if(hero._prevInteractableObjectId !== hero.interactableObjectId) {
              global.emitGameEvent('onUpdatePlayerUI', hero)
              global.emitGameEvent('onHeroCanInteract', hero, collider)
            }
          }
        }
      }

      if(collider.mod().tags.noticeable && agent.mod().tags['awarenessTriggerArea']) {
        let owner = OBJECTS.getObjectOrHeroById(agent.ownerId)
        // sometimes a hero could be logged off?
        if(owner) {
          owner._objectsAwareOfNext.push(collider.id)
        }
      }


      const isSafeZone = agent.mod().tags['monster'] && collider.mod().tags && collider.mod().tags['noMonsterAllowed']
      const bothAreObstacles = agent.tags && agent.mod().tags['obstacle'] && collider.tags && collider.mod().tags['obstacle']
      if(collider.mod().tags.noticeable && agent.mod().tags.trackObjectsWithin) {
        if(!isSafeZone && !bothAreObstacles) {
          agent._objectsWithinNext.push(collider.id)
        }
      }

      const obstacleHittingHero = agent.tags && agent.mod().tags['obstacle'] && collider.tags && collider.mod().tags['hero']
      if(agent.mod().tags.trackObjectsTouching) {
        if((agent.tags && agent.mod().tags['obstacle'] && isSafeZone) || bothAreObstacles || obstacleHittingHero) {
          agent._objectsTouchingNext.push(collider.id)
        }
      }

      if(body.constructPart && collider.mod().tags['seperateParts']) {
        const tags = collider.mod().tags
        body.constructPart.tags = tags
        global.local.emit('onObjectCollide', agent, body.constructPart, result, po)
        delete body.constructPart.tags
      } else {
        // this will only not get called if you set ( notInCollisions )
        global.local.emit('onObjectCollide', agent, collider, result, po)
      }
    }
  }
}


/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
// OBJECT CORRECTIONS
/////////////////////////////////////////////////////
function objectCorrection(po, final) {
  // if you are creating a result up here youll only be able to correct for one obj at a time
  // if you are accumulating the result like for the hero
  let result = po.createResult()
  let correction = {x: po.x, y: po.y}
  let potentials = po.potentials()
  let illegal = false
  for(const body of potentials) {
    // for construct parts
    if(po.gameObject === body.gameObject) continue
    if(!body.gameObject) {
      if(PHYSICS.debug) console.log('missing game object on body', body)
      continue
    }
    if(body.gameObject.mod().removed || (body.constructPart && body.constructPart.removed)) continue
    if(po.collides(body, result)) {
      // OK noMonsterAllowed basically acts as a SAFE ZONE for now
      if(po.gameObject.mod().tags['monster'] && body.gameObject.tags && body.gameObject.mod().tags['noMonsterAllowed']) {
        if(Math.abs(result.overlap_x) !== 0) {
          illegal = true
          correction.x -= result.overlap * result.overlap_x
        }
        if(Math.abs(result.overlap_y) !== 0) {
          illegal = true
          correction.y -= result.overlap * result.overlap_y
        }
        break;
      }

      // objects with NO path but SOME velocity get corrections
      let noPathButHasVelocity = (!po.gameObject.path && (po.gameObject.velocityY && po.gameObject.velocityY !== 0 || po.gameObject.velocityX && po.gameObject.velocityX !== 0))
      let bothAreObstacles = po.gameObject.tags && po.gameObject.mod().tags['obstacle'] && body.gameObject.tags && body.gameObject.mod().tags['obstacle']
      if(bothAreObstacles && (noPathButHasVelocity || po.gameObject.mod().tags['heroPushable'])) {
        if(Math.abs(result.overlap_x) !== 0) {
          illegal = true
          correction.x -= result.overlap * result.overlap_x
        }
        if(Math.abs(result.overlap_y) !== 0) {
          illegal = true
          correction.y -= result.overlap * result.overlap_y
        }
        break;
      }

      if(po.gameObject.tags && po.gameObject.mod().tags['heroPushable'] && body.gameObject.tags && body.gameObject.mod().tags['hero']) {
        if(Math.abs(result.overlap_x) !== 0) {
          illegal = true
          correction.x -= result.overlap * result.overlap_x
        }
        if(Math.abs(result.overlap_y) !== 0) {
          illegal = true
          correction.y -= result.overlap * result.overlap_y
        }
        break;
      }

    }
  }

  if(illegal) {
    let prevVelocityY = po.gameObject.velocityY
    let prevVelocityX = po.gameObject.velocityX


    if(po.gameObject.mod().bouncyness) {
      if(po.gameObject.tags.rotateable) {
        if(po.gameObject.tags.richochet) {
          po.gameObject.angle+=global.degreesToRadians(global.getRandomInt(0, 180))
        } else {
          po.gameObject.angle+=global.degreesToRadians(180)
        }
        po.gameObject.velocityAngle = (po.gameObject.velocityAngle * po.gameObject.mod().bouncyness)

      } else {
        if(result.overlap_y === 1 || result.overlap_y === -1) {
          po.gameObject.velocityY = (prevVelocityY * po.gameObject.mod().bouncyness * -1)
        }
        if(result.overlap_x === 1 || result.overlap_x === -1) {
          po.gameObject.velocityX = (prevVelocityX * po.gameObject.mod().bouncyness * -1)
        }
      }
    } else {
      if(result.overlap_y === 1) {
        // if(po.gameObject.velocityY > 0) {
          po.gameObject.velocityY = 0
          po.gameObject.onObstacle = true
        // }
      } else if(result.overlap_y === -1){
        // if(po.gameObject.velocityY < 0)
         po.gameObject.velocityY = 0
      }
      if(result.overlap_x === 1) {
        // if(po.gameObject.velocityX > 0)
        po.gameObject.velocityX = 0
      } else if(result.overlap_x === -1){
        // if(po.gameObject.velocityX < 0)
        po.gameObject.velocityX = 0
      }
    }
    po.x = correction.x
    po.y = correction.y


  }

  if(final) {

    const object = po.gameObject

    if(po.constructPart) {
      // just give up correction and prevent any movement from these mother fucker
      if(illegal) {
        cancelConstructPart(po.constructPart, po.gameObject, po)
      } else {
        correctConstructPart(po.constructPart, po.gameObject, po)
      }
    } else {
      // just give up correction and prevent any movement from these mother fuckers
      if(illegal) {
        object.x = object._initialX
        object.y = object._initialY
      } else {
        applyCorrection(object, po)
      }
    }
  }
}

function containObjectWithinGridBoundaries(object) {
  //DO THE PACMAN FLIP!!
  let gameBoundaries = GAME.world.gameBoundaries
  if(gameBoundaries && typeof gameBoundaries.x == 'number') {
    let objectToEdit = object
    if(object.mod().tags.fresh) {
      objectToEdit = JSON.parse(JSON.stringify(object))
    }

    if(object.flags && object.flags.isAdmin) return

    if(object.mod().tags.ignoreWorldBoundaries) {
      //ALWAYS CONTAIN WITHIN BOUNDARIES OF THE GRID!!
      if(GAME.world.tags.preventHeroGridBypass || object.tags.hero == false) {
        if(object.x + object.mod().width > (GAME.grid.nodeSize * GAME.grid.width) + GAME.grid.startX) {
          object.x = (GAME.grid.nodeSize * GAME.grid.width) + GAME.grid.startX - object.mod().width
        }
        if(object.y + object.mod().height > (GAME.grid.nodeSize * GAME.grid.height) + GAME.grid.startY) {
          object.y = (GAME.grid.nodeSize * GAME.grid.height) + GAME.grid.startY - object.mod().height
        }
        if(object.x < GAME.grid.startX) {
          object.x = GAME.grid.startX
        }
        if(object.y < GAME.grid.startY) {
          object.y = GAME.grid.startY
        }
      }
      return
    }

    let bottom = false
    let legal = true

    if(gameBoundaries.behavior === 'purgatory' && object.id.indexOf('hero') == -1 && (GAME.heros[HERO.id] && HERO.id)) {
      // FOR ZOOM IN PURGATORY, PURGATORY ONLY SUPPORTS 1 PLAYER RIGHT NOW
      let hero = GAME.heros[HERO.id]
      if(PAGE.role.isPlayEditor) {
        hero = global.editingHero
      }

      if(objectToEdit.x + objectToEdit.mod().width > gameBoundaries.x + gameBoundaries.width - ((HERO.cameraWidth * hero.zoomMultiplier)/2 )) {
        objectToEdit.x = gameBoundaries.x + gameBoundaries.width - objectToEdit.mod().width - (HERO.cameraWidth * hero.zoomMultiplier)/2
        legal = false
      }
      if(objectToEdit.y + objectToEdit.mod().height > gameBoundaries.y + gameBoundaries.height - ((HERO.cameraHeight * hero.zoomMultiplier)/2 )) {
        objectToEdit.y = gameBoundaries.y + gameBoundaries.height - objectToEdit.mod().height - ((HERO.cameraHeight * hero.zoomMultiplier)/2 )
        legal = false
        bottom = true
      }
      if(objectToEdit.x < gameBoundaries.x + ((HERO.cameraWidth * hero.zoomMultiplier)/2)) {
        objectToEdit.x = gameBoundaries.x + ((HERO.cameraWidth * hero.zoomMultiplier)/2)
        legal = false
      }
      if(objectToEdit.y < gameBoundaries.y + ((HERO.cameraHeight * hero.zoomMultiplier)/2)) {
        objectToEdit.y = gameBoundaries.y + ((HERO.cameraHeight * hero.zoomMultiplier)/2)
        legal = false
      }
      if(legal && object.mod().tags.fresh){
        object.tags.fresh = false
        object.path = null
      }
    } else if(gameBoundaries.behavior === 'pacmanFlip' || (gameBoundaries.behavior === 'purgatory' && object.id.indexOf('hero') > -1)) {

      if(objectToEdit.x < gameBoundaries.x - objectToEdit.mod().width) {
        objectToEdit.x = gameBoundaries.x + gameBoundaries.width
        legal = false
      }
      if (objectToEdit.x > gameBoundaries.x + gameBoundaries.width) {
        objectToEdit.x = gameBoundaries.x - objectToEdit.mod().width
        legal = false
      }
      if(objectToEdit.y < gameBoundaries.y - objectToEdit.mod().height) {
        objectToEdit.y = gameBoundaries.y + gameBoundaries.height
        legal = false
      }
      if (objectToEdit.y > gameBoundaries.y + gameBoundaries.height) {
        objectToEdit.y = gameBoundaries.y - objectToEdit.mod().height
        legal = false
        bottom = true
      }
      if(legal && object.mod().tags.fresh){
        object.tags.fresh = false
        object.path = null
      }
    } else {
      const shouldContain = gameBoundaries.behavior == 'boundaryAll' || objectToEdit.id.indexOf('hero') > -1
      //CONTAIN WITHIN BOUNDARIES OF THE GAME BOUNDARY PREF!!
      if(objectToEdit.x + objectToEdit.mod().width > gameBoundaries.x + gameBoundaries.width) {
        if(shouldContain) {
          objectToEdit.x = gameBoundaries.x + gameBoundaries.width - objectToEdit.mod().width
          objectToEdit.velocityX = 0
        }
        legal = false
      }
      if(objectToEdit.y + objectToEdit.mod().height > gameBoundaries.y + gameBoundaries.height) {
        if(shouldContain) {
          objectToEdit.y = gameBoundaries.y + gameBoundaries.height - objectToEdit.mod().height
          objectToEdit.velocityY = 0
        }
        legal = false
        bottom = true
      }
      if(objectToEdit.x < gameBoundaries.x) {
        if(shouldContain)  {
          objectToEdit.x = gameBoundaries.x
          objectToEdit.velocityX = 0
        }
        legal = false
      }
      if(objectToEdit.y < gameBoundaries.y) {
        if(shouldContain) {
          objectToEdit.y = gameBoundaries.y
          objectToEdit.velocityY = 0
        }
        legal = false
      }
    }

    if(legal && object.mod().tags.fresh){
      object.tags.fresh = false
      object.path = null
    }

    if(!legal && !object.tags.hero && !object.reserved && GAME.world.tags.gameBoundaryDestroyObjects) {
      object._destroy = true
    }
    if(!legal && object.tags.hero && GAME.world.tags.gameBoundaryDestroyHero) {
      object._destroy = true
    }
    if(bottom && object.tags.hero && GAME.world.tags.gameBoundaryBottomDestroyHero) {
      object._destroy = true
    }
  }

  //ALWAYS CONTAIN WITHIN BOUNDARIES OF THE GRID!!
  if(GAME.world.tags.preventHeroGridBypass || object.tags.hero == false) {
    if(object.x + object.mod().width > (GAME.grid.nodeSize * GAME.grid.width) + GAME.grid.startX) {
      object.x = (GAME.grid.nodeSize * GAME.grid.width) + GAME.grid.startX - object.mod().width
    }
    if(object.y + object.mod().height > (GAME.grid.nodeSize * GAME.grid.height) + GAME.grid.startY) {
      object.y = (GAME.grid.nodeSize * GAME.grid.height) + GAME.grid.startY - object.mod().height
    }
    if(object.x < GAME.grid.startX) {
      object.x = GAME.grid.startX
    }
    if(object.y < GAME.grid.startY) {
      object.y = GAME.grid.startY
    }
  }
}

function rotatePoint(point, center, radian){
  // console.log(point.x - center.x)
    var rotatedX = Math.cos(radian) * (point.x - center.x) - Math.sin(radian) * (point.y-center.y) + center.x;

    var rotatedY = Math.sin(radian) * (point.x - center.x) + Math.cos(radian) * (point.y - center.y) + center.y;

    return {rotatedX, rotatedY}
}

function relativePositioning(owner, subObject) {
  if(subObject.relativeWidth) subObject.width = owner.mod().width + (subObject.relativeWidth)
  if(subObject.relativeHeight) subObject.height = owner.mod().height + (subObject.relativeHeight)

  if(subObject.mod().tags.rotateable && (subObject.mod().tags.relativeToDirection || subObject.mod().tags.relativeToAngle)) {
    const direction = owner.inputDirection || owner._movementDirection

    let radians = 0

    if(subObject.mod().tags.relativeToAngle && owner.mod().tags.rotateable) {
      radians = owner.angle
    } else if(subObject.mod().tags.relativeToDirection) {
      if(direction === 'right') {
        radians = degreesToRadians(90)
      }

      // down
      if(direction === 'down') {
        radians = degreesToRadians(180)
      }

      // left
      if(direction === 'left') {
        radians = degreesToRadians(270)
      }
    }


    var rotatedRelativeX = Math.cos(radians) * (subObject.mod().relativeX) - Math.sin(radians) * (subObject.mod().relativeY);
    var rotatedRelativeY = Math.sin(radians) * (subObject.mod().relativeX) + Math.cos(radians) * (subObject.mod().relativeY);

    subObject.x = owner.x + owner.mod().width/2 + rotatedRelativeX - subObject.mod().width/2
    subObject.y = owner.y + owner.mod().height/2 + rotatedRelativeY - subObject.mod().height/2

    subObject.angle = radians
  } else {
    if(typeof subObject.mod().relativeX === 'number') subObject.x = owner.x + owner.mod().width/2 + subObject.mod().relativeX - subObject.mod().width/2
    if(typeof subObject.mod().relativeY === 'number') subObject.y = owner.y + owner.mod().height/2 + subObject.mod().relativeY - subObject.mod().height/2
  }
}

function attachSubObjects(owner, subObjects) {
  OBJECTS.forAllSubObjects(subObjects, (subObject) => {
    relativePositioning(owner, subObject)
  })
}

function attachToParent(object) {
  let parent = GAME.objectsById[object.mod().parentId] || GAME.heros[object.mod().parentId]

  if(parent) {
    object.x += parent._deltaX
    object.y += parent._deltaY
  } else object.parentId = null

  parent = GAME.objectsById[object._parentId] || GAME.heros[object._parentId]
  if(parent) {
    object.x += parent._deltaX
    object.y += parent._deltaY
  } else object._parentId = null
}

function attachToRelative(object) {
  let relative = GAME.objectsById[object.mod().relativeId] || GAME.heros[object.mod().relativeId]

  if(relative) {
    object.x = relative.x + object.mod().relativeX
    object.y = relative.y + object.mod().relativeY
  } else object.relativeId = null
}

function addObject(object) {
  if(PHYSICS.objects[object.id]) return console.log("we already have added a physics object with id " + object.id)
  if(object.tags && object.tags.notInCollisions) return
  const physicsObject = new Polygon(object.x, object.y, [ [ 0, 0], [object.mod().width, 0], [object.mod().width, object.mod().height] , [0, object.mod().height]])
  PHYSICS.system.insert(physicsObject)
  PHYSICS.objects[object.id] = physicsObject
  return physicsObject
}

function removeObject(object) {
  if(object.tags && object.tags.notInCollisions) return
  try {
    PHYSICS.system.remove(PHYSICS.objects[object.id])
    delete PHYSICS.objects[object.id];
  } catch(e) {
    console.error(object, e)
  }
}

function applyCorrection(object, po) {
  if(object.mod().tags.hero) {
    if(po.x > object._initialX) {
      object.directions.right = true
    } else if(po.x < object._initialX) {
      object.directions.left = true
    }
    if(po.y > object._initialY) {
      object.directions.down = true
    } else if(po.y < object._initialY) {
      object.directions.up = true
    }
  } else {
    if(object.x > object._initialX) {
      object._movementDirection = 'right'
    } else if(object.x < object._initialX) {
      object._movementDirection = 'left'
    }
    if(object.y > object._initialY) {
      object._movementDirection = 'down'
    } else if(object.y < object._initialY) {
      object._movementDirection = 'up'
    }
  }
  object.x = po.x
  object.y = po.y
  if(object.mod().tags.rotateable) {
    object.x -= object.mod().width/2
    object.y -= object.mod().height/2
  }
}

function checkIfShouldRunPhysics(gameObject) {
  gameObject = gameObject.mod()

  if(gameObject.removed || gameObject.tags.potential || gameObject.tags.notInCollisions) return false


  if(gameObject.tags.subObject && gameObject.tags.onMapWhenEquipped) {
    if(gameObject.isEquipped && (gameObject.actionButtonBehavior !== 'toggle' || !gameObject._toggledOff)) return true
    if(!gameObject.isEquipped || gameObject._toggledOff) return false
  }

  return true
}

export {
  checkIfShouldRunPhysics,
  applyCorrection,
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
  relativePositioning,
}
