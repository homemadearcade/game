import React from 'react'
import classnames from 'classnames'
import { SpriteSheet } from 'react-spritesheet'

const KeySpriteSheetData = [{"name":"esc","x":1,"y":1,"width":17,"height":11},{"name":"q","x":53,"y":1,"width":11,"height":11},{"name":"w","x":77,"y":1,"width":11,"height":11},{"name":"e","x":101,"y":1,"width":11,"height":11},{"name":"r","x":125,"y":1,"width":11,"height":11},{"name":"t","x":149,"y":1,"width":11,"height":11},{"name":"y","x":173,"y":1,"width":11,"height":11},{"name":"u","x":197,"y":1,"width":11,"height":11},{"name":"i","x":221,"y":1,"width":11,"height":11},{"name":"o","x":245,"y":1,"width":11,"height":11},{"name":"p","x":269,"y":1,"width":11,"height":11},{"name":"esc--pressed","x":19,"y":3,"width":17,"height":9},{"name":"q--pressed","x":65,"y":3,"width":11,"height":9},{"name":"w--pressed","x":89,"y":3,"width":11,"height":9},{"name":"e--pressed","x":113,"y":3,"width":11,"height":9},{"name":"r--pressed","x":137,"y":3,"width":11,"height":9},{"name":"t--pressed","x":161,"y":3,"width":11,"height":9},{"name":"y--pressed","x":185,"y":3,"width":11,"height":9},{"name":"u--pressed","x":209,"y":3,"width":11,"height":9},{"name":"i--pressedd","x":233,"y":3,"width":11,"height":9},{"name":"o--pressed","x":257,"y":3,"width":11,"height":9},{"name":"p--pressed","x":281,"y":3,"width":11,"height":9},{"name":"tab","x":1,"y":13,"width":23,"height":11},{"name":"a","x":53,"y":13,"width":11,"height":11},{"name":"s","x":77,"y":13,"width":11,"height":11},{"name":"d","x":101,"y":13,"width":11,"height":11},{"name":"f","x":125,"y":13,"width":11,"height":11},{"name":"g","x":149,"y":13,"width":11,"height":11},{"name":"h","x":173,"y":13,"width":11,"height":11},{"name":"j","x":197,"y":13,"width":11,"height":11},{"name":"k","x":221,"y":13,"width":11,"height":11},{"name":"l","x":245,"y":13,"width":11,"height":11},{"name":"up","x":269,"y":13,"width":11,"height":11},{"name":"tab--pressed","x":25,"y":15,"width":23,"height":9},{"name":"a--pressed","x":65,"y":15,"width":11,"height":9},{"name":"s--pressed","x":89,"y":15,"width":11,"height":9},{"name":"d--pressed","x":113,"y":15,"width":11,"height":9},{"name":"f--pressed","x":137,"y":15,"width":11,"height":9},{"name":"g--pressed","x":161,"y":15,"width":11,"height":9},{"name":"h--pressed","x":185,"y":15,"width":11,"height":9},{"name":"j--pressed","x":209,"y":15,"width":11,"height":9},{"name":"k--pressed","x":233,"y":15,"width":11,"height":9},{"name":"l--pressed","x":257,"y":15,"width":11,"height":9},{"name":"up--pressed","x":281,"y":15,"width":11,"height":9},{"name":"shift","x":1,"y":25,"width":25,"height":11},{"name":"z","x":53,"y":25,"width":11,"height":11},{"name":"x","x":77,"y":25,"width":11,"height":11},{"name":"c","x":101,"y":25,"width":11,"height":11},{"name":"v","x":125,"y":25,"width":11,"height":11},{"name":"b","x":149,"y":25,"width":11,"height":11},{"name":"n","x":173,"y":25,"width":11,"height":11},{"name":"m","x":197,"y":25,"width":11,"height":11},{"name":"left","x":221,"y":25,"width":11,"height":11},{"name":"down","x":245,"y":25,"width":11,"height":11},{"name":"right","x":269,"y":25,"width":11,"height":11},{"name":"shift--pressed","x":27,"y":27,"width":25,"height":9},{"name":"z--pressed","x":65,"y":27,"width":11,"height":9},{"name":"x--pressed","x":89,"y":27,"width":11,"height":9},{"name":"c--pressed","x":113,"y":27,"width":11,"height":9},{"name":"v--pressed","x":137,"y":27,"width":11,"height":9},{"name":"b--pressed","x":161,"y":27,"width":11,"height":9},{"name":"n--pressed","x":185,"y":27,"width":11,"height":9},{"name":"m--pressed","x":209,"y":27,"width":11,"height":9},{"name":"left--pressed","x":233,"y":27,"width":11,"height":9},{"name":"down--pressed","x":257,"y":27,"width":11,"height":9},{"name":"right--pressed","x":281,"y":27,"width":11,"height":9},{"name":"control","x":1,"y":37,"width":21,"height":11},{"name":"alt","x":45,"y":37,"width":22,"height":11},{"name":"space","x":91,"y":37,"width":27,"height":11},{"name":"enter","x":147,"y":37,"width":27,"height":11},{"name":"back","x":203,"y":37,"width":21,"height":11},{"name":"back-arrow","x":247,"y":37,"width":27,"height":11},{"name":"control--pressed","x":23,"y":39,"width":21,"height":9},{"name":"alt--pressed","x":68,"y":39,"width":22,"height":9},{"name":"space--pressed","x":119,"y":39,"width":27,"height":9},{"name":"enter--pressed","x":175,"y":39,"width":27,"height":9},{"name":"back--pressed","x":225,"y":39,"width":21,"height":9},{"name":"back-arrow--pressed","x":275,"y":39,"width":27,"height":9}].reduce((acc, next) => {
  acc[next.name] = next
  return acc
}, {})

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
    const { onClose, dontShowAlt, showPressV } = this.props;

    const { scheme1, scheme2 } = this._getUsedKeys(GAME.heros[HERO.id].mod())

    return <div className="ControlsInfo">
       <div className="ControlsInfo__header">Controls</div>
       <div className="ControlsInfo__content">
      {scheme1.map((data) => {
        if(!data) return null
        return <div className="ControlsInfo__item">
          <div className="ControlsInfo__key">{this._renderKeySprite(data.key)}</div>
          <div className="ControlsInfo__behavior">{data.behavior}</div>
        </div>
      })}
      {!dontShowAlt && <React.Fragment>
        <div className="ControlsInfo__header">Alternative Controls</div>
        {scheme2.map((data) => {
          if(!data) return null
          return <div className="ControlsInfo__item">
            <div className="ControlsInfo__key">{this._renderKeySprite(data.key)}</div>
            <div className="ControlsInfo__behavior">{data.behavior}</div>
          </div>
        })}
      </React.Fragment>}
      {showPressV && <div className="ControlsInfo__header">Press
        <div className="ControlsInfo__key">{this._renderKeySprite('v')}</div>
         to continue</div>}
      </div>
    </div>
  }
}
