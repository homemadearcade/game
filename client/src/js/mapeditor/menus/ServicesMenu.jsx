import React from 'react'
import Menu, { SubMenu, MenuItem } from 'rc-menu'
import modals from '../modals.js'
import Swal from 'sweetalert2/src/sweetalert2.js';

export default class ServicesMenu extends React.Component{
  constructor(props) {
    super(props)

    this._handleServicesMenuClick = async ({ key }) => {
      const { objectSelected } = this.props
      const { onStartSetPathfindingLimit, networkEditObject, openConstructEditor } = MAPEDITOR

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
          title: 'Create Game',
          text: "What is the name of this object?",
          input: 'text',
          inputAttributes: {
            autocapitalize: 'off'
          },
          showCancelButton: true,
          confirmButtonText: 'Next',
        })
        const { value: columnName } = await Swal.fire({
          title: 'Create Game',
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
    }
  }

  render() {
    const { objectSelected } = this.props

    // <MenuItem key='set-object-respawn-point'>Set current position as object respawn point</MenuItem>
    // <MenuItem key='set-world-respawn-point'>Set current position as world respawn point</MenuItem>
    // <MenuItem key="edit-properties-json">Edit Properties JSON</MenuItem>
    // <MenuItem key="edit-state-json">Edit State JSON</MenuItem>

    return <Menu onClick={this._handleServicesMenuClick}>
      <MenuItem key="add-to-creator-library">Add to creator library</MenuItem>
      <MenuItem key='open-construct-editor'>Open construct editor</MenuItem>
      <MenuItem key='open-path-editor'>Open path editor</MenuItem>
      <MenuItem key='open-physics-live-editor'>Live Edit Physics</MenuItem>
      <MenuItem key='open-live-particle'>Live Edit Particle</MenuItem>
    </Menu>
  }
}
