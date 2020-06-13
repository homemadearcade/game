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

      const data = JSON.parse(key)

      if(data.action === 'chooseSprite') {
        SpriteChooser.open(objectSelected, data.spriteName)
      }
    }
  }

  render() {
    const { objectSelected } = this.props

    return <Menu onClick={this._handleSpriteMenuClick}>
      {!objectSelected.tags.inputDirectionSprites && <MenuItem key={JSON.stringify({action: 'chooseSprite', spriteName: 'defaultSprite'})}>Select Default Sprite</MenuItem>}
      {objectSelected.tags.inputDirectionSprites && <MenuItem key={JSON.stringify({action: 'chooseSprite', spriteName: 'leftSprite'})}>Select Left Sprite</MenuItem>}
      {objectSelected.tags.inputDirectionSprites &&<MenuItem key={JSON.stringify({action: 'chooseSprite', spriteName: 'rightSprite'})}>Select Right Sprite</MenuItem>}
      {objectSelected.tags.inputDirectionSprites &&<MenuItem key={JSON.stringify({action: 'chooseSprite', spriteName: 'upSprite'})}>Select Up Sprite</MenuItem>}
      {objectSelected.tags.inputDirectionSprites &&<MenuItem key={JSON.stringify({action: 'chooseSprite', spriteName: 'downSprite'})}>Select Down Sprite</MenuItem>}
    </Menu>
  }
}