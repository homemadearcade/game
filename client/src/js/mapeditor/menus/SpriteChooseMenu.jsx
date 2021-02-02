import React from 'react'
import Menu, { SubMenu, MenuItem } from 'rc-menu'
import modals from '../modals.js'
import spriteChooser from '../SpriteChooser.js';

export default class SpriteChooseMenu extends React.Component{
  constructor(props) {
    super(props)

    this._handleSpriteMenuClick = ({ key }) => {
      const { objectSelected, openColorPicker } = this.props
      const { networkEditObject } = MAPEDITOR

      if(key === 'select-color') {
        openColorPicker(objectSelected)
      }

      if(key === 'randomize-from-descriptors') {
        global.findSpritesForDescribedObjects([objectSelected])
      }

      if(key === 'open-edit-sprite') {
        SPRITEEDITOR.open(objectSelected)
        networkEditObject(objectSelected, {color: null})
      }

      if(key === 'open-media-manager-sprite-selector') {
        BELOWMANAGER.open({ selectedManager: 'MediaManager', selectedMenu: 'SpriteSelector', objectSelected, spriteValue: 'default'})
        return
      }

      if(key === 'apply-sprite-to-all-of-color') {
        global.socket.emit('editObjects', GAME.objects.filter((object) => {
          if(object.color === objectSelected.color) return true
        }).map((object) => {
          return {
            id: object.id,
            defaultSprite: objectSelected.sprite,
          }
        }))
        return
      }

      if(key === 'choose-from-recommended-sprites') {
        spriteChooser.openType(objectSelected, 'defaultSprite', 'recommended')
      }

      if(key === 'choose-from-my-sprites') {
        spriteChooser.openType(objectSelected, 'defaultSprite', 'mysprites')
      }

      if(key === 'randomize-from-descriptors') {
        global.findSpritesForDescribedObjects([objectSelected])
      }
    }
  }

  render() {
    const { objectSelected } = this.props
    const isInvisible = objectSelected.tags.invisible || objectSelected.defaultSprite == 'invisible' || objectSelected.opacity == 0

    let sprite
    if(objectSelected.constructParts && objectSelected.descriptors) {
      sprite = <MenuItem key="randomize-from-descriptors">Randomize Sprites</MenuItem>
    } else {
      return <Menu onClick={this._handleSpriteMenuClick}>
        {!isInvisible && !objectSelected.contructParts && <MenuItem key="select-color" className='dont-close-menu'>Color</MenuItem>}
        {objectSelected.descriptors && <MenuItem key="choose-from-recommended-sprites">Select From Recommended</MenuItem>}
        <MenuItem key="choose-from-my-sprites">Select From My Sprites</MenuItem>
        <MenuItem key="open-media-manager-sprite-selector">Select From All</MenuItem>
        {objectSelected.width <= 64 && objectSelected.height <= 320 && !objectSelected.constructParts && <MenuItem key="open-edit-sprite">Edit Sprite</MenuItem>}
        {objectSelected.descriptors && <MenuItem key="randomize-from-descriptors">Randomize</MenuItem>}
      </Menu>
    }

    return <Menu onClick={this._handleSpriteMenuClick}>
      {sprite}
    </Menu>
  }
}
