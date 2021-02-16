import React from 'react'
import ReactDOM from 'react-dom'
import Root from './Root.jsx'

import creatorLibrary from '../libraries/creatorLibrary.js'

class Creator {
  constructor() {
    this.container = null
    this.ref = null
  }

  onGameReady() {
    setTimeout(() => {
      creatorLibrary.onFirstPageGameLoaded()

      // this.container = container
      const initialProps = {
        ref: ref => CREATOR.ref = ref
      }

      const container = document.getElementById('Creator')
      CREATOR.container = container

      // Mount React App
      ReactDOM.render(
        React.createElement(Root, initialProps),
        container
      )
    })
  }

  onChangeGame() {
    if(!CREATOR.ref) return
    if(!PAGE.role.isAdmin) CREATOR.ref.setCreatorObjects(GAME.heros[HERO.id].creator)
    CREATOR.ref.onUpdateLibrary()
  }

  onEditHero(hero) {
    if(!PAGE.role.isAdmin && hero.id === HERO.id && (hero.creator || hero.flags)) {
      if(CREATOR.ref) CREATOR.ref.setCreatorObjects(GAME.heros[HERO.id].creator)
    }
  }

  onUpdatePlayerUI(hero) {
    if(!PAGE.role.isAdmin && hero.id === HERO.id) {
      if(CREATOR.ref) CREATOR.ref.setCreatorObjects(hero.creator)
    }
  }

  onUpdateLibrary(update) {
    if(update.creator) {
      if(CREATOR.ref) CREATOR.ref.onUpdateLibrary()
    }
  }

  close() {
    CREATOR.ref.close()
  }

  open() {
    CREATOR.ref.open()
  }

  onGameStart() {
    setTimeout(() => {
      if(!PAGE.role.isAdmin) CREATOR.ref.setCreatorObjects(GAME.heros[HERO.id].creator)
      CREATOR.ref.onUpdateLibrary()
    }, 100)
  }

  onStopGame() {
    setTimeout(() => {
      if(!PAGE.role.isAdmin) CREATOR.ref.setCreatorObjects(GAME.heros[HERO.id].creator)
      CREATOR.ref.onUpdateLibrary()
    }, 100)
  }

  onSelectTextureId(id, service) {
    if(service === 'creator') {
      CREATOR.ref.setTextureId(id)
    }
  }

  onConstructEditorClose() {
    CREATOR.ref.forceUpdate()
  }
  onConstructEditorStart() {
    CREATOR.ref.forceUpdate()
  }
  onPathEditorClose() {
    CREATOR.ref.forceUpdate()
  }
  onPathEditorStart() {
    CREATOR.ref.forceUpdate()
  }

}

global.CREATOR = new Creator()
