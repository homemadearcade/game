import { getGameObjectStage, updateScale, updatePosition } from './utils'
import { updatePixiObject } from './objects'

setTimeout(() => {
PIXIMAP.onSpriteAnimation = function(object, animationName, options) {
  PIXIMAP.animateSprite(object, animationName, options)
}

PIXIMAP.animateSprite = function (object, animationName, options) {
  if(!options) options = {}
  const stage = getGameObjectStage({...object, tags: {...object.tags, emitter: true}})

  const animation = window.spriteAnimationLibrary.addGameLibrary()[animationName]
  if(!animation) return
  const textureArray = animation.textures.map((id) => PIXIMAP.textures[id])
  let animatedSprite = new PIXI.AnimatedSprite(textureArray, true);
  animatedSprite.autoUpdate = true
  animatedSprite.animationSpeed = options.speed || animation.speed || 1
  animatedSprite.loop = false
  const child = stage.addChild(animatedSprite)

  if(options.followObject) {
    child.animationName = animationName
    child.animationObject = object
    if(!PIXIMAP.followingAnimations[object.id]) PIXIMAP.followingAnimations[object.id] = []
    PIXIMAP.followingAnimations[object.id].push(child)
  }
  const copy = _.clone(object)

  if(animation.correctiveAngle) copy.angle += animation.correctiveAngle

  PIXIMAP.animations.push(child)
  // updatePosition(child, copy)
  // updateScale(child, copy)
  animatedSprite.onComplete = function () {
    stage.removeChild(child)

    if(options.followObject) {
      PIXIMAP.followingAnimations[object.id] = PIXIMAP.followingAnimations[object.id].filter((c) => {
        return c != child
      })
    }

    PIXIMAP.animations = PIXIMAP.animations.filter((c) => {
      return c != child
    })
  };
}
})
