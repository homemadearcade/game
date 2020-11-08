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
        debounceTime: 2,
        shootVelocity: 200,
        // shootRadius: window.radianCircle,
        shootBulletsPerRound: 20,
        shootTags: {
          monsterDestroyer: true,
          destroyOnCollideWithObstacle: true,
          moving: true
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
    }
  }

})
