import gridUtil from '../../utils/grid.js'
// import collisionsUtil from '../../utils/collisionsUtil.js'

function getInventoryName(object) {
  if(object.name) {
    return object.name
  }

  if(object.subObjectName) {
    return object.subObjectName
  }

  return object.id
}

function pickupObject(hero, collider) {
  let subObject = _.cloneDeep(collider.mod())

  // subObject.id = 'pickupable-'+window.uniqueID()

  // const name = getInventoryName(subObject)

  if(!subObject.subObjectName) subObject.subObjectName = subObject.id

  if(hero.subObjects && hero.subObjects[subObject.subObjectName] && !collider.tags.stackable) {
    window.emitGameEvent('onHeroPickupFail', hero, subObject)
    return
  }

  if(!collider.mod().tags['dontDestroyOnPickup']) {
    // OBJECTS.deleteObject(collider)
    window.emitGameEvent('onDeleteObject', collider)
    // since were duplicating objects here, this gets tricky. the id could pick up the new object in the ._remove processing tool IF you are using _remove
    // thats why I directly remove object
  }

  if(!subObject.tags.onMap) {
    OBJECTS.removeSubObject(subObject)
  }

  subObject.inInventory = true

  hero.interactableObjectId = null
  if(subObject.tags['equipOnPickup']) {
    equipSubObject(hero, subObject)
  }

  // window.local.emit('onHeroPickup', hero, subObject)
  delete subObject.subObjects

  window.emitGameEvent('onHeroPickup', hero, subObject)
  window.local.emit('onAddSubObject', hero, subObject, subObject.subObjectName )
}

function dropObject(hero, subObject, dropAmount = 1, snapToGrid = true) {
  let object = _.cloneDeep(subObject.mod())

  // sometimes the subObject dropped in here can be a copy...  to make sure you are editing the real thing, look up original
  subObject = OBJECTS.getObjectOrHeroById(subObject.id)

  let subObjectStillHasCount = false
  if(subObject.tags.stackable) {
    let newSubObjectCount = subObject.count - dropAmount
    subObject.count -= dropAmount
    if(newSubObjectCount >= 1) {
      subObjectStillHasCount = true
    }
    object.id = 'stackable-' + window.uniqueID()
    object.count = dropAmount
  }

  object.removed = false
  object.tags.potential = false
  object.tags.subObject = false
  delete object.inInventory
  delete object.isEquipped
  delete object.ownerId

  if(snapToGrid) {
    const {x, y} = gridUtil.snapXYToGrid(object.x, object.y)
    object.x = x
    object.y = y
  }

  // if(object.tags.stackable) {
  //   collisionsUtil.check(object, GAME.objects.filter(({subObjectName}) => {
  //     return subObjectName && subObjectName == object.subObjectName
  //   }))
  // }

  // window.local.emit('onHeroDrop', hero, object)

  if(!subObjectStillHasCount) {
    hero.interactableObjectId = null
    window.socket.emit('deleteSubObject', hero, subObject.subObjectName)
  }

  window.emitGameEvent('onHeroDrop', hero, object)
  OBJECTS.create(object)
}

function withdrawFromInventory(withdrawer, owner, subObjectName, withdrawAmount) {
  const subObject = owner.subObjects[subObjectName]
  const newObject = _.cloneDeep(subObject)


  if(subObject.tags.stackable && subObject.count === 0) {
    if(withdrawer.tags.hero) window.emitGameEvent('onHeroWithdrawFail', withdrawer, subObject)
    else window.emitGameEvent('onHeroDepositFail', owner, subObject)
    return
  }

  if(withdrawer.subObjects && withdrawer.subObjects[subObject.subObjectName] && !subObject.tags.stackable) {
    if(withdrawer.tags.hero) window.emitGameEvent('onHeroWithdrawFail', withdrawer, subObject)
    else window.emitGameEvent('onHeroDepositFail', owner, subObject)
    return
  }

  let subObjectStillHasCount = false
  if(subObject.tags.stackable) {
    subObject.count -= withdrawAmount
    if(subObject.count >= 1) {
      subObjectStillHasCount = true
    }
    newObject.count = withdrawAmount
    newObject.id = 'stackable-' + window.uniqueID()
  }
  delete newObject.isEquipped
  newObject.inInventory = true

  if(!subObjectStillHasCount) {
    if(owner.tags.resourceZone) {
      subObject.count = 0
    } else {
      owner.interactableObjectId = null
      window.socket.emit('deleteSubObject', owner, subObjectName)
    }
  }

  if(withdrawer.tags.hero) {
    window.emitGameEvent('onHeroWithdraw', withdrawer, newObject)
  }

  if(owner.tags.hero) {
    window.emitGameEvent('onHeroDeposit', owner, newObject)
  }

  window.local.emit('onAddSubObject', withdrawer, newObject, subObjectName)
}

function depositToInventory(depositor, retriever, subObjectName, amount) {

}

function equipSubObject(hero, subObject, keyBinding = 'available') {
  if(keyBinding === 'available') {
    if(hero.zButtonBehavior === subObject.subObjectName || hero.xButtonBehavior === subObject.subObjectName || hero.cButtonBehavior === subObject.subObjectName) {
      console.log('already equipped to a slot')
    } else {
      if(!hero.zButtonBehavior || hero.zButtonBehavior === '') {
        hero.zButtonBehavior = subObject.subObjectName
      } else if(!hero.xButtonBehavior || hero.xButtonBehavior === '') {
        hero.xButtonBehavior = subObject.subObjectName
      } else if(!hero.cButtonBehavior || hero.cButtonBehavior === '') {
        hero.cButtonBehavior = subObject.subObjectName
      }
    }
  } else if(keyBinding === 'z') {
    hero.zButtonBehavior = subObject.subObjectName
  } else if(keyBinding === 'x') {
    hero.xButtonBehavior = subObject.subObjectName
  } else if(keyBinding === 'c') {
    hero.cButtonBehavior = subObject.subObjectName
  }

  subObject.isEquipped = true

  if(subObject.tags.onMapWhenEquipped) {
    subObject.removed = false
  }

  window.local.emit('onHeroEquip', hero, subObject)
}

function unequipSubObject(hero, subObject) {
  if(hero.zButtonBehavior === subObject.subObjectName) {
    hero.zButtonBehavior = null
  }
  if(hero.xButtonBehavior === subObject.subObjectName) {
    hero.xButtonBehavior = null
  }
  if(hero.cButtonBehavior === subObject.subObjectName) {
    hero.cButtonBehavior = null
  }

  if(subObject.tags.onMapWhenEquipped && !subObject.tags.onMap) {
    OBJECTS.removeSubObject(subObject)
  }

  subObject.isEquipped = false

  window.local.emit('onHeroUnequip', hero, subObject)
}

export {
  pickupObject,
  dropObject,
  withdrawFromInventory,
  depositToInventory,
  equipSubObject,
  unequipSubObject,
}
