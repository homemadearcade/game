import gridUtil from '../utils/grid.js'

function constructEditorOnSelect(objectId, tags) {
  if(GAME.objectsById[objectId]) {
    MAPEDITOR.openConstructEditor(GAME.objectsById[objectId], EDITOR.preferences.creatorColorSelected, true)
  } else {
    const globalConstructStationaryObstacle = {reserved: true, x: 0, y: 0, width: GAME.grid.width, height: GAME.grid.height, tags, constructParts: [], id: objectId}
    OBJECTS.create(globalConstructStationaryObstacle)
    MAPEDITOR.openConstructEditor(globalConstructStationaryObstacle, EDITOR.preferences.creatorColorSelected, true)
  }
  const removeListener = global.local.on('onConstructEditorClose', () => {
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
      const json = global.modLibrary[modId].effectJSON
      global.socket.emit('editHero', { id: HERO.editingId || HERO.id, ...json})
    },
    onToggleOn: () => {
      const libraryMod = global.modLibrary[modId]
      const mod = {
        ownerId: objectId || HERO.editingId || HERO.id,
        manualRevertId: modId,
        ...libraryMod
      }
      global.socket.emit('startMod', mod)
      global.socket.emit('resetPhysicsProperties', objectId || HERO.editingId || HERO.id)
    },
    onToggleOff: () => {
      global.socket.emit('endMod', modId)
      global.socket.emit('resetPhysicsProperties', objectId || HERO.editingId || HERO.id)
    }
  }
}

function toggleSubObject(subObjectId, modId) {
  let objectId = null
  return {
    onShiftToggleOn: () => {
      const so = _.cloneDeep(global.subObjectLibrary.addGameLibrary()[subObjectId])
      so.tags.startsEquipped = true
      global.socket.emit('addSubObject', GAME.heros[HERO.editingId || HERO.id], so, subObjectId)
    },
    onShiftToggleOff: () => {
      global.socket.emit('deleteSubObject', GAME.heros[HERO.editingId || HERO.id], subObjectId)
    }
  }
}

function onFirstPageGameLoaded() {
  global.creatorLibrary = {
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
    },
    obstacle: {
      label: 'Obstacle',
      columnName: 'Objects',
      libraryName:'objectLibrary',
      libraryId:'obstacle',
    },
    foreground: {
      label: 'Foreground',
      columnName: 'Objects',
      libraryName:'objectLibrary',
      libraryId:'foreground',
    },
    welcomer: {
      label: 'Welcomer',
      columnName: 'NPCs',
      libraryName:'objectLibrary',
      libraryId:'welcomer',
    },
    standingNPC: {
      label: 'Standing',
      columnName: 'NPCs',
      libraryName:'objectLibrary',
      libraryId:'standingNPC',
    },
    wanderingNPC: {
      label: 'Wandering',
      columnName: 'NPCs',
      libraryName:'objectLibrary',
      libraryId:'wanderingNPC',
    },
    light: {
      label: 'Medium  Light',
      columnName: 'Lights',
      libraryName:'objectLibrary',
      libraryId:'light',
    },
    fire: {
      label: 'Fire',
      columnName: 'Lights',
      libraryName:'objectLibrary',
      libraryId:'fire',
    },
    spawnZone: {
      label: 'Spawn Zone',
      columnName: 'Zones',
      libraryName:'objectLibrary',
      libraryId:'spawnZone',
      // onCreateObject: (object) => {
      //   global.socket.emit('addSubObject', object, { tags: { potential: true } }, 'spawner')
      // },
    },
    resourceZone: {
      label: 'Resource Zone',
      columnName: 'Zones',
      libraryName:'objectLibrary',
      libraryId:'resourceZone',
    },
    resource: {
      label: 'Resource',
      columnName: 'Items',
      libraryName:'objectLibrary',
      libraryId:'items',
    },
    chest: {
      label: 'Chest',
      columnName: 'Items',
      libraryName:'objectLibrary',
      libraryId:'chest',
    },
    homing: {
      label: 'Homing',
      columnName: 'Monsters',
      libraryName:'objectLibrary',
      libraryId:'homing',
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
    jetpack: {
      label: 'Jetpack',
      columnName: 'Hero',
      columnExclusiveToggle: true,
      toggleId: 'jetpack',
      libraryName:'modLibrary',
      libraryId:'jetpack',
      ...toggleMod('jetpack')
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
    sword: {
      label: 'Sword',
      columnName: 'Equip',
      toggleId: 'sword',
      libraryName:'subObjectLibrary',
      libraryId:'sword',
      ...toggleSubObject('sword')
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
    richochetGun: {
      label: 'Richochet Gun',
      columnName: 'Equip',
      toggleId: 'richochetGun',
      libraryName:'subObjectLibrary',
      libraryId:'richochetGun',
      ...toggleSubObject('richochetGun')
    },
    randomGun: {
      label: 'Random Gun',
      columnName: 'Equip',
      toggleId: 'randomGun',
      libraryName:'subObjectLibrary',
      libraryId:'randomGun',
      ...toggleSubObject('randomGun')
    },
    randomLaser: {
      label: 'Random Laser',
      columnName: 'Equip',
      toggleId: 'randomLaser',
      libraryName:'subObjectLibrary',
      libraryId:'randomLaser',
      ...toggleSubObject('randomLaser')
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
    },
    marioPowerBlock: {
      label: 'Mario',
      columnName: 'Blocks',
      libraryName:'objectLibrary',
      libraryId:'marioPowerBlock',
    },
    asteroidsPowerBlock: {
      label: 'Asteroids',
      columnName: 'Blocks',
      libraryName:'objectLibrary',
      libraryId:'asteroidsPowerBlock',
    },
    ufoPowerBlock: {
      label: 'UFO',
      columnName: 'Blocks',
      libraryName:'objectLibrary',
      libraryId:'ufoPowerBlock',
    },
    starViewBlock: {
      label: 'Star View',
      columnName: 'Blocks',
      libraryName:'objectLibrary',
      libraryId:'starViewBlock',
    },
    roof: {
      label: 'Roof',
      columnName: 'Basic',
      libraryName:'objectLibrary',
      libraryId:'roof',
    },
    // gunPickupable: {
    //   label: 'Gun',
    //   columnName: 'Items',
    // },
    // spearPickupable: {
    //   label: 'Spear',
    //   columnName: 'Items',
    // },
    // marioCap: {
    //   label: 'Mario Hat',
    //   columnName: 'Items',
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

  global.homemadearcadeBasicLibrary = {
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

  global.adminCreatorObjects = {
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
    richochetGun: true,
    jetpack: true,
    zelda: true,
    asteroids: true,
    car: true,
    ufo: true,
    kirby: true,
    snake: true,
    sword: true,
    spear: true,
    // spearToggleable: true,
    // spearDialogueChoice: true,
    gun: true,
    fireballGun: true,
    // randomGun: true,
    // randomLaser: true,
    shrinkRay: true,
    bombs: true,
    // seeThroughForegroundPower: true,
    // seeHiddenPower: true,
    zeldaPowerBlock: true,
    marioPowerBlock: true,
    asteroidsPowerBlock: true,
    ufoPowerBlock: true,
    starViewBlock: true,

    // evidenceChain1: true,
    // evidenceChain2: true,

    engineTrail: true,
    // marioCap: true,
    // gunPickupable: true,
    // spearPickupable: true,
  }

  global.creatorLibrary.addGameLibrary = function() {
    if(GAME.library.creator) {
      return {
        ...global.creatorLibrary,
        ...GAME.library.creator,
        addGameLibrary: null
      }
    } else {
      return global.creatorLibrary
    }
  }
}

export default {
  onFirstPageGameLoaded
}
