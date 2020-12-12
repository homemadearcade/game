import React from 'react'
import Menu, { SubMenu, MenuItem } from 'rc-menu'
import modals from '../modals.js'
import { genMaze } from '../../procedural/maze.js'

import Swal from 'sweetalert2/src/sweetalert2.js';

export default class EditorOpen extends React.Component{
  constructor(props) {
    super(props)

    this._handleEditorOpenClick = async ({ key }) => {
      const { objectSelected, subObject } = this.props
      const { onStartSetPathfindingLimit, networkEditObject, openConstructEditor } = MAPEDITOR

      if(key === 'edit-descriptors') {
        Object.keys(objectSelected.descriptors || {}).forEach((tag) => {
          if(!objectSelected.descriptors[tag]) delete objectSelected.descriptors[tag]
        })
        modals.openEditDescriptorsModal(objectSelected.descriptors || {}, ({value}) => {
          if(value) {
            networkEditObject(objectSelected, {descriptors: value})
          }
        })
      }

      if(key === 'open-live-particle') {
        LIVEEDITOR.open(objectSelected, 'particle')
      }

      if(key === 'open-live-light') {
        LIVEEDITOR.open(objectSelected, 'light')
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
    }
  }

  render() {
    const { objectSelected, subObject } = this.props

    // <MenuItem key='set-object-respawn-point'>Set current position as object respawn point</MenuItem>
    // <MenuItem key='set-world-respawn-point'>Set current position as world respawn point</MenuItem>
    // <MenuItem key="edit-properties-json">Edit Properties JSON</MenuItem>
    // <MenuItem key="edit-state-json">Edit State JSON</MenuItem>

    return <Menu onClick={this._handleEditorOpenClick}>
      <MenuItem key='open-construct-editor'>Construct editor</MenuItem>
      <MenuItem key='open-path-editor'>Path editor</MenuItem>
      <MenuItem key='open-physics-live-editor'>Edit Physics</MenuItem>
      <MenuItem key='open-live-particle'>Edit Particle</MenuItem>
      <MenuItem key='open-live-light'>Edit Light</MenuItem>
      <MenuItem key='edit-descriptors'>Edit Descriptors</MenuItem>
      <MenuItem key="edit-all-json">Edit All JSON</MenuItem>
      <MenuItem key="edit-properties-json">Edit Properties JSON</MenuItem>
    </Menu>
  }
}
