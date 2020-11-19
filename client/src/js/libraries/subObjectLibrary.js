window.radianCircle = 6.28319

window.local.on('onFirstPageGameLoaded', () => {
  window.subObjectLibrary = {
    spear: {
      x: 0, y: 0, width: 6, height: 30,
        // x: 0, y: 0, width: 40, height: 40,
        relativeX: GAME.grid.nodeSize/5,
        relativeY: -GAME.grid.nodeSize,
        relativeWidth: -GAME.grid.nodeSize * .75,
        relativeHeight: -GAME.grid.nodeSize + 40,
      // opacity: 1,
      subObjectName: 'spear',
      color: 'yellow',
      tags: { monsterDestroyer: true, rotateable: true, relativeToAngle: true, relativeToDirection: true, pickupable: true, pickupOnHeroInteract: true, equipOnPickup: true, onMapWhenEquipped: true },
    },
    gun: {
      x: 0, y: 0, width: 10, height: 10,
      relativeX: GAME.grid.nodeSize/5,
      relativeY: -GAME.grid.nodeSize,
      // relativeWidth: -GAME.grid.nodeSize * .75,
      // relativeHeight: -GAME.grid.nodeSize * .75,
      subObjectName: 'gun',
      tags: { rotateable: true, relativeToAngle: true, relativeToDirection: true, pickupable: true, pickupOnHeroInteract: true, equipOnPickup: true, onMapWhenEquipped: true },
      actionButtonBehavior: 'shoot',
      actionProps: {
        debounceTime: 1.2,
        shootVelocity: 600,
        // shootRadius: window.radianCircle,
        shootBulletsPerRound: 1,
        shootTags: {
          monsterDestroyer: true,
          destroyOnCollideWithObstacle: true,
          moving: true,
          destroySoon: true,
        }
      },
      actionState: {}
    },
    marioCap: {
      x: 0, y: 0, width: 10, height: 10,
      color: 'red',
      // relativeX: GAME.grid.nodeSize/5,
      // relativeY: -GAME.grid.nodeSize,
      // relativeWidth: -GAME.grid.nodeSize * .75,
      // relativeHeight: -GAME.grid.nodeSize * .75,
      subObjectName: 'Mario hat',
      tags: { pickupable: true, pickupOnHeroInteract: true, equipOnPickup: true },
      actionButtonBehavior: 'mod',
      actionProps: {
        effectJSON: window.modLibrary.mario.effectJSON,
        revertable: true
      },
      actionState: {}
    },
    shrinkRay: {
      x: 0, y: 0, width: 10, height: 10,
      relativeX: GAME.grid.nodeSize/5,
      relativeY: -GAME.grid.nodeSize,
      subObjectName: 'Shrink Ray',
      tags: { rotateable: true, relativeToAngle: true, relativeToDirection: true, pickupable: true, pickupOnHeroInteract: true, equipOnPickup: true, onMapWhenEquipped: true },
      actionButtonBehavior: 'shrink',
      actionProps: {
        distance: 1000,
        power: 1,
        tagsSeeking: ['obstacle'],
      },
      actionState: {}
    },
    bombs: {
      x: 0, y: 0, width: 32, height: 32,
      relativeX: 0,
      relativeY: 0,
      subObjectName: 'Bomb Bag',
      tags: {
        potential: true,
        rotateable: true,
        relativeToAngle: true,
        relativeToDirection: true,
        pickupable: true,
        pickupOnHeroInteract: true,
        equipOnPickup: true,
        stackable: true,
      },
      count: 10,
      actionButtonBehavior: 'dropAndModify',
      actionProps: {
        tags: {
          destroySoon: true,
          countDownToDestroy: true,
          explodeOnDestroy: true,
          // pickupable: true,
          // pickupOnHeroInteract: true
        },
        explosionProps: {
          tags: {
            monsterDestroyer: true,
            monster: true,
            destroyQuickly: true
          },
          color: 'red',
          opacity: .2,
        }
      },

      actionState: {}
    },
  }

})
