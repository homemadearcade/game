import React from 'react'
import Menu, { SubMenu, MenuItem } from 'rc-menu'
import modals from '../modals.js'
import SubObjectChanceMenu from './SubObjectChanceMenu.jsx'

const removeResourceTagPrefix = 'remove-resource-tag-'

export default class ResourceZoneMenu extends React.Component{
  constructor(props) {
    super(props)

    this._handleResourceZoneMenuClick = ({ key }) => {
      const { objectSelected } = this.props
      const { networkEditObject } = MAPEDITOR
      const { resourceLimit, resourceWithdrawAmount } = objectSelected

      if(key === 'edit-withdraw-amount') {
        modals.editPropertyNumber(objectSelected, 'resourceWithdrawAmount', resourceWithdrawAmount)
      }

      if(key === 'edit-resource-limit') {
        modals.editPropertyNumber(objectSelected, 'resourceLimit', resourceLimit)
      }

      if(key === 'add-resource-tag') {
        modals.openSelectTag((result) => {
          if(result && result.value) {
            let resourceTags = objectSelected.resourceTags
            if(!resourceTags) resourceTags = {}
            resourceTags[Object.keys(window.allTags)[result.value]] = true
            networkEditObject(objectSelected, { resourceTags })
          }
        })
      }

      if(key.indexOf(removeResourceTagPrefix) === 0) {
        let tagToRemove = key.substr(removeResourceTagPrefix.length)

        objectSelected.resourceTags[tagToRemove] = false
        const resourceTags = objectSelected.resourceTags
        networkEditObject(objectSelected, { resourceTags })
      }
    }
  }

  render() {
    const { objectSelected } = this.props

    return <Menu onClick={this._handleResourceZoneMenuClick}>
      <MenuItem key="edit-withdraw-amount">Edit Withdraw Amount</MenuItem>
      <MenuItem key="edit-resource-limit">Edit Resource Limit</MenuItem>
      <SubMenu title="Resource Tags">
        {Object.keys(objectSelected.resourceTags || {}).map((tag) => {
          if(objectSelected.resourceTags[tag] === false) return null
          return <MenuItem key={`${removeResourceTagPrefix}${tag}`}>{'Remove ' + tag}</MenuItem>
        })}
        <MenuItem key="add-resource-tag">Add Resource Tag</MenuItem>
      </SubMenu>
    </Menu>
  }
}
