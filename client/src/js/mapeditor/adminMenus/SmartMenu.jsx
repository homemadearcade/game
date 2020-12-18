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

export default class GeneratedMenu extends React.Component {
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

  _generateContextMenuItems(objectMenuItems, heroMenuItems, worldMenuItems = {}) {
    // <MenuItem> key=action </MenuItem>
    const objectMenuObj = { baseLevelMenu: [] }
    const heroMenuObj = { baseLevelMenu: [] }
    const worldMenuObj = { baseLevelMenu: [] }

    Object.keys(objectMenuItems).forEach(itemName => {
      if(objectMenuItems[itemName] == false) return
      const item = global.playerMenuLibrary[itemName]
      if (item.hasOwnProperty('subMenu')) {
        if (!objectMenuObj[item.subMenu]) {
          objectMenuObj[item.subMenu] = { submenuKey: item.subMenu, subMenuItems: [] }
          objectMenuObj['baseLevelMenu'].push({ subMenuKey: item.subMenu })
        }
        objectMenuObj[item.subMenu].subMenuItems.push(item)
      } else {
        objectMenuObj['baseLevelMenu'].push(item)
      }
    })

    Object.keys(heroMenuItems).forEach(itemName => {
      if(heroMenuItems[itemName] == false) return
      const item = global.playerMenuLibrary[itemName]

      if (item.hasOwnProperty('subMenu')) {
        if (!heroMenuObj[item.subMenu]) {
          heroMenuObj[item.subMenu] = { submenuKey: item.subMenu, subMenuItems: [] }
          heroMenuObj['baseLevelMenu'].push({ subMenuKey: item.subMenu })
        }
        heroMenuObj[item.subMenu].subMenuItems.push(item)
      } else {
        heroMenuObj['baseLevelMenu'].push(item)
      }
    })

    Object.keys(worldMenuItems).forEach(itemName => {
      if(worldMenuItems[itemName] == false) return
      const item = global.playerMenuLibrary[itemName]

      if (item.hasOwnProperty('subMenu')) {
        if (!worldMenuObj[item.subMenu]) {
          worldMenuObj[item.subMenu] = { submenuKey: item.subMenu, subMenuItems: [] }
          worldMenuObj['baseLevelMenu'].push({ subMenuKey: item.subMenu })
        }
        worldMenuObj[item.subMenu].subMenuItems.push(item)
      } else {
        worldMenuObj['baseLevelMenu'].push(item)
      }
    })

    return {
      heroMenuObj,
      worldMenuObj,
      objectMenuObj
    }
  }

  _renderSubMenu(subMenuItems, key) {
    return (
      <SubMenu title={key}>
        {subMenuItems.map(item => {
          return this._fetchMenu(item)
        })}
      </SubMenu>
    )
  }

  _fetchMenu(menuData, key) {
    const { objectSelected, subObject, openColorPicker } = this.props
    switch (menuData.useExistingMenu) {
      case 'Dialogue':
        return (<DialogueMenu key={key} objectSelected={objectSelected} subObject={subObject} />)
      case 'Color':
        return (<ColorMenu key={key} objectSelected={objectSelected} openColorPicker={openColorPicker} subObject={subObject}></ColorMenu>
        )
      case 'Tag':
        return (<TagMenu key={key} objectSelected={objectSelected}></TagMenu>
        )
      case 'GameTag':
        return (<GameTagMenu key={key} objectSelected={objectSelected} subObject={subObject}></GameTagMenu>
        )
      case 'Quest':
        return (<QuestMenu key={key} objectSelected={objectSelected} subObject={subObject}></QuestMenu>
        )
      case 'SpawnZone':
        return (<SpawnZoneMenu key={key} objectSelected={objectSelected} subObject={subObject}></SpawnZoneMenu>
        )
      case 'ResourceZone':
        return (<ResourceZoneMenu key={key} objectSelected={objectSelected} subObject={subObject}></ResourceZoneMenu>
        )
      case 'Name':
        return (<NameMenu key={key} objectSelected={objectSelected} subObject={subObject}></NameMenu>
        )
      case 'EditorActionMenu':
        return (<EditorActionMenu key={key} objectSelected={objectSelected} subObject={subObject}></EditorActionMenu>
        )
      case 'SelectSubObject':
        return (<SelectSubObjectMenu key={key} objectSelected={objectSelected} subObject={subObject}></SelectSubObjectMenu>
        )
      case 'Relative':
        return (<RelativeMenu key={key} objectSelected={objectSelected} subObject={subObject}></RelativeMenu>
        )
      case 'Trigger':
        return (<TriggerMenu key={key} objectSelected={objectSelected} ></TriggerMenu>
        )
      case 'Hook':
        return (<HookMenu key={key} objectSelected={objectSelected}></HookMenu>
        )
      case 'Live':
        return (<LiveMenu key={key} objectSelected={objectSelected} subObject={subObject}></LiveMenu>
        )
      case 'Sprite':
        return (<SpriteMenu key={key} objectSelected={objectSelected} ></SpriteMenu>
        )
      case 'Properties':
        return (<PropertiesMenu key={key} objectSelected={objectSelected} ></PropertiesMenu>
        )
      case 'Descriptors':
        return (<DescriptorsMenu key={key} objectSelected={objectSelected} ></DescriptorsMenu>
        )
      case 'DialogueSets':
        return (<DialogueSetsMenu key={key} objectSelected={objectSelected} ></DialogueSetsMenu>
        )
      case 'Popover':
        return (<PopoverMenu key={key} objectSelected={objectSelected} ></PopoverMenu>
        )
      case 'PlayerCreateObject':
        return (<PlayerCreateObjectMenu key={key} objectSelected={objectSelected} ></PlayerCreateObjectMenu>
        )
      default:
        return (<MenuItem className={classnames({'dont-close-menu': menuData.dontCloseMenu})} key={menuData.action}>{menuData.title}</MenuItem>)
    }
  }


  _renderGeneratedMenu(menuObj) {
    return menuObj.baseLevelMenu.map((item, index) => {
      if (item.subMenuKey) {
        return this._renderSubMenu(menuObj[item.subMenuKey].subMenuItems, item.subMenuKey)
      } else if (item.useExistingMenu) {
        return (<SubMenu title={item.title}>
          {this._fetchMenu(item, index)}
        </SubMenu>)
      }
      else {
        return this._fetchMenu(item)
      }
    })
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
    // if(objectSelected.tags.emitter) {
      return <SubMenu title="Emitters">
        <EmitterMenu objectSelected={objectSelected} subObject={subObject}></EmitterMenu>
      </SubMenu>
    // }
  }

  render() {
    const { objectSelected, openAdvancedMenu, selectSubObject } = this.props

    const subObject = objectSelected.tags.subObject
    const isInvisible = objectSelected.tags.invisible || objectSelected.defaultSprite == 'invisible' || objectSelected.opacity == 0

    if(objectSelected.tags.hero) {
      return <Menu onClick={this._handleMenuClick}>
        <MenuItem key='copy-id' className="bold-menu-item">{objectSelected.subObjectName || objectSelected.name || objectSelected.id}</MenuItem>
        {<MenuItem key="drag">Drag</MenuItem>}
        {<MenuItem key="respawn">Respawn</MenuItem>}
        {<MenuItem key="edit-all-json">Edit JSON</MenuItem>}
        <MenuItem key="open-hero-live-edit">Live Edit</MenuItem>
        <SubMenu title="Current Tags">
          <CurrentTagsMenu objectSelected={objectSelected} currentTags={objectSelected.tags}></CurrentTagsMenu>
        </SubMenu>
        {Object.keys(objectSelected.subObjects || {}).length && <SubMenu title="Sub Objects">
          <SelectSubObjectMenu objectSelected={objectSelected} selectSubObject={selectSubObject} />
        </SubMenu>}
        <MenuItem className='dont-close-menu' key="open-advanced-menu">Open Advanced Menu</MenuItem>
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
        {!isInvisible && !objectSelected.contructParts && <MenuItem key="select-color" className='dont-close-menu'>Color</MenuItem>}
        {!isInvisible && !objectSelected.contructParts && <MenuItem key="open-media-manager-sprite-selector">Sprite</MenuItem>}
        <SubMenu title="Current Tags">
          <CurrentTagsMenu objectSelected={objectSelected} currentTags={objectSelected.tags}></CurrentTagsMenu>
        </SubMenu>
        <SubMenu title="Suggested Tags">
          <RelatedTagsMenu objectSelected={objectSelected}></RelatedTagsMenu>
        </SubMenu>
        {objectSelected.tags.talker && <SubMenu title="Dialogue Sets">
          <DialogueSetsMenu objectSelected={objectSelected} subObject={subObject}/>
        </SubMenu>}
        {this._renderObjectSpawnZoneMenu()}
        {this._renderObjectResourceZoneMenu()}
        {Object.keys(objectSelected.triggers || {}).length && <SubMenu title="Triggers">
          <TriggerMenu objectSelected={objectSelected} subObject={subObject}/>
        </SubMenu>}
        {Object.keys(objectSelected.sequences || {}).length && <SubMenu title="Sequences">
          <SequencesMenu objectSelected={objectSelected} subObject={subObject}/>
        </SubMenu>}
        {<MenuItem key="edit-all-json">Edit JSON</MenuItem>}
        <MenuItem key="edit-descriptors">Edit Descriptors</MenuItem>
        <MenuItem key="open-tag-search-modal">Edit Tags</MenuItem>
        {objectSelected.tags.emitter && <MenuItem key="open-live-particle">Edit Emitter</MenuItem>}
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
