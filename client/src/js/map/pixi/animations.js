import { getGameObjectStage, updatePosition, updateScale } from './utils'

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
  PIXIMAP.animations.push(child)

  const owner = OBJECTS.getObjectOrHeroById(object.id)
  PIXIMAP.updatePixiSpriteAnimation(child, owner)

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

PIXIMAP.updatePixiSpriteAnimation = function(sprite, gameObject) {
  const animationData = window.spriteAnimationLibrary.addGameLibrary()[sprite.animationName]

  const clone = _.clone(gameObject)
  if(animationData.relativeWidth) clone.width = gameObject.width + (animationData.relativeWidth)
  if(animationData.relativeHeight) clone.height = gameObject.height + (animationData.relativeHeight)

  if(gameObject.tags.rotateable) {
    let radians = 0
    radians = gameObject.angle
    var rotatedRelativeX = Math.cos(radians) * (animationData.relativeX) - Math.sin(radians) * (animationData.relativeY);
    var rotatedRelativeY = Math.sin(radians) * (animationData.relativeX) + Math.cos(radians) * (animationData.relativeY);

    clone.x = gameObject.x + rotatedRelativeX
    clone.y = gameObject.y + rotatedRelativeY

    clone.angle = radians
  } else {
    if(typeof animationData.relativeX === 'number') clone.x = gameObject.x + animationData.relativeX
    if(typeof animationData.relativeY === 'number') clone.y = gameObject.y + animationData.relativeY
  }

  if(animationData.correctiveAngle) {
    updatePosition(sprite, {...clone, angle: gameObject.angle + animationData.correctiveAngle})
  } else {
    updatePosition(sprite, clone)
  }

  if(animationData.scale) {
    if(animationData.correctiveAngle) {
      updateScale(sprite, {...clone, width: gameObject.height * animationData.scaleY, height: gameObject.width * animationData.scaleX})
    } else {
      updateScale(sprite, {...clone, width: gameObject.width * animationData.scaleX, height: gameObject.height * animationData.scaleY})
    }
  } else {
    updateScale(sprite, gameObject)
  }
}

})
