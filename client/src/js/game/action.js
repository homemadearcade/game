function createBullet({ shooter, actionProps, direction }) {
  let shot = {
    id: 'bullet-' + window.uniqueID(),
    width: 4,
    height: 4,
    tags: actionProps.shootTags,
  }

  shot.tags.rotateable = true

  const velocity = actionProps.shootVelocity || 100

  if(shooter.angle) {
    Object.assign(shot, {
      x: shooter.x + (shooter.width/2),
      y: shooter.y,
      velocityAngle: velocity,
      angle: shooter.angle,
    })
  } else if(direction === 'up') {
    Object.assign(shot, {
      x: shooter.x + (shooter.width/2),
      y: shooter.y,
      velocityAngle: velocity,
      angle: 0,
    })
  } else if(direction === 'down') {
    Object.assign(shot, {
      x: shooter.x + (shooter.width/2),
      y: shooter.y + shooter.height,
      velocityAngle: velocity,
      angle: 1.5708 * 2
    })
  } else if(direction === 'right') {
    Object.assign(shot, {
      x: shooter.x + shooter.width,
      y: shooter.y + (shooter.height/2),
      velocityAngle: velocity,
      angle: 1.5708
    })
  } else if(direction === 'left') {
    Object.assign(shot, {
      x: shooter.x,
      y: shooter.y + (shooter.height/2),
      velocityAngle: velocity,
      angle: 1.5708 * 3
    })
  }

  return shot
}


function shootBullet({ shooter, actionProps, direction }) {
  let shooted = []
  if(actionProps.shootRadius) {
    if(actionProps.shootBulletsPerRound) {
      let radius = actionProps.shootRadius || .4
      let startAngle = createBullet({shooter, actionProps, direction }).angle -= (radius/2)
      for(let i = 0; i < actionProps.shootBulletsPerRound; i++) {
        let bullet = createBullet({shooter, actionProps, direction })
        bullet.angle = startAngle + (radius * (i/actionProps.shootBulletsPerRound))
        shooted.push(bullet)
      }
    } else {
      let radius = actionProps.shootRadius || .4
      const bullet1 = createBullet({shooter, actionProps, direction })
      bullet1.angle += (radius/2)
      shooted.push(bullet1)
      const bullet2 = createBullet({shooter, actionProps, direction })
      shooted.push(bullet2)
      const bullet3 = createBullet({shooter, actionProps, direction })
      shooted.push(bullet3)
      bullet3.angle -= (radius/2)
    }
    OBJECTS.create(shooted, { fromLiveGame: true })
  } else {
    if(actionProps.shootBulletsPerRound) {
      let shotBullets = 1
      shooted = [createBullet({ shooter, actionProps, direction })]
      OBJECTS.create(shooted, { fromLiveGame: true })
      const shootInterval = setInterval(() => {
        shooted = [createBullet({ shooter: OBJECTS.getObjectOrHeroById(shooter.id), actionProps, direction })]
        OBJECTS.create(shooted, { fromLiveGame: true })
        shotBullets++
        if(shotBullets == actionProps.shootBulletsPerRound) {
          clearInterval(shootInterval)
        }
      }, 2)
    } else {
      shooted = [createBullet({ shooter, actionProps, direction })]
      OBJECTS.create(shooted, { fromLiveGame: true })
    }
  }
}

function dropWall(hero) {
  let directions = hero.directions
  let wall = {
    id: 'wall-' + window.uniqueID(),
    width: GAME.grid.nodeSize,
    height: GAME.grid.nodeSize,
    tags: {
      obstacle: true,
      stationary: true,
    },
  }

  if(direction === 'up') {
    Object.assign(wall, {
      x: hero.x,
      y: hero.y - hero.height,
    })
  }

  if(direction === 'down') {
    Object.assign(wall, {
      x: hero.x,
      y: hero.y + hero.height,
    })
  }

  if(direction === 'right') {
    Object.assign(wall, {
      x: hero.x + hero.width,
      y: hero.y,
    })
  }

  if(direction === 'left') {
    Object.assign(wall, {
      x: hero.x - hero.width,
      y: hero.y,
    })
  }

  OBJECTS.create([wall], { fromLiveGame: true })
}

export {
  shootBullet,
  dropWall,
}
