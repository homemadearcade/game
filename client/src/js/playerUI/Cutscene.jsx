import React from 'react'
import { Textfit } from 'react-textfit';
import DialogueBox from './DialogueBox.jsx';
import ControlsInfo from './ControlsInfo.jsx';
import KeySprite from './KeySprite.jsx';

export default class Cutscene extends React.Component{
  constructor(props) {
    super(props)
  }

  render() {
    const { scenes } = this.props

    const scene = scenes[0]

    if(!scene) return null

    //<KeySprite className="Cutscene__corner-key blink" keySprite={'v'}></KeySprite>

    if(scene.startScreen) {
      return <div className="Cutscene Cutscene__game-start-screen" style={{backgroundImage }}>
        <div className="Cutscene__game-presents">{"Homemade Arcade Presents"}</div>
        <div className="Cutscene__game-title">{GAME.id}</div>
        {GAME.metadata.author && <div className="Cutscene__game-author">
          {'By ' + GAME.metadata.author}
        </div>}
        <div className="Cutscene__game-start blink">{'Press '}<KeySprite span className="Cutscene__key" keySprite={'enter'}></KeySprite>{' to start'}</div>
      </div>
    }

    if(scene.cutsceneControls) {
      return <div className="Cutscene">
        <ControlsInfo dontShowAlt/>
        <KeySprite className="Cutscene__corner-key blink" keySprite={'enter'}></KeySprite>
      </div>
    }

    let backgroundImage = null
    if(scene.image) backgroundImage = "url('"+scene.image.url+"')"

    return <div className="Cutscene" style={{backgroundImage }}>
      {scene.text && <DialogueBox dialogue={[scene.text]} hideV/>}
      <KeySprite className="Cutscene__corner-key blink" keySprite={'enter'}></KeySprite>
    </div>
  }
}
