import onObjectCollide from './onObjectCollide.js'
import pathfinding from '../../utils/pathfinding.js'
import collisions from '../../utils/collisions.js'
import gridUtil from '../../utils/grid.js'
import triggers from '../triggers.js'
import { dropObject, equipSubObject, unequipSubObject } from '../heros/inventory.js'
import { addHook, deleteHook } from '../hooks.js'
import { spawnAllNow, destroySpawnIds } from '../spawnZone.js'
import { setTarget, setPathTarget } from '../ai/pathfinders.js'

class Objects{
  constructor() {
    global.defaultObjectColor = '#525252'
    global.defaultSubObject = {
      relativeX: 0, relativeY: 0,
      objectType: 'subObject',
      defaultSprite: 'solidcolorsprite',
      count: 1,
    }

    global.defaultObject = {
      velocityX: 0,
      velocityY: 0,
      velocityMax: 700,
      velocityInitial: 120,
      subObjects: {},
      objectType: 'plainObject',
      defaultSprite: 'solidcolorsprite',
      heroDialogueSet: 'default',
    }
  }

  onGridLoaded() {
    global.defaultObject.width = GAME.grid.nodeSize
    global.defaultObject.height = GAME.grid.nodeSize
    global.defaultSubObject.width = GAME.grid.nodeSize
    global.defaultSubObject.height = GAME.grid.nodeSize
    global.defaultSubObject.tags = { subObject: true }
  }

  onGameLoaded() {
    // global.defaultObject.tags = global.tags
    // global.mergeDeep(global.defaultObject.tags, global.plainObjectTags)
  }

  onObjectCollide(agent, collider, result, agentPO) {
    onObjectCollide(agent, collider, result, agentPO)
  }

  forAllSubObjects(subObjects, fx) {
    if(!subObjects) return
    Object.keys(subObjects).forEach((id) => {
      fx(subObjects[id], id)
    })
  }

  respawn(object) {
    let originalX = object.x
    const {x, y } = OBJECTS.getSpawnCoords(object)
    object.x = x
    object.y = y
    object.velocityX = 0
    object.velocityY = 0
    OBJECTS.forAllSubObjects(object.subObjects, (subObject) => {
      if(subObject.mod().tags.dropOnOwnerRespawn) {
        dropObject(object, subObject)
      }
    })
  }

  getSpawnCoords(object) {
    return {
      x: object.mod().spawnPointX,
      y: object.mod().spawnPointY
    }
  }

  migratePos(object, newPos) {
    let diffX = newPos.x - object.x
    let diffY = newPos.y - object.y
    //also update children
    // console.log(diffX, diffY, newPos, object)

    // game.objects.forEach((childObject) => {
    //   if(childObject.parentId === object.id) {
    //     global.setObjectPos(childObject, {x: childObject.x + diffX, y: childObject.y + diffY}, game)
    //   }
    // })

    if(object.mod().pathfindingLimit) {
      // you need to make sure diffX, diffY is also at the x, y grid locations ( the object could be inbetween grids if it has velocity )
      const { x, y } = gridUtil.snapXYToGrid(diffX, diffY)
      object.pathfindingLimit.x += x
      object.pathfindingLimit.y += y
      // grid.snapDragToGrid(object.pathfindingLimit, {dragging: true})
    }

    object.spawnPointX += diffX
    object.spawnPointY += diffY
    object.x = newPos.x
    object.y = newPos.y
  }

  getState(object) {
    let state = {
      x: object.x,
      y: object.y,
      _initialY: object._initialY,
      _initialX: object._initialX,
      _deltaY: object._deltaY,
      _deltaX: object._deltaX,
      velocityY: object.velocityY,
      velocityX: object.velocityX,
      lastHeroUpdateId: object.lastHeroUpdateId,
      _movementDirection: object._movementDirection,
      _goalDirection: object._goalDirection,
      fresh: object.fresh,
      gridX: object.gridX,
      gridY: object.gridY,
      sprite: object.sprite,
      _parentId: object._parentId,
      _skipNextGravity: object._skipNextGravity,
      _breakMaxVelocity: object._breakMaxVelocity,
      gridHeight: object.gridHeight,
      gridWidth: object.gridWidth,
      onObstacle: object.onObstacle,
      removed: object.removed,
      spawnedIds: object.spawnedIds,
      spawnWait: object.spawnWait,
      spawnPool: object.spawnPool,
      customState: object.customState,
      inInventory: object.inInventory,
      isEquipped: object.isEquipped,
      _objectsWithin: object._objectsWithin,
      _objectsTouching: object._objectsTouching,
      _objectsAwareOf: object._objectsAwareOf,
      _flipY: object._flipY,

      _tempMods: object._tempMods,

      _lastLightColorChangeTime: object._lastLightColorChangeTime,
      _lastLightOpacityChangeTime: object._lastLightOpacityChangeTime,
      _lastLightPowerChangeTime: object._lastLightPowerChangeTime,
      _lastColorChangeTime: object._lastColorChangeTime,
      _rotateDirection: object._rotateDirection,

      targetXY: object.targetXY,
      path: object.path,
      _targetPursueId: object._targetPursueId,
      //^^ older
      // targetFollowId:  object.targetFollowId,

      _shakePower: object._shakePower,
      _flashWhite: object._flashWhite,

      _pathIdIndex: object._pathIdIndex,
      _pathWait: object._pathWait,
      _pathOnWayBack:  object._pathOnWayBack,

      _pfGrid: object.pfGrid,

      _toggledOff: object._toggledOff,

      navigationTargetId:  object.navigationTargetId,

      createdTime: object.createdTime,

      actionState: object.actionState,

      _timeUntilDestroyed: object._timeUntilDestroyed,
    }

    if(object.subObjects) {
      state.subObjects = {}
      OBJECTS.forAllSubObjects(object.subObjects, (subObject, subObjectName) => {
        state.subObjects[subObjectName] = OBJECTS.getState(subObject)
        global.removeFalsey(state.subObjects[subObjectName])
      })
    }

    if(object.triggers) {
      state.triggers = {}
      Object.keys(object.triggers).forEach((triggerId) => {
        const { pool, eventCount, disabled } = object.triggers[triggerId]

        state.triggers[triggerId] = {
          pool,
          eventCount,
          disabled,
        }

        global.removeFalsey(state.triggers[triggerId])
      })
    }

    return state
  }

  getProperties(object) {
    let properties = {
      id: object.id,
      objectType: object.objectType,

      puzzleCombination: object.puzzleCombination,
      puzzlePassword: object.puzzlePassword,

      velocityMax: object.velocityMax,
      gravityVelocityY: object.gravityVelocityY,
      bouncyness: object.bouncyness,

      ambientLight: object.ambientLight,
      lightPower: object.lightPower,
      lightColor: object.lightColor,
      lightOpacity: object.lightOpacity,

      gameOverReason: object.gameOverReason,

      sprites: object.sprites,

      _tempModOnMap: object._tempModOnMap,

      velocityInitial: object.velocityInitial,
      velocityDelta: object.velocityDelta,
      // velocityInitialXExtra: object.velocityInitialXExtra,
      // velocityInitialYExtra: object.velocityInitialYExtra,
      width: object.width,
      height: object.height,
      tags: object.tags,
      descriptors: object.descriptors,
      color: object.color,
      defaultSprite: object.defaultSprite,
      upSprite: object.upSprite,
      leftSprite: object.leftSprite,
      downSprite: object.downSprite,
      rightSprite: object.rightSprite,
      spawnPointX: object.spawnPointX,
      spawnPointY: object.spawnPointY,
      heroDialogue: object.heroDialogue,
      heroDialogueSet: object.heroDialogueSet,
      heroDialogueSets: object.heroDialogueSets,
      pathfindingLimit: object.pathfindingLimit,

      scoreAddPopoverText: object.scoreAddPopoverText,
      scoreSubtractPopoverText: object.scoreSubtractPopoverText,
      relativeX: object.relativeX,
      relativeY: object.relativeY,
      relativeId: object.relativeId,
      parentId: object.parentId,
      name: object.name,
      namePosition: object.namePosition,
      questGivingId: object.questGivingId,
      questCompleterId: object.questCompleterId,
      hooks: object.hooks,
      subObjectChances: object.subObjectChances,
      spawned: object.spawned,
      reserved: object.reserved,
      opacity: object.opacity,

      scoreAdd: object.scoreAdd,
      scoreSubtract: object.scoreSubtract,

      emitterData: object.emitterData,
      emitterType: object.emitterType,
      emitterTypeExplosion: object.emitterTypeExplosion,
      emitterTypePoweredUp: object.emitterTypePoweredUp,
      emitterTypeJump: object.emitterTypeJump,
      emitterTypeDash: object.emitterTypeDash,
      emitterTypeHeroCollide: object.emitterTypeHeroCollide,

      increaseHeroCurrentVelocityAmount: object.increaseHeroCurrentVelocityAmount,
      heroTempMod: object.heroTempMod,

      // equipment
      actionButtonBehavior: object.actionButtonBehavior,
      actionProps: object.actionProps,
      actionButtonBehaviorLabel: object.actionButtonBehaviorLabel,

      // equipBehavior: object.equipBehavior,
      // equipProps: object.equipProps,

      // inventory
      count: object.count,

      sequences: object.sequences,

      constructParts: object.constructParts && object.constructParts.map((part) => {
        return {
          id: part.id,
          x: part.x,
          y: part.y,
          color: part.color,
          height: part.height,
          width: part.width,
          ownerId: part.ownerId,
          defaultSprite: part.defaultSprite,
        }
      }),

      pathParts:  object.pathParts,
      customGridProps: object.customGridProps,

      pathId:  object.pathId,
      pathfindingLimitId: object.pathfindingLimitId,
      pathfindingGridId: object.pathfindingGridId,

      // sub objects
      relativeWidth: object.relativeWidth,
      relativeHeight: object.relativeHeight,
      subObjectName: object.subObjectName,

      //spawn zones
      spawnPoolInitial: object.spawnPoolInitial,
      spawnWaitTimer: object.spawnWaitTimer,
      spawnLimit: object.spawnLimit,

      //resource zones
      resourceWithdrawAmount: object.resourceWithdrawAmount,
      resourceTags: object.resourceTags,
      resourceLimit: object.resourceLimit,

      powerUpTimer: object.powerUpTimer,

      popoverText: object.popoverText,

      //compendium
      compendiumId: object.compendiumId,
      fromCompendiumId: object.compendiumId,

      customProps: object.customProps,

      monsterEffect: object.monsterEffect,
      monsterEffectValue: object.monsterEffectValue,

    }

    if(object.subObjects) {
      properties.subObjects = {}
      OBJECTS.forAllSubObjects(object.subObjects, (subObject, subObjectName) => {
        properties.subObjects[subObjectName] = OBJECTS.getProperties(subObject)
      })
    }

    if(object.triggers) {
      properties.triggers = {}
      Object.keys(object.triggers).forEach((triggerId) => {
        const { id,           effectBranchName,
testAndModOwnerWhenEquipped, testFailDestroyMod, testPassReverse, testModdedVersion, conditionValue, conditionNumber, conditionType, conditionJSON, conditionEventName, eventName, effectName, eventThreshold, effectValue, effectJSON, mainObjectId, mainObjectTag, guestObjectId, guestObjectTag, initialTriggerPool, effectorObject, effectedMainObject, effectedGuestObject, effectedWorldObject, effectedOwnerObject, effectedIds, effectedTags, effectSequenceId, effectTags,           conditionMainObjectId,
                  conditionMainObjectTag,
                  conditionGuestObjectId,
                  conditionGuestObjectTag,
                  effectLibraryMod,
                  effectLibraryObject,
                  effectLibrarySubObject,
                  notificationLog,
                  notificationChat,
                  notificationToast,
                  notificationModal,
                  notificationModalHeader,
                  notificationText,
                  notificationAllHeros,
                  notificationAllHerosInvolved,
                  notificationDuration,
                  modEndOthers,
                  modId,
                  modPriority,
                  modResetPhysics,
                  modResetPhysicsEnd,
                  triggerDestroyAfter,
                  triggerDontUseDefaults
                 } = object.triggers[triggerId]

        properties.triggers[triggerId] = {
          id,
          effectName,
          effectValue,
          effectJSON,
          effectorObject,
          effectedMainObject,
          effectedGuestObject,
          effectedOwnerObject,
          effectedWorldObject,
          effectedIds,
          effectedTags,
          effectTags,
          effectSequenceId,
          effectLibraryMod,
          effectLibraryObject,
          effectLibrarySubObject,
          effectBranchName,
          eventName,
          eventThreshold,
          initialTriggerPool,
          mainObjectId,
          mainObjectTag,
          guestObjectId,
          guestObjectTag,

          // for mod currently, might move to a .mod property and use these for actual condition on the trigger
          testAndModOwnerWhenEquipped,
          testFailDestroyMod,
          testPassReverse,
          testModdedVersion,
          conditionValue,
          conditionType,
          conditionJSON,
          conditionEventName,
          conditionMainObjectId,
          conditionMainObjectTag,
          conditionGuestObjectId,
          conditionGuestObjectTag,
          conditionNumber,
          modEndOthers,
          modId,
          modPriority,
          modResetPhysics,
          modResetPhysicsEnd,
          notificationLog,
          notificationChat,
          notificationToast,
          notificationModal,
          notificationModalHeader,
          notificationText,
          notificationAllHeros,
          notificationAllHerosInvolved,
          notificationDuration,


          triggerDestroyAfter,
          triggerDontUseDefaults
        }

        global.removeFalsey(properties.triggers[triggerId])
      })
    }

    return properties
  }

  getMapState(object) {
    let mapState = {
      id: object.id,
      x: object.x,
      y: object.y,
      chat: object.chat,
      width: object.width,
      height: object.height,
      color: object.color,
      name: object.name,
      sprite: object.sprite,
      defaultSprite: object.defaultSprite,

      lightPower: object.lightPower,
      lightColor: object.lightColor,
      lightOpacity: object.lightOpacity,

      popoverText: object.popoverText,
      namePos: object.namePos,
      removed: object.removed,
      angle: object.angle,
      _flipY: object._flipY,
      spawnPointX: object.spawnPointX,
      spawnPointY: object.spawnPointY,
      emitterData: object.emitterData,
      tags: object.tags,
      ownerId: object.ownerId,
      constructParts: object.constructParts && object.constructParts.map((part) => {
        return {
          id: part.id,
          ownerId: part.ownerId,
          x: part.x,
          y: part.y,
          color: part.color,
          height: part.height,
          width: part.width,
        }
      }),

      spawnPool: object.spawnPool,

      // ? needed?
      // emitterTypeExplosion: object.emitterTypeExplosion,
      // emitterTypeAction: object.emitterTypeAction,

      isEquipped: object.isEquipped,
      inInventory: object.inInventory,

      path: object.path,
      targetXY: object.targetXY,

      _shakePower: object._shakePower,
      _flashWhite: object._flashWhite,

      actionState: object.actionState,
      actionButtonBehaviorLabel: object.actionButtonBehaviorLabel,

      subObjectName: object.subObjectName,
    }

    if(object.subObjects) {
      mapState.subObjects = {}
      OBJECTS.forAllSubObjects(object.subObjects, (subObject, subObjectName) => {
        mapState.subObjects[subObjectName] = OBJECTS.getMapState(subObject)
      })
    }

    return mapState
  }

  getInteractions(hero, object) {
    let interactions = []
    if((object.mod().tags['completeQuestOnHeroInteract'] && object.mod().tags['questCompleter'])) {
      interactions.push({text: 'Complete Quest', tag: 'completeQuestOnHeroInteract', interaction: 'completeQuest'})
    }

    if(object.mod().tags['puzzleStartOnHeroInteract']) {
      interactions.push({text: 'Solve Puzzle', tag: 'puzzleStartOnHeroInteract', interaction: 'puzzleStart'})
    }

    if((object.mod().tags['giveQuestOnHeroInteract'] && object.mod().tags['questGiver'])) {
      interactions.push({text: 'Get Quest', tag: 'giveQuestOnHeroInteract', interaction: 'giveQuest'})
    }

    if(object.mod().tags['spawnOnHeroInteract'] && object.mod().tags.spawnZone) {
      interactions.push({text: 'Open', tag: 'spawnOnHeroInteract', interaction: 'spawn'})
    }

    // if(object.mod().tags['updateHeroOnHeroInteract'] && object.mod().tags.heroUpdate) {
    //   interactions.push({text: 'Open', tag: 'spawnOnHeroInteract'})
    // }

    if(object.mod().tags['talkOnHeroInteract'] && object.mod().tags.talker) {
      interactions.push({text: 'Talk/Examine', tag: 'talkOnHeroInteract', interaction: 'talk'})
    }

    if(object.mod().tags['pickupOnHeroInteract'] && object.mod().tags.pickupable) {
      interactions.push({text: 'Pickup', tag: 'pickupOnHeroInteract', interaction: 'pickup'})
    }

    if(object.mod().tags['spawnAllInHeroInventoryOnHeroInteract'] && object.mod().tags.spawnZone) {
      interactions.push({text: 'Open', tag: 'spawnAllInHeroInventoryOnHeroInteract', interaction: 'spawnAllInHeroInventory'})
    }

    if(object.mod().tags['resourceWithdrawOnInteract'] && object.mod().tags.resourceZone) {
      interactions.push({text: 'Withdraw', tag: 'resourceWithdrawOnInteract', interaction: 'resourceWithdraw'})
    }

    if(object.mod().tags['resourceDepositOnInteract'] && object.mod().tags.resourceZone) {
      interactions.push({text: 'Deposit', tag: 'resourceDepositOnInteract', interaction: 'resourceDeposit'})
    }

    let addedLeave
    if(hero.mod().dialogueChoices && Object.keys(hero.mod().dialogueChoices).length) {
      let addedDialogueChoice
      Object.keys(hero.mod().dialogueChoices).forEach((id) => {
        let choice = hero.mod().dialogueChoices[id]
        if(!choice || choice.triggerPool === 0) return
        choice.id = id

        if(choice.tags) Object.keys(choice.tags).forEach((tag) => {
          if(addedDialogueChoice) return
          if(object.mod().tags[tag]) {
            addedDialogueChoice = true
            interactions.push({text: choice.choiceText, dialogueChoice: choice})
          }
        })

        if(addedDialogueChoice) return

        let heroDialogueSet = choice.heroDialogueSet
        let dialogueSets = object.mod().heroDialogueSets

        if(heroDialogueSet && dialogueSets && dialogueSets[heroDialogueSet]) {
          addedDialogueChoice = true
          interactions.push({text: choice.choiceText, dialogueChoice: choice})
        }

        if(addedDialogueChoice) return

        let sequenceId = choice.guestSequenceId
        const sequences = object.mod().sequences
        if(sequenceId && sequences && sequences[sequenceId]) {
          addedDialogueChoice = true
          interactions.push({text: choice.choiceText, dialogueChoice: choice})
        }
      })

      if(addedDialogueChoice) {
        addedLeave = true
        interactions.push({text: 'Leave'})
      }
    }

    if(object.triggers) {
      Object.keys(object.triggers).forEach((id) => {
        let trigger = object.triggers[id]
        if(!trigger) return

        // check if this trigger would fire..
        if(triggers.fireTrigger(trigger, object, hero, object, false)) {
          if(trigger.eventName === 'onHeroInteract--integrated' && (trigger.triggerPool >= 0 || trigger.triggerPool == -1)) {
            interactions.push({text: id, interaction: 'integratedInteractEvent'})
          }
        }
      })
    }

    if((interactions.length > 1 || object.tags.loopInteractionOnDialogueComplete) && !addedLeave) {
      interactions.push({text: 'Leave'})
    }

    return interactions
  }

  isInteractable(hero, object) {
    object = object.mod()
    if((object.tags['completeQuestOnHeroInteract'] && object.tags['questCompleter'])) return true

    if((object.tags['giveQuestOnHeroInteract'] && object.tags['questGiver'])) return true

    if(object.tags['spawnOnHeroInteract'] && object.tags.spawnZone && object.spawnPool !== 0) return true

    if(object.tags['updateHeroOnHeroInteract'] && object.tags.heroUpdate) return true

    if(object.tags['talkOnHeroInteract'] && object.tags.talker) return true

    if(object.tags['puzzleStartOnHeroInteract']) return true

    if(object.tags['pickupOnHeroInteract'] && object.tags.pickupable) return true

    if(object.tags['spawnAllInHeroInventoryOnHeroInteract'] && object.tags.spawnZone && object.spawnPool !== 0) return true

    if(object.tags['resourceWithdrawOnInteract'] && object.tags.resourceZone) return true

    if(object.tags['resourceDepositOnInteract'] && object.tags.resourceZone) return true

    if(object.tags['interactable']) return true

    if(object.triggers) {
      let triggerFires
      Object.keys(object.triggers).forEach((id) => {
        let trigger = object.triggers[id]
        if(!trigger) return
        if(trigger.eventName === 'onHeroInteract--integrated' && (trigger.triggerPool >= 0 || trigger.triggerPool == -1)) {
          // check if this trigger would fire..
          if(triggers.fireTrigger(trigger, object, hero, object, false)) {
            triggerFires = true
          }
        }
      })
      if(triggerFires) return true
    }

    return false
  }

  anticipatedAdd(hero, object) {

    let isWall = object.wall
    let isBlock = object.block
    let isRandom = object.random
    let isPlatform = object.platform
    let isOnTop = object.onTop

    if(isOnTop) {
      if(!object.targetTags && object.targetTags.length === 0) return complete()
      if(!GAME.objectsByTag[object.targetTags[0]]) return
      if(!GAME.objectsByTag[object.targetTags[0]][0]) return
      let target = GAME.objectsByTag[object.targetTags[0]][0]
      let newObject = {
        x: gridUtil.getRandomGridWithinXY(target.x, target.x + target.width),
        y: target.y - ((object.nodesAbove + 1) * GAME.grid.nodeSize),
        width: GAME.grid.nodeSize,
        height: GAME.grid.nodeSize,
      }
      if(object.failCount > 80) {
        if(Math.random() > .5) {
          newObject.y = target.y - (1 * GAME.grid.nodeSize)
        } else {
          newObject.y = target.y + (1 * GAME.grid.nodeSize)
        }
        console.log('failed so badly')
      } else if(object.failCount > 60) {
        if(Math.random() > .5) {
          newObject.y -= (GAME.grid.nodeSize * 4)
        } else {
          newObject.y += (GAME.grid.nodeSize * 4)
        }
      } else if(object.failCount > 40) {
        if(Math.random() > .5) {
          newObject.y -= (GAME.grid.nodeSize * 2)
        } else {
          newObject.y += (GAME.grid.nodeSize * 2)
        }
      } else if(object.failCount > 20) {
        if(Math.random() > .5) {
          newObject.y -= GAME.grid.nodeSize
        } else {
          newObject.y += GAME.grid.nodeSize
        }
      }





      addAnticipatedObject(newObject)
      return
    }

    const { minX, maxX, minY, maxY, centerY, centerX, leftDiff, rightDiff, topDiff, bottomDiff, cameraHeight, cameraWidth } = HERO.getViewBoundaries(hero)

    if(isRandom) {
      let newObject
      if(isWall) {
        if(Math.random() > .5) {
          newObject = {
            x: minX + (GAME.grid.nodeSize * 2),
            y: gridUtil.getRandomGridWithinXY(minY, maxY),
            width: (HERO.cameraWidth * 2) - (GAME.grid.nodeSize * 12),
            height: GAME.grid.nodeSize,
          }
        } else {
          newObject = {
            x: gridUtil.getRandomGridWithinXY(minX, maxX),
            y: minY + ( GAME.grid.nodeSize * 2),
            width: GAME.grid.nodeSize,
            height: (HERO.cameraHeight * 2) - (GAME.grid.nodeSize * 6)
          }
        }
      } else if(isBlock) {
        if(Math.random() > .5) {
          newObject = {
            x: gridUtil.getRandomGridWithinXY(minX, maxX),
            y: gridUtil.getRandomGridWithinXY(minY, maxY),
            width: GAME.grid.nodeSize * 5,
            height: GAME.grid.nodeSize,
          }
        } else {
          newObject = {
            x: gridUtil.getRandomGridWithinXY(minX, maxX),
            y: gridUtil.getRandomGridWithinXY(minY, maxY),
            width: GAME.grid.nodeSize,
            height: GAME.grid.nodeSize * 5,
          }
        }
      } else if(isPlatform) {
        newObject = {
          x: hero.x - (GAME.grid.nodeSize * 4),
          y: gridUtil.getRandomGridWithinXY(hero.y + (GAME.grid.nodeSize * 8), hero.y + (GAME.grid.nodeSize * 6)),
          width: GAME.grid.nodeSize * 8,
          height: GAME.grid.nodeSize,
        }
      } else {
        newObject = {
          x: gridUtil.getRandomGridWithinXY(minX, maxX),
          y: gridUtil.getRandomGridWithinXY(minY, maxY),
          width: GAME.grid.nodeSize,
          height: GAME.grid.nodeSize,
        }
      }
      addAnticipatedObject(newObject)
    } else {
      if(isPlatform) {
        let newObject = {
          x: hero.x - (GAME.grid.nodeSize * 4),
          // honestly this + is just so we dont add a platform where nothing can be added above it
          y: maxY + (GAME.grid.nodeSize * 6),
          width: GAME.grid.nodeSize * 9,
          height: GAME.grid.nodeSize,
        }
        addAnticipatedObject(newObject)
      } else if (leftDiff < 5 && hero.directions.left) {
        let newObject = {
          x: minX + (GAME.grid.nodeSize * 3),
          y: isWall ? minY + ( GAME.grid.nodeSize * 2) : gridUtil.getRandomGridWithinXY(minY, maxY),
          width: GAME.grid.nodeSize,
          height: isWall ? (HERO.cameraHeight * 2) - (GAME.grid.nodeSize * 6) : GAME.grid.nodeSize,
        }
        addAnticipatedObject(newObject)
      } else if (topDiff < 5 && hero.directions.up) {
        let newObject = {
          x: isWall ? minX + ( GAME.grid.nodeSize * 2) : gridUtil.getRandomGridWithinXY(minX, maxX),
          y: minY + (GAME.grid.nodeSize * 3),
          width: isWall ? (HERO.cameraWidth * 2) - (GAME.grid.nodeSize * 12) : GAME.grid.nodeSize,
          height: GAME.grid.nodeSize,
        }
        addAnticipatedObject(newObject)
      } else if (rightDiff > GAME.grid.nodeSize - 5 && hero.directions.right) {
        let newObject = {
          x: maxX - (GAME.grid.nodeSize * 3),
          y: isWall ? minY + ( GAME.grid.nodeSize * 2) : gridUtil.getRandomGridWithinXY(minY, maxY),
          width: GAME.grid.nodeSize,
          height: isWall ? (HERO.cameraHeight * 2) - (GAME.grid.nodeSize * 6) : GAME.grid.nodeSize,
        }
        addAnticipatedObject(newObject)
      } else if (bottomDiff > GAME.grid.nodeSize - 5 && hero.directions.down) {
        let newObject = {
          x: isWall ? minX + ( GAME.grid.nodeSize * 2) : gridUtil.getRandomGridWithinXY(minX, maxX),
          y: maxY - (GAME.grid.nodeSize * 3),
          width: isWall ? (HERO.cameraWidth * 2) - (GAME.grid.nodeSize * 12) : GAME.grid.nodeSize,
          height: GAME.grid.nodeSize,
        }
        addAnticipatedObject(newObject)
      }
    }

    function addAnticipatedObject(newObject) {
      if(object.failCount > 100) {
        object.bypassGameBoundaries = true
        object.tags.fresh = true
      }

      let {x , y} = gridUtil.snapXYToGrid(newObject.x, newObject.y)
      if((!collisions.check(newObject, GAME.objects) || isPlatform) && gridUtil.keepXYWithinBoundaries({x, y}, { bypassGameBoundaries: object.bypassGameBoundaries}) && gridUtil.keepXYWithinBoundaries({x: (x + newObject.mod().width), y: (y + newObject.mod().height)}, { bypassGameBoundaries: object.bypassGameBoundaries})) {
        const createMe = {...newObject, ...object}

        //here be dragons
        createMe.tags.fadeInOnInit = true
        // createMe.tags.lastAnticipatedObject = true
        createMe.tags.heroHomePlatform = isPlatform
        const created = OBJECTS.create([createMe])
        GAME.lastAnticipatedObjectId = created[0].id
        object.numberToAdd--
        object.failCount = 0
        if(object.numberToAdd) {
        } else {
          global.local.emit('onAnticipateCompleted', object)
          complete()
        }
      } else {
        if(!object.failedCount) object.failedCount = 0
        object.failedCount++
      }
    }

    function complete() {
      GAME.gameState.anticipatedForAdd = GAME.gameState.anticipatedForAdd.filter((antObject) => {
        return antObject !== object
      })
    }
  }

  create(objects, options = { local: false, bypassCollisions: false, fromLiveGame: false }) {
    if(!objects.length) {
      objects = [objects]
    }

    let alertAboutCollision
    let hasBeenWarned = false

    objects = objects.map((newObject) => {
      newObject = global.mergeDeep(JSON.parse(JSON.stringify(global.defaultObject)), newObject)

      if(!newObject.id){
        newObject.id = 'object-' + global.uniqueID();
      }

      if(newObject.subObjects) {
        OBJECTS.forAllSubObjects(newObject.subObjects, (subObject, subObjectName) => {
          if(!subObject.id){
            subObject.id = 'subObject-' + global.uniqueID();
          }
        })
      }

      if(newObject.compendiumId) {
        newObject.fromCompendiumId = newObject.compendiumId
        newObject.compendiumId = null
      }

      newObject.spawnPointX = newObject.x
      newObject.spawnPointY = newObject.y

      if(!GAME.world.tags.calculateMovingObstaclePaths) {
        GAME.addObstacle(newObject)
      }

      if(newObject.tags.obstacle && collisions.check(newObject, GAME.objects) && !options.bypassCollisions) {
        alertAboutCollision = true
      }

      //ALWAYS CONTAIN WITHIN BOUNDARIES OF THE GRID!!
      if(newObject.x + newObject.mod().width > (GAME.grid.nodeSize * GAME.grid.width) + GAME.grid.startX) {
        const diff = newObject.x + newObject.mod().width - ((GAME.grid.nodeSize * GAME.grid.width) + GAME.grid.startX)
        if(PAGE.role.isPlayEditor && !global.playEditorKeysDown[18] && !hasBeenWarned) alert('adding obj outside grid system, canceled')
        hasBeenWarned = true

        GAME.grid.width += Math.ceil(diff/GAME.grid.nodeSize)
        // return null
      }
      if(newObject.y + newObject.mod().height > (GAME.grid.nodeSize * GAME.grid.height) + GAME.grid.startY) {
        const diff = newObject.y + newObject.mod().height - ((GAME.grid.nodeSize * GAME.grid.height) + GAME.grid.startY)
        if(PAGE.role.isPlayEditor && !global.playEditorKeysDown[18] && !hasBeenWarned) alert('adding obj outside grid system, canceled')
        hasBeenWarned = true
        // return null
        GAME.grid.height += Math.ceil(diff/GAME.grid.nodeSize)
      }
      if(newObject.x < GAME.grid.startX) {
        const diff = GAME.grid.startX - newObject.x
        if(PAGE.role.isPlayEditor && !global.playEditorKeysDown[18] && !hasBeenWarned) alert('adding obj outside grid system, canceled')
        hasBeenWarned = true

        GAME.grid.width += Math.ceil(diff/GAME.grid.nodeSize)
        GAME.grid.startX -= diff

        // return null
      }
      if(newObject.y < GAME.grid.startY) {
        const diff = GAME.grid.startY - newObject.y

        if(PAGE.role.isPlayEditor && !global.playEditorKeysDown[18] && !hasBeenWarned) alert('adding obj outside grid system, canceled')
        hasBeenWarned = true

        GAME.grid.height += Math.ceil(diff/GAME.grid.nodeSize)
        GAME.grid.startY -= diff
        // return null
      }

      if(hasBeenWarned) {
        global.socket.emit('updateGrid', GAME.grid)
      }

      if(newObject.tags.destroySoon || newObject.tags.destroyQuickly || newObject.tags.destroyEventually) {
        newObject.createdTime = Date.now()
      }

      return newObject
    }).filter(obj => !!obj)

    if(PAGE.role.isPlayEditor && !options.fromLiveGame && !global.playEditorKeysDown[18]) {
      if(alertAboutCollision) {
        if(!confirm('already an object on this grid node..confirm to add anyways')) return
      }

      let warnings = ""
      let sampleObject = objects[0]
      if(!sampleObject.tags.obstacle) {
        warnings+= 'NOT obstacle\n\n'
      }
      if(!sampleObject.tags.stationary) {
        warnings+= 'NOT stationary - does NOT effect pathfinding\n\n'
      }

      warnings+= "TAGS:\n"
      Object.keys(sampleObject.tags).forEach((tagName) => {
        if(sampleObject.tags[tagName] === true) {
          warnings+= tagName+'\n'
        }
      })
      if(sampleObject.velocityX || sampleObject.velocityY) {
        warnings += 'has VELOCITY\n'
      }
      if(sampleObject.heroUpdate) {
        warnings += 'has GAME.heros[HERO.id] UPDATE\n'
      }
      if(sampleObject.objectUpdate) {
        warnings += 'has OBJECT UPDATE\n'
      }

      if(confirm(warnings)) {
        emitNewObjects()
      }
    } else {
      emitNewObjects()
    }

    function emitNewObjects() {
      if(!options.silently) {
        if(global.editingGame && global.editingGame.branch && !options.fromLiveGame) {
          global.branch.objects.push(...objects)
        } else {
          if(options.local) {
            global.local.emit('onNetworkAddObjects', objects)
          } else {
            global.socket.emit('addObjects', objects)
          }
        }
      }
    }

    return objects
  }

  editObject(object, update) {
    // slow down that gravity boi!
    if(object.tags.gravityY === true && update.tags && update.tags.gravityY === false) {
      update.velocityY = 0
    }

    if(update.constructParts) {
      if(object.constructParts) {
        object.constructParts.forEach((part) => {
          if(object.tags.notInCollisions) return
          PHYSICS.removeObject(part)
        })
      } else {
        if(!object.tags.notInCollisions) {
          PHYSICS.removeObject(object)
        }
      }
      update.constructParts.forEach((part) => {
        if(object.tags.notInCollisions) return
        part.ownerId = object.id
        PHYSICS.addObject(part)
      })
    } else if(object.constructParts) {
      if(!object.tags.notInCollisions) {
        PHYSICS.addObject(object)
      }
    }
    object.path = null
    global.mergeDeep(object, update)
  }

  onEditObjects(editedObjects) {
    editedObjects.forEach((obj) => {
      let objectById = GAME.objectsById[obj.id]
      if(obj.constructParts || objectById.constructParts) {
        PIXIMAP.deleteObject(objectById)
      }
      OBJECTS.editObject(objectById, obj)
      if(!CONSTRUCTEDITOR.open && (obj.constructParts || objectById.constructParts)) {
        PIXIMAP.addObject(objectById)
      }
      PIXIMAP.updatePixiObject(objectById)
    })

    global.local.emit('onUpdatePFgrid', 'edit', editedObjects)
  }

  onAnticipateObject(object) {
    if(!GAME.gameState.anticipatedForAdd) GAME.gameState.anticipatedForAdd = []
    GAME.gameState.anticipatedForAdd.push(object)
    GAME.lastAnticipatedObjectId = null
    if(GAME.objectsByTag['lastAnticipatedObject']) GAME.objectsByTag['lastAnticipatedObject'].forEach((o) => {
      o.tags.lastAnticipatedObject = false
    })
  }

  onUpdateObject(object, delta) {
    const moddedTags = object.mod().tags
    if(object.mod().removed) {
      if(global.popoverOpen[object.id]) {
        MAP.closePopover(object.id)
      }
      return
    }

    if(object.width == 0 || object.height == 0) {
        OBJECTS.deleteObject(object)
    }

    if(moddedTags.realRotate) {
      if(typeof object.angle != 'number') object.angle = 0
      object.angle += 1 * delta
    }
    if(moddedTags.realRotateFast) {
      if(typeof object.angle != 'number') object.angle = 0
      object.angle += 7 * delta
    }

    if(moddedTags.realRotateBackAndForth || moddedTags.realRotateBackAndForthFast) {
      if(typeof object.angle != 'number') object.angle = 0

      if(object.angle > 1) {
        object._rotateDirection = 'negative'
      } else if(object.angle < -1) {
        object._rotateDirection = 'positive'
      } else if(!object._rotateDirection){
        object._rotateDirection = 'positive'
      }
      if(moddedTags.realRotateBackAndForth) {
        if(object._rotateDirection === 'negative') {
          object.angle -= 3 * delta
        }
        if(object._rotateDirection === 'positive') {
          object.angle += 3 * delta
        }
      }
      if(moddedTags.realRotateBackAndForthFast) {
        if(object._rotateDirection === 'negative') {
          object.angle -= 7 * delta
        }
        if(object._rotateDirection === 'positive') {
          object.angle += 7 * delta
        }
      }
    }

    if(object.id === GAME.lastAnticipatedObjectId) {
      object.tags.lastAnticipatedObject = true
    } else {
      object.tags.lastAnticipatedObject = false
    }

    let randomDelta = 2000
    if(moddedTags.randomizeQuickly) randomDelta = 100
    if(moddedTags.randomLightColorChange) {
      if(!object._lastLightColorChangeTime) object._lastLightColorChangeTime = Date.now()
      if(object._lastLightColorChangeTime + randomDelta < Date.now()) {
        object._lastLightColorChangeTime = Date.now() //+ window.getRandomInt(0, 2000)
        object.lightColor = window.generateRandomColor()
      }
    }

    if(moddedTags.randomLightPowerChange) {
      if(!object._lastLightPowerChangeTime) object._lastLightPowerChangeTime = Date.now()
      if(object._lastLightPowerChangeTime + randomDelta < Date.now()) {
        object._lastLightPowerChangeTime = Date.now() //+ window.getRandomInt(0, 2000)
        object.lightPower = window.getRandomInt(10, 30)
      }
    }


    if(moddedTags.randomLightOpacityChange) {
      if(!object._lastLightOpacityChangeTime) object._lastLightOpacityChangeTime = Date.now()
      if(object._lastLightOpacityChangeTime + randomDelta < Date.now()) {
        object._lastLightOpacityChangeTime = Date.now() //+ window.getRandomInt(0, 2000)
        object.lightOpacity = window.getRandomFloat(0, 1)
      }
    }

    if(moddedTags.randomColorChange) {
      if(!object._lastColorChangeTime) object._lastColorChangeTime = Date.now()
      if(object._lastColorChangeTime + randomDelta < Date.now()) {
        object._lastColorChangeTime = Date.now() //+ window.getRandomInt(0, 2000)
        object.color = window.generateRandomColor()
      }
    }

    OBJECTS.destroyIfTimerIsUp(object)
  }

  destroyIfTimerIsUp(object) {
    if(object.mod().tags.destroyQuickly) {
      // console.log(object.id, object.createdTime + 3000, Date.now())
      object._timeUntilDestroyed = (object.createdTime + 3000) - Date.now()
      object._totalTimeUntilDestroyed = 3000
      if(object._timeUntilDestroyed <= 0) object._destroy = true
    }
    if(object.mod().tags.destroySoon) {
      // console.log(object.id, object.createdTime + 10000, Date.now())
      object._timeUntilDestroyed = (object.createdTime + 10000) - Date.now()
      object._totalTimeUntilDestroyed = 10000
      if(object._timeUntilDestroyed <= 0) object._destroy = true
    }
    if(object.mod().tags.destroyEventually) {
      object._timeUntilDestroyed = (object.createdTime + 200000) - Date.now()
      object._totalTimeUntilDestroyed = 200000
      if(object._timeUntilDestroyed <= 0) object._destroy = true
    }
  }

  addObject(object) {
    // object.tags = global.mergeDeep(JSON.parse(JSON.stringify({...global.defaultTags, plain: true})), object.tags)
    GAME.objectsById[object.id] = object
    if(object.subObjects) {
      OBJECTS.forAllSubObjects(object.subObjects, (subObject, subObjectName) => {
        OBJECTS.addSubObject(object, subObject, subObjectName)
      })
    }
    if(object.constructParts) {
      object.constructParts.forEach((part) => {
        part.ownerId = object.id
        PHYSICS.addObject(part)
      })
    } else {
      PHYSICS.addObject(object)
    }

    if(object.triggers) {
      Object.keys(object.triggers).forEach((triggerId) => {
        const trigger = object.triggers[triggerId]
        triggers.addTrigger(object, trigger)
      })
    }

    if(PAGE.role.isAdmin && GAME.gameState.started) global.emitGameEvent('onObjectAwake', object)
  }

  addSubObject(owner, subObject, subObjectName) {
    if(!PAGE.role.isHost) {
      if(subObject.id && !PHYSICS.objects[subObject.id]) PHYSICS.addObject(subObject)
      return
    }
    subObject = global.mergeDeep(JSON.parse(JSON.stringify(global.defaultSubObject)), subObject)
    subObject.ownerId = owner.id
    subObject.subObjectName = subObjectName
    if(!subObject.id) subObject.id = subObjectName + '-' + global.uniqueID()
    GAME.objectsById[subObject.id] = subObject

    let subObjectAlreadyExisted = false

    if(owner.subObjects[subObject.subObjectName]) {
      const existingSubObject = owner.subObjects[subObject.subObjectName]
      if(existingSubObject.id !== subObject.id) {
        if(subObject.tags.stackable) {
          if(!existingSubObject.count && existingSubObject.count !== 0) existingSubObject.count = 1
          existingSubObject.count+= (subObject.count || 1)
          subObjectAlreadyExisted = true
          if(subObject.isEquipped) {
            existingSubObject.isEquipped = true
          }
          return
        } else {
          subObject.subObjectName = subObject.subObjectName + '-copy-'+global.uniqueID()
          subObjectName = subObject.subObjectName
          console.trace('i have copied', existingSubObject, subObject)
        }
      }
    }

    const isPotential = subObject.tags.potential
    if(!subObjectAlreadyExisted){
      owner.subObjects[subObjectName] = subObject
      if(!isPotential) PHYSICS.addObject(subObject)

      if(subObject.triggers) {
        Object.keys(subObject.triggers).forEach((triggerId) => {
          const trigger = subObject.triggers[triggerId]
          triggers.addTrigger(subObject, trigger)
        })
      }
      if(GAME.gameState.started) global.emitGameEvent('onObjectAwake', subObject)

      if(!subObject.inInventory && !isPotential && (subObject.tags.startsPickedUp || subObject.tags.startsEquipped || subObject.actionProps || subObject.tags.pickupable)) {
        global.emitGameEvent('onHeroPickup', owner, subObject)
        subObject.inInventory = true
      }
    }

    if(!isPotential && subObject.tags.startsEquipped) {
      equipSubObject(OBJECTS.getObjectOrHeroById(owner.id), subObject)
    }
  }

  deleteSubObject(owner, subObject, subObjectName) {
    if(subObject.isEquipped) {
      unequipSubObject(owner, subObject)
    }
    PIXIMAP.deleteObject(subObject)
    if(PAGE.role.isHost && !subObject.tags.potential) PHYSICS.removeObject(subObject)
    delete owner.subObjects[subObjectName]
  }

  getOwner(subObject) {
    let owner = OBJECTS.getObjectOrHeroById(subObject.ownerId)
    if(!owner) {
      owner = OBJECTS.getRelative(subObject.mod().relativeId)
    }
    if(!owner) {
      owner = OBJECTS.getParent(subObject.mod().parentId)
    }
    return owner
  }

  getParent(subObject) {
    return OBJECTS.getObjectOrHeroById(subObject.mod().parentId)
  }

  getRelative(subObject) {
    return OBJECTS.getObjectOrHeroById(subObject.mod().relativeId)
  }

  getObjectOrHeroById(id) {
    let object = GAME.objectsById[id]
    if(object) return object

    let hero = GAME.heros[id]
    if(hero) return hero
  }

  removeObject(object) {
    GAME.objectsById[object.id].removed = true
    // if(global.popoverOpen[object.id]) MAP.closePopover(object)
    if(object.subObjects) {
      OBJECTS.forAllSubObjects(object.subObjects, (subObject, subObjectName) => {
        if(subObject.mod().tags.dropOnOwnerRespawn) {
          dropObject(object, subObject)
        } else {
          OBJECTS.removeSubObject(subObject)
        }
      })
    }
    global.local.emit('onUpdatePFgrid', 'remove', object)
  }

  unloadObject(object) {
    if(object.subObjects) {
      OBJECTS.forAllSubObjects(object.subObjects, (subObject, subObjectName) => {
        OBJECTS.deleteSubObject(object, subObject, subObjectName)
      })
    }
    if(object.constructParts) {
      object.constructParts.forEach((part) => {
        if(PHYSICS.objects[part.id]) {
          PHYSICS.removeObject(part)
        }
      })
    } else {
     if(PHYSICS.objects[object.id]) {
       PHYSICS.removeObject(object)
     }
   }
    if(PAGE.role.isHost && object.triggers) {
      Object.keys(object.triggers).forEach((triggerId) => {
        triggers.removeTriggerEventListener(object, triggerId)
      })
    }
  }

  deleteObject(object) {
    OBJECTS.unloadObject(object)
    GAME.objects = GAME.objects.filter(({id}) => {
      return id !== object.id
    })
    delete GAME.objectsById[object.id]
  }

  onDeleteObjectId(id) {
    OBJECTS.onDeleteObject(OBJECTS.getObjectOrHeroById(id))
  }

  onDeleteObject(object) {
    if(object.heroDialogueSets && object.heroDialogueSets.destroy) {
      let hero = GAME.heroList.filter((({tags}) => tags.centerOfAttention))[0]

      if(hero) {
        let newDialogue = object.heroDialogueSets.destroy.dialogue.slice()
        hero.dialogue = newDialogue

        hero.flags.showDialogue = true
        hero.flags.paused = true
        hero._fireDialogueCompleteWithSpeakerId = true
        hero.dialogueId = object.id
        if(object.name) {
          hero.dialogueName = object.mod().name
        } else {
          hero.dialogueName = null
        }

        global.emitGameEvent('onUpdatePlayerUI', hero)
      }
    }
    OBJECTS.deleteObject(object)
    MAP.closePopover(object.id)
    global.local.emit('onUpdatePFgrid', 'delete', object)
  }

  onDeleteSubObjectChance(ownerId, subObjectName) {
    const owner = OBJECTS.getObjectOrHeroById(ownerId)
    delete owner.subObjectChances[subObjectName]
  }

  onDeleteSubObject(owner, subObjectName) {
    const subObject = owner.subObjects[subObjectName]
    if(!subObject) return console.log('no sub Object?', subObjectName)
    MAP.closePopover(subObject.id)
    if(owner.tags.hero) {
      OBJECTS.deleteSubObject(GAME.heros[owner.id], subObject, subObjectName)
    } else {
      OBJECTS.deleteSubObject(GAME.objectsById[owner.id], subObject, subObjectName)
    }

    if(subObject.triggers) {
      Object.keys(subObject.triggers).forEach((triggerId) => {
        triggers.removeTriggerEventListener(subObject, triggerId)
      })
    }
  }

  onAddSubObject(owner, subObject, subObjectName, options) {
    if(owner.tags.hero) {
      if(!GAME.heros[owner.id].subObjects) GAME.heros[owner.id].subObjects = {}
      OBJECTS.addSubObject(GAME.heros[owner.id], subObject, subObjectName, options)
    } else {
      if(!GAME.objectsById[owner.id].subObjects) GAME.objectsById[owner.id].subObjects = {}
      OBJECTS.addSubObject(GAME.objectsById[owner.id], subObject, subObjectName, options)
    }
  }

  onRemoveSubObject(ownerId, subObjectName) {
    const owner = OBJECTS.getObjectOrHeroById(ownerId)
    let so = owner.subObjects[subObjectName]
    OBJECTS.removeSubObject(so)
  }

  removeSubObject(so) {
    if(so.isEquipped) {
      unequipSubObject(OBJECTS.getObjectOrHeroById(so.ownerId), so)
    }
    so.removed = true
    // if(global.popoverOpen[so.id]) {
    //   MAP.closePopover(so)
    // }
  }

  onEditSubObject(ownerId, subObjectName, update) {
    const owner = OBJECTS.getObjectOrHeroById(ownerId)
    global.mergeDeep(owner.subObjects[subObjectName], update)
  }

  onDropObject(objectId, subObjectName, amount) {
    const dropper = OBJECTS.getObjectOrHeroById(objectId)
    const dropping = dropper.subObjects[subObjectName]
    dropObject(dropper, dropping, amount)
  }

  onUnequipObject(objectId, subObjectName) {
    const dropper = OBJECTS.getObjectOrHeroById(objectId)
    const dropping = dropper.subObjects[subObjectName]
    unequipSubObject(dropper, dropping)
  }

  onEquipObject(objectId, subObjectName, key) {
    const dropper = OBJECTS.getObjectOrHeroById(objectId)
    const dropping = dropper.subObjects[subObjectName]
    equipSubObject(dropper, dropping, key)
  }

  onNetworkUpdateObjects(objectsUpdated) {
    if(!PAGE.gameLoaded) return
    if(!PAGE.role.isHost) {
      objectsUpdated.forEach((obj) => {
        let objectById = GAME.objectsById[obj.id]
        _.merge(objectById, obj)
      })
    }
    objectsUpdated.forEach((obj) => {
      PIXIMAP.updatePixiObject(GAME.objectsById[obj.id])
    })
  }

  onNetworkUpdateObjectsComplete(objectsUpdated) {
    if(!PAGE.gameLoaded) return
    if(!PAGE.role.isHost) {
      GAME.objects = objectsUpdated
      GAME.objects.forEach((object) => {
        GAME.objectsById[object.id] = object
        // OBJECTS.forAllSubObjects(object.subObjects, (so) => {
        //   GAME.objectsById[so.id] = so
        // })
      })
    }
  }

  onNetworkAddObjects(objectsAdded) {
    GAME.objects.push(...objectsAdded)
    objectsAdded.forEach((object) => {
      OBJECTS.addObject(object)
    })
    global.local.emit('onUpdatePFgrid', 'add', objectsAdded)
  }

  getRelativeXY(object, relative) {
    return {
      relativeX: object.x - relative.x,
      relativeY: object.y - relative.y
    }
  }
  getRelativeCenterXY(object, relative) {
    return {
      relativeX: (object.x + object.mod().width/2) - (relative.x + relative.mod().width/2),
      relativeY: (object.y + object.mod().height/2) - (relative.y + relative.mod().height/2)
    }
  }

  onAddHook(ownerId, hook) {
    const { eventName } = hook
    const owner = OBJECTS.getObjectOrHeroById(ownerId)
    addHook(owner, hook)
  }

  onEditHook(ownerId, hookId, hook) {
    const owner = OBJECTS.getObjectOrHeroById(ownerId)
    deleteHook(owner, hookId)
    addHook(owner, hook)
  }

  onDeleteHook(ownerId, hookId) {
    deleteHook(OBJECTS.getObjectOrHeroById(ownerId), hookId)
  }

  onSpawnAllNow(objectId) {
    const object = OBJECTS.getObjectOrHeroById(objectId)
    spawnAllNow(object)
  }
  onDestroySpawnIds(objectId) {
    const object = OBJECTS.getObjectOrHeroById(objectId)
    destroySpawnIds(object)
  }
  onPuzzleSolved(object, hero) {
    if(object.mod().tags.spawnAllInHeroInventoryOnPuzzleSolved && hero) spawnAllNow(object, hero)
    if(object.mod().tags.destroyOnPuzzleSolved) {
      object._destroy = true
      object._destroyedById = hero.id
    }
  }


  quake(object, options = { powerWave: false, color: object.color, speed: 150, tags: { noHeroAllowed: true }}) {
    const createdObjects = []
    const diagonals = []
    let lastCreatedObjects = []
    let stage = 0
    let maxStage = 4
    const powerWave = options.powerWave

    const originalPosition = _.cloneDeep(object)
    // originalPosition.x -= GAME.grid.nodeSize
    // originalPosition.y -= GAME.grid.nodeSize
    // originalPosition.width += (GAME.grid.nodeSize * 2)
    // originalPosition.height += (GAME.grid.nodeSize * 2)

    const quakeSpeed = options.speed
    const left = { x: object.x, height: object.mod().height, y: object.y, width: GAME.grid.nodeSize, velocityX: -quakeSpeed, tags: options.tags, color: options.color, velocityMax: 1000, opacity: 1 }
    const top = { y: object.y, width: object.mod().width, x: object.x, height: GAME.grid.nodeSize, velocityY: -quakeSpeed, tags: options.tags, color: options.color, velocityMax: 1000, opacity: 1 }
    const right = { x: object.x + object.mod().width - GAME.grid.nodeSize, height: object.mod().height, y: object.y, width: GAME.grid.nodeSize, velocityX: quakeSpeed, tags: options.tags, color: options.color, velocityMax: 1000, opacity: 1 }
    const bottom = { y: object.y + object.mod().height - GAME.grid.nodeSize, width: object.mod().width, x: object.x, height: GAME.grid.nodeSize, velocityY: quakeSpeed, tags: options.tags, color: options.color, velocityMax: 1000, opacity: 1 }
    stage++

    // the diagonal buggers have 3 stages
    // 1. move diagonal
    // 2. duplicate self with two other nodes ( one going up/down another going left/right )
    // 3.

    lastCreatedObjects = OBJECTS.create([left, top, bottom, right])
    createdObjects.push(...lastCreatedObjects)

    const removeUpdateListener = global.local.on('onUpdate', (delta) => {
      if(stage === maxStage) {
        let lowestOpacity = 1
        createdObjects.forEach((co) => {
          const go = GAME.objectsById[co.id]
          if(go) {
            if(go.opacity < lowestOpacity) lowestOpacity = go.opacity
          }
        })

        const allEqualOpacity = createdObjects.every((co) => {
          const go = GAME.objectsById[co.id]
          if(go) {
            return go.opacity === lowestOpacity
          } else return true
        })


        if(powerWave) {
          diagonals.forEach((co) => {
            const go = GAME.objectsById[co.id]
            if(go) {
              global.socket.emit('deleteObject', go)
            }
          })
        }

        createdObjects.forEach((co) => {
          const go = GAME.objectsById[co.id]
          if(go) {
            if(!powerWave) {
              go.velocityX = 0
              go.velocityY = 0
            }

            if(go.opacity <= 0) global.socket.emit('deleteObject', go)
            if(go.opacity > lowestOpacity || allEqualOpacity) {
              let opacityDelta = ((go.opacity/100) * delta) + .05
              if(powerWave) opacityDelta = opacityDelta/1000
              go.opacity -= opacityDelta
              if(!allEqualOpacity && go.opacity < lowestOpacity) go.opacity = lowestOpacity
            }
          }
        })

        if(createdObjects.every((co) => { return !GAME.objectsById[co.id] })) {
          removeUpdateListener()
        }
      }

      if(stage < maxStage && GAME.objectsById[lastCreatedObjects[0].id] && !collisions.checkAnything(originalPosition, lastCreatedObjects.map(({id}) => {
        return GAME.objectsById[id]
      }))) {
        // - ((stage/maxStage)/2)

        if(stage < maxStage - 1) {
          // diagonals
          const diagChildren = []
          diagonals.map(({id}) => {
            return GAME.objectsById[id]
          }).forEach((diag) => {
            if(diag) {
              global.socket.emit('deleteObject', diag)
              const hasWeight = stage >= 2
              const opacity = hasWeight ? 1 : diag.opacity
              diagChildren.push({...diag, id: null, velocityX: 0, tags: hasWeight ? options.tags : {}, velocityMax: 1000, opacity: opacity, color: options.color })
              diagChildren.push({...diag, id: null, velocityY: 0, tags: hasWeight ? options.tags : {}, velocityMax: 1000, opacity: opacity, color: options.color })
            }
          })
          if(diagChildren.length) {
            const createdChildren = OBJECTS.create(diagChildren)
            createdObjects.push(...createdChildren)
          }
        }

        const newObjectOpacity = stage < maxStage-1 ? .4 : .2
        let newDiagonalOpacity = newObjectOpacity
        if(stage === 1) {
          newDiagonalOpacity = 1
        }
        const topLeft = { x: originalPosition.x, height: GAME.grid.nodeSize, y: originalPosition.y, width: GAME.grid.nodeSize, velocityX: -quakeSpeed, velocityY: -quakeSpeed, tags: options.tags, color: options.color, velocityMax: 1000, opacity: newDiagonalOpacity }
        const topRight = { x: originalPosition.x + originalPosition.width - GAME.grid.nodeSize, height: GAME.grid.nodeSize, y: originalPosition.y, width: GAME.grid.nodeSize, velocityX: quakeSpeed, velocityY: -quakeSpeed, tags: options.tags, color: options.color, velocityMax: 1000, opacity: newDiagonalOpacity }
        const bottomLeft = { x: originalPosition.x, height: GAME.grid.nodeSize, y: originalPosition.y + originalPosition.height - GAME.grid.nodeSize, width: GAME.grid.nodeSize, velocityX: -quakeSpeed, velocityY: quakeSpeed, tags: options.tags, color: options.color, velocityMax: 1000, opacity: newDiagonalOpacity }
        const bottomRight = { x: originalPosition.x + originalPosition.width - GAME.grid.nodeSize, height: GAME.grid.nodeSize, y: originalPosition.y + originalPosition.height - GAME.grid.nodeSize, width: GAME.grid.nodeSize, velocityX: quakeSpeed, velocityY: quakeSpeed, tags: options.tags, color: options.color, velocityMax: 1000, opacity: newDiagonalOpacity }

        const newDiagonals = OBJECTS.create([topLeft, topRight, bottomLeft, bottomRight])

        // diagonals.forEach(({id}) => {
        //   const go = GAME.objectsById[id]
        // })

        diagonals.push(...newDiagonals)
        createdObjects.push(...newDiagonals)

        const left = { x: originalPosition.x, height: originalPosition.height, y: originalPosition.y, width: GAME.grid.nodeSize, velocityX: -quakeSpeed, tags: {}, color: options.color, velocityMax: 1000, opacity: newObjectOpacity   }
        const top = { y: originalPosition.y, width: originalPosition.width, x: originalPosition.x, height: GAME.grid.nodeSize, velocityY: -quakeSpeed, tags: {}, color: options.color, velocityMax: 1000, opacity: newObjectOpacity   }
        const right = { x: originalPosition.x + originalPosition.width - GAME.grid.nodeSize, height: originalPosition.height, y: originalPosition.y, width: GAME.grid.nodeSize, velocityX: quakeSpeed, tags: {}, color: options.color, velocityMax: 1000, opacity: newObjectOpacity }
        const bottom = { y: originalPosition.y + originalPosition.height - GAME.grid.nodeSize, width: originalPosition.width, x: originalPosition.x, height: GAME.grid.nodeSize, velocityY: quakeSpeed, tags: {}, color: options.color, velocityMax: 1000, opacity: newObjectOpacity }

        // const topLeft1 = { x: originalPosition.x - GAME.grid.nodeSize, height: GAME.grid.nodeSize, y: originalPosition.y - GAME.grid.nodeSize, width: GAME.grid.nodeSize, velocityX: -quakeSpeed, tags: {}, velocityMax: 1000, opacity: .5 }
        // const topLeft2 = { x: originalPosition.x - GAME.grid.nodeSize, height: GAME.grid.nodeSize, y: originalPosition.y - GAME.grid.nodeSize, width: GAME.grid.nodeSize, velocityY: -quakeSpeed, tags: {}, velocityMax: 1000, opacity: .5 }
        //
        // const topRight1 = { y: originalPosition.y - GAME.grid.nodeSize, width: GAME.grid.nodeSize, x: originalPosition.x + originalPosition.width, height: GAME.grid.nodeSize, velocityY: -quakeSpeed, tags: {}, velocityMax: 1000, opacity: .5 }
        // const topRight2 = { y: originalPosition.y - GAME.grid.nodeSize, width: GAME.grid.nodeSize, x: originalPosition.x + originalPosition.width, height: GAME.grid.nodeSize, velocityX: quakeSpeed, tags: {}, velocityMax: 1000, opacity: .5 }
        //
        // const bottomLeft1 = { x: originalPosition.x - GAME.grid.nodeSize, height: GAME.grid.nodeSize, y: originalPosition.y + originalPosition.height, width: GAME.grid.nodeSize, velocityX: -quakeSpeed, tags: {}, velocityMax: 1000, opacity: .5 }
        // const bottomLeft2 = { x: originalPosition.x - GAME.grid.nodeSize, height: GAME.grid.nodeSize, y: originalPosition.y + originalPosition.height, width: GAME.grid.nodeSize, velocityY: quakeSpeed, tags: {}, velocityMax: 1000, opacity: .5 }
        //
        // const bottomRight1 = { y: originalPosition.y + originalPosition.height, width: GAME.grid.nodeSize, x: originalPosition.x + originalPosition.width, height: GAME.grid.nodeSize, velocityY: quakeSpeed, tags: {}, velocityMax: 1000, opacity: .5 }
        // const bottomRight2 = { y: originalPosition.y + originalPosition.height, width: GAME.grid.nodeSize, x: originalPosition.x + originalPosition.width, height: GAME.grid.nodeSize, velocityX: quakeSpeed, tags: {}, velocityMax: 1000, opacity: .5 }
        //
        // lastCreatedObjects = OBJECTS.create([topLeft1, topLeft2, topRight1, topRight2, bottomLeft1, bottomLeft2, bottomRight1, bottomRight2])
        lastCreatedObjects = OBJECTS.create([left, top, bottom, right])
        createdObjects.push(...lastCreatedObjects)
        stage++
      }
    })
  }

  onObjectAnimation(type, objectId, options = {}) {
    if(!PAGE.role.isHost) return

    if(!options) options = {}

    const object = OBJECTS.getObjectOrHeroById(objectId)
    if(object) {
      if(type === 'quake') {
        OBJECTS.quake(object, options)
      }

      if(type === 'quickTrail') {
        object.tags.hasTrail = true
        setTimeout(() => {
          object.tags.hasTrail = false
        }, options.duration || 800)
      }
    }
    // animationQuake: originalPosition.animationQuake,
    // ACTUAL
    // fadeToColor ( actual )
    // fadeOut
    // fadeIn
  }

  onObjectDestroyed(object) {
    if(!object.mod().tags) return console.log('yeah it didnt have tags for a construct part')
    if(object.mod().tags.explodeOnDestroy) {
      global.local.emit('onObjectAnimation', 'explode', object.id)
    }
    if(object.mod().tags.spinOffOnDestroy) {
      global.local.emit('onObjectAnimation', 'spinOff', object.id)
    }
    if(object.mod().tags.implodeOnDestroy) {
      global.local.emit('onObjectAnimation', 'isolatedExplosion', object.id)
    }
    if(object.mod().tags.spawnAllOnDestroy) {
      spawnAllNow(object)
    }

    if(object.heroDialogueSets && object.heroDialogueSets.destroy) {
      let hero = GAME.heroList.filter((({tags}) => tags.centerOfAttention))[0]

      if(hero) {
        let newDialogue = object.heroDialogueSets.destroy.dialogue.slice()
        hero.dialogue = newDialogue

        hero.flags.showDialogue = true
        hero.flags.paused = true
        hero._fireDialogueCompleteWithSpeakerId = true
        hero.dialogueId = object.id
        if(object.name) {
          hero.dialogueName = object.mod().name
        } else {
          hero.dialogueName = null
        }

        global.emitGameEvent('onUpdatePlayerUI', hero)
      }
    }

    if(object.mod().tags.scoreSubtractOnDestroy) {
      GAME.heroList.forEach((hero) => {
        let score = (object.mod().scoreSubtract ? object.mod().scoreSubtract : 1)
        hero.score -= score
        if(object.scoreSubtractPopoverText) {
          hero.popoverText = object.scoreSubtractPopoverText
          setTimeout(() => {
            hero.popoverText = null
          }, 600)
        }
        global.emitGameEvent('onHeroScoreSubtract', hero, score)
      })
    }

    if(object.mod().tags.scoreAddOnDestroy) {
      GAME.heroList.forEach((hero) => {
        let score = (object.mod().scoreAdd ? object.mod().scoreAdd : 1)
        hero.score += score
        if(object.scoreAddPopoverText) {
          hero.popoverText = object.scoreAddPopoverText
          setTimeout(() => {
            hero.popoverText = null
          }, 600)
        }
        global.emitGameEvent('onHeroScoreAdd', hero, score)
      })
    }
  }

  mergeWithJSON(object, JSON) {
    JSON = _.cloneDeep(JSON)

    Object.keys(JSON).forEach((key) => {
      const jsonValue = JSON[key]
      const objectValue = object[key]
      if(!objectValue) return

      if(typeof jsonValue === 'string' && typeof objectValue === 'number') {
        if (jsonValue.startsWith("+")) {
          const equationValue = Number(jsonValue.slice(1))
          JSON[key] = objectValue + equationValue
        } else if(jsonValue.startsWith("-")) {
          const equationValue = Number(jsonValue.slice(1))
          JSON[key] = objectValue - equationValue
        }
      }

      if((typeof objectValue === 'boolean' || objectValue === undefined) && typeof jsonValue === 'string') {
        if (jsonValue.startsWith("toggle")) {
          JSON[key] = !JSON[key]
        }
      }
    })

    global.mergeDeep(object, JSON)
  }

  onObjectAware(object, awareOfObject) {

    // if this passes you are already pursuing something and shouldn't switch
    if(object._targetPursueId && !object.mod().tags.targetSwitchOnAware) return

    if(awareOfObject.mod().tags.hero && !awareOfObject.flags.isAdmin) {
      if(object.mod().tags.targetHeroOnAware) {
        if(object.mod().tags.homing) {
          setPathTarget(object, awareOfObject, true)
        }
        if(object.mod().tags.zombie) {
          setTarget(object, awareOfObject, true)
        }
      }
    } else if(awareOfObject.mod().tags.victim){
      if(object.mod().tags.targetVictimOnAware) {
        if(object.mod().tags.homing) {
         setPathTarget(object, awareOfObject, true)
        }
        if(object.mod().tags.zombie) {
         setTarget(object, awareOfObject, true)
        }
      }
    }
  }

  onObjectUnaware(object, unawareOfObject) {
    if(object.mod().tags.targetClearOnUnaware) {
      if(unawareOfObject.id === object._targetPursueId) {
        object._targetPursueId = null
      }
    }
  }

  chat({id, duration = 4, text}) {
    const object = OBJECTS.getObjectOrHeroById(id)
    object.chat = text
    if(duration <= 0) return
    GAME.addOrResetTimeout(id + '-chat', duration, () => {
      object.chat = null
    })
  }

  resetPhysicsProperties(object) {
    object.velocityY = 0
    object.velocityX = 0
    object.velocityAngle = 0
    object._skipPosUpdate = true
    object._skipNextGravity = true
    object.angle = null
    object.keysDown = {}
  }

  onResetPhysicsProperties(objectId) {
    const object = OBJECTS.getObjectOrHeroById(objectId)
    OBJECTS.resetPhysicsProperties(object)
  }

  hasRandomPathAI(object) {
    object = object.mod()
    if(object.tags.wander || object.tags.spelunker || object.tags.lemmings || object.tags.pacer || object.tags.homing) return true
  }

  turnIntoConstruct(object) {
    global.socket.emit('editObjects', [{
      id:object.id,
      parts: global.seperateRectangleIntoSquares(object)
    }])
  }
}

global.OBJECTS = new Objects()
