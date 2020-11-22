import React from 'react'
import { Textfit } from 'react-textfit';
import classnames from 'classnames';
import { SpriteSheet } from 'react-spritesheet'

const KeySpriteSheetData = [{"name":"esc","x":1,"y":1,"width":17,"height":11},{"name":"q","x":53,"y":1,"width":11,"height":11},{"name":"w","x":77,"y":1,"width":11,"height":11},{"name":"e","x":101,"y":1,"width":11,"height":11},{"name":"r","x":125,"y":1,"width":11,"height":11},{"name":"t","x":149,"y":1,"width":11,"height":11},{"name":"y","x":173,"y":1,"width":11,"height":11},{"name":"u","x":197,"y":1,"width":11,"height":11},{"name":"i","x":221,"y":1,"width":11,"height":11},{"name":"o","x":245,"y":1,"width":11,"height":11},{"name":"p","x":269,"y":1,"width":11,"height":11},{"name":"esc--pressed","x":19,"y":3,"width":17,"height":9},{"name":"q--pressed","x":65,"y":3,"width":11,"height":9},{"name":"w--pressed","x":89,"y":3,"width":11,"height":9},{"name":"e--pressed","x":113,"y":3,"width":11,"height":9},{"name":"r--pressed","x":137,"y":3,"width":11,"height":9},{"name":"t--pressed","x":161,"y":3,"width":11,"height":9},{"name":"y--pressed","x":185,"y":3,"width":11,"height":9},{"name":"u--pressed","x":209,"y":3,"width":11,"height":9},{"name":"i--pressedd","x":233,"y":3,"width":11,"height":9},{"name":"o--pressed","x":257,"y":3,"width":11,"height":9},{"name":"p--pressed","x":281,"y":3,"width":11,"height":9},{"name":"tab","x":1,"y":13,"width":23,"height":11},{"name":"a","x":53,"y":13,"width":11,"height":11},{"name":"s","x":77,"y":13,"width":11,"height":11},{"name":"d","x":101,"y":13,"width":11,"height":11},{"name":"f","x":125,"y":13,"width":11,"height":11},{"name":"g","x":149,"y":13,"width":11,"height":11},{"name":"h","x":173,"y":13,"width":11,"height":11},{"name":"j","x":197,"y":13,"width":11,"height":11},{"name":"k","x":221,"y":13,"width":11,"height":11},{"name":"l","x":245,"y":13,"width":11,"height":11},{"name":"up","x":269,"y":13,"width":11,"height":11},{"name":"tab--pressed","x":25,"y":15,"width":23,"height":9},{"name":"a--pressed","x":65,"y":15,"width":11,"height":9},{"name":"s--pressed","x":89,"y":15,"width":11,"height":9},{"name":"d--pressed","x":113,"y":15,"width":11,"height":9},{"name":"f--pressed","x":137,"y":15,"width":11,"height":9},{"name":"g--pressed","x":161,"y":15,"width":11,"height":9},{"name":"h--pressed","x":185,"y":15,"width":11,"height":9},{"name":"j--pressed","x":209,"y":15,"width":11,"height":9},{"name":"k--pressed","x":233,"y":15,"width":11,"height":9},{"name":"l--pressed","x":257,"y":15,"width":11,"height":9},{"name":"up--pressed","x":281,"y":15,"width":11,"height":9},{"name":"shift","x":1,"y":25,"width":25,"height":11},{"name":"z","x":53,"y":25,"width":11,"height":11},{"name":"x","x":77,"y":25,"width":11,"height":11},{"name":"c","x":101,"y":25,"width":11,"height":11},{"name":"v","x":125,"y":25,"width":11,"height":11},{"name":"b","x":149,"y":25,"width":11,"height":11},{"name":"n","x":173,"y":25,"width":11,"height":11},{"name":"m","x":197,"y":25,"width":11,"height":11},{"name":"left","x":221,"y":25,"width":11,"height":11},{"name":"down","x":245,"y":25,"width":11,"height":11},{"name":"right","x":269,"y":25,"width":11,"height":11},{"name":"shift--pressed","x":27,"y":27,"width":25,"height":9},{"name":"z--pressed","x":65,"y":27,"width":11,"height":9},{"name":"x--pressed","x":89,"y":27,"width":11,"height":9},{"name":"c--pressed","x":113,"y":27,"width":11,"height":9},{"name":"v--pressed","x":137,"y":27,"width":11,"height":9},{"name":"b--pressed","x":161,"y":27,"width":11,"height":9},{"name":"n--pressed","x":185,"y":27,"width":11,"height":9},{"name":"m--pressed","x":209,"y":27,"width":11,"height":9},{"name":"left--pressed","x":233,"y":27,"width":11,"height":9},{"name":"down--pressed","x":257,"y":27,"width":11,"height":9},{"name":"right--pressed","x":281,"y":27,"width":11,"height":9},{"name":"control","x":1,"y":37,"width":21,"height":11},{"name":"alt","x":45,"y":37,"width":22,"height":11},{"name":"space","x":91,"y":37,"width":27,"height":11},{"name":"enter","x":147,"y":37,"width":27,"height":11},{"name":"back","x":203,"y":37,"width":21,"height":11},{"name":"back-arrow","x":247,"y":37,"width":27,"height":11},{"name":"control--pressed","x":23,"y":39,"width":21,"height":9},{"name":"alt--pressed","x":68,"y":39,"width":22,"height":9},{"name":"space--pressed","x":119,"y":39,"width":27,"height":9},{"name":"enter--pressed","x":175,"y":39,"width":27,"height":9},{"name":"back--pressed","x":225,"y":39,"width":21,"height":9},{"name":"back-arrow--pressed","x":275,"y":39,"width":27,"height":9}].reduce((acc, next) => {
  acc[next.name] = next
  return acc
}, {})

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

    // <i className="DialogueBox__arrow fa fas fa-sort-down"></i>

    if(dialogue) {
      return <div className="DialogueBox">
        {name && <div className="DialogueBox__name">{name}</div>}
        <Textfit className="DialogueBox__content" id='fitty' max={22}>
          {dialogue[0]}
        </Textfit>
        <div className="DialogueBox__key"><SpriteSheet filename="assets/images/KeyUI.png" data={KeySpriteSheetData} sprite={'v'}/></div>
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
