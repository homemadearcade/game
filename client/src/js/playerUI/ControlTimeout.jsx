import React from 'react'
import { Line } from 'rc-progress';

export default class ControlTimeout extends React.Component{
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this._popoverDataUpdate = setInterval(() => {
      this.forceUpdate()
    }, 60)
  }

  componentWillUnmount() {
    clearInterval(this._popoverDataUpdate)
  }

  render() {
    const { timeout } = this.props
    let percent = 100 - ((timeout.timeRemaining/timeout.totalTime) * 100)

    return <Line className="ControlsHUD__cooldown" percent={percent} strokeWidth="4" strokeColor="white" strokeLinecap="none"/>
  }
}
