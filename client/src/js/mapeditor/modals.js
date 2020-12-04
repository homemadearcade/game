import Swal from 'sweetalert2/src/sweetalert2.js';
import React from 'react'
import ReactDOM from 'react-dom'
import SequenceItem from '../sequenceeditor/SequenceItem.jsx'
import SequenceEditor from '../sequenceeditor/SequenceEditor.jsx'
import ConditionList from '../sequenceeditor/ConditionList.jsx'
import SubObjectModal from './SubObjectModal.jsx'
import DescriptorSelect from '../components/DescriptorSelect.jsx';
import TagSelect from '../components/TagSelect.jsx';

function editTrigger(owner, trigger, cb) {
  PAGE.typingMode = true
  openEditTriggerModal(trigger, (result) => {
    if (result && result.value) {
      const triggerUpdate = result.value
      const oldId = trigger.id

      window.socket.emit('editTrigger', owner.id, oldId, triggerUpdate)

      if (cb) cb()
    }
    PAGE.typingMode = false
  })
}

function editHookConditions(owner, hook, cb) {
  PAGE.typingMode = true
  openEditConditionListModal(hook.conditionList, (result) => {
    if(result && result.value) {
      hook.conditionList = result.value
      const oldId = hook.id
      window.socket.emit('editHook', owner.id, oldId, hook)
      if(cb) cb()
    }
    PAGE.typingMode = false
  })
}

function editSubObjectChanceConditions(object, subObjectName, cb) {
  PAGE.typingMode = true

  let conditionList = object.subObjectChances[subObjectName].conditionList

  openEditConditionListModal(conditionList, (result) => {
    if(result && result.value) {
      object.subObjectChances[subObjectName].conditionList = result.value
      window.socket.emit('editObjects', [{ id: object.id, subObjectChances: object.subObjectChances }])
      if(cb) cb()
    }
    PAGE.typingMode = false
  })
}

function addTrigger(owner) {
  PAGE.typingMode = true
  openAddTrigger((result) => {
    if(result && result.value) {
      const trigger = { id: result.value, effectedMainObject: false, effectedOwnerObject: true }
      PAGE.typingMode = true
      openEditTriggerModal(trigger, (result) => {
        if (result && result.value) {
          const trigger = result.value
          window.socket.emit('addTrigger', owner.id, trigger)
        }
        PAGE.typingMode = false
      })
    }
  })
}

function addMod(owner) {
  PAGE.typingMode = true
  openAddMod((result) => {
    if(result && result.value) {
      const mod = { modId: result.value, soloMod: true, modRevertId: result.value, ownerId: owner.id }
      PAGE.typingMode = true
      openEditMod(mod, (result) => {
        if (result && result.value) {
          const mod = result.value
          window.socket.emit('startMod', owner.id, mod)
        }
        PAGE.typingMode = false
      })
    }
  })
}

function addHook(owner, eventName) {
  PAGE.typingMode = true
  openAddHook((result) => {
    if(result && result.value) {
      const hook = { id: result.value, eventName }
      window.socket.emit('addHook', owner.id, hook)
      editHookConditions(owner, hook, () => {
        PAGE.typingMode = false
      })
    }
  })
}

// function editTriggerEvent(owner, trigger) {
//   PAGE.typingMode = true
//   openTriggerModal(trigger, ({value}) => {
//     PAGE.typingMode = false
//
//     if(!value) return
//     const id = value[0]
//     const mainObjectTag = value[1]
//     const mainObjectId = value[2]
//     const guestObjectTag = value[3]
//     const guestObjectId = value[4]
//     const initialTriggerPool = Number(value[5])
//     const eventThreshold = Number(value[6])
//
//     const triggerUpdate = {
//       ...trigger,
//       id,
//       mainObjectTag,
//       mainObjectId,
//       guestObjectTag,
//       guestObjectId,
//       initialTriggerPool,
//       eventThreshold,
//     }
//
//     window.removeProps(triggerUpdate, { empty: true, null: true, undefined: true })
//
//     window.socket.emit('editTrigger', owner.id, trigger.id, triggerUpdate)
//   })
// }

function addNewSubObject(owner) {
  PAGE.typingMode = true
  openNameSubObjectModal((result) => {
    if(result && result.value && result.value.length) {
      window.socket.emit('addSubObject', owner, {}, result.value)
    }
    PAGE.typingMode = false
  })
}

function editEffectJSON(owner, trigger) {
  PAGE.typingMode = true
  openEditCodeModal('Edit Effect JSON', trigger.effectJSON || {}, (result) => {
    if(result && result.value) {
      const editedCode = JSON.parse(result.value)
      trigger.effectJSON = editedCode
      window.socket.emit('editTrigger', owner.id, trigger.id, trigger)
    }
    PAGE.typingMode = false
  })
}

function editObjectCode(object, title, code) {
  PAGE.typingMode = true
  openEditCodeModal(title, code, (result) => {
    if(result && result.value) {
      const editedCode = JSON.parse(result.value)
      MAPEDITOR.networkEditObject(object, editedCode)
    }
    PAGE.typingMode = false
  })
}

function editProperty(object, property, currentValue) {
  PAGE.typingMode = true
  openEditTextModal(property, currentValue, (result) => {
    if(result && result.value && result.value.length) {
      MAPEDITOR.networkEditObject(object, { [property]: result.value})
    }
    PAGE.typingMode = false
  })
}

function editPropertyNumber(object, property, currentValue, options = {}) {
  PAGE.typingMode = true
  openEditNumberModal(property, currentValue, options, (result) => {
    if(result && result.value && result.value.length) {
      MAPEDITOR.networkEditObject(object, { [property]: Number(result.value) })
    }
    PAGE.typingMode = false
  })
}

function writeDialogue(object, dialogueIndex, cb) {
  PAGE.typingMode = true
  openWriteDialogueModal(object, object.heroDialogue[dialogueIndex].text, (result) => {
    if(result && result.value && result.value[0] && result.value[0].length) {
      object.tags.talker = true
      object.heroDialogue[dialogueIndex].text = result.value[0]
      if(!object.tags.talkOnHeroCollide) {
        object.tags.talkOnHeroInteract = true
      }
      if(cb) cb(object)
      else MAPEDITOR.networkEditObject(object, { heroDialogue: object.heroDialogue, tags: object.tags})
    }
    PAGE.typingMode = false
  })
}

function nameObject(object, cb) {
  PAGE.typingMode = true
  openNameObjectModal(object, (result) => {
    if(result && result.value[0] && result.value[0].length) {
      object.name = result.value[0]
      object.namePosition = "center"
      if(result.value[1]) object.namePosition = "center"
      if(result.value[2]) object.namePosition = "above"
      if(cb) cb(object)
      else MAPEDITOR.networkEditObject(object, { name: object.name, namePosition: object.namePosition})
    }
    PAGE.typingMode = false
  })
}

function editQuest(hero, quest, cb) {
  PAGE.typingMode = true
  openQuestModal(quest, ({value}) => {
    PAGE.typingMode = false

    if(!value) return
    const id = value[0]
    const startMessage = value[1]
    const goal = value[2]
    const completionMessage = value[3]
    const nextQuestId = value[4]

    const quest = {
      id,
      startMessage,
      goal,
      completionMessage,
      nextQuestId
    }

    const state = {
      completed: false,
      started: false,
      active: false,
    }

    let quests = hero.quests
    if(!quests) {
      quests = {}
    }
    quests[id] = quest

    let questState = hero.questState
    if(!questState) {
      questState = {}
    }
    questState[id] = state

    window.socket.emit('editHero', { id: hero.id, quests, questState })
  })

}

function openSelectEffect(cb) {
  Swal.fire({
    title: 'How does this event effect the object?',
    showClass: {
      popup: 'animated fadeInDown faster'
    },
    hideClass: {
      popup: 'animated fadeOutUp faster'
    },
    input: 'select',
    inputOptions: window.effectNameList,
  }).then(cb)
}

function openSelectTag(cb) {
  Swal.fire({
    title: 'Select a tag',
    showClass: {
      popup: 'animated fadeInDown faster'
    },
    hideClass: {
      popup: 'animated fadeOutUp faster'
    },
    input: 'select',
    inputOptions: Object.keys(window.allTags),
  }).then(cb)
}

function openSelectFromList(title, list, cb) {
  Swal.fire({
    title: title,
    showClass: {
      popup: 'animated fadeInDown faster'
    },
    hideClass: {
      popup: 'animated fadeOutUp faster'
    },
    input: 'select',
    inputOptions: list,
    preConfirm: (result) => {
      console.log('RE', result)
      return list[result]
    }
  }).then(cb)
}

function openSelectParticleAnimation(cb) {

  const inputOptions = Object.keys({...GAME.library.animations, ...window.particleEmitterLibrary}).filter((name) => {
    if(window.particleEmitterLibrary[name]) return true
    if(GAME.library.animations[name]) {
      const animation = GAME.library.animations[name]
      if(animation.animationType === 'particle') return true
    }
  })

  const inputOptionValues = inputOptions.map((name) => {
    if(GAME.library.animations[name]) {
      GAME.library.animations[name].type = name
      return GAME.library.animations[name]
    }
    if(window.particleEmitterLibrary[name]) {
      window.particleEmitterLibrary[name].type = name
      return window.particleEmitterLibrary[name]
    }
  })

  Swal.fire({
    title: 'Select a particle animation',
    showClass: {
      popup: 'animated fadeInDown faster'
    },
    hideClass: {
      popup: 'animated fadeOutUp faster'
    },
    input: 'select',
    inputOptions,
    preConfirm: (result) => {
      return inputOptionValues[result]
    }
  }).then(cb)
}

function openSelectEaseAnimation(cb) {
  Swal.fire({
    title: 'Select an object animation',
    showClass: {
      popup: 'animated fadeInDown faster'
    },
    hideClass: {
      popup: 'animated fadeOutUp faster'
    },
    input: 'select',
    inputOptions: Object.keys(GAME.library.animations).filter((name) => {
      const animation = GAME.library.animations[name]
      if(animation.animationType === 'ease') return true
    }),
  }).then(cb)
}

function openAddTrigger(cb) {
  Swal.fire({
    title: 'What is the name of this trigger?',
    showClass: {
      popup: 'animated fadeInDown faster'
    },
    hideClass: {
      popup: 'animated fadeOutUp faster'
    },
    input: 'text',
    inputAttributes: {
      autocapitalize: 'off'
    },
  }).then(cb)
}

function openAddMod(cb) {
  Swal.fire({
    title: 'What is the name of this mod?',
    showClass: {
      popup: 'animated fadeInDown faster'
    },
    hideClass: {
      popup: 'animated fadeOutUp faster'
    },
    input: 'text',
    inputAttributes: {
      autocapitalize: 'off'
    },
  }).then(cb)
}

function openAddHook(cb) {
  Swal.fire({
    title: 'What is the name of this hook?',
    showClass: {
      popup: 'animated fadeInDown faster'
    },
    hideClass: {
      popup: 'animated fadeOutUp faster'
    },
    input: 'text',
    inputAttributes: {
      autocapitalize: 'off'
    },
  }).then(cb)
}


function addGameTag() {
  Swal.fire({
    title: 'What is the name of the new group?',
    showClass: {
      popup: 'animated fadeInDown faster'
    },
    hideClass: {
      popup: 'animated fadeOutUp faster'
    },
    input: 'text',
    inputAttributes: {
      autocapitalize: 'off'
    },
  }).then((result) => {
    if(result && result.value && result.value.length) {
      window.socket.emit('addGameTag', result.value)
    }
  })
}

function openNameSubObjectModal(cb) {
  Swal.fire({
    title: 'What is the name of the Sub Object?',
    showClass: {
      popup: 'animated fadeInDown faster'
    },
    hideClass: {
      popup: 'animated fadeOutUp faster'
    },
    input: 'text',
    inputAttributes: {
      autocapitalize: 'off'
    },
  }).then(cb)
}

function addCustomInputBehavior(behaviorProp) {
  Swal.fire({
    title: `What is the name of the new ${behaviorProp}?`,
    showClass: {
      popup: 'animated fadeInDown faster'
    },
    hideClass: {
      popup: 'animated fadeOutUp faster'
    },
    input: 'text',
    inputAttributes: {
      autocapitalize: 'off'
    },
  }).then((result) => {
    if(result && result.value && result.value.length) {
      const behaviorObject = {
        behaviorProp,
        behaviorName: result.value,
      }
      window.socket.emit('updateGameCustomInputBehavior', [...GAME.customInputBehavior, behaviorObject])
    }
  })
}

function openEditCodeModal(title, code, cb) {
  Swal.fire({
    title,
    showClass: {
      popup: 'animated fadeInDown faster'
    },
    hideClass: {
      popup: 'animated fadeOutUp faster'
    },
    customClass: 'swal-wide',
    html:"<div id='code-editor'></div>",
    preConfirm: () => {
      return codeEditor.getValue()
    }
  }).then(cb)

  const codeEditor = ace.edit("code-editor");
  codeEditor.setTheme("ace/theme/monokai");
  codeEditor.session.setMode("ace/mode/json");
  codeEditor.setValue(JSON.stringify(code, null, '\t'))
  codeEditor.setOptions({
    fontSize: "12pt",
  });
}

function openNameObjectModal(object, cb) {
  Swal.fire({
    title: 'Name object',
    showClass: {
      popup: 'animated fadeInDown faster'
    },
    hideClass: {
      popup: 'animated fadeOutUp faster'
    },
    // html:'<canvas id="swal-canvas" width="200" height="200"></canvas>',
    html:"<input type='radio' name='name-where' checked id='center-name'>Center name within object</input><br><input type='radio' name='name-where' id='name-above'>Display name above object</input>",
    input: 'text',
    inputAttributes: {
      autocapitalize: 'off'
    },
    preConfirm: (result) => {
      return [
        result,
        document.getElementById('center-name').checked,
        document.getElementById('name-above').checked,
      ]
    }
  }).then(cb)
}

function openWriteDialogueModal(object, dialogueStart = "", cb) {
  Swal.fire({
    title: 'What does this object say?',
    showClass: {
      popup: 'animated fadeInDown faster'
    },
    hideClass: {
      popup: 'animated fadeOutUp faster'
    },
    // html:'<canvas id="swal-canvas" width="200" height="200"></canvas>',
    // html:"<input type='radio' name='name-where' checked id='center-name'>Center name within object</input><br><input type='radio' name='name-where' id='name-above'>Display name above object</input>",
    input: 'textarea',
    inputAttributes: {
      autocapitalize: 'off',
    },
    inputValue: dialogueStart,
    preConfirm: (result) => {
      return [
        result
      ]
    }
  }).then(cb)
}

function openQuestModal(quest = { id: '', startMessage: '', goal: '', completionMessage: '', nextQuestId: ''}, cb) {
  Swal.fire({
    title: 'Quest Editor',
    showClass: {
      popup: 'animated fadeInDown faster'
    },
    hideClass: {
      popup: 'animated fadeOutUp faster'
    },
    html:`<div class='swal-modal-input-label'>Name of Quest</div><input autocomplete="new-password" class='swal-modal-input' id='quest-id' value='${quest.id}'></input>
    <div class='swal-modal-input-label'>Start Message</div><textarea class='swal-modal-input' id='start-message'>${quest.startMessage}</textarea>
    <div class='swal-modal-input-label'>Quest Goal</div><input class='swal-modal-input' id='quest-goal' value='${quest.goal}'>
    <div class='swal-modal-input-label'>Completion Message</div><textarea class='swal-modal-input' id='completion-message'>${quest.completionMessage}</textarea>
    <div class='swal-modal-input-label'>Name quest to start on completion</div><input autocomplete="new-password" class='swal-modal-input' id='next-quest-id' value='${quest.nextQuestId}'></input>`,
    preConfirm: (result) => {
      return [
        document.getElementById('quest-id').value,
        document.getElementById('start-message').value,
        document.getElementById('quest-goal').value,
        document.getElementById('completion-message').value,
        document.getElementById('next-quest-id').value,
      ]
    }
  }).then(cb)
}

// function openTriggerModal(trigger, cb) {
//   const newTrigger = Object.assign({ id: '', effectValue: '', subObjectName: '', mainObjectId: '', mainObjectTag: '', guestObjectId: '', guestObjectTag: '', initialTriggerPool: 1, eventThreshold: -1, effectedObject: 'ownerObject', effectorObject: "auto"}, trigger)
//
//   Swal.fire({
//     title: 'Trigger Editor',
//     showClass: {
//       popup: 'animated fadeInDown faster'
//     },
//     hideClass: {
//       popup: 'animated fadeOutUp faster'
//     },
//     html:`<div class='swal-modal-input-label'>Trigger Id</div><input autocomplete="new-password" class='swal-modal-input' id='trigger-id' value='${newTrigger.id}'></input>
//     <div class='swal-modal-input-label'>Main Object Tag</div><input class='swal-modal-input' id='main-object-tag' value='${newTrigger.mainObjectTag}'>
//     <div class='swal-modal-input-label'>Main Object Id</div><input class='swal-modal-input' id='main-object-id' value='${newTrigger.mainObjectId}'>
//     <div class='swal-modal-input-label'>Guest Object Tag</div><input class='swal-modal-input' id='guest-object-tag' value='${newTrigger.guestObjectTag}'>
//     <div class='swal-modal-input-label'>Guest Object Id</div><input class='swal-modal-input' id='guest-object-id' value='${newTrigger.guestObjectId}'>
//     <div class='swal-modal-input-label'>Trigger Pool</div><input type="number" class='swal-modal-input' id='initial-trigger-pool' value='${newTrigger.initialTriggerPool}'>
//     <div class='swal-modal-input-label'>Event Threshold</div><input type="number" class='swal-modal-input' id='event-threshold' value='${newTrigger.eventThreshold}'>`,
//     preConfirm: (result) => {
//       return [
//         document.getElementById('trigger-id').value,
//         document.getElementById('main-object-tag').value,
//         document.getElementById('main-object-id').value,
//         document.getElementById('guest-object-tag').value,
//         document.getElementById('guest-object-id').value,
//         document.getElementById('initial-trigger-pool').value,
//         document.getElementById('event-threshold').value,
//       ]
//     }
//   }).then(cb)
// }

function openEditTextModal(property, currentValue, cb) {
  Swal.fire({
    title: 'Edit ' + property,
    showClass: {
      popup: 'animated fadeInDown faster'
    },
    hideClass: {
      popup: 'animated fadeOutUp faster'
    },
    input: 'text',
    inputValue: currentValue,
    inputAttributes: {
      autocapitalize: 'off'
    }
  }).then(cb)
}

function openEditNumberModal(property, currentValue = 0, options = { range: false, min: null, max: null, step: 1 }, cb) {
  Swal.fire({
    title: 'Edit ' + property,
    showClass: {
      popup: 'animated fadeInDown faster'
    },
    hideClass: {
      popup: 'animated fadeOutUp faster'
    },
    input: options.range ? 'range' : 'number',
    inputAttributes: {
      min: options.min,
      max: options.max,
      step: options.step,
    },
    inputValue: currentValue
  }).then(cb)
}

function openEditTriggerModal(effect, cb) {
  const triggerData = JSON.parse(JSON.stringify(window.defaultSequenceTrigger))
  const newEffect = JSON.parse(JSON.stringify(window.defaultSequenceEffect))
  Object.assign(newEffect, triggerData, effect)

  Swal.fire({
    title: 'Edit Trigger',
    showClass: {
      popup: 'animated fadeInDown faster'
    },
    hideClass: {
      popup: 'animated fadeOutUp faster'
    },
    html:`<div id='edit-trigger-container'></div>`,
    preConfirm: (result) => {
      return ref.current.getItemValue()
    }
  }).then(cb)

  newEffect.sequenceType = 'sequenceEffect'
  // Mount React App
  const ref = React.createRef()
  ReactDOM.render(
    React.createElement(SequenceItem, { sequenceItem: newEffect, ref, isTrigger: true }),
    document.getElementById('edit-trigger-container')
  )

}


function openEditSequenceModal(id, cb) {
  Swal.fire({
    title: 'Edit Sequence',
    showClass: {
      popup: 'animated fadeInDown faster'
    },
    hideClass: {
      popup: 'animated fadeOutUp faster'
    },
    html:`<div id='edit-sequence-container'></div>`,
    preConfirm: (result) => {
      console.log(ref.current)
      return ref.current.getCurrentId()
    }
  }).then(cb)

  // Mount React App
  const ref = React.createRef()
  ReactDOM.render(
    React.createElement(SequenceEditor, { ref }),
    document.getElementById('edit-sequence-container')
  )

  if(id) {
    setTimeout(() => {
      ref.current.openSequence(id)
    })
  }
}

function openEditDescriptorsModal(initialDescriptors, cb) {
  Swal.fire({
    title: 'Edit Descriptors',
    showClass: {
      popup: 'animated fadeInDown faster'
    },
    hideClass: {
      popup: 'animated fadeOutUp faster'
    },
    html:`<div id='edit-descriptors-container'></div>`,
    preConfirm: (result) => {
      return ref.current.getDescriptorsObject()
    }
  }).then(cb)

  // Mount React App
  const ref = React.createRef()
  ReactDOM.render(
    React.createElement(DescriptorSelect, { ref, initialDescriptors }),
    document.getElementById('edit-descriptors-container')
  )
}

function openEditTagsModal(initialTags, cb) {
  Swal.fire({
    title: 'Edit Tags',
    showClass: {
      popup: 'animated fadeInDown faster'
    },
    hideClass: {
      popup: 'animated fadeOutUp faster'
    },
    html:`<div id='edit-tags-container'></div>`,
    preConfirm: (result) => {
      return ref.current.getTagsObject()
    }
  }).then(cb)

  // Mount React App
  const ref = React.createRef()
  ReactDOM.render(
    React.createElement(TagSelect, { ref, initialTags }),
    document.getElementById('edit-tags-container')
  )
}

function openEditMod(mod, cb) {
  Swal.fire({
    title: 'Edit Mod',
    showClass: {
      popup: 'animated fadeInDown faster'
    },
    hideClass: {
      popup: 'animated fadeOutUp faster'
    },
    html:`<div id='edit-mod-container'></div>`,
    preConfirm: (result) => {
      return ref.current.getSequenceJSON()
    }
  }).then(cb)

  mod.sequenceType = 'sequenceEffect'
  mod.effectName = 'mod'

  // Mount React App
  const ref = React.createRef()
  ReactDOM.render(
    React.createElement(SequenceItem, { ref, sequenceItems: mod, isMod: true }),
    document.getElementById('edit-mod-container')
  )
}

function openEditConditionListModal(conditionList, cb) {
  Swal.fire({
    title: 'Edit Conditions',
    showClass: {
      popup: 'animated fadeInDown faster'
    },
    hideClass: {
      popup: 'animated fadeOutUp faster'
    },
    html:`<div id='edit-condition-list-container'></div>`,
    preConfirm: (result) => {
      return ref.current.getSequenceJSON()
    }
  }).then(cb)

  // Mount React App
  const ref = React.createRef()
  ReactDOM.render(
    React.createElement(ConditionList, { ref, sequenceItems: conditionList }),
    document.getElementById('edit-condition-list-container')
  )

}

function addNewSubObjectTemplate(objectSelected, cb) {
  Swal.fire({
    title: 'Create Sub Object',
    html: ' <div id="subObjectModal--container"> </div>',
    focusConfirm: false,
    showClass: {
      popup: 'animated fadeInDown faster'
    },
    hideClass: {
      popup: 'animated fadeOutUp faster'
    },
    preConfirm: () => {
      const nameValue = document.getElementById('subobject-input-name').value;
      const tagValueList = document.getElementsByClassName('subobject-radio');
      const tagValue = [tagValueList.item(0), tagValueList.item(1), tagValueList.item(2)]
        .find(value => {
          return value.checked
        }).id

      if(tagValue === 'inventory') {
        window.socket.emit('addSubObject', objectSelected, { inInventory: true, tags: { potential: true }}, nameValue)
      } else if(tagValue === 'potential') {
        window.socket.emit('addSubObject', objectSelected, { tags:{ potential: true }}, nameValue)
      } else {
        window.socket.emit('addSubObject', objectSelected, {}, nameValue)
      }
    }
  }).then(cb)
  const ref = React.createRef()
  ReactDOM.render(
    React.createElement(SubObjectModal, { objectSelected: objectSelected }),
    document.getElementById('subObjectModal--container')
  )
}


export default {
  addCustomInputBehavior,
  addGameTag,
  addNewSubObject,
  addNewSubObjectTemplate,
  addHook,
  addTrigger,
  editHookConditions,
  editObjectCode,
  editProperty,
  editPropertyNumber,
  editQuest,
  editEffectJSON,
  writeDialogue,
  nameObject,
  openEditDescriptorsModal,
  openEditTagsModal,

  openNameSubObjectModal,
  openEditCodeModal,
  openEditNumberModal,
  openSelectTag,
  openSelectFromList,
  openSelectEaseAnimation,
  openEditSequenceModal,
  openSelectParticleAnimation,
  // editTriggerEvent,
  openEditMod,
  addMod,

  editTrigger,
  editSubObjectChanceConditions
}
