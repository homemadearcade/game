import React from 'react'
import ReactDOM from 'react-dom'
import Root from './Root.jsx'

class PlayerUI {
  constructor() {
    this.container = null
    this.ref = null
    this.updateStateInterval = null
  }

  onConstructEditorClose() {
    PLAYERUI.ref.forceUpdate()
  }
  onConstructEditorStart() {
    PLAYERUI.ref.forceUpdate()
  }

  onFirstPageGameLoaded() {
    // this.container = container
    const initialProps = {
      ref: ref => PLAYERUI.ref = ref
    }

    const container = document.createElement('div')
    container.id = 'PlayerUIContainer'
    document.getElementById('GameContainer').appendChild(container)
    PLAYERUI.container = container

    // Mount React App
    ReactDOM.render(
      React.createElement(Root, initialProps),
      container
    )
  }

  onResolveAdminApproval(id) {
    if(id === global.waitingForStart) {
      global.waitingForStart = null
      PLAYERUI.ref.onUpdateState()
    }
  }

  onGameOver() {
    setTimeout(() => {
      PLAYERUI.ref.forceUpdate()
    }, 102)
  }

  onGameReady() {
    setTimeout(() => {
      PLAYERUI.ref.forceUpdate()
    }, 100)
  }

  onEditHero(hero) {
    if(hero.id === HERO.id) {
      setTimeout(() => PLAYERUI.ref.onUpdateState())
    }
  }

  onGameStarted() {
    PLAYERUI.ref.forceUpdate()
  }

  onGameStopped() {
    PLAYERUI.ref.forceUpdate()
  }

  onUpdatePlayerUI(hero) {
    if(hero.id === HERO.id) {
      PLAYERUI.ref.onUpdateState(hero)
    }
  }

  onOpenLog() {
    PLAYERUI.ref.onUpdateState()
  }

  onCloseLog() {
    PLAYERUI.ref.onUpdateState()
  }

  onSendNotification(data) {
    if(!PLAYERUI.ref) return
    if((data.toast || data.modal) && (!data.playerUIHeroId || data.playerUIHeroId === HERO.id)) {
      PLAYERUI.ref.onSendNotification(data)
    } else if(data.log) {
      PLAYERUI.ref.onUpdateState()
    }
  }

  onNetworkUpdateHeros(heros) {
    heros.forEach((hero) => {
      if(hero.id === HERO.id && GAME.heros[hero.id]) {
        if(GAME.heros[hero.id].dialogue !== hero.dialogue) {
          PLAYERUI.ref.onUpdateState(hero)
        }
      }
    })
  }

  onHeroStartQuest(heroId, questId) {
    PLAYERUI.ref.onHeroStartQuest(heroId, questId)
  }

  onHeroCompleteQuest(heroId, questId) {
    PLAYERUI.ref.onHeroCompleteQuest(heroId, questId)
  }

  onShowUIGoalToast(text) {
    PLAYERUI.ref.onShowUIGoalToast(text)
  }
  onCloseUIGoalToast() {
    PLAYERUI.ref.onCloseUIGoalToast()
  }
}

global.PLAYERUI = new PlayerUI()
