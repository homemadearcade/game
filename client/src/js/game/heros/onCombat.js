export default function onCombat(hero, collider, result, options) {
  if(collider.tags && collider.mod().tags['monster']) {
    if(hero.mod().tags['monsterDestroyer']) {

      if(hero.monsterEffect) {
        effects.processEffect({ effectName: hero.monsterEffect, effectValue: hero.monsterEffectValue }, collider, hero, null)
      } else {
        if(typeof collider.mod().spawnPointX == 'number' && collider.mod().tags['respawn']) {
          collider._respawn = true
        } else {
          collider._destroyedById = hero.id
          collider._destroy = true
        }
      }

    } else if(hero.mod().tags['monsterVictim']) {

        if(hero.lives != 'number') hero.lives = 1
        hero.lives--

        if(hero.lives <= 0) {
          hero._destroy = true
          hero.removed = true
          let reason = 'You got hit by a '
          reason += collider.name ? collider.name : collider.id
          if(collider.gameOverReason) reason = collider.gameOverReason
          // if(collider.gameOverPopoverText) hero.popoverText = collider.gameOverPopoverText

          if(hero.tags.implodeOnDestroy || hero.tags.explodeOnDestroy || hero.tags.spinOffOnDestroy) {
            setTimeout(() => {
              global.emitGameEvent('onGameOver', reason)
            }, 2000)
          } else {
            global.emitGameEvent('onGameOver', reason)
          }
        } else {
          hero._respawn = true
        }
      // I think heros should almost always respawn
      // if(hero.mod().tags.respawn) {
      // } else {}
    }
  }
}
