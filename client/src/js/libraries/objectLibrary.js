global.local.on('onFirstPageGameLoaded', () => {
  global.objectLibrary = {
    default: {
      objectType: 'plainObject',
      tags: { obstacle: true },
    },
    obstacle: {
      objectType: 'plainObject',
      tags: { obstacle: true },
    },
    foreground: {
      objectType: 'plainObject',
      tags: { foreground: true },
    },
    background: {
      objectType: 'plainObject',
      tags: { background: true },
    },
    standingNPC: {
      objectType: 'plainObject',
      heroDialogueSets: {
        "default": {
          "dialogue": [{...global.defaultDialogue}]
        }
      },
      tags: { obstacle: true, talker: true, talkOnHeroInteract: true },
    },
    wanderingNPC: {
      objectType: 'plainObject',
      heroDialogueSets: {
        "default": {
          "dialogue": [{...global.defaultDialogue}]
        }
      },
      tags: { obstacle: true, wander: true, moving: true, talker: true, talkOnHeroInteract: true },
    },
    light: {
      objectType: 'plainObject',
      tags: {
        light: true,
      },
      defaultSprite: 'invisible',
      lightPower: 10,
      lightColor: 'white',
      lightOpacity: 1,
    },
    fire: {
      objectType: 'plainObject',
      tags: {
        emitter: true,
        light: true,
      },
      opacity: 0,
      emitterType: 'smallFire'
    },
    spawnZone: {
      objectType: 'plainObject',
      width: GAME.grid.nodeSize * 2,
      height: GAME.grid.nodeSize * 2,
      tags: {
        spawnZone: true,
        spawnRandomlyWithin: true,
        spawnOnInterval: true,
        spawnOverNonObstacles: true,
        invisible: true,
      },
      subObjects: {
        spawner: { tags: { potential: true } }
      },
      spawnLimit: -1, spawnPoolInitial: 1, subObjectChances: {'spawner': {randomWeight: 1, conditionList: null}}
    },
    resourceZone: {
      objectType: 'plainObject',
      width: GAME.grid.nodeSize * 2,
      height: GAME.grid.nodeSize * 2,
      subObjects: {
        resource: {
          subObjectName: 'resource',
          count: 0,
          tags: { potential: true, stackable: true, resource: true, pickupable: true, pickupOnHeroInteract: true }, count: 0 }
      },
      tags: { outline: true, resourceZone: true, resourceDepositAllOnCollide: false, resourceDepositOnInteract: true, resourceWithdrawOnInteract: true, popResourceCount: true },
      resourceWithdrawAmount: 1, resourceLimit: -1, resourceTags: { resource: true }
    },
    resource: {
      objectType: 'plainObject',
      subObjectName: 'resource',
      tags: { obstacle: true, stackable: true, resource: true, pickupable: true, pickupOnHeroInteract: true },
    },
    chest: {
      objectType: 'plainObject',
      tags: { obstacle: true, spawnZone: true, spawnAllInHeroInventoryOnHeroInteract: true, destroyOnSpawnPoolDepleted: true },
      subObjects: {
        spawner: { tags: { potential: true } }
      },
      spawnLimit: -1, spawnPoolInitial: 1, subObjectChances: {'spawner': {randomWeight: 1, conditionList: null}}
    },
    homing: {
      objectType: 'plainObject',
      tags: { obstacle: true, monster: true, moving: true, homing: true, targetHeroOnAware: true },
      subObjects: {
        // awarenessTriggerArea: {
        //   x: 0, y: 0, width: 40, height: 40,
        //   relativeWidth: GAME.grid.nodeSize * 12,
        //   relativeHeight: GAME.grid.nodeSize * 16,
        //   relativeX: 0,
        //   relativeY: -GAME.grid.nodeSize * 4,
        //   opacity: 0,
        //   tags: { obstacle: false, invisible: false, stationary: true, awarenessTriggerArea: true, relativeToDirection: true, },
        // }
        awarenessTriggerArea: {
          x: 0, y: 0, width: 40, height: 40,
          relativeWidth: GAME.grid.nodeSize * 12,
          relativeHeight: GAME.grid.nodeSize * 12,
          relativeX: 0,
          relativeY: 0,
          opacity: 0,
          tags: { obstacle: false, invisible: true, relativeToDirection: true, relativeToAngle: true, rotateable: true, awarenessTriggerArea: true },
        }
      }
    },
    welcomer: {
    	"objectType": "plainObject",
    	"tags": {
    		"obstacle": true,
    		"talker": true,
    		"talkOnHeroInteract": true,
    		"pathfindLoop": true,
    		"pathfindWait": true,
    		"moving": true,
    		"targetHeroOnAware": true,
    		"homing": true,
    		"targetResetEveryRound": true,
    		"autoTalkOnInteractable": true
    	},
      heroDialogueSets: {
        "default": {
          "dialogue": [{...global.defaultDialogue}]
        }
      },
    	"subObjects": {
    		"awarenessTriggerArea": {
    			"objectType": "subObject",
    			"width": 448,
    			"height": 384,
    			"tags": {
    				"subObject": true,
    				"awarenessTriggerArea": true,
    				"objectInteractTriggerArea": false,
    				"relativeToDirection": true,
    				"relativeToAngle": true,
    				"invisible": true,
    				"rotateable": true
    			},
    			"relativeX": 0,
    			"relativeY": 0,
    			"count": 1,
    			"subObjectName": "awarenessTriggerArea"
    		}
    	},
    	"triggers": {
    		"Switch to path after Dialogue Completed": {
    			"id": "Switch to path after Dialogue Completed",
    			"effectName": "mutate",
    			"effectJSON": {
    				"pathId": "object-891402034357",
    				"tags": {
    					"targetHeroOnAware": false,
    					"targetResetEveryRound": false
    				},
            "popoverText": null,
    				"_targetPursueId": null,
    				"path": null,
            "velocityX": null,
            "velocityY": null
    			},
    			"effectedOwnerObject": true,
    			"eventName": "onHeroDialogueComplete",
    			"eventThreshold": -1,
    			"initialTriggerPool": -1,
    		}
      },
      "popoverText": "!",
    },
    pacmanMonster: {
      objectType: 'plainObject',
      tags: { monster: true, moving: true, spelunker: true },
      color: 'cyan',
    },
    pacmanDot: {
      objectType: 'plainObject',
      width: 10,
      height: 10,
      tags: { coin: true, behaviorOnHeroCollide: true },
      color: 'yellow',
    },
    pacmanPowerup: {
      objectType: 'plainObject',
      tags: { heroUpdate: true, rotateable: true, realRotate: true, updateHeroOnHeroCollide: true, revertHeroUpdateAfterTimeout: true, oneTimeHeroUpdate: true, destroyAfterTrigger: true },
      color: 'yellow',
      heroUpdate: {
        tags: { monsterDestroyer: true },
        color: 'yellow',
      },
      powerUpTimer: 2,
    },
    marioPowerBlock: {
    	"objectType": "plainObject",
    	"tags": {
    		"obstacle": true,
    		// "interactable": true,
        "glowing": true,
    	},
    	"color": "#b71c1c",
    	"triggers": {
    		"turnIntoMario": {
    			"effectName": "libraryMod",
    			"effectedMainObject": true,
    			"sequenceType": "sequenceEffect",
    			"effector": "ownerObject",
    			"initialTriggerPool": -1,
    			"eventThreshold": -1,
    			"id": "turnIntoMario",
    			"eventName": "onHeroTouchStart",
    			"effectLibraryMod": "mario",
    		}
    	}
    },
    asteroidsPowerBlock: {
      "objectType": "plainObject",
      "tags": {
        "obstacle": true,
        "interactable": true
      },
      "color": "#9575cd",
      "triggers": {
        "turnIntoAsteroids": {
          "effectName": "libraryMod",
          "effectedMainObject": true,
          "sequenceType": "sequenceEffect",
          "effector": "ownerObject",
          "initialTriggerPool": -1,
          "eventThreshold": -1,
          "id": "turnIntoAsteroids",
          "eventName": "onHeroTouchStart",
          "effectLibraryMod": "asteroids",
        }
      }
    },
    ufoPowerBlock: {
      "objectType": "plainObject",
      "tags": {
        "obstacle": true,
        // "interactable": true,
        "rotateable": true,
        "realRotate": true,
      },
      "color": 'yellow',
      "triggers": {
        "turnIntoUfo": {
          "effectName": "libraryMod",
          "effectedMainObject": true,
          "sequenceType": "sequenceEffect",
          "effector": "ownerObject",
          "initialTriggerPool": -1,
          "eventThreshold": -1,
          "id": "turnIntoUfo",
          "eventName": "onHeroTouchStart",
          "effectLibraryMod": "ufo",
        }
      }
    },
    zeldaPowerBlock: {
      "objectType": "plainObject",
      "tags": {
        "obstacle": true,
        // "interactable": true
      },
      "color": "#33691e",
      "triggers": {
        "turnIntoZelda": {
          "effectName": "libraryMod",
          "effectedMainObject": true,
          "sequenceType": "sequenceEffect",
          "effector": "ownerObject",
          "initialTriggerPool": -1,
          "eventThreshold": -1,
          "id": "turnIntoZelda",
          "eventName": "onHeroTouchStart",
          "effectLibraryMod": "zelda",
        }
      }
    },
    starViewBlock: {
      "objectType": "plainObject",
      "tags": {
        "obstacle": true,
        // "interactable": true,
        "glowing": true,
      },
      // "color": "#fff9c4",
      "triggers": {
    		"goToStarView": {
    			"effectName": "starViewGo",
    			"effectedMainObject": true,
    			"sequenceType": "sequenceEffect",
    			"effector": "ownerObject",
    			"initialTriggerPool": 1,
    			"eventThreshold": -1,
    			"id": "goToStarView",
    			"eventName": "onHeroTouchStart",
    		}
    	},
    },
    starViewBlockBlue: {
      "objectType": "plainObject",
      "tags": {
        "obstacle": true,
        // "interactable": true,
        "glowing": true,
      },
      color: 'blue',
      "triggers": {
    		"goToStarView": {
    			"effectName": "starViewGo",
    			"effectedMainObject": true,
    			"sequenceType": "sequenceEffect",
    			"effector": "ownerObject",
    			"initialTriggerPool": 1,
    			"eventThreshold": -1,
    			"id": "goToStarView",
    			"eventName": "onHeroTouchStart",
    		}
    	},
    },
    gravityBlock: {
      "objectType": "plainObject",
      "tags": {
        "obstacle": true,
        "glowing": true,
        'heroUpdate': true,
        updateHeroOnHeroCollide: true,
        'oneTimeHeroUpdate': true,
      },
      heroUpdate: {
        tags: { gravityY: true },
      },
    },
    roof: {
      tags: {
        seeThroughOnHeroCollide: true,
        foreground: true,
      }
    },
  }

  global.objectLibrary.addGameLibrary = function() {
    if(GAME.library.object) {
      return {
        ...global.objectLibrary,
        ...GAME.library.object,
        addGameLibrary: null
      }
    } else {
      return global.objectLibrary
    }
  }
})
