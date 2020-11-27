import audio from './sound.js'
import axios from 'axios'

window.audio = audio

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

    window.audio.sounds.whenLoaded = (arg, arg2) => {
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
      assetURLs.push[asset.assetURL]
    })

    //Assign the callback function that should run
    //each time a file loaded, just like PIXI.js
    window.audio.sounds.onProgress = function (progress, res) {
      console.log('Total ' + progress + ' file(s) loaded.');
      console.log('File ' + res.url + ' just finished loading.');
    };

    window.audio.sounds.load(assetURLs)
  }

  play(id) {
    window.audio.sounds[id].play()
  }

  loadAsset(id, cb) {
    window.audio.sounds.load([id])
    if(cb) AUDIO.loading.callback = cb
    AUDIO.loading.ids.push(id)
  }
}

window.AUDIO = new Audio()
