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

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getAliases(descriptors) {
  let descriptorList = Object.keys(descriptors)

  const aliases = []
  descriptorList.forEach((desc) => {
    aliases.push(...window.allDescriptors[desc].aliases)
  })

  return aliases
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////
///TEXTURES
//////////
window.textureIdsByDescriptor = {}

window.generateTextureIdsByDescriptors = function() {
  window.textureIdsByDescriptor = {}

  window.spriteSheets.forEach((ss) => {
    ss.sprites.forEach((s, i) => {
      if(s.descriptors) {
        Object.keys(s.descriptors).forEach((desc) => {
          if(!window.textureIdsByDescriptor[desc]) {
            window.textureIdsByDescriptor[desc] = []
          }
          window.textureIdsByDescriptor[desc].push({...s, author: ss.author})
        })
      }
    });

  })
}

window.findTexturesForDescriptors = function(descriptors) {
  let descriptorList = Object.keys(descriptors)

  let possibleTextures = []
  descriptorList.forEach((desc) => {
    possibleTextures.push(...window.textureIdsByDescriptor[desc])
  })

  if(!possibleTextures.length) {
    const aliases = getAliases(descriptors)
    aliasesList.forEach((desc) => {
      possibleTextures.push(...window.textureIdsByDescriptor[desc])
    })
  }

  if(!possibleTextures.length) {
    console.log('NO AVAILABLE TEXTURE IDS FOR DESCRIPTORS', descriptors)
    return null
  }

  return possibleTextures
}

window.findRandomAuthorsTextureIdForDescriptors = function(descriptors, author, strict) {
  const possibleTextures = window.findTexturesForDescriptors(descriptors)

  const authorsTextures = possibleTextures.filter((s) => {
    if(s.name !== author) return false
    return true
  })

  if(authorsTextures.length) {
    const textureIndex = getRandomInt(0, authorsTextures.length -1)
    return authorsTextures[textureIndex].textureId
  } else if(strict) return null

  const textureIndex = getRandomInt(0, possibleTextures.length -1)

  return possibleTextures[textureIndex].textureId
}


window.findRandomTextureIdForDescriptors = function(descriptors) {
  const possibleTextures = window.findTexturesForDescriptors(descriptors)

  const textureIndex = getRandomInt(0, possibleTextures.length -1)

  return possibleTextures[textureIndex].textureId
}

window.breakDownConstructPartIntoEqualNodes = function(constructParts) {

  return parts
}

window.getRandomSSAuthor = function() {
  const authorList = Object.keys(window.spriteSheetAuthors).filter((author) => {
    if(window.spriteSheetAuthors[author]) return true
    else return false
  })
  const authorIndex = getRandomInt(0, authorList.length -1)
  return authorList[authorIndex].textureId
}

// authorName
// strictAuthor
// mixAuthor
// dontOverrideCurrentSprites

window.findSpritesForDescribedObjects = function(objects, options) {
  if(!objects) objects = [...GAME.objects, ...GAME.heroList]
  if(!options) options = {}

  window.generateTextureIdsByDescriptors()

  let editedObjects = []
  let currentAuthor = options.authorName
  if(!currentAuthor) currentAuthor = window.getRandomSSAuthor()

  function getTextureId(object) {
    if(object.defaultSprite && options.dontOverrideCurrentSprites) return null

    let textureId
    if(currentAuthor && !options.mixAuthor) {
      textureId = window.findRandomAuthorsTextureIdForDescriptors(object.descriptors, currentAuthor, options.strictAuthor)
    } else {
      textureId = window.findRandomTextureIdForDescriptors(object.descriptors)
    }

    return textureId
  }

  objects.forEach((object) => {
    if(object.defaultSprite && options.dontOverrideCurrentSprites) return

    if(object.subObjects) {
      OBJECTS.forAllSubObjects(object.subObjects, (so) => {
        if(so && !so.descriptors) return
        const textureId = getTextureId(so)
        if(textureId) {
          window.socket.emit('editSubObject', object.id, so.subObjectName, { defaultSprite: textureId })
        }
      })
    }

    if(object.descriptors) {
      if(object.constructParts) {
        editedObjects.push({
          id: object.id,
          constructParts: object.constructParts.map((part) => {
            if(part.defaultSprite && options.dontOverrideCurrentSprites) return part

            const textureId = getTextureId({...part, descriptors: object.descriptors})
            if(textureId) {
              part.defaultSprite = textureId
            }
            return part

          })
        })
      } else {
        const textureId = getTextureId(object)
        if(textureId) {
          editedObjects.push({
            id: object.id,
            defaultSprite: textureId
          })
        }
      }

    }
  })

  console.log('UPDATED SPRITES FOR', editedObjects)

  if(editedObjects.length) {
    window.socket.emit('editObjects', editedObjects)
  }
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////
///AUDIO
//////////
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

    // console.log(collection, selectedAssets.audioCollection, selectedAssets.folderName, event)
    const file = collection.files[fileIndex]

    newAudioTheme[event] = file.id
  })

  window.socket.emit('updateTheme', { audio: newAudioTheme })
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////
///TITLE
//////////
window.generateTitleTheme = function() {
  const newTitleTheme = {}

  const indexAnimation = getRandomInt(0, window.titleAnimationStyles.length -1)
  newTitleTheme.animation = window.titleAnimationStyles[indexAnimation]

  const indexFont = getRandomInt(0, window.titleFontStyles.length -1)
  newTitleTheme.font = window.titleFontStyles[indexFont]

  window.socket.emit('updateTheme', { title: newTitleTheme })
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
