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
    const newKeys = Object.keys(this.state.tags).reduce((prev, curr) => {
      prev[curr] = false
      return prev
    }, {})

    if(!data) {
      this.setState({
        tags: newKeys
      })
      return
    }

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
        value={Object.keys(tags).map((desc) => {
          if(!tags[desc]) return null
          return { value: desc, label: desc}
        })}
        onChange={this._onChange}
        options={Object.keys(global.allTags).map(eventName => { return { value: eventName, label: eventName}})}
        styles={global.reactSelectStyle}
        theme={global.reactSelectTheme}/>
    </div>
  }

}
