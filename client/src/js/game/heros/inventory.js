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

  // subObject.id = 'pickupable-'+global.uniqueID()

  // const name = getInventoryName(subObject)

  if(!collider.mod().tags.pickupable) {
    global.emitGameEvent('onHeroPickupFail', hero, subObject)
    return
  }

  if(!subObject.subObjectName) subObject.subObjectName = subObject.id

  if(hero.subObjects && hero.subObjects[subObject.subObjectName] && !collider.tags.stackable) {
    global.emitGameEvent('onHeroPickupFail', hero, subObject)
    return
  }

  if(!collider.mod().tags['dontDestroyOnPickup']) {
    // OBJECTS.deleteObject(collider)
    global.emitGameEvent('onDeleteObject', collider)
    // since were duplicating objects here, this gets tricky. the id could pick up the new object in the ._remove processing tool IF you are using _remove
    // thats why I directly remove object
  }

  subObject.inInventory = true

  if(subObject.tags['equipOnPickup']) {
    equipSubObject(hero, subObject)
  }

  // global.local.emit('onHeroPickup', hero, subObject)
  delete subObject.subObjects

  global.emitGameEvent('onHeroPickup', hero, subObject)
  global.local.emit('onAddSubObject', hero, subObject, subObject.subObjectName )
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
    object.id = 'stackable-' + global.uniqueID()
    object.count = dropAmount
  }

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

  // global.local.emit('onHeroDrop', hero, object)

  if(!subObjectStillHasCount) {
    global.socket.emit('deleteSubObject', hero, subObject.subObjectName)
  }

  global.emitGameEvent('onHeroDrop', hero, object)
  OBJECTS.create(object)
}

function withdrawFromInventory(withdrawer, owner, subObjectName, withdrawAmount) {
  const subObject = owner.subObjects[subObjectName]
  const newObject = _.cloneDeep(subObject)


  if(subObject.tags.stackable && subObject.count === 0) {
    if(withdrawer.tags.hero) global.emitGameEvent('onHeroWithdrawFail', withdrawer, subObject)
    else global.emitGameEvent('onHeroDepositFail', owner, subObject)
    return
  }

  if(withdrawer.subObjects && withdrawer.subObjects[subObject.subObjectName] && !subObject.tags.stackable) {
    if(withdrawer.tags.hero) global.emitGameEvent('onHeroWithdrawFail', withdrawer, subObject)
    else global.emitGameEvent('onHeroDepositFail', owner, subObject)
    return
  }

  let subObjectStillHasCount = false
  if(subObject.tags.stackable) {
    subObject.count -= withdrawAmount
    if(subObject.count >= 1) {
      subObjectStillHasCount = true
    }
    newObject.count = withdrawAmount
    newObject.id = 'stackable-' + global.uniqueID()
  }
  delete newObject.isEquipped
  newObject.inInventory = true

  if(!subObjectStillHasCount) {
    if(owner.tags.resourceZone) {
      subObject.count = 0
    } else {
      global.socket.emit('deleteSubObject', owner, subObjectName)
    }
  }

  if(withdrawer.tags.hero) {
    global.emitGameEvent('onHeroWithdraw', withdrawer, newObject)
  }

  if(owner.tags.hero) {
    global.emitGameEvent('onHeroDeposit', owner, newObject)
  }

  global.local.emit('onAddSubObject', withdrawer, newObject, subObjectName)
}

function depositToInventory(depositor, retriever, subObjectName, amount) {

}

function equipSubObject(hero, subObject, keyBinding = 'available') {

  if(subObject.actionProps) {
    if(keyBinding === 'available') {
      if(hero.zButtonBehavior === subObject.subObjectName || hero.xButtonBehavior === subObject.subObjectName || hero.cButtonBehavior === subObject.subObjectName || hero.spaceBarBehavior === subObject.subObjectName) {
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
    } else if(keyBinding === 'space') {
      hero.spaceBarBehavior = subObject.subObjectName
    }
  }

  // if(subObject.equipBehavior === 'addDialogueChoice') {
  //   if(subObject.equipProps.dialogueChoiceJSON) {
  //     global.socket.emit('addDialogueChoice', hero.id, subObject.id, subObject.equipProps.dialogueChoiceJSON)
  //   }
  // }

  subObject.isEquipped = true
  global.emitGameEvent('onHeroEquip', hero, subObject)
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
  if(hero.spaceBarBehavior === subObject.subObjectName) {
    hero.spaceBarBehavior = null
  }

  // if(subObject.equipBehavior === 'addDialogueChoice') {
  //   global.socket.emit('deleteDialogueChoice', hero.id, subObject.id)
  // }

  subObject.isEquipped = false

  global.emitGameEvent('onHeroUnequip', hero, subObject)
}

export {
  pickupObject,
  dropObject,
  withdrawFromInventory,
  depositToInventory,
  equipSubObject,
  unequipSubObject,
}
