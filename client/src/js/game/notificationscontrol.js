// notificationLog,
// notificationChat,
// notificationToast,
// notificationModal,
// notificationModalHeader,
// notificationText,

// notificationDuration,

// notificationAllHeros,
// notificationAllHerosInvolved,
import onTalk from './heros/onTalk'

function setHeroWalkingSound (hero) {
  if(hero.tags.walkRetro) {
    hero._walkingSound = 'retro'
  }

  if(hero.tags.walkVehicle) {
    hero._walkingSound = 'vehicle'
  }

  if(hero.tags.walkDescriptor && hero._walkingOnId) {
    const object = OBJECTS.getObjectOrHeroById(hero._walkingOnId)
    if(object.tags.snow) {
      hero._walkingSound = 'snow'
    } else if(object.tags.sand) {
      hero._walkingSound = 'sand'
    } else if(object.tags.ice) {
      hero._walkingSound = 'ice'
    } else if(object.tags.water) {
      hero._walkingSound = 'water'
    } else if(object.tags.metal) {
      hero._walkingSound = 'metal'
    } else if(object.tags.wood) {
      hero._walkingSound = 'wood'
    } else if(object.tags.gravel) {
      hero._walkingSound = 'gravel'
    } else if(object.tags.dirt) {
      hero._walkingSound = 'dirt'
    } else if(object.tags.stone) {
      hero._walkingSound = 'stone'
    } else if(object.tags.grass) {
      hero._walkingSound = 'grass'
    } else if(object.tags.glass) {
      hero._walkingSound = 'glass'
    } else if(object.tags.concrete) {
      hero._walkingSound = 'concrete'
    } else {
      hero._walkingSound = 'gravel'
    }
  }

  if(!hero._walkingSound) hero._walkingSound = 'retro'
}

class NotificationsControl{
  onPuzzleSolved(object, hero) {
    global.local.emit('onSendNotification', { playerUIHeroId: hero.id, logRecipientId: hero.id, toast: true, log: true, text: 'Puzzle Solved'})
  }

  onHeroDeposit(hero, newObject) {
    if(hero.id === HERO.id) AUDIO.play(GAME.theme.audio.onHeroDrop)

    // if(PAGE.role.isHost) {
      let message =  'You deposited ' + (newObject.name || newObject.subObjectName)
      if(newObject.count > 1) {
        message = 'You deposited ' + newObject.count + ' ' + (newObject.name || newObject.subObjectName)
      }
      global.local.emit('onSendNotification', { playerUIHeroId: hero.id, logRecipientId: hero.id, toast: true, log: true, text: message})
    // }
  }

  onHeroWithdraw(hero, newObject) {
    if(hero.id === HERO.id) AUDIO.play(GAME.theme.audio.onHeroPickup)

    // if(PAGE.role.isHost) {

      let message =  'You withdrew ' + (newObject.name || newObject.subObjectName)
      if(newObject.count > 1) {
        message = 'You withdrew ' + newObject.count + ' ' + (newObject.name || newObject.subObjectName)
      }
      global.local.emit('onSendNotification', { playerUIHeroId: hero.id, logRecipientId: hero.id, toast: true, log: true, text: message})
    // }
  }

  onHeroTouchStart(hero, object) {
    if(!object) return
    if(object.tags.groundDisturbanceOnHeroTouchStart || object.tags.water) {
      let suffix = '2'
      // if(hero.mod().tags.gravityY || GAME.world.tags.allMovingObjectsHaveGravityY) suffix = '2'
      if(Math.abs(hero.velocityX) > Math.abs(hero.velocityY) || Math.abs(hero._flatVelocityX) > Math.abs(hero._flatVelocityY)) {
        if(hero.velocityX > 0 || hero._flatVelocityX > 0) {
          PIXIMAP.onFakeObjectAnimation('groundDisturbanceRight' + suffix,  { y:hero.y, width: hero.width, height: hero.height, tags: {rotateable: true}, angle: global.degreesToRadians(90), x: hero.x + (hero.width/2), color: object.color || GAME.world.defaultObjectColor })
          PIXIMAP.onFakeObjectAnimation('groundDisturbanceLeft' + suffix,  { y:hero.y, width: hero.width, height: hero.height, tags: {rotateable: true}, angle: global.degreesToRadians(90), x: hero.x + (hero.width/2), color: object.color || GAME.world.defaultObjectColor })
        } else {
          PIXIMAP.onFakeObjectAnimation('groundDisturbanceRight' + suffix,  { y:hero.y, width: hero.width, height: hero.height,tags: {rotateable: true}, angle: global.degreesToRadians(270), x: hero.x + (hero.width/2), color: object.color || GAME.world.defaultObjectColor })
          PIXIMAP.onFakeObjectAnimation('groundDisturbanceLeft' + suffix,  { y:hero.y, width: hero.width, height: hero.height, tags: {rotateable: true}, angle: global.degreesToRadians(270), x: hero.x + (hero.width/2), color: object.color || GAME.world.defaultObjectColor })
        }
      } else {
        if(hero.velocityY > 0 || hero._flatVelocityY > 0) {
          PIXIMAP.onFakeObjectAnimation('groundDisturbanceRight' + suffix,  { x:hero.x, width: hero.width, height: hero.height, tags: {rotateable: true}, angle: global.degreesToRadians(180), y: hero.y + (hero.height/2), color: object.color || GAME.world.defaultObjectColor })
          PIXIMAP.onFakeObjectAnimation('groundDisturbanceLeft' + suffix,  { x:hero.x, width: hero.width, height: hero.height, tags: {rotateable: true}, angle: global.degreesToRadians(180), y: hero.y + (hero.height/2), color: object.color || GAME.world.defaultObjectColor })
        } else {
          PIXIMAP.onFakeObjectAnimation('groundDisturbanceRight' + suffix,  { x:hero.x, width: hero.width, height: hero.height, tags: {rotateable: true}, angle: 0, y: hero.y + (hero.height/2), color: object.color || GAME.world.defaultObjectColor })
          PIXIMAP.onFakeObjectAnimation('groundDisturbanceLeft' + suffix,  { x:hero.x, width: hero.width, height: hero.height, tags: {rotateable: true}, angle: 0, y: hero.y + (hero.height/2), color: object.color || GAME.world.defaultObjectColor })
        }
      }
    }
  }

  onHeroTouchEnd(hero, object) {
    if(!object) return
    if(object.tags.groundDisturbanceOnHeroTouchEnd || object.tags.water) {
      let suffix = '2'
      // if(hero.mod().tags.gravityY || GAME.world.tags.allMovingObjectsHaveGravityY) suffix = '2'
      if(Math.abs(hero.velocityX) > Math.abs(hero.velocityY) || Math.abs(hero._flatVelocityX) > Math.abs(hero._flatVelocityY)) {
        if(hero.velocityX > 0 || hero._flatVelocityX > 0) {
          PIXIMAP.onFakeObjectAnimation('groundDisturbanceRight' + suffix,  { y:hero.y, width: hero.width, height: hero.height, tags: {rotateable: true}, angle: global.degreesToRadians(90), x: hero.x + (hero.width/2), color: object.color || GAME.world.defaultObjectColor })
          PIXIMAP.onFakeObjectAnimation('groundDisturbanceLeft' + suffix,  { y:hero.y, width: hero.width, height: hero.height, tags: {rotateable: true}, angle: global.degreesToRadians(90), x: hero.x + (hero.width/2), color: object.color || GAME.world.defaultObjectColor })
        } else {
          PIXIMAP.onFakeObjectAnimation('groundDisturbanceRight' + suffix,  { y:hero.y, width: hero.width, height: hero.height, tags: {rotateable: true}, angle: global.degreesToRadians(270), x: hero.x + (hero.width/2), color: object.color || GAME.world.defaultObjectColor })
          PIXIMAP.onFakeObjectAnimation('groundDisturbanceLeft' + suffix,  { y:hero.y, width: hero.width, height: hero.height, tags: {rotateable: true}, angle: global.degreesToRadians(270), x: hero.x + (hero.width/2), color: object.color || GAME.world.defaultObjectColor })
        }
      } else {
        if(hero.velocityY > 0 || hero._flatVelocityY > 0) {
          PIXIMAP.onFakeObjectAnimation('groundDisturbanceRight2', { x:hero.x, width: hero.width, height: hero.height, tags: {rotateable: true}, angle: global.degreesToRadians(180), y: hero.y + (hero.height/2), color: object.color || GAME.world.defaultObjectColor })
          PIXIMAP.onFakeObjectAnimation('groundDisturbanceLeft2', { x:hero.x, width: hero.width, height: hero.height, tags: {rotateable: true}, angle: global.degreesToRadians(180), y: hero.y + (hero.height/2), color: object.color || GAME.world.defaultObjectColor })
        } else {
          PIXIMAP.onFakeObjectAnimation('groundDisturbanceRight2', { x:hero.x, width: hero.width, height: hero.height, tags: {rotateable: true}, angle: 0, y: hero.y + (hero.height/2), color: object.color || GAME.world.defaultObjectColor })
          PIXIMAP.onFakeObjectAnimation('groundDisturbanceLeft2', { x:hero.x, width: hero.width, height: hero.height, tags: {rotateable: true}, angle: 0, y: hero.y + (hero.height/2), color: object.color || GAME.world.defaultObjectColor })
        }
      }
    }
  }

  onHeroShootBullet(hero) {
    if(hero.id === HERO.id) AUDIO.play(GAME.theme.audio.onHeroShootBullet)
  }

  // onHeroShootLaserTool(hero) {
  //   if(hero.id === HERO.id) AUDIO.play(GAME.theme.audio.onHeroShootLaserTool)
  // }

  onHeroFloatJump(hero) {
    if(hero.tags.groundDisturbanceOnHeroFloatJump) {
      PIXIMAP.onFakeObjectAnimation('groundDisturbanceRight', { ...hero, y: hero.y + (hero.height/2), color: hero.color })
      PIXIMAP.onFakeObjectAnimation('groundDisturbanceLeft', { ...hero, y: hero.y + (hero.height/2), color: hero.color })
    }
    if(hero.id === HERO.id) AUDIO.play(GAME.theme.audio.onHeroFloatJump)
  }

  onHeroDash(hero) {
    if(hero.id === HERO.id) AUDIO.play(GAME.theme.audio.onHeroDash)
  }

  onHeroTeleDash(hero) {
    if(hero.id === HERO.id) AUDIO.play(GAME.theme.audio.onHeroTeleDash)
  }

  onHeroGroundJump(hero) {
    if(hero.tags.groundDisturbanceOnHeroGroundJump) {
      PIXIMAP.onFakeObjectAnimation('groundDisturbanceRight', { ...hero, y: hero.y + (hero.height/2), color: hero.color })
      PIXIMAP.onFakeObjectAnimation('groundDisturbanceLeft', { ...hero, y: hero.y + (hero.height/2), color: hero.color })
    }
    if(hero.id === HERO.id) AUDIO.play(GAME.theme.audio.onHeroGroundJump)
  }

  onGameStarted() {
    AUDIO.play(GAME.theme.audio.onGameStarted)
  }

  onUpdateHero(hero) {
    if(PAGE.role.isHost) {
      hero._walkingSound = null

      if(!hero.mod().tags.walkOverhead && (hero.mod().tags.gravityY || GAME.world.tags.allMovingObjectsHaveGravityY)) {
        if(hero.onObstacle && (hero.velocityX || hero._flatVelocityX || hero.velocityY || hero._flatVelocityY) ) {
          setHeroWalkingSound(hero)
        }
      } else if(hero.mod().tags.walkOverhead) {
        if(hero.velocityX || hero._flatVelocityX || hero.velocityY || hero._flatVelocityY) {
          setHeroWalkingSound(hero)
        }
      }
    }

    if(hero.id !== HERO.id) return

    if(hero._shootingLaser) {
      AUDIO.playLoop({
        id: 'shootingLaser',
        soundIds: [
          GAME.theme.audio['heroShootingLaser']
        ],
        volume: 0.4,
      })
    } else {
      AUDIO.stopLoop('shootingLaser')
    }

    if(hero._walkingSound == 'retro') {
      AUDIO.playLoop({
        id: 'walking--retro',
        soundIds: [
          GAME.theme.audio['heroMoving--retro']
        ]
      })
    } else {
      AUDIO.stopLoop('walking--retro')
    }

    if(hero._walkingSound == 'vehicle') {
      AUDIO.playLoop({
        id: 'walking--vehicle',
        soundIds: [
          GAME.theme.audio['heroMoving--vehicle']
        ]
      })
    } else {
      AUDIO.stopLoop('walking--vehicle')
    }

    if(hero._walkingSound == 'concrete') {
      AUDIO.playLoop({
        id: 'walking--concrete',
        soundIds: [
          GAME.theme.audio['heroMoving--concrete']
        ]
      })
    } else {
      AUDIO.stopLoop('walking--concrete')
    }

    if(hero._walkingSound == 'dirt') {
      AUDIO.playLoop({
        id: 'walking--dirt',
        soundIds: [
          GAME.theme.audio['heroMoving--dirt']
        ]
      })
    } else {
      AUDIO.stopLoop('walking--dirt')
    }

    if(hero._walkingSound == 'glass') {
      AUDIO.playLoop({
        id: 'walking--glass',
        soundIds: [
          GAME.theme.audio['heroMoving--glass']
        ]
      })
    } else {
      AUDIO.stopLoop('walking--glass')
    }

    if(hero._walkingSound == 'grass') {
      AUDIO.playLoop({
        id: 'walking--grass',
        soundIds: [
          GAME.theme.audio['heroMoving--grass']
        ]
      })
    } else {
      AUDIO.stopLoop('walking--grass')
    }
    if(hero._walkingSound == 'gravel') {
      AUDIO.playLoop({
        id: 'walking--gravel',
        soundIds: [
          GAME.theme.audio['heroMoving--gravel']
        ]
      })
    } else {
      AUDIO.stopLoop('walking--gravel')
    }
    if(hero._walkingSound == 'ice') {
      AUDIO.playLoop({
        id: 'walking--ice',
        soundIds: [
          GAME.theme.audio['heroMoving--ice']
        ]
      })
    } else {
      AUDIO.stopLoop('walking--ice')
    }
    if(hero._walkingSound == 'metal') {
      AUDIO.playLoop({
        id: 'walking--metal',
        soundIds: [
          GAME.theme.audio['heroMoving--metal']
        ]
      })
    } else {
      AUDIO.stopLoop('walking--metal')
    }
    if(hero._walkingSound == 'mud') {
      AUDIO.playLoop({
        id: 'walking--mud',
        soundIds: [
          GAME.theme.audio['heroMoving--mud']
        ]
      })
    } else {
      AUDIO.stopLoop('walking--mud')
    }

    if(hero._walkingSound == 'sand') {
      AUDIO.playLoop({
        id: 'walking--sand',
        soundIds: [
          GAME.theme.audio['heroMoving--sand']
        ]
      })
    } else {
      AUDIO.stopLoop('walking--sand')
    }

    if(hero._walkingSound == 'snow') {
      AUDIO.playLoop({
        id: 'walking--snow',
        soundIds: [
          GAME.theme.audio['heroMoving--snow']
        ]
      })
    } else {
      AUDIO.stopLoop('walking--snow')
    }

    if(hero._walkingSound == 'water') {
      AUDIO.playLoop({
        id: 'walking--water',
        soundIds: [
          GAME.theme.audio['heroMoving--water']
        ]
      })
    } else {
      AUDIO.stopLoop('walking--water')
    }

    if(hero._walkingSound == 'stone') {
      AUDIO.playLoop({
        id: 'walking--stone',
        soundIds: [
          GAME.theme.audio['heroMoving--stone']
        ]
      })
    } else {
      AUDIO.stopLoop('walking--stone')
    }

    if(hero._walkingSound == 'water') {
      AUDIO.playLoop({
        id: 'walking--water',
        soundIds: [
          GAME.theme.audio['heroMoving--water']
        ]
      })
    } else {
      AUDIO.stopLoop('walking--water')
    }
  }



  onHeroCameraEffect() {
    // AUDIO.playDebounce(GAME.theme.audio['onObjectDestroyed--big'])
  }

  onObjectDestroyed(object, destroyer) {
    if(object.mod().width > 100 || object.mod().height > 100) {
      AUDIO.playDebounce({id: 'onBigObjectDestroyed', soundId: GAME.theme.audio['onObjectDestroyed--big']})
    } else {
      AUDIO.play(GAME.theme.audio['onObjectDestroyed--small'])
    }
  }

  onHeroWithdrawFail(hero, subObject) {
    //. You already have a ' + subObject.subObjectName
    global.local.emit('onSendNotification', { playerUIHeroId: hero.id, logRecipientId: hero.id, toast: true, log: true, text: 'You can\'t withraw'})
  }

  onHeroDepositFail(hero, subObject) {
    //Target already has a ' + subObject.subObjectName
    global.local.emit('onSendNotification', { playerUIHeroId: hero.id, logRecipientId: hero.id, toast: true, log: true, text: 'You can\'t deposit'})
  }

  onHeroDrop(hero, object) {
    // if(PAGE.role.isHost) {
      global.local.emit('onSendNotification', { playerUIHeroId: hero.id, logRecipientId: hero.id, toast: true, log: true, text: message})
      if(hero.id === HERO.id) AUDIO.play(GAME.theme.audio.onHeroDrop)
      let message =  'You dropped ' + (object.name || object.subObjectName)
      if(object.count > 1) {
        message = 'You dropped ' + object.count + ' ' + (object.name || object.subObjectName)
      }
    // }
  }

  onHeroPowerLand(hero, landingObject) {
    if(hero.tags.groundDisturbanceOnHeroPowerLand && landingObject.width > GAME.grid.nodeSize) {
      PIXIMAP.onFakeObjectAnimation('groundDisturbanceRight', { ...hero, y: hero.y + (hero.height/2), color: landingObject.color || GAME.world.defaultObjectColor })
      PIXIMAP.onFakeObjectAnimation('groundDisturbanceLeft', { ...hero, y: hero.y + (hero.height/2), color: landingObject.color || GAME.world.defaultObjectColor })
    }
  }

  onHeroPickup(hero, subObject) {
    if(PAGE.role.isHost) {
      if(subObject.heroDialogueSets && subObject.heroDialogueSets.pickup) {
        // for game events you need to relookup the object because theres some sort of copy somewhere?
        onTalk(OBJECTS.getObjectOrHeroById(hero.id), subObject, {}, { setName: 'pickup' })
      }
    }
    if(hero.id === HERO.id) {
      AUDIO.play(GAME.theme.audio.onHeroPickup)
    }

    // if(PAGE.role.isHost) {
      let message = 'You picked up ' + (subObject.name || subObject.subObjectName)
      if(subObject.count > 1) {
        message = 'You picked up ' + subObject.count + ' ' + (subObject.name || subObject.subObjectName)
      }
      global.local.emit('onSendNotification', { playerUIHeroId: hero.id, logRecipientId: hero.id, toast: true, log: true, text: message})
    // }
  }

  onHeroPickupFail(hero, subObject) {
    // You already have a ' + subObject.subObjectName
    global.local.emit('onSendNotification', { playerUIHeroId: hero.id, logRecipientId: hero.id, toast: true, log: true, text: 'You can\'t pick this up'})
  }

  onEditHero(updatedHero) {
    if(updatedHero.spaceBarBehavior) {
      // global.local.emit('onSendNotification', { playerUIHeroId: mod.ownerId, toast: true, text: 'Press Space Bar', viewControlsOnClick: true })
    }
    //
    // if(updatedHero.arrowKeysBehavior || updatedHero.spaceBarBehavior || updatedHero.zButtonBehavior || updatedHero.xButtonBehavior || updatedHero.cButtonBehavior) {
    //   global.local.emit('onSendNotification', { playerUIHeroId: updatedHero.id, toast: true, text: 'Your controls updated have been updated. Click to see more', viewControlsOnClick: true })
    // }
  }

  onHeroEquip(hero, subObject) {
    if(hero.id === HERO.id) AUDIO.play(GAME.theme.audio.onHeroEquip)
    if(subObject.actionButtonBehavior) {
      // global.local.emit('onSendNotification', { playerUIHeroId: hero.id, toast: true, text: 'Your controls updated have been updated. Click to see more', viewControlsOnClick: true })
    }
  }

  onHeroRespawn(hero) {
    if(hero.id === HERO.id) AUDIO.play(GAME.theme.audio.onHeroRespawn)
  }

  onModEnabled(mod) {
    if(mod.ownerId === HERO.id) AUDIO.play(GAME.theme.audio.onModEnabled)
    if(mod.effectJSON.spaceBarBehavior) {
      // global.local.emit('onSendNotification', { playerUIHeroId: mod.ownerId, toast: true, text: 'Press Space Bar', viewControlsOnClick: true })
    }
    if(mod.effectJSON.creator) {
      global.emitGameEvent('onUpdatePlayerUI', GAME.heros[mod.ownerId])
    }
    // if(mod.effectJSON.arrowKeysBehavior || mod.effectJSON.spaceBarBehavior || mod.effectJSON.zButtonBehavior || mod.effectJSON.xButtonBehavior || mod.effectJSON.cButtonBehavior) {
    //   global.local.emit('onSendNotification', { playerUIHeroId: mod.ownerId, toast: true, text: 'Your controls updated have been updated. Click to see more', viewControlsOnClick: true })
    // }
  }

  onModDisabled(mod) {
    if(mod.ownerId === HERO.id) AUDIO.play(GAME.theme.audio.onModDisabled)
    // if(mod.effectJSON.arrowKeysBehavior || mod.effectJSON.spaceBarBehavior || mod.effectJSON.zButtonBehavior || mod.effectJSON.xButtonBehavior || mod.effectJSON.cButtonBehavior) {
    //   global.local.emit('onSendNotification', { playerUIHeroId: mod.ownerId, toast: true, text: 'Your controls updated have been updated. Click to see more', viewControlsOnClick: true })
    // }
  }

  onHeroMutate(hero) {
    if(hero.id === HERO.id) AUDIO.play(GAME.theme.audio.onModEnabled)
  }

  onHeroDialogueNext(hero) {
    if(hero.id === HERO.id) AUDIO.play(GAME.theme.audio.onHeroDialogueNext)
  }
  onHeroDialogueStart(hero) {
    if(hero.id === HERO.id) AUDIO.play(GAME.theme.audio.onHeroDialogueStart)
  }
  onHeroOptionStart(hero) {
    if(hero.id === HERO.id) AUDIO.play(GAME.theme.audio.onHeroDialogueStart)
  }
  onHeroOptionComplete(hero) {
    if(hero.id === HERO.id) AUDIO.play(GAME.theme.audio.onHeroOptionComplete)
  }
  onHeroCanInteract(hero, object) {
    if(hero.id === HERO.id) AUDIO.play(GAME.theme.audio.onHeroCanInteract)
  }

  onEditObjects(objects) {
    // PIXIMAP.onObjectAnimation = function(type, objectId, options = {}) {
    //
    // if(options.animationType === 'particle') {
    //   const customEmitter = initEmitter(object, options.libraryAnimationName, options, { hasNoOwner: true })
    //   setTimeout(() => {
    //     PIXIMAP.deleteEmitter(customEmitter)
    //   }, 10000)
    // }
    if(objects.length == 1) {
      const object = OBJECTS.getObjectOrHeroById(objects[0].id)
      if(object.tags.invisible) return
      PIXIMAP.onObjectAnimation('editObject', objects[0].id)
    }
  }

  onAddSubObject(owner) {
    if(owner.tags.invisible) return
    PIXIMAP.onObjectAnimation('editObject', owner.id)
  }
  onRemoveSubObject(owner) {
    if(owner.tags.invisible) return
    PIXIMAP.onObjectAnimation('editObject', owner.id)
  }
  onEditSubObject(ownerId) {
    const owner = OBJECTS.getObjectOrHeroById(ownerId)
    if(owner.tags.invisible) return
    PIXIMAP.onObjectAnimation('editObject', ownerId)
  }

  onEditHero(hero) {
    if(hero.tags && hero.tags.invisible) return
    PIXIMAP.onObjectAnimation('editObject', hero.id)
  }

  onEditTrigger(ownerId) {
    const owner = OBJECTS.getObjectOrHeroById(ownerId)
    if(owner.tags.invisible) return
    PIXIMAP.onObjectAnimation('editObject', ownerId)
  }
  onAddTrigger(ownerId) {
    const owner = OBJECTS.getObjectOrHeroById(ownerId)
    if(owner.tags.invisible) return
    PIXIMAP.onObjectAnimation('editObject', ownerId)
  }
  onDeleteTrigger(ownerId) {
    const owner = OBJECTS.getObjectOrHeroById(ownerId)
    if(owner.tags.invisible) return
    PIXIMAP.onObjectAnimation('editObject', ownerId)
  }
}

global.NOTIFICATIONSCONTROL = new NotificationsControl()
