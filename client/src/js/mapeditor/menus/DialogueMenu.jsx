import React from 'react'
import Menu, { SubMenu, MenuItem } from 'rc-menu'
import modals from '../modals.js'

export default class DialogueMenu extends React.Component{
  constructor(props) {
    super(props)

    this._handleDialogueMenuClick = async ({ key }) => {
      const { objectSelected } = this.props
      const { networkEditObject } = MAPEDITOR

      if(key === "add-dialogue") {
        if(!objectSelected.heroDialogueSets['default']) {
          objectSelected.heroDialogueSets['default'] = {}
        }
        if(!objectSelected.heroDialogueSets['default'].dialogue) {
          objectSelected.heroDialogueSets['default'].dialogue = []
        }
        const { value: dialogue } = await Swal.fire({
          title: 'Edit Dialogue',
          text: "What is the dialogue?",
          input: 'text',
          inputAttributes: {
            autocapitalize: 'off'
          },
          showCancelButton: true,
          confirmButtonText: 'Next',
        })
        if(!dialogue) return

        objectSelected.heroDialogueSets['default'].dialogue.push({...global.defaultDialogue, text: dialogue})
        networkEditObject(objectSelected, {heroDialogueSets: objectSelected.heroDialogueSets })
        return
      }

      const data = JSON.parse(key)

      if(data.action == "remove-dialogue") {
        let dialogueIndex = data.index
        objectSelected.heroDialogueSets['default'].dialogue.splice(dialogueIndex, 1)
        networkEditObject(objectSelected, {heroDialogueSets: objectSelected.heroDialogueSets})
      }

      if(data.action == "edit-dialogue") {
        let dialogueIndex = data.index
        const { value: dialogue } = await Swal.fire({
          title: 'Edit Dialogue',
          text: "What is the dialogue?",
          input: 'text',
          inputAttributes: {
            autocapitalize: 'off'
          },
          inputValue: objectSelected.heroDialogueSets['default'].dialogue[dialogueIndex].text,
          showCancelButton: true,
          confirmButtonText: 'Next',
        })
        if(!dialogue) return
        objectSelected.heroDialogueSets['default'].dialogue[dialogueIndex].text = dialogue
        networkEditObject(objectSelected, {heroDialogueSets: objectSelected.heroDialogueSets})
      }
    }
  }

  render() {
    const { objectSelected } = this.props

    return <Menu onClick={this._handleDialogueMenuClick}>
      <MenuItem key="add-dialogue">Add Dialogue</MenuItem>
      {objectSelected.heroDialogueSets && objectSelected.heroDialogueSets.default && objectSelected.heroDialogueSets.default.dialogue && objectSelected.heroDialogueSets.default.dialogue.map((dialogue, i) => {
        return <MenuItem key={JSON.stringify({ action:"edit-dialogue", index: i})}>{'Edit Dialogue ' + (i+1)}</MenuItem>
      })}
      {objectSelected.heroDialogueSets && objectSelected.heroDialogueSets.default && objectSelected.heroDialogueSets.default.dialogue && objectSelected.heroDialogueSets.default.dialogue.map((dialogue, i) => {
        return <MenuItem key={JSON.stringify({ action:"remove-dialogue", index: i})}>{'Remove Dialogue ' + (i+1)}</MenuItem>
      })}
    </Menu>
  }
}
