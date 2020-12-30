import React from 'react';
import DatGui, { DatSelect, DatFolder, DatBoolean, DatButton, DatColor, DatNumber, DatString } from 'react-dat-gui';

export default class RandomizeLive extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      genre: GAME.theme.genre
    }
    this.handleUpdate = _.debounce(this.handleUpdate.bind(this), 100)
  }

  // Update current state with changes from controls
  handleUpdate(newData) {
    this.setState(newData)
    if(newData.genre !== GAME.theme.genre) {
      global.socket.emit('updateTheme', { genre: newData.genre })
    }
  }

  _renderAudioSelected(libraryProp, libraryObjectNames) {
    const array = Object.keys(libraryObjectNames)

    const render = []

    const heroMovementSounds = array.slice()
    heroMovementSounds.length = 14

    render.push(<DatFolder title="Hero Movement">{heroMovementSounds.map((name) => {
      const path = libraryProp+'.'+name
      return <DatBoolean path={path} label={name} />
    })}</DatFolder>)

    const heroActionSounds = array.slice(heroMovementSounds.length)
    heroActionSounds.length = 12
    render.push(<DatFolder title="Hero Actions">{heroActionSounds.map((name) => {
      const path = libraryProp+'.'+name
      return <DatBoolean path={path} label={name} />
    })}</DatFolder>)


    render.push(<DatFolder title="Other">{array.slice(heroActionSounds.length + heroMovementSounds.length, array.length-10).map((name) => {
      const path = libraryProp+'.'+name
      return <DatBoolean path={path} label={name} />
    })}</DatFolder>)

    render.push(<DatFolder title="UI">{array.slice(array.length-10).map((name) => {
      const path = libraryProp+'.'+name
      return <DatBoolean path={path} label={name} />
    })}</DatFolder>)

    return render
  }

  _renderEmitters(libraryProp, libraryObjectNames) {
    return Object.keys(libraryObjectNames).map((name) => {
      return <DatButton label={'Generate - ' + name} onClick={() => {
        if(HERO.editingId) {
          this._generateRandomEmitter(name, GAME.heros[HERO.editingId])
        } else {
          this._generateRandomEmitter(name, GAME.heros[HERO.id])
        }
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
            {this._renderAudioSelected('audioSelected', global.generateAudioThemeData)}
          </DatFolder>
          <DatFolder title='Lighting'>
            <DatButton label='Light Power' onClick={this._generateRandomLighting}></DatButton>
            <DatButton label='Light Power' onClick={global._randomizeLightPower}></DatButton>
            <DatButton label='Light Color' onClick={global._randomizeLightColor}></DatButton>
            <DatButton label='Light Opacity' onClick={global._randomizeLightOpacity}></DatButton>
            <DatButton label='World Ambient Light' onClick={global._randomizeWorldAmbientLight}></DatButton>
            <DatButton label='Dark Area Ambient Light' onClick={global._randomizeDarkAreaAmbientLight}></DatButton>
          </DatFolder>
          <DatFolder title='Emitters'>
            {this._renderEmitters('emitterSelected', global.generateEmitterData)}
          </DatFolder>
          <DatFolder title='Group'>
            <DatButton label='Sound FX' onClick={() => global.generateAudioTheme()}></DatButton>
            <DatButton label='Title Animation' onClick={this._generateTitleAnimation}></DatButton>
            <DatButton label='Title Font' onClick={this._generateTitleFont}></DatButton>
            <DatButton label='Descriptor Sprites' onClick={this._findSpritesForDescribedObjects}></DatButton>
            <DatButton label='Light Power' onClick={global._randomizeLightPower}></DatButton>
            <DatButton label='All Emitters' onClick={this._generateRandomEmitters}></DatButton>
            <DatButton label='All of the above' onClick={this._generateAll}></DatButton>
          </DatFolder>
        </DatGui>
      </div>
    )
  }

  //<DatSelect path='genre' label="Theme Genre" options={['any', 'block', 'fun?', 'scifi', 'fantasy', 'horror', 'retro']}/>
// <DatFolder title="Hero">
//   <DatButton label='Physics' onClick={this._generateRandomHeroPhysics}></DatButton>
//   <DatButton label='Controls' onClick={this._generateRandomHeroControls}></DatButton>
//   <DatButton label='Equipment' onClick={this._generateRandomHeroEquipment}></DatButton>
// </DatFolder>

  _generateAll = () => {
    if(HERO.editingId) {
      this._generateRandomEmitter(name, GAME.heros[HERO.editingId])
    } else {
      this._generateRandomEmitter(name, GAME.heros[HERO.id])
    }
    global.generateTitleTheme()
    global.generateAudioTheme()
    global._randomizeLightPower()
    global.findSpritesForDescribedObjects()
  }

  _generateRandomEmitters = () => {
    ['powerup', 'projectile', 'laser'].forEach((name) => {
      this._generateRandomEmitter(name, )
    })
  }

  _generateRandomEmitter(name, hero) {
    global._generateRandomEmitter(name, hero)
  }

  _generateRandomLighting() {
    global._randomizeLightPower()
    global._randomizeLightColor()
    global._randomizeLightOpacity()
    global._randomizeWorldAmbientLight()
    global._randomizeDarkAreaAmbientLight()
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
  _generateAudioSelected = () => {
    const audioSelected = this.state.audioSelected
    global.generateAudioTheme(audioSelected)
  }

  _generateTitleFont() {
    global.generateTitleFont()
  }
  _generateTitleAnimation() {
    global.generateTitleAnimation()
  }


  // SPRITES
  _findSpritesForDescribedObjects() {
    global.findSpritesForDescribedObjects()
  }
}
