import tinycolor from 'tinycolor2'
import collisionsUtil from '../../utils/collisions'
import { Ease, ease } from 'pixi-ease'
import { GlowFilter, OutlineFilter, DropShadowFilter } from 'pixi-filters'

function setColor(pixiChild, data) {
  if(GAME.world.objectColorTint && GAME.world.objectColorTint != '#ffffff') {
    pixiChild.tint = getHexColor(GAME.world.objectColorTint)
  } else if(pixiChild.animationColor) {
    pixiChild.tint = getHexColor(pixiChild.animationColor)
  } else if(data.color) {
    pixiChild.tint = getHexColor(data.color)
  } else if(pixiChild.texture.id === 'solidcolorsprite') {
    if(GAME.world.defaultObjectColor) {
      pixiChild.tint = getHexColor(GAME.world.defaultObjectColor)
    } else {
      pixiChild.tint = getHexColor(global.defaultObjectColor)
    }
  } else {
    pixiChild.tint = 0xFFFFFF
  }
}

global.hexMap = {}
function getHexColor(color) {
  if(global.hexMap[color]) return global.hexMap[color]
  global.hexMap[color] = parseInt(tinycolor(color).toHex(), 16)
  return global.hexMap[color]
}

function darken(color, amount = 30) {
  return tinycolor(color).darken(amount).toString()
}

function lighten(color, amount = 30) {
  return tinycolor(color).lighten(amount).toString()
}

function startAnimation(type, pixiChild, gameObject) {
  if(type === 'fadeIn') {
    pixiChild.alpha = 0
    pixiChild.isAnimatingAlpha = true
    pixiChild.fadeIn = ease.add(pixiChild, { alpha: 1 }, { duration: 1000, ease: 'linear' })
    pixiChild.fadeIn.on('complete', () => {
      delete pixiChild.fadeIn
      pixiChild.isAnimatingAlpha = false
    })
  }
}

function stopPulse(pixiChild, type) {
  if(type === 'shake') {
    ease.removeEase(pixiChild, 'shake')
    pixiChild.isAnimatingPosition = false
    delete pixiChild.shakeEase
  }

  if(type === 'darken') {
    ease.removeEase(pixiChild, 'blend')
    pixiChild.isAnimatingColor = false
    delete pixiChild.pulseDarknessEase
  }

  if(type === 'lighten') {
    ease.removeEase(pixiChild, 'blend')
    pixiChild.isAnimatingColor = false
    delete pixiChild.pulseDarknessEase
  }

  if(type === 'flash') {
    ease.removeEase(pixiChild, 'tint')
    pixiChild.isAnimatingColor = false
    delete pixiChild.flashEase
  }


  if(type === 'alpha') {
    ease.removeEase(pixiChild, 'alpha')
    pixiChild.isAnimatingAlpha = false
    delete pixiChild.pulseAlphaEase
  }

  // if(type === 'flipY') {
  //   ease.removeEase(pixiChild, 'skewX')
  //   delete pixiChild.skewEase
  // }
}


function startPulse(pixiChild, gameObject, type) {
  if(type === 'flash') {
    const color = 'white'
    pixiChild.flashEase = ease.add(pixiChild, { tint: 0xFFFFFF }, { duration: 200, repeat: true })
    pixiChild.isAnimatingColor = true
  }

  if(type === 'darken') {
    const color = gameObject.color || GAME.world.defaultObjectColor
    pixiChild.pulseDarknessEase = ease.add(pixiChild, { blend: getHexColor(darken(color)) }, { repeat: true, duration: 1000, ease: 'linear' })
    pixiChild.isAnimatingColor = true
  }
  if(type === 'lighten') {
    const color = gameObject.color || GAME.world.defaultObjectColor
    pixiChild.pulseLightnessEase = ease.add(pixiChild, { blend: getHexColor(lighten(color)) }, { repeat: true, duration: 1000, ease: 'linear' })
    pixiChild.isAnimatingColor = true
  }

  // if(type === 'scale') {
  //   pixiChild.isAnimatingScale = ease.add(pixiChild, { scale: pixiChild.scale._x + 2 }, { reverse: true, repeat: true, duration: 1000, ease: 'linear' })
  // }

  if(type === 'alpha') {
    pixiChild.pulseAlphaEase = ease.add(pixiChild, { alpha: 0 }, { reverse: true, repeat: true, duration: 1000, ease: 'linear' })
    pixiChild.isAnimatingAlpha = true
  }

  if(type === 'shake') {
    pixiChild.shakeEase = ease.add(pixiChild, { shake: gameObject._shakePower || 5 }, { repeat: true, ease: 'linear' })
    pixiChild.isAnimatingPosition = true
  }
  //
  // if(type === 'flipY') {
  //   pixiChild.skewEase = ease.add(pixiChild, { skewX: 6.34 }, { repeat: true, ease: 'linear' })
  // }
}

function updatePosition(pixiChild, gameObject) {
  let camera = MAP.camera
  if(CONSTRUCTEDITOR.open) {
    camera = CONSTRUCTEDITOR.camera
  } else if(PATHEDITOR.open) {
    camera = PATHEDITOR.camera
  }

  const isContainer = pixiChild.children && pixiChild.children.length

  if(!gameObject.tags.light && gameObject.tags.rotateable) {
    if(isContainer) {
      pixiChild.pivot.set(gameObject.width/2, gameObject.height/2)
    } else {
      pixiChild.anchor.set(0.5, 0.5)
    }
    pixiChild.rotation = gameObject.angle || 0
    pixiChild.x = (gameObject.x + gameObject.width/2) * camera.multiplier
    pixiChild.y = (gameObject.y + gameObject.height/2) * camera.multiplier
  } else {
    if(typeof pixiChild.rotation === 'number') {
      if(pixiChild.pivot) {
        pixiChild.pivot.set(0, 0)
      } else if(pixiChild.anchor){
        pixiChild.anchor.set(0, 0)
      }
      pixiChild.rotation = null
    }

    if(pixiChild.shakeEase) {
      pixiChild.shakeEase.eases[0].start.x = (gameObject.x) * camera.multiplier
      pixiChild.shakeEase.eases[0].start.y = (gameObject.y) * camera.multiplier
    }

    if(!pixiChild.isAnimatingPosition){
      pixiChild.x = (gameObject.x) * camera.multiplier
      pixiChild.y = (gameObject.y) * camera.multiplier
    }

    if((gameObject._shakePower || gameObject.tags.shake) && !pixiChild.shakeEase) {
      startPulse(pixiChild, gameObject, 'shake')
    }
    if(!gameObject._shakePower && !gameObject.tags.shake && pixiChild.shakeEase) {
      stopPulse(pixiChild, 'shake')
    }

    if((gameObject._flashWhite) && !pixiChild.flashEase) {
      startPulse(pixiChild, gameObject, 'flash')
    }
    if(!gameObject._flashWhite && pixiChild.flashEase) {
      stopPulse(pixiChild, 'flash')
    }
  }
}

function updateAlpha(pixiChild, gameObject) {
  if(!pixiChild.isAnimatingAlpha) {
    if(typeof gameObject.opacity === 'number') {
      pixiChild.alpha = gameObject.opacity
    } else {
      pixiChild.alpha = 1
    }

    if(gameObject.tags.hidden) {
      if(GAME.heros[HERO.id].mod().tags.seeHiddenObjects) {
        pixiChild.alpha = 1
      } else if(gameObject.id === HERO.originalId) {
        pixiChild.alpha = .3
      } else {
        pixiChild.alpha = 0
      }
    } else if(gameObject.tags.foreground && gameObject.tags.seeThroughOnHeroCollide)  {
      if(isColliding(GAME.heros[HERO.id], gameObject) || GAME.heros[HERO.id].mod().tags.seeThroughForegrounds) {
        pixiChild.alpha = .2
      } else {
        pixiChild.alpha = 1
      }
    }
  }

  if(gameObject.tags.pulseAlpha && !pixiChild.pulseAlphaEase) {
    startPulse(pixiChild, gameObject, 'alpha')
  }

  if(!gameObject.tags.pulseAlpha && pixiChild.pulseAlphaEase) {
    stopPulse(pixiChild, 'alpha')
  }
}

function updateColor(pixiChild, gameObject) {
  if(!pixiChild.isAnimatingColor) {
    setColor(pixiChild, gameObject)
  }

  if(gameObject.tags.pulseDarken && !pixiChild.pulseDarknessEase) {
    startPulse(pixiChild, gameObject, 'darken')
    pixiChild.isAnimatingColor = true
  }
  if(!gameObject.tags.pulseDarken && pixiChild.pulseDarknessEase) {
    stopPulse(pixiChild, 'darken')
  }

  if(gameObject.tags.pulseLighten && !pixiChild.pulseLightnessEase) {
    startPulse(pixiChild, gameObject, 'lighten')
  }
  if(!gameObject.tags.pulseLighten && pixiChild.pulseLightnessEase) {
    stopPulse(pixiChild, 'lighten')
  }
}

function updateScale(pixiChild, gameObject) {
  let camera = MAP.camera
  if(CONSTRUCTEDITOR.open) {
    camera = CONSTRUCTEDITOR.camera
  } else if(PATHEDITOR.open) {
    camera = PATHEDITOR.camera
  }

  if(!pixiChild.isAnimatingScale) {
    if(gameObject.tags.tilingSprite && pixiChild.tileScale) {
      pixiChild.tileScale.x = (GAME.grid.nodeSize/pixiChild.texture._frame.width) * camera.multiplier
      pixiChild.tileScale.y = (GAME.grid.nodeSize/pixiChild.texture._frame.height) * camera.multiplier
      pixiChild.width = gameObject.width * camera.multiplier
      pixiChild.height = gameObject.height * camera.multiplier
    } else if(pixiChild.texture){
      pixiChild.transform.scale.x = (gameObject.width/pixiChild.texture._frame.width) * camera.multiplier
      pixiChild.transform.scale.y = (gameObject.height/pixiChild.texture._frame.height) * camera.multiplier
    }
  }
}

function updateSprite(pixiChild, gameObject) {
  /////////////////////
  /////////////////////
  // CHANGE SPRITE
  if(gameObject.tags.solidColor) {
    pixiChild.texture = PIXIMAP.textures['solidcolorsprite']
  } else {
    if(gameObject.sprites && gameObject.sprites.spawnPoolEmpty && gameObject.spawnPool == 0) {
      gameObject.sprite = gameObject.sprites.spawnPoolEmpty
    } else if(gameObject.isEquipped && gameObject.sprites && gameObject.sprites.equipped) {
      gameObject.sprite = gameObject.sprites.equipped
    } else if(gameObject.tags.inputDirectionSprites) {
      if(gameObject.inputDirection === 'right') {
        if(gameObject.rightSprite) {
          gameObject.sprite = gameObject.rightSprite
        } else gameObject.sprite = gameObject.defaultSprite
      }
      if(gameObject.inputDirection === 'left') {
        if(gameObject.leftSprite) {
          gameObject.sprite = gameObject.leftSprite
        } else gameObject.sprite = gameObject.defaultSprite
      }
      if(gameObject.inputDirection === 'up') {
        if(gameObject.upSprite) {
          gameObject.sprite = gameObject.upSprite
        } else gameObject.sprite = gameObject.defaultSprite
      }
      if(gameObject.inputDirection === 'down') {
        if(gameObject.downSprite) {
          gameObject.sprite = gameObject.downSprite
        } else gameObject.sprite = gameObject.defaultSprite
      }
    } else {
      if(gameObject.defaultSprite != gameObject.sprite) {
        gameObject.sprite = gameObject.defaultSprite
      }
    }

    if(!pixiChild.texture || gameObject.sprite != pixiChild.texture.id) {
      pixiChild.texture = PIXIMAP.textures[gameObject.sprite]
    }
  }
}

function getVisibility(pixiChild, gameObject) {
  if(gameObject.tags && gameObject.tags.potential) return true

  let invisible = gameObject.tags.outline || gameObject.tags.invisible || gameObject.removed || gameObject.constructParts

  // if(gameObject.removed && gameObject.tags.showXWhenRemoved) {
  //   // && !gameObject.tags.invisible && !gameObject.constructParts
  //   invisible = false
  // }

  if(gameObject.tags.subObject && gameObject.tags.onMapWhenEquipped) {
    if(gameObject.isEquipped && (gameObject.actionButtonBehavior !== 'toggle' || !gameObject._toggledOff)) invisible = false
    if(!gameObject.isEquipped || gameObject._toggledOff) invisible = true
  }

  if(CONSTRUCTEDITOR.open) {
    if(gameObject.tags.terrain && CONSTRUCTEDITOR.mapVisible.terrain === false) invisible = true
    if(gameObject.tags.background && CONSTRUCTEDITOR.mapVisible.background === false) invisible = true
    if(gameObject.tags.foreground && CONSTRUCTEDITOR.mapVisible.foreground === false) invisible = true
    if(gameObject.tags.hero && CONSTRUCTEDITOR.mapVisible.hero === false) invisible = true
    if(gameObject.id === 'globalConstructStationaryObstacle' && CONSTRUCTEDITOR.mapVisible.structure === false) invisible = true
    if(!gameObject.tags.background && !gameObject.tags.foreground && !gameObject.tags.hero && CONSTRUCTEDITOR.mapVisible.objects === false) invisible = true
  }

  if(PAGE.role.isAdmin) {
    if(!gameObject.tags.emitter) {
      if(!global.isObjectSelectable(gameObject)) invisible = true
    }
  }
  // if(invisible) console.log(gameObject.id, gameObject.tags.outline,gameObject.tags.invisible,gameObject.removed,gameObject.tags.potential,gameObject.constructParts)
  return invisible
}

function isColliding(hero, gameObject) {
  return collisionsUtil.checkObject(hero, gameObject)
}

function updateLight(pixiChild, gameObject) {
  // const isInvisible = getVisibility(pixiChild, gameObject)
  // remove if its invisible now

  // if (isInvisible) {
  //   pixiChild.visible = false
  //   return
  // } else {
  //   pixiChild.visible = true
  // }
  let camera = MAP.camera
  if(CONSTRUCTEDITOR.open) {
    camera = CONSTRUCTEDITOR.camera
  } else if(PATHEDITOR.open) {
    camera = PATHEDITOR.camera
  }

  if(!pixiChild.isAnimatingScale) {
    let lightPower = gameObject.lightPower/50
    if(typeof lightPower !== 'number' || isNaN(lightPower)) lightPower = .1
    lightPower -= GAME.gameState.ambientLight/5
    if(lightPower < .05) lightPower = .05
    let width = gameObject.width
    let height = gameObject.height
    if(width < GAME.grid.nodeSize) width = GAME.grid.nodeSize
    if(height < GAME.grid.nodeSize) height = GAME.grid.nodeSize
    pixiChild.transform.scale.x = (width * lightPower) * camera.multiplier
    pixiChild.transform.scale.y = (height * lightPower) * camera.multiplier
  }

  if(gameObject.lightOpacity >= 0 && typeof gameObject.lightOpacity === 'number') {
    pixiChild.alpha = gameObject.lightOpacity
  } else pixiChild.alpha = 1

  pixiChild.tint = getHexColor(gameObject.lightColor || 'white')

  updatePosition(pixiChild, gameObject)
  pixiChild.x += gameObject.width/2
  pixiChild.y += gameObject.height/2

  // if(!indoors && !GAME.world.tags.blockLighting && GAME.gameState.ambientLight >=0) {
  //   pixiChild.mask = PIXIMAP.outdoorShadow
  // }
}

function getGameObjectStage(gameObject) {
  let object = gameObject
  // if(gameObject.part) {
  //   object = OBJECTS.getObjectOrHeroById(gameObject.ownerId)
  // }
  // if(!object) console.log(gameObject, object)

  // if(gameObject.tags.darkArea) return PIXIMAP.darkAreaStage
  if((gameObject.tags.emitter) && gameObject.tags.background) return PIXIMAP.emitterBackgroundStage
  if((gameObject.tags.emitter) && gameObject.tags.foreground) return PIXIMAP.emitterForegroundStage
  if(gameObject.tags.emitter) return PIXIMAP.emitterObjectStage

  let stage = PIXIMAP.objectStage
  if(object.tags.foreground) stage = PIXIMAP.foregroundStage

  return stage
}

function updateChatBox(pixiChild, gameObject) {
  let shouldOpenPopover = false
  global.popoverProperties.forEach((prop) => {
    if(prop.tag) {
      if(gameObject[prop.prop] && gameObject.mod().tags[prop.tag]) shouldOpenPopover = true
    } else {
      if(gameObject[prop]) shouldOpenPopover = true
    }
  })

  if(shouldOpenPopover && !global.popoverOpen[gameObject.id]) {
    MAP.openPopover(gameObject)
  }

  if(!shouldOpenPopover && global.popoverOpen[gameObject.id]) {
    MAP.closePopover(gameObject.id)
  }

  if(gameObject.chat && !pixiChild.chatBox) {
    // let style = new PIXI.TextStyle({fontFamily: 'Courier', fontSize: 24 * MAP.camera.multiplier, wordWrap: true, "wordWrapWidth": 200,  fill: 0xFFFFFF, align: 'center'})
    // let textMetrics = PIXI.TextMetrics.measureText(gameObject.chat, style)
    //
    // const text = new PIXI.Text(gameObject.chat, style);
    // pixiChild.chatBox = PIXIMAP.objectStage.addChild(text)
    // pixiChild.chatBox.ownerName = gameObject.id
    // pixiChild.chatBox.isChat = true
    // pixiChild.chatBox.textWidth = textMetrics.width
    // pixiChild.chatBox.textHeight = textMetrics.height
    // pixiChild.chatBox.text = gameObject.chat
    // pixiChild.chatBox.visible = false
  }

  if(pixiChild.chatBox && !gameObject.chat) {
    // PIXIMAP.objectStage.removeChild(pixiChild.chatBox)
    // MAP.closePopover(gameObject)
    // delete pixiChild.chatBox
  }

  if(pixiChild.chatBox) {
    // if(gameObject.chat !== pixiChild.chatBox.text) {
    //   PIXIMAP.objectStage.removeChild(pixiChild.chatBox)
    //   MAP.closePopover(gameObject)
    //   delete pixiChild.chatBox
    //   return
    // }
    // updatePosition(pixiChild.chatBox, {...gameObject, x: gameObject.x - (pixiChild.chatBox.textWidth/2), y: gameObject.y - 18 - pixiChild.chatBox.textHeight })
  }
}

function createTriangle(xPos, yPos, i)
{
  var triangle = new PIXI.Graphics();

  triangle.x = xPos;
  triangle.y = yPos;

  var triangleWidth = 100,
      triangleHeight = triangleWidth,
      triangleHalfway = triangleWidth/2;

  // draw triangle
  triangle.beginFill(0xFF0000, 1);
  triangle.lineStyle(0, 0xFF0000, 1);
  triangle.moveTo(triangleWidth, 0);
  triangle.lineTo(triangleHalfway, triangleHeight);
  triangle.lineTo(0, 0);
  triangle.lineTo(triangleHalfway, 0);
  triangle.endFill();

  triangle.interactive = true;
  triangle.buttonMode = true;
  triangle.on("pointertap", function(e) {
    console.log(i);
  });

  pixi.stage.addChild(triangle);

//   var img = new PIXI.Sprite(triangle.generateTexture());
//   pixi.stage.addChild(img);

//   img.anchor.set(1);
//   TweenMax.set(img, {pixi:{rotation:180}}, 0);
}

function updateFilters(pixiChild, object) {
  /////////////////////
  /////////////////////
  // INTERACT HIGHLIGHT
  // if(object.tags.glowing || HERO.id && GAME.heros[HERO.id] && GAME.heros[HERO.id].interactableObjectId && object.id === GAME.heros[HERO.id].interactableObjectId) {
  //   pixiChild.filters = [new GlowFilter(12, 0xFFFFFF)];
  // } else {
  //   removeFilter(pixiChild, GlowFilter)
  // }
}

function addFilter(pixiChild, filter) {
  if(!pixiChild.filters) {
    pixiChild.filters = []
  }
  pixiChild.filters.push(filter)
}

function removeFilter(pixiChild, filterClass) {
  if(pixiChild.filters) {
    pixiChild.filters = pixiChild.filters.filter((filter) => {
      if(filter instanceof filterClass) return false
      return true
    })
  }
}

export {
  darken,
  lighten,
  getHexColor,
  getVisibility,
  setColor,
  startPulse,
  stopPulse,
  startAnimation,
  updatePosition,
  updateAlpha,
  updateColor,
  updateScale,
  updateSprite,
  updateLight,
  getGameObjectStage,
  isColliding,
  updateChatBox,
  updateFilters,
}
