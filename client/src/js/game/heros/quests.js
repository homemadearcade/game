function startQuest(hero, questId) {
  const quest = hero.quests[questId]
  const questState = hero.questState[questId]
  if(!quest || !questState) {
    return console.log('no quest', questId)
  }
  questState.started = true
  questState.active = true
  global.emitGameEvent('onHeroStartQuest', hero, questId)
  global.socket.emit('startQuest', hero.id, questId)
}

function completeQuest(hero, questId) {
  const quest = hero.quests[questId]
  const questState = hero.questState[questId]
  if(!quest || !questState) {
    return console.log('no quest', questId)
  }
  questState.started = true
  questState.completed = true
  questState.active = false
  global.socket.emit('completeQuest', hero.id, questId)
  if(quest.nextQuestId) {
    startQuest(hero, quest.nextQuestId)
  }
}

export {
  startQuest,
  completeQuest,
}
