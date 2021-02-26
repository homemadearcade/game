import collisions from '../../utils/collisions'
import gridUtil from '../../utils/grid.js'
import pathfinding from '../../utils/pathfinding.js'
// import action from './action'
import particles from '../../map/particles.js'

export default class CustomGame{
  onGameStarted() {
    setInterval(() => {
      // console.log(GAME.objectsByTag.jumpers)
      if(GAME.objectsByTag.jumpers) GAME.objectsByTag.jumpers.forEach((object) => {
        object.velocityY = -300
      })
    }, 1000)
  }

  onUpdate(delta) {

  }

  onUpdateHero(hero, keysDown, delta) {
    if(hero.flags.paused || GAME.gameState.paused) return

  }

  onUpdateObject(object, delta) {

  }

  onObjectDestroyed(object) {

  }

  onHeroCollide(hero, collider, result) {
    if(collider.tags.goalitems) {
      hero.popoverText = "Yum yum!"

      setTimeout(() => {
        hero.popoverText = null
      }, 400)
    }
  }

  onHeroInteract(hero, collider, result) {

  }

  onObjectCollide(agent, collider, result) {

  }
}
