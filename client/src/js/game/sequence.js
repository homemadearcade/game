import effects from './effects.js'
import { testCondition, testEventMatch } from './conditions.js'
import _ from 'lodash'

function endSequence(sequence) {
  const { pauseGame, items } = sequence

  if(pauseGame) {
    GAME.gameState.paused = false
  }

  global.local.emit('onSequenceComplete', sequence.id)

  GAME.gameState.sequenceQueue = GAME.gameState.sequenceQueue.filter((s) => {
    if(s.id === sequence.id) return false
    return true
  })
}

function mapSequenceItems(sequenceItems) {
  return sequenceItems.slice().reduce((map, item, index) => {
    const itemCopy = { ...item }
    if(itemCopy.next === 'sequential') {
      if(sequenceItems[index+1]) {
        itemCopy.next = sequenceItems[index+1].id
      } else {
        itemCopy.next = 'end'
      }
    }
    if(itemCopy.sequenceType === 'sequenceChoice') {
      itemCopy.options = itemCopy.options.map((option) => {
        const optionCopy = {...option}
        if(optionCopy.next === 'sequential') {
          if(sequenceItems[index+1]) {
            optionCopy.next = sequenceItems[index+1].id
          } else {
            optionCopy.next = 'end'
          }
        }
        optionCopy.id = 'option-'+global.uniqueID()
        map[optionCopy.id] = optionCopy
        return optionCopy
      })
    }

    if(itemCopy.sequenceType === 'sequenceCondition') {
      if(itemCopy.failNext === 'sequential') {
        if(sequenceItems[index+1]) {
          itemCopy.failNext = sequenceItems[index+1].id
        } else {
          itemCopy.failNext = 'end'
        }
      }
      if(itemCopy.passNext === 'sequential') {
        if(sequenceItems[index+1]) {
          itemCopy.passNext = sequenceItems[index+1].id
        } else {
          itemCopy.passNext = 'end'
        }
      }
    }
    map[itemCopy.id] = itemCopy
    return map
  }, {})
}

function startSequence(sequenceId, context) {
  const sequence = {...GAME.library.sequences[sequenceId]}

  if(sequence.state && sequence.state.disabled) return console.log('sequence disabled', sequenceId)

  if(!sequence || !sequence.items) return console.log('no sequence with id ', sequenceId)

  const { pauseGame, items } = sequence
  if(pauseGame) {
    GAME.gameState.paused = true
  }

  sequence.mainObject = context.mainObject
  sequence.guestObject = context.guestObject
  sequence.ownerObject = context.ownerObject
  sequence.currentItemId = sequence.items[0].id
  sequence.eventListeners = []
  sequence.itemMap = mapSequenceItems(items)

  GAME.gameState.sequenceQueue.push(sequence)
}

function togglePauseSequence(sequence) {
  if(sequence.paused) {
    sequence.paused = false
    if(sequence.currentTimerId) {
      GAME.gameState.timeoutsById[sequence.currentTimerId] = false
    }
  } else {
    sequence.paused = true
    if(sequence.currentTimerId) {
      GAME.gameState.timeoutsById[sequence.currentTimerId] = true
    }
  }
}

function processSequence(sequence) {
  const item = sequence.itemMap[sequence.currentItemId]
  if(!item) {
    if(sequence.currentItemId === 'end' && !sequence.paused) {
      endSequence(sequence)
    }
    return
    // return console.log('sequenceid: ', sequence.id, ' without item: ', sequence.currentItemId)
  }
  if(item.waiting || sequence.paused) {
    return
  }

  let defaultEffected = sequence.mainObject
  let defaultEffector = sequence.guestObject

  console.log('processing', sequence.currentItemId, sequence.id)

  if(item.sequenceType === 'sequenceDialogue') {
    item.effectName = 'dialogue'
    if(defaultEffector.tags.hero && !defaultEffected.tags.hero) {
      effects.processEffect(item, defaultEffector, defaultEffected, sequence.ownerObject)
    } else {
      effects.processEffect(item, defaultEffected, defaultEffector, sequence.ownerObject)
    }
  }

  if(item.sequenceType === 'sequenceEffect') {
    const effectedObjects = effects.getEffectedObjects(item, sequence.mainObject, sequence.guestObject, sequence.ownerObject)

    let effector = defaultEffector

    if(item.effectorObject) {
      if(item.effectorObject === 'ownerObject') {
        effector = sequence.ownerObject
      } else if(item.effectorObject === 'mainObject') {
        effector = sequence.mainObject
      // } else if(item.effectorObject === 'mainObjectOwner') {
      //   effector = sequence.mainObject
      //   const MOOwner = OBJECTS.getObjectOrHeroById()
      } else if(item.effectorObject === 'guestObject') {
        effector = sequence.guestObject
      } else if(item.effectorObject !== 'default') {
        effector = GAME.objectsById[item.effectorObject]
        if(!effector) {
          effector = GAME.heros[item.effectorObject]
        }
      }
    }

    if(!effector) {
      effector = defaultEffector
    }

    // inside of ObjectId is currently the only id selector that can also select main Object, guest Object, etc
    // this converts the condition value to an id if its not already an id essentially
    // this also exists when a trigger is fired
    if(item.conditionType === 'insideOfObjectId') {
      if(item.conditionValue === 'mainObject') {
        item.conditionValue = sequence.mainObject.id
      } else if(item.conditionValue === 'guestObject') {
        item.conditionValue = sequence.guestObject.id
      }
    }

    effectedObjects.forEach((effected) => {
      effects.processEffect(item, effected, effector, sequence.ownerObject)
    })
  }

  if(item.sequenceType === 'sequenceChoice') {
    const effectedObjects = effects.getEffectedObjects(item, sequence.mainObject, sequence.guestObject, sequence.ownerObject)
    item.waiting = true
    effectedObjects[0].choiceOptions = item.options.slice()
    global.emitGameEvent('onHeroOptionStart', effectedObjects[0])
    effectedObjects[0].flags.showChoices = true
    effectedObjects[0].flags.paused = true
    if(defaultEffector) {
      effectedObjects[0].id = defaultEffector.id
      if(defaultEffector && defaultEffector.name) {
        effectedObjects[0].dialogueName = defaultEffector.name
      } else {
        effectedObjects[0].dialogueName = null
      }
    }

    global.emitGameEvent('onUpdatePlayerUI', effectedObjects[0])
    const removeEventListener = global.local.on('onHeroChooseOption', (heroId, choiceId) => {
      if(effectedObjects[0].id === heroId && sequence.itemMap[choiceId]) {
        removeEventListener()
        effectedObjects[0].flags.showChoices = false
        effectedObjects[0].flags.paused = false
        effectedObjects[0].dialogueName = null
        effectedObjects[0].dialogueId = null
        effectedObjects[0].choiceOptions = null
        effectedObjects[0]._cantInteract = true
        sequence.currentItemId = sequence.itemMap[choiceId].next
        if(sequence.currentItemId === 'end') {
          endSequence(sequence)
        }
        item.waiting = true
        global.emitGameEvent('onHeroOptionComplete', effectedObjects[0])
        global.emitGameEvent('onUpdatePlayerUI', effectedObjects[0])
      }
    })
    sequence.eventListeners.push(removeEventListener)
  }

  if(item.sequenceType === 'sequenceWait') {
    item.waiting = true
    if(item.conditionType === 'onTimerEnd') {
      sequence.currentTimerId = GAME.addTimeout(global.uniqueID(), item.conditionNumber || 10, () => {
        item.waiting = false
        sequence.currentItemId = item.next
        sequence.currentTimerId = null
        if(sequence.currentItemId === 'end') {
          endSequence(sequence)
        }
      })
    } else if(item.conditionType === 'onEvent') {
      const removeEventListener = global.local.on(item.conditionEventName, (mainObject, guestObject) => {
        const eventMatch = testEventMatch(item.conditionEventName, mainObject, guestObject, item, null, { testPassReverse: item.testPassReverse, testModdedVersion: item.testModdedVersion })
        if(eventMatch) {
          item.waiting = false
          sequence.currentItemId = item.next
          if(sequence.currentItemId === 'end') {
            endSequence(sequence)
          }
          removeEventListener()
        }
      })
      sequence.eventListeners.push(removeEventListener)
    } else if(item.conditionType === 'onAdminApproval') {
      if(PAGE.role.isArcadeMode) {
        sequence.currentItemId = item.next
      } else {
        sequence.paused = true
        sequence.currentItemId = item.next
        global.socket.emit('requestAdminApproval', 'unpauseSequence', { sequenceId: sequence.id, text: item.conditionValue || 'Sequence ' + sequence.id + ' needs approval to continue', approveButtonText: 'Resume', rejectButtonText: 'Stop', requestId: 'request-'+global.uniqueID()})
        return
      }
    } else if(item.conditionType === 'onPreviousItemCompleted') {
      // Dialogue
      // startSequence
      // anticiaptedAdd
      //
      // pathfindTo
      // goTo
      // onPathComplete
      //
      // Goal complete
      //
      // Animation end
      //
      // Sound end

      function resolveWaiting() {
        item.waiting = false
        sequence.currentItemId = item.next
        if(sequence.currentItemId === 'end') {
          endSequence(sequence)
        }
      }

      const previousItem = sequence.itemMap[sequence.previousItemId]
      if(previousItem.effectName && previousItem.effectName.indexOf('add') >= 0) {
        if(!OBJECTS.anticipatedForAdd) {
          sequence.currentItemId = previousItem.next
        } else {
          const removeEventListener = global.local.on('onAnticipateCompleted', (mainObject) => {
            resolveWaiting()
            removeEventListener()
          })
          sequence.eventListeners.push(removeEventListener)
        }
      }

      if(previousItem.sequenceType === 'sequenceCutscene') {
        const removeEventListener = global.local.on('onCutsceneCompleted', (mainObject) => {
          let idIndex = previousItem.effectedIds.indexOf(mainObject.id)
          if(idIndex >= 0) {
            previousItem.effectedIds.splice(idIndex, 1)
          }
          if(previousItem.effectedIds.length === 0) {
            resolveWaiting()
            removeEventListener()
          }
        })
        sequence.eventListeners.push(removeEventListener)
      }
    }
  }

  if(item.sequenceType === 'sequenceCondition') {
    if(item.conditionType === 'onAdminApproval') {
     if(PAGE.role.isArcadeMode) {
       sequence.currentItemId = item.passNext
     } else {
       sequence.paused = true
       const requestId = 'request-'+global.uniqueID()
       global.socket.emit('requestAdminApproval', 'custom', { sequenceId: sequence.id, text: item.conditionValue || 'Sequence ' + sequence.id + ' needs approval to continue', approveButtonText: 'Yes', rejectButtonText: 'No', requestId})
       const removeEventListener = global.local.on('onResolveAdminApproval', (id, passed) => {
         if(id === requestId) {
           if(passed) {
             sequence.currentItemId = item.passNext
           } else {
             sequence.currentItemId = item.failNext
           }
           sequence.paused = false
           removeEventListener()
         }
       })
       sequence.eventListeners.push(removeEventListener)
       return
     }
   } else {
     const { allTestedMustPass, conditionJSON, testMainObject, testGuestObject, testWorldObject, testIds, testTags } = item

     let testObjects = []
     if(testMainObject) testObjects.push(sequence.mainObject)
     if(testGuestObject) testObjects.push(sequence.guestObject)
     if(testWorldObject) testObjects.push(GAME.world)

     testObjects = testObjects.concat(testIds.map((id) => {
       if(GAME.objectsById[id]) return GAME.objectsById[id]
       if(GAME.heros[id]) return GAME.heros[id]
     }))

     testObjects = testObjects.concat(testTags.reduce((arr, tag) => {
       let newArr = arr
       if(GAME.objectsByTag[tag]) {
         newArr = newArr.concat(GAME.objectsByTag[tag])
       }
       return newArr
     }, []))

     const pass = testCondition(item, testObjects, { allTestedMustPass })

     if(pass) {
       sequence.currentItemId = item.passNext
     } else {
       sequence.currentItemId = item.failNext
     }
   }
  }

  if(item.sequenceType === 'sequenceCutscene') {
    const effectedObjects = effects.getEffectedObjects(item, sequence.mainObject, sequence.guestObject, sequence.ownerObject)

    item.effectedIds = []
    const effect = {
      effectName: 'startCutscene',
      effectValue: item.scenes
    }
    effectedObjects.forEach((object) => {
      item.effectedIds.push(object.id)
      effects.processEffect(effect, object, defaultEffector, sequence.ownerObject)
    })

    if(item.notificationAllHeros) {
      GAME.heroList.forEach((hero) => {
        item.effectedIds.push(hero.id)
        effects.processEffect(effect, hero, defaultEffector, sequence.ownerObject)
      })
    }
  }
  if(item.sequenceType === 'sequenceNotification') {
    const effectedObjects = effects.getEffectedObjects(item, sequence.mainObject, sequence.guestObject, sequence.ownerObject)

    const herosNotified = []
    effectedObjects.forEach((effected) => {
      if(item.notificationText) {
        if(effected.tags.hero) {
          global.socket.emit('sendNotification', { playerUIHeroId: effected.id, chatId: effected.id, logRecipientId: effected.id, toast: item.notificationToast, log: item.notificationLog, chat: item.notificationChat, modal: item.notificationModal, text: item.notificationText, modalHeader: item.notificationModalHeader, duration: item.notificationDuration })
          herosNotified.push(effected.id)
        } else global.socket.emit('sendNotification', { chatId: effected.id, log: item.notificationLog, chat: item.notificationChat, text: item.notificationText, duration: item.notificationDuration })
      }
    })

    if(item.notificationAllHeros) {
      GAME.heroList.forEach((hero) => {
        if(herosNotified.indexOf(hero.id) > -1) return
        global.socket.emit('sendNotification', { playerUIHeroId: hero.id, logRecipientId: hero.id, chatId: hero.id, toast: item.notificationToast, chat: item.notificationChat, text: item.notificationText, log: item.notificationLog, modal: item.notificationModal, modalHeader: item.notificationModalHeader, duration: item.notificationDuration})
      })
    }
  }

  if(item.sequenceType === 'sequenceGoal') {
    const effectedObjects = effects.getEffectedObjects(item, sequence.mainObject, sequence.guestObject, sequence.ownerObject)

    const effect = {
      effectName: 'startGoal',
      ...item
    }
    effectedObjects.forEach((object) => {
      effects.processEffect(effect, object, defaultEffector, sequence.ownerObject)
    })

    if(item.goalAllHeros) {
      GAME.heroList.forEach((hero) => {
        effects.processEffect(effect, hero, defaultEffector, sequence.ownerObject)
      })
    }
  }

  if(!item.waiting && item.next === 'end') {
    endSequence(sequence)
  } else if(!item.waiting && item.next) {
    sequence.previousItemId = sequence.currentItemId
    sequence.currentItemId = item.next
  }
}

export {
  processSequence,
  startSequence,
  togglePauseSequence,
  endSequence,
}
