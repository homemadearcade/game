// notificationLog,
// notificationChat,
// notificationToast,
// notificationModal,
// notificationModalHeader,
// notificationText,

// notificationDuration,

// notificationAllHeros,
// notificationAllHerosInvolved,

class NotificationsControl{
  onHeroDeposit(hero, newObject) {
    let message =  'You deposited ' + newObject.subObjectName
    if(newObject.count > 1) {
      message = 'You deposited ' + newObject.count + ' ' + newObject.subObjectName
    }
    window.socket.emit('sendNotification', { playerUIHeroId: hero.id, logRecipientId: hero.id, toast: true, log: true, text: message})
  }

  onHeroWithdraw(hero, newObject) {
    let message =  'You withdrew ' + newObject.subObjectName
    if(newObject.count > 1) {
      message = 'You withdrew ' + newObject.count + ' ' + newObject.subObjectName
    }
    window.socket.emit('sendNotification', { playerUIHeroId: hero.id, logRecipientId: hero.id, toast: true, log: true, text: message})
  }

  onHeroTouchStart(hero) {
    // AUDIO.play('')
  }

  onHeroGroundJump() {
    AUDIO.play(GAME.theme.audio.onHeroGroundJump)
  }

  onGameStarted() {
    AUDIO.play(GAME.theme.audio.onGameStarted)
  }

  onUpdateHero(hero) {
    if(hero.id !== HERO.id) return
    if(hero.mod().tags.gravityY || GAME.world.tags.allMovingObjectsHaveGravityY) {
      if(hero.onGround && (hero.velocityX || hero._flatVelocityX || hero.velocityY || hero._flatVelocityY) ) {
        AUDIO.playLoop({
          id: 'walking',
          soundIds: [
            GAME.theme.audio['heroMoving--retro']
          ]
        })
      } else {
        AUDIO.stopLoop('walking')
      }
    } else {
      AUDIO.stopLoop('walking')
    }
  }

  onHeroCameraEffect() {
    //???
  }

  onObjectDestroyed(object, destroyer) {
    if(object.mod().width > 100 || object.mod().height > 100) {
      AUDIO.play(GAME.theme.audio['onObjectDestroyed--big'])
    } else {
      AUDIO.play(GAME.theme.audio['onObjectDestroyed--small'])
    }
  }

  onHeroWithdrawFail(hero, subObject) {
    //. You already have a ' + subObject.subObjectName
    window.socket.emit('sendNotification', { playerUIHeroId: hero.id, logRecipientId: hero.id, toast: true, log: true, text: 'You can\'t withraw'})
  }

  onHeroDepositFail(hero, subObject) {
    //Target already has a ' + subObject.subObjectName
    window.socket.emit('sendNotification', { playerUIHeroId: hero.id, logRecipientId: hero.id, toast: true, log: true, text: 'You can\'t deposit'})
  }

  onHeroDrop(hero, object) {
    let message =  'You dropped ' + object.subObjectName
    if(object.count > 1) {
      message = 'You dropped ' + object.count + ' ' + object.subObjectName
    }
    window.socket.emit('sendNotification', { playerUIHeroId: hero.id, logRecipientId: hero.id, toast: true, log: true, text: message})
  }

  onHeroPickup(hero, subObject) {
    let message = 'You picked up ' + subObject.subObjectName
    if(subObject.count > 1) {
      message = 'You picked up ' + subObject.count + ' ' + subObject.subObjectName
    }
    window.socket.emit('sendNotification', { playerUIHeroId: hero.id, logRecipientId: hero.id, toast: true, log: true, text: message})
  }

  onHeroPickupFail(hero, subObject) {
    window.socket.emit('sendNotification', { playerUIHeroId: hero.id, logRecipientId: hero.id, toast: true, log: true, text: 'You can\'t pick this up. You already have a ' + subObject.subObjectName})
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
    if(subObject.actionButtonBehavior) {
      // window.socket.emit('sendNotification', { playerUIHeroId: hero.id, toast: true, text: 'Your controls updated have been updated. Click to see more', viewControlsOnClick: true })
    }
  }

  onModEnabled(mod) {
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
    // if(mod.effectJSON.arrowKeysBehavior || mod.effectJSON.spaceBarBehavior || mod.effectJSON.zButtonBehavior || mod.effectJSON.xButtonBehavior || mod.effectJSON.cButtonBehavior) {
    //   window.socket.emit('sendNotification', { playerUIHeroId: mod.ownerId, toast: true, text: 'Your controls updated have been updated. Click to see more', viewControlsOnClick: true })
    // }
  }
}

window.NOTIFICATIONSCONTROL = new NotificationsControl()
