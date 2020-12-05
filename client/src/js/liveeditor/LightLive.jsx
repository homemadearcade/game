import React from 'react';
import DatGui, { DatBoolean, DatColor, DatNumber, DatString } from 'react-dat-gui';

export default class LightLive extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      objectSelected: this.props.objectSelected
    }
    this.handleUpdate = _.debounce(this.handleUpdate.bind(this), 100)
  }

  // Update current state with changes from controls
  handleUpdate(newData) {
    const { objectSelected } = this.state
    const id = objectSelected.id

    this.setState({
      objectSelected: { ...objectSelected, ...newData }
    })

    const updatedProps = {
      lightPower: newData.lightPower,
      lightColor: newData.lightColor,
      lightOpacity: newData.lightOpacity,
      ambientLight: newData.ambientLight
    }


    if (objectSelected.tags.hero) {
      window.socket.emit('editHero', { id, ...updatedProps })
      // }
      // else if(objectSelected.tags.subObject) {
      // window.socket.emit('editSubObject', objectSelected.ownerId, objectSelected.subObjectName, updatedProps)
    } else {
      window.socket.emit('editObjects', [{ id, ...updatedProps }])
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.objectSelected.id !== prevState.objectSelected.id) {
      return { objectSelected: nextProps.objectSelected };
    }
    else return null;
  }

  render() {
    const { objectSelected } = this.state;

    return (
      <div className='LightLive'>
        <DatGui data={objectSelected} onUpdate={this.handleUpdate}>
          <div className="LiveEditor__title">{'Light'}</div>
          <DatColor path='lightColor' label='Color' />
          <DatNumber path='lightPower' label="Power" min={0} max={100} step={.1} />
          <DatNumber path='lightOpacity' label="Opacity" min={0} max={1} step={.1} />
          <div className="LiveEditor__title">{'Dark Area'}</div>
          <DatNumber path='ambientLight' label="Ambient Light" min={0} max={1} step={.1}/>
        </DatGui>
      </div>
    )
  }
}
