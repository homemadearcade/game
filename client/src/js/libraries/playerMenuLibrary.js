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
    chooseColor: {
      title: 'Choose Color',
      action: 'select-color',
      dontCloseMenu: true,
    },
    randomizeSprite: {
      title: 'Randomize Sprite',
      action: 'randomize-from-descriptors'
    },
    chooseSprite: {
      title: 'Choose Sprite',
      action: 'choose-from-recommended-sprites',
    },
    drawSprite: {
      title: 'Draw Sprite',
      action: 'open-edit-sprite',
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
      title: 'Describe'
    },
    spriteMenu: {
      useExistingMenu: 'SpriteChoose',
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
      title: 'Draw Structure'
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
    // color: false,
    name: false,
    respawn: false,
    // properties: false,
    descriptors: false,
    spriteMenu: false,
    physicsLive: false,
    dialogue: false,
    dialogueName: false,

    chooseColor: false,
    randomizeSprite: false,
    chooseSprite: false,
    drawSprite: false,
  }

  global.objectMenuLibrary = {
    move: false,
    resize: false,
    copy: false,
    // color: false,
    descriptors: false,
    name: false,
    constructEditor: false,
    dialogue: false,
    dialogueSets: false,
    popover: false,
    group: false,
    // properties: false,
    spriteMenu: false,
    physicsLive: false,

    chooseColor: false,
    randomizeSprite: false,
    chooseSprite: false,
    drawSprite: false,

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
