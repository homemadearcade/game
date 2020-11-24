import React from 'react'
import Menu, { SubMenu, MenuItem } from 'rc-menu'
import modals from '../modals.js'

export default class EmitterMenu extends React.Component{
  constructor(props) {
    super(props)

    this._handleEmitterMenuClick = ({ key }) => {
      const { objectSelected } = this.props
      const { networkEditObject } = MAPEDITOR

      if(key === 'select-particle-type') {
        modals.openSelectParticleAnimation((particle) => {
          networkEditObject(objectSelected, { emitterType: particle.value.type })
        })
      }

      if(key === 'clear-emitter-type') {
        networkEditObject(objectSelected, { emitterType: null })
      }

    }
  }

  render() {
    return <Menu onClick={this._handleEmitterMenuClick}>
      <MenuItem key="select-particle-type">Select Type</MenuItem>
      <MenuItem key="clear-emitter-type">Clear Type</MenuItem>
    </Menu>
  }
}
