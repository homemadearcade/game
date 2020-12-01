import React from 'react'
import ReactDOM from 'react-dom'
import Menu, { SubMenu, MenuItem } from 'rc-menu';
import { SwatchesPicker } from 'react-color';
import HeroContextMenu from './adminMenus/heroContextMenu.jsx';
import ObjectContextMenu from './adminMenus/objectContextMenu.jsx';
import EditingObjectContextMenu from './adminMenus/EditingObjectContextMenu.jsx';
import EditingSequenceContextMenu from './adminMenus/EditingSequenceContextMenu.jsx';
import WorldContextMenu from './adminMenus/worldContextMenu.jsx';
import GeneratedMenu from './playerMenus/generatedMenu.jsx';
import InventoryMenu from './playerMenus/InventoryMenu.jsx';
import LibraryObjectContextMenu from './adminMenus/LibraryObjectContextMenu.jsx';
import AudioFileContextMenu from './adminMenus/AudioFileContextMenu.jsx';
import SpriteDataContextMenu from './adminMenus/SpriteDataContextMenu.jsx';

import '../libraries/playerMenuLibrary.js';

import modals from './modals.js';

function init(editor, props) {
  MAPEDITOR.contextMenu = document.getElementById('context-menu')
  MAPEDITOR.contextMenuVisible = false

  // Mount React App
  ReactDOM.render(
    React.createElement(contextMenuEl, { editor, ...props, ref: ref => MAPEDITOR.contextMenuRef = ref }),
    MAPEDITOR.contextMenu
  )
}

class contextMenuEl extends React.Component{
  constructor(props) {
    super(props)

    document.body.addEventListener("click", e => {
      if(e.target.dataset.textureids) {
        setTimeout(() => {
          this._openMenuWithEvent(e, false)
          this._setContextMenuSpecialItem('sprite', null, { textureIds: e.target.dataset.textureids})
        }, 10)
        e.stopPropagation()
        return false;
      }
    })

    document.body.addEventListener("contextmenu", e => {
      if(e.target.dataset.textureids) {
        this._openMenuWithEvent(e, false)
        this._setContextMenuSpecialItem('sprite', null, { textureIds: e.target.dataset.textureids})
        return false;
      }

      if(e.target.dataset.spritedata) {
        this._openMenuWithEvent(e, false)
        this._setContextMenuSpecialItem('sprite', null, { spriteData: e.target.dataset.spritedata })
        return false;
      }

      if(e.target.dataset.audiofileid) {
        this._openMenuWithEvent(e, false)
        this._setContextMenuSpecialItem('audioFile', e.target.dataset.audiofileid)
        return false;
      }

      if(e.target.dataset.inventorymenuid) {
        this._openMenuWithEvent(e)
        this._setContextMenuSpecialItem('inventory', OBJECTS.getObjectOrHeroById(e.target.dataset.inventorymenuid))
        return false;
      }

      if(e.target.dataset.creatorlibraryid) {
        this._openMenuWithEvent(e)

        const creatorLibraryObject = window.creatorLibrary.addGameLibrary()[e.target.dataset.creatorlibraryid]
        if(creatorLibraryObject.libraryName && creatorLibraryObject.libraryId) {
          const libraryObject = window[creatorLibraryObject.libraryName].addGameLibrary()[creatorLibraryObject.libraryId]
          this._setContextMenuSpecialItem(creatorLibraryObject.libraryName, libraryObject, {creatorLibraryId: e.target.dataset.creatorlibraryid, libraryName: creatorLibraryObject.libraryName, libraryId: creatorLibraryObject.libraryId})
        } else if(creatorLibraryObject.JSON) {
          this._setContextMenuSpecialItem('creatorLibrary', creatorLibraryObject.JSON, {creatorLibraryId: e.target.dataset.creatorlibraryid, libraryName: 'creatorLibrary', libraryId: e.target.dataset.creatorlibraryid})
        }
        return false;
      }

      if(!window.isClickingMap(e.target.className)) return

      if(!PAGE.showEditorTools()) {
        return null
      }

      if(!MAPEDITOR.paused) {
        // AUDIO.play(window.defaultAudioTheme.onPlayerUIMenuOpen, { volume: 0.6 })
        this._openMenuWithEvent(e)
        return false;
      }
    });

    // window.addEventListener("click", e => {
    //   if(e.target.className.indexOf('dont-close-menu') >= 0) {
    //   } else {
    //     this._toggleContextMenu("hide");
    //   }
    // });

    this.state = {
      hide: true,
      objectSelected: {},
      subObjectSelected: {},
      subObjectSelectedName: null,
      coloringObject: null,
    }

    this.openColorPicker = (coloringObject) => {
      this.setState({ coloringObject  })
    }

    this._selectSubObject = (subObject, name) => {
      MAPEDITOR.objectHighlighted = subObject
      this.setState({
        subObjectSelected: subObject,
        subObjectSelectedName: name,
      })
    }
  }

  _toggleContextMenu = (command) => {
    if(command === "show") {
      this.setState({ hide: false, objectSelected: MAPEDITOR.objectHighlighted })
    } else {
      this.setState({ hide: true, subObjectSelected: {}, subObjectSelectedName: null, objectSelected: null, coloringObject: null, specialItemType: null, item: null, libraryName: null, libraryId: null, spriteData: null, textureIds: null })
    }
  }

  _openMenuWithEvent(e, adjust = true) {
    e.preventDefault();
    const { x, y } = window.convertToGameXY(e)
    const origin = {
      left: x,
      top: y
    };
    this._setContextMenuPosition(origin, adjust);
  }
  _setContextMenuSpecialItem(type, item, other) {
    this.setState({
      specialItemType: type,
      item,
      ...other
    })
  }

  _setContextMenuPosition = ({ top, left }, adjust = true) => {
    // THIS ADJUSTS THE SIZE OF THE CONTEXT MENU IF ITS TOO CLOSE TO THE EDGES
    if(adjust && MAPEDITOR.objectHighlighted.id) {
      const heightDesired = 350
      const widthDesired = 450

      const bottomDistance = window.innerHeight - top
      const rightDistance = window.innerWidth - left

      if(bottomDistance < heightDesired) {
        top = window.innerHeight - heightDesired
      }

      if(rightDistance < widthDesired) {
        left = window.innerWidth - widthDesired
      }
    }

    MAPEDITOR.contextMenu.style.left = `${left}px`
    MAPEDITOR.contextMenu.style.top = `${top}px`

    this._toggleContextMenu('show')
  }

  _renderPlayerMenus() {
    const { objectSelected, subObjectSelected, subObjectSelectedName } = this.state;

    MAPEDITOR.contextMenuVisible = true

    const hero = GAME.heros[HERO.id]
    return <GeneratedMenu
      objectSelected={objectSelected}
      openColorPicker={this.openColorPicker}
      selectSubObject={this._selectSubObject}
      heroMenuItems={hero.heroMenu}
      objectMenuItems={hero.objectMenu}
      worldMenuItems={hero.worldMenu}
    />
  }

  _renderAdminMenus() {
    const { objectSelected, subObjectSelected, subObjectSelectedName, specialItemType, item, libraryName, libraryId, creatorLibraryId, audioFileId, spriteData, textureIds } = this.state;

    if(specialItemType === 'sprite') {
      return <SpriteDataContextMenu
        spriteData={spriteData ? JSON.parse(spriteData) : null}
        textureIds={textureIds ? JSON.parse(textureIds) : null}
        ></SpriteDataContextMenu>
    }

    if(specialItemType === 'audioFile') {
      return <AudioFileContextMenu
        audioFileId={item}
      />
    }

    if(specialItemType === 'creatorLibrary') {
      return <LibraryObjectContextMenu
        objectSelected={item}
        creatorLibraryId={creatorLibraryId}
        libraryName={libraryName}
        libraryId={libraryId}
      />
    }

    if(specialItemType === 'objectLibrary') {
      return <LibraryObjectContextMenu
        objectSelected={item}
        creatorLibraryId={creatorLibraryId}
        libraryName={libraryName}
        libraryId={libraryId}
      />
    }

    if(specialItemType === 'subObjectLibrary') {
      return <LibraryObjectContextMenu
        libraryName={libraryName}
        libraryId={libraryId}
        creatorLibraryId={creatorLibraryId}
        objectSelected={item}
        subObject={true}
      />
    }

    if(specialItemType === 'inventory') {
      return <InventoryMenu
        item={item}
      />
    }

    const { networkEditObject } = MAPEDITOR

    MAPEDITOR.contextMenuVisible = true

    if(BELOWMANAGER.editingSequenceItemId) {
      return <EditingSequenceContextMenu
        objectSelected={objectSelected}
      />
    }

    const showEditingObjectMenu = OBJECTS.editingId && objectSelected.id && OBJECTS.editingId !== objectSelected.id
    if(showEditingObjectMenu) {
      const objectEditing = OBJECTS.getObjectOrHeroById(OBJECTS.editingId)
      if(objectEditing) {
        return <EditingObjectContextMenu
          objectEditing={objectEditing}
          objectSelected={objectSelected}
          selectSubObject={this._selectSubObject}
        />
      } else {
        OBJECTS.editingId = null
      }
    }

    if(subObjectSelected && subObjectSelectedName) {
      if(showEditingObjectMenu) {
        const objectEditing = OBJECTS.getObjectOrHeroById(OBJECTS.editingId)
        if(objectEditing) {
          return <EditingObjectContextMenu
            objectEditing={objectEditing}
            objectSelected={subObjectSelected}
            openColorPicker={this.openColorPicker}
            selectSubObject={this._selectSubObject}
          />
        } else {
          OBJECTS.editingId = null
        }
      }
      return <ObjectContextMenu
        objectSelected={subObjectSelected}
        openColorPicker={this.openColorPicker}
        selectSubObject={this._selectSubObject}
        subObject
        />
    }

    if(objectSelected.tags && objectSelected.tags.hero) {
      return <HeroContextMenu
        objectSelected={objectSelected}
        openColorPicker={this.openColorPicker}
        selectSubObject={this._selectSubObject}
      />
    }

    if(!objectSelected.id) {
      return <WorldContextMenu
        objectSelected={objectSelected}
        openColorPicker={this.openColorPicker}
        selectSubObject={this._selectSubObject}
      />
    }

    return <ObjectContextMenu
      objectSelected={objectSelected}
      openColorPicker={this.openColorPicker}
      selectSubObject={this._selectSubObject}
    />
  }

  render() {
    const { hide, coloringObject, objectSelected, subObjectSelected, subObjectSelectedName } = this.state;
    const { networkEditObject } = MAPEDITOR

    if(hide) {
      MAPEDITOR.contextMenuVisible = false
      return null
    }

    if(coloringObject) {
      return <SwatchesPicker
        color={ coloringObject.color }
        onChange={ (color) => {
          if(coloringObject == 'worldBackground') {
            window.socket.emit('updateWorld', {backgroundColor: color.hex})
          } else if(coloringObject == 'defaultObject') {
            window.socket.emit('updateWorld', {defaultObjectColor: color.hex})
          } else {
            coloringObject.tags.outline = false
            networkEditObject(coloringObject, {color: color.hex})
          }
          this.setState({
            coloringObject: null,
          })
        }}
      />
    }

    if(PAGE.role.isAdmin) {
      return this._renderAdminMenus()
    } else {
      return this._renderPlayerMenus()
    }
  }
}

export default {
  init
}
