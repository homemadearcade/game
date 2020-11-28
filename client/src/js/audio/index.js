import audio from './sound.js'
import axios from 'axios'

window.audio = audio

/*
AUDIO TODO

// PLAY SOUND 3D
// FIND assets for missing SOUND FX
// add rest of the logic.. for various sounds??
// switch hero walk logic to server only, give it a _movingOn == 'space'/'dirt'/'ice'/'metal'/'water'
// sound quality tags, big, little, useArcadeWalkingSounds tag
// I might be able to get rid of assets and just use theme? perhaps. It seems the theme knows what to load...

default loading audio!

drop/add?

what are the audio tags??
cuz THERE GONNA BE A LOT ME DUDE
bigObject ( changes how it sounds when it explodes )
walks on ground vs in space vs in water, TOTTALY DIFFERENT SOUND FX GROUPS!!
//dirt vs metal vs wood vs? <-- stronger sound fx

are we NOT gonna use retro voice sound fx???

onHeroCanInteract

Mods enabled vs not enables vs equipping a mod vs getting an item??

also a UI sound vs a 3D sound...

sound qualities tags

VOLUME, how to change the volume of these sounds so that the 3D sounds feels right, maybe they are already mixed right?

// set echo or reverb? thats dope
it looks like this a left/right thing. Ill need to add my own later in that make it 3D
--

*/

class Audio{
  constructor() {
    this.data = {
      retro:{}
    }

    this.loading = {
      ids: [],
      callback: null
    }

    this.loadedIds = {}

    this.playingContinuous = {}
    this.sounds3d = {}
  }

  stopAllSounds() {
    Object.keys(this.playingContinuous).forEach((id) => {
      this.playingContinuous[id].sound.pause()
      this.playingContinuous[id] = null
    })
    Object.keys(this.sounds3d).forEach((id) => {
      this.sounds3d[id].sound.pause()
      this.sounds3d[id] = null
    })
    Object.keys(this.loadedIds).forEach((id) => {
      window.audio.sounds[id].pause()
    })
  }

  onUpdateTheme() {
    AUDIO.stopAllSounds()
  }

  onStopGame() {
    AUDIO.stopAllSounds()
  }

  loadData() {
    let socket = window.socket
    if(PAGE.role.isArcadeMode || PAGE.role.isHomeEditor) {
      socket = window.networkSocket
    }

    const options = {
      params: {
        id: 'retro'
      }
    };

    axios.get(window.HAGameServerUrl + '/audioData', options).then(res => {
      AUDIO.data.retro = res.data
    })

    //Assign the callback function that should run
    //each time a file loaded, just like PIXI.js
    window.audio.sounds.onProgress = function (progress, res) {
      console.log('%' + progress + ' file(s) loaded.');
      console.log('File ' + res.url + ' just finished loading.');
      // AUDIO.soundsByName[GAME.assets.audio[res.url].name] = res.url
    };

    window.audio.sounds.whenLoaded = () => {
      if(AUDIO.loading.callback) AUDIO.loading.callback(AUDIO.loading.ids)
      AUDIO.loading.ids.forEach((id) => {
        AUDIO.loadedIds[id] = true
      })
      AUDIO.loading.ids = []
      AUDIO.loading.callback = null
    }
  }

  onGameLoaded() {
    AUDIO.loadGameAssets(GAME)
  }

  loadGameAssets(game) {
    let assets = game.assets.audio

    const assetURLs =[]
    Object.keys(assets).forEach((id) => {
      const asset = assets[id]
      if(AUDIO.loadedIds[id]) return
      assetURLs.push(asset.assetURL)
    })

    AUDIO.loading.ids.push(...assetURLs)
    window.audio.sounds.load(assetURLs)
  }

  play(id) {
    if(!window.audio.sounds[id]) {
      AUDIO.loading.ids.push(id)
      window.audio.sounds.load([id])
      AUDIO.loading.callback = () => {
        window.audio.sounds[id].play()
      }
    } else {
      window.audio.sounds[id].play()
    }
  }

  playLoop({
    id,
    soundIds
  }) {
    if(!window.audio.sounds[soundIds[0]]) {
      AUDIO.loading.ids.push(soundIds[0])
      window.audio.sounds.load([soundIds[0]])
      AUDIO.loading.callback = () => {
        AUDIO.startLoop(id, soundIds[0])
      }
    } else {
      AUDIO.startLoop(id, soundIds[0])
    }
  }

  cloneAudio(id, cb) {
    console.log()
    return window.audio.makeSound(id, cb, false, window.audio.sounds[id].xhr)
  }

  startLoop(id, soundId) {
    if(this.playingContinuous[id]) {
      if(!this.playingContinuous[id].playing) {
        this.playingContinuous[id].sound.playFrom(0)
        this.playingContinuous[id].sound.loop = true
        this.playingContinuous[id].playing = true
      }
      return
    }

    const sound = this.cloneAudio(soundId, () => {
      console.log('XXXX', sound)
      sound.loop = true
      sound.volume = 0.5
      sound.play()
    })

    this.playingContinuous[id] = {
      id,
      playing: true,
      sound
    }
  }

  stopLoop(id) {
    if(this.playingContinuous[id]) {
      this.playingContinuous[id].sound.pause()
      this.playingContinuous[id].playing = false
    }
  }
  //
  // playByName(name) {
  //   if(!AUDIO.soundsByName[name]) {
  //     return
  //   }
  //   window.audio.sounds[AUDIO.soundsByName[name]].play()
  // }

  loadAsset(id, cb) {
    window.audio.sounds.load([id])
    if(cb) AUDIO.loading.callback = cb
    AUDIO.loading.ids.push(id)
  }
}

window.AUDIO = new Audio()
