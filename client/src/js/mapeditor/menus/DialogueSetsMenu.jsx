import React from 'react'
import Menu, { SubMenu, MenuItem } from 'rc-menu'
import modals from '../modals.js'

export default class DialogueSetMenu extends React.Component{
  constructor(props) {
    super(props)

    this._handleDialogueSetMenuClick = async ({ key }) => {
      const { objectSelected } = this.props
      const { networkEditObject } = MAPEDITOR


      if(key === "add-dialogue-set") {
        if(!objectSelected.heroDialogueSets) {
          objectSelected.heroDialogueSets = {}
        }
        const { value: name } = await Swal.fire({
          title: 'Add Dialogue Set',
          text: "What is the name of this dialogue set?",
          input: 'text',
          inputAttributes: {
            autocapitalize: 'off'
          },
          showCancelButton: true,
          confirmButtonText: 'Next',
        })
        if(!name) return

        objectSelected.heroDialogueSets[name] = {}
        objectSelected.heroDialogueSets[name].dialogue = [_.cloneDeep(window.defaultDialogue)]
        networkEditObject(objectSelected, {heroDialogueSets: objectSelected.heroDialogueSets })
        return
      }

      if(key === "set-dialogue-set") {
        const { value: name } = await Swal.fire({
          title: 'Add Dialogue Set',
          text: "Set the dialogue of this object to which dialogue set?",
          input: 'text',
          inputAttributes: {
            autocapitalize: 'off'
          },
          showCancelButton: true,
          confirmButtonText: 'Next',
        })
        if(!name) return
        networkEditObject(objectSelected, {heroDialogueSet: name })
        return
      }

      const data = JSON.parse(key)

      if(data.action === "add-dialogue") {
        if(!objectSelected.heroDialogueSets[data.setName]) {
          objectSelected.heroDialogueSets[data.setName] = {}
        }
        if(!objectSelected.heroDialogueSets[data.setName].dialogue) {
          objectSelected.heroDialogueSets[data.setName].dialogue = []
        }
        const { value: dialogue } = await Swal.fire({
          title: 'Edit Dialogue',
          text: "What does this object say?",
          input: 'text',
          inputAttributes: {
            autocapitalize: 'off'
          },
          showCancelButton: true,
          confirmButtonText: 'Next',
        })
        if(!dialogue) return

        objectSelected.heroDialogueSets[data.setName].dialogue.push({...window.defaultDialogue, text: dialogue})
        networkEditObject(objectSelected, {heroDialogueSets: objectSelected.heroDialogueSets })
        return
      }

      if(data.action == "remove-dialogue") {
        let dialogueIndex = data.index
        objectSelected.heroDialogueSets[data.setName].dialogue.splice(dialogueIndex, 1)
        networkEditObject(objectSelected, {heroDialogueSets: objectSelected.heroDialogueSets})
      }

      if(data.action == "edit-dialogue") {
        let dialogueIndex = data.index
        const { value: dialogue } = await Swal.fire({
          title: 'Edit Dialogue',
          text: "What does this object say?",
          input: 'text',
          inputAttributes: {
            autocapitalize: 'off'
          },
          inputValue: objectSelected.heroDialogueSets[data.setName].dialogue[dialogueIndex].text,
          showCancelButton: true,
          confirmButtonText: 'Next',
        })
        if(!dialogue) return
        objectSelected.heroDialogueSets[data.setName].dialogue[dialogueIndex].text = dialogue
        networkEditObject(objectSelected, {heroDialogueSets: objectSelected.heroDialogueSets})
      }

      if(data.action === "set-as-current") {
        networkEditObject(objectSelected, {heroDialogueSet: data.setName })
        return
      }
    }
  }

  _renderDialogueSet(set, setName) {
    const { objectSelected } = this.props
    let render = []

    if(objectSelected.heroDialogueSet === setName) {
      render.push(<MenuItem key={JSON.stringify({ action:"set-as-current", setName})}>Set as current set<i style={{marginLeft:'6px'}} className="fas fa-check"></i></MenuItem>)
    } else {
      render.push(<MenuItem key={JSON.stringify({ action:"set-as-current", setName})}>Set as current set</MenuItem>)
    }

    render.push(<MenuItem key={JSON.stringify({ action:"add-dialogue", setName})}>Add Dialogue</MenuItem>)

    {set.dialogue.map((dialogue, i) => {
      render.push(<MenuItem key={JSON.stringify({ action:"edit-dialogue", index: i, setName})}>{'Edit Dialogue ' + (i+1)}</MenuItem>)
    })}
    {set.dialogue.map((dialogue, i) => {
      render.push(<MenuItem key={JSON.stringify({ action:"remove-dialogue", index: i, setName})}>{'Remove Dialogue ' + (i+1)}</MenuItem>)
    })}
    return render
  }

  render() {
    const { objectSelected } = this.props

    let heroDialogueSets = objectSelected.heroDialogueSets
    return <Menu onClick={this._handleDialogueSetMenuClick}>
      <MenuItem key="add-dialogue-set">Add Dialogue Set</MenuItem>
      <MenuItem key="set-dialogue-set">Set Current Dialogue Set</MenuItem>
      {heroDialogueSets && Object.keys(heroDialogueSets).map((setName) => {
        if(objectSelected.heroDialogueSet === setName) {
          return <SubMenu key={setName} title={setName} className="bold-menu-item">{this._renderDialogueSet(heroDialogueSets[setName], setName)}</SubMenu>
        } else {
          return <SubMenu key={setName} title={setName}>{this._renderDialogueSet(heroDialogueSets[setName], setName)}</SubMenu>
        }
      })}
    </Menu>
  }
}
