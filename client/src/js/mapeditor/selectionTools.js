import collisions from '../utils/collisions'

function getObjectRelations(object, game) {
  let parent = object
  let construct

  if(object.parentId) {
    let objectsParent = game.objectsById[object.parentId] || game.heros[object.parentId]
    if(objectsParent) {
      parent = objectsParent
    }
  }

  if(object.relativeId) {
    let objectsRelative = game.objectsById[object.relativeId] || game.heros[object.relativeId]
    if(objectsRelative) {
      parent = objectsRelative
    }
  }

  if(object.ownerId && !object.tags) {
    let objectsOwner = game.objectsById[object.ownerId]
    if(objectsOwner) {
      construct = objectsOwner
    }
  }

  if(construct) {
    return { parent: construct, children: construct.constructParts }
  } else if(parent) {
    let children = []
    game.objects.forEach((obj) => {
      if(obj.parentId === parent.id || obj.relativeId === parent.id) {
        children.push(obj)
      }
    })
    return { parent, children }
  }
}

function findSmallestObjectInArea(area, objects) {
  const objectsToSearch = [...objects]
  objects.forEach((object) => {
    if(object.subObjects) {
      Object.keys(object.subObjects).forEach((name) => {
        objectsToSearch.push(object.subObjects[name])
      })
    }
  })

  GAME.heroList.forEach((object) => {
    if(object.subObjects) {
      Object.keys(object.subObjects).forEach((name) => {
        objectsToSearch.push(object.subObjects[name])
      })
    }
  })

  let smallestObject = []
  for(let i = 0; i < objectsToSearch.length; i++) {
    let object = objectsToSearch[i].mod()
    if(object.tags && !window.isObjectSelectable(object)) continue
    if(object.constructParts) {
      objectsToSearch.push(...object.constructParts)
      continue
    }
    collisions.checkObject(area, object, () => {
      if(!smallestObject.length) smallestObject = [object]
      else if(object.width < smallestObject[0].width && object.height < smallestObject[0].height) {
        smallestObject = [object]
      } else if(object.width === smallestObject[0].width || object.height === smallestObject[0].height) {
        smallestObject.push(object)
      }
    })
  }

  return smallestObject
}

export default {
  getObjectRelations,
  findSmallestObjectInArea,
}
