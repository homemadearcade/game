import React from 'react'
import classnames from 'classnames'
import { Textfit } from 'react-textfit';
import ControlTimeout from './ControlTimeout.jsx';
import KeySprite from './KeySprite.jsx';

// 'debounce-action-' + subObject.id + subObject.actionButtonBehavior
// object.id -dashable
// object.id -floatable
export default class ControlsHUD extends React.Component {
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
      let so = hero.subObjects[actionNameFromSubObject]

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
    const data = this._getKeyDataArray(behavior, hero)

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
    const hero = GAME.heros[HERO.id].mod()

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
