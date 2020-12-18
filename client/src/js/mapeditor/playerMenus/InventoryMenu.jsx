import React from 'react'
import Menu, { SubMenu, MenuItem } from 'rc-menu';
import modals from '../modals.js'

export default class InventoryMenu extends React.Component{
  constructor(props) {
    super(props)

    this._handleInventoryMenuClick = ({ key }) => {
      const { item } = this.props;

      if(key === 'drop') {
        global.socket.emit('dropObject', item.ownerId, item.subObjectName, 1)
      }
      if(key === 'drop-1') {
        global.socket.emit('dropObject', item.ownerId, item.subObjectName, 1)
      }
      if(key === 'drop-5') {
        global.socket.emit('dropObject', item.ownerId, item.subObjectName, 5)
      }
      if(key === 'drop-10') {
        global.socket.emit('dropObject', item.ownerId, item.subObjectName, 10)
      }
      if(key === 'drop-20') {
        global.socket.emit('dropObject', item.ownerId, item.subObjectName, 20)
      }
      if(key === 'drop-all') {
        global.socket.emit('dropObject', item.ownerId, item.subObjectName, item.count)
      }

      if(key === 'unequip') {
        global.socket.emit('unequipObject', item.ownerId, item.subObjectName)
      }

      if(key === 'equip-z') {
        global.socket.emit('equipObject', item.ownerId, item.subObjectName, 'z')
      }
      if(key === 'equip-x') {
        global.socket.emit('equipObject', item.ownerId, item.subObjectName, 'x')
      }
      if(key === 'equip-c') {
        global.socket.emit('equipObject', item.ownerId, item.subObjectName, 'c')
      }
      if(key === 'equip-space') {
        global.socket.emit('equipObject', item.ownerId, item.subObjectName, 'space')
      }
      if(key === 'equip-any') {
        global.socket.emit('equipObject', item.ownerId, item.subObjectName)
      }
    }
  }

  render() {
    const { item } = this.props
    const owner = OBJECTS.getObjectOrHeroById(item.ownerId)

    return <Menu onClick={this._handleInventoryMenuClick}>
      <MenuItem className="bold-menu-item">{item.name || item.subObjectName}</MenuItem>
      {item.isEquipped && <MenuItem key="unequip">Unequip</MenuItem>}
      {!item.isEquipped && item.actionButtonBehavior && <SubMenu title="Equip">
        {(owner.zButtonBehavior === null || owner.xButtonBehavior == null || owner.cButtonBehavior == null) && <MenuItem key="equip">Equip</MenuItem>}
        {!owner.zButtonBehavior && <MenuItem key="equip-z">Equip to Z</MenuItem>}
        {!owner.xButtonBehavior && <MenuItem key="equip-x">Equip to X</MenuItem>}
        {!owner.cButtonBehavior && <MenuItem key="equip-c">Equip to C</MenuItem>}
        {!owner.spaceBarBehavior && <MenuItem key="equip-space">Equip to Space</MenuItem>}
      </SubMenu>}
      {!item.tags.stackable && <MenuItem key="drop">Drop</MenuItem>}
      {item.tags.stackable && <MenuItem key="drop">Drop 1</MenuItem>}
      {item.tags.stackable && item.count >= 5 && <MenuItem key="drop-5">Drop 5</MenuItem>}
      {item.tags.stackable && item.count >= 10 && <MenuItem key="drop-10">Drop 10</MenuItem>}
      {item.tags.stackable && item.count >= 20 && <MenuItem key="drop-20">Drop 20</MenuItem>}
      {item.tags.stackable && item.count > 1 && <MenuItem key="drop-all">Drop All</MenuItem>}
        </Menu>
  }
}
