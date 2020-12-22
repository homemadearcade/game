const heroCompendium = {
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
     jumpVelocity: -440,
     velocityMax: 480,
   },
   chatter: {
     chat: ['Hello'],
     flags : {
       showDialogue: true,
       paused: true,
     }
   },
   bobthebuilder: {
     actionButtonBehavior: 'dropWall',
   }
}
export default heroCompendium
