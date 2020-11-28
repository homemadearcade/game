import React from 'react'
import Menu, { SubMenu, MenuItem } from 'rc-menu';
import modals from '../modals.js'

export default class AudioFileContextMenu extends React.Component{
  constructor(props) {
    super(props)

    this._handleAudioFileMenuClick = async ({ key }) => {
      const { audioFileId } = this.props

      if (key === "remove-from-game-assets") {
        GAME.assets.audio[audioFileId] = null
        window.socket.emit('updateAssets', { audio: GAME.assets.audio })
        BELOWMANAGER.ref.forceUpdate()
      }

      if (key === "copy-id") {
        PAGE.copyToClipBoard(audioFileId)
      }

      // if (key === "add-to-subobject-library") {
      //   const { value: name } = await Swal.fire({
      //     title: 'Add to sub object library',
      //     text: "What will be the library id of this object?",
      //     input: 'text',
      //     inputAttributes: {
      //       autocapitalize: 'off'
      //     },
      //     showCancelButton: true,
      //     confirmButtonText: 'Next',
      //   })
      //   window.socket.emit('updateLibrary', { subObject: {...GAME.library.subObject, [name]: OBJECTS.getProperties(objectSelected)} })
      // }
    }
  }

  render() {
    const { audioFileId } = this.props
    return <Menu onClick={this._handleAudioFileMenuClick}>
      <MenuItem key='copy-id' className="bold-menu-item">{audioFileId}</MenuItem>
      {GAME.assets.audio[audioFileId] && <MenuItem key='remove-from-game-assets'>Remove from game assets</MenuItem>}
    </Menu>
  }
}
