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
global.missingComplexDescriptors = {}

global.generateTextureIdsByDescriptors = function() {
  global.textureIdsByDescriptor = {}

  global.spriteSheets.forEach((ss) => {
    ss.sprites.forEach((s, i) => {
      if(!s.descriptors) return

      let spriteMatchesComplex = false
      Object.keys(global.complexDescriptors).forEach((desc) => {
        const descriptor = global.complexDescriptors[desc]
        let failed = false
        Object.keys(descriptor.withDescriptors).forEach((withD) => {
          if(!s.descriptors[withD]) {
            failed = true
          }
        })
        // if(!failed) console.log(desc)
        if(failed) return

        spriteMatchesComplex = true

        if(!global.textureIdsByDescriptor[desc]) {
          global.textureIdsByDescriptor[desc] = []
        }
        global.textureIdsByDescriptor[desc].push({...s, author: ss.author})
      })

      // if it matches a complex descriptor, you can get it from there, easy
      if(spriteMatchesComplex) {
        // console.log(s)
        return
      }

      // if not add ALL of its tags to the map
      if(s.descriptors) {
        let toAdd = []
        let hasModifer = false
        let spriteAdditions = []
        Object.keys(s.descriptors).forEach((desc) => {
          if(!s.descriptors[desc]) return

          // mods should normally be used to create a complex version of a sprite, if a mod descriptor has reached this point it is missing a complex descriptor
          // later we generate a descriptor for it
          if(global.complexityModifiers[desc]) {
            if(!global.missingComplexDescriptors[desc]) {
              global.missingComplexDescriptors[desc] = []
            }
            global.missingComplexDescriptors[desc].push({...s, author: ss.author})
            hasModifer = true
            return
          }

          // directional modfiers dont get a generated descriptor
          if(global.directionalModifiers[desc]) {
            hasModifer = true
            return
          }

          spriteAdditions.push({
            desc,
            sprite: {...s, author: ss.author}
          })
        })

        // if its not a modified sprite we can just add it to all of the categories it has listed
        if(!hasModifer) {
          spriteAdditions.forEach(({desc, sprite}) => {
            if(!global.textureIdsByDescriptor[desc]) {
              global.textureIdsByDescriptor[desc] = []
            }
            global.textureIdsByDescriptor[desc].push(sprite)
          })
        }
      }
    });
  })

  Object.keys(global.allDescriptors).forEach((desc) => {
    if(!global.allDescriptors[desc]) return
    if(global.allDescriptors[desc].children) {
      if(!global.textureIdsByDescriptor[desc]) {
        global.textureIdsByDescriptor[desc] = []
      }
      global.allDescriptors[desc].children.forEach((child) => {
        if(global.textureIdsByDescriptor[child]) {
          global.textureIdsByDescriptor[desc].push(...global.textureIdsByDescriptor[child])
        }
      })
    }
  })

  Object.keys(global.missingComplexDescriptors).forEach((modifier) => {
    if(modifier === 'Duplicate') return
    const sprites = global.missingComplexDescriptors[modifier]

    sprites.forEach((sprite) => {
      let nonModifier
      Object.keys(sprite.descriptors).forEach((desc) => {
        if(!sprite.descriptors[desc]) return
        if(global.allModifiers[desc]) return

        nonModifier = desc
      })

      if(!nonModifier) return

      let name = nonModifier + ` (${modifier})`
      if(!global.textureIdsByDescriptor[name]) {
        global.allDescriptors[name] = {
          withDescriptors: sprite.descriptors,
          dontShowAdminsInSpriteSheetEditor: true,
          generated: true,
        }
        global.textureIdsByDescriptor[name] = []
      }
      global.textureIdsByDescriptor[name].push(sprite)
    })
  })
}

// global.getModifiersWithoutComplexDescriptor = function() {
//   const unmatched = {}
//   Object.keys(global.textureIdsByDescriptor).forEach((desc) => {
//     if(global.complexityModifiers[desc]) {
//       console.log(desc)
//       unmatched[desc] = global.textureIdsByDescriptor[desc]
//     }
//   })
//   return unmatched
// }

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


global.findAuthorAndRandomTextureIdForDescriptors = function(descriptors, options) {
  const possibleTextures = global.findTexturesForDescriptors(descriptors, options)

  if(!possibleTextures || !possibleTextures.length) return null

  let attempts = 0
  while(!global.currentAuthorForGeneration && attempts < 100) {
    let attemptedAuthor = global.getRandomSSAuthor()
    possibleTextures.forEach(({author}) => {
      if(author === attemptedAuthor) global.currentAuthorForGeneration = author
    })
    attempts++
  }

  const authorsTextures = possibleTextures.filter((s) => {
    if(s.author !== global.currentAuthorForGeneration) return false
    return true
  })

  const textureIndex = getRandomInt(0, authorsTextures.length -1)

  global.currentAuthorForGeneration = authorsTextures[textureIndex].author

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
// noModifiers
global.findSpritesForDescribedObjects = function(objects, options) {
  if(!objects) objects = [...GAME.objects, ...GAME.heroList]
  if(!options) options = {}

  let editedObjects = []
  global.currentAuthorForGeneration = options.authorName || GAME.theme.spriteSheetAuthor
  // if(!global.currentAuthorForGeneration) global.currentAuthorForGeneration = global.getRandomSSAuthor()

  function getTextureId(object) {
    if(object.defaultSprite && options.dontOverrideCurrentSprites) return null

    let textureId
    if(global.currentAuthorForGeneration && !options.mixAuthor) {
      textureId = global.findRandomAuthorsTextureIdForDescriptors(object.descriptors, global.currentAuthorForGeneration, options)
    } else {
      textureId = global.findAuthorAndRandomTextureIdForDescriptors(object.descriptors, options)
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
