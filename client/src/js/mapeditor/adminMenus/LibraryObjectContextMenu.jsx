import React from 'react'
import Menu, { SubMenu, MenuItem } from 'rc-menu';
import TagMenu from '../menus/tagMenu.jsx';
import CurrentTagsMenu from '../menus/CurrentTagsMenu.jsx';
import ColorMenu from '../menus/ColorMenu.jsx';
import GameTagMenu from '../menus/GameTagMenu.jsx';
import DialogueMenu from '../menus/DialogueMenu.jsx';
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

export default class LibraryObjectContextMenu extends React.Component{
  constructor(props) {
    super(props)

    this._handleLibraryObjectMenuClick = async ({ key }) => {
      const { objectSelected, subObject, libraryName, libraryId, creatorLibraryId } = this.props

      if (key === "copy-to-creator-library") {
        const { value: name } = await Swal.fire({
          title: 'Copy creator library',
          text: "What is the name of this object?",
          input: 'text',
          inputAttributes: {
            autocapitalize: 'off'
          },
          showCancelButton: true,
          confirmButtonText: 'Next',
        })
        const { value: columnName } = await Swal.fire({
          title: 'Add to creator library',
          text: "What column? (enter name case sensitive)",
          input: 'text',
          inputAttributes: {
            autocapitalize: 'off'
          },
          showCancelButton: true,
          confirmButtonText: 'Add to library',
        })
        window.socket.emit('updateLibrary', { creator: {...GAME.library.creator, [name]: {
          label: name,
          columnName,
          JSON: OBJECTS.getProperties(objectSelected)
        } } })
      }

      if( key === 'edit-library-object-json') {
        modals.openEditCodeModal('Edit Library Object - ' + creatorLibraryId, objectSelected, (result) => {
          if(result && result.value) {
            if(GAME.library.creator[creatorLibraryId]) {
              const editedCode = JSON.parse(result.value)
              GAME.library.creator[creatorLibraryId].JSON = editedCode
              window.socket.emit('updateLibrary', { creator: GAME.library.creator })
            }
          }
        })
      }

      if (key === "add-to-object-library") {
        const { value: name } = await Swal.fire({
          title: 'Add to object library',
          text: "What will be the library id of this object?",
          input: 'text',
          inputAttributes: {
            autocapitalize: 'off'
          },
          showCancelButton: true,
          confirmButtonText: 'Next',
        })

        window.socket.emit('updateLibrary', { object: {...GAME.library.objects, [name]: OBJECTS.getProperties(objectSelected)} })
      }

      if (key === "add-to-subobject-library") {
        const { value: name } = await Swal.fire({
          title: 'Add to sub object library',
          text: "What will be the library id of this object?",
          input: 'text',
          inputAttributes: {
            autocapitalize: 'off'
          },
          showCancelButton: true,
          confirmButtonText: 'Next',
        })
        window.socket.emit('updateLibrary', { subObject: {...GAME.library.subObject, [name]: OBJECTS.getProperties(objectSelected)} })
      }
    }
  }
  //
  // _renderObjectQuestMenu() {
  //   const { objectSelected, subObject } = this.props
  //   const { questGiver, questCompleter } = objectSelected.tags
  //
  //   if(questGiver || questCompleter) {
  //     return <SubMenu title="Quest">
  //     <QuestMenu objectSelected={objectSelected} subObject={subObject}/>
  //     </SubMenu>
  //   }
  // }
  //
  // _renderObjectSpawnZoneMenu() {
  //   const { objectSelected, subObject } = this.props
  //   const { spawnZone } = objectSelected.tags
  //
  //   if(spawnZone) {
  //     return <SubMenu title="Spawn Zone">
  //     <SpawnZoneMenu objectSelected={objectSelected} subObject={subObject}/>
  //     </SubMenu>
  //   }
  // }
  //
  // _renderObjectResourceZoneMenu() {
  //   const { objectSelected, subObject } = this.props
  //   const { resourceZone } = objectSelected.tags
  //
  //   if(resourceZone) {
  //     return <SubMenu title="Resource Zone">
  //       <ResourceZoneMenu objectSelected={objectSelected} subObject={subObject}/>
  //     </SubMenu>
  //   }
  // }
  //
  // _renderObjectEmitterMenu() {
  //   const { objectSelected, subObject } = this.props
  //   if(objectSelected.tags.emitter) {
  //     return <SubMenu title="Emitter">
  //       <EmitterMenu objectSelected={objectSelected} subObject={subObject}></EmitterMenu>}
  //     </SubMenu>
  //   }
  // }

  render() {
    const { objectSelected, subObject, libraryName, libraryId, creatorLibraryId } = this.props

    // <SubMenu title="Name">
    //   <NameMenu objectSelected={objectSelected} subObject={subObject}/>
    // </SubMenu>

    // <SubMenu title='Sprite'><SpriteMenu objectSelected={objectSelected} subObject={subObject}/></SubMenu>
    // <SubMenu title="Dialogue">
    //   <DialogueMenu objectSelected={objectSelected} subObject={subObject}/>
    // </SubMenu>
    // {this._renderObjectSpawnZoneMenu()}
    // {this._renderObjectResourceZoneMenu()}
    // {this._renderObjectEmitterMenu()}
    // <SubMenu title="Group">
    //   <GameTagMenu objectSelected={objectSelected} subObject={subObject}/>
    // </SubMenu>
    // <SubMenu title="Triggers">
    //   <TriggerMenu objectSelected={objectSelected}/>
    // </SubMenu>
    // <SubMenu title="Current Tags">
    //   <CurrentTagsMenu objectSelected={objectSelected} currentTags={objectSelected.tags}></CurrentTagsMenu>
    // </SubMenu>
    // <SubMenu title="All Tags">
    //   <TagMenu objectSelected={objectSelected} subObject={subObject}></TagMenu>
    // </SubMenu>
    // {!subObject && Object.keys(objectSelected.subObjects || {}).length && <SubMenu title="Sub Objects">
    //   <SelectSubObjectMenu objectSelected={objectSelected} selectSubObject={this.props.selectSubObject}/>
    // </SubMenu>}
    return <Menu onClick={this._handleLibraryObjectMenuClick}>
      {libraryName && <MenuItem className="bold-menu-item">{libraryName}</MenuItem>}
      {libraryId && <MenuItem className="bold-menu-item">{libraryId}</MenuItem>}
      <MenuItem key='copy-to-creator-library'>Copy</MenuItem>
      {GAME.library.creator[creatorLibraryId] && <MenuItem key='edit-library-object-json'>Edit JSON</MenuItem>}

    </Menu>
  }
}