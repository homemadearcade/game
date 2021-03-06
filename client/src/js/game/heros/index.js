import { onHeroTrigger } from './onHeroTrigger.js'
import './ghost.js'
import pathfinding from '../../utils/pathfinding.js'
import collisions from '../../utils/collisions.js'
import { dropObject } from './inventory.js'
import gridUtil from '../../utils/grid.js'
import input from '../input.js'
import triggers from '../triggers.js'
import ai from '../ai/index.js'
// import @geckos.io/snapshot-interpolation
// import { SnapshotInterpolation, Vault } from '@geckos.io/snapshot-interpolation'
// global.clientInterpolationVault = new Vault()
// // initialize the library
// global.SI = new SnapshotInterpolation(60)

class Hero{
  constructor() {
    this.cameraWidth = 640,
    this.cameraHeight = 320
    this.setDefault()
  }
  //
  // onHeroInteract(hero, interactor, result) {
  //   onHeroTrigger(hero, interactor, result, { fromInteractButton: true })
  // }

  onHeroCollide(hero, collider, result) {
    if(hero.mod().removed) return
    if(collider.ownerId === hero.id) return
    onHeroTrigger(hero, collider, result, { fromInteractButton: false })
  }

  getHeroId(resume) {
    let savedHero = localStorage.getItem('hero');
    if(resume && savedHero && JSON.parse(savedHero).id){
      HERO.id = JSON.parse(savedHero).id
    } else {
      HERO.id = 'hero-'+global.uniqueID()
    }
  }

  setDefault() {
    global.defaultHero = {
    	width: 40,
    	height: 40,
    	velocityX: 0,
    	velocityY: 0,
      _flatVelocityX: 0,
      _flatVelocityY: 0,
      _cantInteract: false,
    	velocityMax: 400,
      color: '#FFFFFF',
    	// accY: 0,
    	// accX: 0,
    	// accDecayX: 0,
    	// accDecayY: 0,
    	velocityInitial: 125,
    	arrowKeysBehavior: 'flatDiagonal',
      // actionButtonBehavior: 'dropWall',
    	jumpVelocity: -440,
    	// spawnPointX: (40) * 20,
    	// spawnPointY: (40) * 20,
    	zoomMultiplier: 1.875,
      // x: global.grid.startX + (global.grid.width * global.grid.nodeSize)/2,
      // y: global.grid.startY + (global.grid.height * global.grid.nodeSize)/2,
      lives: 1,
      score: 0,
      dialogue: [],
      defaultSprite: 'solidcolorsprite',
      sprite: 'solidcolorsprite',
      paths: {},
      flags : {
        showDialogue: false,
        showScore: false,
        showLives: false,
        paused: false,
      },
      directions: {
        up: false,
        down: false,
        right: false,
        left: false,
      },

      heroMenu: {},
      objectMenu: {},
      creator: {},
      spriteSheets: {},

      quests: {},
      questState: {},
      triggers: {},
      triggerState: {},
      tags: {},
      dialogueChoices: {},
      cameraTweenToTargetX: false,
      cameraTweenToTargetY: false,
      cameraTweenSpeedXExtra: 0,
      cameraTweenSpeedYExtra: 0,
      cameraTweenSpeed: 2,
      // velocityDecay: 50,
      // cameraRotation: 0,
      heroSummonType: 'default',


    }

    global.local.on('onGridLoaded', () => {
      global.defaultHero.tags = {...global.defaultHeroTags}
      global.defaultHero.x = GAME.grid.startX + (GAME.grid.width * GAME.grid.nodeSize)/2
      global.defaultHero.y = GAME.grid.startY + (GAME.grid.height * GAME.grid.nodeSize)/2
      global.defaultHero.width = GAME.grid.nodeSize
      global.defaultHero.height = GAME.grid.nodeSize

      global.defaultHero.subObjects = {
        heroInteractTriggerArea: {
          x: 0, y: 0, width: 40, height: 40,
          relativeWidth: GAME.grid.nodeSize * 2,
          relativeHeight: GAME.grid.nodeSize * 2,
          relativeX: 0,
          relativeY: 0,
          tags: { obstacle: false, invisible: true, heroInteractTriggerArea: true },
        },
        awarenessTriggerArea: {
          x: 0, y: 0, width: 40, height: 40,
          relativeWidth: GAME.grid.nodeSize * 12,
          relativeHeight: GAME.grid.nodeSize * 12,
          relativeX: 0,
          relativeY: 0,
          tags: { obstacle: false, invisible: true, awarenessTriggerArea: true, relativeToDirection: true, },
        },
        // spear: {
        //   id: 'spear-'+global.uniqueID(),
        //   x: 0, y: 0, width: 40, height: 40,
        //   relativeX: GAME.grid.nodeSize/5,
        //   relativeY: -GAME.grid.nodeSize,
        //   relativeWidth: -GAME.grid.nodeSize * .75,
        //   relativeHeight: 0,
        //   relativeToDirection: true,
        //   tags: { monsterDestroyer: true, obstacle: false },
        // }
      }
    })
  }

  onUpdate(delta) {
    if(PAGE.role.isPlayer && (HERO.originalId === HERO.id)){
      localStorage.setItem('hero', JSON.stringify(GAME.heros[HERO.id]))
    }

    if(PAGE.role.isPlayer && (HERO.originalId === HERO.id || HERO.ghostControl)){
      // we locally update the hero input as host so hosts do not send
      if(!PAGE.role.isHost && !PAGE.typingMode && !CONSTRUCTEDITOR.open) {
        global.socket.emit('sendHeroInput', GAME.keysDown, HERO.id)
      }
    }
  }

  spawn(hero) {
    const {x, y } = HERO.getSpawnCoords(hero)

    hero.x = x
    hero.y = y
    hero.velocityX = 0
    hero.velocityY = 0
    hero.velocityAngle = 0
  }

  getSpawnCoords(hero) {
    let x = 960;
    let y = 960;

    if(hero.flags && hero.flags.isAdmin && GAME.defaultHero) {
      x = GAME.defaultHero.spawnPointX
      y = GAME.defaultHero.spawnPointY
    } else if(hero.mod().spawnPointX && typeof hero.mod().spawnPointX == 'number' && hero.mod().spawnPointY && typeof hero.mod().spawnPointY == 'number') {
      // hero spawn point takes precedence
      x = hero.mod().spawnPointX
      y = hero.mod().spawnPointY
    } else if(GAME && GAME.world.worldSpawnPointX && typeof GAME.world.worldSpawnPointX == 'number' && GAME.world.worldSpawnPointY && typeof GAME.world.worldSpawnPointY == 'number') {
      x = GAME.world.worldSpawnPointX
      y = GAME.world.worldSpawnPointY
    }

    return {
      x,
      y,
    }
  }

  respawn(hero) {
    /// send objects that are possibly camping at their spawn point back to their spawn point
    if(PAGE.role.isHost && GAME && GAME.world && GAME.world.tags.noCamping) {
      GAME.objects.forEach((obj) => {
        if(obj.mod().removed) return

        if(obj.mod().tags.zombie || obj.mod().tags.homing) {
          const { gridX, gridY } = gridUtil.convertToGridXY(obj)
          obj.gridX = gridX
          obj.gridY = gridY

          const spawnGridPos = gridUtil.convertToGridXY({x: obj.mod().spawnPointX, y: obj.mod().spawnPointY})

          obj.path = pathfinding.findPath({
            x: gridX,
            y: gridY,
          }, {
            x: spawnGridPos.gridX,
            y: spawnGridPos.gridY,
          }, obj.mod().pathfindingLimit)
        }
      })
    }

    global.emitGameEvent('onHeroRespawn', hero)
    HERO.spawn(hero)
  }

  resetToDefault(hero, useGame) {
    HERO.deleteHero(hero)
    hero.subObjects = {}
    hero.triggers = {}
    let newHero = JSON.parse(JSON.stringify(global.defaultHero))
    if(useGame) {
      const id = hero.id
      const heroSummonType = hero.heroSummonType
      if((heroSummonType === 'default' || heroSummonType === 'resume') && GAME.defaultHero) {
        newHero = JSON.parse(JSON.stringify(GAME.defaultHero))
      } else if(heroSummonType){
        const libraryHero = _.cloneDeep(global.heroLibrary[heroSummonType])
        let gameDefaultHero
        if(libraryHero.useGameDefault && GAME.defaultHero) {
          const gameDefaultHero = JSON.parse(JSON.stringify(GAME.defaultHero))
          newHero = global.mergeDeep(defaultHero, gameDefaultHero, libraryHero.JSON)
        } else if(libraryHero) {
          newHero = global.mergeDeep(defaultHero, libraryHero.JSON)
        }
      }
      newHero.heroSummonType = heroSummonType
      // newHero = JSON.parse(JSON.stringify(global.mergeDeep(newHero, GAME.defaultHero)))
    }
    OBJECTS.forAllSubObjects(newHero.subObjects, (subObject) => {
      subObject.id = 'subObject-'+global.uniqueID()
    })
    if(!hero.id) {
      alert('hero getting reset without id')
    }
    newHero.id = hero.id
    HERO.spawn(newHero)
    HERO.addHero(newHero)
    return newHero
  }

  forAll(fx) {
    Object.keys(GAME.heros).forEach((id) => {
      fx(GAME.heros[id], id)
    })
  }

  respawnAll() {
    GAME.heroList.forEach(({id}) => {
      HERO.respawn(GAME.heros[id])
    })
  }

  updateAll(update) {
    GAME.heroList.forEach(({id}) => {
      global.mergeDeep(GAME.heros[id], update)
    })
  }

  zoomAnimation(hero) {
    if(hero.animationZoomMultiplier == hero.zoomMultiplier && hero.animationZoomTarget == global.constellationDistance) {
      global.emitEvent('onConstellationAnimationStart', hero)
    }
    if(hero.animationZoomMultiplier == global.constellationDistance && hero.zoomMultiplier == hero.animationZoomTarget) {
      setTimeout(() => {
        global.emitEvent('onConstellationAnimationEnd', hero)
      }, 2500)
    }

    if(hero.animationZoomTarget > hero.animationZoomMultiplier) {
      hero.animationZoomMultiplier = hero.animationZoomMultiplier/.97
      if(hero.animationZoomTarget < hero.animationZoomMultiplier) {
        if(hero.endAnimation) {
          hero.animationZoomMultiplier = null
          hero.animationZoomTarget = null
        } else {
          hero.animationZoomMultiplier = hero.animationZoomTarget
        }
      }
    }

    if(hero.animationZoomTarget < hero.animationZoomMultiplier) {
      hero.animationZoomMultiplier = hero.animationZoomMultiplier/1.03
      if(hero.animationZoomTarget > hero.animationZoomMultiplier) {
        if(hero.endAnimation) {
          hero.animationZoomMultiplier = null
          hero.animationZoomTarget = null
        } else {
          hero.animationZoomMultiplier = hero.animationZoomTarget
        }
      }
    }
  }

  getViewBoundaries(hero) {
    const value = {
      width: HERO.cameraWidth * hero.zoomMultiplier,
      height: HERO.cameraHeight * hero.zoomMultiplier,
      centerX: hero.x + hero.mod().width/2,
      centerY: hero.y + hero.mod().height/2,
    }
    value.x = value.centerX - value.width/2
    value.y = value.centerY - value.height/2
    if(hero.id === HERO.id && MAP.camera.hasHitLimit) {
      value.x = MAP.camera.x
      value.y = MAP.camera.y
    }

    let nonGrid = {...value}
    const { leftDiff, rightDiff, topDiff, bottomDiff } = gridUtil.getAllDiffs(value)
    gridUtil.snapDragToGrid(value)

    const { gridX, gridY, gridWidth, gridHeight } = gridUtil.convertToGridXY(value)

    return {
      gridX,
      gridY,
      gridWidth,
      gridHeight,
      centerX: value.centerX,
      centerY: value.centerY,
      minX: value.x,
      minY: value.y,
      x: nonGrid.x,
      y: nonGrid.y,
      width: nonGrid.width,
      height: nonGrid.height,
      maxX: value.x + value.width,
      maxY: value.y + value.height,
      leftDiff,
      rightDiff,
      topDiff,
      bottomDiff,
      cameraWidth: HERO.cameraWidth,
      cameraHeight: HERO.cameraHeight,
    }
  }

  summonFromGameData(hero) {
    // if we have decided to restore position, find hero in hero list
    if(GAME.world.tags.shouldRestoreHero && GAME.heros && hero) {
      GAME.heroList.forEach((currentHero) => {
        if(currentHero.id == hero.id) {
          return currentHero
        }
      })
      console.log('failed to find hero with id' + HERO.id)
    }

    let newHero
    const id = hero.id
    const heroSummonType = hero.heroSummonType

    const defaultHero = _.cloneDeep(global.defaultHero)
    if((heroSummonType === 'default' || heroSummonType === 'resume') && GAME.defaultHero) {
      const gameDefaultHero = JSON.parse(JSON.stringify(GAME.defaultHero))
      newHero = global.mergeDeep(defaultHero, gameDefaultHero)
      // console.log('summoning from default', GAME.defaultHero)
    } else if(heroSummonType) {
      const libraryHero = _.cloneDeep(global.heroLibrary[heroSummonType])
      let gameDefaultHero
      if(libraryHero.useGameDefault && GAME.defaultHero) {
        const gameDefaultHero = JSON.parse(JSON.stringify(GAME.defaultHero))
        newHero = global.mergeDeep(defaultHero, gameDefaultHero, libraryHero.JSON)
      } else if(libraryHero) {
        newHero = global.mergeDeep(defaultHero, libraryHero.JSON)
      }
    } else {
      // const gameDefaultHero = JSON.parse(JSON.stringify(GAME.defaultHero))
      // newHero = global.mergeDeep(defaultHero, gameDefaultHero)
      console.log('warning no hero summon type', hero)
    }


    if(newHero) {
      newHero.id = id
      newHero.user = hero.user
      newHero.heroSummonType = heroSummonType
      OBJECTS.forAllSubObjects(newHero.subObjects, (subObject) => {
        subObject.id = 'subObject-'+global.uniqueID()
      })
      HERO.spawn(newHero)
      return newHero
    } else {
      return HERO.resetToDefault(hero)
    }
  }

  getState(hero) {
    let state = {
      x: hero.x,
      y: hero.y,
      _initialY: hero._initialY,
      _initialX: hero._initialX,
      _deltaY: hero._deltaY,
      _deltaX: hero._deltaX,
      velocityY: hero.velocityY,
      velocityX: hero.velocityX,
      _cantInteract: hero._cantInteract,
      _canWallJumpLeft: hero._canWallJumpLeft,
      _canWallJumpRight: hero._canWallJumpRight,
      _flatVelocityX: hero._flatVelocityX,
      _flatVelocityY: hero._flatVelocityY,
      _floatable: hero._floatable,
      _dashable: hero._dashable,
      _shootingLaser: hero._shootingLaser,
      _walkingSound: hero._walkingSound,
      _walkingOnId: hero._walkingOnId,
      // _shootingLaser: hero._shootingLaser,
      _landingObjectId: hero._landingObjectId,
      lastHeroUpdateId: hero.lastHeroUpdateId,
      lastDialogueId: hero.lastDialogueId,
      directions: hero.directions,
      sprite: hero.sprite,
      gridX: hero.gridX,
      gridY: hero.gridY,
      inputDirection: hero.inputDirection,
      reachablePlatformWidth: hero.reachablePlatformWidth,
      reachablePlatformHeight: hero.reachablePlatformHeight,
      animationZoomMultiplier: hero.animationZoomMultiplier,
      animationZoomTarget: hero.animationZoomTarget,
      endAnimation: hero.endAnimation,
      cutscenes: hero.cutscenes,
      goals: hero.goals,
      dialogue: hero.dialogue,
      dialogueName: hero.dialogueName,
      dialogueId: hero.dialogueId,
      choiceOptions: hero.choiceOptions,
      _parentId: hero._parentId,
      _skipNextGravity: hero._skipNextGravity,
      _breakMaxVelocity: object._breakMaxVelocity,
      interactableObjectId: hero.interactableObjectId,
      _prevInteractableObjectId: hero._prevInteractableObjectId,
      gridHeight: hero.gridHeight,
      gridWidth: hero.gridWidth,
      updateHistory: hero.updateHistory,
      onObstacle: hero.onObstacle,
      onLand: hero.onLand,
      onWater: hero.onWater,
      angle: hero.angle,
      questState: hero.questState,
      customState: hero.customState,
      _objectsWithin: hero._objectsWithin,
      _objectsTouching: hero._objectsTouching,
      _objectsAwareOf: hero._objectsAwareOf,
      _flipY: hero._flipY,
      // conditionTestCounts: hero.conditionTestCounts,
      emitterData: hero.emitterData,
      _prevZoomMultiplier: hero._prevZoomMultiplier,

      _pathIdIndex: hero._pathIdIndex,
      _pathWait: hero._pathWait,
      _pathOnWayBack:  hero._pathOnWayBack,

      zoomMultiplierTarget: hero.zoomMultiplierTarget,

      _fireDialogueCompleteWithSpeakerId: hero._fireDialogueCompleteWithSpeakerId,
    }

    if(hero.subObjects) {
      state.subObjects = {}
      OBJECTS.forAllSubObjects(hero.subObjects, (subObject, subObjectName) => {
        state.subObjects[subObjectName] = OBJECTS.getState(subObject)
        global.removeFalsey(state.subObjects[subObjectName])
      })
    }

    if(hero.triggers) {
      state.triggers = {}
      Object.keys(hero.triggers).forEach((triggerId) => {
        const { pool, eventCount, disabled } = hero.triggers[triggerId]

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

  getProperties(hero) {
    let properties = {
      id: hero.id,
      objectType: hero.objectType,
      width: hero.width,
      height: hero.height,
      tags: hero.tags,
      descriptors: hero.descriptors,

      heroSummonType: hero.heroSummonType,

      user: hero.user,

      sprites: hero.sprites,

      zButtonBehavior: hero.zButtonBehavior,
      zButtonBehaviorLabel: hero.zButtonBehaviorLabel,
      xButtonBehavior: hero.xButtonBehavior,
      xButtonBehaviorLabel: hero.xButtonBehaviorLabel,
      cButtonBehavior: hero.cButtonBehavior,
      cButtonBehaviorLabel: hero.cButtonBehaviorLabel,
      arrowKeysBehavior: hero.arrowKeysBehavior,
      spaceBarBehavior: hero.spaceBarBehavior,
      spaceBarBehaviorLabel: hero.spaceBarBehaviorLabel,

      color: hero.color,
      defaultSprite: hero.defaultSprite,
      upSprite: hero.upSprite,
      leftSprite: hero.leftSprite,
      downSprite: hero.downSprite,
      rightSprite: hero.rightSprite,
      opacity: hero.opacity,

      lives: hero.lives,
      spawnPointX: hero.spawnPointX,
      spawnPointY: hero.spawnPointY,
      relativeX: hero.relativeX,
      relativeY: hero.relativeY,
      relativeId: hero.relativeId,
      parentId: hero.parentId,
      quests: hero.quests,
      customProps: hero.customProps,
      hooks: hero.hooks,
      subObjectChances: hero.subObjectChances,

      flags: hero.flags,
      heroMenu: hero.heroMenu,
      objectMenu: hero.objectMenu,
      worldMenu: hero.worldMenu,
      spriteSheets: hero.spriteSheets,
      creator: hero.creator,

      sequences: hero.sequences,

      zoomMultiplier: hero.zoomMultiplier,
      cameraTweenToTargetX: hero.cameraTweenToTargetX,
      cameraTweenToTargetY: hero.cameraTweenToTargetY,
      cameraTweenSpeedXExtra: hero.cameraTweenSpeedXExtra,
      cameraTweenSpeedYExtra: hero.cameraTweenSpeedYExtra,
      cameraTweenSpeed: hero.cameraTweenSpeed,
      // cameraRotation: hero.cameraRotation,

      resourceWithdrawAmount: hero.resourceWithdrawAmount,
      resourceTags: hero.resourceTags,
      resourceLimit: hero.resourceLimit,

      emitterData: hero.emitterData,
      emitterType: hero.emitterType,
      emitterTypeExplosion: hero.emitterTypeExplosion,
      emitterTypePoweredUp: hero.emitterTypePoweredUp,
      emitterTypeJump: hero.emitterTypeJump,
      emitterTypeDash: hero.emitterTypeDash,
      emitterTypeHeroCollide: hero.emitterTypeHeroCollide,

      velocityMax: hero.velocityMax,
      velocityMaxXExtra: hero.velocityMaxXExtra,
      velocityMaxYExtra: hero.velocityMaxYExtra,
      velocityInputGoal: hero.velocityInputGoal,

      velocityInitial: hero.velocityInitial,
      velocityInitialXExtra: hero.velocityInitialXExtra,
      velocityInitialYExtra: hero.velocityInitialYExtra,
      velocityDelta: hero.velocityDelta,

      inchPower: hero.inchPower,

      velocityDecay: hero.velocityDecay,
      velocityDecayXExtra: hero.velocityDecayXExtra,
      velocityDecayYExtra: hero.velocityDecayYExtra,
      velocityInAirDecayExtra: hero.velocityInAirDecayExtra,
      velocityOnWaterDecayExtra: hero.velocityOnWaterDecayExtra,
      velocityOnLandDecayExtra: hero.velocityOnLandDecayExtra,

      gravityVelocityY: hero.gravityVelocityY,

      floatJumpTimeout: hero.floatJumpTimeout,
      jumpVelocity: hero.jumpVelocity,

      dashTimeout: hero.dashTimeout,
      dashVelocity: hero.dashVelocity,
      bouncyness: hero.bouncyness,

      pathId: hero.pathId,
      pathfindingLimitId: hero.pathfindingLimitId,
      pathfindingGridId: hero.pathfindingGridId,

      dialogueChoices: hero.dialogueChoices,

      monsterEffect: hero.monsterEffect,
      monsterEffectValue: hero.monsterEffectValue,
    }

    if(hero.subObjects) {
      properties.subObjects = {}
      OBJECTS.forAllSubObjects(hero.subObjects, (subObject, subObjectName) => {
        properties.subObjects[subObjectName] = OBJECTS.getProperties(subObject)
        global.removeFalsey(properties.subObjects[subObjectName])
      })
    }

    if(hero.triggers) {
      properties.triggers = {}
      Object.keys(hero.triggers).forEach((triggerId) => {
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
            } = hero.triggers[triggerId]

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
          eventName,
          eventThreshold,
          mainObjectId,
          mainObjectTag,
          guestObjectId,
          guestObjectTag,
          initialTriggerPool,

          modEndOthers,
          modId,
          modPriority,
          modResetPhysics,
          modResetPhysicsEnd,
          // just for mods right now, not actual Condition
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
          effectBranchName,

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

  getMapState(hero) {
    let mapState = {
      id: hero.id,
      chat: hero.chat,
      width: hero.width,
      height: hero.height,
      interactableObjectId: hero.interactableObjectId,
      dialogue: hero.dialogue,
      dialogueName: hero.dialogueName,
      dialogueId: hero.dialogueId,

      choiceOptions: hero.choiceOptions,
      sprite: hero.sprite,
      defaultSprite: hero.defaultSprite,

      directions: hero.directions,
      zoomMultiplier: hero.zoomMultiplier,
      animationZoomMultiplier: hero.animationZoomMultiplier,
      color: hero.color,
      inputDirection: hero.inputDirection,
      lives: hero.lives,
      _flipY: hero._flipY,
      score: hero.score,
      removed: hero.removed,
      questState: hero.questState,
      angle: hero.angle,
      customMapState: hero.customMapState,
      // velocityY: hero.velocityY,
      // velocityX: hero.velocityX ,

      cutscenes: hero.cutscenes,
      goals: hero.goals,

      keysDown: hero.keysDown,

      popoverText: hero.popoverText,

      navigationTargetId: hero.navigationTargetId,

      flags: hero.flags,
      tags: hero.tags,
      heroMenu: hero.heroMenu,
      objectMenu: hero.objectMenu,
      worldMenu: hero.worldMenu,
      creator: hero.creator,
      spriteSheets: hero.spriteSheets,

      path: hero.path,
      targetXY: hero.targetXY,

      heroSummonType: hero.heroSummonType,

      zButtonBehavior: hero.zButtonBehavior,
      xButtonBehavior: hero.xButtonBehavior,
      cButtonBehavior: hero.cButtonBehavior,
      spaceBarBehavior: hero.spaceBarBehavior,

      _shootingLaser: hero._shootingLaser,
      _walkingSound: hero._walkingSound,

      zoomMultiplierTarget: hero.zoomMultiplierTarget,
    }

    if(hero.subObjects) {
      mapState.subObjects = {}
      OBJECTS.forAllSubObjects(hero.subObjects, (subObject, subObjectName) => {
        mapState.subObjects[subObjectName] = OBJECTS.getMapState(subObject)
      })
    }

    return mapState
  }

  onEditHero(updatedHero) {
    if(updatedHero.arrowKeysBehavior || (updatedHero.tags && updatedHero.tags.gravityY !== undefined)) {
      updatedHero.velocityX = 0
      updatedHero.velocityY = 0
    }
    if(updatedHero.zoomMultiplier && updatedHero.zoomMultiplier !== GAME.heros[updatedHero.id].zoomMultiplier) {
      global.local.emit('onZoomChange', updatedHero.id)
    }
    HERO.resetReachablePlatformArea(updatedHero)
    global.mergeDeep(GAME.heros[updatedHero.id], updatedHero)
  }

  onResetHeroToDefault(hero) {
    GAME.heros[hero.id] = HERO.resetToDefault(GAME.heros[hero.id])
  }
  onResetHeroToGameDefault(hero) {
    GAME.heros[hero.id] = HERO.resetToDefault(GAME.heros[hero.id], true)
  }

  onRespawnHero(hero) {
    HERO.respawn(GAME.heros[hero.id])
  }

  addHero(hero, options = {}) {
    GAME.heros[hero.id] = hero
    if(hero.subObjects) {
      OBJECTS.forAllSubObjects(hero.subObjects, (subObject, subObjectName) => {
        OBJECTS.addSubObject(hero, subObject, subObjectName)
      })
    }
    if(!options.skipEventListeners && hero.triggers) {
      Object.keys(hero.triggers).forEach((triggerId) => {
        const trigger = hero.triggers[triggerId]
        triggers.addTrigger(hero, trigger)
      })
    }

    hero._dashable = true
    hero._floatable = true

    if(GAME.gameState.started) global.emitGameEvent('onHeroAwake', hero)
    PHYSICS.addObject(hero)
  }

  removeHero(hero) {
    OBJECTS.forAllSubObjects(hero.subObjects, (subObject) => {
      if(subObject.mod().tags.dropOnOwnerRespawn) {
        dropObject(hero, subObject)
      } else {
        OBJECTS.removeSubObject(subObject)
      }
    })
    GAME.heros[hero.id].removed = true
    // if(global.popoverOpen[hero.id]) MAP.closePopover(hero)
  }

  getList() {
    return Object.keys(GAME.heros).map((id) => {
      return GAME.heros[id]
    })
  }

  onDeleteHero(heroId) {
    const hero = GAME.heros[heroId]
    if(!hero) return
    HERO.deleteHero(hero)
    global.local.emit('onDeletedHero', hero)
    delete GAME.heros[heroId]
    GAME.heroList = GAME.heroList.filter(({id}) => id !== heroId)
  }

  onDeleteQuest(heroId, questId) {
    const hero = GAME.heros[heroId]
    if(hero.quests) delete hero.quests[questId]
  }

  deleteHero(hero) {
    if(hero.subObjects) {
      OBJECTS.forAllSubObjects(hero.subObjects, (subObject, subObjectName) => {
        OBJECTS.deleteSubObject(hero, subObject, subObjectName)
      })
    }

    if(hero.triggers) {
      Object.keys(hero.triggers).forEach((triggerId) => {
        triggers.removeTriggerEventListener(hero, triggerId)
      })
    }

    PHYSICS.removeObject(GAME.heros[hero.id])
  }

  onHeroLand(hero, object) {
    if(object.mod().tags.destroyOnHeroLand) {
      object._destroy = true
      object._destroyedById = hero.id
    }
  }

  onHeroTouchStart(hero, object) {
    if(!object) return
    if(object.tags.cameraZoomToFit) {
      hero._prevZoomMultiplier = hero.zoomMultiplier
      if(object.height < object.width) {
        hero.zoomMultiplier = object.height/HERO.cameraHeight
      } else {
        hero.zoomMultiplier = object.width/HERO.cameraWidth
      }
      global.emitGameEvent('onZoomChange', hero.id)
    }

    let moddedTags = object.mod().tags
    if(moddedTags.increaseHeroCurrentVelocityOnTouchStart) {
      if(hero.velocityX < 0 || hero._flatVelocityX < 0) {
        hero.velocityX-= object.increaseHeroCurrentVelocityAmount || 400
      } else if(hero.velocityX > 0 || hero._flatVelocityX > 0){
        hero.velocityX+= object.increaseHeroCurrentVelocityAmount || 400
      }
      if(hero.velocityY < 0 || hero._flatVelocityY < 0) {
        hero.velocityY-= object.increaseHeroCurrentVelocityAmount || 400
      } else if(hero.velocityY > 0 || hero._flatVelocityY > 0){
        hero.velocityY+= object.increaseHeroCurrentVelocityAmount || 400
      }
    }
    if(moddedTags.increaseHeroLeftVelocityOnTouchStart) {
      hero.velocityX-= object.increaseHeroCurrentVelocityAmount || 400
    }

    if(moddedTags.increaseHeroRightVelocityOnTouchStart) {
      hero.velocityX+= object.increaseHeroCurrentVelocityAmount || 400
    }

    if(moddedTags.increaseHeroUpVelocityOnTouchStart) {
      hero.velocityY-= object.increaseHeroCurrentVelocityAmount || 400
    }

    if(moddedTags.increaseHeroDownVelocityOnTouchStart) {
      hero.velocityY+= object.increaseHeroCurrentVelocityAmount || 400
    }

    if(moddedTags.stopHeroOnTouchStart) {
      hero.velocityY = 0
      hero.velocityX = 0
    }

    if(moddedTags['heroAnimationOnTouchStart']) {
      global.socket.emit('objectAnimation', object.emitterTypeHeroCollide || 'editObject', hero.id)
    }

    if(moddedTags.scoreSubtractOnTouchStart) {
      let score = (object.scoreSubtract ? object.scoreSubtract : 1)
      hero.score -= score
      if(object.scoreSubtractPopoverText) {
        hero.popoverText = object.scoreSubtractPopoverText
        setTimeout(() => {
          hero.popoverText = null
        }, 600)
      }
      global.emitGameEvent('onHeroScoreSubtract', hero, score)
    }

    if(moddedTags.scoreAddOnTouchStart) {
      let score = (object.scoreAdd ? object.scoreAdd : 1)
      hero.score += score
      if(object.scoreAddPopoverText) {
        hero.popoverText = object.scoreAddPopoverText
        setTimeout(() => {
          hero.popoverText = null
        }, 600)
      }
      global.emitGameEvent('onHeroScoreAdd', hero, score)
    }
  }

  onHeroTouchEnd(hero, object) {
    if(!object) return
    if(object.tags.cameraZoomToFit) {
      hero.zoomMultiplier = hero._prevZoomMultiplier
      global.emitGameEvent('onZoomChange', hero.id)
    }
  }

  onNetworkUpdateHeros(updatedHeros) {
    // delete updatedHero.x
    // delete updatedHero.y
    if(!PAGE.gameLoaded) return
    if(!PAGE.role.isHost) {
      updatedHeros.forEach((updatedHero) => {
        global.mergeDeep(GAME.heros[updatedHero.id], updatedHero)
        if(updatedHero.subObjects) OBJECTS.forAllSubObjects(updatedHero.subObjects, (so) => {
          global.mergeDeep(GAME.objectsById[so.id], so)
        })
      })
    }
  }

  onNetworkUpdateHerosPos(updatedHerosPos) {
    if(!PAGE.gameLoaded) return
    if(!PAGE.role.isHost) {
      // if(GAME.world.tags.interpolateHeroPositions) {
      //   SI.snapshot.add(updatedHerosPos)
      // } else {
        updatedHerosPos.forEach((hero) => {
          if(hero.x) GAME.heros[hero.id].x = hero.x
          if(hero.y) GAME.heros[hero.id].y = hero.y
          if(hero.subObjects) {
            OBJECTS.forAllSubObjects(hero.subObjects, (so, name) => {
              if(GAME.heros[hero.id].subObjects[name]) {
                if(so.x) GAME.heros[hero.id].subObjects[name].x = so.x
                if(so.x) GAME.heros[hero.id].subObjects[name].y = so.y
              }
            })
          }
        })
      // }
    }
  }

  onUpdateHero(hero, keysDown, delta) {
    if(hero.mod().removed) return

    const zoomTarget = hero.mod().zoomMultiplierTarget
    if(zoomTarget) {
      if(zoomTarget > hero.zoomMultiplier) {
        hero.zoomMultiplier = hero.zoomMultiplier/.97
        if(zoomTarget < hero.zoomMultiplier) {
          hero.zoomMultiplier = zoomTarget
          hero.zoomMultiplierTarget = null
        }
      }

      if(zoomTarget < hero.zoomMultiplier) {
        hero.zoomMultiplier = hero.zoomMultiplier/1.03
        if(zoomTarget > hero.zoomMultiplier) {
          hero.zoomMultiplier = zoomTarget
          hero.zoomMultiplierTarget = null
        }
      }
    }

    if(!hero.tags) console.log('REAL ROTATE', hero)
    if(!hero.tags) return

    if(hero.mod().tags.realRotate) {
      if(typeof hero.angle != 'number') hero.angle = 0
      hero.angle += 1 * delta
    }
    if(hero.mod().tags.realRotateFast) {
      if(typeof hero.angle != 'number') hero.angle = 0
      hero.angle += 7 * delta
    }

    if(hero.mod().tags.autoUpdateMaxVelocity) {
      let highest = hero.velocityMax
      if(Math.abs(hero.jumpVelocity) > highest) {
        highest = Math.abs(hero.jumpVelocity)
      }
      if(Math.abs(hero.dashVelocity) > highest) {
        highest = Math.abs(hero.dashVelocity)
      }
      if(Math.abs(hero.velocityInputGoal) > highest) {
        highest = Math.abs(hero.velocityInputGoal)
      }
      hero.velocityMax = highest
    }
  }

  onRender(delta) {
    if(PAGE.role.isHost) return

    if(!PAGE.role.isHost && GAME.world.tags.predictNonHostPosition) {
      // PHYSICS.prepareObjectsAndHerosForMovementPhase()
      // let heroPrediction = _.cloneDeep(GAME.heros[HERO.id])

      const hero = GAME.heros[HERO.id]
      if(hero.flags.paused) return
      let prevY = hero.y
      input.onUpdate(hero, GAME.keysDown, delta)
      // global.local.emit('onUpdateHero', hero, GAME.heroInputs[hero.id], delta)
      PHYSICS.updatePosition(hero, delta)
      PHYSICS.prepareObjectsAndHerosForCollisionsPhase(hero, [], [])
      PHYSICS.heroCorrection(hero, [], [])
      PHYSICS.postPhysics([], [])
      global.clientInterpolationVault.add(
        global.SI.snapshot.create([{ id: hero.id, x: hero.x, y: hero.y }])
      )
    }

    // const serverSnapshot = SI.vault.get()

    // this isnt working... dont use it.
    // the problem is that our prediction is out of sync with the server somehow..
    // im not sure whats causing it. it seems to be related to the timing of inputs<<<<<<<<<<
    // espcially since we have an authoritative client instead of authortitaive server
    //https://www.gabrielgambetta.com/entity-interpolation.html
    if(false && serverSnapshot && GAME.world.tags.predictNonHostPosition) {
      // get the closest player snapshot that matches the server snapshot time
      // try {
        const heroSnapshot = global.clientInterpolationVault.get(serverSnapshot.time, true)

        if (serverSnapshot && heroSnapshot) {
          // get the current hero position on the server
          const serverPos = serverSnapshot.state.filter(s => s.id === HERO.id)[0]

          const hero = GAME.heros[HERO.id]

          const offsetPacketX = heroSnapshot.state[0].x - serverPos.x
          const offsetPacketY = heroSnapshot.state[0].y - serverPos.y

          const offsetCurrentX = hero.x - serverPos.x
          const offsetCurrentY = hero.y - serverPos.y

          const correction = 10

          if(Math.abs(offsetCurrentX) > (GAME.grid.nodeSize * 1)) {
            if(!hero.resetXThreshold) hero.resetXThreshold = 0
            hero.resetXThreshold++
            if(hero.resetXThreshold > 60) {
              hero.x = serverPos.x
              hero.resetXThreshold = 0
            }
          } else {
            hero.resetXThreshold = 0
            if(offsetPacketX === 0) {

            // }
            // else if(Math.abs(offsetPacketX) < 1) {
            //   hero.x -= offsetPacketX
            } else  {
              let diff = offsetPacketX / correction
              // if(diff > 0 && diff < .1) diff = .1
              // if(diff < 0 && diff > -.1) diff = -.1
              hero.x -= diff
            }
          }
          // heroSnapshot.state[0].x = hero.x

          if(Math.abs(offsetCurrentY) > (GAME.grid.nodeSize * 1)) {
            if(!hero.resetYThreshold) hero.resetYThreshold = 0
            hero.resetYThreshold++
            if(hero.resetYThreshold > 60) {
              console.log('resetY')
              hero.y = serverPos.y
              hero.resetYThreshold = 0
            }
          } else {
            hero.resetYThreshold = 0
            if(offsetPacketY === 0) {

            // }
            // if(Math.abs(offsetPacketY)/correction < 1) {
            //   hero.y -= offsetPacketY
            } else {
              let diff = offsetPacketY / correction
              // if(diff > 0 && diff < .1) diff = .1
              // if(diff < 0 && diff > -.1) diff = -.1

              hero.y -= diff
            }
          }
          // heroSnapshot.state[0].y = hero.y
        }
      // }
    }

    // if(GAME.world.tags.interpolateHeroPositions) {
    //   // calculate the interpolation for the parameters x and y and return the snapshot
    //   const snapshot = SI.calcInterpolation('x y') // [deep: string] as optional second parameter
    //
    //   if(snapshot) {
    //     // access your state
    //     const { state } = snapshot
    //     state.forEach((hero) => {
    //       if(GAME.world.tags.predictNonHostPosition && hero.id == HERO.id) return
    //       GAME.heros[hero.id].x = hero.x
    //       GAME.heros[hero.id].y = hero.y
    //     })
    //   }
    // }
  }

  onSendHeroInput(input, heroId) {
    // dont update input for hosts hero since we've already locally updated
    // if(PAGE.role.isHost && GAME.heros[HERO.id] && heroId == HERO.originalId) {
    //   return
    // }
    GAME.heroInputs[heroId] = input
    if(GAME.heros[heroId]) GAME.heros[heroId].keysDown = input
  }

  onSendHeroKeyDown(key, heroId) {
    // dont do keydown event for hosts hero since we've already done locally
    if(PAGE.role.isPlayer && heroId == HERO.originalId) return
    let hero = GAME.heros[heroId]
    input.onKeyDown(key, hero)
  }

  onSendHeroKeyUp(key, heroId) {
    // dont do keydown event for hosts hero since we've already done locally
    if(PAGE.role.isHost && heroId == HERO.originalId) return
    let hero = GAME.heros[heroId]
    input.onKeyUp(key, hero)
  }


  // if the top is within this its definitely reachable. some areas are reachable outside of this
  resetReachablePlatformArea(hero) {
    if(GAME.heros[hero.id].spaceBarBehavior === 'groundJump') {
      if(hero.jumpVelocity !== GAME.heros[hero.id].jumpVelocity || !hero.reachablePlatformHeight) {
        hero.reachablePlatformHeight = HERO.resetReachablePlatformHeight(GAME.heros[hero.id])
      }
      if(hero.jumpVelocity !== GAME.heros[hero.id].jumpVelocity || hero.mod().velocityInitial!== GAME.heros[hero.id].mod().velocityInitial|| !hero.reachablePlatformWidth) {
        hero.reachablePlatformWidth = HERO.resetReachablePlatformWidth(GAME.heros[hero.id])
      }
    } else {
      hero.reachablePlatformHeight = 0
      hero.reachablePlatformWidth = 0
    }

  }

  resetReachablePlatformHeight(hero) {
    let velocity = hero.jumpVelocity
    if(Math.abs(hero.jumpVelocity) > Math.abs(hero.velocityMax)) velocity = Math.abs(hero.velocityMax)

    let gravityVelocityY = GAME.world.gravityVelocityY
    if(!gravityVelocityY) gravityVelocityY = 1000

    let delta = (0 - velocity)/gravityVelocityY
    let height = (velocity * delta) +  ((gravityVelocityY * (delta * delta))/2)
    return height
  }

  resetReachablePlatformWidth(hero) {
    // for flatDiagonal
    let velocityX = hero.mod().velocityInitial
    if(Math.abs(velocityX) > Math.abs(hero.velocityMax)) velocityX = Math.abs(hero.velocityMax)


    let deltaVelocityYToUse = hero.jumpVelocity
    if(Math.abs(hero.jumpVelocity) > Math.abs(hero.velocityMax)) deltaVelocityYToUse = Math.abs(hero.velocityMax)

    let gravityVelocityY = GAME.world.gravityVelocityY
    if(!gravityVelocityY) gravityVelocityY = 1000

    let deltaInAir = (0 - deltaVelocityYToUse)/gravityVelocityY
    let width = (velocityX * deltaInAir)
    return width * 2
  }

  onAddDialogueChoice(heroId, choiceId, choice) {
    if(!GAME.heros[heroId].dialogueChoices) {
      GAME.heros[heroId].dialogueChoices = {}
    }
    GAME.heros[heroId].dialogueChoices[choiceId] = choice
  }

  onDeleteDialogueChoice(heroId, choiceId) {
    delete GAME.heros[heroId].dialogueChoices[choiceId]
  }

  onHeroDestroyed(object) {
    if(object.mod().tags.explodeOnDestroy) {
      global.local.emit('onObjectAnimation', 'explode', object.id)
    }
    if(object.mod().tags.spinOffOnDestroy) {
      global.local.emit('onObjectAnimation', 'spinOff', object.id)
    }
    if(object.mod().tags.implodeOnDestroy) {
      global.local.emit('onObjectAnimation', 'isolatedExplosion', object.id)
    }
  }

  onHeroRespawn(object) {
    // if(object._prevZoomMultiplier) {
    //   object.zoomMultiplier = object._prevZoomMultiplier
    // }
    if(object.mod().tags.explodeOnDestroy) {
      global.local.emit('onObjectAnimation', 'explode', object.id)
    }
    if(object.mod().tags.spinOffOnDestroy) {
      global.local.emit('onObjectAnimation', 'spinOff', object.id)
    }
    if(object.mod().tags.implodeOnDestroy) {
      global.local.emit('onObjectAnimation', 'isolatedExplosion', object.id)
    }
    OBJECTS.forAllSubObjects(object.subObjects, (subObject) => {
      if(subObject.mod().tags.dropOnOwnerRespawn) {
        dropObject(object, subObject)
      }
    })
  }
}

global.HERO = new Hero()
