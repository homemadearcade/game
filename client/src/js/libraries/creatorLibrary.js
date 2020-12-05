import gridUtil from '../utils/grid.js'

function constructEditorOnSelect(objectId, tags) {
  if(GAME.objectsById[objectId]) {
    MAPEDITOR.openConstructEditor(GAME.objectsById[objectId], EDITOR.preferences.creatorColorSelected, true)
  } else {
    const globalConstructStationaryObstacle = {reserved: true, x: 0, y: 0, width: GAME.grid.width, height: GAME.grid.height, tags, constructParts: [], id: objectId}
    OBJECTS.create(globalConstructStationaryObstacle)
    MAPEDITOR.openConstructEditor(globalConstructStationaryObstacle, EDITOR.preferences.creatorColorSelected, true)
  }
  const removeListener = window.local.on('onConstructEditorClose', () => {
    setTimeout(() => {
      this.setState({
        creatorObjectSelected: {}
      })
    }, 200)
    removeListener()
  })
}

function toggleMod(modId) {
  let objectId = null
  return {
    onShiftClick: () => {
      const json = window.modLibrary[modId].effectJSON
      window.socket.emit('editHero', { id: HERO.editingId || HERO.id, ...json})
    },
    onToggleOn: () => {
      const libraryMod = window.modLibrary[modId]
      const mod = {
        ownerId: objectId || HERO.editingId || HERO.id,
        manualRevertId: modId,
        ...libraryMod
      }
      window.socket.emit('startMod', mod)
      window.socket.emit('resetPhysicsProperties', objectId || HERO.editingId || HERO.id)
    },
    onToggleOff: () => {
      window.socket.emit('endMod', modId)
      window.socket.emit('resetPhysicsProperties', objectId || HERO.editingId || HERO.id)
    }
  }
}

function toggleSubObject(subObjectId, modId) {
  let objectId = null
  return {
    onToggleOn: () => {
      const so = _.cloneDeep(window.subObjectLibrary.addGameLibrary()[subObjectId])
      so.tags.startsEquipped = true
      window.socket.emit('addSubObject', GAME.heros[HERO.editingId || HERO.id], so, subObjectId)
    },
    onToggleOff: () => {
      window.socket.emit('deleteSubObject', GAME.heros[HERO.editingId || HERO.id], subObjectId)
    }
  }
}

function onFirstPageGameLoaded() {
  window.creatorLibrary = {
    selectColor: {
      specialAction: 'selectColor',
    },
    selectSprite: {
      specialAction: 'selectSprite',
    },
    drawStructure: {
      label: 'Structure',
      columnName: 'Draw',
      onSelect: function() {
        constructEditorOnSelect.call(this, 'globalConstructStationaryObstacle', { obstacle: true,})
      }
    },
    drawBackground: {
      label: 'Background',
      columnName: 'Draw',
      onSelect: function() {
        constructEditorOnSelect.call(this, 'globalConstructStationaryBackground', { background: true, notInCollisions: true })
      }
    },
    drawForeground: {
      label: 'Foreground',
      columnName: 'Draw',
      onSelect: function() {
        constructEditorOnSelect.call(this, 'globalConstructStationaryForeground', { foreground: true, notInCollisions: true })
      }
    },
    background: {
      label: 'Background',
      columnName: 'Objects',
      libraryName:'objectLibrary',
      libraryId:'background',
      JSON: window.objectLibrary.background,
    },
    obstacle: {
      label: 'Obstacle',
      columnName: 'Objects',
      libraryName:'objectLibrary',
      libraryId:'obstacle',
      JSON: window.objectLibrary.default,
    },
    foreground: {
      label: 'Foreground',
      columnName: 'Objects',
      libraryName:'objectLibrary',
      libraryId:'foreground',
      JSON: window.objectLibrary.foreground,
    },
    welcomer: {
      label: 'Welcomer',
      columnName: 'NPCs',
      libraryName:'objectLibrary',
      libraryId:'welcomer',
      JSON: window.objectLibrary.welcomer,
    },
    standingNPC: {
      label: 'Standing',
      columnName: 'NPCs',
      libraryName:'objectLibrary',
      libraryId:'standingNPC',
      JSON: window.objectLibrary.standingNPC,
    },
    wanderingNPC: {
      label: 'Wandering',
      columnName: 'NPCs',
      libraryName:'objectLibrary',
      libraryId:'wanderingNPC',
      JSON: window.objectLibrary.wanderingNPC,
    },
    light: {
      label: 'Medium  Light',
      columnName: 'Lights',
      libraryName:'objectLibrary',
      libraryId:'light',
      JSON: window.objectLibrary.light,
    },
    fire: {
      label: 'Fire',
      columnName: 'Lights',
      libraryName:'objectLibrary',
      libraryId:'fire',
      JSON: window.objectLibrary.fire,
    },
    spawnZone: {
      label: 'Spawn Zone',
      columnName: 'Zones',
      libraryName:'objectLibrary',
      libraryId:'spawnZone',
      JSON: window.objectLibrary.spawnZone,
      // onCreateObject: (object) => {
      //   window.socket.emit('addSubObject', object, { tags: { potential: true } }, 'spawner')
      // },
    },
    resourceZone: {
      label: 'Resource Zone',
      columnName: 'Zones',
      libraryName:'objectLibrary',
      libraryId:'resourceZone',
      JSON: window.objectLibrary.resourceZone
    },
    resource: {
      label: 'Resource',
      columnName: 'Items',
      libraryName:'objectLibrary',
      libraryId:'items',
      JSON: window.objectLibrary.resource
    },
    chest: {
      label: 'Chest',
      columnName: 'Items',
      libraryName:'objectLibrary',
      libraryId:'chest',
      JSON: window.objectLibrary.chest,
    },
    homing: {
      label: 'Homing',
      columnName: 'Monsters',
      libraryName:'objectLibrary',
      libraryId:'homing',
      JSON: window.objectLibrary.homing,
    },
    spin: {
      label: 'Spin',
      columnName: 'Hero',
      toggleId: 'heroSpin',
      libraryName:'modLibrary',
      libraryId:'spin',
      ...toggleMod('spin')
    },
    mario: {
      label: 'Mario',
      columnName: 'Hero',
      columnExclusiveToggle: true,
      toggleId: 'mario',
      libraryName:'modLibrary',
      libraryId:'mario',
      ...toggleMod('mario')
    },
    kirby: {
      label: 'Kirby',
      columnName: 'Hero',
      columnExclusiveToggle: true,
      toggleId: 'kirby',
      libraryName:'modLibrary',
      libraryId:'kirby',
      ...toggleMod('kirby')
    },
    zelda: {
      label: 'Zelda',
      columnName: 'Hero',
      columnExclusiveToggle: true,
      toggleId: 'zelda',
      libraryName:'modLibrary',
      libraryId:'zelda',
      ...toggleMod('zelda')
    },
    ufo: {
      label: 'UFO',
      columnName: 'Hero',
      columnExclusiveToggle: true,
      toggleId: 'ufo',
      libraryName:'modLibrary',
      libraryId:'ufo',
      ...toggleMod('ufo')
    },
    asteroids: {
      label: 'Asteroids',
      columnName: 'Hero',
      columnExclusiveToggle: true,
      toggleId: 'asteroids',
      libraryName:'modLibrary',
      libraryId:'asteroids',
      ...toggleMod('asteroids')
    },
    car: {
      label: 'Car',
      columnName: 'Hero',
      columnExclusiveToggle: true,
      toggleId: 'car',
      libraryName:'modLibrary',
      libraryId:'car',
      ...toggleMod('car')
    },
    snake: {
      label: 'Snake',
      columnName: 'Hero',
      columnExclusiveToggle: true,
      toggleId: 'snake',
      libraryName:'modLibrary',
      libraryId:'snake',
      ...toggleMod('snake')
    },
    spear: {
      label: 'Spear',
      columnName: 'Equip',
      toggleId: 'spear',
      libraryName:'subObjectLibrary',
      libraryId:'spear',
      ...toggleSubObject('spear')
    },
    spearToggleable: {
      label: 'Spear Toggle',
      columnName: 'Equip',
      toggleId: 'spearToggleable',
      libraryName:'subObjectLibrary',
      libraryId:'spearToggleable',
      ...toggleSubObject('spearToggleable')
    },
    spearDialogueChoice: {
      label: 'Spear Choice',
      columnName: 'Equip',
      toggleId: 'spearDialogueChoice',
      libraryName:'subObjectLibrary',
      libraryId:'spearDialogueChoice',
      ...toggleSubObject('spearDialogueChoice')
    },
    gun: {
      label: 'Gun',
      columnName: 'Equip',
      toggleId: 'gun',
      libraryName:'subObjectLibrary',
      libraryId:'gun',
      ...toggleSubObject('gun')
    },
    fireballGun: {
      label: 'Fireball Gun',
      columnName: 'Equip',
      toggleId: 'fireballGun',
      libraryName:'subObjectLibrary',
      libraryId:'fireballGun',
      ...toggleSubObject('fireballGun')
    },
    randomGun: {
      label: 'Random Gun',
      columnName: 'Equip',
      toggleId: 'randomGun',
      libraryName:'subObjectLibrary',
      libraryId:'randomGun',
      ...toggleSubObject('randomGun')
    },
    shrinkRay: {
      label: 'Shrink Ray',
      columnName: 'Equip',
      toggleId: 'shrinkRay',
      libraryName:'subObjectLibrary',
      libraryId:'shrinkRay',
      ...toggleSubObject('shrinkRay')
    },
    bombs: {
      label: 'Bombs',
      columnName: 'Equip',
      toggleId: 'bombs',
      libraryName:'subObjectLibrary',
      libraryId:'bombs',
      ...toggleSubObject('bombs')
    },
    zeldaPowerBlock: {
      label: 'Zelda',
      columnName: 'Blocks',
      libraryName:'objectLibrary',
      libraryId:'zeldaPowerBlock',
      JSON: window.objectLibrary.zeldaPowerBlock,
    },
    marioPowerBlock: {
      label: 'Mario',
      columnName: 'Blocks',
      libraryName:'objectLibrary',
      libraryId:'marioPowerBlock',
      JSON: window.objectLibrary.marioPowerBlock,
    },
    asteroidsPowerBlock: {
      label: 'Asteroids',
      columnName: 'Blocks',
      libraryName:'objectLibrary',
      libraryId:'asteroidsPowerBlock',
      JSON: window.objectLibrary.asteroidsPowerBlock,
    },
    ufoPowerBlock: {
      label: 'UFO',
      columnName: 'Blocks',
      libraryName:'objectLibrary',
      libraryId:'ufoPowerBlock',
      JSON: window.objectLibrary.ufoPowerBlock,
    },
    starViewBlock: {
      label: 'Star View',
      columnName: 'Blocks',
      libraryName:'objectLibrary',
      libraryId:'starViewBlock',
      JSON: window.objectLibrary.starViewBlock,
    },
    roof: {
      label: 'Roof',
      columnName: 'Basic',
      libraryName:'objectLibrary',
      libraryId:'roof',
      JSON: window.objectLibrary.roof,
    },
    // gunPickupable: {
    //   label: 'Gun',
    //   columnName: 'Items',
    //   JSON: window.subObjectLibrary.gun,
    // },
    // spearPickupable: {
    //   label: 'Spear',
    //   columnName: 'Items',
    //   JSON: window.subObjectLibrary.spear,
    // },
    // marioCap: {
    //   label: 'Mario Hat',
    //   columnName: 'Items',
    //   JSON: window.subObjectLibrary.marioCap,
    // },
    seeHiddenPower: {
      label: 'Uncoverer',
      columnName: 'Equip',
      toggleId: 'uncoverer',
      libraryName:'subObjectLibrary',
      libraryId:'seeHiddenPower',
      ...toggleSubObject('seeHiddenPower')
    },
    seeThroughForegroundPower: {
      label: 'Spyglass',
      columnName: 'Equip',
      toggleId: 'spyglass',
      libraryName:'subObjectLibrary',
      libraryId:'seeThroughForegroundPower',
      ...toggleSubObject('seeThroughForegroundPower')
    },
    evidenceChain1: {
      label: 'Evidence Chain',
      columnName: 'Equip',
      toggleId: 'evidenceChain1',
      libraryName:'subObjectLibrary',
      libraryId:'evidenceChain1',
      ...toggleSubObject('evidenceChain1')
    },
    evidenceChain2: {
      label: 'Evidence Chain 2',
      columnName: 'Equip',
      toggleId: 'evidenceChain2',
      libraryName:'subObjectLibrary',
      libraryId:'evidenceChain2',
      ...toggleSubObject('evidenceChain2')
    },
    engineTrail: {
      label: 'Engine Trail',
      columnName: 'Equip',
      toggleId: 'engineTrail',
      libraryName:'subObjectLibrary',
      libraryId:'engineTrail',
      ...toggleSubObject('engineTrail')
    },
  }

  window.homemadearcadeBasicLibrary = {
    selectColor: false,
    selectSprite: false,
    // drawStructure: false,
    // drawBackground: false,
    // drawForeground: false,
    background: false,
    obstacle: false,
    foreground: false,
    // obstacle: false,
    // roof: true,
    standingNPC: false,
    wanderingNPC: false,
    // spin: true,
    // mario: true,
    // zelda: true,
    // asteroids: true,
    // car: true,
    // ufo: true,
    // kirby: true,
    // snake: true,
    // spear: true,
    // gun: true,
  }

  window.adminCreatorObjects = {
    selectColor: true,
    selectSprite: true,
    // drawStructure: true,
    // drawBackground: true,
    // drawForeground: true,
    // roof: true,
    // obstacle: true,
    // light: true,
    // fire: true,
    // spawnZone: true,
    // resourceZone: true,
    // resource: true,
    homing: true,
    // chest: true,
    standingNPC: true,
    wanderingNPC: true,
    welcomer: true,
    spin: true,
    mario: true,
    zelda: true,
    asteroids: true,
    car: true,
    ufo: true,
    kirby: true,
    snake: true,
    spear: true,
    spearToggleable: true,
    spearDialogueChoice: true,
    gun: true,
    fireballGun: true,
    randomGun: true,
    shrinkRay: true,
    bombs: true,
    seeThroughForegroundPower: true,
    seeHiddenPower: true,
    zeldaPowerBlock: true,
    marioPowerBlock: true,
    asteroidsPowerBlock: true,
    ufoPowerBlock: true,
    starViewBlock: true,

    evidenceChain1: true,
    // evidenceChain2: true,

    engineTrail: true,
    // marioCap: true,
    // gunPickupable: true,
    // spearPickupable: true,
  }

  window.creatorLibrary.addGameLibrary = function() {
    if(GAME.library.creator) {
      return {
        ...GAME.library.creator,
        ...window.creatorLibrary,
      }
    } else {
      return window.creatorLibrary
    }
  }
}

export default {
  onFirstPageGameLoaded
}
