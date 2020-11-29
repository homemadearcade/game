//particles
// special explosion tags... for CRAZY particles. Overall having some objects tagged as like special particle explosion1,2,3 or special heroTouchStartParticle1,2,3
// hero walking on certain objects??
// i mean what other particles are there besides explosions and the ELEMENTS?
// POWERUPS...
// funny thing with particle landing... LOL even if you land on a LIVE DUDE ASS u skim off some of his particles. Ill need a quality tag for 'earth' vs 'human' or something like. 'scrapeable?'

// if an object falls on the edge of another object, show the scrape!

// object jump squeeze thing, ( with and height anim )

// audio
// the ability to give power ups their own NOISES and various objects their own VOICES
// randomize specific parts of the theme

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
      audioCollection: 'moving',
      folderName: 'Dirt footsteps'
    },
  ],
  'heroMoving--vehicle': [
    {
      audioCollection: 'moving',
      folderName: 'Motors'
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
  // onHeroShootLaserTool: [
  //   {
  //     audioCollection: 'retro',
  //     folderName: 'Shooting Laser Gun'
  //   }
  // ],
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
  // onHeroBounce: [
  //   {
  //     audioCollection: 'retro',
  //     folderName: 'Bounce_Jump'
  //   }
  // ],
  // onHeroTouchStart: [
  //   {
  //     audioCollection: 'retro',
  //     folderName: 'Kick'
  //   }
  // ],
  onStartPregame: [
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

  // onObjectSpawn: [
  //   {
  //     audioCollection: 'retro',
  //     folderName: 'Spawn'
  //   }
  // ],

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

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

window.clearAudioTheme = function() {
  window.socket.emit('updateTheme', { audio: window.defaultAudioTheme })
}

window.generateAudioTheme = function() {
  const newAudioTheme = _.cloneDeep(window.defaultAudioTheme)
  // const newAudioTheme = {}
  Object.keys(window.generateAudioThemeData).forEach((event) => {
    const eventData = window.generateAudioThemeData[event]

    const index = getRandomInt(0, eventData.length-1)
    const selectedAssets = eventData[index]
    const collection = AUDIO.data[selectedAssets.audioCollection][selectedAssets.folderName]

    const fileIndex = getRandomInt(0, collection.files.length -1)

    console.log(collection, selectedAssets.audioCollection, selectedAssets.folderName, event)
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

  onPlayerUIMouseOverButton: 'assets/audio/UI/HA/Hover over button sound 1.wav',
  onPlayerUIMenuOpen: 'assets/audio/UI/HA/Notification sound 5.wav',
  // onPlayerUIMenuClick: 'assets/audio/UI/HA/Click sounds 6.wav',
  onPlayerUIToast: 'assets/audio/UI/HA/Notification sound 4.wav',
  onMapEditorSwitchNode: 'assets/audio/UI/HA/Switch sounds 18.wav',

  onHeroStartQuest: null,//do
  onHeroCompleteQuest: null,//do

  onHeroGameLose: null,//do
  onHeroGameWin: null,//do

  // onObjectSpawn: null,

  // UNKNOWN SOUNDS
  // onPlayerUIMenuClose: '',
  // onHeroDialogueComplete: ,
  // onObjectTalk: null, //cute or evil short noise... or a book or a sign makes a different noise?

  // 'heroMoving--grass': null,
  // 'heroMoving--wood': null,
  // 'heroMoving--swimming': null,

  // onObjectAware: null,// of hero, exclamation
  // onHeroTouchStart: null, //hits obstacle!

  // onHeroBounce: null,

  // onHeroDragObject: null,
  // onHeroTurnAround: null,

  // onHeroHeadHit? so all platformers get that idea?

  // heroFalling: null, //if hero hit max velocity via gravity..?

  // onGamePaused: null,
  // onGameResume: null,
}
