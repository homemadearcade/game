export default function onTalk(hero, collider, result, options) {
  console.log('X')
  if(collider.id !== hero.lastDialogueId) {

    const heroDialogueSetName = collider.mod().heroDialogueSet
    let newDialogue
    if(heroDialogueSetName && collider.mod().heroDialogueSets && collider.mod().heroDialogueSets[heroDialogueSetName]) {
      newDialogue = collider.mod().heroDialogueSets[heroDialogueSetName].dialogue.slice()
    } else {
      newDialogue = collider.mod().heroDialogue.slice()
    }
    if(!options.fromInteractButton) hero.lastDialogueId = collider.id
    window.emitGameEvent('onHeroDialogueStart', hero, collider)
    hero.dialogue = newDialogue
    hero.flags.showDialogue = true
    hero.flags.paused = true
    hero._fireDialogueCompleteWithSpeakerId = true
    if(collider) {
      hero.dialogueId = collider.id
      console.log(options.fromInteractButton, collider.tags.loopInteractionOnDialogueComplete)
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
    window.emitGameEvent('onUpdatePlayerUI', hero)
  }
}
