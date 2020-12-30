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
import EditorActionMenu from '../menus/EditorActionMenu.jsx';
import SelectSubObjectMenu from '../menus/SelectSubObjectMenu.jsx';
import RelativeMenu from '../menus/RelativeMenu.jsx';
import EditorOpenMenu from '../menus/EditorOpenMenu.jsx';
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
        }
        GAME.library.creator[creatorLibraryId] = null
        global.socket.emit('updateLibrary', { creator: GAME.library.creator })
      }

      if (key === "remove-from-library") {
        GAME.library.creator[creatorLibraryId] = false
        global.socket.emit('updateLibrary', { creator: GAME.library.creator })
      }

      if (key === "add-to-editing-hero-creator") {
        const editingHero = GAME.heros[HERO.editingId]
        global.socket.emit('editHero', { id: HERO.editingId, creator : {...editingHero.creator, [libraryId]: true }})
      }

      if (key === "add-to-creator-library") {
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

        if(!columnName) return

        if(subObject) {
          global.socket.emit('updateLibrary', { creator: {...GAME.library.creator, [libraryId]: {
            label: libraryId,
            columnName,
            libraryName: 'subObjectLibrary',
            libraryId: libraryId,
          } } })
        } else {
          global.socket.emit('updateLibrary', { creator: {...GAME.library.creator, [libraryId]: {
            label: libraryId,
            columnName,
            libraryName: 'objectLibrary',
            libraryId: libraryId,
          } } })
        }
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
        if(!name) return
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

        if(!columnName) return

        const copy = Object.replaceAll(objectSelected, libraryId, name, true , true)
        if(objectSelected.tags.hero) {

        } else if(subObject) {
          global.socket.emit('updateLibrary', { subObject: {...GAME.library.subObject, [name]: OBJECTS.getProperties(copy)} })
          global.socket.emit('updateLibrary', { creator: {...GAME.library.creator, [name]: {
            label: name,
            columnName,
            libraryName: 'subObjectLibrary',
            libraryId: name,
          } } })
        } else {
          global.socket.emit('updateLibrary', { object: {...GAME.library.object, [name]: OBJECTS.getProperties(copy)} })
          global.socket.emit('updateLibrary', { creator: {...GAME.library.creator, [name]: {
            label: name,
            columnName,
            libraryName: 'objectLibrary',
            libraryId: name,
          } } })
        }
      }

      if(key === 'view-library-object-json') {
        modals.openEditCodeModal('VIEW ONLY - Library Object - ' + (creatorLibraryId || libraryId), objectSelected, () =>{})
      }

      if( key === 'edit-library-object-json') {
        modals.openEditCodeModal('Edit Library Object - ' + (creatorLibraryId  || libraryId), objectSelected, (result) => {
          if(result && result.value) {
            const editedCode = JSON.parse(result.value)

            if(!subObject && GAME.library.object[libraryId]) {
              const editedCode = JSON.parse(result.value)
              GAME.library.object[libraryId] = editedCode
              global.socket.emit('updateLibrary', { object: GAME.library.object })
            }

            if(subObject && GAME.library.subObject[libraryId]) {
              const editedCode = JSON.parse(result.value)
              GAME.library.subObject[libraryId] = editedCode
              global.socket.emit('updateLibrary', { subObject: GAME.library.subObject })
            }

            if(GAME.library.animations[libraryId]) {
              const editedCode = JSON.parse(result.value)
              GAME.library.animations[libraryId] = editedCode
              global.socket.emit('updateLibrary', { animations: GAME.library.animations })
            }
          }
        })
      }

      if (key === "copy-to-object-library") {
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
        if(!name) return
        global.socket.emit('updateLibrary', { object: {...GAME.library.objects, [name]: OBJECTS.getProperties(objectSelected)} })
      }

      if (key === "copy-to-subobject-library") {
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
        if(!name) return
        global.socket.emit('updateLibrary', { subObject: {...GAME.library.subObject, [name]: OBJECTS.getProperties(objectSelected)} })
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

    const isCore = window[libraryName][libraryId]

    if(libraryName === 'particleEmitterLibrary') {
      const editingHero = GAME.heros[HERO.editingId]
      return <Menu onClick={this._handleLibraryObjectMenuClick}>
        {libraryName && <MenuItem className="bold-menu-item">{libraryName}</MenuItem>}
        {libraryId && <MenuItem className="bold-menu-item">{libraryId}</MenuItem>}
        {isCore && <MenuItem key='view-library-object-json'>View JSON</MenuItem>}
        {!isCore && <MenuItem key='edit-library-object-json'>Edit JSON</MenuItem>}
      </Menu>
    }

    const editingHero = GAME.heros[HERO.editingId]
    return <Menu onClick={this._handleLibraryObjectMenuClick}>
      {libraryName && <MenuItem className="bold-menu-item">{libraryName}</MenuItem>}
      {libraryId && <MenuItem className="bold-menu-item">{libraryId}</MenuItem>}
      {editingHero && !editingHero.creator[libraryId] && global.creatorLibrary.addGameLibrary()[libraryId] && <MenuItem key='add-to-editing-hero-creator'>Add to Editing Hero's Creator</MenuItem>}
      {!global.creatorLibrary.addGameLibrary()[libraryId] && <MenuItem key='add-to-creator-library'>Add to Creator Library</MenuItem>}
      <MenuItem key='copy-to-creator-library'>Copy to Creator Library</MenuItem>
      <MenuItem key='copy-to-object-library'>Copy to Object Library</MenuItem>
      <MenuItem key='copy-to-subobject-library'>Copy to Sub Object Library</MenuItem>
      {isCore && <MenuItem key='view-library-object-json'>View JSON</MenuItem>}
      {!isCore && <MenuItem key='edit-library-object-json'>Edit JSON</MenuItem>}
      {!isCore && creatorLibraryId && <MenuItem key='rename'>Rename</MenuItem>}
      {!isCore && creatorLibraryId && <MenuItem key='remove-from-library'>Remove</MenuItem>}
    </Menu>
  }
}
