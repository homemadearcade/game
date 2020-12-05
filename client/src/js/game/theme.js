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

  // going upstairs
  // going downstars
  // opening door, closing door
  // ladder
}
