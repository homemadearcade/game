function getAliases(descriptors) {
  let descriptorList = Object.keys(descriptors)

  const aliases = []
  descriptorList.forEach((desc) => {
    if(global.allDescriptors[desc].children) aliases.push(...global.allDescriptors[desc].children)
  })

  return aliases
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////
///TEXTURES
//////////
global.textureIdsByDescriptor = {}

global.generateTextureIdsByDescriptors = function() {
  global.textureIdsByDescriptor = {}

  global.spriteSheets.forEach((ss) => {
    ss.sprites.forEach((s, i) => {
      if(s.descriptors) {
        Object.keys(s.descriptors).forEach((desc) => {
          if(!s.descriptors[desc]) return
          if(!global.textureIdsByDescriptor[desc]) {
            global.textureIdsByDescriptor[desc] = []
          }
          global.textureIdsByDescriptor[desc].push({...s, author: ss.author})
        })
      }
    });

  })
}

//dontSearchAliases
global.findTexturesForDescriptors = function(descriptors, options) {
  if(!options) options = {}

  let descriptorList = Object.keys(descriptors)

  let possibleTextures = []
  descriptorList.forEach((desc) => {
    if(!descriptors[desc]) return
    if(desc && global.textureIdsByDescriptor[desc]) {
      possibleTextures.push(...global.textureIdsByDescriptor[desc])
    }
  })

  // if(!possibleTextures.length && !options.dontSearchAliases) {
  //   const aliasesList = getAliases(descriptors)
  //   aliasesList.forEach((desc) => {
  //     if(desc && global.textureIdsByDescriptor[desc]) {
  //       possibleTextures.push(...global.textureIdsByDescriptor[desc])
  //     }
  //   })
  // }

  if(!possibleTextures.length) {
    console.log('NO AVAILABLE TEXTURE IDS FOR DESCRIPTORS', descriptors)
    return null
  }

  return possibleTextures
}

global.findRandomAuthorsTextureIdForDescriptors = function(descriptors, author, options) {
  const possibleTextures = global.findTexturesForDescriptors(descriptors, options)

  const authorsTextures = possibleTextures.filter((s) => {
    console.log(s.author)
    if(s.author !== author) return false
    return true
  })

  if(authorsTextures.length) {
    const textureIndex = getRandomInt(0, authorsTextures.length -1)
    return authorsTextures[textureIndex].textureId
  } else if(options.strictAuthor) return null

  if(!possibleTextures || !possibleTextures.length) return null

  const textureIndex = getRandomInt(0, possibleTextures.length -1)

  return possibleTextures[textureIndex].textureId
}


global.findRandomTextureIdForDescriptors = function(descriptors, options) {
  const possibleTextures = global.findTexturesForDescriptors(descriptors, options)

  if(!possibleTextures || !possibleTextures.length) return null

  const textureIndex = getRandomInt(0, possibleTextures.length -1)

  return possibleTextures[textureIndex].textureId
}

global.breakDownConstructPartIntoEqualNodes = function(constructParts) {

  return parts
}

global.getRandomSSAuthor = function() {
  const authorList = Object.keys(global.spriteSheetAuthors).filter((author) => {
    if(global.spriteSheetAuthors[author]) return true
    else return false
  })
  const authorIndex = getRandomInt(0, authorList.length -1)
  return authorList[authorIndex]
}

// authorName
// strictAuthor
// mixAuthor
// dontOverrideCurrentSprites
// dontSearchAliases
global.findSpritesForDescribedObjects = function(objects, options) {
  if(!objects) objects = [...GAME.objects, ...GAME.heroList]
  if(!options) options = {}

  let editedObjects = []
  let currentAuthor = options.authorName || GAME.theme.spriteSheetAuthor
  if(!currentAuthor) currentAuthor = global.getRandomSSAuthor()

  function getTextureId(object) {
    if(object.defaultSprite && options.dontOverrideCurrentSprites) return null

    let textureId
    console.log(currentAuthor)
    if(currentAuthor && !options.mixAuthor) {
      textureId = global.findRandomAuthorsTextureIdForDescriptors(object.descriptors, currentAuthor, options)
    } else {
      textureId = global.findRandomTextureIdForDescriptors(object.descriptors, options)
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
          global.socket.emit('editSubObject', object.id, so.subObjectName, { defaultSprite: textureId })
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
    global.socket.emit('editObjects', editedObjects)
  }
}
