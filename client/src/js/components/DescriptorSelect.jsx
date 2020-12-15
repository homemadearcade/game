import React from 'react'
import Select from 'react-select'
import PixiMapSprite from './PixiMapSprite.jsx'

export default class DescriptorSelect extends React.Component{
  constructor(props) {
    super(props)

    this.state = {
      descriptors: _.cloneDeep(props.initialDescriptors)
    }
  }

  getDescriptorsObject() {
    return this.state.descriptors
  }

  _onChange = (data) => {

    const newKeys = {}

    data.forEach((item, i) => {
      newKeys[item.label] = true
    });

    this.setState({
      descriptors: newKeys
    })
  }

  render() {
    const { descriptors } = this.state

    console.log(this.props.textureIds)
    return <div className="ModalMultiSelect">
      <div className="SpriteSheet">{this.props.textureIds && Object.keys(this.props.textureIds).map((textureId) => {
        return <div className="SpriteContainer">
          <PixiMapSprite width="40" height="40" textureId={textureId}></PixiMapSprite>
        </div>
      })}</div>
      <Select
        isMulti
        value={Object.keys(descriptors).map((desc) => { return { value: desc, label: desc} })}
        onChange={this._onChange}
        options={Object.keys(window.allDescriptors).map(eventName => { return { value: eventName, label: eventName}})}
        styles={window.reactSelectStyle}
        theme={window.reactSelectTheme}/>
    </div>
  }

}
