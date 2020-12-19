import n from 'nengi'
let nengi = n
if(nengi.default) nengi = nengi.default
import WeaponSystem from '../WeaponSystem.js'
import SAT from 'sat'
import CollisionSystem from '../CollisionSystem.js'

class PlayerCharacter {
    constructor({heroId}) {
        this.heroId = heroId
        this.x = 0
        this.y = 0
        this.rotation = 0
        this.hitpoints = 100
        this.isAlive = true

        this.moveDirection = {
            x: 0,
            y: 0
        }

        this.speed = 400
        this.weaponSystem = new WeaponSystem()
        this.collider = new SAT.Circle(new SAT.Vector(this.x, this.y), 25)
    }

    fire() {
        if (!this.isAlive) {
            return false
        }
        return this.weaponSystem.fire()
    }

    processMove(command, obstacles) {
        let unitX = 0
        let unitY = 0


        const upPressed = command.up
        const downPressed = command.down
        const leftPressed = command.left
        const rightPressed = command.right
        const keysDown = {}
        const hero = GAME.heros[this.heroId]

        if(!hero) return
        if(hero.flags.paused) return

        if((!GAME.gameState.started || hero.flags.isAdmin) && (keysDown['shift'] || keysDown['caps lock'])) {
          if (upPressed) {
            if(hero.tags.adminInch) hero.y -= 1
            else hero.y -= GAME.grid.nodeSize
          }
          if (downPressed) {
            if(hero.tags.adminInch) hero.y += 1
            else hero.y += GAME.grid.nodeSize
          }

          if (leftPressed) {
            if(hero.tags.adminInch) hero.x -= 1
            else hero.x -= GAME.grid.nodeSize
          }

          if (rightPressed) {
            if(hero.tags.adminInch) hero.x += 1
            else hero.x += GAME.grid.nodeSize
          }

          hero._skipPosUpdate = true
          hero._skipCorrections = true

          return
        }

        /*
          left arrow	'left'
          up arrow	'up'
          right arrow	'right'
          down arrow	'down'
          w 87
          a 65
          s 83
          d 68
        */
        /// DEFAULT GAME FX
        if(hero.flags.paused || GAME.gameState.paused) return

        const xSpeed = hero.mod().velocityInitial + (hero.mod().velocityInitialXExtra || 0)
        const ySpeed = hero.mod().velocityInitial + (hero.mod().velocityInitialYExtra || 0)

        if (upPressed && !hero.mod().tags.disableUpKeyMovement) {
          if(hero.mod().arrowKeysBehavior === 'acc' || hero.mod().arrowKeysBehavior === 'acceleration') {
            hero.accY -= (ySpeed) * delta;
          } else if (hero.mod().arrowKeysBehavior === 'velocity') {
            hero.velocityY -= (ySpeed) * delta;
          }
        }
        if (downPressed && !hero.mod().tags.disableDownKeyMovement) {
          if(hero.mod().arrowKeysBehavior === 'acc' || hero.mod().arrowKeysBehavior === 'acceleration') {
            hero.accY += (ySpeed) * delta;
          } else if (hero.mod().arrowKeysBehavior === 'velocity') {
            hero.velocityY += (ySpeed) * delta;
          }
        }
        if (leftPressed) {
          if(hero.mod().arrowKeysBehavior === 'acc' || hero.mod().arrowKeysBehavior === 'acceleration') {
            hero.accX -= (xSpeed) * delta;
          } else if (hero.mod().arrowKeysBehavior === 'velocity') {
            hero.velocityX -= (xSpeed) * delta;
          }
        }
        if (rightPressed) {
          if(hero.mod().arrowKeysBehavior === 'acc' || hero.mod().arrowKeysBehavior === 'acceleration') {
            hero.accX += (xSpeed) * delta;
          } else if (hero.mod().arrowKeysBehavior === 'velocity') {
            hero.velocityX += (xSpeed) * delta;
          }
        }

        if(hero.mod().arrowKeysBehavior === 'angleAndVelocity') {
          if(typeof hero.angle !== 'number') hero.angle = 0
          if(typeof hero.velocityAngle !== 'number') hero.velocityAngle = 0

          if (upPressed && !hero.mod().tags.disableUpKeyMovement) {
            hero.velocityAngle += (hero.mod().rotationSpeed || 100) * delta;
          }
          if (downPressed && !hero.mod().tags.disableDownKeyMovement) {
            hero.velocityAngle -= (hero.mod().rotationSpeed || 100) * delta;
          }
          if (leftPressed) {
            hero.angle -= 1 * delta;
          }
          if (rightPressed) {
            hero.angle += 1 * delta
          }
        }

        if(hero.mod().arrowKeysBehavior === 'skating') {
          if(hero.inputDirection === 'up' && !hero.mod().tags.disableUpKeyMovement) {
            hero.y -= Math.ceil(ySpeed * delta);
          } else if(hero.inputDirection === 'down' && !hero.mod().tags.disableDownKeyMovement) {
            hero.y += Math.ceil(ySpeed * delta);
          } else if(hero.inputDirection === 'left') {
            hero.x -= Math.ceil(xSpeed * delta);
          } else if(hero.inputDirection === 'right') {
            hero.x += Math.ceil(xSpeed * delta);
          }
        }

        if(hero.mod().arrowKeysBehavior === 'angle') {
          if(typeof hero.angle !== 'number') hero.angle = 0
          if(typeof hero.velocityAngle !== 'number') hero.velocityAngle = 0

          if (upPressed) {
            hero.angle = angleTowardsDegree(hero.angle, global.degreesToRadians(0), delta)
          }
          if (downPressed) {
            // console.log(hero.angle, global.degreesToRadians(180))
            hero.angle = angleTowardsDegree(hero.angle, global.degreesToRadians(180), delta)
          }
          if (leftPressed) {
            hero.angle = angleTowardsDegree(hero.angle, global.degreesToRadians(270), delta)
          }
          if (rightPressed) {
            hero.angle = angleTowardsDegree(hero.angle, global.degreesToRadians(90), delta)
          }

          const angleCorrection = global.degreesToRadians(90)
          hero.velocityX = hero.velocityAngle * Math.cos(hero.angle - angleCorrection)
          hero.velocityY = hero.velocityAngle * Math.sin(hero.angle - angleCorrection)
        }


        function positionInput() {

          if(hero.mod().arrowKeysBehavior === 'flatDiagonal') {
            if (upPressed && !hero.mod().tags.disableUpKeyMovement) {
              hero._flatVelocityY = -ySpeed
            } else if (downPressed && !hero.mod().tags.disableDownKeyMovement) {
              hero._flatVelocityY = ySpeed
            } else {
              hero._flatVelocityY = 0
            }

            if (leftPressed) {
              hero._flatVelocityX = -xSpeed
            } else if (rightPressed) {
              hero._flatVelocityX = xSpeed
            } else {
              hero._flatVelocityX = 0
            }
          }

          if(hero.mod().arrowKeysBehavior === 'advancedPlatformer') {
            let lowestXVelocityAllowed = xSpeed
            let lowestYVelocityAllowed = ySpeed
            let normalDelta = (hero.mod().velocityDelta || global.advancedPlatformerDefaults.velocityDelta) * delta
            let goalVelocity = hero.mod().velocityInputGoal ||  global.advancedPlatformerDefaults.velocityInputGoal

            if (upPressed && hero.inputDirection == 'up' && !hero.mod().tags.disableUpKeyMovement) {
              if(hero.velocityY > -lowestYVelocityAllowed) {
                if(hero.velocityY < lowestYVelocityAllowed && hero.velocityY > 0) {
                  // moving in other direction
                  hero.velocityY -= normalDelta
                  return
                } else if(hero.velocityY > lowestYVelocityAllowed) {
                  // moving VERY FAST in other direction
                  hero.velocityY -= normalDelta * 2
                  return
                } else {
                  hero.velocityY = -lowestYVelocityAllowed
                }
              }

              hero.velocityY -= normalDelta

              if(hero.velocityY < -goalVelocity) hero.velocityY = -goalVelocity
              return
            }

            if (downPressed && hero.inputDirection == 'down' && !hero.mod().tags.disableDownKeyMovement) {
              if(hero.velocityY < lowestYVelocityAllowed) {
                if(hero.velocityY > -lowestYVelocityAllowed && hero.velocityY < 0) {
                  // moving in other direction
                  hero.velocityY += normalDelta
                  return
                } else if(hero.velocityY < -lowestYVelocityAllowed) {
                  // moving VERY FAST in other direction
                  hero.velocityY += normalDelta * 2
                  return
                } else {
                  hero.velocityY = lowestYVelocityAllowed
                }
              }

              hero.velocityY += normalDelta

              if(hero.velocityY > goalVelocity) hero.velocityY = goalVelocity
              return
            }

            if (leftPressed && hero.inputDirection == 'left') {
              if(hero.velocityX > -lowestXVelocityAllowed) {
                if(hero.velocityX < lowestXVelocityAllowed && hero.velocityX > 0) {
                  // moving in other direction
                  hero.velocityX -= normalDelta
                  hero._turningLeft = true
                  return
                } else if(hero.velocityX > lowestXVelocityAllowed) {
                  // moving VERY FAST in other direction
                  hero.velocityX -= normalDelta * 2
                  return
                } else if(!hero._turningLeft){
                  hero.velocityX = -lowestXVelocityAllowed
                }
              } else {
                hero._turningLeft = false
              }
              hero.velocityX -= normalDelta

              if(hero.velocityX < -goalVelocity) hero.velocityX = -goalVelocity
              return
            }

            if (rightPressed && hero.inputDirection == 'right') {
              if(hero.velocityX < lowestXVelocityAllowed) {
                if(hero.velocityX > -lowestXVelocityAllowed && hero.velocityX < 0) {
                  // moving in other direction
                  hero.velocityX += normalDelta
                  hero._turningRight = true
                  return
                } else if(hero.velocityX < -lowestXVelocityAllowed) {
                  // moving VERY FAST in other direction
                  hero.velocityX += normalDelta * 2
                  return
                } else if(!hero._turningRight){
                  hero.velocityX = lowestXVelocityAllowed
                }
              } else {
                hero._turningRight = false
              }

              hero.velocityX += normalDelta

              if(hero.velocityX > goalVelocity) hero.velocityX = goalVelocity
              return
            }

            hero._turningLeft = false
            hero._turningRight = false
          }

          if(hero.mod().arrowKeysBehavior === 'flatRecent') {
            hero._flatVelocityX = 0
            if(!hero.mod().tags.disableUpKeyMovement) {
              hero._flatVelocityY = 0
            }

            if (upPressed && hero.inputDirection == 'up' && !hero.mod().tags.disableUpKeyMovement) {
              hero._flatVelocityY = -Math.ceil(ySpeed * delta) * 100
              return
            }

            if (downPressed && hero.inputDirection == 'down' && !hero.mod().tags.disableDownKeyMovement) {
              hero._flatVelocityY = Math.ceil(ySpeed * delta) * 100
              return
            }

            if (leftPressed && hero.inputDirection == 'left') {
              hero._flatVelocityX = -Math.ceil(xSpeed * delta) * 100
              return
            }

            if (rightPressed && hero.inputDirection == 'right') {
              hero._flatVelocityX = Math.ceil(xSpeed * delta) * 100
              return
            }

            if (upPressed && !hero.mod().tags.disableUpKeyMovement) {
              hero._flatVelocityY = -Math.ceil(ySpeed * delta) * 100
            }

            if (downPressed && !hero.mod().tags.disableDownKeyMovement) {
              hero._flatVelocityY = Math.ceil(ySpeed * delta) * 100
            }

            if (leftPressed) {
              hero._flatVelocityX = -Math.ceil(xSpeed * delta) * 100
            }

            if (rightPressed) {
              hero._flatVelocityX = Math.ceil(xSpeed * delta) * 100
            }
          }
        }

        positionInput()

        this.x = hero.x
        this.y = hero.y

        // // create forces from input
        // if (command.forward) { unitY -= 1 }
        // if (command.backward) { unitY += 1 }
        // if (command.left) { unitX -= 1 }
        // if (command.right) { unitX += 1 }
        //
        // // normalize
        // const len = Math.sqrt(unitX * unitX + unitY * unitY)
        // if (len > 0) {
        //     unitX = unitX / len
        //     unitY = unitY / len
        // }
        //
        // this.moveDirection.x = unitX
        // this.moveDirection.y = unitY
        //
        // this.x += this.moveDirection.x * this.speed * command.delta
        // this.y += this.moveDirection.y * this.speed * command.delta


    }
}

PlayerCharacter.protocol = {
    x: { type: nengi.Float32, interp: true },
    y: { type: nengi.Float32, interp: true },
    rotation: { type: nengi.RotationFloat32, interp: true },
    isAlive: nengi.Boolean,
    hitpoints: nengi.UInt8,
    heroId: nengi.String,
}

export default PlayerCharacter
