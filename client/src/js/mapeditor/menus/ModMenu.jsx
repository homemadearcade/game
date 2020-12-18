import React from 'react'
import Menu, { SubMenu, MenuItem } from 'rc-menu'
import modals from '../modals.js'

export default class ModMenu extends React.Component{
  constructor(props) {
    super(props)

    this._handleModMenuClick = ({ key }) => {
      const { objectSelected } = this.props
      const { networkEditObject } = MAPEDITOR

      if(key === 'add-mod') {
        modals.addMod(objectSelected)
        return
      }

      const data = JSON.parse(key)

      if(data.action === 'end') {
        global.socket.emit('endMod', data.manualRevertId)
        global.socket.emit('resetPhysicsProperties', objectSelected.id)
      }
      if(data.action === 'disable') {
        global.socket.emit('disableMod', data.manualRevertId)
      }

    }
  }

  _renderModMenu() {
    const { objectSelected } = this.props

    const items = []
    const objectMods = GAME.gameState.activeMods[objectSelected.id]
    if(!objectMods) return items

    objectMods.forEach((mod) => {
      if(mod._disabled) {
        if(mod.manualRevertId) {
          items.push(
            <MenuItem key={JSON.stringify({action: 'end', manualRevertId: mod.manualRevertId})}>{`End ${mod.manualRevertId}`}</MenuItem>
          )
        } else if(mod.modId) {
          items.push(
            <MenuItem key={JSON.stringify({action: 'end', manualRevertId: mod.modId})}>{`End ${mod.modId}`}</MenuItem>
          )
        }
      }
      if(!mod._disabled) {
        if(mod.manualRevertId) {
          items.push(
            <MenuItem key={JSON.stringify({action: 'disable', manualRevertId: mod.manualRevertId})}>{`Disable ${mod.manualRevertId}`}</MenuItem>
          )
        } else if(mod.modId) {
          items.push(
            <MenuItem key={JSON.stringify({action: 'diabled', manualRevertId: mod.modId})}>{`Disable ${mod.modId}`}</MenuItem>
          )
        }
      }

      // else if(mod.modId)
    })

    return items
  }

  render() {

    // <MenuItem key={'add-mod'}>Add Mod</MenuItem>

    return <Menu onClick={this._handleModMenuClick}>
      {this._renderModMenu()}
    </Menu>
  }
}
