window.generateAudioThemeData = {
  'heroMoving--retro': [
    // {
    //   audioCollection: 'retro',
    //   folderName: 'Footsteps (Player)'
    // },
    {
      audioCollection: 'retro',
      folderName: 'Monster Footsteps'
    },
    {
      audioCollection: 'retro',
      folderName: 'Small Creature Footsteps'
    },
    // {
    //   audioCollection: 'retro',
    //   folderName: 'Boss Footsteps'
    // }
  ],
  'heroMoving--dirt': [
    {
      audioCollection: 'retro',
      folderName: 'Monster Footsteps'
    },
    {
      audioCollection: 'retro',
      folderName: 'Small Creature Footsteps'
    },
  ],
  heroShootingLaser: [
    {
      audioCollection: 'retro',
      folderName: 'Laser Beam (Loop)'
    }
  ],
  onHeroShootBullet: [
    {
      audioCollection: 'retro',
      folderName: 'Shooting Gun'
    }
  ],
  onHeroShootLaserTool: [
    {
      audioCollection: 'retro',
      folderName: 'Shooting Laser Gun'
    }
  ],
  onHeroGroundJump: [
    {
      audioCollection: 'retro',
      folderName: 'Bounce_Jump'
    }
  ],
  onHeroFloatJump: [
    {
      audioCollection: 'retro',
      folderName: 'Bounce_Jump'
    }
  ],
  onHeroDash: [
    {
      audioCollection: 'retro',
      folderName: 'Bounce_Jump'
    }
  ],
  onHeroTeleDash: [
    {
      audioCollection: 'retro',
      folderName: 'Teleport Wrap Effect'
    }
  ],
  onHeroBounce: [
    {
      audioCollection: 'retro',
      folderName: 'Bounce_Jump'
    }
  ],
  onHeroTouchStart: [
    {
      audioCollection: 'retro',
      folderName: 'Kick'
    }
  ],
  onGameStarted: [
    {
      audioCollection: 'retro',
      folderName: 'Game Starting'
    }
  ],
  'onObjectDestroyed--big': [
    {
      audioCollection: 'retro',
      folderName: 'Explosion'
    }
  ],
  'onObjectDestroyed--small': [
    {
      audioCollection: 'retro',
      folderName: 'Monster Takes Damage'
    },
    {
      audioCollection: 'retro',
      folderName: 'Explosion (Short)'
    }
  ],
  onHeroDrop: [
    {
      audioCollection: 'retro',
      folderName: 'Throwing Item'
    }
  ],
  onHeroPickup: [
    {
      audioCollection: 'retro',
      folderName: 'Item Pickup'
    }
  ],
  onHeroEquip: [
    {
      audioCollection: 'retro',
      folderName: 'Item Pickup'
    }
  ],
  onModEnabled: [
    {
      audioCollection: 'retro',
      folderName: 'Buff_Power Up'
    }
  ],
  onModDisabled: [
    {
      audioCollection: 'retro',
      folderName: 'Debuff_Power Down'
    }
  ],
  onHeroRespawn: [
    {
      audioCollection: 'retro',
      folderName: 'Death Sound'
    }
  ],
  
  onHeroStartQuest: [
    {
      audioCollection: 'retro',
      folderName: 'Quest Accepted'
    }
  ],
  onHeroCompleteQuest: [
    {
      audioCollection: 'retro',
      folderName: 'Quest Completed'
    }
  ],

  onHeroGameLose: [
    {
      audioCollection: 'retro',
      folderName: 'Game Over'
    }
  ],
  onHeroGameWin: [
    {
      audioCollection: 'retro',
      folderName: 'Victory'
    }
  ],

  onObjectSpawn: [
    {
      audioCollection: 'retro',
      folderName: 'Spawn'
    }
  ],

  onHeroDialogueNext: [
    {
      audioCollection: 'retro',
      folderName: 'UI Keydown'
    }
  ],
  onHeroChooseOption: [
    {
      audioCollection: 'retro',
      folderName: 'UI Keydown'
    }
  ],
  onHeroDialogueStart: [
    {
      audioCollection: 'retro',
      folderName: 'UI Available'
    }
  ],
  onObjectInteractable: [
    {
      audioCollection: 'retro',
      folderName: 'UI Available'
    }
  ],
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

window.generateAudioTheme = function() {
  const newAudioTheme = _.cloneDeep(window.defaultAudioTheme)
  Object.keys(window.generateAudioThemeData).forEach((event) => {
    const eventData = window.generateAudioThemeData[event]

    const index = getRandomInt(0, eventData.length-1)
    const selectedAssets = eventData[index]
    const collection = AUDIO.data[selectedAssets.audioCollection][selectedAssets.folderName]

    const fileIndex = getRandomInt(0, collection.files.length -1)

    const file = collection.files[fileIndex]

    newAudioTheme[event] = file.id
  })

  window.socket.emit('updateTheme', { audio: newAudioTheme })
}


window.defaultAudioTheme = {
  'heroMoving--retro': null,
  'heroMoving--vehicle': null,
  'heroMoving--dirt': null,
  heroShootingLaser: null,
  onHeroShootBullet: null,
  onHeroShootLaserTool: null,
  onHeroGroundJump: null,
  onHeroFloatJump: null,
  onHeroDash: null,
  onHeroTeleDash: null,
  onHeroBounce: null,
  onGameStarted: null,
  'onObjectDestroyed--big': null,
  'onObjectDestroyed--small': null,
  onHeroDrop: null,
  onHeroPickup: null,
  onHeroEquip: null,
  onModEnabled: null,
  onModDisabled: null,

  onHeroRespawn: null,

  onHeroStartQuest: null,
  onHeroCompleteQuest: null,

  onHeroGameLose: null,
  onHeroGameWin: null,

  onObjectSpawn: null,

  onHeroDialogueStart: null,
  onHeroDialogueNext: null,
  onHeroDialogueComplete: null,
  onHeroChooseOption: null,
  onHeroOptionStart: null,

  onPlayerUIMouseOverButton: 'hover over button sound 1',
  onPlayerUIMenuOpen: 'notification sound 5',
  onPlayerUIMenuClick: 'click sounds 6',
  onPlayerUIToast: 'notification sound 4',
  onMapEditorSwitchNode: 'switch sounds 18',

  // UNKNOWN SOUNDS
  // onPlayerUIMenuClose: '',
  // onHeroDialogueComplete: ,
  // onObjectTalk: null, //cute or evil short noise... or a book or a sign makes a different noise?

  // 'heroMoving--grass': null,
  // 'heroMoving--wood': null,
  // 'heroMoving--swimming': null,

  // onObjectAware: null,// of hero, exclamation
  // onHeroTouchStart: null, //hits obstacle!

  // onHeroDragObject: null,
  // onHeroTurnAround: null,

  // heroFalling: null, //if hero hit max velocity via gravity..?

  // onGamePaused: null,
  // onGameResume: null,
}
