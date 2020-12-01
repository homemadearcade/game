import React from 'react'
import Menu, { SubMenu, MenuItem } from 'rc-menu';
import modals from '../modals.js'

export default class SpriteDataContextMenu extends React.Component{
  constructor(props) {
    super(props)

    this._handleSpriteMenuClick = async ({ key }) => {
      const { textureIds, spriteData } = this.props

      if(key === 'copy-id-to-clipboard') {
        PAGE.copyToClipBoard(spriteData.textureId || textureIds)
        return
      }

      if(key === 'clear-selection') {
        window.local.emit('onClearTextureIdsSelection')
        return
      }

      if(!key) return

      const data = JSON.parse(key)

      if(data.action == 'add') {
        window.local.emit('onEditSpriteData', textureIds ? textureIds : {[spriteData.textureId]: true}, { descriptors: { [data.descriptor]: true }})
      }

      if(data.action == 'remove') {
        window.local.emit('onEditSpriteData', textureIds ? textureIds : {[spriteData.textureId]: true}, { descriptors: { [data.descriptor]: false }})
      }
    }
  }

  _renderDescriptorMenuItems(descriptor, remove) {
      const render = []
      if(!remove) render.push(<MenuItem key={JSON.stringify({descriptor, action: 'add'})}>{descriptor + ' - add'}</MenuItem>)
      if(remove) render.push(<MenuItem key={JSON.stringify({descriptor, action: 'remove'})}>{descriptor + ' - remove'}</MenuItem>)

      return render
  }

  _renderCurrentDescriptors(sprite) {
    if(sprite.descriptors) {
      return Object.keys(sprite.descriptors).map((descriptor) => {
        return this._renderDescriptorMenuItems(descriptor, true)
      })
    } else {
      return null
    }
  }

  _renderAllDescriptorMenus(remove) {
    const render = []

    render.push(<SubMenu title="Elements">
      {Object.keys(window.elementDescriptors).map((descriptor) => {
        if(window.allDescriptors[descriptor].dontShowAdminsInSpriteSheetEditor) return
        return this._renderDescriptorMenuItems(descriptor, remove)
      })}
    </SubMenu>)

    render.push(<SubMenu title="Water">
      {Object.keys(window.elementDescriptors).map((descriptor) => {
        if(window.allDescriptors[descriptor].dontShowAdminsInSpriteSheetEditor) return
        return this._renderDescriptorMenuItems(descriptor, remove)
      })}
    </SubMenu>)

    render.push(<SubMenu title="Overworld">
      {Object.keys(window.overworldMapDescriptors).map((descriptor) => {
        if(window.allDescriptors[descriptor].dontShowAdminsInSpriteSheetEditor) return
        return this._renderDescriptorMenuItems(descriptor, remove)
      })}
    </SubMenu>)

    render.push(<SubMenu title="Building Parts">
      {Object.keys(window.buildingPartDescriptors).map((descriptor) => {
        if(window.allDescriptors[descriptor].dontShowAdminsInSpriteSheetEditor) return
        return this._renderDescriptorMenuItems(descriptor, remove)
      })}
    </SubMenu>)

    render.push(<SubMenu title="Inside Building">
      {Object.keys(window.insideBuildingDescriptors).map((descriptor) => {
        if(window.allDescriptors[descriptor].dontShowAdminsInSpriteSheetEditor) return
        return this._renderDescriptorMenuItems(descriptor, remove)
      })}
    </SubMenu>)

    render.push(<SubMenu title="Outside Building">
      {Object.keys(window.outsideBuildingDescriptors).map((descriptor) => {
        if(window.allDescriptors[descriptor].dontShowAdminsInSpriteSheetEditor) return
        return this._renderDescriptorMenuItems(descriptor, remove)
      })}
    </SubMenu>)

    render.push(<SubMenu title="Tools">
      {Object.keys(window.toolDescriptors).map((descriptor) => {
        if(window.allDescriptors[descriptor].dontShowAdminsInSpriteSheetEditor) return
        return this._renderDescriptorMenuItems(descriptor, remove)
      })}
    </SubMenu>)

    render.push(<SubMenu title="Item">
      {Object.keys(window.itemDescriptors).map((descriptor) => {
        if(window.allDescriptors[descriptor].dontShowAdminsInSpriteSheetEditor) return
        return this._renderDescriptorMenuItems(descriptor, remove)
      })}
    </SubMenu>)

    render.push(<SubMenu title="Other">
      {Object.keys(window.otherDescriptors).map((descriptor) => {
        if(window.allDescriptors[descriptor].dontShowAdminsInSpriteSheetEditor) return
        return this._renderDescriptorMenuItems(descriptor, remove)
      })}
    </SubMenu>)

    render.push(<SubMenu title="Transport">
      {Object.keys(window.transportDescriptors).map((descriptor) => {
        if(window.allDescriptors[descriptor].dontShowAdminsInSpriteSheetEditor) return
        return this._renderDescriptorMenuItems(descriptor, remove)
      })}
    </SubMenu>)

    render.push(<SubMenu title="Human">
      {Object.keys(window.humanDescriptors).map((descriptor) => {
        if(window.allDescriptors[descriptor].dontShowAdminsInSpriteSheetEditor) return
        return this._renderDescriptorMenuItems(descriptor, remove)
      })}
    </SubMenu>)

    render.push(<SubMenu title="Animal">
      {Object.keys(window.animalDescriptors).map((descriptor) => {
        if(window.allDescriptors[descriptor].dontShowAdminsInSpriteSheetEditor) return
        return this._renderDescriptorMenuItems(descriptor, remove)
      })}
    </SubMenu>)

    render.push(<SubMenu title="Monster">
      {Object.keys(window.monsterDescriptors).map((descriptor) => {
        if(window.allDescriptors[descriptor].dontShowAdminsInSpriteSheetEditor) return
        return this._renderDescriptorMenuItems(descriptor, remove)
      })}
    </SubMenu>)

    render.push(<SubMenu title="Modifiers">
      {Object.keys(window.modifierDescriptors).map((descriptor) => {
        if(window.allDescriptors[descriptor].dontShowAdminsInSpriteSheetEditor) return
        return this._renderDescriptorMenuItems(descriptor, remove)
      })}
    </SubMenu>)

    return render
  }

  render() {
    const { textureIds, spriteData } = this.props

    if(spriteData) {
      return <Menu onClick={this._handleSpriteMenuClick}>
        <MenuItem key="copy-id-to-clipboard" className="bold-menu-item">{spriteData.textureId}</MenuItem>
        <MenuItem key="clear-selection">Clear Selection</MenuItem>
        <SubMenu title="Descriptors - Remove">
          {this._renderCurrentDescriptors(spriteData)}
        </SubMenu>
        <MenuItem>Close Menu</MenuItem>
      </Menu>
    } else if(textureIds){
      return <Menu onClick={this._handleSpriteMenuClick}>
        <MenuItem className="bold-menu-item">{Object.keys(textureIds).length + ' Sprites Selected'}</MenuItem>
        <MenuItem key="clear-selection">Clear Selection</MenuItem>
        <SubMenu title="Descriptors - Add">
          {this._renderAllDescriptorMenus(false)}
        </SubMenu>
        <SubMenu title="Descriptors - Remove">
          {this._renderAllDescriptorMenus(true)}
        </SubMenu>
        <MenuItem>Close Menu</MenuItem>
      </Menu>
    }

  }
}
