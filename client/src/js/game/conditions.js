import collisions from '../utils/collisions'
import isMatchWith from 'lodash.ismatchwith'

window.conditionTypes = {
  matchJSON: {
    JSON: true,
  },
  insideOfObjectTag: {
    tag: true,
    label: 'Tag:'
  },
  insideOfObjectId: {
    id: true,
    label: 'Id:'
  },
  // insideOfObjectId for timer amount
  hasTag: {
    tag: true,
    label: 'Tag:'
  },
  hasCompletedQuest: {
    smallText: true,
    label: 'Quest Name:'
  },
  hasStartedQuest: {
    smallText: true,
    label: 'Quest Name:'
  },
  hasSubObject: {
    smallText: true,
    label: 'Sub Object Name:'
  },
  isSubObjectInInventory: {
    smallText: true,
    label: 'Sub Object Name:'
  },
  isSubObjectEquipped: {
    smallText: true,
    label: 'Sub Object Name:'
  },

  // GIVE ID
  // occursXTimes: {
  //   number: true,
  //   label: 'X amount'
  // },

  onEvent: {
    // number: true,
    event: true,
    //
  },
  onTimerEnd: {
    number: true,
    label: 'Timer seconds:'
  },
  onAdminApproval: {
    smallText: true,
  }
}

function testCondition(condition, testObjects, options = { allTestedMustPass: false, testPassReverse: false, testModdedVersion: false }) {

  if(!Array.isArray(testObjects)) testObjects = [testObjects]

  const { allTestedMustPass, testPassReverse } = options

  let pass = false
  if(condition.conditionType === 'matchJSON') {
    if(allTestedMustPass) {
      pass = testObjects.every((testObject) => {
        return testMatchJSONCondition(condition.conditionJSON, testObject, options)
      })
    } else {
      pass = testObjects.some((testObject) => {
        return testMatchJSONCondition(condition.conditionJSON, testObject, options)
      })
    }
  }

  if(condition.conditionType === 'insideOfObjectTag') {
    const tag = condition.conditionValue

    let areaObjects = []
    if(GAME.objectsByTag[tag]) {
      areaObjects = areaObjects.concat(GAME.objectsByTag[tag])
    }

    if(allTestedMustPass) {
      pass = testObjects.every((testObject) => {
        return areaObjects.some((areaObject) => {
          return testIsWithinObject(areaObject, testObject, options)
        })
      })
    } else {
      pass = testObjects.some((testObject) => {
        return areaObjects.some((areaObject) => {
          return testIsWithinObject(areaObject, testObject, options)
        })
      })
    }
  }

  if(condition.conditionType === 'insideOfObjectId') {
    const id = condition.conditionValue

    let areaObjects = []
    if(GAME.objectsById[id]) {
      areaObjects = areaObjects.concat(GAME.objectsById[id])
    }
    if(GAME.heros[id]) {
      areaObjects = areaObjects.concat(GAME.heros[id])
    }

    if(allTestedMustPass) {
      pass = testObjects.every((testObject) => {
        return areaObjects.some((areaObject) => {
          return testIsWithinObject(areaObject, testObject, options)
        })
      })
    } else {
      pass = testObjects.some((testObject) => {
        return areaObjects.some((areaObject) => {
          return testIsWithinObject(areaObject, testObject, options)
        })
      })
    }
  }


  if(condition.conditionType === 'hasTag') {
    const tag = condition.conditionValue

    if(allTestedMustPass) {
      pass = testObjects.every((testObject) => {
        return testHasTag(tag, testObject, options)
      })
    } else {
      pass = testObjects.some((testObject) => {
        return testHasTag(tag, testObject, options)
      })
    }
  }

  if(condition.conditionType === 'hasCompletedQuest') {
    const quest = condition.conditionValue

    if(allTestedMustPass) {
      pass = testObjects.every((testObject) => {
        return testHasCompletedQuest(quest, testObject, options)
      })
    } else {
      pass = testObjects.some((testObject) => {
        return testHasCompletedQuest(quest, testObject, options)
      })
    }
  }

  if(condition.conditionType === 'hasStartedQuest') {
    const quest = condition.conditionValue

    if(allTestedMustPass) {
      pass = testObjects.every((testObject) => {
        return testHasStartedQuest(quest, testObject, options)
      })
    } else {
      pass = testObjects.some((testObject) => {
        return testHasStartedQuest(quest, testObject, options)
      })
    }
  }

  if(condition.conditionType === 'hasSubObject') {
    const name = condition.conditionValue

    if(allTestedMustPass) {
      pass = testObjects.every((testObject) => {
        return testHasSubObject(name, testObject, options)
      })
    } else {
      pass = testObjects.some((testObject) => {
        return testHasSubObject(name, testObject, options)
      })
    }
  }

  if(condition.conditionType === 'isSubObjectEquipped') {
    const name = condition.conditionValue

    if(allTestedMustPass) {
      pass = testObjects.every((testObject) => {
        return testIsSubObjectEquipped(name, testObject, options)
      })
    } else {
      pass = testObjects.some((testObject) => {
        return testIsSubObjectEquipped(name, testObject, options)
      })
    }
  }

  if(condition.conditionType === 'isSubObjectInInventory') {
    const name = condition.conditionValue

    if(allTestedMustPass) {
      pass = testObjects.every((testObject) => {
        return testIsSubObjectInInventory(name, testObject, options)
      })
    } else {
      pass = testObjects.some((testObject) => {
        return testIsSubObjectInInventory(name, testObject, options)
      })
    }
  }

  if(testPassReverse) return !pass

  return pass
}


function testMatchJSONCondition(JSON, testObject, options) {
  if(options.testModdedVersion) testObject = testObject.mod()
  return isMatchWith(testObject, JSON, (objectValue, jsonValue) => {
    if(typeof jsonValue === 'string' && typeof objectValue === 'number') {
      if (jsonValue.startsWith("<")) {
        const comparisonValue = Number(jsonValue.slice(1))
        return comparisonValue < objectValue
      } else if(jsonValue.startsWith(">")) {
        const comparisonValue = Number(jsonValue.slice(1))
        return comparisonValue > objectValue
      }
    }

    return undefined
  })
}

function testIsWithinObject(object, testObject, options) {
  if(options.testModdedVersion) testObject = testObject.mod()
  return collisions.checkObject(object, testObject)
}

function testHasCompletedQuest(questName, testObject, options) {
  if(options.testModdedVersion) testObject = testObject.mod()
  return testObject.questState[questName] && testObject.questState[questName].completed
}

function testHasStartedQuest(questName, testObject, options) {
  if(options.testModdedVersion) testObject = testObject.mod()
  return testObject.questState[questName] && testObject.questState[questName].started
}

function testHasSubObject(name, testObject, options) {
  if(options.testModdedVersion) testObject = testObject.mod()
  return testObject.subObjects[name]
}

function testIsSubObjectEquipped(name, testObject, options) {
  if(options.testModdedVersion) testObject = testObject.mod()
  return testObject.subObjects[name] && testObject.subObjects[name].isEquipped
}

function testIsSubObjectInInventory(name, testObject, options) {
  console.log(name, testObject)
  if(options.testModdedVersion) testObject = testObject.mod()
  return testObject.subObjects[name] && testObject.subObjects[name].inInventory
}

function testHasTag(tag, testObject, options) {
  if(options.testModdedVersion) testObject = testObject.mod()
  return testObject.tags[tag]
}

function testEventMatch(eventName, mainObject, guestObject, condition, ownerObject, options = { allTestedMustPass: false, testPassReverse: false, testModdedVersion: false }) {
  let { mainObjectId, mainObjectTag, guestObjectId, guestObjectTag, conditionMainObjectId, conditionMainObjectTag, conditionGuestObjectId, conditionGuestObjectTag  } = condition

  if(conditionMainObjectId) mainObjectId = conditionMainObjectId
  if(conditionMainObjectTag) mainObjectTag = conditionMainObjectTag
  if(conditionGuestObjectId) guestObjectId = conditionGuestObjectId
  if(conditionGuestObjectTag) guestObjectTag = conditionGuestObjectTag

  let eventMatch = false

  if(options.testModdedVersion) {
    if(ownerObject) ownerObject = ownerObject.mod()
    if(guestObject) guestObject = guestObject.mod()
    if(mainObject) mainObject = mainObject.mod()
  }

  if(ownerObject) {
    // the code below attempts to automatically determine the main object or the guest object
    // based on the name of the event
    if(ownerObject.tags.hero) {
      if(!guestObjectId && !guestObjectTag && eventName.indexOf('Object') >= 0) {
        guestObjectId = ownerObject.id
      }
      if(!mainObjectId && !mainObjectTag && eventName.indexOf('Hero') >= 0) {
        mainObjectId = ownerObject.id
      }
    } else {
      if(!mainObjectId && !mainObjectTag && eventName.indexOf('Object') >= 0) {
        mainObjectId = ownerObject.id
      }
      if(!guestObjectId && !guestObjectTag && eventName.indexOf('Hero') >= 0) {
        guestObjectId = ownerObject.id
      }
    }
  }

  // now that we have potential main/guests object ids/tags, we try to match them with the REAL main/guest objects from the event
  if(eventName.indexOf('Object') >= 0 || eventName.indexOf('Hero') >= 0) {
    // just check object
    if((mainObjectId || mainObjectTag) && !guestObjectId && !guestObjectTag && checkIdOrTagMatch(mainObjectId, mainObjectTag, mainObject)) {
      eventMatch = true
      // just check guestObject
    } else if((guestObjectId || guestObjectTag) && !mainObjectId && !mainObjectTag && checkIdOrTagMatch(guestObjectId, guestObjectTag, guestObject)) {
      eventMatch = true
      // check guestObject and object
    } else if((guestObjectId || guestObjectTag) && (mainObjectId || mainObjectTag) && checkIdOrTagMatch(mainObjectId, mainObjectTag, mainObject) && checkIdOrTagMatch(guestObjectId, guestObjectTag, guestObject)) {
      eventMatch = true
    }
  }

  if(eventName.indexOf('Game') >= 0 || eventName.indexOf('Quest') >= 0 || eventName.indexOf('Anticipate') >= 0 || eventName.indexOf('Sequence') >= 0) {
    eventMatch = true
  }

  if(options.testPassReverse) return !eventMatch

  return eventMatch
}

function checkIdOrTagMatch(id, tag, object) {
  if(id && id === object.id) {
    return true
  }
  if(tag && object.mod().tags[tag]) {
    return true
  }
}

export {
  testEventMatch,
  testCondition
}
