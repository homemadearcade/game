import React from 'react'
import { Textfit } from 'react-textfit';
import axios from 'axios'
import DialogueBox from './DialogueBox.jsx';
import ControlsInfo from './ControlsInfo.jsx';
import KeySprite from './KeySprite.jsx';
import Hastartscreen from './hastartscreen.jsx'
import TitleAnimation from './TitleAnimation.jsx'
import GameList from './GameList.jsx'

export default class GameOver extends React.Component{
  constructor(props) {
    super(props)

    this.state = {
      showStartOverButtons: false,
      showOtherGames: false,
    }
  }

  render() {
    const height = PIXIMAP.app.screen.height + 45 + 'px'

    if(!this.state.showOtherGames) {
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
                global.socket.emit('startPregame')
                PLAYERUI.ref.forceUpdate()
              } else {
                setTimeout(() => {
                  global.socket.emit('startGame')
                  PLAYERUI.ref.forceUpdate()
                }, 200)
              }
            }}>Try Again</button>
            {!PAGE.role.isHomeEditor && <button onClick={() => {
              if(!window.user) {
                window.location.href = global.HAGameClientUrl
              } else {
                this.setState({
                  showOtherGames: true
                })
              }

            }}>Play Other Games</button>}
            {(PAGE.role.isHomeEditor || PAGE.role.isAdmin) && <button onClick={() => {
              global.emitGameEvent('onEditGameState', { gameOver: false, gameOverReason: null })
              setTimeout(() => {
                PLAYERUI.ref.forceUpdate()
              }, 200)
            }}>Resume Editing</button>}

          </div>}
          </Hastartscreen>
      </div>
    } else {
      return <GameList/>
    }
  }
}
