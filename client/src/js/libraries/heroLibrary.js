global.local.on('onPageLoaded', () => {
  global.heroLibrary = {
    admin: {
      useGameDefault: false,
      JSON: {
        flags: {
          isAdmin: true,
        },
        tags: {
          hidden: true,
        }
      }
    },
    homemadeArcade: {
      useGameDefault: true,
      JSON: {
        tags: {
          saveAsDefaultHero: true,
          centerOfAttention: true,
          adminInch: false,
        }
      }
    },
    singlePlayer: {
      useGameDefault: true,
      JSON: {
        tags: {
          saveAsDefaultHero: true,
        }
      }
    },
    homeEditor: {
      useGameDefault: true,
      JSON: {
        flags: {
          homeEditor: true,
          showMapHighlight: true,
          constructEditorColor: true,
          constructEditorSprite: true,
          canStartStopGame: true,
          // canTakeMapSnapshots: true,
          hasManagementToolbar: true,
        },
        creator: {
          // selectColor: true,
          // selectSprite: true,
          // drawStructure: true,
          // drawBackground: true,
          // drawForeground: true,
          // standingNPC: true,
          // wanderingNPC: true,
          // spin: true,
          // mario: true,
          // zelda: true,
          // asteroids: true,
          // car: true,
          // ufo: true,
          // kirby: true,
          // snake: true,
        },
        heroMenu: {
          move: true,
          resize: true,
          // color: true,
          name: true,
          respawn: true,
          // properties: true,
          descriptors: true,
          spriteMenu: true,

          // physicsLive: true,
          // dialogue: true,
          // dialogueName: true,

          chooseColor: true,
          randomizeSprite: true,
          chooseSprite: true,
          drawSprite: true,
        },
        objectMenu: {
          move: true,
          resize: true,
          copy: true,
          // color: true,
          descriptors: true,
          name: true,
          // constructEditor: true,
          dialogue: true,
          dialogueSets: true,
          popover: true,
          group: true,
          // properties: true,
          spriteMenu: true,
          // physicsLive: true,

          chooseColor: true,
          randomizeSprite: true,
          chooseSprite: true,
          drawSprite: true,

          // particleEmitterRandomize: true,

          // pathEditor: true,
          delete: true,
        },
        worldMenu: {
          backgroundColor: true,
        },
        spriteSheets: global.spriteSheetIds
      }
    }
  }
})
