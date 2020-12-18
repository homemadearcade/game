global.local.on('onFirstPageGameLoaded', () => {
  global.spriteAnimationLibrary = {
    sword1: {
      textures: ['timefantasy-animations-sprite125', 'timefantasy-animations-sprite126', 'timefantasy-animations-sprite152', 'timefantasy-animations-sprite153', 'timefantasy-animations-sprite154', 'timefantasy-animations-sprite155'],
      correctiveAngle: 1.5708,
      scale: true,
      scaleX: 1.5,
      scaleY: 3,
      relativeY: 16,
      relativeX: 0,
    }
  }

  global.spriteAnimationLibrary.addGameLibrary = function() {
    if(GAME.library.spriteAnimations) {
      return {
        ...GAME.library.spriteAnimations,
        ...global.spriteAnimationLibrary,
        addGameLibrary: null
      }
    } else {
      return global.spriteAnimationLibrary
    }
  }
})
