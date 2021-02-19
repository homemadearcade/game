import React, { useState, useEffect } from "react";
import Hastartscreen from '../playerUI/hastartscreen.jsx'
import TitleAnimation from '../playerUI/TitleAnimation.jsx'
import axios from 'axios'
import babyBird from '../../../../data/game/babybird.json'
// <button onClick={actions.onSignUp} color="violet" size="large">
//   Sign Up
// </button>

export default class Landing extends React.Component{
  constructor(props) {
    super(props)
  }

  _renderGame(data, i) {
    return <a target="_blank" href={global.HAGameClientUrl+"/?arcadeMode=true&skipLogin=true&gameId="+data.id}>
      <div className="Cutscene__games-container__game">
        <div>
          <div className="Cutscene__games-container__title-row">
            <div className="Cutscene__games-container__title">{data.metadata.name}</div>
            <div className="Cutscene__games-container__author">{"By " + data.metadata.author}</div>
          </div>
          <div className="Cutscene__games-container__title-row">
            <div className="Cutscene__games-container__description" title={data.metadata.description}>{data.metadata.description}</div>
          </div>
        </div>

        {data.metadata.featuredImage && data.metadata.featuredImage.url && <img className="Cutscene__games-container__image" src={data.metadata.featuredImage.url}/>}
      </div>
    </a>
  }

  render() {
    let games = []
    games.push(this._renderGame(babyBird))
    games.push(this._renderGame(babyBird))
    games.push(this._renderGame(babyBird))
    games.push(this._renderGame(babyBird))
    games.push(this._renderGame(babyBird))
    games.push(this._renderGame(babyBird))
    games.push(this._renderGame(babyBird))
    games.push(this._renderGame(babyBird))

    return <div className="PlayerUI">
      <div className="Cutscene Cutscene--stars">
        <Hastartscreen>
          <div className="Cutscene__game-title-over Cutscene__game-title-over--ha"><TitleAnimation onComplete={() => {}} style="sunny mornings" font={{fontFamily: "'Press Start 2P', sans-serif"}} title="Homemade Arcade"></TitleAnimation></div>
          <div className="Cutscene__games-container Cutscene__games-container--title">
          <div className="Cutscene__games-container__form">
          Welcome to homemade arcade, blah blah blah
          {games ? games : <div className="Cutscene__game-loading">Loading games...</div>}

          <a href={global.HAGameClientUrl + '/?arcadeMode=true'} className="PlayerUI__top-right Cutscene__games-container__wanna-play-more">{!!global.user ? 'Go to arcade' : 'Sign In'}</a>
          <a className="Cutscene__games-container__wanna-play-more" href={global.HAGameClientUrl + '/?arcadeMode=true'}>Wanna play some more games? Click here to join the arcade</a>
          </div>
          </div>
        </Hastartscreen>
      </div>
    </div>
  }

};
