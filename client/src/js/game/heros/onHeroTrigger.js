import onHeroUpdate from './onHeroUpdate'
import onTalk from './onTalk'
import onBehavior from './onBehavior'
import onCombat from './onCombat'
import { startQuest, completeQuest } from './quests'
import { pickupObject, withdrawFromInventory } from './inventory'
import { spawnAllNow } from '../spawnZone'
import effects from '../effects'

export function onHeroTrigger(hero, collider, result, options = { fromInteractButton: false }) {
  const isInteraction = options.fromInteractButton

  if(isInteraction) {
    const interactions = OBJECTS.getInteractions(hero, collider)
    if(interactions.length > 1) {
      hero.choiceOptions = interactions.slice().map((interaction) => {
        return {
          ...interaction,
          id: window.uniqueID(),
          effectValue: interaction.text
        }
      })
      hero.flags.showDialogue = true
      hero.flags.paused = true
      if(collider) {
        hero.dialogueId = collider.id
        if(collider.name) {
          hero.dialogueName = collider.name
        } else {
          hero.dialogueName = null
        }
      }

      window.emitGameEvent('onUpdatePlayerUI', hero)
      const removeEventListener = window.local.on('onHeroChooseOption', (heroId, choiceId) => {
        if(hero.id === heroId) {
          hero.choiceOptions.forEach((interaction) => {
            if(interaction.id !== choiceId) return
            removeEventListener()
            hero.flags.showDialogue = false
            hero.flags.paused = false
            hero.dialogueName = null
            hero.dialogueId = null
            hero.choiceOptions = null
            hero._cantInteract = true
            triggerInteraction(interaction, hero, collider, result, options)
            window.emitGameEvent('onUpdatePlayerUI', hero)
          })
        }
      })
    } else if(interactions.length){
      triggerInteraction(interactions[0], hero, collider, result, options)
    }
  } else {
    onCombat(hero, collider, result, options)
    let triggered

    if(collider.mod().tags['skipHeroGravityOnCollide']) {
      hero._skipNextGravity = true
    }

    if(collider.mod().tags['behaviorOnHeroCollide']) {
      onBehavior(hero, collider, result, options)
      triggered = true
    }

    if(collider.mod().tags['updateHeroOnHeroCollide']) {
      onHeroUpdate(hero, collider, result, options)
      triggered = true
    }

    if(collider.tags && collider.mod().tags['talker'] && collider.heroDialogue && collider.heroDialogue.length) {
      if(collider.mod().tags['talkOnHeroCollide']) {
        onTalk(hero, collider, result, options)
        triggered = true
      }
    }

    if(collider.tags && collider.mod().tags['questGiver'] && collider.questGivingId && hero.quests && hero.questState && hero.questState[collider.questGivingId] && !hero.questState[collider.questGivingId].started && !hero.questState[collider.questGivingId].completed) {
      if(collider.mod().tags['giveQuestOnHeroCollide']) {
        startQuest(hero, collider.mod().questGivingId)
        triggered = true
      }
    }

    if(collider.tags && collider.mod().tags['questCompleter'] && collider.questCompleterId && hero.quests && hero.questState && hero.questState[collider.questCompleterId] && hero.questState[collider.questCompleterId].started && !hero.questState[collider.questCompleterId].completed) {
      if(collider.mod().tags['completeQuestOnHeroCollide']) {
        completeQuest(hero, collider.mod().questCompleterId)
        triggered = true
      }
    }

    if(collider.tags && collider.mod().tags['cameraShakeOnCollide_quickrumble']) {
      window.socket.emit('heroCameraEffect', 'cameraShake', hero.id, { duration: 50, frequency: 10, amplitude: 5})
      triggered = true
    }

    if(collider.tags && collider.mod().tags['cameraShakeOnCollide_longrumble']) {
      window.socket.emit('heroCameraEffect', 'cameraShake', hero.id, { duration: 3000, frequency: 10, amplitude: 8 })
      triggered = true
    }

    if(collider.tags && collider.mod().tags['cameraShakeOnCollide_quick']) {
      window.socket.emit('heroCameraEffect', 'cameraShake', hero.id, { duration: 50, frequency: 10, amplitude: 24})
      triggered = true
    }

    if(collider.tags && collider.mod().tags['cameraShakeOnCollide_short']) {
      window.socket.emit('heroCameraEffect', 'cameraShake', hero.id, { duration: 500, frequency: 20, amplitude: 36 })
      triggered = true
    }

    if(collider.tags && collider.mod().tags['cameraShakeOnCollide_long']) {
      window.socket.emit('heroCameraEffect', 'cameraShake', hero.id, { duration: 2000, frequency: 40, amplitude: 36 })
      triggered = true
    }

    if(collider.tags && collider.mod().tags['pickupable'] && collider.mod().tags['pickupOnHeroCollide']) {
      pickupObject(hero, collider)
      triggered = true
    }

    if(collider.tags && collider.mod().tags['resourceZone'] && collider.mod().tags['resourceWithdrawOnCollide']) {
      let subObjectNameToWithdraw = window.getResourceSubObjectNames(collider, collider)

      if(subObjectNameToWithdraw) withdrawFromInventory(hero, collider, subObjectNameToWithdraw, collider.resourceWithdrawAmount)
      triggered = true
    }

    if(collider.tags && collider.mod().tags['resourceZone'] && collider.mod().tags['resourceDepositAllOnCollide']) {
      let subObjectNameToWithdraw = window.getResourceSubObjectNames(hero, collider)

      if(subObjectNameToWithdraw) {
        const so = hero.subObjects[subObjectNameToWithdraw]
        withdrawFromInventory(collider, hero, subObjectNameToWithdraw, so.count)
      }
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

  if(interaction.heroEffect) {
    effects.processEffect({ effectName: interaction.heroEffect }, hero, collider)
  }
  if(interaction.guestEffect) {
    effects.processEffect({ effectName: interaction.guestEffect }, collider, hero)
  }

  if(interactionName === 'behavior') {
    onBehavior(hero, collider, result, options)
    triggered = true
  }

  if(interactionName === 'updateHero') {
    onHeroUpdate(hero, collider, result, options)
    triggered = true
  }

  if(interactionName === 'talk' && collider.heroDialogue && collider.heroDialogue.length) {
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

  if(interactionName === 'resourceWithdraw') {
    let subObjectNameToWithdraw = window.getResourceSubObjectNames(collider, collider)

    if(subObjectNameToWithdraw) withdrawFromInventory(hero, collider, subObjectNameToWithdraw, collider.resourceWithdrawAmount)
    triggered = true
  }

  if(interactionName === 'resourceDeposit') {
    let subObjectNameToWithdraw = window.getResourceSubObjectNames(hero, collider)

    if(subObjectNameToWithdraw) {
      const so = hero.subObjects[subObjectNameToWithdraw]
      withdrawFromInventory(collider, hero, subObjectNameToWithdraw, so.count)
    }
    triggered = true
  }

  if(collider.tags && triggered && collider.mod().tags['destroyAfterTrigger']) {
    collider._remove = true
  }
}

window.getResourceSubObjectNames = function(object, zone) {
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
