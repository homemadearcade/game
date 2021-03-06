global.herosockets = {

}

// let initialGameId = 'default'
// setGame(initialGameId, (game) => {
//   console.log('initial game set to ' + initialGameId)
// })
global.currentGame = {
  heros: {},
  hero: {},
  grid: {

  },
  objects: [],
  world: {},
}

global.savedCustomCode = ''

function socketEvents(fs, io, socket, options = { arcadeMode: false }){
  // socket.on('saveSocket', (heroId) => {
  //   herosockets[heroId] = socket
  // })

  function getGame(id, cb) {
    fs.readFile('./data/game/' +id+'.json', 'utf8', function readFileCallback(err, data){
      if (err){
          console.log(err);
      } else {
      let game = JSON.parse(data); //now it an gameect
      delete game.heros
      delete game.gameState
      return cb(game)
    }});
  }

  function getSpriteSheet(id, cb) {
    fs.readFile('./data/sprite/' +id+'.json', 'utf8', function readFileCallback(err, data){
      if (err){
          console.log(err);
      } else {
      let spritesheet = JSON.parse(data); //now it an spritesheetect
      return cb(spritesheet)
    }});
  }

  function saveSpriteSheet(id, json) {
    fs.writeFile('data/sprite/' + id + '.json', JSON.stringify(json), 'utf8', (e) => {
      if(e) return console.log(e)
      else console.log('spritesheet: ' + id + ' saved')
    });
  }

  // socket.on('getSpriteSheetJSON', (id) => {
  //   getSpriteSheet(id, (spriteSheet) => {
  //     socket.emit('onGetSpriteSheetJSON', spriteSheet)
  //   })
  // })

  socket.on('getSpriteSheetsJSON', (ids) => {
    const sss = []

    ids.forEach((id) => {
      getSpriteSheet(id, (spriteSheet) => {
        sss.push(spriteSheet)
        if(sss.length === ids.length) socket.emit('onGetSpriteSheetsJSON', sss)
      })
    })
  })

  socket.on('saveSpriteSheetJSON', (id, json) => {
    saveSpriteSheet(id, json)
  })

  socket.on('saveAudioDataJSON', (id, json) => {
    saveAudioData(id, json)
  })

  function saveAudioData(id, json) {
    fs.writeFile('data/audio/' + id + '.json', JSON.stringify(json), 'utf8', (e) => {
      if(e) return console.log(e)
      else console.log('audio data: ' + id + ' saved')
    });
  }


  ///////////////////////////
  ///////////////////////////
  ///////////////////////////
  ///////////////////////////
  // Game
  ///////////////////////////
  ///////////////////////////
  socket.on('saveGame', (game) => {
    fs.writeFile('data/game/' + game.id + '.json', JSON.stringify(game), 'utf8', (e) => {
      if(e) return console.log(e)
      else console.log('game: ' + game.id + ' saved')
    });
    io.emit('onGameSaved', game.id)
    global.currentGame = JSON.parse(JSON.stringify(game))
  })

  // this is for when one player on a network wants to get a global.currentGame... should all be 1 -hero worlds?
  socket.on('getGame', (id) => {
    fs.readFile('data/game/' +id+'.json', 'utf8', function readFileCallback(err, data){
      if (err){
          console.log(err);
      } else {
      let obj = JSON.parse(data); //now it an object
      socket.emit('onGetGame', obj)
    }});
  })

  // this is for when we are editing and we want to send this world to all people
  socket.on('setGame', (id) => {
    getGame(id, (game) => {
      global.currentGame = JSON.parse(JSON.stringify(game))
      io.emit('onSetGame', game)
      if(global.isServerHost) global.local.emit('onServerSetCurrentGame', game)
    })
  })

  socket.on('setGameJSON', (game) => {
    global.currentGame = JSON.parse(JSON.stringify(game))
    io.emit('onSetGameJSON', game)
    if(global.isServerHost) global.local.emit('onServerSetCurrentGame', game)
  })

  // this is for when we are editing and we want to send this world to all people
  socket.on('copyGame', (id) => {
    getGame(id, (game) => {
      game.id = global.currentGame.id
      global.currentGame = JSON.parse(JSON.stringify(game))
      io.emit('onCopyGame', game)
    })
  })

  // this is when the editor asks to load up a game
  socket.on('setAndLoadCurrentGame', (id) => {
    fs.readFile('./data/game/' +id+'.json', 'utf8', function readFileCallback(err, data){
      if (err){
          console.log(err);
      } else {
      let obj = JSON.parse(data); //now it an object
      global.currentGame = obj
      global.global.currentGame.id = id
      io.emit('onLoadGame', global.currentGame)
      if(global.isServerHost) {
        global.local.emit('onServerSetCurrentGame', global.currentGame)
      }
    }});
  })

  socket.on('askJoinGame', (heroId, role, userId) => {
    io.emit('onAskJoinGame', heroId, role, userId)
  })

  socket.on('heroJoinedGamed', (hero) => {
    io.emit('onHeroJoinedGame', hero)
  })

  socket.on('removeHero', (hero) => {
    io.emit('onRemoveHero', hero)
  })

  // this is really only for the live editing shit when im reloading their page all the time
  socket.on('askRestoreCurrentGame', () => {
    if(global.isServerHost) {
      socket.emit('onAskRestoreCurrentGame', global.GAME)
    } else {
      socket.emit('onAskRestoreCurrentGame', currentGame)
    }
  })

  // great to have a constantly updating object shared on all computers
  socket.on('networkUpdateGameState', (gameState) => {
    // if(!global.currentGame.gameState) global.currentGame.gameState = gameState
    // Object.assign(global.currentGame.gameState, gameState)
    io.emit('onNetworkUpdateGameState', gameState)
  })

  socket.on('resetGameState', (gameState) => {
    io.emit('onResetGameState', gameState)
  })

  socket.on('editGameState', (gameState) => {
    io.emit('onEditGameState', gameState)
  })

  socket.on('addGameTag', (tagName) => {
    if(!global.currentGame.library.tags) {
      global.currentGame.library.tags = {}
    }
    global.currentGame.library.tags[tagName] = false
    io.emit('onAddGameTag', tagName)
  })

  socket.on('updateGameCustomInputBehavior', (customInputBehavior) => {
    if(!global.currentGame.customInputBehavior) {
      global.currentGame.customInputBehavior = {}
    }
    global.currentGame.customInputBehavior = customInputBehavior
    io.emit('onUpdateGameCustomInputBehavior', customInputBehavior)
  })

  socket.on('startGame', (options) => {
    io.emit('onGameStart', options)
  })

  socket.on('startPregame', (options) => {
    io.emit('onStartPregame', options)
  })

  socket.on('stopGame', (options) => {
    io.emit('onStopGame', options)
  })

  ///////////////////////////
  ///////////////////////////
  ///////////////////////////
  ///////////////////////////
  // Objects
  ///////////////////////////
  ///////////////////////////
  socket.on('anticipateObject', (object) => {
    io.emit('onAnticipateObject', object)
  })
  socket.on('networkUpdateObjectsComplete', (updatedObjects) => {
    io.emit('onNetworkUpdateObjectsComplete', updatedObjects)
  })
  socket.on('networkUpdateObjects', (updatedobjects) => {
    io.emit('onNetworkUpdateObjects', updatedobjects)
  })
  socket.on('editObjects', (editedobjects) => {
    io.emit('onEditObjects', editedobjects)
  })
  socket.on('resetObjects', (objects) => {
    io.emit('onResetObjects')
  })
  socket.on('removeObject', (object) => {
    io.emit('onRemoveObject', object)
  })
  socket.on('deleteObject', (object) => {
    // for(let i = 0; i < global.currentGame.objects.length; i++) {
  	// 	if(global.currentGame.objects[i].id === object.id){
  	// 		global.currentGame.objects.splice(i, 1)
  	// 		break;
  	// 	}
  	// }
    io.emit('onDeleteObject', object)
  })
  socket.on('askObjects', () => {
    socket.emit('onNetworkAddObjects', global.currentGame.objects)
  })
  socket.on('addObjects', (addedobjects) => {
    io.emit('onNetworkAddObjects', addedobjects)
  })


  //// TRIGGERS
  socket.on('deleteTrigger', (ownerId, triggerId) => {
    io.emit('onDeleteTrigger', ownerId, triggerId)
  })
  socket.on('addTrigger', (ownerId, trigger) => {
    io.emit('onAddTrigger', ownerId, trigger)
  })
  socket.on('editTrigger', (ownerId, triggerId, trigger) => {
    io.emit('onEditTrigger', ownerId, triggerId, trigger)
  })


  /// SUB OBJECTS
  socket.on('deleteSubObject', (owner, subObjectName) => {
    io.emit('onDeleteSubObject', owner, subObjectName)
  })
  socket.on('addSubObject', (owner, subObject, subObjectName, options) => {
    io.emit('onAddSubObject', owner, subObject, subObjectName, options)
  })
  socket.on('removeSubObject', (ownerId, subObjectName) => {
    io.emit('onRemoveSubObject', ownerId, subObjectName)
  })
  socket.on('editSubObject', (ownerId, subObjectName, update) => {
    io.emit('onEditSubObject', ownerId, subObjectName, update)
  })


  ///////////////////////////
  ///////////////////////////
  ///////////////////////////
  ///////////////////////////
  // World
  ///////////////////////////
  ///////////////////////////
  socket.on('askWorld', () => {
    socket.emit('onUpdateWorld', global.currentGame.world)
  })
  socket.on('updateWorld', (updatedWorld) => {
    io.emit('onUpdateWorld', updatedWorld)
  })
  socket.on('updateLibrary', (updatedLibrary) => {
    io.emit('onUpdateLibrary', updatedLibrary)
  })
  socket.on('resetWorld', () => {
    io.emit('onResetWorld')
  })
  socket.on('updateGameOnServerOnly', (game) => {
    let prevGame = currentGame
    global.currentGame = game
    global.currentGame.grid = prevGame.grid
  })


  ///////////////////////////
  ///////////////////////////
  ///////////////////////////
  ///////////////////////////
  //GAME.heros[HERO.id]
  ///////////////////////////
  socket.on('sendHeroInput', (input, hero) => {
    io.emit('onSendHeroInput', input, hero)
  })
  socket.on('sendHeroKeyDown', (keyCode, hero) => {
    io.emit('onSendHeroKeyDown', keyCode, hero)
  })
  socket.on('sendHeroKeyUp', (keyCode, hero) => {
    io.emit('onSendHeroKeyUp', keyCode, hero)
  })
  socket.on('sendNotification', (data) => {
    data.dateMilliseconds = Date.now()
    io.emit('onSendNotification', data)
  })

  socket.on('networkUpdateHero', (hero) => {
    io.emit('onNetworkUpdateHero', hero)
  })
  socket.on('networkUpdateHeros', (heros) => {
    if(heros) {
      heros.forEach(hero => {
        io.emit('onNetworkUpdateHero', hero)
      })
    }
  })
  socket.on('networkUpdateHerosPos', (heros) => {
    io.emit('onNetworkUpdateHerosPos', heros)
  })
  socket.on('networkUpdateHerosComplete', (heros) => {
    if(heros) {
      heros.forEach(hero => {
        io.emit('onNetworkUpdateHero', hero)
      })
    }
  })
  socket.on('editHero', (hero) => {
    // global.mergeDeep(heros[hero.id], hero)
    io.emit('onEditHero', hero)
  })
  socket.on('resetHeroToDefault', (hero) => {
    io.emit('onResetHeroToDefault', hero)
  })
  socket.on('resetHeroToGameDefault', (hero) => {
    io.emit('onResetHeroToGameDefault', hero)
  })
  socket.on('respawnHero', (hero) => {
    io.emit('onRespawnHero', hero)
  })
  // socket.on('askHeros', () => {
  //   for(let heroId in global.currentGame.heros) {
  //     socket.emit('onUpdateHero', global.currentGame.heros[heroId])
  //   }
  // })
  socket.on('deleteHero', (heroId) => {
    io.emit('onDeleteHero', heroId)
  })

  socket.on('openHeroModal', (hero, modalTitle, modalBody) => {
    io.emit('onOpenHeroModal', hero, modalTitle, modalBody)
  })

  ///////////////////////////
  ///////////////////////////
  ///////////////////////////
  ///////////////////////////
  // GRIDS
  ///////////////////////////
  socket.on('snapAllObjectsToGrid', (hero) => {
    io.emit('onSnapAllObjectsToGrid', hero)
  })

  socket.on('updateGrid', (gridIn) => {
    global.currentGame.grid = gridIn
    io.emit('onUpdateGrid', gridIn)
  })

  socket.on('startDiffFlow', (objectId) => {
    io.emit('onStartDiffFlow', objectId)
  })

  socket.on('endDiffFlow', (objectId) => {
    io.emit('onEndDiffFlow', objectId)
  })

  socket.on('updateGridNode', (x, y, update) => {
    const key = 'x:'+x+'y:'+y
    if(!global.currentGame.grid.nodeData) global.currentGame.grid.nodeData = {}
    if(!global.currentGame.grid.nodeData[key]) global.currentGame.grid.nodeData[key] = {}
    Object.assign(global.currentGame.grid.nodeData[key], update)

    if(global.currentGame.grid && global.currentGame.grid.nodes && global.currentGame.grid.nodes[x] && global.currentGame.grid.nodes[x][y]) {
      Object.assign(global.currentGame.grid.nodes[x][y], update)
    }
    io.emit('onUpdateGridNode', x, y, update)
  })

  socket.on('askGrid', () => {
    io.emit('onUpdateGrid', global.currentGame.grid)
  })

  ///////////////////////////
  ///////////////////////////
  ///////////////////////////
  ///////////////////////////
  // CUSTOM GAME FX
  ///////////////////////////
  socket.on('getCustomGameFx', () => {
    if(savedCustomCode) {
      io.emit('onGetCustomGameFx', savedCustomCode)
    }
  })

  socket.on('updateCustomGameFx', (customGameFx) => {
    savedCustomCode = customGameFx
    io.emit('onUpdateCustomGameFx', customGameFx)
  })

  socket.on('customFxEvent', (eventName) => {
    io.emit('onCustomFxEvent', eventName)
  })

  socket.on('sendHeroMapEditor', (mapEditor, heroId) => {
    io.emit('onSendHeroMapEditor', mapEditor, heroId)
  })

  socket.on('updateCompendium', (compendium) => {
    global.currentGame.compendium = compendium
    io.emit('onUpdateCompendium', compendium)
  })

  socket.on('askHeroToNameObject', (object, heroId) => {
    io.emit('onAskHeroToNameObject', object, heroId)
  })
  socket.on('askHeroToWriteDialogue', (object, heroId) => {
    io.emit('onAskHeroToWriteDialogue', object, heroId)
  })

  socket.on('heroChooseOption', (heroId, optionId) => {
    io.emit('onHeroChooseOption', heroId, optionId)
  })

  socket.on('heroCameraEffect', (type, heroId, options) => {
    io.emit('onHeroCameraEffect', type, heroId, options)
  })

  socket.on('objectAnimation', (type, objectId, options) => {
    io.emit('onObjectAnimation', type, objectId, options)
  })

  socket.on('hostLog', (msg, arg1, arg2, arg3) => {
    let args = [msg, arg1, arg2, arg3].filter(i => !!i)
    io.emit('onHostLog', ...args)
  })

  //// HOOKS
  socket.on('deleteHook', (ownerId, hookId) => {
    io.emit('onDeleteHook', ownerId, hookId)
  })
  socket.on('addHook', (ownerId, hook) => {
    io.emit('onAddHook', ownerId, hook)
  })
  socket.on('editHook', (ownerId, hookId, hook) => {
    io.emit('onEditHook', ownerId, hookId, hook)
  })

  socket.on('spawnAllNow', (objectId) => {
    io.emit('onSpawnAllNow', objectId)
  })
  socket.on('destroySpawnIds', (objectId) => {
    io.emit('onDestroySpawnIds', objectId)
  })

  socket.on('deleteSubObjectChance', (ownerId, subObjectName) => {
    io.emit('onDeleteSubObjectChance', ownerId, subObjectName)
  })

  socket.on('openHeroModal', (heroId, title, body) => {
    io.emit('onOpenHeroModal', heroId, title, body)
  })

  socket.on('showHeroToast', (heroId, body) => {
    io.emit('onShowHeroToast', heroId, body)
  })


  socket.on('dropObject', (objectId, subObjectName, amount) => {
    io.emit('onDropObject', objectId, subObjectName, amount)
  })
  socket.on('unequipObject', (objectId, subObjectName) => {
    io.emit('onUnequipObject', objectId, subObjectName)
  })
  socket.on('equipObject', (objectId, subObjectName, key) => {
    io.emit('onEquipObject', objectId, subObjectName, key)
  })

  socket.on('deleteQuest', (heroId, questId) => {
    io.emit('onDeleteQuest', heroId, questId)
  })
  socket.on('startQuest', (heroId, questId) => {
    io.emit('onHeroStartQuest', heroId, questId)
  })
  socket.on('completeQuest', (heroId, questId) => {
    io.emit('onHeroCompleteQuest', heroId, questId)
  })

  socket.on('emitGameEvent', (eventName, arg1, arg2, arg3, arg4) => {
    io.emit('onEmitGameEvent', eventName, arg1, arg2, arg3, arg4)
  })

  socket.on('emitEvent', (eventName, arg1, arg2, arg3, arg4) => {
    io.emit('onEmitEvent', eventName, arg1, arg2, arg3, arg4)
  })

  socket.on('addLog', (data) => {
    io.emit('onAddLog', data)
  })

  socket.on('addAnimation', (name, animationData) => {
    io.emit('onAddAnimation', name, animationData)
  })

  socket.on('resetLiveParticle', (objectId) => {
    io.emit('onResetLiveParticle', objectId)
  })

  socket.on('startMod', (mod) => {
    io.emit('onStartMod', mod)
  })
  socket.on('endMod', (manualRevertId) => {
    io.emit('onEndMod', manualRevertId)
  })

  socket.on('startSequence', (sequenceId, ownerId) => {
    io.emit('onStartSequence', sequenceId, ownerId)
  })
  socket.on('togglePauseSequence', (sequenceId) => {
    io.emit('onTogglePauseSequence', sequenceId)
  })
  socket.on('stopSequence', (sequenceId) => {
    io.emit('onStopSequence', sequenceId)
  })

  socket.on('resetPhysicsProperties', (objectId) => {
    io.emit('onResetPhysicsProperties', objectId)
  })

  socket.on('editGameHeroJSON', (gameHeroName, json) => {
    io.emit('onEditGameHeroJSON', gameHeroName, json)
  })

  socket.on('requestAdminApproval', (action, data) => {
    io.emit('onRequestAdminApproval', action, data)
  })
  socket.on('resolveAdminApproval', (action, data) => {
    io.emit('onResolveAdminApproval', action, data)
  })

  socket.on('resolveSequenceItem', (id) => {
    io.emit('onResolveSequenceItem', id)
  })

  socket.on('branchGame', (id) => {
    io.emit('onBranchGame', id)
  })
  socket.on('branchGameSave', () => {
    io.emit('onBranchGameSave')
  })
  socket.on('branchApply', (id, mod) => {
    io.emit('onBranchApply', id, mod)
  })
  socket.on('branchGameCancel', () => {
    io.emit('onBranchGameCancel')
  })


  socket.on('editMetadata', (update) => {
    io.emit('onEditMetadata', update)
  })

  socket.on('processEffect', (effectName, effectedIds, effectorId) => {
    io.emit('onProcessEffect', effectName, effectedIds, effectorId)
  })

  socket.on('updateGameSession', data => {
    io.emit('onUpdateGameSession', data)
  })

  socket.on('hostJoined', () => {
    io.emit('onHostJoined')
  })


  socket.on('deleteDialogueChoice', (ownerId, choiceId) => {
    io.emit('onDeleteDialogueChoice', ownerId, choiceId)
  })
  socket.on('addDialogueChoice', (ownerId, choiceId, choice) => {
    io.emit('onAddDialogueChoice', ownerId, choiceId, choice)
  })


  ///AUDIO, ASSETS, THEME
  socket.on('playSoundAsType', (id, type) => {
    io.emit('onPlaySoundAsType', id, type)
  })

  socket.on('updateTheme', (updatedTheme) => {
    io.emit('onUpdateTheme', updatedTheme)
  })

  socket.on('spriteAnimation', (object, animationName, options) => {
    io.emit('onSpriteAnimation', object, animationName, options)
  })
}
/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
function mergeDeep(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
}

export default socketEvents
