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

      if (key === "rename") {
        const { value: name } = await Swal.fire({
          title: 'Rename ' + libraryName,
          text: "What is the new name",
          input: 'text',
          inputAttributes: {
            autocapitalize: 'off'
          },
          showCancelButton: true,
          confirmButtonText: 'Next',
        })

        if(!name) return

        GAME.library.creator[name] = {
          label: name,
          columnName: GAME.library.creator[libraryId].columnName,
          libraryName,
          libraryId,
          JSON: OBJECTS.getProperties(objectSelected)
        }
        GAME.library.creator[creatorLibraryId] = null
        window.socket.emit('updateLibrary', { creator: GAME.library.creator })
      }

      if (key === "remove-from-library") {
        GAME.library.creator[creatorLibraryId] = false
        window.socket.emit('updateLibrary', { creator: GAME.library.creator })
      }

      if (key === "copy-to-creator-library") {
        const { value: name } = await Swal.fire({
          title: 'Copy to creator library',
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

        const copy = Object.replaceAll(objectSelected, libraryId, name, true , true)
        if(objectSelected.tags.hero) {

        } else if(subObject) {
          window.socket.emit('updateLibrary', { subObject: {...GAME.library.subObject, [name]: OBJECTS.getProperties(copy)} })
          window.socket.emit('updateLibrary', { creator: {...GAME.library.creator, [name]: {
            label: name,
            columnName,
            libraryName: 'subObjectLibrary',
            libraryId: name,
            JSON: OBJECTS.getProperties(copy)
          } } })
        } else {
          window.socket.emit('updateLibrary', { object: {...GAME.library.object, [name]: OBJECTS.getProperties(copy)} })
          window.socket.emit('updateLibrary', { creator: {...GAME.library.creator, [name]: {
            label: name,
            columnName,
            libraryName: 'objectLibrary',
            libraryId: name,
            JSON: OBJECTS.getProperties(copy)
          } } })
        }
      }

      if(key === 'view-library-object-json') {
        modals.openEditCodeModal('VIEW ONLY - Library Object - ' + creatorLibraryId, objectSelected, () =>{})
      }

      if( key === 'edit-library-object-json') {
        modals.openEditCodeModal('Edit Library Object - ' + creatorLibraryId, objectSelected, (result) => {
          if(result && result.value) {
            const editedCode = JSON.parse(result.value)
            if(GAME.library.creator[creatorLibraryId]) {
              GAME.library.creator[creatorLibraryId].JSON = editedCode
              window.socket.emit('updateLibrary', { creator: GAME.library.creator })
            }

            if(!subObject && GAME.library.object[libraryId]) {
              const editedCode = JSON.parse(result.value)
              GAME.library.object[libraryId] = editedCode
              window.socket.emit('updateLibrary', { object: GAME.library.object })
            }

            if(subObject && GAME.library.subObject[libraryId]) {
              const editedCode = JSON.parse(result.value)
              GAME.library.subObject[libraryId] = editedCode
              window.socket.emit('updateLibrary', { subObject: GAME.library.subObject })
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
      {!GAME.library.creator[creatorLibraryId] && <MenuItem key='view-library-object-json'>View JSON</MenuItem>}
      {GAME.library.creator[creatorLibraryId] && <MenuItem key='edit-library-object-json'>Edit JSON</MenuItem>}
      {GAME.library.creator[creatorLibraryId] && <MenuItem key='rename'>Rename</MenuItem>}
      {GAME.library.creator[creatorLibraryId] && <MenuItem key='remove-from-library'>Remove</MenuItem>}
    </Menu>
  }
}
