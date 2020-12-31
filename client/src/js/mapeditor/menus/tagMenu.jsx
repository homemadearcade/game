import React from 'react'
import Menu, { SubMenu, MenuItem } from 'rc-menu';
import modals from '../modals.js'

export default class TagMenu extends React.Component{
  constructor(props) {
    super(props)

    this._handleTagMenuClick = ({ key }) => {
      const { objectSelected } = this.props;
      const { networkEditObject } = MAPEDITOR

      if(key === 'open-search-modal') {
        Object.keys(objectSelected.tags).forEach((tag) => {
          if(!objectSelected.tags[tag]) delete objectSelected.tags[tag]
        })
        modals.openEditTagsModal(objectSelected.tags || {}, ({value}) => {
          if(value) {
            networkEditObject(objectSelected, {tags: value})
          }
        })
        return
      }

      const newValue = !this.state.localTags[key]
      this.setState({ localTags: {
        ...this.state.localTags,
        [key]: newValue
      }})

      networkEditObject(objectSelected, { tags: { [key]: newValue }})
    }

    this.state = {
      localTags: this.props.objectSelected.tags
    }
  }

  _renderTagMenuItems(tags) {
    const { objectSelected } = this.props
    const { localTags } = this.state

    const tagList = Object.keys(tags)
    return tagList.map((tag) => {
      if(localTags[tag]) {
        return <MenuItem className='dont-close-menu' key={tag}>{tag}<i style={{marginLeft:'6px'}} className="fas fa-check"></i></MenuItem>
      } else {
        return <MenuItem className='dont-close-menu' key={tag}>{tag}</MenuItem>
      }
    })
  }

  render() {
    const { subObject, objectSelected } = this.props

    // <SubMenu title="Behavior">
    //   {this._renderTagMenuItems(global.behaviorTags)}
    // </SubMenu>

    return <Menu onClick={this._handleTagMenuClick}>
      <MenuItem key='open-search-modal'>Open Search Modal</MenuItem>
      <SubMenu title="Physics">
        {this._renderTagMenuItems(global.physicsTags)}
      </SubMenu>
      <SubMenu title="Movement">
        {this._renderTagMenuItems(global.movementTags)}
      </SubMenu>
      <SubMenu title="Target">
        {this._renderTagMenuItems(global.targetTags)}
      </SubMenu>
      <SubMenu title="Path">
        {this._renderTagMenuItems(global.pathTags)}
      </SubMenu>
      <SubMenu title="Hero Update">
        {this._renderTagMenuItems(global.heroUpdateTags)}
      </SubMenu>
      <SubMenu title="Quest">
        {this._renderTagMenuItems(global.questTags)}
      </SubMenu>
      <SubMenu title="Dialogue">
        {this._renderTagMenuItems(global.dialogueTags)}
      </SubMenu>
      <SubMenu title="Combat">
        {this._renderTagMenuItems(global.combatTags)}
      </SubMenu>
      <SubMenu title="Spawn Zone">
        {this._renderTagMenuItems(global.spawnZoneTags)}
      </SubMenu>
      <SubMenu title="Resource Zone">
        {this._renderTagMenuItems(global.resourceZoneTags)}
      </SubMenu>
      <SubMenu title="Graphical">
        {this._renderTagMenuItems(global.graphicalTags)}
      </SubMenu>
      <SubMenu title="Camera">
        {this._renderTagMenuItems(global.cameraTags)}
      </SubMenu>
      <SubMenu title="Particle">
        {this._renderTagMenuItems(global.particleTags)}
      </SubMenu>
      <SubMenu title="Animation">
        {this._renderTagMenuItems(global.animationTags)}
      </SubMenu>
      <SubMenu title="Inventory">
        {this._renderTagMenuItems(global.inventoryTags)}
      </SubMenu>
      {subObject && <SubMenu title="Sub Object">
        {this._renderTagMenuItems(global.subObjectTags)}
      </SubMenu>}
      {objectSelected.tags.hero && <SubMenu title="Hero">
        {this._renderTagMenuItems(global.defaultHeroTags)}
      </SubMenu>}
      <SubMenu title="Optimization">
        {this._renderTagMenuItems(global.featureOptimizationTags)}
      </SubMenu>
      <SubMenu title="Popover">
        {this._renderTagMenuItems(global.popoverTags)}
      </SubMenu>
      <SubMenu title="Effect">
        {this._renderTagMenuItems(global.effectTags)}
      </SubMenu>
    </Menu>
  }
}
