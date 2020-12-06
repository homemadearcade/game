import React from 'react';
import DatGui, { DatFolder, DatBoolean, DatButton, DatColor, DatNumber, DatString } from 'react-dat-gui';


// add more descriptors to sprites

// how does the genre of the game fit into all this? Changes the sprites used and the sounds used?
// theme live menu... SOUND FX, TITLE, GENRE? Needed? or just impove the media manager w animations and fonts

// is BLOCK a theme? helps with basically just decorating blocks and using retro sound FX and particle emitter randomness?
// random light color vs random non-sprites color vs random everything color ^^

// library objects...., :0
// add generate SFX from Descriptor data, speak SFX, destroy SFX, walk SFX, etc
// add genre descriptors to sprites via the spritesheet tags?
// random music
// add realistic audio SFX I have in folder/create quality audio stuff for footsteps and touch start?


export default class RandomizeLive extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.handleUpdate = _.debounce(this.handleUpdate.bind(this), 100)
  }

  // Update current state with changes from controls
  handleUpdate(newData) {
    this.setState(...newData)

    const updatedProps = {
      lightPower: newData.lightPower,
      lightColor: newData.lightColor,
      lightOpacity: newData.lightOpacity,
      ambientLight: newData.ambientLight
    }

    // window.socket.emit('updateTheme', { id, ...updatedProps })
  }

  _renderAudioSelected(libraryProp, libraryObjectNames) {
    const array = Object.keys(libraryObjectNames)


    const render = []

    const heroMovementSounds = array.slice()
    heroMovementSounds.length = 3

    render.push(<DatFolder title="Hero Movement">{heroMovementSounds.map((name) => {
      const path = libraryProp+'.'+name
      return <DatBoolean path={path} label={name} />
    })}</DatFolder>)

    array.slice(heroMovementSounds.length).forEach((name) => {
      const path = libraryProp+'.'+name
      render.push(<DatBoolean path={path} label={name} />)
    })

    return render
  }

  _renderEmitters(libraryProp, libraryObjectNames) {
    return Object.keys(libraryObjectNames).map((name) => {
      return <DatButton label={'Generate - ' + name} onClick={() => {
          this._generateRandomEmitter(name)
        }}/>
    })
  }

  render() {
    return (
      <div className='RandomizeLive'>
        <DatGui labelWidth="64%" data={this.state} onUpdate={this.handleUpdate}>
          <div className="LiveEditor__title">{'Game Randomizer'}</div>
          <DatFolder title='Select Audio'>
            <DatButton label='Generate Selected Audio' onClick={this._generateAudioSelected}></DatButton>
            {this._renderAudioSelected('audioSelected', window.generateAudioThemeData)}
          </DatFolder>
          <DatFolder title='Emitters'>
            {this._renderEmitters('emitterSelected', window.generateEmitterData)}
          </DatFolder>
          <DatFolder title='Generate'>
            <DatButton label='Sound FX' onClick={window.generateAudioTheme}></DatButton>
            <DatButton label='Title Animation' onClick={this._generateTitleAnimation}></DatButton>
            <DatButton label='Title Font' onClick={this._generateTitleFont}></DatButton>
            <DatButton label='Descriptor Sprites' onClick={window.findSpritesForDescribedObjects}></DatButton>
            <DatButton label='Lighting' onClick={this._generateRandomLighting}></DatButton>
            <DatFolder title="Hero">
              <DatButton label='Physics' onClick={this._generateRandomHeroPhysics}></DatButton>
              <DatButton label='Controls' onClick={this._generateRandomHeroControls}></DatButton>
              <DatButton label='Equipment' onClick={this._generateRandomHeroEquipment}></DatButton>
              <DatButton label='Emitters' onClick={this._generateRandomHeroEmitters}></DatButton>
            </DatFolder>
            <DatButton label='All Emitters' onClick={this._generateRandomEmitters}></DatButton>
            <DatButton label='All of the above' onClick={window._generateAll}></DatButton>
          </DatFolder>
        </DatGui>
      </div>
    )
  }

  _generateAll() {

  }

  _generateRandomEmitters() {

  }

  _generateRandomEmitter(name) {
    const emitterData = window.generateRandomEmitter(name)

    GAME.library.animations['random-'+name] = emitterData
    GAME.library.animations['random-'+name+'-'+window.getRandomInt(0, 99)] = emitterData

    window.socket.emit('updateLibrary', {animations: GAME.library.animations})
  }

  _generateRandomLighting() {

  }

  /// HERO
  _generateRandomHeroPhysics() {

  }
  _generateRandomHeroControls() {

  }
  _generateRandomHeroEquipment() {

  }
  _generateRandomHeroEmitters() {

  }

  /// THEME
  _generateAudioSelected() {

  }
  _generateTitleFont() {

  }
  _generateTitleAnimation() {

  }
}
