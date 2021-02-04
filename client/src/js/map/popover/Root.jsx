import React from 'react'
import { Line } from 'rc-progress'
import PixiMapSprite from '../../components/PixiMapSprite.jsx'

global.popoverProperties = [
  { prop: '_timeUntilDestroyed', tag: 'popCountDownTimer'},
  'chat',
  { prop: 'count', tag: 'popCount'},
  { prop: 'resourceTags', tag: 'popResourceCount'},
  'popoverText'
]

global.popoverOpen = {}

export default class Popover extends React.Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  componentWillUnmount() {
    this._popoverDataUpdate()
    this._popoverDataUpdate2()
  }

  componentDidMount() {
    const { object } = this.props

    if(object._timeUntilDestroyed && object.mod().tags.popCountDownTimer) {
      this._timerUpdateInterval = setInterval(() => this.forceUpdate(), 60)
    }

    this._popoverDataUpdate = global.local.on('onNetworkUpdateObjects', (objectsUpdated) => {

      objectsUpdated.forEach((objectUpdated) => {
        if(objectUpdated.id === object.id) {
          let shouldUpdatePopover = false
          global.popoverProperties.forEach((prop) => {
            if(prop.tag) {
              if(objectUpdated[prop.prop] && objectUpdated.mod().tags && objectUpdated.mod().tags[prop.tag]) shouldUpdatePopover = true
            } else {
              if(objectUpdated[prop]) shouldUpdatePopover = true
            }
          })
          if(shouldUpdatePopover) this.forceUpdate()
        }
      })

    })

    this._popoverDataUpdate2 = global.local.on('onNetworkUpdateHero', (objectUpdated) => {
      if(objectUpdated.id === object.id) {
        let shouldUpdatePopover = false
        global.popoverProperties.forEach((prop) => {
          if(prop.tag) {
            if(objectUpdated[prop.prop] && objectUpdated.mod().tags && objectUpdated.mod().tags[prop.tag]) shouldUpdatePopover = true
          } else {
            if(objectUpdated[prop]) shouldUpdatePopover = true
          }
        })
        if(shouldUpdatePopover) this.forceUpdate()
      }
    })
  }

  componentWillUnmount() {
    if(this._timerUpdateInterval) clearInterval(this._timerUpdateInterval)
    this._popoverDataUpdate()
  }

  _getFormattedTime(time, micro) {
    time = time /1000
    if(time > 60) {
      return Math.floor(time/60) + ' minutes remaining'
    } else if(time > 0) {
      if(micro && time < 3) {
        return time + ' seconds remaining'
      }
      return Math.floor(time) + ' seconds remaining'
    }
  }

  _renderInformation() {
    const { object } = this.props

    let render = []

    if(object._timeUntilDestroyed && object.mod().tags.popCountDownTimer) {
      // label={this._getFormattedTime(object._timeUntilDestroyed)}
      let percent = ((object._timeUntilDestroyed - 100)/object._totalTimeUntilDestroyed) * 100
      if(percent < 0) percent = 0
      render.push(<div className="Popover__progress">
        <Line percent={percent} strokeWidth="4" strokeColor="red" strokeLinecap="none"/>
      </div>)
    }

    if(object.tags.popCount && object.count > 0) {
      render.push(<div className="Popover__resource">
        {object.inInventory && (!object.defaultSprite || object.defaultSprite == 'solidcolorsprite') && <div className="InventoryHUD__name">{object.name || object.subObjectName}</div>}
        {object.inInventory && object.defaultSprite !== 'solidcolorsprite' && <div className="InventoryHUD__sprite"><PixiMapSprite textureId={object.defaultSprite} width="20" height="20"/></div>}
        <div className="InventoryHUD__count">
          {object.count || 0}
        </div>
      </div>)
    }

    if(object.resourceTags) {
      let soName = global.getResourceSubObjectNames(object, object)
      if(soName) {
        let so = object.subObjects[soName]
        render.push(<div className="Popover__resource">
          {!so.defaultSprite || so.defaultSprite == 'solidcolorsprite' &&  <div className="InventoryHUD__name">{so.name || so.subObjectName}</div>}
          {so.defaultSprite !== 'solidcolorsprite' && <div className="InventoryHUD__sprite"><PixiMapSprite textureId={so.defaultSprite} width="20" height="20"/></div>}
          <div className="InventoryHUD__count">
            {so.count || 0}
            {object.resourceLimit >= 0 && ("/" + object.resourceLimit) }
          </div>
        </div>)
      }
    }

    if(object.popoverText) {
      render.push(object.popoverText)
    }

    if(object.chat) {
      render.push('"' + object.chat + '"')
    }

    return render
  }

  render() {
    return (
      <div className="Popover">
        {this._renderInformation()}
      </div>
    )
  }
}
