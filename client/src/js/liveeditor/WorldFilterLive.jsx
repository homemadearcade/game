import React from 'react';
import DatGui, { DatBoolean, DatButton, DatFolder, DatColor, DatNumber, DatString, DatSelect } from 'react-dat-gui';

export default class WorldLive extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      world: GAME.world
    }
    this.handleUpdate = _.debounce(this.handleUpdate.bind(this), 100)
  }

  // Update current state with changes from controls
  handleUpdate(newData) {
    const { world } = this.state

    this.setState({
      ...newData
    })

    global.socket.emit('updateWorld', { ...newData.world })
  }

  render() {

    //          <DatColor label="Object Tint" path="world.objectColorTint"/>

    return (
      <div className='WorldFilterLive'>
          <DatGui data={this.state} onUpdate={this.handleUpdate}>
          <div className="LiveEditor__title">{'World Filters'}</div>
          <DatColor label="Background Color" path="world.backgroundColor"/>
          <DatColor label="Overlay Color" path="world.overlayColor"/>
        </DatGui>
      </div>
    )
  }
}
