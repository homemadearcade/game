import audio from './sound.js'
import axios from 'axios'

window.audio = audio

/*
AUDIO TODO

// PLAY SOUND 3D

// sound quality tags, big, little, useArcadeWalkingSounds tag, and the elements? steel? etc...

are we NOT gonna use retro voice sound fx???

VOLUME, how to change the volume of these sounds so that the 3D sounds feels right, maybe they are already mixed right?
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
    this.playingDebounce = {}

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
      params: {}
    };

    axios.get(window.HAGameServerUrl + '/audioData', options).then(res => {
      AUDIO.data = res.data
    })

    //Assign the callback function that should run
    //each time a file loaded, just like PIXI.js
    window.audio.sounds.onProgress = function (progress, res) {
      console.log('%' + progress + ' file(s) loaded.');
      console.log('File ' + res.url + ' just finished loading.');
      AUDIO.loadedIds[res.url] = true
    };

    window.audio.sounds.whenLoaded = () => {
      if(AUDIO.loading.callback) AUDIO.loading.callback()
      AUDIO.loading.callback = null
    }
  }

  onGameIdentified() {
    AUDIO.loadGameAssets(GAME)
  }

  loadGameAssets(game) {
    let assets = game.theme.audio

    const assetURLs =[]
    Object.keys(assets).forEach((event) => {
      const asset = assets[event]
      if(!asset) return
      if(window.audio.sounds[asset]) {
        return
      }
      assetURLs.push(asset)
    })
    Object.keys(window.defaultAudioTheme).forEach((event) => {
      const asset = window.defaultAudioTheme[event]
      if(!asset) return
      if(window.audio.sounds[asset]) {
        return
      }
      assetURLs.push(asset)
    })

    AUDIO.loading.callback = () => {
      window.local.emit('onAudioReady')
    }
    AUDIO.loading.ids.push(...assetURLs)
    window.audio.sounds.load(assetURLs)
  }

  play(id, options) {
    if(!id) return

    try{
      if(!window.audio.sounds[id]) {
        AUDIO.loading.ids.push(id)
        window.audio.sounds.load([id])
        AUDIO.loading.callback = () => {
          if(options) {
            AUDIO.updateSound(window.audio.sounds[id], options)
          }
          if(window.audio.sounds[id]) window.audio.sounds[id].playFrom(0)
        }
      } else {
        if(options) {
          AUDIO.updateSound(window.audio.sounds[id], options)
        }
        if(window.audio.sounds[id]) window.audio.sounds[id].playFrom(0)
      }

    } catch(e) {
      console.error(e)
    }
  }

  playDebounce({id, soundId, volume = 1, debounceTime = 25}) {
    if(!id) return

    if(!window.audio.sounds[soundId]) {
      AUDIO.loading.ids.push(soundId)
      window.audio.sounds.load([soundId])
      AUDIO.loading.callback = () => {
        AUDIO.debounce({id, soundId, volume, debounceTime})
      }
    } else {
      AUDIO.debounce({id, soundId, volume, debounceTime})
    }
  }

  debounce({id, soundId, volume, debounceTime}) {
    if(!id) return

    if(this.playingDebounce[id]) {
      this.playingDebounce[id]()
      return
    }

    this.playingDebounce[id] = _.debounce(() => {
      window.audio.sounds[soundId].volume = volume
      if(window.audio.sounds[id]) window.audio.sounds[soundId].play()
    }, debounceTime)
    this.playingDebounce[id]()
  }

  playLoop({
    id,
    soundIds
  }) {
    if(!soundIds[0]) return

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

  updateSound(soundFile, { volume }) {
    soundFile.volume = volume
  }

  cloneSound(id, cb) {
    return window.audio.makeSound(id, cb, false, window.audio.sounds[id].xhr)
  }

  startLoop(id, soundId) {
    if(!id) return

    if(this.playingContinuous[id]) {
      if(!this.playingContinuous[id].playing) {
        this.playingContinuous[id].sound.playFrom(0)
        this.playingContinuous[id].sound.loop = true
        this.playingContinuous[id].playing = true
      }
      return
    }

    if(window.audio.sounds[id] && soundId) {
      const sound = this.cloneSound(soundId, () => {
        sound.loop = true
        sound.play()
      })

      this.playingContinuous[id] = {
        id,
        playing: true,
        sound
      }
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
