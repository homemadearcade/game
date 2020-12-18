import modals from '../mapeditor/modals.js'

class GameClient {
  onStartDiffFlow(id) {
    const object = OBJECTS.getObjectOrHeroById(id)
    global.diffFlowId = id
    localStorage.setItem('diffFlowObject', JSON.stringify(object))
  }

  onEndDiffFlow(id) {
    const object = OBJECTS.getObjectOrHeroById(id)

    global.diffFlowId = null
    const original = JSON.parse(localStorage.getItem('diffFlowObject'))

    modals.openEditCodeModal('Object Diff', global.getObjectDiff(object, original), () => {})

    if(PAGE.role.isHost) {
      if(object.tags.hero) {
        GAME.heros[object.id] = original
      } else {
        console.log('not supported for non heros')
      }
    }
  }
}

global.GAME_CLIENT = new GameClient()
