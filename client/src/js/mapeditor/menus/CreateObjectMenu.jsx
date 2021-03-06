import React from 'react'
import Menu, { SubMenu, MenuItem } from 'rc-menu'
import modals from '../modals.js'

export default class CreateObject extends React.Component {
  constructor(props) {
    super(props)

    this._handleCreateObjectClick = ({ key }) => {
      const { objectSelected } = this.props

      if(key === 'select-from-library') {
        const library = global.objectLibrary.addGameLibrary()
        modals.openSelectFromList('Select an object', Object.keys(library), async (result) => {
          const id = result.value
          if(!id) return

          OBJECTS.create({...objectSelected, ...library[id]})
        })
      }


      if(key === 'create-obstacle') {
        OBJECTS.create({...objectSelected, tags: {obstacle: true}})
      }
      if(key === 'create-object') {
        OBJECTS.create({...objectSelected, tags: {}})
      }
      if(key === 'create-foreground') {
        OBJECTS.create({...objectSelected, tags: {foreground: true}})
      }
      if(key === 'create-background') {
        OBJECTS.create({...objectSelected, tags: {background: true}})
      }
      if(key === 'create-hidden') {
        OBJECTS.create({...objectSelected, tags: {hidden: true}})
      }
      if(key === 'create-invisible') {
        OBJECTS.create({...objectSelected, tags: {invisible: true}})
      }
      if(key === 'create-emitter') {
        OBJECTS.create({...objectSelected, opacity: 0, tags: { emitter: true}})
      }
      if(key === 'create-pickupable') {
        OBJECTS.create({...objectSelected, tags: { pickupable: true, pickupOnHeroInteract: true }})
      }
      if(key === 'create-infopop') {
        OBJECTS.create({...objectSelected, popoverText: 'Information', tags: {invisible: true}})
      }
      if(key === 'create-roof') {
        OBJECTS.create({...objectSelected, ...global.objectLibrary.roof})
      }
      if(key === 'create-tiling-sprite') {
        OBJECTS.create({...objectSelected, tags: { tilingSprite: true } })
      }
      if(key === 'create-light') {
        OBJECTS.create({...objectSelected, ...global.objectLibrary.light})
      }
      if(key === 'create-resource') {
        OBJECTS.create({...objectSelected, ...global.objectLibrary.resource})
      }
      if(key === 'create-resourceZone') {
        OBJECTS.create({...objectSelected, ...global.objectLibrary.resourceZone})
      }
      if(key === 'create-spawnZone') {
        OBJECTS.create({...objectSelected, ...global.objectLibrary.spawnZone})
      }
      if(key === 'create-chest') {
        OBJECTS.create({...objectSelected, ...global.objectLibrary.chest})
      }

    }
  }

  render() {
    return <Menu onClick={this._handleCreateObjectClick}>
      <MenuItem key={'select-from-library'}>Select from Library</MenuItem>
      <MenuItem key={'create-object'}>Object</MenuItem>
      <MenuItem key={'create-obstacle'}>Obstacle</MenuItem>
      <MenuItem key={'create-invisible'}>Invisible</MenuItem>
      <MenuItem key={'create-emitter'}>Emitter</MenuItem>
      <MenuItem key={'create-background'}>Background</MenuItem>
      <MenuItem key={'create-foreground'}>Foreground</MenuItem>
      <MenuItem key={'create-tiling-sprite'}>Tiling Sprite</MenuItem>
      <MenuItem key={'create-resourceZone'}>Resource Zone</MenuItem>
      <MenuItem key={'create-spawnZone'}>Spawn Zone</MenuItem>
      <MenuItem key={'create-resource'}>Resource</MenuItem>
      <MenuItem key={'create-infopop'}>Info Pop</MenuItem>
      <MenuItem key={'create-hidden'}>Hidden</MenuItem>
      <MenuItem key={'create-pickupable'}>Pickupable</MenuItem>
      <MenuItem key={'create-light'}>Light</MenuItem>
      <MenuItem key={'create-chest'}>Chest</MenuItem>

    </Menu>
  }
}
