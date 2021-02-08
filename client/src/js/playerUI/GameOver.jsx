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
        <TitleAnimation className="Cutscene__game-title" style={GAME.theme.title.animation} font={GAME.theme.title.font} title="Game Over"
          onComplete={() => {
            this.setState({
              showStartOverButtons: true
            })
          }}
        ></TitleAnimation>
        {this.state.showStartOverButtons && <div className="Cutscene__game-start">
          <button>Start Over</button>
          <button>Play Other Games</button>
        </div>}
        </Hastartscreen>
    </div>
  }
}
