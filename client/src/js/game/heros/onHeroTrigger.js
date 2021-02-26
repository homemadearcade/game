import onHeroUpdate from './onHeroUpdate.js'
import onTalk from './onTalk.js'
import onBehavior from './onBehavior.js'
import onCombat from './onCombat.js'
import { startQuest, completeQuest } from './quests.js'
import { pickupObject, withdrawFromInventory } from './inventory.js'
import { spawnAllNow } from '../spawnZone.js'
import effects from '../effects.js'

export function onHeroTrigger(hero, collider, result, options = { fromInteractButton: false }) {
  const isInteraction = options.fromInteractButton

  if(options.skipToInteraction) {
    triggerInteraction({ interaction: options.skipToInteraction }, hero, collider, result, options)
    return
  }

  if(isInteraction) {
    if(!options.skipGreeting && collider.heroDialogueSets && collider.heroDialogueSets.greeting && collider.heroDialogueSets.greeting.dialogue && collider.heroDialogueSets.greeting.dialogue.length) {
      effects.processEffect({ effectName: 'dialogue', effectJSON: collider.heroDialogueSets.greeting.dialogue }, hero, collider)
      const removeEL = global.local.on('onHeroDialogueComplete', (heroDialoguing) => {
        if(heroDialoguing.id === hero.id) {
          onHeroTrigger(hero, collider, result, {...options, skipGreeting: true})
          removeEL()
        }
      })
      return
    }

    const interactions = OBJECTS.getInteractions(hero, collider)
    if(interactions.length > 1) {
      hero.choiceOptions = interactions.slice().map((interaction) => {
        return {
          ...interaction,
          id: global.uniqueID(),
          effectValue: interaction.text
        }
      })
      global.emitGameEvent('onHeroOptionStart', hero)
      hero.flags.showChoices = true
      hero.flags.paused = true
      if(collider) {
        hero.dialogueId = collider.id
        if(collider.name) {
          hero.dialogueName = collider.name
        } else {
          hero.dialogueName = null
        }
      }

      global.emitGameEvent('onUpdatePlayerUI', hero)
      const removeEventListener = global.local.on('onHeroChooseOption', (heroId, choiceId) => {
        if(hero.id === heroId) {
          hero.choiceOptions.forEach((interaction) => {
            if(interaction.id !== choiceId) return
            removeEventListener()
            hero.flags.showChoices = false
            hero.flags.paused = false
            hero.dialogueName = null
            hero.dialogueId = null
            hero.choiceOptions = null
            hero._cantInteract = true
            triggerInteraction(interaction, hero, collider, result, options)
            global.emitGameEvent('onHeroOptionComplete', hero)
            global.emitGameEvent('onUpdatePlayerUI', hero)
          })
        }
      })
    } else if(interactions.length){
      triggerInteraction(interactions[0], hero, collider, result, options)
    }
  } else {
    onCombat(hero, collider, result, options)
    let triggered

    let moddedTags = collider.mod().tags

    if(moddedTags.destroyOnHeroCollide) {
      collider._destroy = true
      collider._destroyedById = hero.id
    }

    if(moddedTags['skipHeroGravityOnCollide']) {
      hero._skipNextGravity = true
    }

    if(moddedTags['behaviorOnHeroCollide']) {
      onBehavior(hero, collider, result, options)
      triggered = true
    }

    if(moddedTags['updateHeroOnHeroCollide']) {
      onHeroUpdate(hero, collider, result, options)
      triggered = true
    }

    if(collider.tags && moddedTags['talker'] && collider.heroDialogueSet && collider.heroDialogueSets && collider.heroDialogueSets[collider.heroDialogueSet] && collider.heroDialogueSets[collider.heroDialogueSet].dialogue && collider.heroDialogueSet && collider.heroDialogueSets && collider.heroDialogueSets[collider.heroDialogueSet] && collider.heroDialogueSets[collider.heroDialogueSet].dialogue.length) {
      if(moddedTags['talkOnHeroCollide']) {
        onTalk(hero, collider, result, options)
        triggered = true
      }
    }

    if(collider.tags && moddedTags['questGiver'] && collider.questGivingId && hero.quests && hero.questState && hero.questState[collider.questGivingId] && !hero.questState[collider.questGivingId].started && !hero.questState[collider.questGivingId].completed) {
      if(moddedTags['giveQuestOnHeroCollide']) {
        startQuest(hero, collider.mod().questGivingId)
        triggered = true
      }
    }

    if(collider.tags && moddedTags['questCompleter'] && collider.questCompleterId && hero.quests && hero.questState && hero.questState[collider.questCompleterId] && hero.questState[collider.questCompleterId].started && !hero.questState[collider.questCompleterId].completed) {
      if(moddedTags['completeQuestOnHeroCollide']) {
        completeQuest(hero, collider.mod().questCompleterId)
        triggered = true
      }
    }

    // if(moddedTags['attachToHeroOnCollideParent'] ) {
    //   collider.parentId = hero.id
    // }
    //
    // if(moddedTags['attachToHeroOnCollideRelative'] ) {
    //   collider.relativeId = hero.id
    // }
    //
    // if(moddedTags['attachHeroOnCollideParent'] ) {
    //   hero._parentId = collider.id
    // }
    //
    // if(moddedTags['attachHeroOnCollideRelative'] ) {
    //   hero._relativeId = collider.id
    // }

    if(collider.tags && moddedTags['changeHeroSpawnPointOnCollide']) {
      hero.spawnPointX = collider.x
      hero.spawnPointY = collider.y
    }

    if(collider.tags && moddedTags['cameraShakeOnCollide_quickrumble']) {
      global.socket.emit('heroCameraEffect', 'cameraShake', hero.id, { duration: 50, frequency: 10, amplitude: 5})
      triggered = true
    }

    if(collider.tags && moddedTags['cameraShakeOnCollide_longrumble']) {
      global.socket.emit('heroCameraEffect', 'cameraShake', hero.id, { duration: 3000, frequency: 10, amplitude: 8 })
      triggered = true
    }

    if(collider.tags && moddedTags['cameraShakeOnCollide_quick']) {
      global.socket.emit('heroCameraEffect', 'cameraShake', hero.id, { duration: 50, frequency: 10, amplitude: 24})
      triggered = true
    }

    if(collider.tags && moddedTags['cameraShakeOnCollide_short']) {
      global.socket.emit('heroCameraEffect', 'cameraShake', hero.id, { duration: 500, frequency: 20, amplitude: 36 })
      triggered = true
    }

    if(collider.tags && moddedTags['cameraShakeOnCollide_long']) {
      global.socket.emit('heroCameraEffect', 'cameraShake', hero.id, { duration: 2000, frequency: 40, amplitude: 36 })
      triggered = true
    }

    if(collider.tags && moddedTags['pickupable'] && moddedTags['pickupOnHeroCollide']) {
      pickupObject(hero, collider)
      triggered = true
    }

    if(collider.tags && moddedTags['resourceZone'] && moddedTags['resourceWithdrawOnCollide']) {
      let subObjectNameToWithdraw = global.getResourceSubObjectNames(collider, collider)

      if(subObjectNameToWithdraw) withdrawFromInventory(hero, collider, subObjectNameToWithdraw, collider.resourceWithdrawAmount)
      triggered = true
    }

    if(collider.tags && moddedTags['resourceZone'] && moddedTags['resourceDepositAllOnCollide']) {
      let subObjectNameToWithdraw = global.getResourceSubObjectNames(hero, collider)

      if(subObjectNameToWithdraw) {
        const so = hero.subObjects[subObjectNameToWithdraw]
        withdrawFromInventory(collider, hero, subObjectNameToWithdraw, so.count)
      }
      triggered = true
    }

    if(moddedTags.tempModOnHeroCollide) {
      if(!hero._tempMods) hero._tempMods = []
      hero._tempMods.push(collider.heroTempMod)
      triggered = true
    }

    if(collider.tags && triggered && collider.mod().tags['destroyAfterTrigger']) {
      collider._remove = true
    }
  }
}


export function triggerInteraction(interaction, hero, collider, result, options) {
  let interactionName = interaction.interaction
  let triggered = false

  if(interaction.dialogueChoice) {
    const { heroEffect, heroEffectProps, guestEffectProps, guestEffect, heroDialogue, heroDialogueSet, guestSequenceId } = interaction.dialogueChoice

    if(heroDialogue) {
      effects.processEffect({ effectName: 'dialogue', effectJSON: heroDialogue }, hero, collider)
    }
    if(heroDialogueSet) {
      effects.processEffect({ effectName: 'dialogueSet', effectValue: heroDialogueSet }, hero, collider)
    }
    if(heroEffect) {
      effects.processEffect({ effectName: heroEffect, ...interaction.dialogueChoice.heroEffectProps }, hero, collider)
    }
    if(guestEffect) {
      effects.processEffect({ effectName: guestEffect, ...interaction.dialogueChoice.guestEffectProps}, collider, hero)
    }
    if(guestSequenceId) {
      effects.processEffect({ effectName: 'startLocalSequence', effectValue: guestSequenceId }, collider, hero)
    }

    if(interaction.dialogueChoice.triggerPool) {
      if(hero.dialogueChoices[interaction.dialogueChoice.id]) hero.dialogueChoices[interaction.dialogueChoice.id].triggerPool -= 1
    }
  }


  if(interactionName === 'behavior') {
    onBehavior(hero, collider, result, options)
    triggered = true
  }

  if(interactionName === 'updateHero') {
    onHeroUpdate(hero, collider, result, options)
    triggered = true
  }

  if(interactionName === 'talk' && collider.heroDialogueSet && collider.heroDialogueSets && collider.heroDialogueSets[collider.heroDialogueSet] && collider.heroDialogueSets[collider.heroDialogueSet].dialogue && collider.heroDialogueSet && collider.heroDialogueSets && collider.heroDialogueSets[collider.heroDialogueSet] && collider.heroDialogueSets[collider.heroDialogueSet].dialogue.length) {
    onTalk(hero, collider, result, options)
    triggered = true
  }

  if(interactionName === 'giveQuest' && collider.questGivingId && hero.quests && hero.questState && hero.questState[collider.questGivingId] && !hero.questState[collider.questGivingId].started && !hero.questState[collider.questGivingId].completed) {
    startQuest(hero, collider.mod().questGivingId)
    triggered = true
  }

  if(interactionName === 'completeQuest' && collider.questCompleterId && hero.quests && hero.questState && hero.questState[collider.questCompleterId] && hero.questState[collider.questCompleterId].started && !hero.questState[collider.questCompleterId].completed) {
    completeQuest(hero, collider.mod().questCompleterId)
    triggered = true
  }

  if(interactionName === 'pickup') {
    pickupObject(hero, collider)
    triggered = true
  }

  if(interactionName === 'spawnAllInHeroInventory') {
    spawnAllNow(collider, hero)
    triggered = true
  }

  if(interactionName === 'spawn') {
    spawnAllNow(collider)
    triggered = true
  }

  if(interactionName === 'integratedInteractEvent') {
    global.local.emit('onHeroInteract--integrated', hero, collider)
    triggered = true
  }

  if(interactionName === 'resourceWithdraw') {
    let subObjectNameToWithdraw = global.getResourceSubObjectNames(collider, collider)

    if(subObjectNameToWithdraw) withdrawFromInventory(hero, collider, subObjectNameToWithdraw, collider.resourceWithdrawAmount)
    triggered = true
  }

  if(interactionName === 'resourceDeposit') {
    let subObjectNameToWithdraw = global.getResourceSubObjectNames(hero, collider)

    if(subObjectNameToWithdraw) {
      const so = hero.subObjects[subObjectNameToWithdraw]
      withdrawFromInventory(collider, hero, subObjectNameToWithdraw, so.count)
    }
    triggered = true
  }

  if(interactionName === 'puzzleStart') {
    global.emitEvent('onHeroStartPuzzle', hero, collider)
  }

  if(collider.tags && triggered && collider.mod().tags['destroyAfterTrigger']) {
    collider._remove = true
  }
}

global.getResourceSubObjectNames = function(object, zone) {
  if(!object.subObjects) return null

  let subObjectNames = []

  const tagsAllowed = zone.resourceTags
  Object.keys(object.subObjects).forEach((subObjectName) => {
    const so = object.subObjects[subObjectName]
    const hasTag = Object.keys(tagsAllowed).some((tag) => {
      if(!tagsAllowed[tag]) return false
      return so.tags[tag]
    })
    if(hasTag) subObjectNames.push(subObjectName)
  })

  return subObjectNames[0]
}
