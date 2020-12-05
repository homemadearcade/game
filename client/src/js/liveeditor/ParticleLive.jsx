import React from 'react';
import DatGui, { DatFolder, DatSelect, DatBoolean, DatButton, DatColor, DatNumber, DatString } from 'react-dat-gui';
import modals from '../mapeditor/modals.js'

window.particles = [
  'default',
  'Bubbles50px',
  // 'Bubbles99px',
  'CartoonSmoke',
  'Fire',
  'HardCircle',
  'HardRain',
  // 'Pixel25px',
  'Pixel50px',
  // 'Pixel100px',
  'smokeparticle',
  'Sparks',
  'Snow50px',
  // 'Snow100px',
  'burst',
  // 'cloud_calc_dust0',
  // 'crystal_spear0',
  'particleCartoonStar',
  'particleSmallStar',
  // 'particleStar',
  // 'particleWhite_1',
  // 'particleWhite_2',
  // 'particleWhite_3',
  // 'particleWhite_4',
  // 'particleWhite_5',
  // 'particleWhite_7',
]

// window.randomParticles = [
//
//   'Fire',
//   'HardCircle',
//   'HardRain',
//   'Pixel25px',
//   'Pixel50px',
//   'Pixel100px',
//   'smokeparticle',
//   'Sparks',
//   'burst',
//   'particleCartoonStar',
//   'particleStar',
// ]

window.giveEmitterDataSpawnCircleOrRect = function(emitterData) {
  if(emitterData.spawnType == 'rect') {
    if(!emitterData.spawnRect) {
      emitterData.spawnRect = {}
    }
    if(!emitterData.spawnRect.w) {
      emitterData.spawnRect.w = 200
    }
    if(!emitterData.spawnRect.h) {
      emitterData.spawnRect.h = 200
    }
    if(emitterData.spawnRect) {
      if(emitterData.spawnRect.w) {
        emitterData.spawnRect.x = -(emitterData.spawnRect.w/2)
      }
      if(emitterData.spawnRect.h) {
        emitterData.spawnRect.y = -(emitterData.spawnRect.h/2)
      }
    }
  }

  if(emitterData.spawnType == 'circle' || emitterData.spawnType == 'ring') {
    if(!emitterData.spawnCircle) {
      emitterData.spawnCircle = {
        r: 10,
        minR: 10
      }
    }
  }
}

function _initObjectForParticleLive(objectSelected) {
  if(!objectSelected.emitterData) {
    objectSelected.emitterData = window.particleEmitterLibrary.smallFire
  }
  if(!objectSelected.emitterData.spawnWaitTime) {
    objectSelected.emitterData.spawnWaitTime = 100
  }
  if(!objectSelected.emitterData.speedType) {
    objectSelected.emitterData.speedType = 'very fast'
  }
  if(!objectSelected.tags.emitter) {
    MAPEDITOR.networkEditObject({id: objectSelected.id, tags:{ ...objectSelected.tags, emitter: true, defaultSprite: 'invisible' }})
    objectSelected.tags.emitter = true
  }
}
export default class ParticleLive extends React.Component {
  constructor(props) {
    super(props)
    const objectSelected = this.props.objectSelected

    _initObjectForParticleLive(objectSelected);
    this.state = {
      objectSelected
    }
    this.handleUpdate = _.debounce(this.handleUpdate.bind(this), 5)
  }

  static getDerivedStateFromProps = (nextProps, prevState) => {
    if (nextProps.objectSelected.id !== prevState.objectSelected.id) {
      _initObjectForParticleLive(nextProps.objectSelected)
      return { objectSelected: nextProps.objectSelected };
    }
    else return null;
  }

  // Update current state with changes from controls
  handleUpdate(newData, fromLoad) {
    const { networkEditObject } = MAPEDITOR
    const { objectSelected } = this.state
    const id = objectSelected.id

    this.setState({
      objectSelected: { ...objectSelected, ...newData }
    })

    const emitterData = newData.emitterData

    if(emitterData.spawnType == 'rect' && !fromLoad) {
      if(!emitterData.spawnRect) {
        emitterData.spawnRect = {}
      }
      if(!emitterData.spawnRect.w) {
        emitterData.spawnRect.w = 200
      }
      if(!emitterData.spawnRect.h) {
        emitterData.spawnRect.h = 200
      }
      if(emitterData.spawnRect) {
        if(emitterData.spawnRect.w) {
          emitterData.spawnRect.x = -(emitterData.spawnRect.w/2)
        }
        if(emitterData.spawnRect.h) {
          emitterData.spawnRect.y = -(emitterData.spawnRect.h/2)
        }
      }
    }

    if(emitterData.spawnType == 'circle' || emitterData.spawnType == 'ring' && !fromLoad) {
      if(!emitterData.spawnRect) {
        emitterData.spawnRect = {
          r: 10,
          minR: 10
        }
      }
    }


    if(!emitterData.speedType) {
      emitterData.speedType = 'fast'
    }

    let frequency = emitterData.frequency
    let frequencyDivider = 1000
    if(emitterData.speedType == 'slow') {
      frequencyDivider = 100
    }
    if(emitterData.speedType == 'normal') {
      frequencyDivider = 1000
    }
    if(emitterData.speedType == 'fast') {
      frequencyDivider = 10000
    }

    if(!fromLoad) {
      frequency = (101 - emitterData.spawnWaitTime)/frequencyDivider

      if(emitterData.spawnType !== 'burst') {
        delete emitterData.angleStart
        delete emitterData.particleSpacing
        delete emitterData.particlesPerWave
      }
    }

    if(!emitterData.spawnWaitTime && frequency) {
      emitterData.spawnWaitTime = frequency * frequencyDivider
    }

    let updatedProps = {}
    if(fromLoad) {
      updatedProps = { emitterData: emitterData, tags: { ...objectSelected.tags}, }
    } else {
     updatedProps = {
        emitterData: {
          ...objectSelected.emitterData,
          ...emitterData,
          // alpha: emitterData.alpha,
          // scale: emitterData.scale,
          // color: emitterData.color,
          // speed: emitterData.speed,
          // maxSpeed: emitterData.maxSpeed,
          // acceleration: emitterData.acceleration,
          // startRotation: emitterData.startRotation,
          // rotationSpeed: emitterData.rotationSpeed,
          // lifetime: emitterData.lifetime,
          //
          // spawnWaitTime: emitterData.spawnWaitTime,
          // emitterLifetime: emitterData.emitterLifetime,
          // maxParticles: emitterData.maxParticles,
          //
          "noRotation": false,
          blendMode: 'normal',
          addAtBack: false,
          "pos": {
            "x": 0,
            "y": 0
          },
          // particles: emitterData.particles,
          frequency,
        },
        tags: {
          ...newData.tags
        },
        opacity: newData.opacity
      }
    }

    if (PAGE.role.isHost) {
      Object.assign(OBJECTS.getObjectOrHeroById(id), updatedProps)
      networkEditObject(objectSelected, updatedProps)
    } else {
      networkEditObject(objectSelected, updatedProps)
    }
  }

  _renderEmitterShape() {
    const { objectSelected } = this.state;

    if(objectSelected.emitterData.spawnType === 'rect') {
      // <DatNumber path='emitterData.pos.x' label="x" min={0} max={100} step={1} />
      // <DatNumber path='emitterData.pos.y' label="y" min={1} max={10000} step={10} />
      // <DatNumber path='emitterData.spawnRect.x' label="x" min={-100} max={100} step={1} />
      // <DatNumber path='emitterData.spawnRect.y' label="y" min={-100} max={100} step={1} />
      //
      return <DatFolder title='Emitter Shape'>
        <DatSelect path='emitterData.spawnType' label="Emitter Shape" options={['point', 'circle', 'rect', 'ring', 'burst']}/>
        <DatNumber path='emitterData.spawnRect.w' label="Width" min={0} max={1000} step={1} />
        <DatNumber path='emitterData.spawnRect.h' label="Height" min={0} max={1000} step={1} />
      </DatFolder>
    }
    if(objectSelected.emitterData.spawnType === 'circle') {
      // <DatNumber path='emitterData.pos.x' label="Position x" min={0} max={100} step={1} />
      // <DatNumber path='emitterData.pos.y' label="Position y" min={1} max={10000} step={10} />
      // <DatNumber path='emitterData.spawnCircle.x' label="x" min={-100} max={100} step={1} />
      // <DatNumber path='emitterData.spawnCircle.y' label="y" min={-100} max={100} step={1} />
      //
      return <DatFolder title='Emitter Shape'>
        <DatSelect path='emitterData.spawnType' label="Emitter Shape" options={['point', 'circle', 'rect', 'ring', 'burst']}/>
        <DatNumber path='emitterData.spawnCircle.r' label="Radius" min={0} max={1000} step={1} />
      </DatFolder>
    }
    if(objectSelected.emitterData.spawnType === 'ring') {

      // <DatNumber path='emitterData.pos.x' label="x" min={0} max={100} step={1} />
      // <DatNumber path='emitterData.pos.y' label="y" min={1} max={10000} step={10} />
      // <DatNumber path='emitterData.spawnCircle.x' label="x" min={-100} max={100} step={1} />
      // <DatNumber path='emitterData.spawnCircle.y' label="y" min={-100} max={100} step={1} />
      //
      return <DatFolder title='Emitter Shape'>
        <DatSelect path='emitterData.spawnType' label="Emitter Shape" options={['point', 'circle', 'rect', 'ring', 'burst']}/>
        <DatNumber path='emitterData.spawnCircle.r' label="Max Radius" min={0} max={1000} step={1} />
        <DatNumber path='emitterData.spawnCircle.minR' label="Min Radius" min={0} max={1000} step={1} />
      </DatFolder>
    }
    if(objectSelected.emitterData.spawnType === 'burst') {
      // <DatNumber path='emitterData.pos.x' label="x" min={0} max={100} step={1} />
      // <DatNumber path='emitterData.pos.y' label="y" min={1} max={10000} step={10} />

      return <DatFolder title='Emitter Shape'>
        <DatSelect path='emitterData.spawnType' label="Emitter Shape" options={['point', 'circle', 'rect', 'ring', 'burst']}/>
        <DatNumber path='emitterData.particlesPerWave' label="Particles Per Burst" min={0} max={1000} step={1} />
        <DatNumber path='emitterData.particleSpacing' label="Particle Spacing" min={0} max={360} step={1} />
        <DatNumber path='emitterData.angleStart' label="Start Rotation" min={0} max={360} step={1} />
      </DatFolder>
    } else {
      // <DatNumber path='emitterData.pos.x' label="x" min={0} max={100} step={1} />
      // <DatNumber path='emitterData.pos.y' label="y" min={1} max={10000} step={10} />

      return <DatFolder title='Emitter Shape'>
        <DatSelect path='emitterData.spawnType' label="Emitter Shape" options={['point', 'circle', 'rect', 'ring', 'burst']}/>
        </DatFolder>
    }


  }

  render() {
    const { objectSelected } = this.state;

    return (
      <div className='ParticleLive'>
        <DatGui labelWidth="54%" data={objectSelected} onUpdate={this.handleUpdate}>
          <div className="LiveEditor__title">{'Particle'}</div>
          <DatBoolean path={'tags.emitter'} label="Live Update" />
          <DatNumber path='opacity' label='Object opacity' min={0} max={1} step={.1} />
          <DatButton label="Save Animation" onClick={async () => {
            PAGE.typingMode = true
            const { value: name } = await Swal.fire({
              title: "What is the name of this animation?",
              input: 'text',
              inputAttributes: {
                autocapitalize: 'off'
              },
              showClass: {
                popup: 'animated fadeInDown faster'
              },
              hideClass: {
                popup: 'animated fadeOutUp faster'
              },
              confirmButtonText: 'Submit',
            })
            PAGE.typingMode = false
            if(name) {
              objectSelected.emitterData.animationType = 'particle';
              window.socket.emit('addAnimation', name, objectSelected.emitterData)
            }
            }}></DatButton>
            <DatButton label="Reset Animation" onClick={() => {
              window.socket.emit('resetLiveParticle', objectSelected.id)
            }}/>
            <DatButton label="Open animation" onClick={() => {
              modals.openSelectParticleAnimation((result) => {
                if(result && result.value) {
                  this.handleUpdate({ emitterData: result.value}, true)
                }
              })
            }}/>
          <hr/>
          <DatFolder title='Color'>
            <DatNumber path='emitterData.alpha.start' label='Opacity Start' min={0} max={1} step={.1} />
            <DatNumber path='emitterData.alpha.end' label="Opacity End" min={0} max={1} step={.1} />
            <DatColor path='emitterData.color.start' label="Color Start" />
            <DatColor path='emitterData.color.end' label="Color End" />
            <DatBoolean path={'emitterData.matchObjectColor'} label="Match color of object" />
          </DatFolder>
          <DatFolder title='Size'>
            <DatNumber path='emitterData.scale.start' label="Size Start" min={0} max={5} step={.1} />
            <DatNumber path='emitterData.scale.end' label="Size End" min={0} max={5} step={.1} />
            <DatNumber path='emitterData.scale.minimumScaleMultiplier' label="Minumum Size Multiplier" min={0} max={5} step={.1} />
            <DatBoolean path={'emitterData.scaleToGameObject'} label="Match object size" />
          </DatFolder>
          <DatFolder title='Speed'>
            <DatNumber path='emitterData.speed.start' label="Speed Start" min={0} max={20000} step={1} />
            <DatNumber path='emitterData.speed.end' label="Speed End" min={0} max={20000} step={1} />
            <DatNumber path='emitterData.speed.minimumSpeedMultiplier' label="Minumum Speed Multiplier" min={0} max={5} step={.1} />
            <DatNumber path='emitterData.acceleration.x' label="Acceleration X" min={0} max={150000} step={10} />
            <DatNumber path='emitterData.acceleration.y' label="Acceleration Y" min={0} max={150000} step={10} />
            <DatNumber path='emitterData.maxSpeed' label="Max Speed" min={0} max={20000} step={10} />
          </DatFolder>
          <DatFolder title='Rotation'>
            <DatNumber path='emitterData.startRotation.min' label="Rotation Start Min" min={0} max={360} step={1} />
            <DatNumber path='emitterData.startRotation.max' label="Rotation Start Max" min={0} max={360} step={1} />
            <DatNumber path='emitterData.rotationSpeed.min' label="Rotation Speed Min" min={0} max={10000} step={1} />
            <DatNumber path='emitterData.rotationSpeed.max' label="Rotation Speed Max" min={0} max={10000} step={1} />
            <DatBoolean path={'emitterData.useUpdateOwnerPos'} label="Don't rotate particles with object" />
          </DatFolder>

          <DatFolder title='Lifetime'>
            <DatNumber path='emitterData.lifetime.min' label="Particle Lifetime Min" min={0} max={10} step={.01} />
            <DatNumber path='emitterData.lifetime.max' label="Particle Lifetime Max" min={0} max={10} step={.01} />
            <DatNumber path='emitterData.emitterLifetime' label="Emitter Lifetime" min={-1} max={100} step={1} />
            <DatBoolean path={'emitterData.persistAfterRemoved'} label="Continue emitting after object removed" />
          </DatFolder>

          <DatFolder title='Frequency'>
            <DatSelect path='emitterData.speedType' label="Class" options={['slow', 'normal', 'fast']}/>
            <DatNumber path='emitterData.spawnWaitTime' label="Frequency" min={0} max={100} step={1} />
            <DatNumber path='emitterData.maxParticles' label="Max Particles" min={1} max={1000} step={1} />
          </DatFolder>

          {this._renderEmitterShape()}

          <DatFolder title='Images'>
            <DatBoolean path='emitterData.useOwnerSprite' label="Use Owners Sprite" />
            {window.particles.map((name) => {
              return <DatBoolean path={'emitterData.images.'+name} label={name}/>
            })}
          </DatFolder>
        </DatGui>
      </div>
    )
  }
}
