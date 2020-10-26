import React from 'react'
import ReactDOM from 'react-dom'
import Root from './Root.jsx'

import creatorLibrary from '../libraries/creatorLibrary.js'

class Creator {
  constructor() {
    this.container = null
    this.ref = null
  }

  onFirstPageGameLoaded() {
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
  }

  onEditHero(hero) {
    if(!PAGE.role.isAdmin && hero.id === HERO.id && (hero.creator || hero.flags)) {
      CREATOR.ref.setCreatorObjects(hero.creator)
    }
  }

  onUpdatePlayerUI(hero) {
    if(!PAGE.role.isAdmin && hero.id === HERO.id) {
      CREATOR.ref.setCreatorObjects(hero.creator)
    }
  }

  onUpdateLibrary(update) {
    if(update.creator) {
      CREATOR.ref.onUpdateLibrary()
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
      CREATOR.ref.forceUpdate()
    }, 100)
  }

  onStopGame() {
    setTimeout(() => {
      CREATOR.ref.forceUpdate()
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

window.CREATOR = new Creator()
