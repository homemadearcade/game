////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////
///AUDIO
//////////
global.clearAudioTheme = function() {
  global.socket.emit('updateTheme', { audio: global.defaultAudioTheme })
}

global.generateAudioTheme = function(keys) {
  const newAudioTheme = {}
  // const newAudioTheme = {}
  Object.keys(global.generateAudioThemeData).forEach((event) => {
    if(keys && !keys[event]) return
    const eventData = global.generateAudioThemeData[event]

    const index = getRandomInt(0, eventData.length-1)
    const selectedAssets = eventData[index]
    const collection = AUDIO.data[selectedAssets.audioCollection][selectedAssets.folderName]

    const fileIndex = getRandomInt(0, collection.files.length -1)

    // console.log(collection, selectedAssets.audioCollection, selectedAssets.folderName, event)
    const file = collection.files[fileIndex]

    newAudioTheme[event] = file.id
  })

  global.socket.emit('updateTheme', { audio: { ...GAME.theme.audio, ...newAudioTheme} })
}

global.generateAudioThemeData = {
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
      audioCollection: 'moving',
      folderName: 'Dirt footsteps'
    },
  ],
  'heroMoving--concrete': [
    {
      audioCollection: 'moving',
      folderName: 'Concrete footsteps'
    },
  ],
  'heroMoving--glass': [
    {
      audioCollection: 'moving',
      folderName: 'Glass footsteps'
    },
  ],
  'heroMoving--grass': [
    {
      audioCollection: 'moving',
      folderName: 'Grass footsteps'
    },
  ],
  'heroMoving--gravel': [
    {
      audioCollection: 'moving',
      folderName: 'Gravel footsteps'
    },
  ],
  'heroMoving--ice': [
    {
      audioCollection: 'moving',
      folderName: 'Ice footsteps'
    },
  ],
  'heroMoving--metal': [
    {
      audioCollection: 'moving',
      folderName: 'Metal footsteps'
    },
  ],
  'heroMoving--mud': [
    {
      audioCollection: 'moving',
      folderName: 'Mud footsteps'
    },
  ],
  'heroMoving--sand': [
    {
      audioCollection: 'moving',
      folderName: 'Sand footsteps'
    },
  ],
  'heroMoving--snow': [
    {
      audioCollection: 'moving',
      folderName: 'Snow footsteps'
    },
  ],
  'heroMoving--stone': [
    {
      audioCollection: 'moving',
      folderName: 'Stone footsteps'
    },
  ],
  'heroMoving--water': [
    {
      audioCollection: 'moving',
      folderName: 'Wood footsteps'
    },
  ],
  'heroMoving--vehicle': [
    {
      audioCollection: 'moving',
      folderName: 'Motors'
    },
  ],

  /////////////////////////////////////////
  /////////////////////////////////////////
  /////////////////////////////////////////
    // HERO ACTION
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
  onHeroCastSpell: [
    {
      audioCollection: 'retro',
      folderName: 'Cast Spell'
    }
  ],
  onHeroMeleeAttack: [
    {
      audioCollection: 'retro',
      folderName: 'Attack'
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
      folderName: 'Dash'
    }
  ],
  onHeroTeleDash: [
    {
      audioCollection: 'retro',
      folderName: 'Teleport Wrap Effect'
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


  /////////////////////////////////////////
  /////////////////////////////////////////
  /////////////////////////////////////////
  /////////////////////////////////////////

/////////////////////////////////////////
  // OTHER HERO
  onHeroFall: [
    {
      audioCollection: 'retro',
      folderName: 'Fall'
    }
  ],
  onHeroUnlock: [
    {
      audioCollection: 'retro',
      folderName: 'Unlock'
    }
  ],
  onHeroEnterWater: [
    {
      audioCollection: 'retro',
      folderName: 'Water'
    }
  ],

  // onHeroBounce: [
  //   {
  //     audioCollection: 'retro',
  //     folderName: 'Bounce_Jump'
  //   }
  // ],
  'onHeroTouchStart--structure': [
    {
      audioCollection: 'retro',
      folderName: 'Impact'
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

  // onObjectSpawn: [
  //   {
  //     audioCollection: 'retro',
  //     folderName: 'Spawn'
  //   }
  // ],

  onStatusEffect: [
    {
      audioCollection: 'retro',
      folderName: 'Status Effect'
    }
  ],
  onDoorOpen: [
    {
      audioCollection: 'retro',
      folderName: 'Door Open'
    }
  ],
  onDoorClose: [
    {
      audioCollection: 'retro',
      folderName: 'Door Close'
    }
  ],

  ///// UI

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
  onHeroDialogueNext: [
    {
      audioCollection: 'retro',
      folderName: 'UI_Click_(Down)'
    }
  ],
  onHeroOptionComplete: [
    {
      audioCollection: 'retro',
      folderName: 'UI_Click_(Down)'
    }
  ],
  onHeroDialogueStart: [// also onHeroOptionStart
    {
      audioCollection: 'retro',
      folderName: 'UI_Hover_over_button'
    }
  ],
  onHeroCanInteract: [
    {
      audioCollection: 'retro',
      folderName: 'UI_Hover_over_button'
    }
  ],

      // onHeroGameLose: [
      //   {
      //     audioCollection: 'retro',
      //     folderName: 'Game Over'
      //   }
      // ],
      // onHeroGameWin: [
      //   {
      //     audioCollection: 'retro',
      //     folderName: 'Victory'
      //   }
      // ],
  onGameTitleAppears: [
    {
      audioCollection: 'retro',
      folderName: 'Game Starting'
    }
  ],
  onGameStarted: [
    {
      audioCollection: 'retro',
      folderName: 'Game Starting'
    }
  ],

  onPlayerUIMouseOverButton: [
    {
      audioCollection: 'retro',
      folderName: 'UI_Hover_over_button'
    }
  ],
  onPlayerUIMenuOpen: [
    {
      audioCollection: 'retro',
      folderName: 'UI_Popup'
    }
  ],
  // onPlayerUIToast: [
  //   {
  //     audioCollection: 'retro',
  //     folderName: 'UI_Popup'
  //   }
  // ],
}

global.defaultAudioTheme = {
  'heroMoving--retro': null,
  'heroMoving--vehicle': null,
  'heroMoving--dirt': null,
  'heroMoving--concrete': null,
  'heroMoving--glass': null,
  'heroMoving--grass': null,
  'heroMoving--gravel': null,
  'heroMoving--ice': null,
  'heroMoving--metal': null,
  'heroMoving--mud': null,
  'heroMoving--sand': null,
  'heroMoving--snow': null,
  'heroMoving--stone': null,
  'heroMoving--water': null,
  heroShootingLaser: null,
  onHeroShootBullet: null,
  onHeroGroundJump: null,
  onHeroFloatJump: null,
  onHeroDash: null,
  onHeroTeleDash: null,
  onHeroShootLaserTool: null,
  onHeroCastSpell: null,
  onHeroMeleeAttack: null,
  onHeroFall: null,
  onStatusEffect: null,
  onHeroUnlock: null,
  onHeroEnterWater: null,
  onDoorOpen: null,
  onDoorClose: null,
  onGameStarted: null,
  'onObjectDestroyed--big': null,
  'onObjectDestroyed--small': null,
  onHeroDrop: null,
  onHeroPickup: null,
  onHeroEquip: null,
  onModEnabled: null,
  onModDisabled: null,

  onHeroDialogueStart: null,
  onHeroDialogueNext: null,
  onHeroOptionComplete: null,
  onHeroOptionStart: null,
  onHeroCanInteract: null,

  onHeroRespawn: null,

  onPlayerUIMouseOverButton: null,
  onPlayerUIMenuOpen: null,
  // onPlayerUIMenuClick: 'assets/audio/UI/HA/Click sounds 6.wav',
  onPlayerUIToast: null,
  onMapEditorSwitchNode: null,
  onGameTitleAppears: 'assets/audio/retro/Game Starting/Game Starting 6.wav',
  // onPlayerUIMouseOverButton: 'assets/audio/UI/HA/Hover over button sound 1.wav',
  // onPlayerUIMenuOpen: 'assets/audio/UI/HA/Notification sound 5.wav',
  // // onPlayerUIMenuClick: 'assets/audio/UI/HA/Click sounds 6.wav',
  // onPlayerUIToast: 'assets/audio/UI/HA/Notification sound 4.wav',
  // onMapEditorSwitchNode: 'assets/audio/UI/HA/Switch sounds 18.wav',

  onHeroStartQuest: null,//do
  onHeroCompleteQuest: null,//do

  onHeroGameLose: null,//do
  onHeroGameWin: null,//do
  'onHeroTouchStart--structure':null,
  // onObjectSpawn: '',

  // UNKNOWN SOUNDS
  // onPlayerUIMenuClose: '',
  // onHeroDialogueComplete: ,
  // onObjectTalk: null, //cute or evil short noise... or a book or a sign makes a different noise?

  // onObjectAware: null,// of hero, exclamation

  // onHeroBounce: null,

  // onHeroDragObject: null,
  // onHeroTurnAround: null,

  // onHeroHeadHit? so all platformers get that idea?

  // onGamePaused: null,
  // onGameResume: null,

  // going upstairs
  // going downstars
  // ladder
}
