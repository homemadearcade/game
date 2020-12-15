import React from 'react'
import Menu, { SubMenu, MenuItem } from 'rc-menu';
import modals from '../modals.js'

export default class SpriteDataContextMenu extends React.Component{
  constructor(props) {
    super(props)

    this._handleSpriteMenuClick = async ({ key }) => {
      const { textureIds, spriteData } = this.props

      if(key === 'view-full-sprite') {
        modals.viewFullSprite(spriteData)
      }

      if(key === 'open-search-add') {
        modals.openEditDescriptorsModal({}, ({value}) => {
          if(value) {
            window.local.emit('onEditSpriteData', textureIds ? textureIds : {[spriteData.textureId]: true}, { descriptors: value })
          }
        }, textureIds ? textureIds : [spriteData.textureId])
      }

      if(key === 'open-search-remove') {
        modals.openEditDescriptorsModal({}, ({value}) => {
          if(value) {
            window.local.emit('onEditSpriteData', textureIds ? textureIds : {[spriteData.textureId]: true}, { descriptors: Object.keys(value).reduce((prev, desc) => {
              prev[desc] = false
              return prev
            }, {}) })
          }
        }, textureIds ? textureIds : [spriteData.textureId])
      }

      if(key === 'add-custom') {
        const { value: name } = await Swal.fire({
          title: 'Add Descriptoor',
          input: 'text',
          inputAttributes: {
            autocapitalize: 'off'
          },
          showCancelButton: true,
          confirmButtonText: 'Next',
        })
        window.local.emit('onEditSpriteData', textureIds ? textureIds : {[spriteData.textureId]: true}, { descriptors: { [name]: true }})
      }

      if(key === 'copy-id-to-clipboard') {
        PAGE.copyToClipBoard(spriteData.textureId || textureIds)
        return
      }

      if(key === 'clear-selection') {
        window.local.emit('onClearTextureIdsSelection')
        return
      }

      if(!key) return

      if(key[0] != '{') return
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
        if(!sprite.descriptors[descriptor]) return
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
      {Object.keys(window.waterElementDescriptors).map((descriptor) => {
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

    render.push(<SubMenu title="Dungeon Items">
      {Object.keys(window.dungeonItemDescriptors).map((descriptor) => {
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

    render.push(<SubMenu title="Tools/Equipment">
      {Object.keys(window.itemDescriptors).map((descriptor) => {
        if(window.allDescriptors[descriptor].dontShowAdminsInSpriteSheetEditor) return
        return this._renderDescriptorMenuItems(descriptor, remove)
      })}
    </SubMenu>)

    render.push(<SubMenu title="Weapons">
      {Object.keys(window.weaponDescriptors).map((descriptor) => {
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

    render.push(<SubMenu title="Modifiers ( Other )">
      {Object.keys(window.modifierDescriptors).map((descriptor) => {
        if(window.allDescriptors[descriptor].dontShowAdminsInSpriteSheetEditor) return
        return this._renderDescriptorMenuItems(descriptor, remove)
      })}
    </SubMenu>)

    render.push(<SubMenu title="Modifiers ( Color )">
      {Object.keys(window.colorModifiers).map((descriptor) => {
        if(window.allDescriptors[descriptor].dontShowAdminsInSpriteSheetEditor) return
        return this._renderDescriptorMenuItems(descriptor, remove)
      })}
    </SubMenu>)

    render.push(<SubMenu title="Modifiers ( Edge )">
      {Object.keys(window.edgeModifiers).map((descriptor) => {
        if(window.allDescriptors[descriptor].dontShowAdminsInSpriteSheetEditor) return
        return this._renderDescriptorMenuItems(descriptor, remove)
      })}
    </SubMenu>)

    render.push(<SubMenu title="Modifiers ( Path )">
      {Object.keys(window.pathModifiers).map((descriptor) => {
        if(window.allDescriptors[descriptor].dontShowAdminsInSpriteSheetEditor) return
        return this._renderDescriptorMenuItems(descriptor, remove)
      })}
    </SubMenu>)

    render.push(<SubMenu title="Modifiers ( Elemental )">
      {Object.keys(window.elementalModifiers).map((descriptor) => {
        if(window.allDescriptors[descriptor].dontShowAdminsInSpriteSheetEditor) return
        return this._renderDescriptorMenuItems(descriptor, remove)
      })}
    </SubMenu>)

    render.push(<SubMenu title="Modifiers ( Creature )">
      {Object.keys(window.livingCreatureModifiers).map((descriptor) => {
        if(window.allDescriptors[descriptor].dontShowAdminsInSpriteSheetEditor) return
        return this._renderDescriptorMenuItems(descriptor, remove)
      })}
    </SubMenu>)


    // render.push(<SubMenu title="Complex Descriptros">
    //   {Object.keys(window.complexDescriptors).map((descriptor) => {
    //     if(window.allDescriptors[descriptor].dontShowAdminsInSpriteSheetEditor) return
    //     return this._renderDescriptorMenuItems(descriptor, remove)
    //   })}
    // </SubMenu>)

    if(false) {
      render.push(<SubMenu title="Modifiers ( Audio )">
        {Object.keys(window.audioModifierDescriptors).map((descriptor) => {
          if(window.allDescriptors[descriptor].dontShowAdminsInSpriteSheetEditor) return
          return this._renderDescriptorMenuItems(descriptor, remove)
        })}
      </SubMenu>)
    }
    //
    // render.push(<SubMenu title="Edge (colorModifierser)">
    //   {Object.keys(window.edgeModifiers).map((descriptor) => {
    //     if(window.allDescriptors[descriptor].dontShowAdminsInSpriteSheetEditor) return
    //     return this._renderDescriptorMenuItems(descriptor, remove)
    //   })}
    // </SubMenu>)

    return render
  }

  render() {
    const { textureIds, spriteData } = this.props

    if(spriteData) {
      return <Menu onClick={this._handleSpriteMenuClick}>
        <MenuItem key="copy-id-to-clipboard" className="bold-menu-item">{spriteData.textureId}</MenuItem>
        <MenuItem key="open-search-add">Open Descriptor Search ( Add )</MenuItem>
        <MenuItem key="view-full-sprite">View Full Sprite</MenuItem>
        {textureIds && Object.keys(textureIds).length && <MenuItem key="clear-selection">Clear Texture Selection</MenuItem>}
        <SubMenu title="Descriptors - Add">
          <MenuItem key="open-search-add">Open Search</MenuItem>
          <MenuItem key="add-custom">Add Custom Descriptor</MenuItem>
          {this._renderAllDescriptorMenus(false)}
        </SubMenu>
        <SubMenu title="Descriptors - Remove">
          {this._renderCurrentDescriptors(spriteData)}
        </SubMenu>
        <MenuItem>Close Menu</MenuItem>
      </Menu>
    } else if(textureIds){
      return <Menu onClick={this._handleSpriteMenuClick}>
        <MenuItem className="bold-menu-item">{Object.keys(textureIds).length + ' Sprites Selected'}</MenuItem>
        <MenuItem key="open-search-add">Open Descriptor Search ( Add )</MenuItem>
        <MenuItem key="clear-selection">Clear Texture Selection</MenuItem>
        <SubMenu title="Descriptors - Add">
          <MenuItem key="open-search-add">Open Search</MenuItem>
          <MenuItem key="add-custom">Add Custom Descriptor</MenuItem>
          {this._renderAllDescriptorMenus(false)}
        </SubMenu>
        <SubMenu title="Descriptors - Remove">
          <MenuItem key="open-search-remove">Open Search</MenuItem>
          {this._renderAllDescriptorMenus(true)}
        </SubMenu>
        <MenuItem>Close Menu</MenuItem>
      </Menu>
    }
  }
}
