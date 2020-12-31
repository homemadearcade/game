import React from 'react'
import ReactDOM from 'react-dom'
import Menu, { SubMenu, MenuItem } from 'rc-menu';
import modals from '../modals.js'
import CreateObjectMenu from '../menus/CreateObjectMenu.jsx';

export default class WorldContextMenu extends React.Component{
  constructor(props) {
    super(props)

    this._handleMapMenuClick = ({ key }) => {
      const { objectSelected, openColorPicker } = this.props

      if(key === 'add-obstacle') {
        OBJECTS.create({...objectSelected, tags: {obstacle: true}})
      }

      if(key === 'toggle-pause-game') {
        global.socket.emit('editGameState', { paused: !GAME.gameState.paused })
      }

      if(key === 'toggle-start-game') {
        if(GAME.gameState.started) {
          global.socket.emit('stopGame')
        } else {
          global.socket.emit('startGame')
        }
      }

      if(key === 'set-world-respawn-point') {
        global.socket.emit('updateWorld', {worldSpawnPointX: objectSelected.x, worldSpawnPointY:  objectSelected.y})
      }

      if(key === 'select-world-background-color') {
        openColorPicker('worldBackground')
      }
      if(key === 'select-world-overlay-color') {
        openColorPicker('worldOverlay')
      }
      if(key === 'select-default-object-color') {
        openColorPicker('defaultObject')
      }

      if(key === 'open-sequence-editor') {
        BELOWMANAGER.open({ selectedManager: 'GameManager', selectedMenu: 'sequence'})
      }

      if(key === 'download-game-JSON')  {
        let saveGame = GAME.cleanForSave(GAME)
        console.log(saveGame)
        PAGE.downloadObjectAsJson(saveGame, GAME.id)
      }
    }
  }

  _renderAdvancedWorldMenu() {
    const { objectSelected } = this.props

    return <SubMenu title="Advanced">
      <MenuItem key='download-game-JSON'>Download Game JSON</MenuItem>
      <MenuItem key='open-sequence-editor'>Open Sequence Editor</MenuItem>
    </SubMenu>
  }

  render() {
    const { objectSelected } = this.props

    return <Menu onClick={this._handleMapMenuClick}>
      <SubMenu title="Create Object">
        <CreateObjectMenu objectSelected={objectSelected}/>
      </SubMenu>
      <MenuItem key="add-obstacle">Create Obstacle (Quick)</MenuItem>
      <MenuItem key='set-world-respawn-point'>Set as world respawn point</MenuItem>
      <MenuItem className='dont-close-menu' key='select-world-background-color'>Set background color</MenuItem>
      <MenuItem className='dont-close-menu' key='select-world-overlay-color'>Set overlay color</MenuItem>
      <MenuItem className='dont-close-menu' key='select-default-object-color'>Set default object color</MenuItem>
      <MenuItem key='toggle-start-game'>{ GAME.gameState.started ? 'Stop Game' : 'Start Game' }</MenuItem>
    </Menu>
  }
}
