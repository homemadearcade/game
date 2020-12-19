class EventEmitter {
  constructor(mock) {
    if(mock) {
      this.mockSocket = true
    }
    this.events = {};
  }

  emit = (eventName, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) => {
    let event
    if(this.events[eventName]) {
      event = this.events[eventName].slice()
    } else event = []

    if(!this.mockSocket) {
      let debugEvent = (eventName == 'onObjectUnaware' || eventName == 'onObjectAware' || eventName == 'onObjectInteractable' || eventName == 'onObjectEnter' || eventName == 'onObjectLeave' || eventName == 'onHeroEnter' || eventName == 'onHeroLeave' || eventName == 'onHeroAware' || eventName == 'onHeroUnaware')
      // debugEvent = true

      // if(eventName == 'onObjectUnaware' || eventName == 'onObjectAware') console.log(eventName)
      const serverEvent = eventName == 'networkUpdateHerosPos' || eventName == 'onNetworkUpdateHerosPos' || eventName == 'networkUpdateGameState' || eventName == 'onNetworkUpdateGameState' || eventName == 'networkUpdateObjects' || eventName === 'onNetworkUpdateObjects' || eventName == 'networkUpdateHeros' || eventName == 'onNetworkUpdateHeros'

      if(!serverEvent && !debugEvent && eventName !== 'onSendHeroKeyDown' && eventName !== 'onNetworkUpdateHerosPos' && eventName !== 'onNetworkUpdateObjectsComplete' && eventName !== 'onHeroHeadHit' && eventName !== 'onHeroLand' && eventName !== 'onSendHeroInput' && eventName !== 'onKeyDown' && eventName !== 'onSendHeroMapEditor' && eventName !== 'onUpdateGameState' && eventName !== 'onNetworkUpdateHero' && eventName !== 'onNetworkUpdateObjects' && eventName !== 'onUpdate' && eventName !== 'onRender' && eventName !== 'onEmitGameEvent' && eventName !== 'emitGameEvent' && eventName !== 'onUpdateHero' && eventName !== 'onUpdateObject' && eventName !== 'onObjectTouchStart' && eventName !== 'onObjectTouchEnd' && eventName !== 'onHeroTouchEnd' && eventName !== 'onHeroTouchStart' && eventName !== 'onObjectCollide' && eventName !== 'onHeroCollide' && eventName !== 'onSendHeroKeyUp' && eventName !== 'onKeyUp') console.log(eventName)
      //
      // if(NOTIFICATIONSCONTROL[eventName]) {
      //   event.push(NOTIFICATIONSCONTROL[eventName])
      // }

      if(eventName === 'onEmitGameEvent') console.log(arg1)



      // if(PAGE[eventName]) {
      //   event.push(PAGE[eventName])
      // }

      if(GAME[eventName]) {
        event.push(GAME[eventName])
      }

      if(GAME_HOST[eventName]) {
        event.push(GAME_HOST[eventName])
      }

      // if(PAGE.role.isHost) {
      //   try {
      //     if(ARCADE.defaultCustomGame && ARCADE.defaultCustomGame[eventName]) {
      //       event.push(ARCADE.defaultCustomGame[eventName])
      //     }
      //
      //     if(GAME.world.tags && GAME.world.tags.overrideCustomGameCode) {
      //       if(ARCADE.customGame && ARCADE.customGame[eventName]) {
      //         event.push(ARCADE.customGame[eventName])
      //       }
      //     }
      //
      //     if(ARCADE.liveCustomGame && ARCADE.liveCustomGame[eventName]) {
      //       event.push(ARCADE.liveCustomGame[eventName])
      //     }
      //   } catch(e) {
      //     console.error(e)
      //   }
      // }

      // if(ARCADE[eventName]) {
      //   event.push(ARCADE[eventName])
      // }

      if(OBJECTS[eventName]) {
        event.push(OBJECTS[eventName])
      }

      if(HERO[eventName]) {
        event.push(HERO[eventName])
      }

      if(PHYSICS[eventName]) {
        event.push(PHYSICS[eventName])
      }

      // if(eventName === 'onRender' && !PAGE.role.isPlayEditor){
      //   if(ARCADE.defaultCustomGame && ARCADE.defaultCustomGame[eventName]) {
      //     event.push(ARCADE.defaultCustomGame[eventName])
      //   }
      //   if(ARCADE.customGame && ARCADE.customGame[eventName]) {
      //     event.push(ARCADE.customGame[eventName])
      //   }
      //   if(ARCADE.liveCustomGame && ARCADE.liveCustomGame[eventName]) {
      //     event.push(ARCADE.liveCustomGame[eventName])
      //   }
      // }

      if(TRACKING[eventName]) {
        event.push(TRACKING[eventName])
      }
    }

    if( event ) {
      event.forEach(fn => {
         fn.call(null, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8);
       });
     }
  }

  on = (eventName, fn) => {
    if(!this.events[eventName]) {
      this.events[eventName] = [];
    }

    this.events[eventName].push(fn);

    return () => {
      this.events[eventName] = this.events[eventName].filter(eventFn => {
        return fn !== eventFn
      });
    }
  }
}

global.local = new EventEmitter()
global.mockSocket = new EventEmitter(true)
