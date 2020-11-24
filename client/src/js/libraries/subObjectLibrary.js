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
      name: 'Spear',
      subObjectName: 'spear',
      tags: { monsterDestroyer: true, rotateable: true, relativeToAngle: true, relativeToDirection: true, pickupable: true, pickupOnHeroInteract: true, equipOnPickup: true, onMapWhenEquipped: true },
    },
    spearToggleable: {
      x: 0, y: 0, width: 6, height: 30,
        // x: 0, y: 0, width: 40, height: 40,
        relativeX: GAME.grid.nodeSize/5,
        relativeY: -GAME.grid.nodeSize,
        relativeWidth: -GAME.grid.nodeSize * .75,
        relativeHeight: -GAME.grid.nodeSize + 40,
      // opacity: 1,
      name: 'Spear',
      subObjectName: 'spearToggleable',
      actionButtonBehavior: 'toggle',
      actionButtonBehaviorLabel: 'Toggle Spear',
      tags: { monsterDestroyer: true, rotateable: true, relativeToAngle: true, relativeToDirection: true, pickupable: true, pickupOnHeroInteract: true, equipOnPickup: true, onMapWhenEquipped: true },
    },
    spearDialogueChoice: {
      x: 0, y: 0, width: 6, height: 30,
        // x: 0, y: 0, width: 40, height: 40,
        relativeX: GAME.grid.nodeSize/5,
        relativeY: -GAME.grid.nodeSize,
        relativeWidth: -GAME.grid.nodeSize * .75,
        relativeHeight: -GAME.grid.nodeSize + 40,
      // opacity: 1,
      name: 'Spear',
      subObjectName: 'spearDialogueChoice',
      equipBehavior: 'addDialogueChoice',
      equipProps: {
        dialogueChoiceJSON: {
          tags: {
            monster: true
          },
          text: 'Stab with spear',
          guestEffect: 'destroy',
        }
      },
      tags: { rotateable: true, relativeToAngle: true, relativeToDirection: true, pickupable: true, pickupOnHeroInteract: true, equipOnPickup: true, onMapWhenEquipped: true },
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
        startsInInventory: true,
        showCountInHUD: true,
        // popCount: true,
        // bomb: true,
      },
      count: 10,
      actionButtonBehavior: 'dropAndModify',
      actionButtonBehaviorLabel: 'Drop Bomb',
      actionProps: {
        tags: {
          destroySoon: true,
          countDownToDestroy: true,
          explodeOnDestroy: true,
          popCountDownTimer: true,
          showCountInHUD: false
          // pickupable: true,
          // pickupOnHeroInteract: true
        },
        explosionProps: {
          tags: {
            monsterDestroyer: true,
            monster: true,
            destroyQuickly: true,
            // popCountDownTimer: true,
          },
          color: 'red',
          opacity: .2,
        }
      },
      actionState: {}
    },
    seeThroughForegroundPower: {
      x: 0, y: 0, width: 10, height: 10,
      subObjectName: 'seeThroughForegroundPower',
      tags: { potential: true, pickupable: true, pickupOnHeroInteract: true, equipOnPickup: true },
      actionButtonBehavior: 'mod',
      actionButtonBehaviorLabel: 'Spy',
      actionProps: {
        effectJSON: window.modLibrary.seeThroughForeground.effectJSON,
        revertable: true
      },
      actionState: {}
    },
    seeHiddenPower: {
      x: 0, y: 0, width: 10, height: 10,
      subObjectName: 'seeHiddenPower',
      tags: { potential: true, pickupable: true, pickupOnHeroInteract: true, equipOnPickup: true },
      actionButtonBehavior: 'mod',
      actionButtonBehaviorLabel: 'Uncover',
      actionProps: {
        effectJSON: window.modLibrary.seeHidden.effectJSON,
        revertable: true
      },
      actionState: {}
    },
  }

})
