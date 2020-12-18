import { startQuest, completeQuest } from './heros/quests.js'
import effects from './effects.js'
import { testEventMatch } from './conditions.js'

function onPlayerIdentified() {
  global.triggerEvents = {
    onHeroCollide: { mainObject: 'hero', guestObject: 'anything' },
    onHeroLand: { mainObject: 'hero', guestObject: 'anything' },
    onHeroPowerLand: { mainObject: 'hero', guestObject: 'anything' },
    onHeroHeadHit: { mainObject: 'hero', guestObject: 'anything' },
    onHeroInteract: { mainObject: 'hero', guestObject: 'anything' },
    'onHeroInteract--integrated': { mainObject: 'hero', guestObject: 'anything' },
    onHeroAwake: { mainObject: 'hero', guestObject: null },
    onHeroDestroyed: { mainObject: 'hero', guestObject: 'anything', guestObjectOptional: true },
    onHeroAware: { mainObject: 'hero', guestObject: 'anything' },
    onHeroUnaware: { mainObject: 'hero', guestObject: 'anything' },
    onHeroEnter: { mainObject: 'hero', guestObject: 'anything' },
    onHeroLeave: { mainObject: 'hero', guestObject: 'anything' },
    onHeroDialogueComplete: { mainObject: 'hero', guestObject: 'anything' },
    onHeroStartQuest: { mainObject: 'hero', guestObject: 'questId', guestObjectOptional: true },
    onHeroCompleteQuest: { mainObject: 'hero', guestObject: 'questId', guestObjectOptional: true },
    onHeroPickup: { mainObject: 'hero', guestObject: 'object' },
    onHeroDrop: { mainObject: 'hero', guestObject: 'subobject' },
    onHeroWithdraw: { mainObject: 'hero', guestObject: 'anything' },
    onHeroDeposit: { mainObject: 'hero', guestObject: 'object' },
    // onHeroRespawn: { mainObject: 'hero', guestObject: null },
    // onHeroEquip: { mainObject: 'hero', guestObject: 'anything'},
    // onHeroTurn
    onGameStarted: { mainObject: null, guestObject: null },
    onStoryStart: { mainObject: null, guestObject: null },
    onObjectAwake: { mainObject: 'object', guestObject: null },
    onObjectDestroyed: { mainObject: 'object', guestObject: 'anything', guestObjectOptional: true },
    onObjectAware: { mainObject: 'object', guestObject: 'anything' },
    onObjectUnaware: { mainObject: 'object', guestObject: 'anything' },
    onObjectEnter: { mainObject: 'object', guestObject: 'anything' },
    onObjectLeave: { mainObject: 'object', guestObject: 'anything' },
    onObjectCollide: { mainObject: 'object', guestObject: 'anything' },
    // onObjectInteractable: { mainObject: 'object', guestObject: 'hero' },
    onObjectTouchStart: { mainObject: 'object', guestObject: 'anything' },
    onObjectTouchEnd: { mainObject: 'object', guestObject: 'anything' },
    onHeroTouchStart: { mainObject: 'hero', guestObject: 'anything' },
    onHeroTouchEnd: { mainObject: 'hero', guestObject: 'anything' },
    onTagDepleted: { mainObject: 'tag' },
    onAnticipateCompleted: {},
    onSequenceComplete: {},
    // 'onUpdate':{} //-> for sequences with conditions
  }
  // 'onHeroExamine' <-- only for notifications/logs
  // 'onHeroSwitch'

    // 'onHeroChooseOption',
    // 'onObjectSpawn',
    // 'onHeroCanInteract'
    // 'onQuestFail',
    // 'onTimerEnd',
}

function deleteTrigger(object, triggerId) {
  if(object.triggers[triggerId] && object.triggers[triggerId].removeEventListener && typeof object.triggers[triggerId].removeEventListener === 'function') object.triggers[triggerId].removeEventListener()
  delete object.triggers[triggerId]
  delete object.triggers.undefined
}

function removeTriggerEventListener(object, triggerId) {
  if(object.triggers[triggerId] && object.triggers[triggerId].removeEventListener && typeof object.triggers[triggerId].removeEventListener === 'function') object.triggers[triggerId].removeEventListener()
}

function addTrigger(ownerObject, trigger) {
  const eventName = trigger.eventName

  if(!ownerObject.triggers) ownerObject.triggers = {}

  ownerObject.triggers[trigger.id] = trigger

  // make sure not to reinitilize this trigger on page reload
  if(typeof trigger.triggerPool !== 'number') {
    let initialTriggerPool = trigger.initialTriggerPool
    if(typeof initialTriggerPool !== 'number') {
      initialTriggerPool = -1
    }
    Object.assign(ownerObject.triggers[trigger.id], {
       triggerPool: initialTriggerPool,
       eventCount: 0,
       disabled: false,
     })
  }

  // honestly cant believe this was happening..lol I got a lot of work to do
  if(!PAGE.role.isHost) return

  ownerObject.triggers[trigger.id].removeEventListener = global.local.on(eventName, (mainObject, guestObject) => {
    // console.log('triggered', eventName)
    fireTrigger(trigger, ownerObject, mainObject, guestObject, true)
  })
}

function fireTrigger(trigger, ownerObject, mainObject, guestObject, fire = true) {
  if(!GAME.gameState.started) return
  // console.log(trigger.eventName, mainObject, guestObject, trigger, ownerObject)

  let fx = () => triggerEffectSmart(trigger, ownerObject, mainObject, guestObject)

  let eventMatch = false

  if(trigger.eventName === 'onTagDepleted') {
    eventMatch = mainObject === trigger.mainObjectTag
  } else {
    eventMatch = testEventMatch(trigger.eventName, mainObject, guestObject, trigger, ownerObject)
  }

  if(eventMatch) {
    if(trigger.triggerPool == 0) return
    if(fire) trigger.eventCount++
    if(!trigger.eventThreshold) {
      if(fire) {
        fx()
        if(trigger.triggerPool > 0) trigger.triggerPool--
      }
      return true
    } else if(trigger.eventCount >= trigger.eventThreshold) {
      if(fire) {
        fx()
        if(trigger.triggerPool > 0) trigger.triggerPool--
      }
      return true
    }
  }
}

function triggerEffectSmart(trigger, ownerObject, mainObject, guestObject) {
  const effectedObjects = effects.getEffectedObjects(trigger, mainObject, guestObject, ownerObject)

  let effector = guestObject
  if(trigger.effectorObject) {
    if(trigger.effectorObject === 'mainObject') {
      effector = mainObject
    } else if(trigger.effectorObject === 'guestObject') {
      effector = guestObject
    } else if(trigger.effectorObject === 'ownerObject') {
      effector = ownerObject
    } else if(trigger.effectorObject !== 'default') {
      effector = GAME.objectsById[trigger.effectorObject]
      if(!effector) {
        effector = GAME.heros[trigger.effectorObject]
      }
      if(!effector) {
        effector = defaultEffector
      }
    }
  }

  processTriggerTags(effector)

  // inside of ObjectId is currently the only id selector that can also select main Object, guest Object, etc
  // this converts the condition value to an id if its not already an id essentially
  // this also exists when a sequence item is processed
  if(trigger.conditionType === 'insideOfObjectId') {
    if(trigger.conditionValue === 'mainObject') {
      trigger.conditionValue = mainObject.id
    } else if(trigger.conditionValue === 'guestObject') {
      trigger.conditionValue = guestObject.id
    } else if(trigger.conditionValue === 'ownerObject') {
      trigger.conditionValue = ownerObject.id
    }
  }

  const herosNotified = []
  effectedObjects.forEach((effected) => {
    if(trigger.notificationText) {
      if(effected.tags.hero) {
        global.socket.emit('sendNotification', { playerUIHeroId: effected.id, chatId: effected.id, logRecipientId: effected.id, toast: trigger.notificationToast, log: trigger.notificationLog, chat: trigger.notificationChat, modal: trigger.notificationModal, text: trigger.notificationText, modalHeader: trigger.notificationModalHeader, duration: trigger.notificationDuration })
        herosNotified.push(effected.id)
      } else global.socket.emit('sendNotification', { chatId: effected.id, log: trigger.notificationLog, chat: trigger.notificationChat, text: trigger.notificationText, duration: trigger.notificationDuration })
    }

    processTriggerTags(effected)

    effects.processEffect(trigger, effected, effector, ownerObject)
  })

  // if(trigger.notificationAllHerosInvolved) {
  //   let heroId = null
  //   if(ownerObject.tags.hero) {
  //     heroId = ownerObject.id
  //   }
  //   if(mainObject.tags.hero) {
  //     heroId = ownerObject.id
  //   }
  //   if(guestObject.tags.hero) {
  //     heroId = ownerObject.id
  //   }
  //   global.socket.emit('sendNotification', { heroId, toast: trigger.notificationToast, log: trigger.notificationLog, chat: trigger.notificationChat, text: trigger.notificationText })
  // }

  if(trigger.notificationAllHeros) {
    GAME.heroList.forEach((hero) => {
      if(herosNotified.indexOf(hero.id) > -1) return
      global.socket.emit('sendNotification', { playerUIHeroId: hero.id, logRecipientId: hero.id, chatId: hero.id, toast: trigger.notificationToast, chat: trigger.notificationChat, text: trigger.notificationText, log: trigger.notificationLog, modal: trigger.notificationModal, modalHeader: trigger.notificationModalHeader, duration: trigger.notificationDuration})
    })
  }

  if(trigger.triggerDestroyAfter) {
    if(ownerObject) ownerObject._destroy = true
  }
}

function processTriggerTags(object) {
  if(!object || !object.mod().tags) return
  if(object.mod().tags.stopGlowingOnTrigger) {
    object.tags.glowing = false
  }
  if(object.mod().tags.shakeOnTrigger) {
    object.tags.shake = true
    setTimeout(() => {
      object.tags.shake = false
    }, 100)
  }
  if(object.mod().tags.flashOnTrigger) {
    let prevColor = object.color
    object.color = 'white'
    setTimeout(() => {
      object.color = prevColor
    }, 100)
  }
}

export default {
  onPlayerIdentified,
  addTrigger,
  deleteTrigger,
  removeTriggerEventListener,
  fireTrigger,
}
