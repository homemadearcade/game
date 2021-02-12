import React from 'react'
import { Textfit } from 'react-textfit';
import DialogueBox from './DialogueBox.jsx';
import ControlsInfo from './ControlsInfo.jsx';
import KeySprite from './KeySprite.jsx';
import Hastartscreen from './hastartscreen.jsx'
import TitleAnimation from './TitleAnimation.jsx'

export default class GameOver extends React.Component{
  constructor(props) {
    super(props)

    this.state = {
      showStartOverButtons: false
    }
  }

  render() {
    const height = PIXIMAP.app.screen.height + 45 + 'px'

    return <div style={{height}} className="Cutscene Cutscene--stars">
        <Hastartscreen>
        <div className="Cutscene__game-title-over"><TitleAnimation style={GAME.theme.title.animation} font={GAME.theme.title.font} title={GAME.gameState.customGameOverHeader ? GAME.gameState.customGameOverHeader : "Game Over"}
          onComplete={() => {
            this.setState({
              showStartOverButtons: true
            })
          }}
        ></TitleAnimation></div>
        <div className="Cutscene__game-over-reason">{GAME.gameState.gameOverReason}</div>
        {<div className="Cutscene__game-options">
          <button onClick={() => {
            if(this.state.showStartOverButtons) {
              global.socket.emit('startGame')
              PLAYERUI.ref.forceUpdate()
            } else {
              setTimeout(() => {
                global.socket.emit('startGame')
                PLAYERUI.ref.forceUpdate()
              }, 200)
            }
          }}>Restart Game</button>
          <button>Play Other Games</button>
        </div>}
        </Hastartscreen>
    </div>
  }
}
