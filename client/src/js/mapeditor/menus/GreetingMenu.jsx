import React from 'react'
import Menu, { SubMenu, MenuItem } from 'rc-menu'
import modals from '../modals.js'

export default class GreetingMenu extends React.Component{
  constructor(props) {
    super(props)

    this._handleGreetingMenuClick = async ({ key }) => {
      const { objectSelected } = this.props
      const { networkEditObject } = MAPEDITOR

      if(key === "add-dialogue") {
        if(!objectSelected.heroDialogueSets['greeting']) {
          objectSelected.heroDialogueSets['greeting'] = {}
        }
        if(!objectSelected.heroDialogueSets['greeting'].dialogue) {
          objectSelected.heroDialogueSets['greeting'].dialogue = []
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

        objectSelected.heroDialogueSets['greeting'].dialogue.push({...window.greetingDialogue, text: dialogue})
        networkEditObject(objectSelected, {heroDialogueSets: objectSelected.heroDialogueSets })
        return
      }

      const data = JSON.parse(key)

      if(data.action == "remove-dialogue") {
        let dialogueIndex = data.index
        objectSelected.heroDialogueSets['greeting'].dialogue.splice(dialogueIndex, 1)
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
          inputValue: objectSelected.heroDialogueSets['greeting'].dialogue[dialogueIndex].text,
          showCancelButton: true,
          confirmButtonText: 'Next',
        })
        if(!dialogue) return
        objectSelected.heroDialogueSets['greeting'].dialogue[dialogueIndex].text = dialogue
        networkEditObject(objectSelected, {heroDialogueSets: objectSelected.heroDialogueSets})
      }
    }
  }

  render() {
    const { objectSelected } = this.props

    return <Menu onClick={this._handleGreetingMenuClick}>
      <MenuItem key="add-dialogue">Add Dialogue</MenuItem>
      {objectSelected.heroDialogueSets && objectSelected.heroDialogueSets.greeting && objectSelected.heroDialogueSets.greeting.dialogue && objectSelected.heroDialogueSets.greeting.dialogue.map((dialogue, i) => {
        return <MenuItem key={JSON.stringify({ action:"edit-dialogue", index: i})}>{'Edit Dialogue ' + (i+1)}</MenuItem>
      })}
      {objectSelected.heroDialogueSets && objectSelected.heroDialogueSets.greeting && objectSelected.heroDialogueSets.greeting.dialogue && objectSelected.heroDialogueSets.greeting.dialogue.map((dialogue, i) => {
        return <MenuItem key={JSON.stringify({ action:"remove-dialogue", index: i})}>{'Remove Dialogue ' + (i+1)}</MenuItem>
      })}
    </Menu>
  }
}
