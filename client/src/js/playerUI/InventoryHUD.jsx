import React from 'react'
import { Textfit } from 'react-textfit';
import PixiMapSprite from '../components/PixiMapSprite.jsx'
import classnames from 'classnames';
import Arrow from '@elsdoerfer/react-arrow';

export default class Goals extends React.Component{
  constructor(props) {
    super(props)
  }

  _showInventoryModal() {
    PLAYERUI.ref.showInventoryModal()
  }

  _renderScore() {
    const hero = GAME.heros[HERO.id]

    let score = hero.score

    Object.keys(hero.subObjects).forEach((soname) => {
      const so = hero.subObjects[soname]
      if(so.inInventory) {
        if(so.scoreAdd) score += (so.scoreAdd || 1)
        if(so.scoreSubtract) score -= (so.scoreSubtract || 1)
      }
    })

    return <div className="InventoryHUD__item">
      <div className="InventoryHUD__name">Score</div>
      <div className="InventoryHUD__count">x{hero.score}</div>
    </div>
  }

  _renderLives() {
    const hero = GAME.heros[HERO.id]

    return <div className="InventoryHUD__item">
      <div className="InventoryHUD__name">Lives</div>
      {hero.defaultSprite && hero.defaultSprite !== 'solidcolorsprite' && <div className="InventoryHUD__sprite"><PixiMapSprite tint={hero.color} textureId={hero.defaultSprite} width="40" height="40"/></div>}
      <div className="InventoryHUD__count">x{hero.lives}</div>
    </div>
  }

  render() {
    const hero = GAME.heros[HERO.id]

    const subObjects = Object.keys(hero.subObjects).map((soName) => {
      return hero.subObjects[soName]
    }).filter((so) => {
      if(!so.tags) return
      return so.mod().tags.showCountInHUD
    })

    return <div className="InventoryHUD">
      {hero.flags.showLives && this._renderLives()}
      {hero.flags.showScore && this._renderScore()}
      {subObjects.map((so) => {
        return <div className="InventoryHUD__item" onClick={this._showInventoryModal} data-inventoryMenuId={so.id}>
          <div className="InventoryHUD__name" data-inventoryMenuId={so.id}>{so.name || so.subObjectName}</div>
          {so.defaultSprite && so.defaultSprite !== 'solidcolorsprite' && <div data-inventoryMenuId={so.id} className="InventoryHUD__sprite"><PixiMapSprite tint={so.color} textureId={so.defaultSprite} width="40" height="40"/></div>}
          <div className="InventoryHUD__count" data-inventoryMenuId={so.id}>x{so.count || 0}</div>
        </div>
      })}
    </div>
  }
}
