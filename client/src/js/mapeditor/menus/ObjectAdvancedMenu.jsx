import React from 'react'
import Menu, { SubMenu, MenuItem } from 'rc-menu'
import modals from '../modals.js'
import Swal from 'sweetalert2/src/sweetalert2.js';

export default class ObjectAdvancedMenu extends React.Component{
  constructor(props) {
    super(props)

    this._handleObjectAdvancedMenuClick = async ({ key }) => {
      const { objectSelected } = this.props
      const { onStartSetPathfindingLimit, networkEditObject, openConstructEditor } = MAPEDITOR

      if(key === 'set-pathfinding-limit') {
        onStartSetPathfindingLimit(objectSelected)
      }

      if(key === 'copy-id') {
        PAGE.copyToClipBoard(objectSelected.id)
      }

      if(key === 'edit-properties-json') {
        modals.editObjectCode(objectSelected, 'Editing Object Properties', OBJECTS.getProperties(objectSelected));
      }

      if(key === 'edit-state-json') {
        modals.editObjectCode(objectSelected, 'Editing Object State', OBJECTS.getState(objectSelected));
      }

      if(key === 'edit-all-json') {
        modals.editObjectCode(objectSelected, 'Editing Object', objectSelected);
      }

      if(key === 'add-new-subobject') {
        modals.addNewSubObjectTemplate(objectSelected)
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
        networkEditObject(objectSelected, { tags: {resourceZone: true}, resourceWithdrawAmount: 1, resourceLimit: -1, resourceTags: ['resource'] })
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

    return <Menu onClick={this._handleObjectAdvancedMenuClick}>
      <MenuItem key="add-to-creator-library">Add to creator library</MenuItem>
      <MenuItem key="copy-id">Copy id to clipboard</MenuItem>
      <MenuItem key='add-new-subobject'>Add new sub object</MenuItem>
      <MenuItem key='turn-into-spawn-zone'>Turn into spawn zone</MenuItem>
      <MenuItem key='turn-into-resource-zone'>Turn into resource zone</MenuItem>
      <MenuItem key="edit-properties-json">Edit Properties JSON</MenuItem>
      <MenuItem key="edit-state-json">Edit State JSON</MenuItem>
      <MenuItem key="edit-all-json">Edit All JSON</MenuItem>
      <MenuItem key='set-object-respawn-point'>Set current position as object respawn point</MenuItem>
      <MenuItem key='set-world-respawn-point'>Set current position as world respawn point</MenuItem>
      <MenuItem key='open-construct-editor'>Open construct editor</MenuItem>
      <MenuItem key='open-path-editor'>Open path editor</MenuItem>
      <MenuItem key='open-physics-live-editor'>Live Edit Physics</MenuItem>
    </Menu>
  }
}
