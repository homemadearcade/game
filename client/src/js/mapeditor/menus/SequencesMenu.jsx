import React from 'react'
import Menu, { SubMenu, MenuItem } from 'rc-menu'
import modals from '../modals.js'

export default class Sequence extends React.Component{
  constructor(props) {
    super(props)

    this._handleSequenceClick = async ({ key }) => {
      const { objectSelected } = this.props
      const { networkEditObject } = MAPEDITOR

      if(key === "add-sequence") {
        if(!objectSelected.sequences) {
          objectSelected.sequences = {}
        }

        const name = window.getGlobalName()

        modals.openEditSequenceModal(name+'-'+objectSelected.id, (id) => {
          if(id.value && id.value != true) {
            objectSelected.sequences[name] = id.value
            networkEditObject(objectSelected, {sequences: objectSelected.sequences })
          }
        })
        return
      }

      const data = JSON.parse(key)

      if(data.action === "edit-set") {
        modals.openEditSequenceModal(objectSelected.sequences[data.name], (newId) => {
          if(newId.value && newId.value != true) {
            objectSelected.sequences[data.name] = newId.value
            networkEditObject(objectSelected, {sequences: objectSelected.sequences })
          }
        })
      }

      if(data.action === "rename-set") {
        const name = window.getGlobalName()
        
        const oldSet = objectSelected.sequences[data.name]
        objectSelected.sequences[data.name] = null
        objectSelected.sequences[name] = oldSet
        networkEditObject(objectSelected, {sequences: objectSelected.sequences })
        return
      }

      if(data.action === "remove-set") {
        objectSelected.sequences[data.name] = null
        networkEditObject(objectSelected, {sequences: objectSelected.sequences })
      }
    }
  }

  _renderSequence(sequence, name) {
    const { objectSelected } = this.props
    let render = []

    render.push(<MenuItem key={JSON.stringify({ action:"edit-set", name})}>Edit Sequence</MenuItem>)
    render.push(<MenuItem key={JSON.stringify({ action:"rename-set", name})}>Rename Sequence</MenuItem>)
    render.push(<MenuItem key={JSON.stringify({ action:"remove-set", name})}>Remove Sequence</MenuItem>)

    return render
  }

  render() {
    const { objectSelected } = this.props

    let sequences = objectSelected.sequences
    return <Menu onClick={this._handleSequenceClick}>
      <MenuItem key="add-sequence">Add Sequence</MenuItem>
      {sequences && Object.keys(sequences).map((sequenceName) => {
        if(!sequences[sequenceName]) return
        return <SubMenu key={sequenceName} title={sequenceName}>{this._renderSequence(sequences[sequenceName], sequenceName)}</SubMenu>
      })}
    </Menu>
  }
}
