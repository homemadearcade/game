import React from 'react'
import Menu, { SubMenu, MenuItem } from 'rc-menu';
import TagMenu from '../menus/tagMenu.jsx';
import modals from '../modals.js'

export default class SpriteDataContextMenu extends React.Component{
  constructor(props) {
    super(props)

    this._handleSpriteMenuClick = async ({ key }) => {
      const { textureIds, textureId } = this.props

      if(key === 'copy-id-to-clipboard') {
        PAGE.copyToClipBoard(textureId || textureIds)
      }

      if(key === 'clear-selection') {
        window.local.emit('clearTextureIdsSelection')
      }
    }
  }

  render() {
    const { textureIds, textureId } = this.props

    if(textureId) {
      return <Menu onClick={this._handleSpriteMenuClick}>
        <MenuItem key="copy-id-to-clipboard" className="bold-menu-item">{textureId}</MenuItem>
        <MenuItem key="clear-selection" className="bold-menu-item">Clear Selection</MenuItem>
      </Menu>
    } else if(textureIds){
      return <Menu onClick={this._handleSpriteMenuClick}>
        <MenuItem className="bold-menu-item">{Object.keys(textureIds).length + ' Sprites Selected'}</MenuItem>
        <MenuItem key="clear-selection" className="bold-menu-item">Clear Selection</MenuItem>
      </Menu>
    }

  }
}
