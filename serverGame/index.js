global.HERO.id = 'serverHero'

class GAME_HOST {
  onServerSetCurrentGame(game) {
    console.log(game.heros)

    const prevGame = GAME.id
    let prevHeros
    if(prevGame) {
      prevHeros = GAME.heros
      GAME.unload()
    }

    GAME.loadGridWorldObjectsCompendiumState(game)
    if(!prevGame) GAME.heros = {}
    if(prevHeros) {
      GAME.heros = prevHeros
      GAME.loadHeros(GAME)
    }

    // HERO.addHero(HERO.summonFromGameData({ id: HERO.id,'default' }))
    global.local.emit('onGameLoaded')
    // console.log(GAME.heroList)
  }

  onGameLoaded() {
    if(!PAGE.loopStarted) {
      global.startGameLoop()
      global.local.emit('onGameLoopStarted')
      PAGE.loopStarted = true
      global.local.emit('onFirstPageGameLoaded')
    }
  }

  // onUpdate() {
  //
  // }
}

global.GAME_HOST = new GAME_HOST()
