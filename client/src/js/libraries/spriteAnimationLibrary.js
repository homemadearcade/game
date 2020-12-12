window.local.on('onFirstPageGameLoaded', () => {
  window.spriteAnimationLibrary = {
    sword1: {
      textures: ['timefantasy-animations-sprite125', 'timefantasy-animations-sprite126', 'timefantasy-animations-sprite152', 'timefantasy-animations-sprite153', 'timefantasy-animations-sprite154', 'timefantasy-animations-sprite155'],
      correctiveAngle: 1.5708,
      scale: 2,
    }
  }

  window.spriteAnimationLibrary.addGameLibrary = function() {
    if(GAME.library.spriteAnimations) {
      return {
        ...GAME.library.spriteAnimations,
        ...window.spriteAnimationLibrary,
      }
    } else {
      return window.spriteAnimationLibrary
    }
  }
})
