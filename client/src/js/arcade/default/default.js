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
    // if(object.id == "object-414511237917") {
    //     if(object.x > 1664) {
    //       object.goLeft = true
    //     }
    //     if(object.x < 520) {
    //       object.goLeft = false
    //     }
    //
    //     if(object.y > 1000) {
    //       object.velocityY = 0
    //       object.tags.gravityY = false
    //     }
    //
    //     if(object.waiting) {
    //       if(object.goLeft) object.x-= 100 * delta
    //       else object.x+= 100 * delta
    //       return
    //     } else {
    //         object.waiting = true
    //         object.velocityY = -1000
    //         object.tags.gravityY = true
    //
    //         // setTimeout(() => {
    //         //     object.tags.gravityY = false
    //         // }, 5000)
    //
    //         setTimeout(() => {
    //             object.waiting = false
    //         }, 5000)
    //     }
    // }
  }

  onObjectDestroyed(object) {

  }

  onHeroCollide(hero, collider, result) {
  }

  onHeroInteract(hero, collider, result) {

  }

  onObjectCollide(agent, collider, result) {

  }
}
