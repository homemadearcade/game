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


      if(key === 'edit-descriptors') {
        Object.keys(objectSelected.descriptors || {}).forEach((tag) => {
          if(!objectSelected.descriptors[tag]) delete objectSelected.descriptors[tag]
        })
        modals.openEditDescriptorsModal(objectSelected.descriptors || {}, ({value}) => {
          if(!objectSelected.name) {
            let name  = Object.keys(value)[0]
            MAPEDITOR.networkEditObject(objectSelected, {descriptors: value, name})
          } else {
            MAPEDITOR.networkEditObject(objectSelected, {descriptors: value})
          }
        }, {}, { onlyWithTextures: true })
      }
    }
  }

  render() {
    const { objectSelected } = this.props
    const isInvisible = objectSelected.tags.invisible || objectSelected.defaultSprite == 'invisible' || objectSelected.opacity == 0

    // if(objectSelected.constructParts && objectSelected.descriptors) {
    //   sprite = <SubMenu title="Sprite">
    //       {objectSelected.descriptors && <MenuItem key="randomize-from-descriptors">Randomize Sprites</MenuItem>}
    //       {!isInvisible && <MenuItem key="select-color" className='dont-close-menu'>Color</MenuItem>}
    //     </SubMenu>
    // } else {
    let  sprite = <Menu onClick={this._handleSpriteMenuClick}>
        <MenuItem key="edit-descriptors">Describe</MenuItem>
        {!isInvisible && <MenuItem key="select-color" className='dont-close-menu'>{(objectSelected.defaultSprite === "solidcolorsprite" || objectSelected.defaultSprite == undefined) ? "Color" : "Tint"}</MenuItem>}
        {objectSelected.descriptors && <MenuItem key="choose-from-recommended-sprites">Select From Recommended</MenuItem>}
        <MenuItem key="choose-from-my-sprites">Select From My Sprites</MenuItem>
        {PAGE.role.isAdmin && <MenuItem key="open-media-manager-sprite-selector">Select From All</MenuItem>}
        {objectSelected.width <= 64 && objectSelected.height <= 320 || objectSelected.constructParts && <MenuItem key="open-edit-sprite">Edit Sprite</MenuItem>}
        {objectSelected.descriptors && <MenuItem key="randomize-from-descriptors">Randomize</MenuItem>}
      </Menu>
    // }

    return <Menu onClick={this._handleSpriteMenuClick}>
      {sprite}
    </Menu>
  }
}
