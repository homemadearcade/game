import React from 'react'
import PhysicsLive from './PhysicsLive.jsx'
import HeroLive from './HeroLive.jsx'
import WorldLive from './WorldLive.jsx'
import WorldFilterLive from './WorldFilterLive.jsx'
import GuidanceLive from './GuidanceLive.jsx'
import ParticleLive from './ParticleLive.jsx'
import DayNightLive from './DayNightLive.jsx'
import LightLive from './LightLive.jsx'
import RandomizeLive from './RandomizeLive.jsx'
import 'react-dat-gui/dist/index.css';

export default class Root extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      objectSelected: {},
      openEditorName: ''
    }

    this.open = (objectSelected, openEditorName) => {
      this.setState({
        objectSelected,
        openEditorName
      })
    }

    this.close = () => {
      this.setState({
        objectSelected: {},
        openEditorName: ''
      })
    }

  }

  render() {
    const { objectSelected, openEditorName } = this.state

    if (openEditorName === '') return null
    return (
      <div className="LiveEditor">
        <i className="LiveEditor__close fa fas fa-times" onClick={this.close}></i>
        {openEditorName === 'physics' && <PhysicsLive objectSelected={objectSelected} />}
        {openEditorName === 'daynightcycle' && <DayNightLive />}
        {openEditorName === 'hero' && <HeroLive objectSelected={objectSelected} />}
        {openEditorName === 'light' && <LightLive objectSelected={objectSelected} />}
        {openEditorName === 'world' && <WorldLive />}
        {openEditorName === 'worldFilter' && <WorldFilterLive />}
        {openEditorName === 'gameRandomizer' && <RandomizeLive />}
        {openEditorName === 'guidance' && <GuidanceLive objectSelected={objectSelected}/>}
        {openEditorName === 'particle' && <ParticleLive objectSelected={objectSelected}/>}
      </div>
    )
  }
}
