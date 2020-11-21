import React from 'react'

window.popoverProperties = [
  '_timeUntilDestroyed',
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

    if(object._timeUntilDestroyed) {
      render.push(<div className="Popover__countdown">
        {this._getFormattedTime(object._timeUntilDestroyed, true)}
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
