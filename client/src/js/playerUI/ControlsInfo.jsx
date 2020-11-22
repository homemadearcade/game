import React from 'react'
import classnames from 'classnames'
import { SpriteSheet } from 'react-spritesheet'
import KeySprite from './KeySprite.jsx';

export default class ControlsInfo extends React.Component {

  _getUsedKeys = (hero) => {
    const scheme1 = []

    scheme1.push({ key: 'v', behavior: 'Interact'})
    scheme1.push(...this._getKeyDataArray('arrowKeysBehavior', hero))
    scheme1.push(this._getKeyDataArray('spaceBarBehavior', hero))
    scheme1.push(this._getKeyDataArray('zButtonBehavior', hero))
    scheme1.push(this._getKeyDataArray('xButtonBehavior', hero))
    scheme1.push(this._getKeyDataArray('cButtonBehavior', hero))

    const scheme2 = []
    scheme2.push({ key: 'e', behavior: 'Interact'})
    scheme2.push(...this._getKeyDataArray('arrowKeysBehavior', hero, true))
    scheme2.push(this._getKeyDataArray('spaceBarBehavior', hero))
    scheme2.push(this._getKeyDataArray('mButtonBehavior', hero))
    scheme2.push(this._getKeyDataArray('nButtonBehavior', hero))
    scheme2.push(this._getKeyDataArray('bButtonBehavior', hero))

    return { scheme1, scheme2 }
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
      let so = hero.subObjects[actionNameFromSubObject]
      if(so.actionButtonBehaviorLabel) {
        return {
          behavior: so.actionButtonBehaviorLabel,
          key
        }
      }
      return {
        behavior: window.actionButtonBehavior[so.actionButtonBehavior],
        key
      }
    }

    let windowName = behaviorPropName
    let key

    if(behaviorPropName === 'spaceBarBehavior' || behaviorPropName === 'mButtonBehavior' || behaviorPropName === 'nButtonBehavior' ||  behaviorPropName === 'bButtonBehavior' ||  behaviorPropName === 'xButtonBehavior' ||  behaviorPropName === 'zButtonBehavior' ||  behaviorPropName === 'cButtonBehavior') {
      if(!hero[behaviorPropName]) return null
      windowName = 'actionButtonBehavior'
      const key = behaviorPropName.charAt(0)

      if(hero.subObjects[hero[behaviorPropName]]) {
        return {
          behavior: window[windowName][hero.subObjects[hero[behaviorPropName]].actionButtonBehavior],
          key
        }
      }
      return {
        behavior: window[windowName][hero[behaviorPropName]],
        key
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

  _renderKeySprite(key) {
    return <SpriteSheet filename="assets/images/KeyUI.png" data={KeySpriteSheetData} sprite={key}/>
  }

  render() {
    const { onClose, dontShowAlt } = this.props;

    const { scheme1, scheme2 } = this._getUsedKeys(GAME.heros[HERO.id].mod())

    return <div className="ControlsInfo">
       <div className="ControlsInfo__header">Controls</div>
       <div className="ControlsInfo__content">
        {scheme1.map((data) => {
          if(!data) return null
          return <div className="ControlsInfo__item">
            <KeySprite className="ControlsInfo__key" keySprite={data.key}/>
            <div className="ControlsInfo__behavior">{data.behavior}</div>
          </div>
        })}
        {!dontShowAlt && <React.Fragment>
          <div className="ControlsInfo__header">Alternative Controls</div>
          {scheme2.map((data) => {
            if(!data) return null
            return <div className="ControlsInfo__item">
              <KeySprite className="ControlsInfo__key" keySprite={data.key}/>
              <div className="ControlsInfo__behavior">{data.behavior}</div>
            </div>
          })}
        </React.Fragment>}
      </div>
  </div>}
}
