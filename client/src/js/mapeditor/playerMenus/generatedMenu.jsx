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
// import DescriptorsMenu from '../menus/DescriptorsMenu.jsx';

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
import SpriteChooseMenu from '../menus/SpriteChooseMenu.jsx';
import PropertiesMenu from '../menus/PropertiesMenu.jsx';
import modals from '../modals.js'
import { handleExtraMenuClicks } from './helper.js'

export default class GeneratedMenu extends React.Component {
  constructor(props) {
    super(props)

    this._handleMenuClick = ({ key }) => {
      if(!key) return
      const { startResize, onStartDrag, deleteObject, onCopy, removeObject } = MAPEDITOR
      const { objectSelected, subObject } = this.props;

      if (key === 'resize') {
        if (subObject) {
          startResize(objectSelected, { snapToGrid: false })
        } else {
          startResize(objectSelected)
        }
        return
      }

      if (key === 'resize-grid') {
        startResize(objectSelected, { snapToGrid: true })
        return
      }

      if (key === 'drag') {
        onStartDrag(objectSelected)
        return
      }

      if (key === 'delete') {
        deleteObject(objectSelected)
        return
      }

      if (key === 'remove') {
        removeObject(objectSelected)
        return
      }

      if (key === 'copy') {
        onCopy(objectSelected)
        return
      }

      if (key === 'drop') {
        global.socket.emit('dropObject', objectSelected.ownerId, objectSelected.subObjectName)
        return
      }

      handleExtraMenuClicks(key, objectSelected, this.props.openColorPicker, subObject)
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
      if(!item) return console.log(itemName)
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
      if(!item) return console.log(itemName)

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
      case 'SpriteChoose':
        return (<SpriteChooseMenu key={key} openColorPicker={openColorPicker} objectSelected={objectSelected} subObject={subObject}></SpriteChooseMenu>)
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
      case 'EmitterRandomizeMenu':
        return (<EmitterRandomizeMenu key={key} objectSelected={objectSelected} ></EmitterRandomizeMenu>
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


  render() {
    const { objectSelected, subObject, heroMenuItems, objectMenuItems, worldMenuItems } = this.props
    const { objectMenuObj, heroMenuObj, worldMenuObj } = this._generateContextMenuItems(objectMenuItems, heroMenuItems, worldMenuItems)

    if (objectSelected.tags && objectSelected.tags.hero) {
      return <Menu onClick={this._handleMenuClick}>
        <MenuItem>{objectSelected.name ? objectSelected.name : null}</MenuItem>
        {this._renderGeneratedMenu(heroMenuObj)}
      </Menu>
    }

    if (objectSelected.id) {
      return <Menu onClick={this._handleMenuClick}>
        <MenuItem>{objectSelected.name ? objectSelected.name : null}</MenuItem>
        {this._renderGeneratedMenu(objectMenuObj)}
      </Menu>
    }

    return <Menu onClick={this._handleMenuClick}>
      {this._renderGeneratedMenu(worldMenuObj)}
    </Menu>

    return null;
  }
}
