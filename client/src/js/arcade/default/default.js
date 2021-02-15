import collisions from '../../utils/collisions'
import gridUtil from '../../utils/grid.js'
import pathfinding from '../../utils/pathfinding.js'
// import action from './action'
import particles from '../../map/particles.js'

export default class CustomGame{
  onGameStarted() {

  }

  onUpdate(delta) {

  }

  onUpdateHero(hero, keysDown, delta) {
    if(hero.flags.paused || GAME.gameState.paused) return

  }

  onUpdateObject(object, delta) {

  }

  onHeroCollide(hero, collider, result) {

  }

  onHeroInteract(hero, collider, result) {

  }

  onObjectCollide(agent, collider, result) {

  }
}
