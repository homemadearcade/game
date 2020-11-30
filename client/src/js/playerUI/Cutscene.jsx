import React from 'react'
import { Textfit } from 'react-textfit';
import DialogueBox from './DialogueBox.jsx';
import ControlsInfo from './ControlsInfo.jsx';
import KeySprite from './KeySprite.jsx';
import Hastartscreen from './hastartscreen.jsx'
import TitleAnimation from './TitleAnimation.jsx'

export default class Cutscene extends React.Component{
  constructor(props) {
    super(props)

    this.state = {
      showTitleDetails: false,
    }
  }

  render() {
    const { scenes } = this.props

    const scene = scenes[0]

    if(!scene) return null

    //<KeySprite className="Cutscene__corner-key blink" keySprite={'v'}></KeySprite>

//            <div className="TextThreeD Cutscene__game-title">{GAME.id}</div>

    const height = PIXIMAP.app.screen.height + 45 + 'px'
    if(scene.startScreen) {
      return <div style={{height}} className="Cutscene Cutscene--stars"><Hastartscreen>
          <div className="Cutscene__game-start-screen" style={{backgroundImage }}>
            <div className="Cutscene__game-presents">{"Homemade Arcade Presents"}</div>
            <TitleAnimation className="Cutscene__game-title" style={GAME.theme.title.animation} font={GAME.theme.title.font} title={GAME.id}
              onComplete={() => {
                this.setState({
                  showAuthorDetails: true
                })
              }}
            ></TitleAnimation>
          {this.state.showAuthorDetails && <div onAnimationEnd={() => {
                  this.setState({
                    showPressEnter: true
                  })
                }}
                className="Cutscene__game-author">
                      {'By ' + GAME.metadata.author || 'Nobody'}
                    </div>}
            {this.state.showPressEnter && <div className="Cutscene__game-start">{'Press '}<KeySprite span className="Cutscene__key" keySprite={'enter'}></KeySprite></div>}
          </div>
        </Hastartscreen>
      </div>
    }

    if(scene.cutsceneControls) {
      return <div style={{height}} className="Cutscene">
        <ControlsInfo dontShowAlt/>
        <KeySprite className="Cutscene__corner-key blink" keySprite={'enter'}></KeySprite>
      </div>
    }

    let backgroundImage = null
    if(scene.image) backgroundImage = "url('"+scene.image.url+"')"

    return <div style={{height}} className="Cutscene" style={{backgroundImage }}>
      {scene.text && <DialogueBox dialogue={[scene.text]} hideV/>}
      <KeySprite className="Cutscene__corner-key blink" keySprite={'enter'}></KeySprite>
    </div>
  }
}
