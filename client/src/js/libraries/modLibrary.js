global.local.on('onFirstPageGameLoaded', () => {
  global.modLibrary = {
    spin: {
      modId: 'spin',
      effectJSON: {
        tags: {
          rotateable: true,
          realRotateFast: true
         }
      },
    },
    asteroids: {
      modId: 'asteroids',
      modEndOthers: true,
      effectJSON: {
        arrowKeysBehavior: 'angleAndVelocity',
        xButtonBehavior: 'accelerate',
        zButtonBehavior: 'brakeToZero',
        tags: {
          rotateable: true,
        }
      }
    },
    car: {
      modId: 'car',
      modEndOthers: true,
      effectJSON: {
        arrowKeysBehavior: 'angle',
        zButtonBehavior: 'accelerate',
        xButtonBehavior: 'brakeToZero',
        tags: {
          rotateable: true,
        }
      }
    },
    ufo: {
      modId: 'ufo',
      modEndOthers: true,
      effectJSON: {
        arrowKeysBehavior: 'velocity',
        color: 'yellow',
      }
    },
    zelda: {
      modId: 'zelda',
      modEndOthers: true,
      effectJSON: {
        arrowKeysBehavior: 'flatDiagonal',
      }
    },
    kirby: {
      modEndOthers: true,
      modId: 'kirby',
      effectJSON: {
        arrowKeysBehavior: 'flatDiagonal',
        spaceBarBehavior: 'floatJump',
        tags: {
          gravityY: true,
        },
        jumpVelocity: -440,
        velocityMax: 480,
      }
    },
    mario: {
      modEndOthers: true,
      modId: 'mario',
      effectJSON: {
        "color": "#b71c1c",
        arrowKeysBehavior: 'flatDiagonal',
        spaceBarBehavior: 'groundJump',
        tags: {
          gravityY: true,
        },
        jumpVelocity: -440,
        velocityMax: 480,
      }
    },
    jetpack: {
      modId: 'jetpack',
      effectJSON: {
        zButtonBehavior: 'accelerateUp',
        tags: {
          gravityY: true,
          disableUpKeyMovement: true,
        },
        velocityMax: 480,
        velocityDelta: 800,
        gravityVelocityY: 300,
      }
    },
    shrink: {
      modId: 'shrink',
      effectJSON: {
        width: 16,
        height: 16,
      }
    },
    snake: {
      modId: 'snake',
      modEndOthers: true,
      effectJSON: {
        arrowKeysBehavior: 'skating',
      }
    },
    seeThroughForeground: {
      modId: 'seeThroughForeground',
      effectJSON: {
        tags: {
          seeThroughForegrounds: true,
        }
      }
    },
    seeHidden: {
      modId: 'seeHidden',
      effectJSON: {
        tags: {
          seeHiddenObjects: true,
        }
      }
    },
  }
})
