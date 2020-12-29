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
    const newKeys = Object.keys(this.state.descriptors).reduce((prev, curr) => {
      prev[curr] = false
      return prev
    }, {})

    if(!data) {
      this.setState({
        descriptors: newKeys
      })
      return
    }

    data.forEach((item, i) => {
      newKeys[item.label] = true
    });

    this.setState({
      descriptors: newKeys
    })
  }

  render() {
    const { descriptors } = this.state
    const { onlyAvailable } = this.props

    let descriptorsAvailable = global.allDescriptors
    if(onlyAvailable) descriptorsAvailable = global.textureIdsByDescriptor
    console.log(descriptors)

    return <div className="ModalMultiSelect">
      <div className="SpriteSheet">{this.props.textureIds && Object.keys(this.props.textureIds).map((textureId) => {
        return <div className="SpriteContainer">
          <PixiMapSprite width="40" height="40" textureId={textureId}></PixiMapSprite>
        </div>
      })}</div>
      <Select
        isMulti
        value={Object.keys(descriptors).map((desc) => {
          if(!descriptors[desc]) return null
          return { value: desc, label: desc}
        })}
        onChange={this._onChange}
        options={Object.keys(descriptorsAvailable).map(eventName => { return { value: eventName, label: eventName}})}
        styles={global.reactSelectStyle}
        theme={global.reactSelectTheme}/>
    </div>
  }

}
