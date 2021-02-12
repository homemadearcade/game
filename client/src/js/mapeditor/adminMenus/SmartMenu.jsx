import React from 'react'
import classnames from 'classnames'
import Menu, { SubMenu, MenuItem } from 'rc-menu';
import TagMenu from '../menus/tagMenu.jsx';
import ColorMenu from '../menus/ColorMenu.jsx';
import GameTagMenu from '../menus/GameTagMenu.jsx';
import DialogueMenu from '../menus/DialogueMenu.jsx';
import PopoverMenu from '../menus/PopoverMenu.jsx';
import DialogueSetsMenu from '../menus/DialogueSetsMenu.jsx';
import PlayerCreateObjectMenu from '../menus/PlayerCreateObjectMenu.jsx';
import SequencesMenu from '../menus/SequencesMenu.jsx';
import CurrentTagsMenu from '../menus/CurrentTagsMenu.jsx';
import EmitterMenu from '../menus/EmitterMenu.jsx';
import EmitterRandomizeMenu from '../menus/EmitterRandomizeMenu.jsx';
import RelatedTagsMenu from '../menus/RelatedTagsMenu.jsx';

// import DescriptorsMenu from '../menus/DescriptorMenu.jsx';
import QuestMenu from '../menus/QuestMenu.jsx';
import SpawnZoneMenu from '../menus/SpawnZoneMenu.jsx';
import ResourceZoneMenu from '../menus/ResourceZoneMenu.jsx';
import NameMenu from '../menus/NameMenu.jsx';
import EditorActionMenu from '../menus/EditorActionMenu.jsx';
import SelectSubObjectMenu from '../menus/SelectSubObjectMenu.jsx';
import RelativeMenu from '../menus/RelativeMenu.jsx';
import TriggerMenu from '../menus/TriggerMenu.jsx';
import HookMenu from '../menus/HookMenu.jsx';
import LiveMenu from '../menus/LiveMenu.jsx';
import SpriteMenu from '../menus/SpriteMenu.jsx';
import PropertiesMenu from '../menus/PropertiesMenu.jsx';
import modals from '../modals.js'
import { handleExtraMenuClicks } from '../playerMenus/helper.js'

export default class SmartMenu extends React.Component {
  constructor(props) {
    super(props)

    this._handleMenuClick = ({ key }) => {
      if(!key) return
      const { startResize, onStartDrag, deleteObject, onCopy, removeObject } = MAPEDITOR
      const { objectSelected, openAdvancedMenu } = this.props;

      if(key === 'open-advanced-menu') {
        openAdvancedMenu()
      }

      handleExtraMenuClicks(key, objectSelected, this.props.openColorPicker, objectSelected.tags.subObject)
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
    const action = objectSelected.actionButtonBehavior
    const hasLaser = action === 'shrink' || action === 'grow' || action === 'vacuum' && objectSelected.actionProps && objectSelected.actionProps && objectSelected.actionProps.emitterTypeAction == 'random-laser'
    const hasBullet = action === 'shoot' && objectSelected.actionProps && objectSelected.actionProps.bulletJSON && objectSelected.actionProps.bulletJSON.emitterType == 'random-projectile'
    if(objectSelected.tags.emitter || objectSelected.tags.explodeOnDestroy || objectSelected.tags.poweredUp || hasBullet || hasLaser) {
      return <SubMenu title="Emitter">
        <EmitterRandomizeMenu objectSelected={objectSelected}></EmitterRandomizeMenu>
      </SubMenu>
    }
    //        <EmitterMenu objectSelected={objectSelected} subObject={subObject}></EmitterMenu>
  }

  render() {
    const { objectSelected, openAdvancedMenu, selectSubObject } = this.props

    const subObject = objectSelected.tags.subObject
    const isInvisible = objectSelected.tags.invisible || objectSelected.defaultSprite == 'invisible' || objectSelected.opacity == 0

    let sprite = null
    if(!isInvisible) {
      // if(objectSelected.constructParts) {
      //   sprite = <SubMenu title="Sprite">
      //       {objectSelected.descriptors && <MenuItem key="randomize-from-descriptors">Randomize Sprites</MenuItem>}
      //       {!isInvisible && <MenuItem key="select-color" className='dont-close-menu'>Color</MenuItem>}
      //     </SubMenu>
      // } else {
        sprite = <SubMenu title="Sprite">
          {!isInvisible && <MenuItem key="select-color" className='dont-close-menu'>{(objectSelected.defaultSprite === "solidcolorsprite" || objectSelected.defaultSprite == undefined) ? "Color" : "Tint"}</MenuItem>}
          {objectSelected.descriptors && <MenuItem key="choose-from-recommended-sprites">Select From Recommended</MenuItem>}
          <MenuItem key="choose-from-my-sprites">Select From My Sprites</MenuItem>
          <MenuItem key="open-media-manager-sprite-selector">Select From All</MenuItem>
          {objectSelected.width <= 64 && objectSelected.height <= 320 && !objectSelected.constructParts && <MenuItem key="open-edit-sprite">Edit Sprite</MenuItem>}
          {objectSelected.descriptors && <MenuItem key="randomize-from-descriptors">Randomize</MenuItem>}
        </SubMenu>
      // }
    }

//        {objectSelected.tags.tempModOnHeroCollide && <MenuItem key="open-edit-heroTempMod">Edit Hero Temp Mod</MenuItem>

    if(objectSelected.tags.hero) {
      return <Menu onClick={this._handleMenuClick}>
        <MenuItem key='copy-id' className="bold-menu-item">{objectSelected.subObjectName || objectSelected.name || objectSelected.id}</MenuItem>
        {<MenuItem key="drag">Drag</MenuItem>}
        {<MenuItem key="respawn">Respawn</MenuItem>}
        {<MenuItem key="edit-all-json">Edit JSON</MenuItem>}
        <MenuItem key="open-hero-live-edit">Live Edit</MenuItem>
        {sprite}
        {this._renderObjectEmitterMenu()}
        <SubMenu title="Recommended Tags">
          <CurrentTagsMenu objectSelected={objectSelected} currentTags={objectSelected.tags}></CurrentTagsMenu>
        </SubMenu>
        <MenuItem key="open-tag-search-modal">Edit Tags</MenuItem>
        {Object.keys(objectSelected.subObjects || {}).length && <SubMenu title="Sub Objects">
          <SelectSubObjectMenu objectSelected={objectSelected} selectSubObject={selectSubObject} />
        </SubMenu>}
        <MenuItem className='dont-close-menu' key="open-advanced-menu">Open Advanced Menu</MenuItem>
        {(GAME.gameState.started || GAME.gameState.branch) ? <MenuItem key="remove">Remove</MenuItem> : <MenuItem key="delete">Delete</MenuItem>}
      </Menu>
    } else {
      return <Menu onClick={this._handleMenuClick}>
        <MenuItem key='copy-id' className="bold-menu-item">{objectSelected.subObjectName || objectSelected.name || objectSelected.id}</MenuItem>
        {!subObject && <MenuItem key="drag">Drag</MenuItem>}
        {(!objectSelected.constructParts || objectSelected.tags.maze) && !objectSelected.pathParts && <MenuItem key="resize">Resize</MenuItem>}
        {subObject && <MenuItem key="resize-grid">Resize On Grid</MenuItem>}
        {!subObject && <MenuItem key="copy">Duplicate</MenuItem>}
        {(objectSelected.ownerId || objectSelected.relativeId) && <SubMenu title="Relative">
          <RelativeMenu objectSelected={objectSelected} subObject={subObject}/>
        </SubMenu>}
        {sprite}
        <SubMenu title="Tags">
          <CurrentTagsMenu objectSelected={objectSelected} showRecommended={false} currentTags={objectSelected.tags}></CurrentTagsMenu>
        </SubMenu>
        {objectSelected.tags.talker && <SubMenu title="Dialogue Sets">
          <DialogueSetsMenu objectSelected={objectSelected} subObject={subObject}/>
        </SubMenu>}
        {this._renderObjectSpawnZoneMenu()}
        {this._renderObjectResourceZoneMenu()}
        {this._renderObjectEmitterMenu()}
        {Object.keys(objectSelected.triggers || {}).length && <SubMenu title="Triggers">
          <TriggerMenu objectSelected={objectSelected} subObject={subObject}/>
        </SubMenu>}
        {Object.keys(objectSelected.sequences || {}).length && <SubMenu title="Sequences">
          <SequencesMenu objectSelected={objectSelected} subObject={subObject}/>
        </SubMenu>}
        {<MenuItem key="edit-all-json">Edit JSON</MenuItem>}
        {objectSelected.tags.puzzleStartOnHeroInteract && <MenuItem key="edit-puzzle-password">Edit Puzzle Password</MenuItem>}
        <MenuItem key="edit-descriptors">Edit Descriptors</MenuItem>
        {objectSelected.tags.moving && <MenuItem key="open-live-physics">Edit Physics</MenuItem>}
        {objectSelected.tags.light && <MenuItem key="open-live-light">Edit Light</MenuItem>}
        {objectSelected.tags.path && <MenuItem key="open-path-editor">Open Path Editor</MenuItem>}
        {!isInvisible && <MenuItem key="open-construct-editor">Open Construct Editor</MenuItem>}
        <MenuItem className='dont-close-menu' key="open-advanced-menu">Open Advanced Menu</MenuItem>
        {Object.keys(objectSelected.subObjects || {}).length && <SubMenu title="Sub Objects">
          <SelectSubObjectMenu objectSelected={objectSelected} selectSubObject={selectSubObject} />
        </SubMenu>}
        { subObject && !objectSelected.isEquipped && objectSelected.actionButtonBehavior && <MenuItem key="equip">Equip</MenuItem> }
        { subObject && objectSelected.isEquipped && <MenuItem key="unequip">Unequip</MenuItem> }
        { subObject && objectSelected.tags.pickupable && <MenuItem key="drop">Drop</MenuItem> }
        { (GAME.gameState.started || GAME.gameState.branch) ? <MenuItem key="remove">Remove</MenuItem> : <MenuItem key="delete">Delete</MenuItem> }
      </Menu>
    }
  }
}
