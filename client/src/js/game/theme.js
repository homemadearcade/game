window.generateAudioThemeData = {
  heroMoving: [
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
    }
  ],
  onHeroDrop: [
    {
      audioCollection: 'retro',
      folderName: 'Throwing Item'
    }
  ],
  onHeroDrop: [
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
  heroMoving: null,
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

  // UNKNOWN SOUNDS
  onHeroDialogueStart: null,
  onHeroDialogueNext: null,
  onHeroDialogueComplete: null,

  onPlayerUIMouseEnterButton: null,
  onPlayerUIMenuOpen: null,
  onPlayerUIMenuClouse: null,

  onHeroChooseOption: null,
  onHeroOptionStart: null,

  onObjectAware: null,// of hero, exclamation
  onHeroTouchStart: null, //hits obstacle!
}
