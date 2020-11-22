import React from 'react'
import { Textfit } from 'react-textfit';
import classnames from 'classnames';

export default class DialogueBox extends React.Component{
  constructor(props) {
    super(props)

    this.state = {
      selectedOptionIndex: 0,
    }

    if(this.props.options) {
      window.addEventListener('keydown', this._onKeyDown)
    }
  }

  componentWillUnmount() {
    if(this.props.options) {
      window.removeEventListener('keydown', this._onKeyDown)
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
      window.socket.emit('heroChooseOption', HERO.id, this.props.options[selectedOptionIndex].id)
    }

    if(e.keyCode == 27) {
      window.socket.emit('heroChooseOption', HERO.id, null)
    }

    if(e.keyCode == 49 && this.props.options[0]) {
      window.socket.emit('heroChooseOption', HERO.id, this.props.options[0].id)
    }
    if(e.keyCode == 50 && this.props.options[1]) {
      window.socket.emit('heroChooseOption', HERO.id, this.props.options[1].id)
    }
    if(e.keyCode == 51 && this.props.options[2]) {
      window.socket.emit('heroChooseOption', HERO.id, this.props.options[2].id)
    }
    if(e.keyCode == 52 && this.props.options[3]) {
      window.socket.emit('heroChooseOption', HERO.id, this.props.options[3].id)
    }
    if(e.keyCode == 53 && this.props.options[4]) {
      window.socket.emit('heroChooseOption', HERO.id, this.props.options[4].id)
    }
    if(e.keyCode == 54 && this.props.options[5]) {
      window.socket.emit('heroChooseOption', HERO.id, this.props.options[5].id)
    }
    if(e.keyCode == 55 && this.props.options[6]) {
      window.socket.emit('heroChooseOption', HERO.id, this.props.options[6].id)
    }
    if(e.keyCode == 56 && this.props.options[7]) {
      window.socket.emit('heroChooseOption', HERO.id, this.props.options[6].id)
    }
  }

  render() {
    const { dialogue, options, name } = this.props

    if(dialogue) {
      return <div className="DialogueBox">
        {name && <div className="DialogueBox__name">{name}</div>}
        <Textfit className="DialogueBox__content" id='fitty' max={22}>{dialogue[0]}
        <i className="DialogueBox__arrow fa fas fa-sort-down"></i>
        </Textfit>
      </div>
    }

    if(options) {
      return <div className="DialogueBox DialogueBox--options">
        {name && <div className="DialogueBox__name">{name}</div>}
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
                window.socket.emit('heroChooseOption', HERO.id, option.id)
              }}>{(index + 1) + '. ' + option.effectValue}
          </div>
        })}
      </div>
    </div>
    }
  }
}
