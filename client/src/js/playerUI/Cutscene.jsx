import React from 'react'
import { Textfit } from 'react-textfit';
import DialogueBox from './DialogueBox.jsx';
import ControlsInfo from './ControlsInfo.jsx';

export default class Cutscene extends React.Component{
  constructor(props) {
    super(props)
  }

  render() {
    const { scenes } = this.props

    const scene = scenes[0]

    if(!scene) return null

    if(scene.cutsceneControls) {
      return <div className="Cutscene">
        <ControlsInfo dontShowAlt showPressV/>
      </div>
    }

    let backgroundImage = null
    if(scene.image) backgroundImage = "url('"+scene.image.url+"')"

    return <div className="Cutscene" style={{backgroundImage }}>
      {scene.text && <DialogueBox dialogue={[scene.text]}/>}
    </div>
  }
}
