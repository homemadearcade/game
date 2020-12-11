import onTalk from './heros/onTalk'
import { startSequence } from './sequence'
import { setPathTarget, setTarget } from './ai/pathfinders.js'
import { equipSubObject, unequipSubObject, pickupObject, dropObject } from './heros/inventory.js'

import axios from 'axios';
import gridUtil from '../utils/grid.js'
import pathfinding from '../utils/pathfinding.js'

  // { effectName: remove, anything: true, hero: false, object: false, world: false, spawnZone: false, timer: false
  //allowed: [anything, plain, hero, object, world, spawnZone, timer]
  // requirements: {
  // effector: false,
  // position: false,
  // JSON: false,
  // effectValue: false,
  // tag: false,
  // eventName: false,
  // id: false,
  // number: false,
  // smallText: false,
  // largeText: false
  // heroOnly: false
  //}
 //}
  window.triggerEffects = {
    remove: {
    },
    respawn: {
    },
    destroy: {
      effectorObject: true,
    },
    mutate: {
      JSON: true,
    },
    mod: {
      JSON: true,
      JSONlabel: 'Mod JSON: ',
      condition: true,
      footer: 'Mod Condition:'
    },
    temporaryEquip: {
      smallText: true,
      label: 'name of subobject',
      condition: true,
      footer: 'Condition:'
    },
    temporaryLibrarySubObject: {
      librarySubObject: true,
      condition: true,
      footer: 'Condition:'
    },
    equipSubObject: {
      smallText: true
    },
    unequipSubObject: {
      smallText: true
    },
    dropSubObject: {
      smallText: true,
    },
    removeSubObject: {
      smallText: true,
    },
    addLibrarySubObject: {
      librarySubObject: true
    },
    equipLibrarySubObject: {
      librarySubObject: true
    },
    pickupObject: {
      effectorObject: true,
    },

    addDialogueChoice: {
      JSON: true,
      label: 'Dialogue Choice id',
      smallText: true,
    },
    temporaryDialogueChoice: {
      JSON: true,
      label: 'Dialogue Choice id',
      smallText: true,
      condition: true,
      footer: 'Condition:'
    },

    branchApply: {
      libraryBranch: true,
    },
    branchModApply: {
      libraryBranch: true,
    },
    branchModRevert: {
      libraryBranch: true,
    },
    libraryMod: {
      libraryMod: true,
    },
    dialogue: {
      heroOnly: true,
      JSON: true,
      effectorObject: true,
    },
    dialogueSet: {
      heroOnly: true,
      smallText: true,
      effectorObject: true,
    },
    simpleDialogue: {
      heroOnly: true,
      largeText: true,
      effectorObject: true,
    },
    tagAdd: {
      tag: true,
    },
    tagRemove: {
      tag: true,
    },
    tagToggle: {
      tag: true,
    },

    goTo: {
      mapSelect: true,
    },
    pathfindTo: {
      mapSelect: true,
    },
    // pursue: {
    //   mapSelect: true,
    // },
    setPath: {
      mapSelect: true,
    },

    //EDITOR
    openGameAsLevel: {
      smallText: true,
      noEffected: true,
    },
    openWorld: {
      smallText: true,
      noEffected: true,
    },
    clearToWorld: {
      smallText: true,
      noEffected: true,
    },
    starViewGo: {},
    starViewReturn: {},
    stopGamePreserve: {},
    stopPrologue: {},

    //create
    anticipatedAdd: {
      libraryObject: true,
      number: true,
    },
    anticipatedAddWall: {
      libraryObject: true,
      number: true,
    },
    anticipatedAddPlatform: {
      libraryObject: true,
      number: true,
    },
    viewAdd: {
      libraryObject: true,
      number: true,
    },
    viewAddBlock: {
      libraryObject: true,
      number: true,
    },
    viewAddWall: {
      libraryObject: true,
      number: true,
    },
    viewAddPlatform: {
      libraryObject: true,
      number: true,
    },
    addOnTop: {
      tag: true,
      number: true,
      libraryObject: true,
      label: 'How many nodes on top'
    },

    startSequence: {
      sequenceId: true,
      effectorObject: true,
    },
    startLocalSequence: {
      smallText: true,
      label: 'Local SequenceName',
      effectorObject: true,
    }

    // 'animation',
    // notification -> chat, private chat, log, toast, modal
    // camera effect

    // move Camera to, cameraAnimateZoomTo, ( lets use the camera delay tool ...)
    // this ^ can also include showing UI popover on game object.. I mean welcome to CLEAR onboarding

    // 'sequenceDisable'
    // 'sequenceEnable'
    // 'stopSequence',
    // 'morph',
    // 'duplicate',
    // 'questStart',
    // 'questComplete',

    // 'mutateOwner'

    // 'increaseInputDirectionVelocity', <<--- better as tags probably
    // 'increaseMovementDirectionVelocity',

    // 'attachToEffectorAsParent'
    // 'attachToEffectorAsRelative'
    // 'emitCustomEvent',

    // setTarget

    // play sound FX
    // stop music
    // start music

    // reset player physics
    //
    // Teleport
    //
    // Deposit object
    //
    // Withdraw object

    // open URL

    // THESE ARE MAYBE JUST MUTATE? EXCEPT FOR TOGGLE, MAYBE ADD THAT TO SPECIAL SYNTAX
    // skipHeroGravity
    // skipHeroPosUpdate
    // 'spawnPoolIncrement',
    // 'spawnTotalIncrement',
    // 'spawnTotalRemove',
    // 'spawnPause',
    // 'spawnResume',
    // 'spawnPauseToggle',
    // 'movementPauseToggle',
    // 'movementResume',
    // 'movementPause',
    // 'timerStart',
    // 'timerPause',
    // 'timerResume',
    // 'timerPauseToggle',
    // 'triggerDisable',
    // 'triggerEnable',
    // 'triggerToggleEnable',
  }

  // apply mod from library
  // add library object to open space

  window.effectNameList = Object.keys(window.triggerEffects)

// owner object is just for sequences
function processEffect(effect, effected, effector, ownerObject) {
  const { effectName, effectValue, effectJSON } = effect
  if(effectName === 'mutate' && effectJSON) {
    OBJECTS.mergeWithJSON(effected, effectJSON)
    if(effectJSON.creator && effected.tags.hero) {
      window.emitGameEvent('onUpdatePlayerUI', effected)
    }
    if(effected.tags.hero) {
      window.emitGameEvent('onHeroMutate', effected)
    }
  }

  //
  // if(effectName === 'heroQuestStart' && hero) {
  //   startQuest(hero, effectValue)
  // }
  //
  // if(effectName === 'heroQuestComplete' && hero) {
  //   completeQuest(hero, effectValue)
  // }

  if(effectName === 'simpleDialogue') {
    if(effected.ownerId) {
      const owner = OBJECTS.getObjectOrHeroById(effected.ownerId)
      effected = owner
    }
    if(effected.tags.hero) {
      let newDialogue = {
        ...window.defaultDialogue,
        text: effect.effectValue
      }
      if(effected.dialogue && effected.dialogue.length) {
        effected.dialogue.push(newDialogue)
      } else {
        effected.dialogue = [newDialogue]
      }
      window.emitGameEvent('onHeroDialogueStart', effected, effector)

      effected.flags.showDialogue = true
      effected.flags.paused = true
      if(effector) {
        effected.dialogueId = effector.id
        // if(effector.tags.loopInteractionOnDialogueComplete) {
        //   effected._loopDialogue = true
        // }
        if(effector.name) {
          effected.dialogueName = effector.mod().name
        } else {
          effected.dialogueName = null
        }
      }

      window.emitGameEvent('onUpdatePlayerUI', effected)
    } else {
      console.log('cannot dialogue effect non hero')
    }
  }

  if(effectName === 'dialogue') {
    if(effected.ownerId) {
      const owner = OBJECTS.getObjectOrHeroById(effected.ownerId)
      effected = owner
    }
    if(effected.tags.hero && typeof effect.effectJSON !== 'string') {
      let newDialogue = _.cloneDeep(effect.effectJSON)
      if(effected.dialogue && effected.dialogue.length) {
        effected.dialogue.push(...newDialogue)
      } else {
        effected.dialogue = newDialogue
      }
      window.emitGameEvent('onHeroDialogueStart', effected, effector)
      effected.flags.showDialogue = true
      effected.flags.paused = true
      if(effector) {
        effected.dialogueId = effector.id
        // if(effector.tags.loopInteractionOnDialogueComplete) {
        //   effected._loopDialogue = true
        // }
        if(effector.name) {
          effected.dialogueName = effector.mod().name
        } else {
          effected.dialogueName = null
        }
      }

      window.emitGameEvent('onUpdatePlayerUI', effected)
    } else {
      console.log('cannot dialogue effect non hero')
    }
  }

  if(effectName === 'dialogueSet') {
    console.log(effected, effector)
    if(effected.ownerId) {
      const owner = OBJECTS.getObjectOrHeroById(effected.ownerId)
      effected = owner
    }
    if(effected.tags.hero && effector.heroDialogueSets) {
      const dialogueSet = effector.heroDialogueSets[effectValue]
      if(!dialogueSet) return
      const newDialogue = dialogueSet.dialogue.slice()
      if(effected.dialogue && effected.dialogue.length) {
        effected.dialogue.push(...newDialogue)
      } else {
        effected.dialogue = newDialogue
      }
      window.emitGameEvent('onHeroDialogueStart', effected, effector)
      effected.flags.showDialogue = true
      effected.flags.paused = true
      if(effector) {
        effected.dialogueId = effector.id
        // if(effector.tags.loopInteractionOnDialogueComplete) {
        //   effected._loopDialogue = true
        // }
        if(effector.name) {
          effected.dialogueName = effector.mod().name
        } else {
          effected.dialogueName = null
        }
      }

      window.emitGameEvent('onUpdatePlayerUI', effected)
    } else {
      console.log('cannot dialogue effect non hero')
    }
  }




  if(effectName === 'destroy') {
    effected._destroyedById = effector.id ? effector.id : effector
    effected._destroy = true
  }

  if(effectName === 'respawn') {
    OBJECTS.respawn(effected)
  }
  if(effectName === 'remove') {
    OBJECTS.removeObject(effected)
  }

  if(effectName === 'addLibrarySubObject') {
    const libraryObject = window.subObjectLibrary.addGameLibrary()[effect.effectLibrarySubObject]
    if(!libraryObject) return console.log('no library sub object', effect.effectLibrarySubObject)
    OBJECTS.addSubObject(effected, libraryObject, effect.effectLibrarySubObject)
  }

  if(effectName === 'equipSubObject') {
    if(!effected.subObjects[effectValue]) return console.log('no sub object, equip')
    equipSubObject(effected, effected.subObjects[effectValue])
  }

  if(effectName === 'unequipSubObject') {
    if(!effected.subObjects[effectValue]) return console.log('no sub object, unequip')
    unequipSubObject(effected, effected.subObjects[effectValue])
  }

  if(effectName === 'dropSubObject') {
    if(!effected.subObjects[effectValue]) return console.log('no sub object, drop')
    dropObject(effected, effected.subObjects[effectValue])
  }

  if(effectName === 'equipLibrarySubObject') {
    const subObject = _.cloneDeep(window.subObjectLibrary.addGameLibrary()[effect.effectLibrarySubObject])
    if(!subObject) return console.log('no sub object, equp library')
    subObject.tags.startsEquipped = true
    OBJECTS.addSubObject(effected, subObject, effect.effectLibrarySubObject)
  }

  if(effectName === 'removeSubObject') {
    if(!effected.subObjects[effectValue]) return
    OBJECTS.removeSubObject(effected.subObjects[effectValue])
  }

  if(effectName === 'pickupObject') {
    pickupObject(effected, effector)
  }

  if(effectName === 'temporaryDialogueChoice') {
    window.emitGameEvent('onStartMod', {ownerId: effected.id, temporaryDialogueChoice: true, ...effect})
  }

  if(effectName === 'addDialogueChoice') {
    window.local.emit('onAddDialogueChoice', effected.id, effectValue, effect.effectJSON)
  }


  // if(effectName === 'spawnTotalIncrement') {
  //   effected.spawnTotal += effectValue || 1
  // }

  //
  // if(effectName === 'spawnTotalRemove') {
  //   effected.spawnTotal = -1
  // }

  // if(effectName === 'spawnPoolIncrement') {
  //   effected.spawnPool += effectValue || 1
  //   // effected.spawnWait=false
  //   // if(effected.spawnWaitTimerId) delete GAME.gameState.timeoutsById[effected.spawnWaitTimerId]
  // }

  if(effectName === 'tagAdd') {
    if(effect.effectTags) {
      effect.effectTags.forEach((tag) => {
        effected.tags[tag] = true
      })
    } else {
      let tag = effectValue
      effected.tags[tag] = true
    }
  }

  if(effectName === 'tagRemove') {
    if(effect.effectTags) {
      effect.effectTags.forEach((tag) => {
        effected.tags[tag] = false
      })
    } else {
      let tag = effectValue
      effected.tags[tag] = false
    }
  }

  if(effectName === 'tagToggle') {
    if(effect.effectTags) {
      effect.effectTags.forEach((tag) => {
        effected.tags[tag] = !effected.tags[tag]
      })
    } else {
      let tag = effectValue
      effected.tags[tag] = !effected.tags[tag]
    }
  }

  if(effectName === 'startSequence') {
    const context = {
      mainObject: effected,
      guestObject: effector,
      ownerObject,
    }
    startSequence(effect.effectSequenceId || effectValue, context)
  }

  if(effectName === 'startLocalSequence') {
    if(!effected.sequences) return
    const sequence = effected.sequences[effectValue]
    if(!sequence) return
    const context = {
      mainObject: effected,
      guestObject: effector,
      ownerObject: effected,
    }
    startSequence(sequence, context)
  }


  if(effectName === 'branchApply') {
    GAME.onBranchApply(effect.effectBranchName || effectValue)
  }

  if(effectName === 'branchModApply') {
    GAME.onBranchModApply(effect.effectBranchName || effectValue)
  }

  if(effectName === 'branchModRevert') {
    GAME.onBranchModRevert(effect.effectBranchName || effectValue)
  }

  if(effectName === 'mod') {
    window.emitGameEvent('onStartMod', {ownerId: effected.id, ...effect})
    // if(effectJSON.creator && effected.tags.hero) {
    //   window.socket.emit('emitGameEvent', 'onUpdatePlayerUI', effected)
    // }
  }

  if(effectName === 'temporaryEquip') {
    window.emitGameEvent('onStartMod', {ownerId: effected.id, temporaryEquip: true, ...effect})
  }

  if(effectName === 'temporaryLibrarySubObject') {
    window.emitGameEvent('onStartMod', {ownerId: effected.id, temporaryLibrarySubObject: true, ...effect})
  }

  if(effectName === 'libraryMod') {
    const libraryMod = window.modLibrary[effect.effectLibraryMod]
    const mod = {
      ownerId: effected.id,
      manualRevertId: effect.effectLibraryMod,
      ...libraryMod
    }
    window.emitGameEvent('onStartMod', mod)
  }

  if(effectName === 'openWorld') {
    EDITOR.transformWorldTo(effectValue)
  }
  if(effectName === 'clearToWorld') {
    EDITOR.shiftPressed = true
    EDITOR.transformWorldTo(effectValue)
    EDITOR.shiftPressed = false
  }
  if(effectName === 'openGameAsLevel') {
    console.log(effect)
    axios.get(window.HAGameServerUrl + '/game', {
      params: {
        gameId: effect.effectValue
      }
    }).then((res) => {
      const game = res.data.game
      GAME.objects.forEach((object) => {
        OBJECTS.unloadObject(object)
      })
      GAME.removeListeners()

      GAME.objectsById = {}
      GAME.objects = game.objects.map((object) => {
        OBJECTS.addObject(object)
        OBJECTS.respawn(object)
        return object
      })

      // grid
      GAME.world = game.world
      GAME.grid.nodes = gridUtil.generateGridNodes(GAME.grid)
      GAME.updateGridObstacles()
      GAME.pfgrid = pathfinding.convertGridToPathfindingGrid(GAME.grid.nodes)
      GAME.handleWorldUpdate(GAME.world)

      GAME.defaultHero = game.defaultHero || window.defaultHero

      GAME.heroList.forEach((hero) => {
        const oldTags = hero.tags
        GAME.heros[hero.id] = HERO.summonFromGameData(hero)
        GAME.heros[hero.id].tags.saveAsDefaultHero = oldTags.saveAsDefaultHero
        GAME.heros[hero.id].id = hero.id
        HERO.spawn(hero)
      })

      GAME.heroList = []
      HERO.forAll((hero) => {
        GAME.heroList.push(hero)
        HERO.addHero(hero)
      })

      GAME.objects.forEach((object) => {
        window.emitGameEvent('onObjectAwake', object)
        if(object.tags.talkOnStart) {
          GAME.heroList.forEach((hero) => {
            onTalk(hero, object, {}, [], [], { fromStart: true })
          })
        }
        if(object.tags.giveQuestOnStart) {
          GAME.heroList.forEach((hero) => {
            startQuest(hero, object.questGivingId)
          })
        }
        if(object.subObjects) {
          Object.keys(object.subObjects).forEach((subObjectName) => {
            window.emitGameEvent('onObjectAwake', object.subObjects[subObjectName])
          })
        }
      })
      window.emitGameEvent('onGameStarted')
    })
  }

  if(effectName === 'anticipatedAdd' && effect.effectLibraryObject) {
    const object = window.objectLibrary.addGameLibrary()[effect.effectLibraryObject]
    window.local.emit('onAnticipateObject', object);
  }
  if(effectName === 'anticipatedAddWall' && effect.effectLibraryObject) {
    const object = window.objectLibrary.addGameLibrary()[effect.effectLibraryObject]
    window.local.emit('onAnticipateObject', { ...object, wall: true, numberToAdd: effectValue  });
  }
  if(effectName === 'anticipatedAddPlatform' && effect.effectLibraryObject) {
    const object = window.objectLibrary.addGameLibrary()[effect.effectLibraryObject]
    window.local.emit('onAnticipateObject', { ...object, platform: true, numberToAdd: effectValue  });
  }
  if(effectName === 'viewAdd' && effect.effectLibraryObject) {
    const object = window.objectLibrary.addGameLibrary()[effect.effectLibraryObject]
    window.local.emit('onAnticipateObject', {...object, random: true, numberToAdd: effectValue });
  }
  if(effectName === 'viewAddWall' && effect.effectLibraryObject) {
    const object = window.objectLibrary.addGameLibrary()[effect.effectLibraryObject]
    window.local.emit('onAnticipateObject', { ...object, wall: true, random: true, numberToAdd: effectValue });
  }
  if(effectName === 'viewAddBlock' && effect.effectLibraryObject) {
    const object = window.objectLibrary.addGameLibrary()[effect.effectLibraryObject]
    window.local.emit('onAnticipateObject', { ...object, block: true, random: true, numberToAdd: effectValue });
  }
  if(effectName === 'viewAddPlatform' && effect.effectLibraryObject) {
    const object = window.objectLibrary.addGameLibrary()[effect.effectLibraryObject]
    window.local.emit('onAnticipateObject', { ...object, platform: true, random: true, numberToAdd: effectValue });
  }
  if(effectName === 'addOnTop' && effect.effectLibraryObject) {
    const object = window.objectLibrary.addGameLibrary()[effect.effectLibraryObject]
    window.local.emit('onAnticipateObject', { ...object, onTop: true, nodesAbove: effectValue, targetTags: effect.effectTags });
  }

  if(effectName === 'starViewGo') {
    const hero = GAME.heros[effected.id]
    window.socket.emit('editHero', { id: effected.id, animationZoomTarget: window.constellationDistance, animationZoomMultiplier: hero.zoomMultiplier, endAnimation: false })
  }

  if(effectName === 'starViewReturn') {
    const hero = GAME.heros[effected.id]
    window.socket.emit('editHero', { id: effected.id, animationZoomTarget: hero.zoomMultiplier, endAnimation: true, })
  }

  if(effectName === 'stopGamePreserve') {
    GAME.gameState.started = false
    GAME.removeListeners()
    GAME.gameState.sequenceQueue = []
    GAME.gameState.activeModList = []
    GAME.gameState.activeMods = {}
  }

  if(effectName === 'stopPrologue') {
    GAME.gameState.started = false
    GAME.removeListeners()
    GAME.gameState.sequenceQueue = []
    GAME.gameState.activeModList = []
    GAME.gameState.activeMods = {}
    GAME.heroList.forEach((hero, i) => {
      if(hero.triggers) hero.triggers = {}
      hero.flags.editAllowedWhenGameStarted = false
    });
    GAME.library.sequences = {}
  }

  if(effectName === 'pathfindTo') {
    setPathTarget(effected, effectValue)
  }

  if(effectName === 'goTo') {
    setTarget(effected, effectValue)
  }

  if(effectName === 'pursue') {
    effected._targetPursueId = effectValue
  }

  if(effectName === 'setPath') {
    effected.pathId = effectValue
  }

  if(effectName === 'startCutscene') {
    if(effected.tags.hero) {
      effected.cutscenes = _.cloneDeep(effectValue)
      effected.flags.showCutscene = true
      effected.flags.paused = true
      window.emitGameEvent('onUpdatePlayerUI', effected)
    } else {
      console.log('cannot start cutscene effect non hero')
    }
  }

  if(effectName === 'startGoal') {
    if(effected.tags.hero) {
      function startTimer() {
        if(effect.goalTimeLimit > 0) {
          GAME.addTimeout(effect.goalId, effect.goalTimeLimit, () => {
            effect.goalChances--
            if(effect.goalChances <= 0) {
              if(effect.failSequenceId) processEffect({ effectName: 'startSequence', effectSequenceId: effect.failSequenceId }, effected, effector, ownerObject)
              GAME.gameState.goals[effect.goalId].failed = true
              return
            }
            startTimer()
          })
        }
      }

      const tracker = TRACKING.startTracking({
        targetCount: effect.goalTargetCount,
        trackingObject: effected,
        targetEvent: effect.goalName,
        targetTags: effect.goalTargetTags,
        showTrackingNavigationTargets: effect.goalShowNavigation,
        onTargetCountReached: () => {
          GAME.gameState.goals[effect.goalId].succeeded = true
          if(GAME.gameState.timeoutsById[effect.goalId]) GAME.gameState.timeoutsById[effect.goalId].paused = true
          if(GAME.gameState.trackersById[effect.trackerId]) GAME.gameState.trackersById[effect.trackerId].stopped = true
          if(effect.successSequenceId) {
            processEffect({ effectName: 'startSequence', effectSequenceId: effect.successSequenceId }, effected, effector, ownerObject)
          }
        },
      })

      effect.goalId = 'goal-'+window.uniqueID()
      if(!GAME.gameState.goals) GAME.gameState.goals = {}
      GAME.gameState.goals[effect.goalId] = effect

      if(effect.goalTimeLimit) startTimer()

      if(!effected.goals) effected.goals = []
      effected.goals.push({
        goalId: effect.goalId,
        trackerId: tracker.trackerId,
        tags: effect.goalTargetTags,
        show: true,
      })

      window.emitGameEvent('onUpdatePlayerUI', effected)
    } else {
      console.log('cannot start goal effect non hero')
    }
  }
}

function getEffectedObjects(effect, mainObject, guestObject, ownerObject) {
  const { effectedMainObject, effectedGuestObject, effectedWorldObject, effectedOwnerObject, effectedIds, effectedTags } = effect

  let effectedObjects = []
  if(effectedMainObject) effectedObjects.push(mainObject)
  if(effectedGuestObject) effectedObjects.push(guestObject)
  if(effectedOwnerObject) effectedObjects.push(ownerObject)
  if(effectedWorldObject) effectedObjects.push(GAME.world)

  if(effectedIds) effectedObjects = effectedObjects.concat(effectedIds.map((id) => {
    if(GAME.objectsById[id]) return GAME.objectsById[id]
    if(GAME.heros[id]) return GAME.heros[id]
  }))

  if(effectedTags) effectedObjects = effectedObjects.concat(effectedTags.reduce((arr, tag) => {
    let newArr = arr
    if(GAME.objectsByTag[tag]) {
      newArr = newArr.concat(GAME.objectsByTag[tag])
    }
    return newArr
  }, []))

  return effectedObjects
}

export default {
  processEffect,
  getEffectedObjects
}
