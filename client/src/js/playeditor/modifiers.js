const modifiers = {
  pokemon: {
    arrowKeysBehavior: 'grid',
    tags: {
      gravity: false,
    },
    velocityMax: 0,
  },
  asteroids: {
    arrowKeysBehavior: 'velocity',
    tags: {
      gravity: false,
    },
    velocityMax: 400,
  },
  zelda: {
    arrowKeysBehavior: 'flatDiagonal',
    tags: {
      gravity: false,
    },
    velocityMax: 200,
  },
  mario: {
    arrowKeysBehavior: 'flatDiagonal',
    tags: {
      gravity: true,
    },
    jumpVelocity: -480,
    velocityMax: 480,
    velocityX: 0
  },
  chatter: {
    chat: ['Hello'],
  },
  bobthebuilder: {
    actionButtonBehavior: 'dropWall',
  }
}
export default modifiers
