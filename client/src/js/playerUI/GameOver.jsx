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
      showStartOverButtons: false,
      showOtherGames: false,
    }
  }

  render() {
    const height = PIXIMAP.app.screen.height + 45 + 'px'

    let games = window.gameSaves.filter((gameSave) => {
      if(this.state.searchGameTerm && this.state.searchGameTerm.length) {
        if(gameSave.data.metadata && gameSave.data.metadata.name && gameSave.data.metadata.author) {
          if(gameSave.data.metadata.name.toLowerCase().indexOf(this.state.searchGameTerm.toLowerCase()) >= 0) return true
          if(gameSave.data.metadata.author.toLowerCase().indexOf(this.state.searchGameTerm.toLowerCase()) >= 0) return true
        }
      } else {
        return true
      }
    }).map((gameSave) => {
      if(gameSave.data.metadata && gameSave.data.metadata.name && gameSave.data.metadata.author) {
        return <a target="_blank" href={"http://ha-game.herokuapp.com/?arcadeMode=true&gameSaveId="+gameSave._id}><div className="Cutscene__games-container__game" onClick={() => {
          let removeEventListener = window.local.on('onGameLoaded', () => {
            window.emitGameEvent('onStartPregame')
            removeEventListener()
          })
          window.emitGameEvent('onChangeGame', gameSave.data)
        }}>
          <div className="Cutscene__games-container__date">{new Date(gameSave.createdAt).toLocaleDateString("en-US")}</div>

          <div>
            <div className="Cutscene__games-container__title">{gameSave.data.metadata.name}</div>
            <div className="Cutscene__games-container__author">{gameSave.data.metadata.author}</div>
            <div className="Cutscene__games-container__description" title={gameSave.data.metadata.description}>{gameSave.data.metadata.description}</div>
          </div>

          {gameSave.data.metadata.featuredImage && gameSave.data.metadata.featuredImage.url && <img className="Cutscene__games-container__image" src={gameSave.data.metadata.featuredImage.url}/>}
        </div></a>
      }
    })

    if(this.state.reverseDate) {
      console.log('?')
      games = games.reverse()
    }

    if(this.state.showOtherGames) {
      return <div style={{height}} className="Cutscene Cutscene--stars">
        <Hastartscreen>
        <div className="Cutscene__games-container">
        <div className="Cutscene__games-container__form">
          <button className={this.state.reverseDate ? "Cutscene__games-container__sort fa fa-chevron-up" : "Cutscene__games-container__sort fa fa-chevron-down"} onClick={() => {
            this.setState({
              reverseDate: !this.state.reverseDate
            })
          }}></button>
          <input placeholder="Search by name" className="Cutscene__games-container__search" type="text" value={this.state.searchGameTerm} onChange={(event) => {
            this.setState({
              searchGameTerm: event.target.value
            })
          }}></input>
        </div>
        {games}
        </div>
        </Hastartscreen>
      </div>
    }

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
          }}>Restart Game</button>
          <button onClick={() => {
            this.setState({
              showOtherGames: true
            })
          }}>Play Other Games</button>
        </div>}
        </Hastartscreen>
    </div>
  }
}
