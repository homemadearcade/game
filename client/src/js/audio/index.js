import audio from './sound.js'
import axios from 'axios'

global.audio = audio

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
      global.audio.sounds[id].pause()
    })
  }

  onUpdateTheme() {
    AUDIO.stopAllSounds()
  }

  onStopGame() {
    AUDIO.stopAllSounds()
  }

  loadData() {
    let socket = global.socket
    if(PAGE.role.isArcadeMode || PAGE.role.isHomeEditor) {
      socket = global.networkSocket
    }

    const options = {
      params: {}
    };

    axios.get(global.HAGameServerUrl + '/audioData', options).then(res => {
      AUDIO.data = res.data
    })

    //Assign the callback function that should run
    //each time a file loaded, just like PIXI.js
    global.audio.sounds.onProgress = function (progress, res) {
      console.log('%' + progress + ' file(s) loaded.');
      console.log('File ' + res.url + ' just finished loading.');
      AUDIO.loadedIds[res.url] = true
    };

    global.audio.sounds.whenLoaded = () => {
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
      if(global.audio.sounds[asset]) {
        return
      }
      assetURLs.push(asset)
    })
    Object.keys(global.defaultAudioTheme).forEach((event) => {
      const asset = global.defaultAudioTheme[event]
      if(!asset) return
      if(global.audio.sounds[asset]) {
        return
      }
      assetURLs.push(asset)
    })

    AUDIO.loading.callback = () => {
      global.local.emit('onAudioReady')
    }
    AUDIO.loading.ids.push(...assetURLs)
    global.audio.sounds.load(assetURLs)
  }

  play(id, options) {
    if(!id || !PAGE.gameLoaded) return

    try{
      if(!global.audio.sounds[id]) {
        AUDIO.loading.ids.push(id)
        global.audio.sounds.load([id])
        AUDIO.loading.callback = () => {
          if(options) {
            AUDIO.updateSound(global.audio.sounds[id], options)
          }
          if(global.audio.sounds[id]) global.audio.sounds[id].playFrom(0)
        }
      } else {
        if(options) {
          AUDIO.updateSound(global.audio.sounds[id], options)
        }
        if(global.audio.sounds[id]) global.audio.sounds[id].playFrom(0)
      }

    } catch(e) {
      console.error(e)
    }
  }

  playDebounce({id, soundId, volume = 1, debounceTime = 25}) {
    if(!id || !soundId || !PAGE.gameLoaded) return

    if(!global.audio.sounds[soundId]) {
      AUDIO.loading.ids.push(soundId)
      global.audio.sounds.load([soundId])
      AUDIO.loading.callback = () => {
        AUDIO.debounce({id, soundId, volume, debounceTime})
      }
    } else {
      AUDIO.debounce({id, soundId, volume, debounceTime})
    }
  }

  debounce({id, soundId, volume, debounceTime}) {
    if(!id || !soundId || !PAGE.gameLoaded) return

    if(this.playingDebounce[id]) {
      this.playingDebounce[id]()
      return
    }

    this.playingDebounce[id] = _.debounce(() => {
      global.audio.sounds[soundId].volume = volume
      if(global.audio.sounds[soundId]) global.audio.sounds[soundId].playFrom(0)
    }, debounceTime, { leading: true, trailing: true, maxWait: 10})
    this.playingDebounce[id]()
  }

  playLoop({
    id,
    soundIds
  }) {

    if(!soundIds[0] || !PAGE.gameLoaded) return

    if(!global.audio.sounds[soundIds[0]]) {
      AUDIO.loading.ids.push(soundIds[0])
      global.audio.sounds.load([soundIds[0]])
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
    return global.audio.makeSound(id, cb, false, global.audio.sounds[id].xhr)
  }

  startLoop(id, soundId) {
    if(!id || !soundId || !PAGE.gameLoaded) return

    if(this.playingContinuous[id]) {
      if(!this.playingContinuous[id].playing) {
        this.playingContinuous[id].sound.playFrom(0)
        this.playingContinuous[id].sound.loop = true
        this.playingContinuous[id].playing = true
      }
      return
    }

    if(global.audio.sounds[soundId] && id) {
      const sound = this.cloneSound(soundId, () => {
        sound.loop = true
        sound.playFrom(0)
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
  //   global.audio.sounds[AUDIO.soundsByName[name]].play()
  // }

  loadAsset(id, cb) {
    global.audio.sounds.load([id])
    if(cb) AUDIO.loading.callback = cb
    AUDIO.loading.ids.push(id)
  }
}

global.AUDIO = new Audio()
