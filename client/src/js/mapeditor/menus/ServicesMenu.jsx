import React from 'react'
import Menu, { SubMenu, MenuItem } from 'rc-menu'
import modals from '../modals.js'
import { genMaze } from '../../procedural/maze.js'

import Swal from 'sweetalert2/src/sweetalert2.js';

export default class ServicesMenu extends React.Component{
  constructor(props) {
    super(props)

    this._handleServicesMenuClick = async ({ key }) => {
      const { objectSelected, subObject } = this.props
      const { onStartSetPathfindingLimit, networkEditObject, openConstructEditor } = MAPEDITOR

      if(key === 'edit-descriptors') {
        modals.openEditDescriptorsModal(objectSelected.descriptors || {}, ({value}) => {
          if(value) {
            networkEditObject(objectSelected, {descriptors: value})
          }
        })
      }

      if(key === 'open-live-particle') {
        LIVEEDITOR.open(objectSelected, 'particle')
      }

      if(key === 'open-construct-editor') {
        openConstructEditor(objectSelected)
      }

      if(key === 'open-path-editor') {
        MAPEDITOR.openPathEditor(objectSelected)
      }

      if (key === "open-physics-live-editor") {
        LIVEEDITOR.open(objectSelected, 'physics')
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

        if(objectSelected.tags.hero) {

        } else if(subObject) {
          window.socket.emit('updateLibrary', { subObject: {...GAME.library.subObject, [name]: OBJECTS.getProperties(objectSelected)} })
          window.socket.emit('updateLibrary', { creator: {...GAME.library.creator, [name]: {
            label: name,
            columnName,
            libraryName: 'subObjectLibrary',
            libraryId: name,
            JSON: OBJECTS.getProperties(objectSelected)
          } } })
        } else {
          window.socket.emit('updateLibrary', { object: {...GAME.library.object, [name]: OBJECTS.getProperties(objectSelected)} })
          window.socket.emit('updateLibrary', { creator: {...GAME.library.creator, [name]: {
            label: name,
            columnName,
            libraryName: 'objectLibrary',
            libraryId: name,
            JSON: OBJECTS.getProperties(objectSelected)
          } } })
        }
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
    // <MenuItem key="edit-properties-json">Edit Properties JSON</MenuItem>
    // <MenuItem key="edit-state-json">Edit State JSON</MenuItem>

    return <Menu onClick={this._handleServicesMenuClick}>
      {!objectSelected.tags.hero && <MenuItem key="add-to-creator-library">Add to creator library</MenuItem>}
      {!objectSelected.tags.hero && <MenuItem key="add-to-object-library">Add to object library</MenuItem>}
      {!objectSelected.tags.hero && <MenuItem key="add-to-subobject-library">Add to sub object library</MenuItem>}
      <MenuItem key='open-construct-editor'>Open construct editor</MenuItem>
      <MenuItem key='open-path-editor'>Open path editor</MenuItem>
      <MenuItem key='open-physics-live-editor'>Live Edit Physics</MenuItem>
      <MenuItem key='open-live-particle'>Live Edit Particle</MenuItem>
      <MenuItem key='generate-maze'>Generate maze</MenuItem>
      <MenuItem key='edit-descriptors'>Edit Descriptors</MenuItem>
    </Menu>
  }
}
