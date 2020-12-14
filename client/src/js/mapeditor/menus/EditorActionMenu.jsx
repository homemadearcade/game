import React from 'react'
import Menu, { SubMenu, MenuItem } from 'rc-menu'
import modals from '../modals.js'
import { genMaze } from '../../procedural/maze.js'

import Swal from 'sweetalert2/src/sweetalert2.js';

export default class EditorActionMenu extends React.Component{
  constructor(props) {
    super(props)

    this._handleEditorActionMenuClick = async ({ key }) => {
      const { objectSelected, subObject } = this.props
      const { onStartSetPathfindingLimit, networkEditObject, openConstructEditor } = MAPEDITOR

      if(key === 'transform-into-library-object') {
        const library = window.objectLibrary.addGameLibrary()
        modals.openSelectFromList('Select an object', Object.keys(library), async (result) => {
          const id = result.value
          if(!id) return
          const newObject = _.cloneDeep(library[id])
          if(newObject.subObjects) {
            Object.keys(newObject.subObjects).forEach((soName) => {
              window.socket.emit('addSubObject', objectSelected, newObject.subObjects[soName], soName)
            })
            delete newObject.subObjects
          }
          networkEditObject(objectSelected, newObject)
        })
      }

      if(key === 'add-new-subobject') {
        const library = window.subObjectLibrary.addGameLibrary()
        modals.openSelectFromList('Select a sub object', Object.keys(library), async (result) => {
          const id = result.value
          if(!id) return
          const { value: name } = await Swal.fire({
            title: 'What will be the name of the sub object?',
            input: 'text',
            inputAttributes: {
              autocapitalize: 'off'
            },
            inputValue: id,
            showCancelButton: true,
            confirmButtonText: 'Next',
          })

          if(name) {
            const copy = Object.replaceAll(library[id], id, name, true, true)
            window.socket.emit('addSubObject', objectSelected, copy, name)
          }

        })
      }

      if(key === 'set-world-respawn-point') {
        window.socket.emit('updateWorld', {worldSpawnPointX: objectSelected.x, worldSpawnPointY:  objectSelected.y})
      }

      if(key === 'set-object-respawn-point') {
        networkEditObject(objectSelected, { spawnPointX: objectSelected.x, spawnPointY: objectSelected.y })
      }

      if(key === 'turn-into-spawn-zone') {
        window.socket.emit('addSubObject', objectSelected, { tags: { potential: true } }, 'spawner')
        networkEditObject(objectSelected, { tags: {spawnZone: true}, spawnLimit: -1, spawnPoolInitial: 1, subObjectChances: {'spawner': {randomWeight: 1, conditionList: null}} })
      }

      if(key === 'turn-into-resource-zone') {
        networkEditObject(objectSelected, { tags: {resourceZone: true}, resourceWithdrawAmount: 1, resourceLimit: -1, resourceTags: { resource: true } })
      }

      if (key === "add-to-creator-library") {
        const { value: name } = await Swal.fire({
          title: 'Add to creator library',
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

        if(objectSelected.tags.hero) {

        } else if(subObject) {
          window.socket.emit('updateLibrary', { subObject: {...GAME.library.subObject, [name]: OBJECTS.getProperties(objectSelected)} })
          window.socket.emit('updateLibrary', { creator: {...GAME.library.creator, [name]: {
            label: name,
            columnName,
            libraryName: 'subObjectLibrary',
            libraryId: name,
          } } })
        } else {
          window.socket.emit('updateLibrary', { object: {...GAME.library.object, [name]: OBJECTS.getProperties(objectSelected)} })
          window.socket.emit('updateLibrary', { creator: {...GAME.library.creator, [name]: {
            label: name,
            columnName,
            libraryName: 'objectLibrary',
            libraryId: name,
          } } })
        }
      }

      if (key === "add-to-object-library") {
        let initialName = objectSelected.subObjectName

        const { value: name } = await Swal.fire({
          title: 'Add to object library',
          text: "What will be the library id of this object?",
          input: 'text',
          inputAttributes: {
            autocapitalize: 'off'
          },
          inputValue: initialName,
          showCancelButton: true,
          confirmButtonText: 'Next',
        })
        if(!name) return

        window.socket.emit('updateLibrary', { object: {...GAME.library.object, [name]: OBJECTS.getProperties(objectSelected)} })
      }

      if (key === "add-to-subobject-library") {
        let initialName = objectSelected.subObjectName

        let { value: name } = await Swal.fire({
          title: 'Add to sub object library',
          text: "What will be the library id of this object?",
          input: 'text',
          inputAttributes: {
            autocapitalize: 'off'
          },
          inputValue: initialName,
          showCancelButton: true,
          confirmButtonText: 'Next',
        })

        if(!name) return

        window.socket.emit('updateLibrary', { subObject: {...GAME.library.subObject, [name]: OBJECTS.getProperties(objectSelected)} })
      }

      if(key === 'generate-maze') {
        let { width, height } = objectSelected
        width = width/GAME.grid.nodeSize
        height = height/GAME.grid.nodeSize

        const { value: mazeWidthMultiplier } = await Swal.fire({
          title: 'What is the width of the maze hallways? ( 1,2,3,4 * gridNodeSize )',
          input: 'number',
          showCancelButton: true,
          inputValue: 1,
          confirmButtonText: 'Ok',
        })

        if(width % 2 == 1) width -= 1
        if(height % 2 == 1) height -= 1

        // console.log(width, height, objectSelected.x, objectSelected.y, Number(mazeWidthMultiplier))

        const parts = genMaze(width, height, objectSelected.x, objectSelected.y, Number(mazeWidthMultiplier))

        // width: (width + 1) * GAME.grid.nodeSize, height: (height + 1) * GAME.grid.nodeSize,

        networkEditObject(objectSelected, {
          tags: { maze: true},
          constructParts: parts.map((p) => {
            p.ownerId = objectSelected.id
            p.color = null
            return p
          })
        })
      }
    }
  }

  render() {
    const { objectSelected, subObject } = this.props

    // <MenuItem key='set-object-respawn-point'>Set current position as object respawn point</MenuItem>
    // <MenuItem key='set-world-respawn-point'>Set current position as world respawn point</MenuItem>
    return <Menu onClick={this._handleEditorActionMenuClick}>
      {!objectSelected.tags.hero && <MenuItem key="add-to-creator-library">Add to creator library</MenuItem>}
      {!objectSelected.tags.hero && <MenuItem key="add-to-object-library">Add to object library</MenuItem>}
      {!objectSelected.tags.hero && <MenuItem key="add-to-subobject-library">Add to sub object library</MenuItem>}
      <MenuItem key='generate-maze'>Generate maze</MenuItem>
      <MenuItem key='add-new-subobject'>Add new sub object</MenuItem>
      <MenuItem key='turn-into-spawn-zone'>Turn into spawn zone</MenuItem>
      <MenuItem key='turn-into-resource-zone'>Turn into resource zone</MenuItem>
      <MenuItem key='transform-into-library-object'>Transform into library object</MenuItem>
    </Menu>
  }
}
