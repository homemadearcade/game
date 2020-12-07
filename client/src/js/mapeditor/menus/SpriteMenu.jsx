import React from 'react'
import Menu, { SubMenu, MenuItem } from 'rc-menu'
import modals from '../modals.js'
import SpriteChooser from '../SpriteChooser.js';

export default class SpriteMenu extends React.Component{
  constructor(props) {
    super(props)

    this._handleSpriteMenuClick = ({ key }) => {
      const { objectSelected } = this.props
      const { networkEditObject } = MAPEDITOR

      if(key === 'open-media-manager-sprite-selector') {
        BELOWMANAGER.open({ selectedManager: 'MediaManager', selectedMenu: 'SpriteSelector', objectSelected, spriteValue: 'default'})
        return
      }

      if(key === 'apply-sprite-to-all-of-color') {
        window.socket.emit('editObjects', GAME.objects.filter((object) => {
          if(object.color === objectSelected.color) return true
        }).map((object) => {
          return {
            id: object.id,
            defaultSprite: objectSelected.sprite,
          }
        }))
        return
      }

      if(key === 'select-sprite-equipped') {
        BELOWMANAGER.open({ selectedManager: 'MediaManager', selectedMenu: 'SpriteSelector', objectSelected, spriteValue: 'equipped'})
        this._removeEventListenerInventory = window.local.on('onSelectTextureId', (textureId, objectId, spriteValue) => {
          if(objectSelected.id !== objectId || spriteValue != 'equipped') return
          if(!objectSelected.sprites) objectSelected.sprites = {}
          objectSelected.sprites.equipped = textureId
          networkEditObject(objectSelected, { sprites: objectSelected.sprites })
          this._removeEventListenerInventory()
        })
      }

      if(key === 'select-sprite-UI') {
        BELOWMANAGER.open({ selectedManager: 'MediaManager', selectedMenu: 'SpriteSelector', objectSelected, spriteValue: 'UI'})
        this._removeEventListenerUI = window.local.on('onSelectTextureId', (textureId, objectId, spriteValue) => {
          if(objectSelected.id !== objectId || spriteValue != 'UI') return
          if(!objectSelected.sprites) objectSelected.sprites = {}
          objectSelected.sprites.UI = textureId
          networkEditObject(objectSelected, { sprites: objectSelected.sprites })
          this._removeEventListenerUI()
        })
      }

      const data = JSON.parse(key)

      if(data.action === 'chooseSprite') {
        SpriteChooser.open(objectSelected, data.spriteName)
      }
    }
  }

  render() {
    const { objectSelected } = this.props

    return <Menu onClick={this._handleSpriteMenuClick}>
      <MenuItem key='open-media-manager-sprite-selector'>Select Map Sprite</MenuItem>
      <MenuItem key='select-sprite-equipped'>Select Equipped Sprite</MenuItem>
      <MenuItem key='select-sprite-UI'>Select UI Sprite</MenuItem>
      {objectSelected.sprite && <MenuItem key='apply-sprite-to-all-of-color'>Apply to sprite to all with same color</MenuItem>}
      {objectSelected.tags.inputDirectionSprites && <MenuItem key={JSON.stringify({action: 'chooseSprite', spriteName: 'leftSprite'})}>Select Left Sprite</MenuItem>}
      {objectSelected.tags.inputDirectionSprites &&<MenuItem key={JSON.stringify({action: 'chooseSprite', spriteName: 'rightSprite'})}>Select Right Sprite</MenuItem>}
      {objectSelected.tags.inputDirectionSprites &&<MenuItem key={JSON.stringify({action: 'chooseSprite', spriteName: 'upSprite'})}>Select Up Sprite</MenuItem>}
      {objectSelected.tags.inputDirectionSprites &&<MenuItem key={JSON.stringify({action: 'chooseSprite', spriteName: 'downSprite'})}>Select Down Sprite</MenuItem>}
    </Menu>
  }
}
