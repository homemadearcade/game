import React from 'react'
import ReactDOM from 'react-dom'
import Root from './Root.jsx'

class BelowManager {
  constructor() {
    this.container = null
    this.ref = null
  }

  open = (options) => {
    this.ref.open(options)
  }

  close = () => {
    this.ref.close()
  }

  onStopGame = () => {
    if(this.ref) this.ref.forceUpdate()
  }

  onGameStart = () => {
    if(this.ref) this.ref.forceUpdate()
  }

  onUpdateLibrary = () => {
    if(this.ref) this.ref.forceUpdate()
  }

  onEditHero = ({id}) => {
    if(id === HERO.editingId) {
      if(this.ref) this.ref.forceUpdate()
    }
  }

  onFirstPageGameLoaded() {
    const initialProps = {
      ref: ref => BELOWMANAGER.ref = ref
    }

    const container = document.createElement('div')
    container.id = 'BelowManagerContainer'
    document.body.appendChild(container)
    BELOWMANAGER.container = container

    // Mount React App
    ReactDOM.render(
      React.createElement(Root, initialProps),
      container
    )

    if(PAGE.role.isArcadeMode || !PAGE.role.isAdmin) BELOWMANAGER.container.style="display:none"
  }
}

global.BELOWMANAGER = new BelowManager()
