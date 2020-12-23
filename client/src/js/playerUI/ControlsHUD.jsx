import React from 'react'
import classnames from 'classnames'
import { Textfit } from 'react-textfit';
import ControlTimeout from './ControlTimeout.jsx';
import KeySprite from './KeySprite.jsx';

// 'debounce-action-' + subObject.id + subObject.actionButtonBehavior
// object.id -dashable
// object.id -floatable
export default class ControlsHUD extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hero: {}
    }
  }
  componentDidMount() {
    this.setState({
      hero: GAME.heros[HERO.id]
    })

    global.local.on('onNetworkUpdateHeros', (heros) => {
      const { hero } = this.state
      heros.forEach((updatedHero) => {
        if(updatedHero.id === HERO.id && GAME.heros[updatedHero.id]) {
          const changed = updatedHero.subObjects != hero.subObjects || updatedHero.interactableObjectId != hero.interactableObjectId || updatedHero.arrowKeysBehavior != hero.arrowKeysBehavior  || updatedHero.zButtonBehavior != hero.zButtonBehavior || updatedHero.xButtonBehavior != hero.xButtonBehavior || updatedHero.cButtonBehavior != hero.cButtonBehavior || updatedHero.spaceBarBehavior != hero.spaceBarBehavior
          if(changed || updatedHero.interactableObjectId === null || updatedHero.arrowKeysBehavior === null || updatedHero.zButtonBehavior === null || updatedHero.xButtonBehavior === null || updatedHero.spaceBarBehavior === null || updatedHero.cButtonBehavior === null || updatedHero.interactableObjectId || updatedHero.arrowKeysBehavior || updatedHero.zButtonBehavior || updatedHero.xButtonBehavior || updatedHero.spaceBarBehavior || updatedHero.cButtonBehavior) {
            this.setState({
              hero: {...hero, ...updatedHero}
            })
          }
        }
      })
    })
  }

  _getKeyDataArray(behaviorPropName, hero, alt) {
    let actionNameFromSubObject;
    let actionName;
    Object.keys(hero.subObjects).forEach((name) => {
      if(hero[behaviorPropName] === hero.subObjects[name].subObjectName) {
        actionName = hero.subObjects.actionButtonBehavior
        actionNameFromSubObject = name
      }
    })

    if(actionNameFromSubObject) {
      const key = behaviorPropName.charAt(0)
      let so = hero.subObjects[actionNameFromSubObject].mod()

      let timeoutId = 'debounce-action-' + so.id + so.actionButtonBehavior
      if(so.actionButtonBehavior === 'floatJump') {
        timeoutId = hero.id+'-floatable'
      }
      if(so.actionButtonBehavior === 'dash' || so.actionButtonBehavior === 'teleportDash') {
        timeoutId = hero.id+'-dashable'
      }

      if(so.actionButtonBehaviorLabel) {
        return {
          behavior: so.actionButtonBehaviorLabel,
          key,
          timeoutId,
        }
      }
      return {
        behavior: global.actionButtonBehavior[so.actionButtonBehavior],
        key,
        timeoutId,
      }
    }

    let windowName = behaviorPropName
    let key

    if(behaviorPropName === 'spaceBarBehavior' || behaviorPropName === 'mButtonBehavior' || behaviorPropName === 'nButtonBehavior' ||  behaviorPropName === 'bButtonBehavior' ||  behaviorPropName === 'xButtonBehavior' ||  behaviorPropName === 'zButtonBehavior' ||  behaviorPropName === 'cButtonBehavior') {
      if(!hero[behaviorPropName]) return null
      windowName = 'actionButtonBehavior'
      const key = behaviorPropName.charAt(0)
      let so = hero.subObjects[hero[behaviorPropName]]

      let timeoutId


      if(so) {
        timeoutId = 'debounce-action-' + so.id + so.actionButtonBehavior
        if(so.actionButtonBehavior === 'floatJump') {
          timeoutId = hero.id+'-floatable'
        }
        if(so.actionButtonBehavior === 'dash' || so.actionButtonBehavior === 'teleportDash') {
          timeoutId = hero.id+'-dashable'
        }
        return {
          behavior: window[windowName][so.actionButtonBehavior],
          key,
          timeoutId
        }
      }

      let action = hero[behaviorPropName]
      if(action === 'floatJump') {
        timeoutId = hero.id+'-floatable'
      }
      if(action === 'dash' || action === 'teleportDash') {
        timeoutId = hero.id+'-dashable'
      }

      return {
        behavior: window[windowName][hero[behaviorPropName]],
        key,
        timeoutId
      }
    }

    if(alt) windowName+='2'
    if(!window[windowName][hero[behaviorPropName]]) return []

    return Object.keys(window[windowName][hero[behaviorPropName]]).map((key) => {
      return {
        behavior: window[windowName][hero[behaviorPropName]][key],
        key,
      }
    })
  }

  _renderKeyData(hero, behavior, key) {
    const data = this._getKeyDataArray(behavior, hero.mod())

    if(data) {
      let behavior = data.behavior
      if(behavior) {
        let parenthesisIndex = behavior.indexOf('(')
        if(parenthesisIndex > 3) {
          behavior = behavior.slice(0, parenthesisIndex - 1)
        }

        const timeout = GAME.gameState.timeoutsById[data.timeoutId]
        if(timeout && timeout.timeRemaining >= 0) {
          return <div className="ControlsHUD__keyinfo">
              {behavior}
              <KeySprite className="ControlsHUD__key" keySprite={key}></KeySprite>
              <ControlTimeout timeout={timeout}/>
          </div>
        } else {
          return <div className="ControlsHUD__keyinfo">
              {behavior}
              <KeySprite className="ControlsHUD__key" keySprite={key}></KeySprite>
          </div>
        }
      }
    }
  }

  render() {
    const { hero } = this.state
    // const hero = GAME.heros[HERO.id].mod()

    if(!hero.keysDown) return null

    return <div className="ControlsHUD">
      {hero.zButtonBehavior && <div className="ControlsHUD__actioninfo">
        {this._renderKeyData(hero, 'zButtonBehavior', 'z')}
      </div>}
      {hero.xButtonBehavior && <div className="ControlsHUD__actioninfo">
        {this._renderKeyData(hero, 'xButtonBehavior', 'x')}
      </div>}
      {hero.cButtonBehavior && <div className="ControlsHUD__actioninfo">
        {this._renderKeyData(hero, 'cButtonBehavior', 'c')}
      </div>}
      {hero.spaceBarBehavior && <div className="ControlsHUD__actioninfo">
        {this._renderKeyData(hero, 'spaceBarBehavior', 'space')}
      </div>}
      {hero.interactableObjectId && <div className="ControlsHUD__actioninfo">
        <div className="ControlsHUD__keyinfo">
            Interact
        </div>
        <KeySprite className="ControlsHUD__key" keySprite={'v'}/>
      </div>}
    </div>
  }
}
