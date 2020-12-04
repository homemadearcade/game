import React from 'react'
import Menu, { SubMenu, MenuItem } from 'rc-menu'
import modals from '../modals.js'

window.getListOfAllSetsAndSequences = function() {
  const map = {}
  return [...GAME.objects, ...GAME.heroList].reduce((prev, next) => {
    if(next.heroDialogueSets) {
      prev.push(...Object.keys(next.heroDialogueSets))
    }
    if(next.sequences) {
      prev.push(...Object.keys(next.sequences))
    }
    return prev
  }, []).filter((name) => {
    if(map[name]) return false
    else {
      map[name] = true
      return true
    }
  })
}

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

        const list = window.getListOfAllSetsAndSequences()

        list.unshift('New')

        let { value: name } = await Swal.fire({
          title: 'What is the name of this new dialogue set',
          showClass: {
            popup: 'animated fadeInDown faster'
          },
          hideClass: {
            popup: 'animated fadeOutUp faster'
          },
          input: 'select',
          inputOptions: list,
          preConfirm: (result) => {
            return list[result]
          }
        })

        if(name === 'New') {
          let { value: newName } = await Swal.fire({
            title: 'Add Dialogue Set',
            text: "What is the name of this dialogue set?",
            input: 'text',
            inputAttributes: {
              autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Next',
          })
          name = newName
        }

        if(!name) return

        objectSelected.heroDialogueSets[name] = {}
        objectSelected.heroDialogueSets[name].dialogue = [_.cloneDeep(window.defaultDialogue)]
        networkEditObject(objectSelected, {heroDialogueSets: objectSelected.heroDialogueSets })
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
          text: "What is the dialogue?",
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
          text: "What is the dialogue?",
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

      if(data.action === "rename-set") {
        const { value: name } = await Swal.fire({
          title: 'Rename Dialogue Set',
          text: "What is the new name?",
          input: 'text',
          inputAttributes: {
            autocapitalize: 'off'
          },
          showCancelButton: true,
          confirmButtonText: 'Ok',
        })

        const oldSet = objectSelected.heroDialogueSets[data.setName]
        objectSelected.heroDialogueSets[data.setName] = null
        objectSelected.heroDialogueSets[name] = oldSet
        networkEditObject(objectSelected, {heroDialogueSets: objectSelected.heroDialogueSets })
        return
      }

      if(data.action === "remove-set") {
        objectSelected.heroDialogueSets[data.setName] = null
        networkEditObject(objectSelected, {heroDialogueSets: objectSelected.heroDialogueSets })
      }

      if(data.action === "turn-into-sequence") {
        const { value: id } = await Swal.fire({
          title: 'Turn dialogue into a sequence',
          text: "What will the id of the sequence be?",
          input: 'text',
          inputAttributes: {
            autocapitalize: 'off'
          },
          showCancelButton: true,
          confirmButtonText: 'Ok',
        })

        const oldSet = objectSelected.heroDialogueSets[data.setName]
        objectSelected.heroDialogueSets[data.setName] = null
        objectSelected.sequences[data.setName] = id

        GAME.library.sequences[id] = {
          id,
          items: oldSet.dialogue.map((dialogueJSON, i) => {
            return {
              id: window.alphaarray[i],
              effectValue: 'dialogue',
              sequenceType: 'sequenceDialogue',
              effectJSON: [dialogueJSON],
              next: 'sequential'
            }
          })
        }
        window.socket.emit('updateLibrary', { sequences: GAME.library.sequences })

        networkEditObject(objectSelected, {heroDialogueSets: objectSelected.heroDialogueSets, sequences: objectSelected.sequences })
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

    render.push(<MenuItem key={JSON.stringify({ action:"rename-set", setName})}>Rename Set</MenuItem>)
    render.push(<MenuItem key={JSON.stringify({ action:"remove-set", setName})}>Remove Set</MenuItem>)
    if(PAGE.role.isAdmin) render.push(<MenuItem key={JSON.stringify({ action:"turn-into-sequence", setName})}>Turn into sequence</MenuItem>)

    return render
  }

  render() {
    const { objectSelected } = this.props

    let heroDialogueSets = objectSelected.heroDialogueSets
    return <Menu onClick={this._handleDialogueSetMenuClick}>
      <MenuItem key="add-dialogue-set">Add Dialogue Set</MenuItem>
      {objectSelected.heroDialogueSet && <MenuItem key="add-dialogue-set">Clear Dialogue Set</MenuItem>}
      {heroDialogueSets && Object.keys(heroDialogueSets).map((setName) => {
        if(!heroDialogueSets[setName]) return
        if(objectSelected.heroDialogueSet === setName) {
          return <SubMenu key={setName} title={setName} className="bold-menu-item">{this._renderDialogueSet(heroDialogueSets[setName], setName)}</SubMenu>
        } else {
          return <SubMenu key={setName} title={setName}>{this._renderDialogueSet(heroDialogueSets[setName], setName)}</SubMenu>
        }
      })}
    </Menu>
  }
}
