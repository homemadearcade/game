global.radianCircle = 6.28319

global.local.on('onFirstPageGameLoaded', () => {
  global.subObjectLibrary = {
    potential: {
      relativeWidth: 0,
      relativeHeight: 0,
      relativeX: 0,
      relativeY: 0,
      tags: { potential: true},
    },
    heroInteractTriggerArea: {
      x: 0, y: 0, width: 40, height: 40,
      relativeWidth: GAME.grid.nodeSize * 2,
      relativeHeight: GAME.grid.nodeSize * 2,
      relativeX: 0,
      relativeY: 0,
      tags: { obstacle: false, invisible: true, heroInteractTriggerArea: true },
    },
    awarenessTriggerArea: {
      x: 0, y: 0, width: 40, height: 40,
      relativeWidth: GAME.grid.nodeSize * 12,
      relativeHeight: GAME.grid.nodeSize * 12,
      relativeX: 0,
      relativeY: 0,
      tags: { obstacle: false, invisible: true, awarenessTriggerArea: true, relativeToDirection: true, },
    },
    smallSword: {
      "relativeX": -0.5714285714286689,
      "relativeY": -30.28571646554127,
      "width": 31.42857142857156,
      "height": 16.571428571428555,
      x: 0, y: 0, width: 32, height: 32,
        // x: 0, y: 0, width: 40, height: 40,
        "relativeX": 0,
      	"relativeY": -17,
        relativeWidth: 0,
        relativeHeight: 0,
      // opacity: 1,
      name: 'Sword',
      subObjectName: 'sword',
      actionButtonBehavior: 'swing',
      actionProps: {
        debounceTime: 1,
      },
      tags: { rotateable: true, relativeToAngle: true, relativeToDirection: true, pickupable: true, pickupOnHeroInteract: true, equipOnPickup: true, onMapWhenEquipped: false, invisible: true },
    },
    sword: {
      "relativeX": 0.5714285714284415,
      "relativeY": -32.368877602421435,
      "width": 83.42857142857179,
      "height": 29.14285714285711,
      // opacity: 1,
      name: 'Sword',
      subObjectName: 'sword',
      actionButtonBehavior: 'swing',
      actionProps: {
        debounceTime: 1,
      },
      tags: { rotateable: true, relativeToAngle: true, relativeToDirection: true, pickupable: true, pickupOnHeroInteract: true, equipOnPickup: true, onMapWhenEquipped: false, invisible: true },
    },
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
      "triggers": {
        "addDialogueChoice": {
          "id": "addDialogueChoiceMod",
          "effectName": "temporaryDialogueChoice",
          "effectJSON": {
            "dialogueChoices": {
              "spearDialogueChoice": {
                "tags": {
                  "monster": true
                },
                "text": "Stab with spear",
                "guestEffect": "destroy"
              }
            }
          },
          "effectedTags": [
            "hero"
          ],
          "eventName": "onObjectAwake",
          "eventThreshold": -1,
          "initialTriggerPool": -1,
          "conditionValue": "spearDialogueChoice",
          "conditionType": "isSubObjectEquipped",
        }
      },
      tags: { rotateable: true, relativeToAngle: true, relativeToDirection: true, pickupable: true, pickupOnHeroInteract: true, equipOnPickup: true, onMapWhenEquipped: true },
    },
    evidenceChain1: {
      width: 10, height: 10,
      // subObjectName: 'evidenceChain1',
      "triggers": {
        "addDialogueChoiceMod": {
          "id": "addDialogueChoiceMod",
          "effectName": "temporaryDialogueChoice",
          "effectJSON": {
            "tags": {
              "monster": true
            },
            // lets call this choiceText
            "choiceText": "Present Evidence",
            "heroEffect": "addLibrarySubObject",
            "heroDialogueSet": 'Present Evidence',
            heroEffectProps: { effectLibrarySubObject: "evidenceChain2"},
            heroDialogue: [{
              ..._.cloneDeep(global.defaultDialogue),
              text: "You presented evidence 1"
            }],
            triggerPool: 1,
          },
          "effectValue": 'evidenceChain1',
          "effectedTags": [
            "hero"
          ],
          "eventName": "onObjectAwake",
          "eventThreshold": -1,
          "initialTriggerPool": -1,
          "conditionValue": "evidenceChain1",
          "conditionType": "isSubObjectInInventory",
        }
      },
      tags: { invisible: true, pickupable: true, pickupOnHeroInteract: true },
    },
    evidenceChain2: {
      width: 10, height: 10,
      // subObjectName: 'evidenceChain2',
      "triggers": {
        "addDialogueChoiceMod": {
          "id": "addDialogueChoiceMod",
          "effectName": "temporaryDialogueChoice",
          "effectJSON": {
            "tags": {
              "monster": true
            },
            "text": "Present Evidence",
            "heroEffect": "addLibrarySubObject",
            heroEffectProps: { effectLibrarySubObject: "evidenceChain3"},
            heroDialogue: [{
              ..._.cloneDeep(global.defaultDialogue),
              text: "You presented evidence 2"
            }],
            triggerPool: 1,
          },
          "effectValue": 'Present Evidence 2',
          "effectedTags": [
            "hero"
          ],
          "eventName": "onObjectAwake",
          "eventThreshold": -1,
          "initialTriggerPool": -1,
          "conditionValue": "evidenceChain2",
          "conditionType": "isSubObjectInInventory",
        }
      },
      tags: { invisible: true, pickupable: true, pickupOnHeroInteract: true },
    },
    gun: {
      x: 0, y: 0,
       // width: 10, height: 10,
      // relativeX: GAME.grid.nodeSize/5,
      // relativeY: -GAME.grid.nodeSize,
      "relativeX": 5.311320754717144,
      "relativeY": -19.329999815742894,
      "relativeWidth": -28,
      "relativeHeight": -20,
      "width": 4,
      "height": 12,
      // relativeWidth: -GAME.grid.nodeSize * .75,
      // relativeHeight: -GAME.grid.nodeSize * .75,
      // subObjectName: 'gun',
      tags: { rotateable: true, relativeToAngle: true, relativeToDirection: true, pickupable: true, pickupOnHeroInteract: true, equipOnPickup: true, onMapWhenEquipped: true },
      actionButtonBehavior: 'shoot',
      actionProps: {
        debounceTime: 1.2,
        shootVelocity: 600,
        // shootRadius: global.radianCircle,
        shootBulletsPerRound: 1,
        bulletJSON: {
          tags: {
            monsterDestroyer: true,
            destroyOnCollideWithObstacle: true,
            moving: true,
            destroySoon: true,
          }
        },
        color:'white',
      },
      actionState: {}
    },
    fireballGun: {
      "relativeX": 5.311320754717144,
			"relativeY": -19.329999815742894,
			"relativeWidth": -28,
			"relativeHeight": -20,
			"width": 4,
			"height": 12,
      tags: { rotateable: true, relativeToAngle: true, relativeToDirection: true, pickupable: true, pickupOnHeroInteract: true, equipOnPickup: true, onMapWhenEquipped: true },
      actionButtonBehavior: 'shoot',
      actionProps: {
        debounceTime: 1.2,
        shootVelocity: 600,
        // shootRadius: global.radianCircle,
        shootBulletsPerRound: 1,
        bulletJSON: {
          tags: {
            monsterDestroyer: true,
            destroyOnCollideWithObstacle: true,
            moving: true,
            destroySoon: true,
            emitter: true,
          },
          opacity: 0,
          emitterType: 'fireBall'
        }
      },
      actionState: {}
    },
    richochetGun: {
      "relativeX": 5.311320754717144,
      "relativeY": -19.329999815742894,
      "relativeWidth": -28,
      "relativeHeight": -20,
      "width": 4,
      "height": 12,
      tags: { rotateable: true, relativeToAngle: true, relativeToDirection: true, pickupable: true, pickupOnHeroInteract: true, equipOnPickup: true, onMapWhenEquipped: true },
      actionButtonBehavior: 'shoot',
      actionProps: {
        debounceTime: 1.2,
        shootVelocity: 600,
        // shootRadius: global.radianCircle,
        shootBulletsPerRound: 1,
        bulletJSON: {
          tags: {
            monsterDestroyer: true,
            moving: true,
            emitter: true,
            gravityY: true,
            richochet: true,
          },
          bouncyness: 20,
          opacity: 0,
          emitterType: 'fireBall'
        }
      },
      actionState: {}
    },
    randomGun: {
      "relativeX": 5.311320754717144,
			"relativeY": -19.329999815742894,
			"relativeWidth": -28,
			"relativeHeight": -20,
			"width": 4,
			"height": 12,
      tags: { rotateable: true, relativeToAngle: true, relativeToDirection: true, pickupable: true, pickupOnHeroInteract: true, equipOnPickup: true, onMapWhenEquipped: true },
      actionButtonBehavior: 'shoot',
      actionProps: {
        debounceTime: 1.2,
        shootVelocity: 600,
        // shootRadius: global.radianCircle,
        shootBulletsPerRound: 1,
        bulletJSON: {
          tags: {
            monsterDestroyer: true,
            destroyOnCollideWithObstacle: true,
            moving: true,
            destroySoon: true,
            emitter: true,
          },
          opacity: 0,
          emitterType: 'random-projectile'
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
        effectJSON: global.modLibrary.mario.effectJSON,
        revertable: true
      },
      actionState: {}
    },
    shrinkRay: {
      "relativeX": 5.311320754717144,
			"relativeY": -19.329999815742894,
			"relativeWidth": -28,
			"relativeHeight": -20,
			"width": 4,
			"height": 12,
      subObjectName: 'Shrink Ray',
      tags: { rotateable: true, relativeToAngle: true, relativeToDirection: true, pickupable: true, pickupOnHeroInteract: true, equipOnPickup: true, onMapWhenEquipped: true },
      actionButtonBehavior: 'shrink',
      actionProps: {
        distance: 1000,
        power: 100,
        tagsSeeking: ['obstacle'],
      },
      actionState: {}
    },
    randomLaser: {
      "relativeX": 5.311320754717144,
			"relativeY": -19.329999815742894,
			"relativeWidth": -28,
			"relativeHeight": -20,
			"width": 4,
			"height": 12,
      subObjectName: 'Shrink Ray',
      tags: { rotateable: true, relativeToAngle: true, relativeToDirection: true, pickupable: true, pickupOnHeroInteract: true, equipOnPickup: true, onMapWhenEquipped: true },
      actionButtonBehavior: 'shrink',
      emitterTypeAction: 'random-laser',
      actionProps: {
        distance: 1000,
        power: 100,
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
        startsPickedUp: true,
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
        effectJSON: global.modLibrary.seeThroughForeground.effectJSON,
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
        effectJSON: global.modLibrary.seeHidden.effectJSON,
        revertable: true
      },
      actionState: {}
    },
    engineTrail: {
    	"relativeX": -0.06607683749814441,
    	"relativeY": 12.282242966621993,
    	"tags": {
    		"subObject": true,
    		"relativeToDirection": true,
    		"relativeToAngle": true,
    		"rotateable": true,
    		"emitter": true,
    		"background": true,
    		"hasEngineTrail": true
    	},
    	// "subObjectName": "engineTrail",
    	"opacity": 0
    }
  }

  global.subObjectLibrary.addGameLibrary = function() {
    if(GAME.library.subObject) {
      return {
        ...GAME.library.subObject,
        ...global.subObjectLibrary,
        addGameLibrary: null
      }
    } else {
      return global.subObjectLibrary
    }
  }

})
