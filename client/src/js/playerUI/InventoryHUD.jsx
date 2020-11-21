import React from 'react'
import { Textfit } from 'react-textfit';
import PixiMapSprite from '../components/PixiMapSprite.jsx'
import classnames from 'classnames';
import Arrow from '@elsdoerfer/react-arrow';

export default class Goals extends React.Component{
  constructor(props) {
    super(props)
  }

  render() {
    const hero = GAME.heros[HERO.id]

    const subObjects = Object.keys(hero.subObjects).map((soName) => {
      return hero.subObjects[soName]
    }).filter((so) => {
      return so.mod().tags.showCountInHUD
    })

    return <div className="InventoryHUD">
      {subObjects.map((so) => {
        return <div className="InventoryHUD__item" data-inventoryMenuId={so.id}>
          <div className="InventoryHUD__name" data-inventoryMenuId={so.id}>{so.name || so.subObjectName}</div>
          {so.defaultSprite && so.defaultSprite !== 'solidcolorsprite' && <div data-inventoryMenuId={so.id} className="InventoryHUD__sprite"><PixiMapSprite textureId={so.defaultSprite} width="20" height="20"/></div>}
          <div className="InventoryHUD__count" data-inventoryMenuId={so.id}>x{so.count || 0}</div>
        </div>
      })}
    </div>
  }
}
