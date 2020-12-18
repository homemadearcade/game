const keysDown = {}
import gridUtil from '../../utils/grid.js'
import input from '../input.js'

class Ghost{
  previousHero() {
    let heroIds = Object.keys(GAME.heros)
    for(let i = 0; i < heroIds.length; i++) {
      if(GAME.heros[heroIds[i]].id === HERO.editingId) {
        if(i === 0) {
          HERO.editingId = GAME.heros[heroIds[heroIds.length-1]].id
        } else {
          HERO.editingId = GAME.heros[heroIds[i-1]].id
        }
        if(keysDown['16']) {
          HERO.id = HERO.editingId
          // HERO.ghostControl = true
        }
        break;
      }
    }
  }

  nextHero() {
    let heroIds = Object.keys(GAME.heros)
    for(let i = 0; i < heroIds.length; i++) {
      if(GAME.heros[heroIds[i]].id === HERO.editingId) {
        if(i === heroIds.length - 1) {
          HERO.editingId = GAME.heros[heroIds[0]].id
        } else {
          HERO.editingId = GAME.heros[heroIds[i+1]].id
        }
        if(keysDown['16']) {
          HERO.id = HERO.editingId
          // HERO.ghostControl = true
        }
        break;
      }
    }
  }

  onHerosLoaded(){
    if(!HERO.originalId) {
      HERO.originalId = HERO.id
    }
    if(!PAGE.role.isAdmin) return
    if(!HERO.editingId) {
      HERO.editingId = HERO.id
    }
    global.addEventListener("keydown", function (e) {
      keysDown[e.keyCode] = true

      //select left
      if(keysDown['188']){
        GHOST.previousHero()
        global.local.emit('onZoomChange')
      }

      //select right
      if(keysDown['190']){
        GHOST.nextHero()
        global.local.emit('onZoomChange')
      }

      EDITORUI.ref.forceUpdate()

      if(HERO.id !== HERO.originalId) PAGE.role.isGhost = true
      else PAGE.role.isGhost = false
    }, false)

    global.addEventListener("keyup", function (e) {
  	   delete keysDown[e.keyCode]
    }, false)
  }
  //
  onUpdate(delta) {
    localStorage.setItem('ghostData', JSON.stringify({selectedHeroId: HERO.id, ghost: PAGE.role.isGhostHero}))

  //   if(HERO.id === 'ghost' && 16 in keysDown) {
  //     if (38 in keysDown) { // Player holding up
  //       GAME.heros[HERO.id].y -= GAME.grid.nodeSize
  //     }
  //     if (40 in keysDown) { // Player holding down
  //       GAME.heros[HERO.id].y += GAME.grid.nodeSize
  //     }
  //
  //     if (37 in keysDown) { // Player holding left
  //       GAME.heros[HERO.id].x -= GAME.grid.nodeSize
  //     }
  //
  //     if (39 in keysDown) { // Player holding right
  //       GAME.heros[HERO.id].x += GAME.grid.nodeSize
  //     }
  //     input.onUpdate(GAME.heros[HERO.id], GAME.keysDown, delta)
  //   }
  }

  onGameReady() {

    // let ghostData = JSON.parse(localStorage.getItem('ghostData'));
    // if(ghostData && ghostData.selectedHeroId) {
    //   // HERO.ghost = ghostData.ghost
    //   if(GAME.heros[ghostData.selectedHeroId]) {
    //     HERO.id = ghostData.selectedHeroId
    //     PAGE.role.isGhost = true
    //   }
    // }

    // if(!HERO.ghost) HERO.ghost = JSON.parse(JSON.stringify(global.defaultHero))
    // HERO.ghost.color = 'rgba(255,255,255,0.1)'
    // HERO.ghost.arrowKeysBehavior = 'grid'
    // HERO.ghost.id = 'ghost'
    // gridUtil.snapObjectToGrid(HERO.ghost)
    // GAME.heros.ghost = HERO.ghost
  }
}

global.GHOST = new Ghost()
