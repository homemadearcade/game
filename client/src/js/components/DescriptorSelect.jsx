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
      newKeys[item.value] = true
    });

    this.setState({
      descriptors: newKeys
    })
  }

  render() {
    const { descriptors } = this.state
    const { options } = this.props

    let filterAdmin = false
    let descriptorsAvailable = global.allDescriptors
    if(options.onlyWithTextures) descriptorsAvailable = global.textureIdsByDescriptor
    else filterAdmin = true

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
        options={Object.keys(descriptorsAvailable).map(desc => {
          if(filterAdmin && descriptorsAvailable[desc].dontShowAdminsInSpriteSheetEditor) return
          if(global.allModifiers[desc]) {
            if(global.allModifiers[desc].searchable) {
              if(PAGE.role.isAdmin) return { value: desc, label: desc + "**"}
            } else {
              return { value: desc, label: desc + "*"}
            }
          }
          return { value: desc, label: desc}
        }).filter((opt) => !!opt)}
        styles={global.reactSelectStyle}
        theme={global.reactSelectTheme}/>
    </div>
  }

}
