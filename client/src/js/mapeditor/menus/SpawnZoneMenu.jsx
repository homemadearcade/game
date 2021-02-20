import React from 'react'
import Menu, { SubMenu, MenuItem } from 'rc-menu'
import modals from '../modals.js'
import SubObjectChanceMenu from './SubObjectChanceMenu.jsx'

export default class SpawnZoneMenu extends React.Component{
  constructor(props) {
    super(props)

    this._handleSpawnZoneMenuClick = ({ key }) => {
      const { objectSelected } = this.props
      const { spawnLimit, spawnPoolInitial, spawnWaitTimer } = objectSelected

      if(key === 'edit-spawn-limit') {
        modals.editPropertyNumber(objectSelected, 'spawnLimit', spawnLimit)
      }

      if(key === 'edit-spawn-pool-initial') {
        modals.editPropertyNumber(objectSelected, 'spawnPoolInitial', spawnPoolInitial)
      }

      if(key === 'edit-spawn-wait-timer') {
        modals.editPropertyNumber(objectSelected, 'spawnWaitTimer', spawnWaitTimer)
      }

      if(key === 'add-spawn-object') {
        modals.openNameSubObjectModal((result) => {
          if(result && result.value) {
            let subObjectChances = objectSelected.subObjectChances
            if(!subObjectChances)subObjectChances ={}
            global.socket.emit('editObjects', [{id: objectSelected.id, subObjectChances: {...subObjectChances, [result.value]: {randomWeight: 1, conditionList: null} } }])
          }
        })
      }

      if(key === 'add-subobject-library-spawn-object') {
        const library = global.subObjectLibrary.addGameLibrary()
        modals.openSelectFromList('Select a sub object', Object.keys(library), async (result) => {
          const id = result.value
          if(!id) return
          let subObjectChances = objectSelected.subObjectChances
          if(!subObjectChances)subObjectChances ={}
          global.socket.emit('editObjects', [{id: objectSelected.id, subObjectChances: {...subObjectChances, [id]: {randomWeight: 1, conditionList: null, spawnFromSubObjectLibrary:true} }}])
        })
      }

      if(key === 'add-object-library-spawn-object') {
        const library = global.objectLibrary.addGameLibrary()
        modals.openSelectFromList('Select an object', Object.keys(library), async (result) => {
          const id = result.value
          if(!id) return
          let subObjectChances = objectSelected.subObjectChances
          if(!subObjectChances)subObjectChances ={}
          global.socket.emit('editObjects', [{id: objectSelected.id, subObjectChances: {...subObjectChances, [id]: {randomWeight: 1, conditionList: null, spawnFromObjectLibrary:true} }}])
        })
      }


      if(key === 'spawn-all-now') {
        global.socket.emit('spawnAllNow', objectSelected.id)
      }

      if(key === 'destroy-spawned') {
        global.socket.emit('destroySpawnIds', objectSelected.id)
      }
    }
  }

  render() {
    const { objectSelected } = this.props
    const subObjectChanceNames = Object.keys(objectSelected.subObjectChances || {})

    return <Menu onClick={this._handleSpawnZoneMenuClick}>
      <MenuItem key="edit-spawn-pool-initial">Edit Initial Spawn Pool</MenuItem>
      {objectSelected.tags.spawnOnInterval && <MenuItem key="edit-spawn-wait-timer">Edit Spawn Wait Seconds</MenuItem>}
      {objectSelected.tags.spawnOnInterval && <MenuItem key="edit-spawn-limit">Edit Spawn Limit</MenuItem>}
      <SubMenu title="Spawn Objects">
        {subObjectChanceNames.map((subObjectName) => {
          const soChance = objectSelected.subObjectChances[subObjectName]
          if(soChance.spawnFromObjectLibrary) {
            return <SubMenu title={subObjectName + ' (Object Library)'}>
              <SubObjectChanceMenu objectSelected={objectSelected} subObjectName={subObjectName}></SubObjectChanceMenu>
            </SubMenu>
          } else if(soChance.spawnFromSubObjectLibrary) {
            return <SubMenu title={subObjectName + ' (SubObject Library)'}>
              <SubObjectChanceMenu objectSelected={objectSelected} subObjectName={subObjectName}></SubObjectChanceMenu>
            </SubMenu>
          } else {
            return <SubMenu title={subObjectName}>
              <SubObjectChanceMenu objectSelected={objectSelected} subObjectName={subObjectName}></SubObjectChanceMenu>
            </SubMenu>
          }
        })}
        <MenuItem key="add-spawn-object">Add Spawn Object</MenuItem>
        <MenuItem key="add-object-library-spawn-object">Add Spawn Object (Object Library)</MenuItem>
        <MenuItem key="add-subobject-library-spawn-object">Add Spawn Object (Subobject Library)</MenuItem>
      </SubMenu>
      <MenuItem key="spawn-all-now">Spawn All Now</MenuItem>
      <MenuItem key="destroy-spawned">Destroy Spawned</MenuItem>
    </Menu>
  }
}
