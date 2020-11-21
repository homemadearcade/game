import React from 'react'
import { Line } from 'rc-progress'

window.popoverProperties = [
  { prop: '_timeUntilDestroyed', tag: 'showCountDownTimer'},
  'chat'
]

window.popoverOpen = {}

export default class Popover extends React.Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  componentDidMount() {
    this._popoverDataUpdate = setInterval(() => {
      this.forceUpdate()
    }, 60)
  }

  componentWillUnmount() {
    clearInterval(this._popoverDataUpdate)
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

    if(object._timeUntilDestroyed && object.mod().tags.showCountDownTimer) {
      // label={this._getFormattedTime(object._timeUntilDestroyed)}
      let percent = ((object._timeUntilDestroyed - 100)/object._totalTimeUntilDestroyed) * 100
      if(percent < 0) percent = 0
      render.push(<div className="Popover__progress">
        <Line percent={percent} strokeWidth="4" strokeColor="red" strokeLinecap="none"/>
      </div>)
    }

    if(object.chat) {
      render.push(object.chat)
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
