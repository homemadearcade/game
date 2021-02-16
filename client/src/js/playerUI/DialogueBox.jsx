import React from 'react'
import { Textfit } from 'react-textfit';
import classnames from 'classnames';
import KeySprite from './KeySprite.jsx';
import PixiMapSprite from '../components/PixiMapSprite.jsx'

global.defaultDialogue = {
  reverseSpeaker: false,
  dialogueId: null,//‘??’ <— this is for onHeroDialogueComplete event
  text: 'hello',
  style: 'modal'//‘modal vs bottom’
}

export default class DialogueBox extends React.Component{
  constructor(props) {
    super(props)

    this.state = {
      selectedOptionIndex: 0,
    }

    if(this.props.options) {
      global.addEventListener('keydown', this._onKeyDown)
    }
  }

  componentWillUnmount() {
    if(this.props.options) {
      global.removeEventListener('keydown', this._onKeyDown)
    }
  }

  _onKeyDown = (e) => {
    const { selectedOptionIndex } = this.state;
    if(e.keyCode == 40) {
      if((selectedOptionIndex + 1) == this.props.options.length) {
        this.setState({
          selectedOptionIndex: 0
        })
      } else {
        this.setState({
          selectedOptionIndex: selectedOptionIndex + 1
        })
      }
    }

    if(e.keyCode == 38) {
      if(selectedOptionIndex == 0) {
        this.setState({
          selectedOptionIndex: this.props.options.length-1
        })
      } else {
        this.setState({
          selectedOptionIndex: selectedOptionIndex - 1
        })
      }
    }

    if(e.keyCode == 86 || e.keyCode == 69 || e.keyCode == 13) {
      global.socket.emit('heroChooseOption', HERO.id, this.props.options[selectedOptionIndex].id)
    }

    if(e.keyCode == 27) {
      global.socket.emit('heroChooseOption', HERO.id, null)
    }

    if(e.keyCode == 49 && this.props.options[0]) {
      global.socket.emit('heroChooseOption', HERO.id, this.props.options[0].id)
    }
    if(e.keyCode == 50 && this.props.options[1]) {
      global.socket.emit('heroChooseOption', HERO.id, this.props.options[1].id)
    }
    if(e.keyCode == 51 && this.props.options[2]) {
      global.socket.emit('heroChooseOption', HERO.id, this.props.options[2].id)
    }
    if(e.keyCode == 52 && this.props.options[3]) {
      global.socket.emit('heroChooseOption', HERO.id, this.props.options[3].id)
    }
    if(e.keyCode == 53 && this.props.options[4]) {
      global.socket.emit('heroChooseOption', HERO.id, this.props.options[4].id)
    }
    if(e.keyCode == 54 && this.props.options[5]) {
      global.socket.emit('heroChooseOption', HERO.id, this.props.options[5].id)
    }
    if(e.keyCode == 55 && this.props.options[6]) {
      global.socket.emit('heroChooseOption', HERO.id, this.props.options[6].id)
    }
    if(e.keyCode == 56 && this.props.options[7]) {
      global.socket.emit('heroChooseOption', HERO.id, this.props.options[6].id)
    }
  }

  _renderSprite(item) {
    if(item.sprites && item.sprites.UI) {
      return <div className="DialogueBox__sprite"><PixiMapSprite width="50" height="50" textureId={item.sprites.UI}/></div>
    } else if(item.tags.invisible || item.tags.outline || item.defaultSprite === 'invisible') {
      return <div className="DialogueBox__sprite DialogueBox__sprite--box"/>
    } else if(item.defaultSprite == 'solidcolorsprite'){
      return <div className="DialogueBox__sprite" style={{background: item.color || GAME.world.defaultObjectColor || global.defaultObjectColor}}/>
    } else if(item.defaultSprite) {
      return <div className="DialogueBox__sprite"><PixiMapSprite width="50" height="50" textureId={item.defaultSprite}/></div>
    }
  }

  _renderAvatar(dialogue) {
    const { id, name } = this.props

    let object
    let usingName = name
    if(id) {
      object = OBJECTS.getObjectOrHeroById(id)
      if(object && !usingName) usingName = object.name
    }

    if(dialogue && dialogue.reverseSpeaker) {
      object = GAME.heros[HERO.id]
      usingName = GAME.heros[HERO.id].name
    }

    return <div className="DialogueBox__avatar">
      {object && this._renderSprite(object)}
      {usingName && <div className="DialogueBox__name-container"><div className="DialogueBox__name">{usingName}</div></div>}
    </div>
  }

  render() {
    const { dialogue, options, enterKey, verticleMiddle } = this.props

    // <i className="DialogueBox__arrow fa fas fa-sort-down"></i>

    if(dialogue) {
      return <div className={classnames("DialogueBox", { "DialogueBox--vertical-middle": dialogue[0].style === 'modal' })}>
        {this._renderAvatar(dialogue[0])}
        <Textfit className="DialogueBox__content" id='fitty' min={14} max={20}>
          {dialogue[0].text}
        </Textfit>
        <KeySprite className={classnames("DialogueBox__key blink", {'DialogueBox__key--enter': enterKey})} keySprite={enterKey ? 'enter':'v'}></KeySprite>
      </div>
    }

//, { "DialogueBox--vertical-middle": verticleMiddle }
    if(options) {
      return <div className={classnames("DialogueBox DialogueBox--options")}>
        {this._renderAvatar()}
        <div className="DialogueBox__content">
          {options.map((option, index) => {
            return <div key={option.id}
              className={classnames("DialogueBox__option", { "DialogueBox__option--selected": this.state.selectedOptionIndex === index })}
              onMouseEnter={() => {
                this.setState({
                  selectedOptionIndex: index
                })
              }}
              onClick={() => {
                global.socket.emit('heroChooseOption', HERO.id, option.id)
              }}>{(index + 1) + '. ' + option.effectValue}
          </div>
        })}
      </div>
    </div>
    }
  }
}
