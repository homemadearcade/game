import React from 'react'
import Select from 'react-select'

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

    return <div className="ModalMultiSelect">
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
