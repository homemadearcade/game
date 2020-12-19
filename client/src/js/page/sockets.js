import gridUtil from '../utils/grid.js'
import pathfinding from '../utils/pathfinding.js'
import collisions from '../utils/collisions.js'
import input from '../game/input.js'
import modals from '../mapeditor/modals.js'
import io from 'socket.io-client'

function init() {
  // EVENT SETUP
  if(PAGE.role.isArcadeMode || PAGE.role.isHomeEditor) {
    global.networkSocket = global.socket
    global.socket = global.mockSocket
  }

  ///////////////////////////////
  ///////////////////////////////
  // just for host
  ///////////////////////////////

  if(PAGE.role.isHost) {
    global.socket.on('onBranchGame', (id) => {
      global.local.emit('onBranchGame', id)
    })
    global.socket.on('onBranchGameCancel', () => {
      global.local.emit('onBranchGameCancel')
    })
    global.socket.on('onBranchGameSave', (id) => {
      global.local.emit('onBranchGameSave', id)
    })
    // should be editor event
    global.socket.on('onStartSequence', (sequenceId, ownerId) => {
      global.local.emit('onStartSequence', sequenceId, ownerId)
    })
    global.socket.on('onTogglePauseSequence', (sequenceId) => {
      global.local.emit('onTogglePauseSequence', sequenceId)
    })
    global.socket.on('onStopSequence', (sequenceId) => {
      global.local.emit('onStopSequence', sequenceId)
    })

    // these are editor events
    global.socket.on('onSpawnAllNow', (objectId) => {
      global.local.emit('onSpawnAllNow', objectId)
    })
    global.socket.on('onDestroySpawnIds', (objectId) => {
      global.local.emit('onDestroySpawnIds', objectId)
    })

    global.socket.on('onEditSubObject', (ownerId, subObjectName, update) => {
      global.local.emit('onEditSubObject', ownerId, subObjectName, update)
    })

    // PLAYERS CALL THIS
    global.socket.on('onSendHeroInput', (heroInput, heroId) => {
      global.local.emit('onSendHeroInput', heroInput, heroId)
    })

    // PLAYERS CALL THIS
    global.socket.on('onSendHeroKeyDown', (keyCode, heroId) => {
      global.local.emit('onSendHeroKeyDown', keyCode, heroId)
    })
    global.socket.on('onSendHeroKeyUp', (keyCode, heroId) => {
      global.local.emit('onSendHeroKeyUp', keyCode, heroId)
    })

    // EDITOR CALLS THIS
    // OBJECT -> ID
    global.socket.on('onResetHeroToDefault', (hero) => {
      global.local.emit('onResetHeroToDefault', hero)
    })
    // EDITOR CALLS THIS
    global.socket.on('onResetHeroToGameDefault', (hero) => {
      global.local.emit('onResetHeroToGameDefault', hero)
    })
    // EDITOR CALLS THIS
    global.socket.on('onRespawnHero', (hero) => {
      global.local.emit('onRespawnHero', hero)
    })

    // EDITOR CALLS THIS
    global.socket.on('onEditGameState', (gameState) => {
      global.local.emit('onEditGameState', gameState)
    })

    // EDITOR CALLS THIS
  	global.socket.on('onSnapAllObjectsToGrid', () => {
  	   GAME.snapToGrid()
  	})

    // EDITOR CALLS THIS
    global.socket.on('onAnticipateObject', (object) => {
      global.local.emit('onAnticipateObject', object)
  	})

    global.socket.on('onAddSubObject', (ownerId, subObject, subObjectName, options) => {
      global.local.emit('onAddSubObject', ownerId, subObject, subObjectName, options)
    })
  }

  global.socket.on('onAddTrigger', (ownerId, trigger) => {
    global.local.emit('onAddTrigger', ownerId, trigger)
  })
  global.socket.on('onEditTrigger', (ownerId, triggerId, trigger) => {
    global.local.emit('onEditTrigger', ownerId, triggerId, trigger)
  })
  global.socket.on('onDeleteTrigger', (ownerId, triggerId) => {
    global.local.emit('onDeleteTrigger', ownerId, triggerId)
  })

  global.socket.on('onAddHook', (ownerId, hook) => {
    global.local.emit('onAddHook', ownerId, hook)
  })
  global.socket.on('onEditHook', (ownerId, hookId, hook) => {
    global.local.emit('onEditHook', ownerId, hookId, hook)
  })
  global.socket.on('onDeleteHook', (ownerId, hookId) => {
    global.local.emit('onDeleteHook', ownerId, hookId)
  })

  global.socket.on('onAddDialogueChoice', (ownerId, choiceId, choice) => {
    global.local.emit('onAddDialogueChoice', ownerId, choiceId, choice)
  })
  global.socket.on('onDeleteDialogueChoice', (ownerId, choiceId) => {
    global.local.emit('onDeleteDialogueChoice', ownerId, choiceId)
  })

  global.socket.on('onEditGameHeroJSON', (gameHeroName, JSON) => {
    global.local.emit('onEditGameHeroJSON', gameHeroName, JSON)
  })

  // CLIENT HOST OR EDITOR CALL THIS
  global.socket.on('onRemoveObject', (object) => {
    OBJECTS.removeObject(object)
  })

  // CLIENT HOST OR EDITOR CALL THIS
  global.socket.on('onRemoveHero', (hero) => {
    HERO.removeHero(hero)
  })

  // EDITORS and PLAYERS call this
  global.socket.on('onEditHero', (updatedHero) => {
    global.local.emit('onEditHero', updatedHero)
  })

  global.socket.on('onDeleteHero', (heroId) => {
    global.local.emit('onDeleteHero', heroId)
  })
  global.socket.on('onDeleteQuest', (heroId, questId) => {
    global.local.emit('onDeleteQuest', heroId, questId)
  })
  global.socket.on('onDeleteObject', (object) => {
    global.local.emit('onDeleteObject', object)
  })
  global.socket.on('onDeleteSubObject', (owner, subObjectName) => {
    global.local.emit('onDeleteSubObject', owner, subObjectName)
  })
  global.socket.on('onDeleteSubObjectChance', (ownerId, subObjectName) => {
    global.local.emit('onDeleteSubObjectChance', ownerId, subObjectName)
  })


  // EDITOR CALLS THIS
  global.socket.on('onEditObjects', (editedObjects) => {
    global.local.emit('onEditObjects', editedObjects)
  })

  ///////////////////////////////
  ///////////////////////////////
  // UPDATING GAME STATE EVENTS, EDITOR UPDATES ITS OWN STATE IF SYNCED
  ///////////////////////////////

  if(!PAGE.role.isHost) {
    // HOST CALLS THIS
    global.socket.on('onNetworkUpdateGameState', (gameState) => {
      global.local.emit('onNetworkUpdateGameState', gameState)
    })

    // host CALLS THIS
    global.socket.on('onNetworkUpdateObjectsComplete', (objectsUpdated) => {
      global.local.emit('onNetworkUpdateObjectsComplete', objectsUpdated)
    })

    // host CALLS THIS
    global.socket.on('onNetworkUpdateObjects', (objectsUpdated) => {
      global.local.emit('onNetworkUpdateObjects', objectsUpdated)
        // old interpolation code
        // if(PAGE.role.isPlayer) {
        //   objectsUpdated.forEach((obj) => {
        //     let go = GAME.objectsById[obj.id]
        //     if(!go) {
        //       GAME.objectsById[obj.id] = obj
        //       go = obj
        //     }
        //     go._lerpX = obj.x
        //     go._lerpY = obj.y
        //     delete obj.x
        //     delete obj.y
        //     global.mergeDeep(go, obj)
        //   })
        // } else if(PAGE.role.isPlayEditor) {
        //   GAME.objects = objectsUpdated
        //   GAME.objectsById = GAME.objects.reduce((prev, next) => {
        //     prev[next.id] = next
        //     return prev
        //   }, {})
        // }
    })

    // HOST CALLS THIS
    global.socket.on('onNetworkUpdateHero', (updatedHero) => {
      global.local.emit('onNetworkUpdateHero', updatedHero)
      // old interpolation code
      // } else if(PAGE.role.isPlayEditor) {
      //   global.mergeDeep(GAME.heros[updatedHero.id], updatedHero)
      // } else if(PAGE.role.isPlayer) {
      //   let hero = GAME.heros[updatedHero.id]
      //   if(!hero) GAME.heros[updatedHero.id] = updatedHero
      //   hero._lerpX = updatedHero.x
      //   hero._lerpY = updatedHero.y
      //   delete updatedHero.x
      //   delete updatedHero.y
      //   global.mergeDeep(hero, updatedHero)
    })

    global.socket.on('onNetworkUpdateHerosPos', (updatedHerosPos) => {
      global.local.emit('onNetworkUpdateHerosPos', updatedHerosPos)
    })
  }

  // EDITOR CALLS THIS
  global.socket.on('onUpdateWorld', (updatedWorld) => {
    global.local.emit('onUpdateWorld', updatedWorld)
  })

  global.socket.on('onUpdateLibrary', (updatedLibrary) => {
    global.local.emit('onUpdateLibrary', updatedLibrary)
  })

  ///////////////////////////////
  ///////////////////////////////
  //shared events
  ///////////////////////////////

  // EDITOR CALLS THIS
  global.socket.on('onStopGame', (options) => {
    global.local.emit('onStopGame', options)
  })

  // EDITOR CALLS THIS
  global.socket.on('onGameStart', (options) => {
    global.local.emit('onGameStart', options)
  })

  // EDITOR CALLS THIS
  global.socket.on('onStartPregame', (options) => {
    global.local.emit('onStartPregame', options)
  })

  // EVERYONE CALLS THIS
  global.socket.on('onNetworkAddObjects', (objectsAdded) => {
    global.local.emit('onNetworkAddObjects', objectsAdded)
  })

  // EDITOR CALLS THIS
  global.socket.on('onResetObjects', () => {
    global.local.emit('onResetObjects')
  })

  // EDITOR CALLS THIS
  global.socket.on('onResetWorld', () => {
    global.local.emit('onResetWorld')
  })

  global.socket.on('onSendHeroMapEditor', (remoteState, heroId) => {
    global.local.emit('onSendHeroMapEditor', remoteState, heroId)
  })

  // CLIENT HOST OR EDITOR CALL THIS
  // OBJECT -> ID

  // EDITOR CALLS THIS
  global.socket.on('onUpdateGrid', (grid) => {
    global.local.emit('onLoadingScreenStart')
    setTimeout(() => {
      global.local.emit('onUpdateGrid', grid)
      global.local.emit('onLoadingScreenEnd')
    }, 100)
  })

  global.socket.on('onUpdateGridNode', (x, y, update) => {
    global.local.emit('onUpdateGridNode', x, y, update)
  })


  global.socket.on('onCopyGame', (game) => {
    global.local.emit('onReloadGame', game)
  })


  // this is switching between games
  global.socket.on('onSetGame', (game) => {
    console.log('changing', game.id)
    global.local.emit('onChangeGame', game)
  })

  // this is from branch merge
  global.socket.on('onSetGameJSON', (game) => {
    global.local.emit('onChangeGame', game)
  })

  // global.socket.on('onAskHeroToNameObject', (object, heroId) => {
  //   global.local.emit('onAskHeroToNameObject', object, heroId)
  //   // let ctx = document.getElementById('swal-canvas').getContext('2d')
  //   // ctx.fillStyle = object.color
  //   // ctx.fillRect(10, 10, object.mod().width, object.mod().height);
  // })
  //
  // global.socket.on('onAskHeroToWriteDialogue', (object, heroId) => {
  //   global.local.emit('onAskHeroToWriteDialogue', object, heroId)
  // })

  global.socket.on('onHeroChooseOption', (heroId, optionId) => {
    global.local.emit('onHeroChooseOption', heroId, optionId)
  })

  global.socket.on('onAddGameTag', (tagName) => {
    global.local.emit('onAddGameTag', tagName)
  })

  global.socket.on('onUpdateGameCustomInputBehavior', (tagName) => {
    global.local.emit('onUpdateGameCustomInputBehavior', tagName)
  })

  global.socket.on('onGameSaved', (id) => {
    global.local.emit('onGameSaved', id)
  })

  global.socket.on('onUpdateCustomGameFx', (customFx) => {
    global.local.emit('onUpdateCustomGameFx', customFx)
  })

  global.socket.on('onCustomFxEvent', (eventName) => {
    global.local.emit('onCustomFxEvent', eventName)
  })

  global.socket.on('onGetCustomGameFx', (eventName) => {
    global.local.emit('onGetCustomGameFx', eventName)
  })

  global.socket.on('openHeroModal', (heroId, title, body) => {
    global.local.emit('onOpenHeroModal', heroId, title, body)
  })

  global.socket.on('showHeroToast', (heroId, body) => {
    global.local.emit('onShowHeroToast', heroId, body)
  })

  global.socket.on('onHeroCameraEffect', (type, heroId, options) => {
    global.local.emit('onHeroCameraEffect', type, heroId, options)
  })

  global.socket.on('onObjectAnimation', (type, objectId, options) => {
    global.local.emit('onObjectAnimation', type, objectId, options)
  })

  global.socket.on('onEmitGameEvent', (eventName, arg1, arg2, arg3, arg4) => {
    if(!PAGE.role.isHost) global.local.emit(eventName, arg1, arg2, arg3, arg4)
  })

  global.socket.on('onAddLog', (data) => {
    global.local.emit('onAddLog', data)
  })

  global.socket.on('onSendNotification', (data) => {
    global.local.emit('onSendNotification', data)
  })

  if(!PAGE.role.isHost && PAGE.role.isAdmin) {
    global.socket.on('onHostLog', (msg, arg1, arg2, arg3) => {
      let args = [msg, arg1, arg2, arg3].filter(i => !!i)
      console.log('host -> ', ...args)
    })
  }


  // these are game events
  global.socket.on('onHeroStartQuest', (heroId, questId) => {
    global.local.emit('onHeroStartQuest', heroId, questId)
  })

  global.socket.on('onHeroCompleteQuest', (heroId, questId) => {
    global.local.emit('onHeroCompleteQuest', heroId, questId)
  })

  global.socket.on('onDropObject', (objectId, subObjectName, amount) => {
    global.local.emit('onDropObject', objectId, subObjectName, amount)
  })
  global.socket.on('onUnequipObject', (objectId, subObjectName) => {
    global.local.emit('onUnequipObject', objectId, subObjectName)
  })
  global.socket.on('onEquipObject', (objectId, subObjectName, key) => {
    global.local.emit('onEquipObject', objectId, subObjectName, key)
  })


  global.socket.on('onAddAnimation', (name, animationData) => {
    global.local.emit('onAddAnimation', name, animationData)
  })

  global.socket.on('onResetLiveParticle', (objectId) => {
    global.local.emit('onResetLiveParticle', objectId)
  })

  global.socket.on('onStartMod', (mod) => {
    global.local.emit('onStartMod', mod)
  })
  global.socket.on('onEndMod', (manualRevertId) => {
    global.local.emit('onEndMod', manualRevertId)
  })

  global.socket.on('onResetPhysicsProperties', (objectId) => {
    global.local.emit('onResetPhysicsProperties', objectId)
  })

  global.socket.on('onRequestAdminApproval', (action, data) => {
    global.local.emit('onRequestAdminApproval', action, data)
  })

  global.socket.on('onResolveAdminApproval', (action, data) => {
    global.local.emit('onResolveAdminApproval', action, data)
  })


  global.socket.on('onEditMetadata', (update) => {
    global.local.emit('onEditMetadata', update)
  })

  global.socket.on('onProcessEffect', (effectName, effectedIds, effectorId) => {
    global.local.emit('onProcessEffect', effectName, effectedIds, effectorId)
  })

  global.socket.on('onHostJoined', () => {
    global.local.emit('onHostJoined')
  })

  global.socket.on('onUpdateGameSession', (data) => {
    global.HAGameSession = data
    global.local.emit('onUpdateGameSession')
  })

  global.socket.on('onUpdateTheme', (data) => {
    global.local.emit('onUpdateTheme', data)
  })
  global.socket.on('onPlaySoundAsType', (id, type) => {
    global.local.emit('onPlaySoundAsType', id, type)
  })

  global.socket.on('onSpriteAnimation', (object, animationName, options) => {
    global.local.emit('onSpriteAnimation', object, animationName, options)
  })

  global.socket.on('onStartDiffFlow', (id) => {
    global.local.emit('onStartDiffFlow', id)
  })
  global.socket.on('onEndDiffFlow', (id) => {
    global.local.emit('onEndDiffFlow', id)
  })
}

export default {
  init
}
