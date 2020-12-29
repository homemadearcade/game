import modals from '../modals.js'
import spriteChooser from '../SpriteChooser.js'

const selectSubObjectPrefix = 'select-subobject-'
const deleteSubObjectPrefix = 'delete-subobject-'

const questCompleterIdSelectPrefix = 'complete-id-'
const questGivingIdSelectPrefix = 'quest-id-'

const removeResourceTagPrefix = 'remove-resource-tag-'

export async function handleExtraMenuClicks(key, objectSelected, openColorPicker, subObject) {
    const { startResize, startRelativeDrag, onStartDrag, selectSubObject, deleteObject, onCopy, removeObject, onStartSetPathfindingLimit, openConstructEditor, networkEditObject } = MAPEDITOR
    const { resourceLimit, resourceWithdrawAmount } = objectSelected
    const { spawnLimit, spawnPoolInitial, spawnWaitTimer } = objectSelected

    if(key === 'open-edit-sprite') {
      SPRITEEDITOR.open(objectSelected)
    }

    if (key === 'select-color') {
        openColorPicker(objectSelected)
        return
    }

    if(key === 'open-tag-search-modal') {
      Object.keys(objectSelected.tags).forEach((tag) => {
        if(!objectSelected.tags[tag]) delete objectSelected.tags[tag]
      })
      modals.openEditTagsModal(objectSelected.tags || {}, ({value}) => {
        if(value) {
          networkEditObject(objectSelected, {tags: value})
        }
      })
      return
    }

    if(key === 'open-live-particle') {
      LIVEEDITOR.open(objectSelected, 'particle')
    }

    if(key === 'open-live-light') {
      LIVEEDITOR.open(objectSelected, 'light')
    }

    if(key === 'open-path-editor') {
      MAPEDITOR.openPathEditor(objectSelected)
    }

    if (key === "open-live-physics") {
      LIVEEDITOR.open(objectSelected, 'physics')
    }

    if (key === "open-hero-live-edit") {
      LIVEEDITOR.open(objectSelected, 'hero')
    }

    if(key === 'drop') {
      global.socket.emit('dropObject', objectSelected.ownerId, objectSelected.subObjectName)
    }
    if(key === 'unequip') {
      global.socket.emit('unequipObject', objectSelected.ownerId, objectSelected.subObjectName)
    }
    if(key === 'equip') {
      global.socket.emit('equipObject', objectSelected.ownerId, objectSelected.subObjectName, 'available')
    }

    if(key === 'choose-from-recommended-sprites') {
      spriteChooser.openType(objectSelected, 'defaultSprite', 'recommended')
    }

    if(key === 'choose-from-my-sprites') {
      spriteChooser.openType(objectSelected, 'defaultSprite', 'mysprites')
    }

    if(key === 'randomize-from-descriptors') {
      global.findSpritesForDescribedObjects([objectSelected])
    }

    if(key === 'edit-descriptors') {
      Object.keys(objectSelected.descriptors || {}).forEach((tag) => {
        if(!objectSelected.descriptors[tag]) delete objectSelected.descriptors[tag]
      })
      modals.openEditDescriptorsModal(objectSelected.descriptors || {}, ({value}) => {
        if(value) {
          networkEditObject(objectSelected, {descriptors: value})
        }
      }, {}, true)
    }

    if (key === 'toggle-outline') {
        networkEditObject(objectSelected, { tags: { outline: !objectSelected.tags.outline } })
        return
    }

    if (key === 'toggle-invisible') {
        if (objectSelected.tags.invisible) {
            networkEditObject(objectSelected, { tags: { invisible: false, obstacle: true } })
        } else {
            networkEditObject(objectSelected, { tags: { invisible: true, obstacle: false } })
        }
        return
    }
    if (key === "add-dialogue") {
        if (!objectSelected.heroDialogue) {
            objectSelected.heroDialogue = []
        }
        objectSelected.heroDialogue.push('')
        modals.writeDialogue(objectSelected, objectSelected.heroDialogue.length - 1)
        return
    }

    if (key.indexOf("remove-dialogue") === 0) {
        let dialogueIndex = key[key.length - 1]
        objectSelected.heroDialogue.splice(dialogueIndex, 1)
        networkEditObject(objectSelected, { heroDialogue: objectSelected.heroDialogue })
    }

    if (key.indexOf("edit-dialogue") === 0) {
        let dialogueIndex = key[key.length - 1]
        modals.writeDialogue(objectSelected, dialogueIndex)
        return
    }
    if (key === 'create-game-tag') {
        modals.addGameTag()
        return
    }


    if (key === "open-daynight-live-menu") {
        LIVEEDITOR.open({}, 'daynightcycle')
        return
    }
    if (key === "name-object") {
        modals.nameObject(objectSelected)
        return
    }
    if (key === 'name-position-center') {
        networkEditObject(objectSelected, { namePosition: 'center' })
        return
    }
    if (key === 'name-position-above') {
        networkEditObject(objectSelected, { namePosition: 'above' })
        return
    }
    if (key === 'name-position-none') {
        networkEditObject(objectSelected, { namePosition: null })
        return
    }
    if (key === 'set-pathfinding-limit') {
        onStartSetPathfindingLimit(objectSelected)
        return
    }

    if (key === 'copy-id') {
        PAGE.copyToClipBoard(objectSelected.id)
        return
    }

    if (key === 'edit-properties-json') {
        modals.editObjectCode(objectSelected, 'Editing Object Properties', OBJECTS.getProperties(objectSelected));
        return
    }

    if (key === 'edit-state-json') {
        modals.editObjectCode(objectSelected, 'Editing Object State', OBJECTS.getState(objectSelected));
        return
    }

    if (key === 'edit-all-json') {
        modals.editObjectCode(objectSelected, 'Editing Object', objectSelected);
        return
    }

    if (key === 'add-new-subobject') {
        modals.addNewSubObjectTemplate(objectSelected)
        return
    }

    if(key === 'respawn') {
      global.socket.emit('respawnHero', objectSelected)
    }

    if (key === 'set-world-respawn-point') {
        global.socket.emit('updateWorld', { worldSpawnPointX: objectSelected.x, worldSpawnPointY: objectSelected.y })
        return
    }

    if (key === 'set-object-respawn-point') {
        networkEditObject(objectSelected, { spawnPointX: objectSelected.x, spawnPointY: objectSelected.y })
        return
    }

    if (key === 'turn-into-spawn-zone') {
        global.socket.emit('addSubObject', objectSelected, { tags: { potential: true } }, 'spawner')
        networkEditObject(objectSelected, { tags: { spawnZone: true }, spawnLimit: -1, spawnPoolInitial: 1, subObjectChances: { 'spawner': { randomWeight: 1, conditionList: null } } })
        return
    }

    if (key === 'turn-into-resource-zone') {
        networkEditObject(objectSelected, { tags: { resourceZone: true }, resourceWithdrawAmount: 1, resourceLimit: -1, resourceTags: ['resource'] })
        return
    }

    if (key === 'open-construct-editor') {
        openConstructEditor(objectSelected)
        return
    }

    if(key === 'open-media-manager-sprite-selector') {
      BELOWMANAGER.open({ selectedManager: 'MediaManager', selectedMenu: 'SpriteSelector', objectSelected, spriteValue: 'default'})
      return
    }

    if (key === 'enter-quest-giving-id') {
        modals.editProperty(objectSelected, 'questGivingId', objectSelected.questGivingId || '')
        return
    }

    if (key === 'enter-quest-completer-id') {
        modals.editProperty(objectSelected, 'questCompleterId', objectSelected.questCompleterId || '')
        return
    }

    if (key.indexOf(questGivingIdSelectPrefix) === 0) {
        const questId = key.substr(questGivingIdSelectPrefix.length)
        networkEditObject(objectSelected, { questGivingId: questId })
        return
    }

    if (key.indexOf(questCompleterIdSelectPrefix) === 0) {
        const questId = key.substr(questCompleterIdSelectPrefix.length)
        networkEditObject(objectSelected, { questCompleterId: questId })
        return
    }
    if (key === 'position') {
        startRelativeDrag(objectSelected)
        return
    }
    if (key === 'position-grid') {
        startRelativeDrag(objectSelected, { snapToGrid: true })
        return
    }

    if(key === 'rename-sub-object') {
      const owner = OBJECTS.getObjectOrHeroById(objectSelected.ownerId)
      const { value: name } = await Swal.fire({
        title: 'Rename sub object',
        text: "What is the new name of this sub object?",
        input: 'text',
        inputAttributes: {
          autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Next',
      })

      const oldName =  objectSelected.subObjectName
      const copy = Object.replaceAll(owner, objectSelected.subObjectName, name, true , true)
      if(copy.subObjects[oldName]) copy.subObjects[oldName] = null
      if(copy.subObjectChances[oldName]) copy.subObjectChances[oldName] = null

      MAPEDITOR.networkEditObject(owner, copy)
    }

    if(key === 'resize') {
      if(subObject || objectSelected.tags.subObject) {
        startResize(objectSelected, { snapToGrid: false })
      } else {
        startResize(objectSelected)
      }
    }

    if(key === 'resize-grid') {
      startResize(objectSelected, { snapToGrid: true })
    }

    if(key === 'drag') {
      onStartDrag(objectSelected)
    }

    if(key === 'drag-off-grid') {
      MAPEDITOR.onStartDrag(objectSelected, { snapToGrid: false })
    }

    if(key === 'delete') {
      deleteObject(objectSelected)
    }

    if(key === 'remove') {
      removeObject(objectSelected)
    }

    if(key === 'copy') {
      onCopy(objectSelected)
    }

    if (key === 'edit-withdraw-amount') {
        modals.editPropertyNumber(objectSelected, 'resourceWithdrawAmount', resourceWithdrawAmount)
        return
    }

    if (key === 'edit-resource-limit') {
        modals.editPropertyNumber(objectSelected, 'resourceLimit', resourceLimit)
        return
    }

    if(key === 'add-resource-tag') {
      modals.openSelectTag((result) => {
        if(result && result.value) {
          const resourceTags = objectSelected.resourceTags
          resourceTags[Object.keys(global.allTags)[result.value]] = true
          networkEditObject(objectSelected, { resourceTags })
        }
      })
    }

    if(key.indexOf(removeResourceTagPrefix) === 0) {
      let tagToRemove = key.substr(removeResourceTagPrefix.length)

      const resourceTags = objectSelected.resourceTags[tagToRemove] = false
      networkEditObject(objectSelected, { resourceTags })
    }

    if (key === 'add-new-subobject') {
        modals.addNewSubObjectTemplate(objectSelected)
        return
    }

    if (key.indexOf(selectSubObjectPrefix) === 0) {
        const subObjectName = key.substr(selectSubObjectPrefix.length)
        selectSubObject(objectSelected.subObjects[subObjectName], subObjectName)
        return
    }

    if (key.indexOf(deleteSubObjectPrefix) === 0) {
        const subObjectName = key.substr(deleteSubObjectPrefix.length)
        global.socket.emit('deleteSubObject', objectSelected, subObjectName)
        return
    }

    if (key === 'edit-spawn-limit') {
        modals.editPropertyNumber(objectSelected, 'spawnLimit', spawnLimit)
        return
    }

    if (key === 'edit-spawn-pool-initial') {
        modals.editPropertyNumber(objectSelected, 'spawnPoolInitial', spawnPoolInitial)
        return
    }

    if (key === 'edit-spawn-wait-timer') {
        modals.editPropertyNumber(objectSelected, 'spawnWaitTimer', spawnWaitTimer)
        return
    }

    if (key === 'add-spawn-object') {
        modals.openNameSubObjectModal((result) => {
            if (result && result.value) {
                const subObjectChances = objectSelected.subObjectChances
                global.socket.emit('editObjects', [{ id: objectSelected.id, subObjectChances: { ...subObjectChances, [result.value]: { randomWeight: 1, conditionList: null } } }])
            }
        })
        if (key === 'edit-random-weight') {
            PAGE.typingMode = true
            const subObjectChance = objectSelected.subObjectChances[subObjectName]
            modals.openEditNumberModal('random weight', subObjectChance.randomWeight, {}, (result) => {
                if (result && result.value) {
                    subObjectChance.randomWeight = Number(result.value)
                    global.socket.emit('editObjects', [{ id: objectSelected.id, subObjectChances: objectSelected.subObjectChances }])
                }
                PAGE.typingMode = false
            })
        }
        return

    }

    if(key == "edit-popover-text") {
      const { value: text } = await Swal.fire({
        title: "What is the popover text?",
        input: 'text',
        inputAttributes: {
          autocapitalize: 'off'
        },
        inputValue: objectSelected.popoverText || '',
        showCancelButton: true,
        confirmButtonText: 'Confirm',
      })
      networkEditObject(objectSelected, { popoverText: text})
    }

    if(key == "clear-popover-text") {
      networkEditObject(objectSelected, { popoverText: null})
    }

    if (key === 'spawn-all-now') {
        global.socket.emit('spawnAllNow', objectSelected.id)
        return
    }

    if (key === 'destroy-spawned') {
        global.socket.emit('destroySpawnIds', objectSelected.id)
        return
    }


    if(key === 'create-object') {
      OBJECTS.create({...objectSelected, tags: {obstacle: true}})
    }

    if(key === 'toggle-pause-game') {
      global.socket.emit('editGameState', { paused: !GAME.gameState.paused })
    }

    if(key === 'toggle-start-game') {
      if(GAME.gameState.started) {
        global.socket.emit('stopGame')
      } else {
        global.socket.emit('startGame')
      }
    }

    if(key === 'select-world-background-color') {
      openColorPicker('worldBackground')
    }
    if(key === 'select-default-object-color') {
      openColorPicker('defaultObject')
    }

    if(key === 'open-sequence-editor') {
      BELOWMANAGER.open({ selectedManager: 'GameManager', selectedMenu: 'sequence'})
    }

    if(key === 'download-game-JSON')  {
      let saveGame = GAME.cleanForSave(GAME)
      console.log(saveGame)
      PAGE.downloadObjectAsJson(saveGame, GAME.id)
    }


    ///DIALOGUE
    if(key === "add-dialogue-set") {
      if(!objectSelected.heroDialogueSets) {
        objectSelected.heroDialogueSets = {}
      }

      const name = await global.getGlobalName()

      if(!name) return

      objectSelected.heroDialogueSets[name] = {}
      objectSelected.heroDialogueSets[name].dialogue = [_.cloneDeep(global.defaultDialogue)]
      networkEditObject(objectSelected, {heroDialogueSets: objectSelected.heroDialogueSets })
    }

    if(key === "set-dialogue-set") {
      const { value: name } = await Swal.fire({
        title: 'Add Dialogue Set',
        text: "Set the dialogue of this object to which dialogue set?",
        input: 'text',
        inputAttributes: {
          autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Next',
      })
      if(!name) return
      networkEditObject(objectSelected, {heroDialogueSet: name })
      return
    }


    if(key.charAt(0) !== '{') return

    const data = JSON.parse(key)
    if (data.action === 'chooseSprite') {
        SpriteChooser.open(objectSelected, data.spriteName)
        return
    }


    ///TRIGGER

    if (data.action === 'add-trigger') {
        modals.addTrigger(objectSelected, data.eventName)
        return
    }

    // if (data.action === 'edit-trigger-event') {
    //     modals.editTriggerEvent(objectSelected, data.trigger)
    //     return
    // }

    if (data.action === 'edit-trigger') {
        modals.editTrigger(objectSelected, data.trigger)
        return
    }

    if (data.action === 'delete-trigger') {
        global.socket.emit('deleteTrigger', objectSelected.id, data.trigger.id)
        return
    }


    ///DIALOGUE
    if (data.action === 'add-hook') {
        modals.addHook(objectSelected, data.eventName)
        return
    }

    if (data.action === 'edit-hook-conditions') {
        modals.editHookConditions(objectSelected, data.hook)
        return
    }

    if (data.action === 'delete-hook') {
        global.socket.emit('deleteHook', objectSelected.id, data.hook.id)
        return
    }



    ///DIALOGUE
    if(data.action === "add-dialogue") {
      if(!objectSelected.heroDialogueSets[data.setName]) {
        objectSelected.heroDialogueSets[data.setName] = {}
      }
      if(!objectSelected.heroDialogueSets[data.setName].dialogue) {
        objectSelected.heroDialogueSets[data.setName].dialogue = []
      }
      const { value: dialogue } = await Swal.fire({
        title: 'Edit Dialogue',
        text: "What is the dialogue?",
        input: 'text',
        inputAttributes: {
          autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Next',
      })
      if(!dialogue) return

      objectSelected.heroDialogueSets[data.setName].dialogue.push({...global.defaultDialogue, text: dialogue})
      networkEditObject(objectSelected, {heroDialogueSets: objectSelected.heroDialogueSets })
      return
    }

    if(data.action == "remove-dialogue") {
      let dialogueIndex = data.index
      objectSelected.heroDialogueSets[data.setName].dialogue.splice(dialogueIndex, 1)
      networkEditObject(objectSelected, {heroDialogueSets: objectSelected.heroDialogueSets})
    }

    if(data.action == "edit-dialogue") {
      let dialogueIndex = data.index
      const { value: dialogue } = await Swal.fire({
        title: 'Edit Dialogue',
        text: "What is the dialogue?",
        input: 'text',
        inputAttributes: {
          autocapitalize: 'off'
        },
        inputValue: objectSelected.heroDialogueSets[data.setName].dialogue[dialogueIndex].text,
        showCancelButton: true,
        confirmButtonText: 'Next',
      })
      if(!dialogue) return
      objectSelected.heroDialogueSets[data.setName].dialogue[dialogueIndex].text = dialogue
      networkEditObject(objectSelected, {heroDialogueSets: objectSelected.heroDialogueSets})
    }

    if(data.action === "set-as-current") {
      networkEditObject(objectSelected, {heroDialogueSet: data.setName })
      return
    }

    if(data.action === "rename-set") {
      const name = await global.getGlobalName()

      const oldSet = objectSelected.heroDialogueSets[data.setName]
      objectSelected.heroDialogueSets[data.setName] = null
      objectSelected.heroDialogueSets[name] = oldSet
      networkEditObject(objectSelected, {heroDialogueSets: objectSelected.heroDialogueSets })
      return
    }

    if(data.action === "remove-set") {
      objectSelected.heroDialogueSets[data.setName] = null
      networkEditObject(objectSelected, {heroDialogueSets: objectSelected.heroDialogueSets })
    }

    if(data.action === "turn-into-sequence") {
      const { value: id } = await Swal.fire({
        title: 'Turn dialogue into a sequence',
        text: "What will the id of the sequence be?",
        input: 'text',
        inputAttributes: {
          autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Ok',
      })

      const oldSet = objectSelected.heroDialogueSets[data.setName]
      objectSelected.heroDialogueSets[data.setName] = null
      if(!objectSelected.sequences) objectSelected.sequences = {}
      objectSelected.sequences[data.setName] = id

      GAME.library.sequences[id] = {
        id,
        items: oldSet.dialogue.map((dialogueJSON, i) => {
          return {
            id: global.alphaarray[i],
            effectValue: 'dialogue',
            sequenceType: 'sequenceDialogue',
            effectJSON: [dialogueJSON],
            next: 'sequential'
          }
        })
      }
      global.socket.emit('updateLibrary', { sequences: GAME.library.sequences })

      networkEditObject(objectSelected, {heroDialogueSets: objectSelected.heroDialogueSets, sequences: objectSelected.sequences })
      return
    }
}
