import gridUtil from '../utils/grid.js'
import pathfinding from '../utils/pathfinding.js'

import ai from './ai/index.js'
import input from './input.js'
import triggers from './triggers.js'
import gameState from './gameState.js'
import tags from './tags.js'
import descriptors from './descriptors.js'
import timeouts from './timeouts.js'
import theme from './theme.js'
import world from './world.js'
import grid from './grid.js'
import './tracking.js'
import dayNightCycle from './daynightcycle.js'
import metadata from './metadata.js'
import effects from './effects.js'

import '../libraries/modLibrary.js'
import '../libraries/subObjectLibrary.js'
import '../libraries/objectLibrary.js'
import '../libraries/heroLibrary.js'
import '../libraries/spriteSheetLibrary.js'
import '../libraries/dialogueChoiceLibrary.js'
import '../libraries/spriteAnimationLibrary.js'

import { dropObject, equipSubObject, unequipSubObject } from './heros/inventory.js'

import onTalk from './heros/onTalk.js'
import { startQuest } from './heros/quests.js'
import { startSequence, processSequence, togglePauseSequence, endSequence } from './sequence.js'
import { testCondition, testEventMatch } from './conditions.js'

import './objects/index.js'
import './heros/index.js'

class Game{
  constructor() {
    this.pfgrid = null
    this.heros = {}
    this.heroList = []
    this.objects = []
    this.objectsById = {}
    this.world = {}
    this.grid = {}
    this.state = {}
    this.metadata = {}
    this.library = {
      branches: {},
      animations: {},
      spriteAnimations: {},
      tags: {},
      images: {},
      tags: {},
      creator: {}
    }
  }

  onPlayerIdentified = () => {
    world.setDefault()
    metadata.setDefault()
    gameState.setDefault()
    grid.setDefault()
    tags.setDefault()
    descriptors.setDefault()
    input.setDefault()
    timeouts.setDefault()
    dayNightCycle.setDefault()
    theme.setDefault()

    this.theme = _.clone(global.defaultTheme)

    triggers.onPlayerIdentified()
    input.onPlayerIdentified()
  }

  onGameOver(reason, customText) {

    GAME.onStopGame()
    setTimeout(() => {
      GAME.gameState.cutscene = true
      GAME.gameState.gameOver = true
      GAME.gameState.gameOverReason = reason
      if(customText) GAME.gameState.customGameOverHeader = customText

      if(customText && GAME.library.sequences.youWin) {
        if(GAME.library.sequences.youWin) {
          startSequence('youWin', {})
          const removeEventListener = global.local.on('onSequenceComplete', (id) => {
            if(id === 'youWin') {
              removeEventListener()
              GAME.gameState.cutscene = false
            }
          })
        }
      } else {
        if(GAME.library.sequences.gameOver) {
          startSequence('gameOver', {})
          const removeEventListener = global.local.on('onSequenceComplete', (id) => {
            if(id === 'gameOver') {
              removeEventListener()
              GAME.gameState.cutscene = false
            }
          })
        }
      }
    }, 101)
  }

  onUpdate(delta) {
    GAME.heroList = []
    HERO.forAll((hero) => {
      GAME.heroList.push(hero)
    })
    GAME.getObjectsByTag()

    if(PAGE.role.isHost) {
      if(GAME.gameState.cutscene) {
        GAME.gameState.sequenceQueue.forEach((sequence) => {
          if(sequence.id == 'pregame' || sequence.id == 'gameOver' || sequence.id == 'youWin') {
            processSequence(sequence)
          }
        })
      }

      GAME.gameState._pausedByHost = false
      if(GAME.heros[HERO.id] && GAME.heros[HERO.id].flags.paused) GAME.gameState._pausedByHost = true
      // remove second part when a player can host a multiplayer game
      if(!GAME.gameState.paused && !GAME.gameState._pausedByHost) {
        //// PREPARE ALL
        GAME.updateActiveMods()

        PHYSICS.prepareObjectsAndHerosForMovementPhase()

        if(!GAME.gameState.started) {
          GAME.heroList.forEach(hero => {
            if(hero.flags.paused) return
            if(GAME.heroInputs[hero.id]) input.onUpdate(hero, GAME.heroInputs[hero.id], delta)
            global.local.emit('onUpdateHero', hero, GAME.heroInputs[hero.id], delta)
            PHYSICS.updatePosition(hero, delta)
          })

          PHYSICS.prepareObjectsAndHerosForCollisionsPhase()

          GAME.heroList.forEach(hero => {
            if(hero.flags.paused) return
            if(hero.mod().flags.isAdmin) return
            PHYSICS.heroCorrection(hero, [], [])
          })

          PHYSICS.postPhysics([], [])

          GAME.objects.forEach((object) => {
            global.local.emit('onUpdateObject', object, delta)
            if(object._destroy) global.socket.emit('deleteObject', object)
          })
          timeouts.onUpdate(delta)
          GAME.loadActiveMods()

          MAP._isOutOfDate = true
        }

        dayNightCycle.update(delta)

        if(GAME.gameState.started) {

        //////////////////////////////
        //////////////////////////////
        //////////////////////////////
        //// 1. UPDATE GAME STATE PHASE -- START
        //////////////////////////////
        //////////////////////////////
        //// UPDATE SERVICES
        GAME.gameState.sequenceQueue.forEach((sequence) => {
          processSequence(sequence)
        })
        GAME.updateActiveMods()

        timeouts.onUpdate(delta)

        //////////////////////////////
        //// HEROS
        GAME.heroList.forEach(hero => {
          if(hero.flags.paused) return
          if(GAME.heroInputs[hero.id]) input.onUpdate(hero, GAME.heroInputs[hero.id], delta)
          global.local.emit('onUpdateHero', hero, GAME.heroInputs[hero.id], delta)
        })
        //////////////////////////////
        //// OBJECTS
        ai.onUpdate(GAME.objects, delta)
        GAME.resetPaths = false
        GAME.objects.forEach((object) => {
          global.local.emit('onUpdateObject', object, delta)
        })

        //// UPDATE GAME STATE PHASE -- END
        //////////////////////////////
        //////////////////////////////

        // XXXXXX

        //////////////////////////////
        //////////////////////////////
        //////////////////////////////
        //// 2. PHYSICS MOVEMENT PHASE -- START
        //////////////////////////////
        //////////////////////////////
        //////////////////////////////
        //// HEROS
        GAME.heroList.forEach(hero => {
          if(hero.flags.paused) return
          PHYSICS.updatePosition(hero, delta)
          // GAME.heroInputs[id] = {}
        })
        //// OBJECTS
        if(GAME.gameState.started) {
          GAME.objects.forEach((object) => {
            if(object.mod().removed) return
            PHYSICS.updatePosition(object, delta)
          })
        }
        //////////////////////////////
        // PHYSICS MOVEMENT PHASE -- END
        //////////////////////////////
        //////////////////////////////

        // XXXXXX

        //////////////////////////////
        //////////////////////////////
        //////////////////////////////
        // 3. PHYSICS EVENTS AND CORRECTIONS PHASES - START
        //////////////////////////////
        //////////////////////////////
        PHYSICS.correctAndEffectAllObjectAndHeros(delta)
        //////////////////////////////
        // PHYSICS EVENTS AND CORRECTIONS PHASES - END
        //////////////////////////////
        //////////////////////////////
        }
        // XXXXXX

        //////////////////////////////
        //////////////////////////////
        //////////////////////////////
        //// 4. SPECIAL EVENT PHASE - START
        //////////////////////////////
        //// ANIMATION
        GAME.heroList.forEach((hero) => {
          if(hero.animationZoomTarget) {
            HERO.zoomAnimation(hero)
          }
        })
        //////////////////////////////
        //// ANTICIPATE OBJECT
        if(PAGE.role.isHost && GAME.gameState.anticipatedForAdd && GAME.gameState.anticipatedForAdd.length) {
          let hero = GAME.heroList.filter((hero) => {
            return hero.tags.centerOfAttention
          })[0]
          OBJECTS.anticipatedAdd(hero, GAME.gameState.anticipatedForAdd[0])
        }

        MAP._isOutOfDate = true
        //////////////////////////////
        //// SPECIAL EVENT PHASE - END
        //////////////////////////////
        //////////////////////////////
      }
    } else {
      MAP._isOutOfDate = true
    }

    if((PAGE.role.isHost || PAGE.role.isPlayEditor) && GAME.world.tags.calculateMovingObstaclePaths) {
      GAME.updateGridObstacles()
      GAME.pfgrid = pathfinding.convertGridToPathfindingGrid(GAME.grid.nodes)
    }
  }

  onAskJoinGame(heroId, role, user) {
    let hero = GAME.heros[heroId]
    if(!hero) {
      let blockJoin = false
      if(role === 'homemadeArcade') {
        Object.keys(GAME.heros).forEach((heroId) => {
          let hero = GAME.heros[heroId]
          if(hero.heroSummonType === 'homemadeArcade') blockJoin = true
        })
      }
      if(blockJoin) {
        alert ('There is already a homemadeArcade player')
        return false
      }

      hero = HERO.summonFromGameData({id: heroId, heroSummonType: role })
      hero.id = heroId
      hero.user = user
      global.socket.emit('heroJoinedGamed', hero)
    }
  }

  onHeroJoinedGame(hero) {
    HERO.addHero(hero, { skipEventListeners: true })
    if(hero.id == HERO.id) {
      global.local.emit('onHeroFound', hero)
    }
  }

  onHeroFound(hero) {
    PAGE.establishRoleFromQueryAndHero(hero)
    PAGE.logRole()
    GAME.loadHeros(GAME)
    global.local.emit('onGameLoaded')
  }

  onGameLoaded() {
    PAGE.gameLoaded = true
    GAME.gameState.loaded = true
    GAME.gameState.paused = false
    dayNightCycle.onGameLoaded()
  }

  loadAndJoin(game, heroName) {
    // global.local.emit('onLoadingScreenStart')

    GAME.loadGridWorldObjectsCompendiumState(game)

    // if you are a player and you dont already have a hero from the server ask for one
    if(GAME.heros[HERO.id]) {
      global.local.emit('onHeroFound', GAME.heros[HERO.id])
      global.socket.emit('editHero', {id: HERO.id, user: global.user})
    } else {
      if(PAGE.role.isHost) global.user.isHost = true
      global.socket.emit('askJoinGame', HERO.id, heroName, global.user)
    }
  }

  loadGridWorldObjectsCompendiumState(game){
    GAME.id = game.id
    GAME.grid = game.grid

    if(game.theme) GAME.theme = game.theme
    if(!GAME.theme) {
      GAME.theme = {
        audio: {},
        ss: {},
        particles: {},
      }
    }
    if(!GAME.theme.audio) GAME.theme.audio = {}
    if(!GAME.theme.ss) GAME.theme.ss = {}
    if(!GAME.theme.particles) GAME.theme.particles = {}
    if(!GAME.theme.title) GAME.theme.title = {}
    if(!GAME.theme.title.font) GAME.theme.title.font = {}

    tags.setDefault()
    if(game.library) GAME.library = game.library
    else GAME.library = {}
    if(!GAME.library.branches) GAME.library.branches = {}
    if(!GAME.library.creator) GAME.library.creator = {}
    if(!GAME.library.object) GAME.library.object = {}
    if(!GAME.library.subObject) GAME.library.subObject = {}
    if(!GAME.library.images) GAME.library.images = {}

    if(GAME.library.tags) {
      tags.addGameTags(GAME.library.tags)
      GAME.library.tags = GAME.library.tags
    } else GAME.library.tags = {}

    input.setDefault()
    if(game.customInputBehavior) {
      input.addCustomInputBehavior(game.customInputBehavior)
      GAME.customInputBehavior = game.customInputBehavior
    } else GAME.customInputBehavior = []

    if(game.compendium) global.compendium = game.compendium

    GAME.defaultHero = game.defaultHero || global.defaultHero
    GAME.defaultHero.id = 'default hero'

    if(game.metadata) GAME.metadata = game.metadata
    else GAME.metadata = _.cloneDeep(global.defaultMetadata)

    // let storedGameState = localStorage.getItem('gameStates')
    // if(storedGameState) storedGameState = storedGameState[game.id]
    // if(game.world.storeGameState && storedGameState) {
    //   GAME.objects = storedGameState.objects
    //   GAME.world = storedGameState.world
    //   GAME.gameState = storedGameState.gameState
    // } else {

    if(game.customFx) GAME.customFx = game.customFx
    else GAME.customFx = null

    // game state
    if(game.gameState && game.gameState.loaded) {
      GAME.gameState = game.gameState
      if(!GAME.gameState) GAME.gameState = JSON.parse(JSON.stringify(global.defaultGameState))
      // GAME.gameState.sequenceQueue = []
      // GAME.gameState.activeModList = []
      //( remove timouts from this list when you can convert this functions to strings and use eval..)
      GAME.gameState.timeouts = []
      GAME.gameState.timeoutsById = {}
      // GAME.gameState.logs = []
    } else {
      GAME.gameState = JSON.parse(JSON.stringify(global.defaultGameState))
    }

    GAME.objectsById = {}
    GAME.objects = game.objects.map((object) => {
      OBJECTS.addObject(object)
      if(!GAME.gameState.loaded) {
        OBJECTS.respawn(object)
      }
      return object
    })

    // if(!GAME.gameState.loaded) {
    //   GAME.objects.filter((object) => !object.spawned)
    // }

    // for host to find themselves ONRELOAD really is all...
    // also useed when starting stopping a game
    if(game.heros) {
      GAME.heros = game.heros
    }

    // grid
    GAME.world = game.world
    if(!GAME.library.sequences) GAME.library.sequences = {}
    if(!GAME.library.animations) GAME.library.animations = {}



    //GRID DATA STUFF
    if(!GAME.grid.nodeData) GAME.grid.nodeData = {}
    GAME.grid.nodes = gridUtil.generateGridNodes(GAME.grid)
    const terrainData = PROCEDURAL.getGameObjectDataFromNodes(GAME.grid.nodes)
    global.addTerrainDataToPhysics(terrainData)
    GAME.grid.terrainData = terrainData
    GAME.updateGridObstacles()
    GAME.pfgrid = pathfinding.convertGridToPathfindingGrid(GAME.grid.nodes)

    global.local.emit('onGridLoaded')

    GAME.handleWorldUpdate(GAME.world)

    if(PAGE.role.isPlayEditor) {
      global.gamestateeditor.update(GAME.gameState)
    }

    // global.local.emit('onWorldLoaded')
    // global.local.emit('onGameStateLoaded')
    // // global.local.emit('onCompendiumLoaded')
    // global.local.emit('onObjectsLoaded')
    // global.local.emit('onGameHeroLoaded')
  }

  loadHeros(heros) {
    if(!GAME.gameState.loaded) {
      GAME.heroList.forEach((hero) => {
        const oldTags = hero.tags
        GAME.heros[hero.id] = HERO.summonFromGameData(hero)
        GAME.heros[hero.id].tags.saveAsDefaultHero = oldTags.saveAsDefaultHero
        GAME.heros[hero.id].id = hero.id
      })
    }

    GAME.heroList = []
    HERO.forAll((hero) => {
      GAME.heroList.push(hero)
      HERO.addHero(hero)
      hero.keysDown = {}
    })

    global.local.emit('onHerosLoaded')
  }

  unload() {
    global.local.emit('onGameUnload')

    if(GAME.grid.terrainData) {
      global.removeTerrainDataFromPhysics(GAME.grid.terrainData)
    }

    MAP.popoverInstances.forEach((instance) => {
      instance.destroy()
    })
    global.popoverOpen = {}

    GAME.objects.forEach((object) => {
      OBJECTS.unloadObject(object)
    })

    GAME.heroList.forEach((hero) => {
      HERO.deleteHero(hero)
    })

    GAME.removeListeners()
    GAME.gameState = JSON.parse(JSON.stringify(global.defaultGameState))
    GAME.theme = _.clone(global.defaultTheme)
  }

  removeListeners() {
    GAME.gameState.sequenceQueue.forEach((sequence) => {
      if(sequence && sequence.eventListeners) {
        sequence.eventListeners.forEach((remove) => {
          if(remove) remove()
        })
      }
    })
    GAME.gameState.activeModList.forEach((mod) => {
      if(mod && mod.removeEventListener) mod.removeEventListener()
    })
  }

  snapToGrid() {
    GAME.objects.forEach((object) => {
      if(object.mod().removed) return

      gridUtil.snapObjectToGrid(object)
    })

    gridUtil.snapObjectToGrid(GAME.heros[HERO.id])
    GAME.heros[HERO.id].width = GAME.grid.nodeSize
    GAME.heros[HERO.id].height = GAME.grid.nodeSize
  }

  onAddGameTag(tagName) {
    GAME.library.tags[tagName] = false
    tags.addGameTags({[tagName]: false})
  }

  onUpdateGameCustomInputBehavior(customInputBehavior) {
    input.setDefault()
    input.addCustomInputBehavior(customInputBehavior)
    GAME.customInputBehavior = customInputBehavior
  }

  addObstacle(object) {
    if(((!object.path || !object.path.length) && (!object.tags.moving) && object.tags.obstacle) || GAME.world.tags.calculateMovingObstaclePaths || object.tags.noMonsterAllowed) {
      // pretend we are dealing with a 0,0 plane
      let x = object.x - GAME.grid.startX
      let y = object.y - GAME.grid.startY

      let diffX = x % GAME.grid.nodeSize
      x -= diffX
      x = x/GAME.grid.nodeSize

      let diffY = y % GAME.grid.nodeSize
      y -= diffY
      y = y/GAME.grid.nodeSize

      let gridWidth = object.mod().width / GAME.grid.nodeSize;
      let gridHeight = object.mod().height / GAME.grid.nodeSize;

      for(let currentx = x; currentx < x + gridWidth; currentx++) {
        for(let currenty = y; currenty < y + gridHeight; currenty++) {
          GAME.hasObstacleUpdate(currentx, currenty, true)
        }
      }
    }
  }

  hasObstacleUpdate(x, y, hasObstacle) {
    try {
      if(x >= 0 && x < GAME.grid.width) {
        if(y >= 0 && y < GAME.grid.height) {
          let gridNode = GAME.grid.nodes[x][y]
          gridNode.hasObstacle = hasObstacle
        }
      }
    } catch(e) {
      console.log(x, y)
    }

  }

  removeObstacle(object) {
    // pretend we are dealing with a 0,0 plane
    let x = object.x - GAME.grid.startX
    let y = object.y - GAME.grid.startY

    let diffX = x % GAME.grid.nodeSize
    x -= diffX
    x = x/GAME.grid.nodeSize

    let diffY = y % GAME.grid.nodeSize
    y -= diffY
    y = y/GAME.grid.nodeSize

    let gridWidth = object.mod().width / GAME.grid.nodeSize;
    let gridHeight = object.mod().height / GAME.grid.nodeSize;

    for(let currentx = x; currentx < x + gridWidth; currentx++) {
      for(let currenty = y; currenty < y + gridHeight; currenty++) {
        GAME.hasObstacleUpdate(currentx, currenty, false)
      }
    }
  }

  updateGridObstacles() {
    if(GAME.grid.width !== GAME.grid.nodes.length) {
      // were in the middle of a grid update HOMIE!!
      return
    }

    GAME.forEachGridNode((gridNode) => {
      if(gridNode) gridNode.hasObstacle = false
    })

    GAME.objects.forEach((obj) => {
      if(obj.mod().removed) return

      if(obj.tags && obj.tags.obstacle || obj.tags.noMonsterAllowed) {
        if(obj.constructParts) {
          obj.constructParts.forEach((part) => {
            GAME.addObstacle({...part, tags: obj.tags})
          })
        } else {
          GAME.addObstacle(obj)
        }
      }
    })
  }

  forEachGridNode(fx) {
    for(var i = 0; i < GAME.grid.width; i++) {
      for(var j = 0; j < GAME.grid.height; j++) {
        fx(GAME.grid.nodes[i][j])
      }
    }
  }

  addTimeout(id, numberOfSeconds, fx) {
    timeouts.addTimeout(id, numberOfSeconds, fx)
  }
  incrementTimeout(id, numberOfSeconds) {
    timeouts.incrementTimeout(id, numberOfSeconds)
  }
  resetTimeout(id, numberOfSeconds) {
    timeouts.resetTimeout(id, numberOfSeconds)
  }
  addOrResetTimeout(id, numberOfSeconds, fx) {
    timeouts.addOrResetTimeout(id, numberOfSeconds, fx)
  }
  completeTimeout(id) {
    timeouts.completeTimeout(id)
  }
  clearTimeout(id) {
    timeouts.clearTimeout(id)
  }

  onAddTrigger(ownerId, trigger) {
    const { eventName } = trigger
    const owner = OBJECTS.getObjectOrHeroById(ownerId)
    triggers.addTrigger(owner, trigger)
  }
  onEditTrigger(ownerId, triggerId, trigger) {
    const owner = OBJECTS.getObjectOrHeroById(ownerId)
    triggers.deleteTrigger(owner, triggerId)
    triggers.addTrigger(owner, trigger)
  }
  onDeleteTrigger(ownerId, triggerId) {
    triggers.deleteTrigger(OBJECTS.getObjectOrHeroById(ownerId), triggerId)
  }

  onProcessEffect(effect, effectedIds, effectorId) {
    if(!effectedIds) {
      effects.processEffect(effect)
    } else {
      const effector = OBJECTS.getObjectOrHeroById(effectorId)
      effectedIds.forEach((id) => {
        effects.processEffect(effect, OBJECTS.getObjectOrHeroById(id), effector)
      })
    }
  }

  onStopGame() {
    if(!GAME.gameState.started) {
      return console.log('trying to stop game that aint even started yet')
    }

    global.local.emit('onLoadingScreenStart')

    setTimeout(() => {
      let initialGameState = localStorage.getItem('initialGameState')
      if(!initialGameState) {
        GAME.unload()
        GAME.loadAndJoin(GAME)
        return console.log('game stopped, but no initial game state set')
      }

      initialGameState = JSON.parse(initialGameState)
      GAME.unload()
      // in case anyone joined after the game started...
      Object.keys(GAME.heros).forEach((heroId) => {
        if(!initialGameState.heros[heroId]) {
          initialGameState.heros[heroId] = GAME.heros[heroId]
        }
      })
      if(!global.isServerHost) {
        GAME.loadAndJoin(initialGameState)
      } else {
        GAME.loadGridWorldObjectsCompendiumState(initialGameState)
        GAME.loadHeros(initialGameState)
      }
      global.local.emit('onGameStopped')
    }, 100)
  }

  onStartPregame(options) {
    global.local.emit('onGameStart', {...options, silent: true})

    if(GAME.library.sequences.pregame) {
      GAME.gameState.cutscene = true
      GAME.gameState.paused = true

      startSequence('pregame', {})
      const removeEventListener = global.local.on('onSequenceComplete', (id) => {
        if(id === 'pregame') {
          removeEventListener()
          global.local.emit('onGameStarted')
          GAME.gameState.cutscene = false
          GAME.gameState.paused = false
        }
      })
    } else {
      setTimeout(() => {
        global.local.emit('onGameStarted')
      })
    }
  }

  onGameStart(options) {
    if(!options) options = {}

    GAME.objects.forEach((object) => {
      if(object.mod().tags.destroySoon || object.mod().tags.destroyQuickly || object.mod().tags.destroyEventually) {
        OBJECTS.deleteObject(object)
        PIXIMAP.deleteObject(object)
        return
      }
    })

    if(GAME.gameState.started) {
      return console.log('trying to start game that has already started')
    }

    global.local.emit('onLoadingScreenStart')

    const initialGameState = GAME.cleanForSave(GAME)
    initialGameState.heros = GAME.heros
    // remove all references to the objects, state, heros, world, etc so we can consider them state while the game is running!
    localStorage.setItem('initialGameState', JSON.stringify(initialGameState))

    setTimeout(() => {
      GAME.gameState.paused = false
      GAME.gameState.started = true

      GAME.heroList.forEach((hero) => {
        if(!options.dontRespawn) HERO.spawn(hero)
        // if(PAGE.role.isHost)  global.emitGameEvent('onHeroAwake', hero)
        hero.questState = {}
        if(hero.quests) {
          Object.keys(hero.quests).forEach((questId) => {
            hero.questState[questId] = {
              started: false,
              active: false,
              completed: false,
            }
          })
        }
        if(hero.subObjects) {
          Object.keys(hero.subObjects).forEach((subObjectName) => {
            // if(PAGE.role.isHost) global.emitGameEvent('onObjectAwake', hero.subObjects[subObjectName])
          })
        }
      })

      GAME.objects.forEach((object) => {
        if(!options.dontRespawn) OBJECTS.respawn(object)
        // if(PAGE.role.isHost) global.emitGameEvent('onObjectAwake', object)
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
            // if(PAGE.role.isHost) global.emitGameEvent('onObjectAwake', object.subObjects[subObjectName])
          })
        }
      })

      if(!PAGE.role.isAdmin && EDITOR.preferences.zoomMultiplier) {
        global.local.emit('onZoomChange')
      }

      global.local.emit('onLoadingScreenEnd')
      if(!options.silent) global.local.emit('onGameStarted')
    }, 100)
  }

  onBranchGame(id) {
    const rootGameState = GAME.cleanForSave(GAME, { keepState: true, removeFalseTags: false })
    rootGameState.objectsById = GAME.objectsById
    localStorage.setItem('rootGameState', JSON.stringify(rootGameState))
    if(GAME.library.branches[id]) GAME.onBranchApply(id)
    GAME.gameState.branch = true
    GAME.gameState.branchName = id
    global.local.emit('onBranchStart')
  }

  reloadRoot(cb) {
    global.local.emit('onLoadingScreenStart')
    setTimeout(() => {
      let rootGameState = localStorage.getItem('rootGameState')
      if(!rootGameState) {
        GAME.unload()
        GAME.loadAndJoin(GAME)
        return console.log('no root game state')
      }
      rootGameState = JSON.parse(rootGameState)
      GAME.unload()
      GAME.loadAndJoin(rootGameState)
      global.local.emit('onBranchEnd')
      cb()
    }, 100)
  }

  onBranchGameCancel() {
    GAME.reloadRoot()
  }

  onBranchGameSave() {
    let rootGameState = JSON.parse(localStorage.getItem('rootGameState'))

    const branchData = GAME.cleanForSave(GAME, { keepState: true, removeFalseTags: false })

    const { addedObjects, existingObjects } = branchData.objects.reduce((prev, next) => {
      if(rootGameState.objectsById[next.id]) {
        prev.existingObjects.push(next)
      } else {
        prev.addedObjects.push(next)
      }
      return prev
    },  { addedObjects: [], existingObjects: [] })

    const diff = global.getObjectDiff(existingObjects, rootGameState.objects)
    const branchName = GAME.gameState.branchName
    GAME.reloadRoot(() => {
      GAME.library.branches[branchName] = {
        branchedOff:'root',
        branchName: branchName+'-'+global.uniqueID(),
        existingObjectsDiff: diff,
        addedObjects,
      }
      global.socket.emit('updateLibrary', { branches: GAME.library.branches })
    })
  }

  onBranchApply(id) {
    const branch = _.cloneDeep(GAME.library.branches[id])
    if(!branch) return
    global.socket.emit('editObjects', branch.existingObjectsDiff)
    global.socket.emit('addObjects', branch.addedObjects.map((addedObj) => {
      addedObj.id = 'branchadded-'+global.uniqueID()
      return addedObj
    }))
  }

  onBranchModRevert(id) {
    global.local.emit('onEndMod', id)
  }

  onBranchModApply(id) {
    const branch = _.cloneDeep(GAME.library.branches[id])
    const addedObjects = branch.addedObjects.map((addedObj) => {
      addedObj.id = 'branchadded-'+global.uniqueID()
      OBJECTS.removeObject(addedObj)
      return addedObj
    })
    global.socket.emit('addObjects', addedObjects)
    branch.existingObjectsDiff.forEach((diff) => {
      const objectId = diff.id
      delete diff.id
      const mod = {
        ownerId: objectId,
        manualRevertId: id,
        effectJSON: diff,
      }
      global.local.emit('onStartMod', mod)
    })
    addedObjects.forEach((object) => {
      const mod = {
        ownerId: object.id,
        manualRevertId: id,
        effectJSON: {
          removed: false
        }
      }
      global.local.emit('onStartMod', mod)
    })
  }

  cleanForSave(game, options = { keepState: false, removeFalseTags: false }) {
    let gameCopy = JSON.parse(JSON.stringify({
      //.filter((object) => !object.spawned)
      id: game.id,
      objects: game.objects,
      world: game.world,
      grid: game.grid,
      tags: game.library.tags,
      customInputBehavior: game.customInputBehavior,
      defaultHero: game.defaultHero,
      library: game.library,
      metadata: game.metadata,
      theme: game.theme,
      customFx: game.customFx
    }))

    if(game.heros) {
      for(var heroId in game.heros) {
        if(game.heros[heroId].tags.saveAsDefaultHero) {
          console.log('setting save tag hero as default hero')
          gameCopy.defaultHero = JSON.parse(JSON.stringify(game.heros[heroId]))
          game.defaultHero = JSON.parse(JSON.stringify(game.heros[heroId]))
          game.defaultHero.tags.saveAsDefaultHero = false
          game.defaultHero.tags.saveAsDefaultHero = false
        }
      }
    } else console.log('no game heros')

//!gameCopy.world.tags.shouldRestoreHero && !gameCopy.world.tags.isAsymmetric ||
    if(!gameCopy.defaultHero) {
      // if(!gameCopy.defaultHero && game.heros[heroId]) gameCopy.defaultHero = JSON.parse(JSON.stringify(game.heros[heroId]))
      console.log('setting any hero as default hero')
      // if(GAME.heroList.length) gameCopy.defaultHero = JSON.parse(JSON.stringify(game.heroList[0]))
      gameCopy.defaultHero = JSON.parse(JSON.stringify(global.defaultHero))
      // else return alert('could not find a game hero')
    }

    if(!gameCopy.id) {
      gameCopy.id = 'game-' + global.uniqueID()
    }

    if(gameCopy.grid && gameCopy.grid.nodes) {
      delete gameCopy.grid.nodes
      delete gameCopy.terrainData
    }
    if(gameCopy.grid && gameCopy.grid.terrainData) {
      delete gameCopy.grid.terrainData
    }

    gameCopy.objects = gameCopy.objects.map((object) => {
      global.removeFalsey(object.tags, options.removeFalseTags)
      let props = OBJECTS.getProperties(object)
      global.removeFalsey(props)

      if(options.keepState) {
        props.x = object.x
        props.y = object.y
        props.mod().removed = object.mod().removed
      }
      return props
    })

    gameCopy.defaultHero = HERO.getProperties(gameCopy.defaultHero)
    global.removeFalsey(gameCopy.defaultHero)
    global.removeFalsey(gameCopy.defaultHero.tags, options.removeFalseTags)

    return gameCopy
  }

  onEditGameState(gameState) {
    console.log(gameState)
    global.mergeDeep(GAME.gameState, gameState)
  }

  onNetworkUpdateGameState(gameState) {
    if(!PAGE.gameLoaded) return
    delete gameState.logs
    if(!PAGE.role.isHost) global.mergeDeep(GAME.gameState, gameState)
  }

  onChangeGame(game) {
    if(GAME.id) {
      GAME.unload()
    }
    GAME.loadAndJoin(game)
    ARCADE.changeGame(game.id)
  }

  onLoadGameAsLevel(game) {

    const originalHeros = GAME.heros
    GAME.objects.forEach((object) => {
      OBJECTS.unloadObject(object)
    })
    PIXIMAP.onResetObjects()
    GAME.removeListeners()

    GAME.objectsById = {}
    GAME.objects = game.objects.map((object) => {
      OBJECTS.addObject(object)
      OBJECTS.respawn(object)
      return object
    })

    // grid
    GAME.grid = game.grid
    GAME.world = game.world
    if(game.library) GAME.library = game.library
    if(game.theme) GAME.theme = game.theme
    GAME.grid.nodes = gridUtil.generateGridNodes(GAME.grid)
    GAME.updateGridObstacles()
    GAME.pfgrid = pathfinding.convertGridToPathfindingGrid(GAME.grid.nodes)
    GAME.handleWorldUpdate(GAME.world)

    GAME.defaultHero = game.defaultHero || global.defaultHero

    GAME.objects.forEach((object) => {
      // global.emitGameEvent('onObjectAwake', object)
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
    })

    GAME.heroList = GAME.heroList.map((hero) => {
      const oldTags = hero.tags

      let newHero = _.cloneDeep(GAME.defaultHero)
      if(hero.flags.isAdmin) newHero = hero
      newHero.tags.saveAsDefaultHero = oldTags.saveAsDefaultHero
      newHero.id = hero.id
      newHero.tags.centerOfAttention = oldTags.centerOfAttention
      const target = originalHeros[hero.id].animationZoomTarget
      const multiplier = originalHeros[hero.id].animationZoomMultiplier

      newHero.animationZoomTarget = target
      newHero.animationZoomMultiplier = multiplier
      newHero.x = newHero.spawnPointX
      newHero.y = newHero.spawnPointY
      return newHero
    })

    GAME.gameState.activeMods = {}
    GAME.gameState.activeModList = []

    GAME.heroList.forEach((hero) => {
      HERO.addHero(hero)
    })

    if(game.metadata) GAME.metadata = game.metadata

    global.local.emit('onGameStarted')
  }

  onReloadGame(game) {
    // for demo
    let animationZoomTarget
    let animationZoomMultiplier
    if(PAGE.role.isHost && HERO.id && GAME.heros[HERO.id].animationZoomTarget) {
      const hero = GAME.heros[HERO.id]
      animationZoomTarget = hero.animationZoomTarget;
      animationZoomMultiplier = hero.animationZoomMultiplier;
    }

    GAME.unload()
    GAME.loadAndJoin(game)

    const removeEventListener = global.local.on('onGameLoaded', () => {
      // for demo
      if(animationZoomTarget) {
        GAME.heros[HERO.id].animationZoomTarget = animationZoomTarget
      }
      if(animationZoomMultiplier) {
        GAME.heros[HERO.id].animationZoomMultiplier = animationZoomMultiplier
      }
      removeEventListener()
    })

  }

  onUpdateGrid(grid) {
    GAME.grid = grid
    GAME.grid.nodes = gridUtil.generateGridNodes(grid)
    GAME.updateGridObstacles()
    if(GAME.grid.terrainData) {
      global.removeTerrainDataFromPhysics(GAME.grid.terrainData)
    }
    const terrainData = PROCEDURAL.getGameObjectDataFromNodes(GAME.grid.nodes)
    global.addTerrainDataToPhysics(terrainData)
    GAME.grid.terrainData = terrainData
    if(PAGE.role.isHost) {
      GAME.pfgrid = pathfinding.convertGridToPathfindingGrid(GAME.grid.nodes)
    }
  }

  onUpdateLibrary(updatedLibrary) {
    for(let key in updatedLibrary) {
      const value = updatedLibrary[key]

      if(value instanceof Object) {
        GAME.library[key] = {}
        // if(key === 'animations') {
        //   for(let animation in updatedLibrary[key]) {
        //     console.log(animation)
        //     GAME.library.animations[animation] = updatedLibrary[key][animation]
        //   }
        // } else {
          global.mergeDeep(GAME.library[key], value)
        // }
      } else {
        GAME.library[key] = value
      }
    }
  }

  onUpdateTheme(updatedTheme) {
    for(let key in updatedTheme) {
      const value= updatedTheme[key]

      if(key === 'audio') {
        Object.keys(value).forEach((property) => {
          if(value[property] === null) return
          if(!global.audio.sounds[value[property]]) AUDIO.loadAsset(value[property])
        })
      }

      if(value instanceof Object) {
        GAME.theme[key] = {}
        global.mergeDeep(GAME.theme[key], value)
      } else {
        GAME.theme[key] = value
      }
    }
  }

  onUpdateWorld(updatedWorld) {
    if(GAME.world) {
      for(let key in updatedWorld) {
        const value = updatedWorld[key]

        if(value instanceof Object) {
          GAME.world[key] = {}
          global.mergeDeep(GAME.world[key], value)
        } else {
          GAME.world[key] = value
        }
      }
      GAME.handleWorldUpdate(updatedWorld)
    }
  }

  handleWorldUpdate(updatedWorld) {
    for(let key in updatedWorld) {
      const value = updatedWorld[key]

      if(key === 'lockCamera' && !PAGE.role.isPlayEditor) {
        if(value && value.limitX) {
          MAP.camera.setLimit(value.limitX, value.limitY, value.centerX, value.centerY)
        } else {
          MAP.camera.clearLimit();
        }
      }

      if(key === 'gameBoundaries') {
        GAME.updateGridObstacles()
        if(PAGE.role.isHost) GAME.resetPaths = true
        if(PAGE.role.isHost) GAME.pfgrid = pathfinding.convertGridToPathfindingGrid(GAME.grid.nodes)
      }

      if(key === 'tags') {
        for(let tag in updatedWorld.tags) {
          const tagVal = updatedWorld.tags[tag]
          if(tag === 'calculateMovingObstaclePaths' && GAME.grid.nodes) {
            GAME.updateGridObstacles()
            if(PAGE.role.isHost) GAME.pfgrid = pathfinding.convertGridToPathfindingGrid(GAME.grid.nodes)
          }
          if(tag === 'allMovingObjectsHaveGravityY') {
            GAME.objects.forEach((object) => {
              object.velocityY = 0
            });
            GAME.heroList.forEach((object) => {
              object.velocityY = 0
            });
          }
          if(PAGE.gameLoaded) {
            if(tag === 'hasGameLog') {
              if(!tagVal) PAGE.closeLog()
              if(tagVal) {
                PAGE.openLog()
              }
            }
          }
        }
      }
    }

    global.local.emit('onUpdatePFgrid', 'reset')

    if(PAGE.role.isPlayEditor) {
      // global.worldeditor.update(GAME.world)
      // global.worldeditor.expandAll()
    }
  }

  onUpdatePFgrid() {
    if(!GAME.world.tags.calculateMovingObstaclePaths) {
      GAME.updateGridObstacles()
      GAME.pfgrid = pathfinding.convertGridToPathfindingGrid(GAME.grid.nodes)

      GAME.objects.forEach((object) => {
        if(object.customGridProps) {
          object._pfGrid = pathfinding.convertCustomGridToPathfindingGrid(object.customGridProps)
        }
      })
    }
  }

  onResetWorld() {
    GAME.world = JSON.parse(JSON.stringify(global.defaultWorld))
    if(!PAGE.role.isPlayEditor) MAP.camera.clearLimit()
    GAME.handleWorldUpdate(GAME.world)
  }

  onResetObjects() {
    [...GAME.objects].forEach((object) => {
      global.local.emit('onDeleteObject', object)
    }, [])
    GAME.objects = []
    GAME.objectsById = {}
  }

  addSequence(sequence) {
    GAME.library.sequences[sequence.id] = sequence
  }

  startMod(ownerId, mod) {
    mod = JSON.parse(JSON.stringify(mod))
    mod.ownerId = ownerId

    if(mod.modEndOthers) {
      GAME.gameState.activeModList = GAME.gameState.activeModList.filter(({ownerId}) => mod.ownerId !== ownerId)
    }

    if(mod.modId) {
      if(GAME.gameState.activeModList.some(({modId, ownerId}) => {
        if(modId === mod.modId && ownerId == mod.ownerId) return true
      })) return console.log('mod already applied to this object', id, ownerId)
    }

    if(mod.conditionType) {
      mod._disabled = true
    } else {
      global.emitGameEvent('onModEnabled', mod)
    }

    GAME.gameState.activeModList.push(mod)

    if(mod.conditionType && mod.conditionType.length && mod.conditionType !== 'none') {
      if(mod.conditionType === 'onEvent') {
        mod._disabled = false
        mod.removeEventListener = global.local.on(mod.conditionEventName, (mainObject, guestObject) => {
          let ownerObject = OBJECTS.getObjectOrHeroById(mod.ownerId)
          const eventMatch = testEventMatch(mod.conditionEventName, mainObject, guestObject, mod, ownerObject, { testPassReverse: mod.testPassReverse, testModdedVersion: mod.testModdedVersion })
          if(eventMatch) {
            mod._remove = true
            mod._disabled = true
            if(mod.removeEventListener) mod.removeEventListener()
            delete mod.removeEventListener
          }
        })
      }
      if(mod.conditionType === 'onTimerEnd') {
        mod._disabled = false
        GAME.addTimeout(global.uniqueID(), mod.conditionNumber || 10, () => {
          mod._remove = true
          mod._disabled = true
        })
      }
    }
  }

  testMod(mod, testObject) {
    if(mod.conditionType && mod.conditionType.length && mod.conditionType !== 'none' && mod.conditionType !== 'onTimerEnd' && mod.conditionType !== 'onEvent') {
      if(testCondition(mod, testObject, { testPassReverse: mod.testPassReverse })) {
        mod._disabled = false
        return true
      } else if(mod.testFailDestroyMod) {
        if(mod.removeEventListener) mod.removeEventListener()
        return false
      } else {
        mod._disabled = true
        return true
      }
    }

    return true
  }

  updateActiveMods() {
    /*
    {
      //modname
      effectJSON: {},
      // other effect values

      conditionType // onEvent, onTimer
      conditionEventName
      conditionTimerValue
      conditionValue
      testPassReverse
      testFailDestroyMod
      testAndModOwnerWhenEquipped
    }
    */

    GAME.gameState.activeModList = GAME.gameState.activeModList.sort(function(a, b){
      if(!a.modPriority) return -1
      if(!b.modPriority) return 1
      return a.modPriority-b.modPriority
    }); // Sort the numbers in the array in ascending order

    GAME.gameState.activeModList = GAME.gameState.activeModList.filter(mod => {
      const modOwnerObject = OBJECTS.getObjectOrHeroById(mod.ownerId)

      const prevDisabled = mod._disabled

      if(mod._remove) {
        if(mod.temporaryEquip && modOwnerObject.subObject[mod.effectValue]) unequipSubObject(modOwnerObject, modOwnerObject.subObject[mod.effectValue])
        if(mod.temporaryDialogueChoice) global.local.emit('onDeleteDialogueChoice', modOwnerObject.id, mod.effectValue)
        if(mod.temporaryLibrarySubObject) {
          global.local.emit('onDeleteSubObject', modOwnerObject, mod.effectLibrarySubObject)
        }
        if(mod.removeEventListener) mod.removeEventListener()
        global.emitGameEvent('onModDisabled', mod)
        return false
      }

      // this means the owner of the mod's owner object, CONFUSING
      if(mod.testAndModOwnerWhenEquipped) {
        if(modOwnerObject.ownerId && modOwnerObject.isEquipped) {
          const testObject = OBJECTS.getObjectOrHeroById(modOwnerObject.ownerId)
          const keepInActiveMods = GAME.testMod(mod, testObject)
          return keepInActiveMods
        } else {
          mod._disabled = true
          return true
        }
      }

      const testObject = modOwnerObject

      const keepInActiveMods = GAME.testMod(mod, testObject)

      if(mod.temporaryEquip) {
        const subObject = modOwnerObject.subObjects[mod.effectValue]
        if(subObject) {
          if(mod._disabled && subObject.isEquipped) {
            unequipSubObject(modOwnerObject, modOwnerObject.subObjects[mod.effectValue])
          } else if(!mod._disabled && !subObject.isEquipped) {
            equipSubObject(modOwnerObject, modOwnerObject.subObjects[mod.effectValue])
          }
        }
      }

      if(mod.temporaryDialogueChoice) {
        const dialogueChoice = modOwnerObject.dialogueChoices[mod.effectValue]
        if(dialogueChoice && mod._disabled) {
          global.local.emit('onDeleteDialogueChoice', modOwnerObject.id, mod.effectValue)
        } else if(!mod._disabled && !dialogueChoice) {
          global.local.emit('onAddDialogueChoice', modOwnerObject.id, mod.effectValue, mod.effectJSON)
        }
      }

      if(mod.temporaryLibrarySubObject) {
        const subObject = modOwnerObject.subObjects[mod.effectLibrarySubObject]
        if(subObject && mod._disabled) {
          global.local.emit('onDeleteSubObject', modOwnerObject, mod.effectLibrarySubObject)
        } else if(!mod._disabled && !subObject) {
          global.local.emit('onAddSubObject', modOwnerObject, global.subObjectLibrary.addGameLibrary()[mod.effectLibrarySubObject],  mod.effectLibrarySubObject)
        }
      }

      if(prevDisabled && !mod._disabled) {
        global.emitGameEvent('onModEnabled', mod)
        if(mod.modResetPhysics) {
          OBJECTS.resetPhysicsProperties(modOwnerObject)
        }
      }

      if(!prevDisabled && mod._disabled) {
        global.emitGameEvent('onModDisabled', mod)
        if(mod.modResetPhysicsEnd) {
          OBJECTS.resetPhysicsProperties(modOwnerObject)
        }
      }

      return keepInActiveMods
    })

    GAME.loadActiveMods()
  }

  loadActiveMods() {
    GAME.gameState.activeMods = {}
    GAME.modCache = {}
    // create mods to effect the game in the next update
    GAME.gameState.activeModList.forEach((mod) => {
      if(!GAME.gameState.activeMods[mod.ownerId]) GAME.gameState.activeMods[mod.ownerId] = []
      GAME.gameState.activeMods[mod.ownerId].push(mod)
    })
  }

  // actually mod an object
  mod(object) {
    if(!object.id || !GAME.modCache) {
      return object
    }
    if(GAME.modCache[object.id]) {
      let cached = GAME.modCache[object.id]
      cached.x = object.x
      cached.y = object.y
      cached.interactableObjectId = object.interactableObjectId
      return cached
    }

    let activeMods = GAME.gameState.activeMods[object.id]
    if(!activeMods) activeMods = []

    if(object._tempModOnMap && !object.tags.subObject && !object.inInventory && !object.tags.potential && !object.isEquipped) {
      activeMods.push({ effectJSON: object._tempModOnMap})
    }

    if(object._tempMods) {
      object._tempMods.forEach((json) => {
        activeMods.push({ effectJSON: json})
      })
      object._tempMods = null
    }

    if(!activeMods.length) {
      return object
    } else if(activeMods.length) {
      const objectCopy = _.cloneDeep(object)
        //moddable propertys
        // tags: JSON.parse(JSON.stringify(object.tags)),
        // speed: object.speed,
        // width: object.mod().width,
        // height: object.mod().height,
        // color: object.color,
        // actionButtonBehavior: object.actionButtonBehavior,
        // arrowKeysBehavior: object.arrowKeysBehavior,
        // spaceBarBehavior: object.spaceBarBehavior,
        // jumpVelocity: object.jumpVelocity,
        // velocityMax: object.velocityMax,
        // tags: object.tags,
        // zoomMultiplier: object.zoomMultiplier,
        // defaultSprite: object.defaultSprite,
        // upSprite: object.upSprite,
        // leftSprite: object.leftSprite,
        // downSprite: object.downSprite,
        // rightSprite: object.rightSprite,
        // spawnPointX: object.spawnPointX,
        // spawnPointY: object.spawnPointY,
        // relativeX: object.relativeX,
        // relativeY: object.relativeY,
        // relativeId: object.relativeId,
        // parentId: object.parentId,
        // name: object.name,
        // namePos: object.namePos,
        // heroDialogue: object.heroDialogue,
        // pathfindingLimit: object.pathfindingLimit,

      activeMods.forEach((mod) => {
        if(mod._disabled) return
        if(mod.temporaryEquip) return
        if(mod.temporaryDialogueChoice) return

        OBJECTS.mergeWithJSON(objectCopy, mod.effectJSON)
      })

      if(objectCopy.subObjects) {
        objectCopy.subObjects = Object.keys(objectCopy.subObjects).reduce((prev, subObjectName) => {
          prev[subObjectName] = objectCopy.subObjects[subObjectName].mod()
          return prev
        }, {})
      }

      GAME.modCache[objectCopy.id] = objectCopy
      return objectCopy
    }
  }

  getObjectsByTag() {
    const previousObjectsByTag = GAME.objectsByTag || {}

    GAME.objectsByTag = GAME.objects.reduce((map, object) => {
      if(object.mod().removed) return map
      Object.keys(object.mod().tags).forEach((tag) => {
        if(!map[tag]) map[tag] = []
        if(object.mod().tags[tag] === true) map[tag].push(object)
      })
      return map
    }, {})
    GAME.objectsByTag = GAME.heroList.reduce((map, hero) => {
      if(hero.mod().removed) return map
      Object.keys(hero.mod().tags).forEach((tag) => {
        if(!map[tag]) map[tag] = []
        if(hero.mod().tags[tag] === true) map[tag].push(hero)
      })
      return map
    }, GAME.objectsByTag)

    if(PAGE.role.isHost) {
      Object.keys(previousObjectsByTag).forEach((tag) => {
        if(!GAME.objectsByTag[tag]) global.emitGameEvent('onTagDepleted', tag)
      })
    }
  }

  onUpdateGridNode(x, y, update) {
    const key = 'x:'+x+'y:'+y
    if(!GAME.grid.nodeData) GAME.grid.nodeData = {}
    if(!GAME.grid.nodeData[key]) GAME.grid.nodeData[key] = {}
    Object.assign(GAME.grid.nodeData[key], update)
    if(GAME.grid && GAME.grid.nodes && GAME.grid.nodes[x] && GAME.grid.nodes[x][y]) {
      Object.assign(GAME.grid.nodes[x][y], update)
    }
  }

  onSendNotification(options) {
    if(options.log) {
      GAME.addLog(options)
    }
    if(PAGE.role.isHost && options.chat) {
      OBJECTS.chat({ id: options.chatId, duration: options.duration, text: options.text })
    }
  }

  addLog({ logAuthorId, logRecipientId, playerUIHeroId, text, involvedIds, animation, type, heroId, teamId, dateMilliseconds }) {
    if(GAME.gameState.logs) GAME.gameState.logs.push({
      playerUIHeroId,
      teamId,
      logRecipientId,
      logAuthorId,
      text,
      involvedIds,
      animation,
      type,
      dateMilliseconds,
    })
  }

  onAddAnimation(name, animationData) {
    GAME.library.animations[name] = animationData
  }

  onStartMod(mod) {
    GAME.startMod(mod.ownerId, mod)
  }
  onEndMod(manualRevertId) {
    GAME.gameState.activeModList = GAME.gameState.activeModList.filter((mod) => {
      if(mod.manualRevertId === manualRevertId) {
        mod._remove = true
        mod._disabled = true
        if(mod.effectJSON.removed || (mod.effectJSON.tags && mod.effectJSON.tags.obstacle)) global.local.emit('onUpdatePFgrid')
      }
      if(mod.modId === manualRevertId) {
        mod._remove = true
        mod._disabled = true
        if(mod.effectJSON.removed || (mod.effectJSON.tags && mod.effectJSON.tags.obstacle)) global.local.emit('onUpdatePFgrid')
      }
      return true
    })
  }

  onModDisabled(mod) {
    if(PAGE.role.isHost) if(mod.effectJSON.removed || (mod.effectJSON.tags && mod.effectJSON.tags.obstacle)) global.local.emit('onUpdatePFgrid')
  }

  onStartSequence(sequenceId, ownerId) {
    if(ownerId) {
      const ownerObject = OBJECTS.getObjectOrHeroById(ownerId)
      startSequence(sequenceId, { ownerObject })
    } else {
      startSequence(sequenceId)
    }
  }

  onTogglePauseSequence(sequenceId) {
    const sequence = GAME.gameState.sequenceQueue.find(({id}) => id === sequenceId)
    if(sequence) togglePauseSequence(sequence)
  }

  onStopSequence(sequenceId) {
    const sequence = GAME.gameState.sequenceQueue.find(({id}) => sequenceId)
    if(sequence) endSequence(sequence)
  }

  onEditGameHeroJSON(gameHeroName, JSON) {
    if(gameHeroName === 'default') {
      GAME.defaultHero = JSON
    }
  }

  onEditMetadata(update) {
    for(let key in update) {
      const value = update[key]

      if(value instanceof Object) {
        GAME.metadata[key] = {}
        global.mergeDeep(GAME.metadata[key], value)
      } else {
        GAME.metadata[key] = value
      }
    }
  }
}

global.GAME = new Game()
