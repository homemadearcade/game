import React from 'react'
import Menu, { SubMenu, MenuItem } from 'rc-menu';
import SelectSubObjectMenu from '../menus/SelectSubObjectMenu.jsx';
import TriggerMenu from '../menus/TriggerMenu.jsx';
import EmitterMenu from '../menus/EmitterMenu.jsx';
import SequencesMenu from '../menus/SequencesMenu.jsx';
import SpriteMenu from '../menus/SpriteMenu.jsx';
import HookMenu from '../menus/HookMenu.jsx';
import ModMenu from '../menus/ModMenu.jsx';
import LiveMenu from '../menus/LiveMenu.jsx';
import TagMenu from '../menus/tagMenu.jsx';
import NameMenu from '../menus/NameMenu.jsx';
import CurrentTagsMenu from '../menus/CurrentTagsMenu.jsx';
import modals from '../modals.js'

const editQuestPrefix = 'edit-quest-'
const deleteQuestPrefix = 'delete-quest-'

export default class HeroContextMenu extends React.Component {
  constructor(props) {
    super(props)

    this._handleHeroMenuClick = ({ key }) => {
      const { objectSelected, openColorPicker } = this.props;
      const { startResize, onStartDrag, deleteObject, removeObject } = MAPEDITOR

      if(key === 'copy-id') {
        PAGE.copyToClipBoard(objectSelected.id)
      }

      if(key === 'resize') {
        startResize(objectSelected)
      }

      if(key === 'resize-off-grid') {
        startResize(objectSelected, { snapToGrid: false })
      }

      if(key === 'drag') {
        onStartDrag(objectSelected)
      }

      if(key === 'delete') {
        deleteObject(objectSelected)
      }

      if(key === 'remove') {
        removeObject(objectSelected)
      }

      if(key === 'select-color') {
        openColorPicker(objectSelected)
      }

      if(key === 'respawn') {
        global.socket.emit('respawnHero', objectSelected)
      }

      if(key === 'toggle-outline') {
        networkEditObject(objectSelected, { tags: { outline: !objectSelected.tags.outline }})
      }

      if(key === 'copy-id') {
        PAGE.copyToClipBoard(objectSelected.id)
      }

      if(key === 'add-quest') {
        modals.editQuest(objectSelected)
      }

      if(key.indexOf(editQuestPrefix) === 0) {
        let questId = key.substr(editQuestPrefix.length)
        modals.editQuest(objectSelected, objectSelected.quests[questId])
      }

      if(key.indexOf(deleteQuestPrefix) === 0) {
        let questId = key.substr(deleteQuestPrefix.length)
        global.socket.emit('deleteQuest', objectSelected.id, questId)
      }

      if(key[0] === '{') {
        this._handleInputBehaviorMenuClick(key)
      }

      if(key === 'edit-properties-json') {
        modals.editObjectCode(objectSelected, 'Editing Hero Properties', HERO.getProperties(objectSelected));
      }

      if(key === 'edit-state-json') {
        modals.editObjectCode(objectSelected, 'Editing Hero State', HERO.getState(objectSelected));
      }

      if(key === 'edit-all-json') {
        modals.editObjectCode(objectSelected, 'Editing Hero', objectSelected);
      }

      if(key === 'add-new-subobject') {
        modals.addNewSubObjectTemplate(objectSelected)
      }

      if(key === 'set-world-respawn-point') {
        global.socket.emit('updateWorld', {worldSpawnPointX: objectSelected.x, worldSpawnPointY:  objectSelected.y})
      }

      if(key === 'reset-to-game-default') {
        global.socket.emit('resetHeroToGameDefault', objectSelected)
      }

      if(key === 'reset-to-core-default') {
        global.socket.emit('resetHeroToDefault', objectSelected)
      }

      if (key === "open-hero-live-edit") {
        LIVEEDITOR.open(objectSelected, 'hero')
      }

      if(key === 'edit-descriptors') {
        Object.keys(objectSelected.descriptors || {}).forEach((tag) => {
          if(!objectSelected.descriptors[tag]) delete objectSelected.descriptors[tag]
        })
        modals.openEditDescriptorsModal(objectSelected.descriptors || {}, ({value}) => {
          if(value) {
            MAPEDITOR.networkEditObject(objectSelected, {descriptors: value})
          }
        })
      }

      if(key === 'start-mod-creation-flow') {
        global.local.emit('startDiffFlow', objectSelected.id)
      }

      if(key === 'end-mod-creation-flow') {
        global.local.emit('endDiffFlow', objectSelected.id)
      }
    }

    this._handleTagMenuClick = ({ key }) => {
      const { objectSelected } = this.props;
      const { networkEditObject } = MAPEDITOR

      networkEditObject(objectSelected, { tags: { [key]: !objectSelected.tags[key] }})
    }

    this._handleInputBehaviorMenuClick = (key) => {
      const { objectSelected } = this.props;
      const { networkEditObject } = MAPEDITOR

      const data = JSON.parse(key)
      if(data.none) {
        networkEditObject(objectSelected, { [data.behaviorProp]: null })
      } else if(data.new) {
        modals.addCustomInputBehavior(data.behaviorProp)
      } else if(data.behaviorName && data.behaviorProp) {
        networkEditObject(objectSelected, { [data.behaviorProp]: data.behaviorName })
      }
    }
  }

  _renderEditQuestList(quests = {}) {
    const questList = Object.keys(quests)
    return questList.map((questId) => {
      return <MenuItem key={editQuestPrefix+questId}>{'Edit ' + questId}</MenuItem>
    })
  }

  _renderDeleteQuestList(quests = {}) {
    const questList = Object.keys(quests)
    return questList.map((questId) => {
      return <MenuItem key={deleteQuestPrefix+questId}>{'Delete ' + questId}</MenuItem>
    })
  }

  _renderTagMenuItems(tags) {
    const { objectSelected } = this.props

    const tagList = Object.keys(tags)
    return tagList.map((tag) => {
      if(objectSelected.tags && objectSelected.tags[tag]) {
        return <MenuItem key={tag}>{tag}<i style={{marginLeft:'6px'}} className="fas fa-check"></i></MenuItem>
      } else {
        return <MenuItem key={tag}>{tag}</MenuItem>
      }
    })
  }

  _renderInputBehaviorMenu(behaviorProp, behaviorList) {
    const { objectSelected } = this.props

    const newBehavior = <MenuItem key={JSON.stringify({behaviorProp, new: true})}>Add new behavior</MenuItem>
    const none = <MenuItem key={JSON.stringify({behaviorProp, none: true})}>None</MenuItem>

    return [...behaviorList.map((behaviorName) => {
      const key = {
        behaviorProp,
        behaviorName
      }

      if(objectSelected[behaviorProp] && objectSelected[behaviorProp] === behaviorName) {
        return <MenuItem key={JSON.stringify(key)}>{behaviorName}<i style={{marginLeft:'6px'}} className="fas fa-check"></i></MenuItem>
      } else {
        return <MenuItem key={JSON.stringify(key)}>{behaviorName}</MenuItem>
      }
    }), none, newBehavior]
  }

  render() {
    const { objectSelected } = this.props

    // <MenuItem key="edit-properties-json">Edit Properties JSON</MenuItem>
    // <MenuItem key="edit-state-json">Edit State JSON</MenuItem>
    // <SubMenu title="Hooks">
    //   <HookMenu objectSelected={objectSelected}/>
    // </SubMenu>
    // <MenuItem key='set-world-respawn-point'>Set current position as world respawn point</MenuItem>

    // <SubMenu title="Open">
    //   <MenuItem key="edit-all-json">Edit All JSON</MenuItem>
    //   <MenuItem key="open-hero-live-edit">Live Hero Edit</MenuItem>
    //   <MenuItem key="edit-descriptors">Edit Descriptors</MenuItem>
    // </SubMenu>

    return <Menu onClick={this._handleHeroMenuClick}>
      <MenuItem key='copy-id' className="bold-menu-item">{objectSelected.name || objectSelected.id}</MenuItem>
      <MenuItem key='resize'>Resize</MenuItem>
      <MenuItem key="resize-off-grid">Resize Off Grid</MenuItem>
      <SubMenu title='Sprite'><SpriteMenu objectSelected={objectSelected}/></SubMenu>
      <SubMenu title="Name">
        <NameMenu objectSelected={objectSelected}/>
      </SubMenu>
      <SubMenu title="Quests">
        <MenuItem key="add-quest">Add Quest</MenuItem>
        {this._renderEditQuestList(objectSelected.quests)}
        {this._renderDeleteQuestList(objectSelected.quests)}
      </SubMenu>
      {GAME.gameState.activeMods[objectSelected.id] && <SubMenu title="Mods">
        <ModMenu objectSelected={objectSelected}/>
      </SubMenu>}
      <SubMenu title="Controls">
        <SubMenu title="Arrow Keys">
          {this._renderInputBehaviorMenu('arrowKeysBehavior', Object.keys(global.arrowKeysBehavior))}
        </SubMenu>
        <SubMenu title="Z Key">
          {this._renderInputBehaviorMenu('zButtonBehavior', Object.keys(global.actionButtonBehavior))}
        </SubMenu>
        <SubMenu title="X Key">
          {this._renderInputBehaviorMenu('xButtonBehavior', Object.keys(global.actionButtonBehavior))}
        </SubMenu>
        <SubMenu title="C Key">
          {this._renderInputBehaviorMenu('cButtonBehavior', Object.keys(global.actionButtonBehavior))}
        </SubMenu>
        <SubMenu title="Space Bar">
          {this._renderInputBehaviorMenu('spaceBarBehavior', Object.keys(global.actionButtonBehavior))}
        </SubMenu>
        <SubMenu title="Modifiers">
          <Menu onClick={this._handleTagMenuClick}>
            {this._renderTagMenuItems(global.keyInputTags)}
          </Menu>
        </SubMenu>
      </SubMenu>
      <SubMenu title="Emitters">
        <EmitterMenu objectSelected={objectSelected}></EmitterMenu>
      </SubMenu>
      <SubMenu title="Triggers">
        <TriggerMenu objectSelected={objectSelected}/>
      </SubMenu>
      <SubMenu title="Sequences">
        <SequencesMenu objectSelected={objectSelected}/>
      </SubMenu>
      <SubMenu title="All Tags">
        <TagMenu objectSelected={objectSelected}></TagMenu>
      </SubMenu>
      <SubMenu title="Actions">
        <MenuItem key="reset-to-game-default">Reset To Game Default</MenuItem>
        <MenuItem key="reset-to-core-default">Reset To Core Default</MenuItem>
        <MenuItem key='add-new-subobject'>Add new sub object</MenuItem>
        {!GAME.gameState.started && !global.diffFlowId && <MenuItem key='start-mod-creation-flow'>Start Mod Creation Flow</MenuItem>}
        {!GAME.gameState.started && global.diffFlowId == objectSelected.id && <MenuItem key='end-mod-creation-flow'>End Mod Creation Flow</MenuItem>}
      </SubMenu>
    </Menu>
  }
}
