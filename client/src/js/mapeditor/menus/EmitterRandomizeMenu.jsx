import React from 'react'
import Menu, { SubMenu, MenuItem } from 'rc-menu'
import modals from '../modals.js'

export default class EmitterMenu extends React.Component{
  constructor(props) {
    super(props)

    this._handleEmitterMenuClick = ({ key }) => {
      const { objectSelected } = this.props
      const { networkEditObject } = MAPEDITOR

      if(key === 'open-live-particle') {
        LIVEEDITOR.open(objectSelected, 'particle')
      }

      if(key === 'randomize-areaGlow-emitter') {
        global._generateRandomEmitter('areaGlow', objectSelected)
        networkEditObject(objectSelected, {emitterType: 'random-areaGlow' })
        return
      }

      if(key === 'randomize-explosion-emitter') {
        global._generateRandomEmitter('explosion', objectSelected)
        networkEditObject(objectSelected, {emitterTypeExplosion: 'random-explosion' })
        setTimeout(() => {
          global.local.emit('onObjectAnimation', 'explode', objectSelected.id)
        }, 400)
        return
      }

      if(key === 'play-explosion-emitter') {
        global.local.emit('onObjectAnimation', 'explode', objectSelected.id)
        return
      }

      if(key === 'randomize-laser-emitter') {
        global._generateRandomEmitter('laser', objectSelected)
        // networkEditObject(objectSelected, {emitterTypeAction: 'random-laser' })
        return
      }

      if(key === 'randomize-projectile-emitter') {
        global._generateRandomEmitter('projectile', objectSelected)
        return
      }

      if(key === 'randomize-powerup-emitter') {
        global._generateRandomEmitter('powerup', objectSelected)
        networkEditObject(objectSelected, {emitterTypePoweredUp: 'random-powerup' })
        return
      }
    }
  }

  render() {
    const { objectSelected } = this.props
    const action = objectSelected.actionButtonBehavior
    const hasLaser = action === 'shrink' || action === 'grow' || action === 'vacuum' && objectSelected.actionProps && objectSelected.actionProps && objectSelected.actionProps.emitterTypeAction == 'random-laser'
    const hasBullet = action === 'shoot' && objectSelected.actionProps && objectSelected.actionProps.bulletJSON && objectSelected.actionProps.bulletJSON.emitterType == 'random-projectile'
    return <Menu onClick={this._handleEmitterMenuClick}>
      {PAGE.role.isAdmin && objectSelected.tags.emitter && <MenuItem key="open-live-particle">Live Edit Emitter</MenuItem>}
      {objectSelected.tags.explodeOnDestroy && <MenuItem key="randomize-explosion-emitter">Randomize Explosion</MenuItem>}
      {objectSelected.tags.explodeOnDestroy && <MenuItem key="play-explosion-emitter">Play Explosion</MenuItem>}
      {objectSelected.tags.poweredUp && <MenuItem key="randomize-powerup-emitter">Randomize Power Up</MenuItem>}
      {objectSelected.tags.emitter && <MenuItem key="randomize-areaGlow-emitter">Randomize Area Glow</MenuItem>}
      {hasLaser && <MenuItem key="randomize-laser-emitter">Randomize Laser</MenuItem>}
      {hasBullet && <MenuItem key="randomize-projectile-emitter">Randomize Projectile</MenuItem>}
    </Menu>
  }
}
