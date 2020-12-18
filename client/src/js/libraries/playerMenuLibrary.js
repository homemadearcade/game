global.local.on('onGameReady', () => {
  global.playerMenuLibrary = {
    // create: {
    //   useExistingMenu: 'PlayerCreateObject',
    //   title: 'Create'
    // },
    move: {
      action: 'drag', // set key={action} and see how keys are used ---- see key === drag in the objectContextMenu. Basically _handleMenuClick should have a million little actions you can choose from. It would be good to grab these actions from the various menus already existing
      title: 'Move' // The text that you see on the right click menu
    },
    resize: {
      action: 'resize',
      title: 'Resize',
    },
    copy: {
      action: 'copy',
      title: 'Duplicate',
    },
    delete: {
      action: 'delete',
      title: 'Delete',
    },
    respawn: {
      action: 'respawn',
      title: 'Respawn',
    },
    color: {
      useExistingMenu: 'Color',
      title: 'Color'
    },
    name: {
      useExistingMenu: 'Name',
      title: 'Name'
    },
    dialogue: {
      useExistingMenu: 'Dialogue',
      title: 'Dialogue'
    },
    dialogueSets: {
      useExistingMenu: 'DialogueSets',
      title: 'Dialogue Sets'
    },
    popover: {
      useExistingMenu: 'Popover',
      title: 'Popover'
    },
    // properties: {
    //   useExistingMenu: 'Properties',
    //   title: 'Properties'
    // },
    descriptors: {
      action: 'edit-descriptors',
      title: 'Edit Descriptors'
    },
    spriteChooser: {
      useExistingMenu: 'Sprite',
      title: 'Sprite'
    },
    physicsLive: {
      action: 'open-physics-live-menu',
      title: 'Physics'
    },
    pathEditor: {
      action: 'open-path-editor',
      title: 'Path'
    },
    constructEditor: {
      action: 'open-construct-editor',
      title: 'Draw'
    },
    group: {
      useExistingMenu: 'GameTag',
      title: 'Group'
    },
    backgroundColor: {
      action: 'select-world-background-color',
      title: 'World Background Color',
      dontCloseMenu: true,
    }
  }

  global.heroFlags = {
    paused: false,
    isAdmin: false,
    // showScore: false,
    // showDialogue: false,
    // showLives: false,
    showMapHighlight: false,
    showOtherUsersMapHighlight: false,
    constructEditorColor: false,
    constructEditorSprite: false,
    allowObjectSelection: false,
    canStartStopGame: false,
    canTakeMapSnapshots: false,
    hasManagementToolbar: false,
    showBrandImageScreen: false,
    editAllowedWhenGameStarted: false,
    canZoomInAndOut: false,
  }

  global.heroMenuLibrary = {
    move: false,
    resize: false,
    color: false,
    name: false,
    respawn: false,
    // properties: false,
    descriptors: false,
    spriteChooser: false,
    physicsLive: false,
    dialogue: false,
    dialogueName: false,
  }

  global.objectMenuLibrary = {
    move: false,
    resize: false,
    copy: false,
    color: false,
    descriptors: false,
    name: false,
    constructEditor: false,
    dialogue: false,
    dialogueSets: false,
    popover: false,
    group: false,
    // properties: false,
    spriteChooser: false,
    physicsLive: false,

    // pathEditor: false,
    delete: false,
  }

  global.worldMenuLibrary = {
    // create: false,
    backgroundColor: false,
  }

  global.spriteSheetLibrary = _.cloneDeep(global.spriteSheetIds)
  Object.keys(global.spriteSheetLibrary).forEach((ssId) => {
    global.spriteSheetLibrary[ssId] = false
  })
})
