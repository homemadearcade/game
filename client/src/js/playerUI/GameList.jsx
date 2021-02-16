import React from 'react'
import { Textfit } from 'react-textfit';
import axios from 'axios'
import classnames from 'classnames';
import DialogueBox from './DialogueBox.jsx';
import ControlsInfo from './ControlsInfo.jsx';
import KeySprite from './KeySprite.jsx';
import Hastartscreen from './hastartscreen.jsx'
import TitleAnimation from './TitleAnimation.jsx'

export default class GameList extends React.Component{
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  componentDidMount() {
    axios.get(global.HAGameServerUrl + '/gameSaves').then(res => {
      global.gameSaves = res.data.gameSaves.map((gameSave) => {
        gameSave.data = gameSave.data = JSON.parse(gameSave.data)
        return gameSave
      })
      this.setState({
        gameSaves: global.gameSaves
      })
    })
  }

  render() {
    const height = PIXIMAP.app.screen.height + 45 + 'px'

    let games
    let gameIdMap = {}

    if(this.state.gameSaves) {
      games = this.state.gameSaves.filter((gameSave) => {
        if(gameIdMap[gameSave.data.id]) return

        gameIdMap[gameSave.data.id] = true

        if(this.state.searchGameTerm && this.state.searchGameTerm.length) {
          if(gameSave.data.metadata && gameSave.data.metadata.name && gameSave.data.metadata.author) {
            if(gameSave.data.metadata.name.toLowerCase().indexOf(this.state.searchGameTerm.toLowerCase()) >= 0) return true
            if(gameSave.data.metadata.author.toLowerCase().indexOf(this.state.searchGameTerm.toLowerCase()) >= 0) return true
          }
        } else {
          return true
        }
      }).map((gameSave, i) => {
        if(gameSave.data.metadata && gameSave.data.metadata.name && gameSave.data.metadata.author) {
          return <div className="Cutscene__games-container__game" onClick={() => {
            let removeEventListener = window.local.on('onGameLoaded', () => {
              window.emitGameEvent('onStartPregame')
              removeEventListener()
            })
            if(!GAME.id) {
              window.emitGameEvent('onLoadGame', gameSave.data)
            } else {
              window.emitGameEvent('onChangeGame', gameSave.data)
            }
          }}>
            <div className="Cutscene__games-container__date">{new Date(gameSave.createdAt).toLocaleDateString("en-US")}</div>

            <div>
              <div onMouseEnter={() => {
                this.setState({
                  mouseOver: i
                })
              }} className="Cutscene__games-container__title">
                {gameSave.data.metadata.name}
                {window.user && gameSave.author == window.user._id && <a target="_blank" href={global.HAGameClientUrl+"/?homeEditor=true&gameSaveId="+gameSave._id}>edit</a>}
                {this.state.mouseOver== i && <a target="_blank" href={global.HAGameClientUrl+"/?arcadeMode=true&shareMode=true&gameSaveId="+gameSave._id}>share</a>}
              </div>
              <div className="Cutscene__games-container__author">{"By " + gameSave.data.metadata.author}</div>
              <div className="Cutscene__games-container__description" title={gameSave.data.metadata.description}>{gameSave.data.metadata.description}</div>
            </div>

            {gameSave.data.metadata.featuredImage && gameSave.data.metadata.featuredImage.url && <img className="Cutscene__games-container__image" src={gameSave.data.metadata.featuredImage.url}/>}
          </div>
        }
      })

      if(this.state.reverseDate) {
        games = games.reverse()
      }
    }

    return <div style={{height}} className="Cutscene Cutscene--stars">
      <Hastartscreen>
      {this.props.showTitle && <div className="Cutscene__game-title-over Cutscene__game-title-over--ha"><TitleAnimation onComplete={() => {}} style={GAME.theme.title.animation} font={{fontFamily: "'Press Start 2P', sans-serif"}} title="Homemade Arcade"></TitleAnimation></div>}
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
      <div onMouseLeave={() => {
        this.setState({
          mouseOver: null
        })
      }}>{games ? games : <div className="Cutscene__game-loading">Loading</div>}</div>
      </div>
      </Hastartscreen>
    </div>
  }
}
