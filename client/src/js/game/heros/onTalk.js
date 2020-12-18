export default function onTalk(hero, collider, result, options) {
  if(collider.id !== hero.lastDialogueId) {
    let heroDialogueSetName = collider.mod().heroDialogueSet
    if(options.setName) heroDialogueSetName = options.setName
    let newDialogue
    if(heroDialogueSetName && collider.mod().heroDialogueSets && collider.mod().heroDialogueSets[heroDialogueSetName]) {
      newDialogue = collider.mod().heroDialogueSets[heroDialogueSetName].dialogue.slice()
    } else {
      newDialogue = collider.mod().heroDialogue.slice()
    }
    if(!options.fromInteractButton) hero.lastDialogueId = collider.id
    global.emitGameEvent('onHeroDialogueStart', hero, collider)
    if(hero.dialogue && hero.dialogue.length) {
      hero.dialogue.push(...newDialogue)
    } else {
      hero.dialogue = newDialogue
    }
    hero.flags.showDialogue = true
    hero.flags.paused = true
    hero._fireDialogueCompleteWithSpeakerId = true
    if(collider) {
      hero.dialogueId = collider.id
      if(options.fromInteractButton && collider.tags.loopInteractionOnDialogueComplete) {
        hero._loopDialogue = true
      }
      if(collider.name) {
        hero.dialogueName = collider.mod().name
      } else {
        hero.dialogueName = null
      }
    }

    if(collider.mod().tags['oneTimeTalker']) collider.tags['talker'] = false
    GAME.addOrResetTimeout(hero.id+'.lastDialogueId', 3, () => {
      hero.lastDialogueId = null
    })

    global.emitGameEvent('onUpdatePlayerUI', hero)
  }
}
