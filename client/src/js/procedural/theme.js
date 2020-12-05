function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

window.getRandomInt = getRandomInt

window.getRandomFloat = function(min, max) {
  return (Math.random() * (max - min + 1)) + min;
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

//alwaysSearchAliases
window.findTexturesForDescriptors = function(descriptors, options) {
  if(!options) options = {}

  let descriptorList = Object.keys(descriptors)

  let possibleTextures = []
  descriptorList.forEach((desc) => {
    if(desc && window.textureIdsByDescriptor[desc]) {
      possibleTextures.push(...window.textureIdsByDescriptor[desc])
    }
  })

  if(!possibleTextures.length || options.alwaysSearchAliases) {
    const aliasesList = getAliases(descriptors)
    aliasesList.forEach((desc) => {
      if(desc && window.textureIdsByDescriptor[desc]) {
        possibleTextures.push(...window.textureIdsByDescriptor[desc])
      }
    })
  }

  if(!possibleTextures.length) {
    console.log('NO AVAILABLE TEXTURE IDS FOR DESCRIPTORS', descriptors)
    return null
  }

  return possibleTextures
}

window.findRandomAuthorsTextureIdForDescriptors = function(descriptors, author, options) {
  const possibleTextures = window.findTexturesForDescriptors(descriptors, options)

  const authorsTextures = possibleTextures.filter((s) => {
    if(s.name !== author) return false
    return true
  })

  if(authorsTextures.length) {
    const textureIndex = getRandomInt(0, authorsTextures.length -1)
    return authorsTextures[textureIndex].textureId
  } else if(options.strictAuthor) return null

  const textureIndex = getRandomInt(0, possibleTextures.length -1)

  return possibleTextures[textureIndex].textureId
}


window.findRandomTextureIdForDescriptors = function(descriptors, options) {
  const possibleTextures = window.findTexturesForDescriptors(descriptors, options)

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
// alwaysSearchAliases
window.findSpritesForDescribedObjects = function(objects, options) {
  if(!objects) objects = [...GAME.objects, ...GAME.heroList]
  if(!options) options = {}

  let editedObjects = []
  let currentAuthor = options.authorName || GAME.theme.spriteSheetAuthor
  if(!currentAuthor) currentAuthor = window.getRandomSSAuthor()

  function getTextureId(object) {
    if(object.defaultSprite && options.dontOverrideCurrentSprites) return null

    let textureId
    if(currentAuthor && !options.mixAuthor) {
      textureId = window.findRandomAuthorsTextureIdForDescriptors(object.descriptors, currentAuthor, options)
    } else {
      textureId = window.findRandomTextureIdForDescriptors(object.descriptors, options)
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
