import React from 'react'
import Menu, { SubMenu, MenuItem } from 'rc-menu'
import modals from '../modals.js'

export default class PopoverMenu extends React.Component{
  constructor(props) {
    super(props)

    this._handlePopoverMenuClick = async ({ key }) => {
      const { objectSelected } = this.props
      const { networkEditObject } = MAPEDITOR

      if(key == "edit-popover-text") {
        const { value: text } = await Swal.fire({
          title: "What is the popover text?",
          input: 'text',
          inputAttributes: {
            autocapitalize: 'off'
          },
          inputValue: objectSelected.popoverText || '',
          showCancelButton: true,
          confirmButtonText: 'Confirm',
        })
        networkEditObject(objectSelected, { popoverText: text})
      }

      if(key == "clear-popover-text") {
        networkEditObject(objectSelected, { popoverText: null})
      }
    }
  }

  render() {
    const { objectSelected } = this.props

    return <Menu onClick={this._handlePopoverMenuClick}>
      <MenuItem key="edit-popover-text">Edit text</MenuItem>
      <MenuItem key="clear-popover-text">Clear</MenuItem>
    </Menu>
  }
}
