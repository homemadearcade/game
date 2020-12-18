import collisions from '../../utils/collisions'
import gridUtil from '../../utils/grid.js'
import pathfinding from '../../utils/pathfinding.js'
import particles from '../../map/particles.js'

let explodingParticles;

export default class CustomGame{
  onGameLoaded() {
    explodingParticles = particles.createExplodingParticles({startX : 100, startY: 100, animationDuration: 2000, speed: 50, radius: 30, life: 1000, color: 'white', count: 1})
    GAME.gameState.paused = true
    GAME.heros[HERO.id].flags.showLives = true;
    GAME.heros[HERO.id].flags.showScore = true;
  }

  onGameUnload() {

  }

  onGameStart() {
    GAME.gameState.paused = false
    GAME.gameState.started = true
    GAME.gameState.startTime = Date.now()
    global.resetSpawnAreasAndObjects()
    HERO.respawn()
    GAME.heros[HERO.id].lives = 3
  }

  onKeyDown(key, hero) {
    if(hero.flags.paused || GAME.gameState.paused) return
  }

  onUpdate(delta) {

  }

  onUpdateObject(object, delta) {

  }

  onUpdateHero(hero, keysDown, delta) {
    if(GAME.gameState.paused) {
      if(32 in keysDown) {
        global.socket.emit('startGame')
      }
    }

    if(hero.flags.paused || GAME.gameState.paused) return

    if(hero.lives === 0) {
      // GAME.gameState.gameOver = true
      // GAME.gameState.paused = true
    }
  }

  onObjectCollide(agent, collider, result) {

  }


  onRender(ctx, delta) {
    explodingParticles.forEach((particle) => {
      particle.draw(ctx, delta)
    })

    if(GAME.gameState.paused && GAME.gameState.started) {
      const { minX, maxX, minY, maxY, centerY, centerX, cameraHeight, cameraWidth } = HERO.getViewBoundaries(GAME.heros[HERO.id])

      // ctx.fillStyle = 'rgba(0,0,0,0.8)';
      // ctx.fillRect((minX/global.camera.multiplier - global.camera.x), (minY/global.camera.multiplier - global.camera.y), cameraWidth/global.camera.multiplier, cameraHeight/global.camera.multiplier);
      //
      // // wrapText(ctx, text, x, y, maxWidth, lineHeight) {
      // // (minX/global.camera.multiplier - global.camera.x), (minY/global.camera.multiplier - global.camera.y), cameraWidth, cameraHeight
      // ctx.font =`${40/global.camera.multiplier}pt Arial`
      // ctx.fillStyle ='rgba(255,255,255, 0.8)';
      // let text = 'Press space to start'
      // let metrics = ctx.measureText(text)
      // global.wrapText(ctx, text, centerX/global.camera.multiplier - global.camera.x - (metrics.width/2), centerY/global.camera.multiplier - global.camera.y, 600/global.camera.multiplier, 80/global.camera.multiplier)

      let multiplier = ((4000 - (GAME.heros[HERO.id].animationZoomMultiplier || 0))/4000)
      // since I wanted the growth to occur very fast quickly, I had to decrease the value of the multiplier exponentialy ( it would turn into a decimal... oh god dont delte took me forever)
      multiplier = multiplier * multiplier
      multiplier = multiplier * multiplier
      multiplier = multiplier * multiplier
      multiplier = multiplier * multiplier
      multiplier = multiplier * multiplier
      multiplier = multiplier * multiplier
      multiplier = multiplier * multiplier
      multiplier = multiplier * multiplier

      ctx.fillStyle = `rgba(0,0,0, ${.8 * multiplier})`;
      ctx.fillRect(0, 0, MAP.canvas.width, MAP.canvas.height);
      ctx.font =`20pt Courier New`
      ctx.fillStyle =`rgba(255,255,255, ${1 * multiplier})`;
      let text = GAME.gameState.gameOver ? 'Game over. Press space to try again' : 'Press space to start'
      let metrics = ctx.measureText(text)
      ctx.fillText(text, (MAP.canvas.width/2) - (metrics.width/2), (MAP.canvas.height/2) + 10)
    }
  }

  onHeroCollide(hero, collider, result) {

  }

  onHeroInteract(hero, collider, result) {

  }
}
