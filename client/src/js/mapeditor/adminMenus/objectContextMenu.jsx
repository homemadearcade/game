import React from 'react'
import Menu, { SubMenu, MenuItem } from 'rc-menu';
import TagMenu from '../menus/tagMenu.jsx';
import CurrentTagsMenu from '../menus/CurrentTagsMenu.jsx';
import ColorMenu from '../menus/ColorMenu.jsx';
import GameTagMenu from '../menus/GameTagMenu.jsx';
import DialogueMenu from '../menus/DialogueMenu.jsx';
import DialogueSetsMenu from '../menus/DialogueSetsMenu.jsx';
import QuestMenu from '../menus/QuestMenu.jsx';
import SpawnZoneMenu from '../menus/SpawnZoneMenu.jsx';
import ResourceZoneMenu from '../menus/ResourceZoneMenu.jsx';
import NameMenu from '../menus/NameMenu.jsx';
import EmitterMenu from '../menus/EmitterMenu.jsx';
import ObjectAdvancedMenu from '../menus/ObjectAdvancedMenu.jsx';
import SelectSubObjectMenu from '../menus/SelectSubObjectMenu.jsx';
import RelativeMenu from '../menus/RelativeMenu.jsx';
import ServicesMenu from '../menus/ServicesMenu.jsx';
import TriggerMenu from '../menus/TriggerMenu.jsx';
import HookMenu from '../menus/HookMenu.jsx';
import LiveMenu from '../menus/LiveMenu.jsx';
import SpriteMenu from '../menus/SpriteMenu.jsx';
import modals from '../modals.js'

export default class ObjectContextMenu extends React.Component{
  constructor(props) {
    super(props)

    this._handleObjectMenuClick = ({ key }) => {
      const { startResize, onStartDrag, deleteObject, onCopy } = MAPEDITOR
      const { selectSubObject, objectSelected, subObject } = this.props;
      const { removeObject } = MAPEDITOR

      if(key === 'copy-id') {
        PAGE.copyToClipBoard(objectSelected.id)
      }

      if(key === 'resize') {
        if(subObject) {
          startResize(objectSelected, { snapToGrid: false })
        } else {
          startResize(objectSelected)
        }
      }

      if(key === 'resize-grid') {
        startResize(objectSelected, { snapToGrid: true })
      }

      if(key === 'drag') {
        onStartDrag(objectSelected)
      }

      if(key === 'drag-off-grid') {
        MAPEDITOR.onStartDrag(objectSelected, { snapToGrid: false })
      }

      if(key === 'delete') {
        deleteObject(objectSelected)
      }

      if(key === 'remove') {
        removeObject(objectSelected)
      }

      if(key === 'copy') {
        onCopy(objectSelected)
      }

      if(key === 'drop') {
        window.socket.emit('dropObject', objectSelected.ownerId, objectSelected.subObjectName)
      }
      if(key === 'unequip') {
        window.socket.emit('unequipObject', objectSelected.ownerId, objectSelected.subObjectName)
      }
      if(key === 'equip') {
        window.socket.emit('equipObject', objectSelected.ownerId, objectSelected.subObjectName, 'available')
      }
    }
  }

  _renderObjectQuestMenu() {
    const { objectSelected, subObject } = this.props
    const { questGiver, questCompleter } = objectSelected.tags

    if(questGiver || questCompleter) {
      return <SubMenu title="Quest">
      <QuestMenu objectSelected={objectSelected} subObject={subObject}/>
      </SubMenu>
    }
  }

  _renderObjectSpawnZoneMenu() {
    const { objectSelected, subObject } = this.props
    const { spawnZone } = objectSelected.tags

    if(spawnZone) {
      return <SubMenu title="Spawn Zone">
      <SpawnZoneMenu objectSelected={objectSelected} subObject={subObject}/>
      </SubMenu>
    }
  }

  _renderObjectResourceZoneMenu() {
    const { objectSelected, subObject } = this.props
    const { resourceZone } = objectSelected.tags

    if(resourceZone) {
      return <SubMenu title="Resource Zone">
        <ResourceZoneMenu objectSelected={objectSelected} subObject={subObject}/>
      </SubMenu>
    }
  }

  _renderObjectEmitterMenu() {
    const { objectSelected, subObject } = this.props
    if(objectSelected.tags.emitter) {
      return <SubMenu title="Emitter">
        <EmitterMenu objectSelected={objectSelected} subObject={subObject}></EmitterMenu>}
      </SubMenu>
    }

  }

  render() {
    const { objectSelected } = this.props

    let subObject = objectSelected.tags.subObject
    // <SubMenu title="Hooks">
    //   <HookMenu objectSelected={objectSelected}/>
    // </SubMenu>

    //      {this._renderObjectQuestMenu()}

    return <Menu onClick={this._handleObjectMenuClick}>
      <MenuItem key='copy-id' className="bold-menu-item">{objectSelected.subObjectName || objectSelected.name || objectSelected.id}</MenuItem>
      {!subObject && <MenuItem key="drag">Drag</MenuItem>}
      {!subObject && <MenuItem key="drag-off-grid">Drag Off Grid</MenuItem>}
      {!objectSelected.constructParts && !objectSelected.pathParts && <MenuItem key="resize">Resize</MenuItem>}
      {subObject && <MenuItem key="resize-grid">Resize On Grid</MenuItem>}
      {!subObject && <MenuItem key="copy">Copy</MenuItem>}
      <SubMenu title='Sprite'><SpriteMenu objectSelected={objectSelected} subObject={subObject}/></SubMenu>
      {(objectSelected.ownerId || objectSelected.relativeId) && <SubMenu title="Relative">
        <RelativeMenu objectSelected={objectSelected} subObject={subObject}/>
      </SubMenu>}
      <SubMenu title="Color">
        <ColorMenu objectSelected={objectSelected} openColorPicker={this.props.openColorPicker} subObject={subObject}></ColorMenu>
      </SubMenu>
      <SubMenu title="Name">
        <NameMenu objectSelected={objectSelected} subObject={subObject}/>
      </SubMenu>
      <SubMenu title="Dialogue">
        <DialogueMenu objectSelected={objectSelected} subObject={subObject}/>
      </SubMenu>
      <SubMenu title="Dialogue Sets">
        <DialogueSetsMenu objectSelected={objectSelected} subObject={subObject}/>
      </SubMenu>
      {this._renderObjectSpawnZoneMenu()}
      {this._renderObjectResourceZoneMenu()}
      {this._renderObjectEmitterMenu()}
      <SubMenu title="Group">
        <GameTagMenu objectSelected={objectSelected} subObject={subObject}/>
      </SubMenu>
      <SubMenu title="Triggers">
        <TriggerMenu objectSelected={objectSelected}/>
      </SubMenu>
      <SubMenu title="Current Tags">
        <CurrentTagsMenu objectSelected={objectSelected} currentTags={objectSelected.tags}></CurrentTagsMenu>
      </SubMenu>
      <SubMenu title="All Tags">
        <TagMenu objectSelected={objectSelected} subObject={subObject}></TagMenu>
      </SubMenu>
      {!subObject && Object.keys(objectSelected.subObjects || {}).length && <SubMenu title="Sub Objects">
        <SelectSubObjectMenu objectSelected={objectSelected} selectSubObject={this.props.selectSubObject}/>
      </SubMenu>}
      { subObject && !objectSelected.isEquipped && <MenuItem key="equip">Equip</MenuItem> }
      { subObject && objectSelected.isEquipped && <MenuItem key="unequip">Unequip</MenuItem> }
      { subObject && objectSelected.tags.pickupable && <MenuItem key="drop">Drop</MenuItem> }
      { (GAME.gameState.started || GAME.gameState.branch) ? <MenuItem key="remove">Remove</MenuItem> : <MenuItem key="delete">Delete</MenuItem> }
      <SubMenu title="Services">
        <ServicesMenu objectSelected={objectSelected} subObject={subObject}/>
      </SubMenu>
      <SubMenu title="Data">
        <ObjectAdvancedMenu objectSelected={objectSelected} subObject={subObject}/>
      </SubMenu>
    </Menu>
  }
}
