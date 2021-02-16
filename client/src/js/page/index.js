import Swal from 'sweetalert2/src/sweetalert2.js';
import sockets from './sockets.js'
import events from './events.js'
import loop from './loop.js'
import modals from '../mapeditor/modals.js'
import React from 'react'
import ReactDOM from 'react-dom'
import App from '../auth/App.jsx'
import axios from 'axios';

class Page{
  constructor() {
    this.role = {}
    this.loadingCount = 0

    const gameContainer = document.createElement('div')
    gameContainer.id = 'GameContainer'
    document.body.appendChild(gameContainer)
  }

  establishRoleFromQueryOnly() {
    // ROLE SETUP
    PAGE.role.isHost = false
    PAGE.role.isPlayer = true
    PAGE.role.isHA = true

    if(PAGE.getParameterByName('playEditor')) {
      PAGE.role.isPlayEditor = true
      PAGE.role.isPlayer = false
    }

    if(PAGE.getParameterByName('host')) {
      PAGE.role.isHost = true
    }

    if(PAGE.getParameterByName('tempHost')) {
      PAGE.role.isHost = true
      PAGE.role.isTempHost = true
    }

    if(PAGE.getParameterByName('arcadeMode')) {
      PAGE.role.isHost = true
      PAGE.role.isArcadeMode = true
      PAGE.role.isPlayer = true
    }

    if(PAGE.getParameterByName('homeEditor')) {
      PAGE.role.isHost = true
      PAGE.role.isHomeEditor = true
      PAGE.role.isPlayer = true
    }
  }

  establishRoleFromQueryAndHero(hero) {
    if(PAGE.getParameterByName('admin') || hero.flags.isAdmin) {
      PAGE.role.isAdmin = true
    }
  }

  logRole() {
    if(PAGE.role.isHost) {
      if(PAGE.role.isArcadeMode) console.log('host-local')
      else console.log('host')
    } else {
      console.log('non host')
    }

    if(PAGE.role.isAdmin || PAGE.role.homeEditor) {
      console.log('editor')
    }
    if(PAGE.role.isPlayer) {
      console.log('player')
    }
  }

  setupRemoteLogging() {
    // if(PAGE.role.isHost) {
    //   let log = console.log
    //   console.log = function(msg, arg1, arg2, arg3) {
    //     let args = [msg, arg1, arg2, arg3].filter(i => !!i)
    //     global.socket.emit('hostLog', ...args)
    //     log(...args)
    //   }
    //   let error = console.error
    //   console.error = function(msg, arg1, arg2, arg3) {
    //     let args = [msg, arg1, arg2, arg3].filter(i => !!i)
    //     global.socket.emit('hostLog', ...args)
    //     error(...args)
    //   }
    //   global.addEventListener('error', function(e) {
    //     global.socket.emit('hostLog', 'ERROR', e.message
    //           , '\n', e.filename, ':', e.lineno, (e.colno ? ':' + e.colno : '')
    //           , e.error && e.error.stack ? '\n' : '', e.error ? e.error.stack : undefined
    //       );
    //   }, false);
    // }
    PAGE.remoteLog = function(msg, arg1, arg2, arg3) {
      let args = [msg, arg1, arg2, arg3].filter(i => !!i)
      global.socket.emit('hostLog', ...args)
      console.log(...args)
    }
  }

  //////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////
  /////// ON PAGE LOAD
  ///////////////////////////////
  ///////////////////////////////
  load() {


    let gameServerUrl = 'http://ha-game.herokuapp.com'
    if(global.location.hostname.indexOf('localhost') >= 0) {
      gameServerUrl = 'http://localhost:4000'
    }
    global.HAGameServerUrl = gameServerUrl

    let gameClientUrl = 'http://ha-game.herokuapp.com'
    if(global.location.hostname.indexOf('localhost') >= 0) {
      gameClientUrl = 'http://localhost:8080'
    }
    global.HAGameClientUrl = gameClientUrl

    let socialClientUrl = 'http://ha-social.herokuapp.com'
    if(global.location.hostname.indexOf('localhost') >= 0) {
      socialClientUrl = 'http://localhost:3005'
    }
    global.HASocialClientUrl = socialClientUrl

    let socialServerUrl = 'http://ha-social.herokuapp.com'
    if(global.location.hostname.indexOf('localhost') >= 0) {
      socialServerUrl = 'http://localhost:5000'
    }
    global.HASocialServerUrl = socialServerUrl

    let landingUrl = 'http://ha-landing.herokuapp.com'
    if(global.location.hostname.indexOf('localhost') >= 0) {
      landingUrl = 'http://localhost:3000'
    }
    global.HALandingUrl = landingUrl

    AUDIO.loadData()

    global.local.emit('onPageLoaded')

    if(PAGE.getParameterByName('arcadeMode')) {
      events.establishALocalHost()
      PAGE.establishRoleFromQueryOnly()
      HERO.getHeroId()
      global.local.emit('onUserIdentified')
      global.local.emit('onPlayerIdentified')
      PAGE.askCurrentGame((game, heroSummonType) => {
        GAME.loadGridWorldObjectsCompendiumState(game)
        GAME.heros = {}
        HERO.addHero(HERO.summonFromGameData({ id: HERO.id, heroSummonType }))
        global.local.emit('onGameLoaded')
      })
    } else {
      const container = document.createElement('div')
      container.id = 'HomemadeArcade'
      document.body.appendChild(container)
      // Mount React App
      ReactDOM.render(
        React.createElement(App),
        container
      )
    }

    axios.get(global.HAGameServerUrl + '/gameSaves').then(res => {
      global.gameSaves = res.data.gameSaves.map((gameSave) => {
        gameSave.data = gameSave.data = JSON.parse(gameSave.data)
        return gameSave
      })
    })
  }

  async userIdentified() {
    global.local.emit('onUserIdentified')

    if(PAGE.getParameterByName('homeEditor')) {
      events.establishALocalHost()
      PAGE.establishRoleFromQueryOnly()
      HERO.getHeroId()
      global.local.emit('onPlayerIdentified')
      PAGE.askCurrentGame((game, heroSummonType) => {
        GAME.loadGridWorldObjectsCompendiumState(game)
        GAME.heros = {}
        HERO.addHero(HERO.summonFromGameData({ id: HERO.id, heroSummonType }))
        global.local.emit('onGameLoaded')
      })
      return
    }

    const heroOptions = Object.keys(global.heroLibrary)
    const hasSavedHero = localStorage.getItem('hero')
    if(hasSavedHero) heroOptions.unshift('resume')

    let heroSummonType = 'singlePlayer'
    if(PAGE.getParameterByName('heroSummonType')) {
      if(hasSavedHero && JSON.parse(hasSavedHero).heroSummonType == PAGE.getParameterByName('heroSummonType')) heroSummonType = 'resume'
      else heroSummonType = PAGE.getParameterByName('heroSummonType')
    } else {
      const { value: heroLibraryNameIndex } = await Swal.fire({
        title: 'Select your editor',
        showClass: {
          popup: 'animated fadeInDown faster'
        },
        hideClass: {
          popup: 'animated fadeOutUp faster'
        },
        input: 'select',
        inputOptions: heroOptions,
        allowOutsideClick: false,
      })

      heroSummonType = heroOptions[heroLibraryNameIndex]
    }
    if(document.hasFocus()) {
      PAGE.playerIdentified(heroSummonType)
    } else {
      global.onfocus = () => {
        PAGE.playerIdentified(heroSummonType)
      }
    }
  }

  playerIdentified(heroSummonType) {
    PAGE.setupRemoteLogging()
    PAGE.establishRoleFromQueryOnly()
    HERO.getHeroId(heroSummonType === 'resume')

    global.onbeforeunload = function (event) {
      if(PAGE.role.isHost && GAME.gameState && GAME.gameState.started) {
        return "Please stop game before leaving page"
      }
    }

    if(PAGE.role.isHost) {
      global.socket.on('onAskJoinGame', (heroId, role, userId) => {
        global.local.emit('onAskJoinGame', heroId, role, userId)
      })
    }

    global.socket.on('onHeroJoinedGame', (hero) => {
      global.local.emit('onHeroJoinedGame', hero)
    })

    global.local.emit('onPlayerIdentified')

    PAGE.askCurrentGame((game) => {
      ARCADE.changeGame(game.id)
      GAME.loadAndJoin(game, heroSummonType)
    })
  }

  loadGameSave(gameSaveId, cb) {
    function handleResponse(response) {
      return response.text().then((text) => {
        const data = text && JSON.parse(text);
        return data;
      });
    }

    const gameSaveRequestOptions = {
     method: "POST",
     mode: 'cors',
     body: JSON.stringify({
       gameSaveId
     }),
     headers: {
       'Content-Type': 'application/json',
       'Access-Control-Allow-Origin': '*',
     }
    };
    fetch(global.HASocialServerUrl + "/api/game/getGameSave/", gameSaveRequestOptions).then(handleResponse).then(res => {
      cb(res)
    })
  }

  askMediaToLoad(cb, game, heroSummonType) {
    global.local.emit('onStartLoadingScreen')
    global.local.emit('onGameIdentified', game)
    const rm1 = global.local.on('onPixiMapReady', () => {
      PAGE.pixiMapReady = true
      if(PAGE.audioReady) {
        rm1()
        rm2()
        cb(game, heroSummonType)
      }
    })
    const rm2 = global.local.on('onAudioReady', () => {
      PAGE.audioReady = true
      if(PAGE.pixiMapReady) {
        rm1()
        rm2()
        cb(game, heroSummonType)
      }
    })
  }

  //////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////
  /////// ON INITIALIZE GAME
  ///////////////////////////////
  ///////////////////////////////
  async askCurrentGame(cb) {
    if(PAGE.role.isArcadeMode || PAGE.role.isHomeEditor) {
      let gameId = 'new'

      let heroSummonType = 'singlePlayer'
      if(PAGE.role.isHomeEditor) heroSummonType = 'homeEditor'

      if(PAGE.getParameterByName('gameSaveId')) {
        PAGE.loadGameSave(PAGE.getParameterByName('gameSaveId'), (res) => {
          PAGE.askMediaToLoad(cb, JSON.parse(res.gameSave), heroSummonType)
        })
        return
      }
      if(PAGE.getParameterByName('gameId')) {
        gameId = PAGE.getParameterByName('gameId')
      }
      if(gameId === 'load') {
        modals.openEditCodeModal('Paste JSON code here', {}, (result) => {
          const game = JSON.parse(result.value)
          PAGE.askMediaToLoad(cb, game, heroSummonType)
        })
        return
      }

      const options = {
        params: {
          gameId
        }
      };

      axios.get(global.HAGameServerUrl + '/game', options).then(res => {
        PAGE.askMediaToLoad(cb, res.data.game, heroSummonType)
      })
    } else {
      // when you are constantly reloading the page we will constantly need to just ask the server what the truth is
      global.socket.emit('askRestoreCurrentGame')
      global.socket.on('onAskRestoreCurrentGame', async (game) => {
        let currentGameExists = game && game.id
        if(currentGameExists) {
          PAGE.askMediaToLoad(cb, game)
        } else {
          const response  = await axios.get(global.HAGameServerUrl + '/gamesmetadata')
          const gamesMetadata = response.data.games

          let gameId
          if(PAGE.getParameterByName('gameId')) {
            gameId = PAGE.getParameterByName('gameId')
          } else {
            const { value: gamesMetadataIndex } = await Swal.fire({
              title: 'Load Game',
              text: "Select id of game",
              input: 'select',
              inputAttributes: {
                autocapitalize: 'off'
              },
              inputOptions: gamesMetadata.map(({id}) => id),
              showCancelButton: true,
              confirmButtonText: 'Load Game',
              cancelButtonText: 'New Game',
            })
            if(gamesMetadataIndex) {
              gameId = gamesMetadata[gamesMetadataIndex].id
            }
          }

          if(gameId) {
            global.socket.on('onLoadGame', (game) => {
              PAGE.askMediaToLoad(cb, game)
            })
            global.socket.emit('setAndLoadCurrentGame', gameId)
          } else {
            const { value: newGameId } = await Swal.fire({
              title: 'Create Game',
              text: "Enter id you want for new game",
              input: 'text',
              inputAttributes: {
                autocapitalize: 'off'
              },
              showCancelButton: true,
              confirmButtonText: 'Create',
            })
            if(newGameId) {
              let game = {
                id: newGameId,
                world: JSON.parse(JSON.stringify(global.defaultWorld)),
                // defaultHero: JSON.parse(JSON.stringify(global.defaultHero)),
                objects: [],
                grid: JSON.parse(JSON.stringify(global.defaultGrid)),
              }
              global.socket.emit('saveGame', game)
              PAGE.askMediaToLoad(cb, game)
            }
          }
         //  else {
         //   alert('host has not chosen game, become host or reload when game has been chosen')
         // }
        }
      })
    }
  };

  onUpdateGameSession() {

  }

  onGameReady() {
    PAGE.isGameReady = true
    global.local.emit('onLoadingScreenEnd')
  }

  onGameLoaded() {
    PAGE.initializeGameDragAndDrop()

    if(!PAGE.loopStarted) {
      global.startGameLoop()
      global.local.emit('onGameLoopStarted')
      PAGE.loopStarted = true
    }
    if(!PAGE.gameLoaded) {
      sockets.init()
      global.focused = true
      global.onfocus = () => {
        global.focused = true
      }
      global.onblur = () => {
        global.focused = false
      }
      global.local.emit('onFirstPageGameLoaded')
    }
    PAGE.gameLoaded = true

    if(GAME.world.tags.hasGameLog) {
      PAGE.openLog()
    }

    global.local.emit('cleanUpMapAndAskPixiToSendGameReady')
  }

  resetStorage() {
    localStorage.removeItem('hero')
    localStorage.removeItem('ghostData')
    localStorage.removeItem('initialGameState')
    localStorage.removeItem('saveEditingGame')
    localStorage.removeItem('editorPreferences')
    global.clearUserCookie()
    PAGE.role.isPlayer = false
    global.location.reload()
  }

  getParameterByName(name, url) {
      if (!url) url = global.location.href;
      name = name.replace(/[\[\]]/g, '\\$&');
      var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
          results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  copyToClipBoard(copyText) {
    console.log('trying to copy', copyText)
    navigator.permissions.query({name: "clipboard-write"}).then(result => {
      if (result.state == "granted" || result.state == "prompt") {
        /* write to the clipboard now */
        navigator.clipboard.writeText(copyText).then(function() {
          console.log('copied', GAME.id, 'to clipboard')
        }, function() {
          console.log('copy failed')
          /* clipboard write failed */
        });
      }
    });
  }

  onLoadingScreenEnd() {
    PAGE.loadingCount--
    if(PAGE.loadingCount <= 0) {
      PAGE.loadingCount = 0
      PAGE.loadingGame = false
      document.body.style.cursor = 'default'
    }
  }

  onLoadingScreenStart() {
    PAGE.loadingGame = true
    PAGE.loadingCount++
    document.body.style.cursor = 'wait'
  }

  downloadObjectAsJson(exportObj, exportName){
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  openLog() {
    PAGE.isLogOpen = true
    global.local.emit('onOpenLog')
  }
  closeLog() {
    PAGE.isLogOpen = false
    global.local.emit('onCloseLog')
  }

  showEditorTools() {
    if(PAGE.role.isHA && !PAGE.role.isAdmin && GAME.gameState.started && !GAME.heros[HERO.id].flags.editAllowedWhenGameStarted) {
      return false
    }

    return true
  }

  uploadToAws(file, name, cb) {
    const contentType = file.type; // eg. image/jpeg or image/svg+xml

    const generatePutUrl = global.socket.io.uri + '/generate-put-url';
    const options = {
      params: {
        Key: file.name,
        ContentType: contentType
      },
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods' : 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      }
    };

    axios.get(generatePutUrl, options).then(res => {
      axios
        .put(res.data.url, file, options)
        .then(res => {
          let url = global.awsURL + file.name
          console.log('Upload Successful', url)
          if(!name) name = url
          if(cb) {
            cb(name, url)
          } else {
            if(!GAME.library.images) GAME.library.images = {}
            GAME.library.images[name] = {
              name,
              url
            }
            global.local.emit('onSendNotification', { playerUIHeroId: HERO.id, toast: true, text: 'Image saved'})
            global.socket.emit('updateLibrary', { images: GAME.library.images })
          }
        })
        .catch(err => {
          console.log('Sorry, something went wrong')
          console.log('err', err);
        });
    });
  }

  initializeGameDragAndDrop() {
    // document.body.addEventListener('dragstart', handleDragStart)
    document.body.addEventListener('dragover', (e) => e.preventDefault())

    document.body.addEventListener('drop', handleDrop)
    // document.body.draggable=PAGE.role.isAdmin
    // document.body.droppable=true

    async function handleDrop(e) {
      const draggedGame = JSON.parse(e.dataTransfer.getData('text/plain'))
      if (draggedGame.heros) {
        const integrationOptions = [
          'cancel',
          'addNewObjects',
          'mergeAndAddNewObjects',
          'mergeObjects',
          'replace',
        ]
        const { value: integrationStrategyIndex } = await Swal.fire({
          title: 'Choose how to integrate this game',
          showClass: {
            popup: 'animated fadeInDown faster'
          },
          hideClass: {
            popup: 'animated fadeOutUp faster'
          },
          input: 'select',
          inputOptions: integrationOptions
        })

        if(!integrationStrategyIndex || integrationOptions[integrationStrategyIndex] == 'cancel') {
          return
        }

        const integrationChoice = integrationOptions[integrationStrategyIndex]

        e.stopPropagation();

        if(integrationChoice === 'replace') {
          draggedGame.heros[HERO.id] = GAME.heros[HERO.id]
          draggedGame.gameState.started = false
          draggedGame.gameState.loaded = false
          global.socket.emit('setGameJSON', draggedGame)
          return
        }

        if(integrationChoice === 'addNewObjects' || integrationChoice === 'mergeAndAddNewObjects') {
          let adding = []
          draggedGame.objects.forEach((obj) => {
            if(!GAME.objectsById[obj.id]) {
              adding.push(obj)
            }
          })
          global.socket.emit('addObjects', adding)
        }

        if(integrationChoice == 'mergeObjects' || integrationChoice == 'mergeAndAddNewObjects') {
          let editing = []
          draggedGame.objects.forEach((obj) => {
            let currentObj = GAME.objectsById[obj.id]
            if(currentObj) {
              const currentObjProperties = OBJECTS.getProperties(currentObj)
              const newObjProperties = OBJECTS.getProperties(obj)
              if(!_.isEqual(currentObjProperties, newObjProperties)) {
                editing.push(newObjProperties)
              }
            }
          })
          global.socket.emit('editObjects', editing)
        }


        // Object.keys(draggedGame.heros).forEach((id) => {
        //   let hero = draggedGame.heros[id]
        //   delete hero.x
        //   delete hero.y
        //   delete hero.velocityY
        //   delete hero.velocityX
        // })
        //
        // global.mergeDeep(GAME.heros, draggedGame.heros)
        // global.mergeDeep(GAME.world, draggedGame.world)
        // global.mergeDeep(GAME.gameState, draggedGame.gameState)
      }
    }
  }

  publishGame({ name, description, imageUrl }) {
    function handleResponse(response) {
      return response.text().then((text) => {
        const data = text && JSON.parse(text);
        return data;
      });
    }

    const gameSaveRequestOptions = {
     method: "POST",
     mode: 'cors',
     body: JSON.stringify({
       gameSave: JSON.stringify(GAME.cleanForSave(GAME)),
       userData: global.user,
     }),
     headers: {
       'Content-Type': 'application/json',
       'Access-Control-Allow-Origin': '*',
       Authorization: 'Bearer ' + global.getUserCookie()
     }
    };
    fetch(global.HASocialServerUrl + "/api/game/addGameSave", gameSaveRequestOptions).then(handleResponse).then(res => {
      const requestOptions = {
        method: "POST",
        mode: 'cors',
        body: JSON.stringify({
          gameSaveId: res.gameSaveId,
          userData: global.user,
          description: name + ' - ' + description,
          photo: imageUrl,
          tags: JSON.stringify([])
        }),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          Authorization: 'Bearer ' + global.getUserCookie()
        }
      };

      return fetch(global.HASocialServerUrl + "/api/post/addPost/", requestOptions)
        .then(res => {
          global.local.emit('onSendNotification', { playerUIHeroId: HERO.id, toast: true, text: 'Game Published!'})
        });
    })
  }

  onHostJoined() {
    if(PAGE.role.isTempHost) {
      global.location = global.HAGameClientUrl;
      global.reload()
    }
  }
}

global.PAGE = new Page()
