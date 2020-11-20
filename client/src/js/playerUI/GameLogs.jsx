import React from "react"
import { Textfit } from 'react-textfit';

export default class GameLogs extends React.Component{
  constructor(props) {
    super(props)

    this.inputRef = React.createRef()

    this.state = {
      chat: '',
    }
  }

  onEnterPressed = () => {
    if(document.activeElement !== this.inputRef.current) {
      this.inputRef.current.focus()
    } else {
      this.submit()
    }
  }

  onEscPressed = () => {
    if(document.activeElement == this.inputRef.current) {
      this.inputRef.current.blur()
    }
  }


  componentDidMount() {
    if(!GAME.world.tags.allowHeroChat) return

    this.inputRef.current.onfocus = () => {
      PAGE.typingMode = true
    }
    this.inputRef.current.onblur = () => {
      PAGE.typingMode = false
    }
  }

  _getAuthorName = (id) => {
    const object = OBJECTS.getObjectOrHeroById(id)
    if(object.name) return object.name
    if(object.subObjectName) return object.subObjectName
    return object.id
  }

  submit = () => {
    if(this.state.chat == '') return

    window.socket.emit('sendNotification', { logAuthorId: HERO.id, chatId: HERO.id, text: this.state.chat, chat: true, log: true })

    this.setState({
      chat: '',
    })

    this.inputRef.current.blur()
  }

  _renderChatInput() {
    if(!GAME.world.tags.allowHeroChat) return

    const { chat } = this.state;

    return (
        <input
          ref={this.inputRef}
          value={chat} onChange={(e) => this.setState({chat: e.target.value})}
          placeholder='Press enter to chat'
          style={{
            position:'absolute',
            bottom: '0px',
            left: '0px',
            width: '100%',
            height: '47px',

            backgroundColor: '#0f0f0f',
            border:'0px',
            borderTop:'1px solid #999',
            padding:'10px',
            fontFamily: 'Courier',
            fontSize: '22px',
            width: '100%',
            color:'white',
            boxSizing: 'border-box'
          }}
        />
    )
  }

  _renderLogs(logs) {
    logs = [...logs]
    return logs.reverse().map((log, i) => {
      let background = '#0f0f0f'
      // if(i % 2) background = '#1a1a1a'

      if(!log.text || log.text.trim().length === 0) return
      if(log.logRecipientId && log.logRecipientId !== HERO.id) return

      return <div style={{background, padding: '8px 15px'}}>
        {log.logAuthorId && <div style={{color: 'white', fontSize:'12px', fontWeight:200, color: '#aaa', marginBottom:'2px'}}>{this._getAuthorName(log.logAuthorId)}</div>}
        <div style={{fontWeight:500}}>{log.text}</div>
      </div>
    })
  }

  render() {
    const { logs } = this.props
    return <div className="GameLogsContainer" style={{height: PIXIMAP.app.screen.height}}>
      <div className="GameLogs">
      <div className="GameLogs__list">{this._renderLogs(logs)}</div>
        {this._renderChatInput()}
      </div>
    </div>
  }
}
