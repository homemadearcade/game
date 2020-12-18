global.HERO.id = 'serverHero'

class GAME_HOST {
  onServerSetCurrentGame(game) {
    console.log(game.heros)

    GAME.loadGridWorldObjectsCompendiumState(game)
    GAME.heros = {}
    // HERO.addHero(HERO.summonFromGameData({ id: HERO.id,'default' }))
    global.local.emit('onGameLoaded')
    // console.log(GAME.heroList)
  }

  onGameLoaded() {
    if(!PAGE.loopStarted) {
      global.startGameLoop()
      global.local.emit('onGameLoopStarted')
      PAGE.loopStarted = true
    }
    if(!PAGE.gameLoaded) {
      global.local.emit('onFirstPageGameLoaded')
    }
  }

  // onUpdate() {
  //
  // }
}

global.GAME_HOST = new GAME_HOST()
