// notificationLog,
// notificationChat,
// notificationToast,
// notificationModal,
// notificationModalHeader,
// notificationText,

// notificationDuration,

// notificationAllHeros,
// notificationAllHerosInvolved,

function setHeroWalkingSound (hero) {
  if(hero.tags.walkRetro) {
    hero._walkingSound = 'retro'
  }

  if(hero.tags.walkVehicle) {
    hero._walkingSound = 'vehicle'
  }

  if(hero.tags.walkQuality) {
    const object = OBJECTS.getObjectOrHeroById(hero._walkingOnId)
    if(object.tags.sand) {
      hero._walkingSound = 'sand'
    } else if(object.tags.ice) {
      hero._walkingSound = 'ice'
    } else {
      hero._walkingSound = 'dirt'
    }
  }

  if(!hero._walkingSound) hero._walkingSound = 'retro'
}

class NotificationsControl{
  onHeroDeposit(hero, newObject) {
    if(hero.id === HERO.id) AUDIO.play(GAME.theme.audio.onHeroDrop)

    if(PAGE.role.isHost) {
      let message =  'You deposited ' + newObject.subObjectName
      if(newObject.count > 1) {
        message = 'You deposited ' + newObject.count + ' ' + newObject.subObjectName
      }
      window.socket.emit('sendNotification', { playerUIHeroId: hero.id, logRecipientId: hero.id, toast: true, log: true, text: message})
    }
  }

  onHeroWithdraw(hero, newObject) {
    if(hero.id === HERO.id) AUDIO.play(GAME.theme.audio.onHeroPickup)

    if(PAGE.role.isHost) {

      let message =  'You withdrew ' + newObject.subObjectName
      if(newObject.count > 1) {
        message = 'You withdrew ' + newObject.count + ' ' + newObject.subObjectName
      }
      window.socket.emit('sendNotification', { playerUIHeroId: hero.id, logRecipientId: hero.id, toast: true, log: true, text: message})
    }
  }

  onHeroTouchStart(hero) {
    // AUDIO.play('')
  }

  onHeroShootBullet(hero) {
    if(hero.id === HERO.id) AUDIO.play(GAME.theme.audio.onHeroShootBullet)
  }

  // onHeroShootLaserTool(hero) {
  //   if(hero.id === HERO.id) AUDIO.play(GAME.theme.audio.onHeroShootLaserTool)
  // }

  onHeroFloatJump(hero) {
    if(hero.id === HERO.id) AUDIO.play(GAME.theme.audio.onHeroFloatJump)
  }

  onHeroDash(hero) {
    if(hero.id === HERO.id) AUDIO.play(GAME.theme.audio.onHeroDash)
  }

  onHeroTeleDash(hero) {
    if(hero.id === HERO.id) AUDIO.play(GAME.theme.audio.onHeroTeleDash)
  }

  onHeroGroundJump(hero) {
    if(hero.id === HERO.id) AUDIO.play(GAME.theme.audio.onHeroGroundJump)
  }

  onStartPregame() {
    AUDIO.play(GAME.theme.audio.onStartPregame)
  }

  onUpdateHero(hero) {
    if(PAGE.role.isHost) {
      hero._walkingSound = null

      if(!hero.mod().tags.inSpace && (hero.mod().tags.gravityY || GAME.world.tags.allMovingObjectsHaveGravityY)) {
        if(hero.onGround && (hero.velocityX || hero._flatVelocityX || hero.velocityY || hero._flatVelocityY) ) {
          setHeroWalkingSound(hero)
        }
      } else if(hero.mod().tags.inSpace) {
        setHeroWalkingSound(hero)
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
    if(PAGE.role.isHost) window.socket.emit('sendNotification', { playerUIHeroId: hero.id, logRecipientId: hero.id, toast: true, log: true, text: 'You can\'t withraw'})
  }

  onHeroDepositFail(hero, subObject) {
    //Target already has a ' + subObject.subObjectName
    if(PAGE.role.isHost) window.socket.emit('sendNotification', { playerUIHeroId: hero.id, logRecipientId: hero.id, toast: true, log: true, text: 'You can\'t deposit'})
  }

  onHeroDrop(hero, object) {
    if(PAGE.role.isHost) {
      window.socket.emit('sendNotification', { playerUIHeroId: hero.id, logRecipientId: hero.id, toast: true, log: true, text: message})
      if(hero.id === HERO.id) AUDIO.play(GAME.theme.audio.onHeroDrop)
      let message =  'You dropped ' + object.subObjectName
      if(object.count > 1) {
        message = 'You dropped ' + object.count + ' ' + object.subObjectName
      }
    }
  }

  onHeroLand(hero, landingObject) {
    PIXIMAP.onFakeObjectAnimation('groundDisturbanceRight', { ...hero, y: hero.y + (hero.height/2), color: landingObject.color || GAME.world.defaultObjectColor })
    PIXIMAP.onFakeObjectAnimation('groundDisturbanceLeft', { ...hero, y: hero.y + (hero.height/2), color: landingObject.color || GAME.world.defaultObjectColor })
  }

  onHeroPickup(hero, subObject) {
    if(hero.id === HERO.id) {
      AUDIO.play(GAME.theme.audio.onHeroPickup)
    }

    if(PAGE.role.isHost) {
      let message = 'You picked up ' + subObject.subObjectName
      if(subObject.count > 1) {
        message = 'You picked up ' + subObject.count + ' ' + subObject.subObjectName
      }
      window.socket.emit('sendNotification', { playerUIHeroId: hero.id, logRecipientId: hero.id, toast: true, log: true, text: message})
    }
  }

  onHeroPickupFail(hero, subObject) {
    if(PAGE.role.isHost) window.socket.emit('sendNotification', { playerUIHeroId: hero.id, logRecipientId: hero.id, toast: true, log: true, text: 'You can\'t pick this up. You already have a ' + subObject.subObjectName})
  }

  onEditHero(updatedHero) {
    if(updatedHero.spaceBarBehavior) {
      // window.socket.emit('sendNotification', { playerUIHeroId: mod.ownerId, toast: true, text: 'Press Space Bar', viewControlsOnClick: true })
    }
    //
    // if(updatedHero.arrowKeysBehavior || updatedHero.spaceBarBehavior || updatedHero.zButtonBehavior || updatedHero.xButtonBehavior || updatedHero.cButtonBehavior) {
    //   window.socket.emit('sendNotification', { playerUIHeroId: updatedHero.id, toast: true, text: 'Your controls updated have been updated. Click to see more', viewControlsOnClick: true })
    // }
  }

  onHeroEquip(hero, subObject) {
    if(hero.id === HERO.id) AUDIO.play(GAME.theme.audio.onHeroEquip)
    if(subObject.actionButtonBehavior) {
      // window.socket.emit('sendNotification', { playerUIHeroId: hero.id, toast: true, text: 'Your controls updated have been updated. Click to see more', viewControlsOnClick: true })
    }
  }

  onHeroRespawn(hero) {
    if(hero.id === HERO.id) AUDIO.play(GAME.theme.audio.onHeroRespawn)
  }

  onModEnabled(mod) {
    if(mod.ownerId === HERO.id) AUDIO.play(GAME.theme.audio.onModEnabled)
    if(mod.effectJSON.spaceBarBehavior) {
      // window.socket.emit('sendNotification', { playerUIHeroId: mod.ownerId, toast: true, text: 'Press Space Bar', viewControlsOnClick: true })
    }
    if(mod.effectJSON.creator) {
      window.emitGameEvent('onUpdatePlayerUI', GAME.heros[mod.ownerId])
    }
    // if(mod.effectJSON.arrowKeysBehavior || mod.effectJSON.spaceBarBehavior || mod.effectJSON.zButtonBehavior || mod.effectJSON.xButtonBehavior || mod.effectJSON.cButtonBehavior) {
    //   window.socket.emit('sendNotification', { playerUIHeroId: mod.ownerId, toast: true, text: 'Your controls updated have been updated. Click to see more', viewControlsOnClick: true })
    // }
  }

  onModDisabled(mod) {
    if(mod.ownerId === HERO.id) AUDIO.play(GAME.theme.audio.onModDisabled)
    // if(mod.effectJSON.arrowKeysBehavior || mod.effectJSON.spaceBarBehavior || mod.effectJSON.zButtonBehavior || mod.effectJSON.xButtonBehavior || mod.effectJSON.cButtonBehavior) {
    //   window.socket.emit('sendNotification', { playerUIHeroId: mod.ownerId, toast: true, text: 'Your controls updated have been updated. Click to see more', viewControlsOnClick: true })
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
  onHeroCanInteract(hero) {
    if(hero.id === HERO.id) AUDIO.play(GAME.theme.audio.onHeroCanInteract)
  }
}

window.NOTIFICATIONSCONTROL = new NotificationsControl()
