import effects from '../effects.js'

export default function onObjectCollide(agent, collider, result, agentPO) {
  if(agent.mod().tags['monsterDestroyer'] && collider.mod().tags['monster']) {
    if(agent.monsterEffect) {
      effects.processEffect({ effectName: agent.monsterEffect, effectValue: agent.monsterEffectValue }, collider, agent, null)
    } else {
      if(typeof collider.mod().spawnPointX == 'number' && collider.mod().tags['respawn']) {
        collider._respawn = true
      } else {
        collider._destroy= true
        collider._destroyedById = agent.id
      }
    }
  }

  if(agent.mod().tags['destroyOnCollideWithObstacle'] && collider.mod().tags['obstacle']) {
    agent._destroyedById = collider.id
    agent._destroy = true
  }

  // if(collider.mod().tags['objectUpdate'] && collider.objectUpdate && shouldEffect(po.gameObject, collider)) {
  //   if(agent.lastHeroUpdateId !== collider.id) {
  //     global.mergeDeep(agent, {...collider.objectUpdate})
  //     agent.lastHeroUpdateId = collider.id
  //   }
  // } else {
  //   agent.lastHeroUpdateId = null
  // }

  if(agent.mod().tags['monsterVictim'] && collider.mod().tags['monster']) {
    agent._destroyedById = collider.id
    if(typeof agent.mod().spawnPointX == 'number' && agent.mod().tags['respawn']) {
      agent._respawn = true
    } else {
      collider._destroy= true
      collider._destroyedById = agent.id
    }
  }
  //
  // if(collider.tags && agent.tags && collider.mod().tags['bullet'] && agent.mod().tags['monster']) {
  //   agent._remove = true
  //   hero.score++
  // }

  if(agent.tags && agent.mod().tags['goomba'] && collider.tags && (collider.mod().tags['obstacle'] || collider.mod().tags['noMonsterAllowed'])) {
    if(result.overlap_x === 1 && agent._goalDirection === 'right') {
      agent._goalDirection = 'left'
    }
    if(result.overlap_x === -1 && agent._goalDirection === 'left') {
      agent._goalDirection = 'right'
    }
  }

  if(agent.tags && agent.mod().tags['goombaSideways'] && collider.tags && (collider.mod().tags['obstacle'] || collider.mod().tags['noMonsterAllowed'])) {
    if(result.overlap_y === 1 && agent._goalDirection === 'down') {
      agent._goalDirection = 'up'
    }
    if(result.overlap_y === -1 && agent._goalDirection === 'up') {
      agent._goalDirection = 'down'
    }
  }

  if(agent.tags && agent.mod().tags['goDownOnCollideWithObstacle'] && collider.tags && (collider.mod().tags['obstacle'] || collider.mod().tags['noMonsterAllowed'])) {
    if(result.overlap_x === 1) {
      agentPO.y+= GAME.grid.nodeSize
    }
    if(result.overlap_x === -1) {
      agentPO.y+= GAME.grid.nodeSize
    }
  }

  if(collider.mod().tags['water']) {
    agent._collidingWithWater = true
  }
}
//
// function shouldEffect(agent, collider) {
//   if(collider.idRequirement) {
//     if(agent.id === collider.idRequirement) {
//       return true
//     } else {
//       return false
//     }
//   } else if(collider.tagRequirements && collider.tagRequirements) {
//     if(collider.needsAllTagRequirements) {
//       if(collider.tagRequirements.all((requirement) => {
//         return agent.mod().tags[requirement]
//       })) {
//         return true
//       } else return false
//     } else {
//       if(collider.tagRequirements.some((requirement) => {
//         return agent.mod().tags[requirement]
//       })) {
//         return true
//       } else return false
//     }
//   }
//
//   return true
// }
