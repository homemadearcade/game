import gridUtil from '../utils/grid.js'
import collisionsUtil from '../utils/collisions'
import contextMenu from './contextMenu.jsx'
import selectionTools from './selectionTools';
import keyInput from './keyInput';
import render from './render';
import Camera from '../map/camera'
import drawTools from './drawTools'

class MapEditor {
  constructor() {
    this.initState()
  }

  initState() {
    this.clickStart = {
      x: null,
      y: null,
    }

    this.mousePos = {
      x: null,
      y: null,
    }

    this.dragStart = {
      x: null,
      y: null,
    }

    this.copiedObject = null
    this.objectHighlighted = null
    this.resizingObject = null
    this.draggingObject = null
    this.draggingRelativeObject = null
    this.snapToGrid = true
    this.pathfindingLimit = null
    this.isSettingPathfindingLimit = false
    this.paused = false
    this.groupGridHighlights = {}
  }

  onPlayerIdentified() {
    const loader = document.createElement('div')
    loader.className = 'loader'
    MAPEDITOR.loaderElement = loader
    document.getElementById('GameContainer').appendChild(loader)
    loader.style.display = "none"

    const focusPaused = document.createElement('div')
    focusPaused.className = 'paused unfocused'
    MAPEDITOR.focusPausedElement = focusPaused
    document.getElementById('GameContainer').appendChild(focusPaused)
    focusPaused.style.display = "none"

    const hostPaused = document.createElement('div')
    hostPaused.className = 'paused host'
    MAPEDITOR.hostPausedElement = hostPaused
    document.getElementById('GameContainer').appendChild(hostPaused)
    hostPaused.style.display = "none"

    const gamePaused = document.createElement('div')
    gamePaused.className = 'paused game'
    MAPEDITOR.gamePausedElement = gamePaused
    document.getElementById('GameContainer').appendChild(gamePaused)
    gamePaused.style.display = "none"

    const heroPaused = document.createElement('div')
    heroPaused.className = 'paused'
    MAPEDITOR.heroPausedElement = heroPaused
    document.getElementById('GameContainer').appendChild(heroPaused)
    heroPaused.style.display = "none"
  }

  set(ctx, canvas, camera) {
    MAPEDITOR.ctx = ctx
    MAPEDITOR.canvas = canvas
    MAPEDITOR.camera = camera

    contextMenu.init(MAPEDITOR)
    keyInput.init()

    document.body.addEventListener("click", (e) => {
      if(e.button === 2) return
      if (!MAPEDITOR.paused) handleMouseDown(event)
    })
    document.body.addEventListener("dblclick", (e) => {
      if(!global.isClickingMap(e.target.className)) return
      if(!PAGE.role.isAdmin && MAPEDITOR.objectHighlighted && MAPEDITOR.objectHighlighted.id) {
        MAPEDITOR.openConstructEditor(MAPEDITOR.objectHighlighted)
        return
      }

      if(!GAME.heros[HERO.id].flags.allowObjectSelection && !PAGE.role.isAdmin) return

      if(MAPEDITOR.objectHighlighted && MAPEDITOR.objectHighlighted.id) {
        OBJECTS.editingId = MAPEDITOR.objectHighlighted.id
        BELOWMANAGER.open({ objectSelected: MAPEDITOR.objectHighlighted, selectedManager: 'ObjectManager', selectedMenu: 'detail', selectedId: OBJECTS.editingId })
      }
    })
    document.body.addEventListener("mousemove", (e) => {
      if (!MAPEDITOR.paused) handleMouseMove(event)
    })
    document.body.addEventListener("mouseup", (e) => {
      if (!MAPEDITOR.paused) handleMouseUp(event)
    })
    // document.body.addEventListener("mouseout", (e) => {
    //   if (!MAPEDITOR.paused) handleMouseOut(event)
    // })

    CONSTRUCTEDITOR.set(MAPEDITOR.ctx, MAPEDITOR.canvas, new Camera())
    PATHEDITOR.set(MAPEDITOR.ctx, MAPEDITOR.canvas, new Camera())
  }

  openConstructEditor(object, startColor, startAtHero) {
    CONSTRUCTEDITOR.start(object, startColor, startAtHero)
    // global.socket.emit('editGameState', { paused: true })

    MAPEDITOR.initState()
    MAPEDITOR.pause()

    const removeSaveListener = global.local.on('onConstructEditorSave', ({ constructParts, x, y, width, height }) => {
      if (constructParts) {
        if(constructParts.length == 0) {
          global.socket.emit('deleteObject', object)
        } else if(constructParts.length == 1) {
          global.socket.emit('editObjects', [{ id: object.id, constructParts: null, spawnPointX: x, spawnPointY: y, x, y, width, height }])
        } else {
          global.socket.emit('editObjects', [{ id: object.id, constructParts, spawnPointX: x, spawnPointY: y, x, y, width, height }])
        }
      }
    })
    const removeListener = global.local.on('onConstructEditorClose', () => {
      MAPEDITOR.resume()
      removeListener()
      removeSaveListener()
    })
  }

  openPathEditor(object, startAtHero) {
    PATHEDITOR.start(object, startAtHero)
    // global.socket.emit('editGameState', { paused: true })

    MAPEDITOR.initState()
    MAPEDITOR.pause()

    const removeListener = global.local.on('onPathEditorClose', ({ pathParts, customGridProps }) => {
      if (pathParts) {
        if(customGridProps) {
          global.socket.emit('editObjects', [{ id: object.id, pathParts, tags: { path: true }, customGridProps }])
        } else {
          global.socket.emit('editObjects', [{ id: object.id, pathParts, customGridProps: null, tags: { path: true } }])
        }
      }
      // global.socket.emit('editGameState', { paused: false })
      MAPEDITOR.resume()
      removeListener()
    })
  }


  pause() {
    MAPEDITOR.paused = true
  }

  resume() {
    MAPEDITOR.paused = false
  }

  onUpdate(delta) {
    if(MAPEDITOR.objectHighlighted) global.socket.emit('sendHeroMapEditor', {x: MAPEDITOR.objectHighlighted.x, y: MAPEDITOR.objectHighlighted.y, width: MAPEDITOR.objectHighlighted.width, height: MAPEDITOR.objectHighlighted.height, constructParts:MAPEDITOR.objectHighlighted.constructParts }, HERO.id)
  }

  startResize(object, options = { snapToGrid: true }) {
    MAPEDITOR.snapToGrid = options.snapToGrid
    MAPEDITOR.resizingObject = JSON.parse(JSON.stringify(object))
  }

  onStartSetPathfindingLimit(object) {
    MAPEDITOR.isSettingPathfindingLimit = true
    document.body.style.cursor = "crosshair";
  }

  onStartDrag(object, options = { snapToGrid: true }) {
    MAPEDITOR.snapToGrid = options.snapToGrid
    MAPEDITOR.draggingObject = JSON.parse(JSON.stringify(object))
  }

  startRelativeDrag(object, options = { snapToGrid: false }) {
    MAPEDITOR.snapToGrid = options.snapToGrid
    const owner = OBJECTS.getOwner(object)
    object.angle = 0
    owner.angle = 0
    MAPEDITOR.draggingRelativeObject = JSON.parse(JSON.stringify(object))
  }

  onCopy(object) {
    MAPEDITOR.copiedObject = JSON.parse(JSON.stringify(object))
    delete MAPEDITOR.copiedObject.id
  }

  onLoadingScreenStart() {
    drawTools.drawLoadingScreen(MAPEDITOR.ctx, MAPEDITOR.camera)
  }

  onRender() {
    MAP.updatePopovers()
    render.update()
  }

  onSendHeroMapEditor(remoteState, heroId) {
    if(heroId == HERO.id) return
    const hero = GAME.heros[heroId]
    if(!MAPEDITOR.groupGridHighlights) MAPEDITOR.groupGridHighlights = {}
    MAPEDITOR.groupGridHighlights[heroId] = remoteState
    if(hero.user) MAPEDITOR.groupGridHighlights[heroId].initials = hero.user.firstName[0] + hero.user.lastName[0]
    MAPEDITOR.groupGridHighlights[heroId].heroName = hero.name || hero.id
  }

  onAskHeroToNameObject(object, heroId) {
    if (PAGE.role.isPlayer && !PAGE.role.isGhost && HERO.id === heroId) {
      modals.nameObject(object)
    }
  }

  onAskHeroToWriteDialogue(object, heroId) {
    if (PAGE.role.isPlayer && !PAGE.role.isGhost && HERO.id === heroId) {
      modals.writeDialogue(object)
    }
  }

  networkEditObject(object, update) {
    if (object.tags.subObject && object.subObjectName && object.ownerId) {
      const owner = OBJECTS.getOwner(object)
      global.socket.emit('editSubObject', object.ownerId, object.subObjectName, update)
    } else if (object.tags.hero) {
      global.socket.emit('editHero', { id: object.id, ...update })
    } else {
      global.socket.emit('editObjects', [{ id: object.id, ...update }])
    }
  }

  deleteObject(object) {
    if (object.tags.subObject && object.subObjectName) {
      const owner = OBJECTS.getOwner(object)
      global.socket.emit('deleteSubObject', owner, object.subObjectName)
    } else if(object.tags.hero) {
      global.socket.emit('deleteHero', object.id)
    } else if(object.id) {
      global.socket.emit('deleteObject', object)
    } else {
      console.error('trying to delete object without id')
    }

    global.objectHighlighted = null
  }

  removeObject(object) {
    if (object.tags.subObject && object.subObjectName && object.ownerId) {
      global.socket.emit('removeSubObject', object.ownerId, object.subObjectName)
    } else if (object.tags.hero) {
      global.socket.emit('removeHero', object)
    } else {
      global.socket.emit('removeObject', object)
    }
  }
}

function handleMouseUp(event) {
  const { camera } = MAPEDITOR
  const { x, y } = global.convertToGameXY(event)

  let clickEndX = ((x + camera.x) / camera.multiplier)
  let clickEndY = ((y + camera.y) / camera.multiplier)
}

function handleMouseDown(event) {
  const { camera, networkEditObject } = MAPEDITOR
  if(!PIXIMAP.app) return
  const { x, y } = global.convertToGameXY(event)
  MAPEDITOR.clickStart.x = ((x + camera.x) / camera.multiplier)
  MAPEDITOR.clickStart.y = ((y + camera.y) / camera.multiplier)

  let selectionAllowed = false
  if(global.isClickingMap(event.target.className)) {
    selectionAllowed = PAGE.role.isAdmin || GAME.heros[HERO.id].flags.allowObjectSelection
  }

  if(event.target.className.indexOf('dont-close-menu') >= 0) {
    selectionAllowed = false
  } else if(MAPEDITOR.contextMenuVisible) {
    selectionAllowed = false
    setTimeout(() => {
      MAPEDITOR.contextMenuRef._toggleContextMenu("hide");
    })
  }

  if(MAPEDITOR.copiedObject) {
    const subObjects = MAPEDITOR.copiedObject.subObjects
    if(subObjects) {
      Object.keys(subObjects).forEach((subObjectName) => {
        const so = subObjects[subObjectName]
        so.id = subObjectName + '-' + global.uniqueID()
      })
    }
    const constructParts = MAPEDITOR.copiedObject.constructParts
    if(constructParts) {
      constructParts.forEach((part) => {
        part.id = global.uniqueID()
      })
    }
    OBJECTS.create([MAPEDITOR.copiedObject])
    MAPEDITOR.copiedObject = null
  } else if (MAPEDITOR.isSettingPathfindingLimit) {
    if (MAPEDITOR.pathfindingLimit) {
      const { pathfindingLimit, objectHighlighted } = MAPEDITOR
      gridUtil.snapObjectToGrid(pathfindingLimit, { dragging: true })
      networkEditObject(objectHighlighted, { id: objectHighlighted.id, pathfindingLimit, path: null })
      document.body.style.cursor = "default";
      MAPEDITOR.isSettingPathfindingLimit = false
      MAPEDITOR.pathfindingLimit = null
    } else {
      MAPEDITOR.pathfindingLimit = { ...MAPEDITOR.clickStart }
      MAPEDITOR.pathfindingLimit.width = 0
      MAPEDITOR.pathfindingLimit.height = 0
    }
  } else if (MAPEDITOR.resizingObject) {
    const { resizingObject } = MAPEDITOR
    if(resizingObject.relativeWidth || resizingObject.relativeHeight) {
      const owner = OBJECTS.getOwner(resizingObject)
      networkEditObject(resizingObject, { id: resizingObject.id, x: resizingObject.x, y: resizingObject.y, relativeWidth: resizingObject.width - owner.width, relativeHeight: resizingObject.height - owner.height })
    } else {
      networkEditObject(resizingObject, { id: resizingObject.id, x: resizingObject.x, y: resizingObject.y, width: resizingObject.width, height: resizingObject.height })
    }
    MAPEDITOR.resizingObject = null
  } else if (MAPEDITOR.draggingObject) {
    const { draggingObject } = MAPEDITOR
    if (draggingObject.pathParts) {
      networkEditObject(draggingObject, { id: draggingObject.id, spawnPointX: draggingObject.x, y: draggingObject.y, spawnPointY: draggingObject.y, x: draggingObject.x, y: draggingObject.y, pathParts: draggingObject.pathParts })
    } else if (draggingObject.constructParts) {
      networkEditObject(draggingObject, { id: draggingObject.id, spawnPointX: draggingObject.x, y: draggingObject.y, spawnPointY: draggingObject.y, x: draggingObject.x, y: draggingObject.y, constructParts: draggingObject.constructParts.map(part => {
        part.id = global.uniqueID()
        return part
      }) })
    } else if (GAME.gameState.started || GAME.gameState.branch) {
      networkEditObject(draggingObject, { id: draggingObject.id, x: draggingObject.x, y: draggingObject.y })
    } else {
      networkEditObject(draggingObject, { id: draggingObject.id, x: draggingObject.x, spawnPointX: draggingObject.x, y: draggingObject.y, spawnPointY: draggingObject.y })
    }
    MAPEDITOR.draggingObject = null
  } else if (MAPEDITOR.draggingRelativeObject) {
    const { draggingRelativeObject } = MAPEDITOR
    const owner = OBJECTS.getOwner(draggingRelativeObject)
    const { relativeX, relativeY } = OBJECTS.getRelativeCenterXY(draggingRelativeObject, owner)
    networkEditObject(draggingRelativeObject, { id: draggingRelativeObject.id, relativeX, relativeY })
    MAPEDITOR.draggingRelativeObject = null
  } else if(selectionAllowed && MAPEDITOR.objectHighlighted && MAPEDITOR.objectHighlighted.id){
    if(OBJECTS.editingId === MAPEDITOR.objectHighlighted.id) {
      OBJECTS.editingId = null;
    }
  } else if(selectionAllowed){
    OBJECTS.editingId = null
  }

  MAPEDITOR.snapToGrid = true
}

function handleMouseMove(event) {
  const { camera } = MAPEDITOR

  if (!global.isClickingMap(event.target.className)) return

  const { x, y } = global.convertToGameXY(event)

  MAPEDITOR.mousePos.x = ((x + camera.x) / camera.multiplier)
  MAPEDITOR.mousePos.y = ((y + camera.y) / camera.multiplier)

  if (MAPEDITOR.draggingRelativeObject) {
    updateDraggingObject(MAPEDITOR.draggingRelativeObject)
  } else if (MAPEDITOR.copiedObject) {
    updateDraggingObject(MAPEDITOR.copiedObject)
  } else if (MAPEDITOR.isSettingPathfindingLimit) {
    if (MAPEDITOR.pathfindingLimit) {
      updateResizingObject(MAPEDITOR.pathfindingLimit, { allowTiny: false })
    }
  } else if (MAPEDITOR.resizingObject) {
    updateResizingObject(MAPEDITOR.resizingObject)
  } else if (MAPEDITOR.draggingObject) {
    updateDraggingObject(MAPEDITOR.draggingObject)
  } else {
    updateGridHighlight({ x: MAPEDITOR.mousePos.x, y: MAPEDITOR.mousePos.y })
  }
}

function updateGridHighlight(location) {
  if (MAPEDITOR.contextMenuVisible) return

  const { x, y } = gridUtil.snapXYToGrid(location.x, location.y, { closest: false })

  let mouseLocation = {
    x,
    y,
    width: GAME.grid.nodeSize,
    height: GAME.grid.nodeSize
  }

  let previousHighlightX
  let previousHighlightY
  if(MAPEDITOR.objectHighlighted) {
    previousHighlightX = MAPEDITOR.objectHighlighted.x
    previousHighlightY = MAPEDITOR.objectHighlighted.y
  }

  MAPEDITOR.objectHighlighted = mouseLocation

  if(MAPEDITOR.objectHighlighted.CREATOR) {
    return
  }

  // find the smallest one stacked up
  let smallestObject = selectionTools.findSmallestObjectInArea(mouseLocation, GAME.objects)

  collisionsUtil.check(mouseLocation, GAME.heroList, (hero) => {
    if (hero.mod().removed) return
    smallestObject = [JSON.parse(JSON.stringify(hero))]
  })

  if(smallestObject.length > 1) MAPEDITOR.objectLayers = smallestObject
  else MAPEDITOR.objectLayers = null

  if(smallestObject.length) MAPEDITOR.objectHighlighted = JSON.parse(JSON.stringify(smallestObject[0]))

  MAPEDITOR.objectHighlightedChildren = []
  if (MAPEDITOR.objectHighlighted.id || MAPEDITOR.objectHighlighted.ownerId) {
    // see if grid high light has children or is child
    const { parent, children } = selectionTools.getObjectRelations(MAPEDITOR.objectHighlighted, GAME)
    if (parent.constructParts) {
      MAPEDITOR.objectHighlighted = parent
    } else if (children.length && parent.id === MAPEDITOR.objectHighlighted.id) {
      MAPEDITOR.objectHighlighted = parent
      MAPEDITOR.objectHighlightedChildren = children
    }
  }

  if((PAGE.role.isAdmin || (GAME.heros[HERO.id] && GAME.heros[HERO.id].flags.showMapHighlight)) && (MAPEDITOR.objectHighlighted.x != previousHighlightX || MAPEDITOR.objectHighlighted.y != previousHighlightY)) {
    // AUDIO.playDebounce(
    //   {
    //     id: 'onMapEditorSwitchNode',
    //     soundId: GAME.theme.audio.onMapEditorSwitchNode,
    //     volume: 0.35,
    //     debounceTime: 25
    //   }
    // )
  }
}

function updateResizingObject(object, options = { allowTiny: false }) {
  const { mousePos } = MAPEDITOR
  if (mousePos.x < object.x || mousePos.y < object.y) {
    return
  }
  object.width = mousePos.x - object.x
  object.height = mousePos.y - object.y

  let tinySize
  if (object.width < GAME.grid.nodeSize - 4 && object.height < GAME.grid.nodeSize - 4 && options.allowTiny) {
    tinySize = object.width
  }

  if (MAPEDITOR.snapToGrid) {
    if (tinySize) {
      gridUtil.snapTinyObjectToGrid(object, tinySize)
    } else {
      gridUtil.snapObjectToGrid(object)
    }
  }
}

function updateDraggingObject(object) {
  const { mousePos } = MAPEDITOR

  const startX = object.x
  const startY = object.y

  object.x = mousePos.x
  object.y = mousePos.y

  let tinySize
  if (object.width < GAME.grid.nodeSize - 4 && object.height < GAME.grid.nodeSize - 4) {
    tinySize = object.width
  }

  if (MAPEDITOR.snapToGrid) {
    if (tinySize) {
      gridUtil.snapTinyObjectToGrid(object, tinySize)
    } else {
      gridUtil.snapObjectToGrid(object)
    }
  }

  const diffX = object.x - startX
  const diffY = object.y - startY

  if (object.constructParts) {
    object.constructParts.forEach((part) => {
      part.x += diffX
      part.y += diffY
      return part
    })
  }

  if (object.pathParts) {
    object.pathParts.forEach((part) => {
      part.x += diffX
      part.y += diffY
      return part
    })
  }
}

global.MAPEDITOR = new MapEditor()
