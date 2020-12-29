import * as PIXI from 'pixi.js'
import Swal from 'sweetalert2/src/sweetalert2.js';
import tinycolor from 'tinycolor2';

function open(object, spriteName, ssauthor = 'unknown') {
  Swal.fire({
    title: 'Select a spritesheet author',
    showClass: {
      popup: 'animated fadeInDown faster'
    },
    hideClass: {
      popup: 'animated fadeOutUp faster'
    },
    input: 'select',
    inputOptions: Object.keys(global.spriteSheetAuthors),
  }).then((result) => {
    ssauthor = Object.keys(global.spriteSheetAuthors)[result.value]

    Swal.fire({
      title: 'Select sprite',
      showClass: {
        popup: 'animated fadeInDown faster'
      },
      hideClass: {
        popup: 'animated fadeOutUp faster'
      },
      html:"<canvas id='pixi-sprite-chooser'></canvas>",
      input: 'text',
      inputAttributes: {
        id: 'pixi-sprite-chosen',
        autocapitalize: 'off',
        value: object[spriteName],
      },
      width: '840px'
    }).then((result) => {
      if(result.value) {
        const { networkEditObject } = MAPEDITOR
        app.destroy(true)
        networkEditObject(object, { [spriteName]: result.value })
      }
    })

    const appWidth = 800
    const app = new PIXI.Application({
      width: appWidth, height: 1600, view: document.getElementById('pixi-sprite-chooser')
    });

    let y = 0
    let x = 0
    let rowMaxHeight = 0
    Object.keys(PIXIMAP.textures).forEach((textureId, index) => {
      const texture = PIXIMAP.textures[textureId]
      if(texture.ssauthor !== ssauthor) return
      const scale = 40/texture._frame.width
      const width = texture._frame.width * scale
      const height = texture._frame.height * scale

      let sprite = new PIXI.Sprite(texture)
      sprite.transform.scale.x = scale
      sprite.transform.scale.y = scale
      sprite.interactive = true

      sprite.x = x

      if(height > rowMaxHeight) {
        rowMaxHeight = height
      }

      if(x + width > appWidth) {
        y += rowMaxHeight
        rowMaxHeight = 0
        sprite.x = 0
        x = 0
      } else {
        x+= width
      }

      sprite.y = y

      sprite.on('pointerover', function() {
        this.tint = parseInt(tinycolor('green').toHex(), 16)
      })
      sprite.on('pointerout', function() {
        this.tint = 0xFFFFFF
      })
      sprite.on('click', function() {
        document.getElementById('pixi-sprite-chosen').value = this.texture.id
      })

      app.stage.addChild(sprite);
    })
  })
}

function openType(object, spriteName, type = 'recommended') {
  Swal.fire({
    title: 'Click to choose sprite',
    showClass: {
      popup: 'animated fadeInDown faster'
    },
    hideClass: {
      popup: 'animated fadeOutUp faster'
    },
    html:"<canvas id='pixi-sprite-chooser'></canvas>",
    // input: 'text',
    // inputAttributes: {
    //   id: 'pixi-sprite-chosen',
    //   autocapitalize: 'off',
    //   value: object[spriteName],
    // },
    width: '640px'
  }).then((result) => {
    // if(result.value) {
    //   const { networkEditObject } = MAPEDITOR
    //   app.destroy(true)
    //   networkEditObject(object, { [spriteName]: result.value })
    // }
  })

  const appWidth = 600
  const app = new PIXI.Application({
    transparent: true,
    width: appWidth, height: 400, view: document.getElementById('pixi-sprite-chooser')
  });

  let y = 0
  let x = 0
  let rowMaxHeight = 0

  let sprites = []
  if(object.descriptors && type === 'recommended') {
    sprites = global.findTexturesForDescriptors(object.descriptors, { alwaysSearchchildren: true })
  } else if(type === 'mysprites') {
    sprites = Object.keys(GAME.library.images).map((name) => {
      const imageData = GAME.library.images[name]
      if(imageData.texture) {
        return {
          id: name,
          textureId: imageData.name,
          ...global.tileMap[imageData.name],
          descriptors: {
            custom: true
          }
        }
      }
    }).filter((sprite) => {
      return !!sprite
    })
  }
  sprites.forEach(({textureId}, index) => {
    const texture = PIXIMAP.textures[textureId]
    // if(texture.ssauthor !== ssauthor) return
    const scale = 40/texture._frame.width
    const width = texture._frame.width * scale
    const height = texture._frame.height * scale

    let sprite = new PIXI.Sprite(texture)
    sprite.transform.scale.x = scale
    sprite.transform.scale.y = scale
    sprite.interactive = true
    sprite.alpha = .6

    sprite.x = x

    if(height > rowMaxHeight) {
      rowMaxHeight = height
    }

    if(x + width > appWidth) {
      y += rowMaxHeight
      rowMaxHeight = 0
      sprite.x = 0
      x = 0
    } else {
      x+= width
    }

    sprite.y = y

    sprite.on('pointerover', function() {
      this.alpha = 1
    })
    sprite.on('pointerout', function() {
      this.alpha = .6
    })
    sprite.on('click', function() {
      const { networkEditObject } = MAPEDITOR
      app.destroy(true)
      Swal.close()
      console.log(this.texture)
      networkEditObject(object, { [spriteName]: this.texture.id })
      // document.getElementById('pixi-sprite-chosen').value = this.texture.id
    })

    app.stage.addChild(sprite);
  })
}

export default {
  open,
  openType,
  // openMySprites,
}
