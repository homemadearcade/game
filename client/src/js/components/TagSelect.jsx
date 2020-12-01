import React from 'react'
import Select from 'react-select'

export default class TagSelect extends React.Component{
  constructor(props) {
    super(props)

    this.state = {
      tags: _.cloneDeep(props.initialTags)
    }
  }

  getTagsObject() {
    return this.state.tags
  }

  _onChange = (data) => {

    const newKeys = {}

    data.forEach((item, i) => {
      newKeys[item.label] = true
    });

    this.setState({
      tags: newKeys
    })
  }

  render() {
    const { tags } = this.state

    return <div className="ModalMultiSelect">
      <Select
        isMulti
        value={Object.keys(tags).map((desc) => { return { value: desc, label: desc} })}
        onChange={this._onChange}
        options={Object.keys(window.allTags).map(eventName => { return { value: eventName, label: eventName}})}
        styles={window.reactSelectStyle}
        theme={window.reactSelectTheme}/>
    </div>
  }

}