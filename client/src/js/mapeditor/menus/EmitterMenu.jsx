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

      if(key === 'select-particle-type-explosion') {
        modals.openSelectParticleAnimation((particle) => {
          networkEditObject(objectSelected, { emitterTypeExplosion: particle.value.type })
        })
      }
      //
      // if(key === 'clear-emitter-type-explosion') {
      //   networkEditObject(objectSelected, { emitterTypeExplosion: null })
      // }


      if(key === 'select-particle-type-poweredup') {
        modals.openSelectParticleAnimation((particle) => {
          networkEditObject(objectSelected, { emitterTypePoweredUp: particle.value.type })
        })
      }

      // if(key === 'clear-emitter-type-poweredup') {
      //   networkEditObject(objectSelected, { emitterTypePoweredUp: null })
      // }

      if(key === 'select-particle-type-jump') {
        modals.openSelectParticleAnimation((particle) => {
          networkEditObject(objectSelected, { emitterTypeJump: particle.value.type })
        })
      }

      if(key === 'select-particle-type-dash') {
        modals.openSelectParticleAnimation((particle) => {
          networkEditObject(objectSelected, { emitterTypeDash: particle.value.type })
        })
      }

      if(key === 'select-particle-type-action') {
        modals.openSelectParticleAnimation((particle) => {
          networkEditObject(objectSelected, { emitterTypeAction: particle.value.type })
        })
      }

      if (key === "open-live-editor") {
        LIVEEDITOR.open(objectSelected, 'particle')
      }

      if(key === 'reset-emitters') {
        window.socket.emit('resetLiveParticle', objectSelected.id)
      }
    }
  }

  render() {
    const { objectSelected } = this.props
    return <Menu onClick={this._handleEmitterMenuClick}>
      <MenuItem key="open-live-editor">Open Live Editor</MenuItem>
      <MenuItem key="select-particle-type">Select Default Type</MenuItem>
      <MenuItem key="clear-emitter-type">Clear Default Type</MenuItem>
      {objectSelected.actionButtonBehavior && <MenuItem key="select-particle-type-action">Select Action Type</MenuItem>}
      {objectSelected.tags.explodeOnDestroy && <MenuItem key="select-particle-type-explosion">Select Explosion Type</MenuItem>}
      <MenuItem key="select-particle-type-poweredup">Select Powered Up Type</MenuItem>
      <MenuItem key="reset-emitters">Reset Emitters</MenuItem>
    </Menu>
  }
}
