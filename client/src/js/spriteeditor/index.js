import tinycolor from 'tinycolor2'
import React from 'react'
import ReactDOM from 'react-dom'
import SpriteEditorTools from './SpriteEditorTools.jsx';

class HMap {
	constructor(img, offsetX = 0, offsetY = 0){
		this._w = img.width
		this._h = img.height
		this._offsetX = offsetX
		this._offsetY = offsetY
		this._data = this._getData(img)
	}

	_getData(img){
		const canvas = document.createElement('canvas')
		canvas.width = this._w
		canvas.height = this._h
		const context = canvas.getContext('2d', { alpha: true })
		context.drawImage(img, 0, 0, this._w, this._h)
		return context.getImageData(0, 0, this._w, this._h).data
	}

	pixel(x, y){
		if (
			x < this._offsetX ||
			x >= this._offsetX + this._w ||
			y < this._offsetY ||
			y >= this._offsetY + this._h
		) return [this._data[0], this._data[1], this._data[2], this._data[3]]
		const i = (y - this._offsetY) * this._w * 4 + (x - this._offsetX) * 4
		return [this._data[i], this._data[i+1], this._data[i+2], this._data[i+3]]
	}
}

class SpriteEditor{
  open(gameObject, cb) {
    this.objectSelected = gameObject

		if(gameObject.constructParts) {
			gameObject = gameObject.constructParts[0]
		}

    this.toolSelected = 'color'
    this.colorSelected = '#FFFFFF'
    const promise = Swal.fire({
      title: "Edit Sprite",
      showClass: {
        popup: 'animated fadeInDown faster'
      },
      hideClass: {
        popup: 'animated fadeOutUp faster'
      },
      html:`
        <canvas id='sprite-editor'></canvas><br></br>
        <div id='sprite-editor-color-selector'></div>
      `,
      width: '840px',
      showCancelButton: true,
    }).then((result) => {
      if(!result || !result.value) return
      this.saveAndUploadAppStage(() => {
        app.stage.removeChildren()
				cb()
      })
    })

    const size = 10
    this.brushSize = 0

    const app = new PIXI.Application({
      transparent: true,
       width: gameObject.width * size, height: gameObject.height * size, view: document.getElementById('sprite-editor')
    });
    this.app = app

    app.renderer.preserveDrawingBuffer = true

    const texture = PIXIMAP.textures[gameObject.defaultSprite]
    let pixiSprite = new PIXI.Sprite(texture)
    if(gameObject.color) pixiSprite.tint = parseInt(tinycolor(gameObject.color).toHex(), 16)
    if(!gameObject.color && gameObject.defaultSprite === 'solidcolorpixiSprite') pixiSprite.tint = parseInt(tinycolor(GAME.world.defaultObjectColor || window.defaultObjectColor).toHex(), 16)
    pixiSprite.transform.scale.x = (gameObject.width/pixiSprite.texture._frame.width)
    pixiSprite.transform.scale.y = (gameObject.height/pixiSprite.texture._frame.height)
    app.stage.addChild(pixiSprite)

    let image = app.renderer.plugins.extract.image(app.stage)
    image.width = gameObject.width
    image.height = gameObject.height
    image.classname ="crispSprite"

    let imageData = new HMap(image)
    imageData._data = app.renderer.plugins.extract.pixels(app.stage)

    app.stage.removeChildren()

    this.spritesGrid = []
    for(let x = 0; x < gameObject.width * size; x+= size) {
      for(let arrays = 0; arrays < size; arrays += 1) this.spritesGrid.push([])
      for(let y = 0; y < gameObject.height * size; y+= size) {

        const texture = PIXIMAP.textures['solidcolorsprite']
        let nodeSprite = new PIXI.Sprite(texture)

        let pixelX = 0
        let pixelY = 0
        if(x > 0) pixelX = x/size;
        if(y > 0) pixelY = y/size;

        let colorData = imageData.pixel(pixelX, pixelY)
        let color = parseInt(tinycolor({ r: colorData[0], g: colorData[1], b: colorData[2] }).toHex(), 16)

        for(let arrays3 = 0; arrays3 < size; arrays3 += 1) {
          for(let arrays2 = 0; arrays2 < size; arrays2 += 1) {
            this.spritesGrid[x + arrays3].push(nodeSprite)
          }
        }
        nodeSprite.tint = color
        nodeSprite.prevTint = nodeSprite.tint

        if(gameObject.sprite === 'solidcolorsprite' && !gameObject.tint) {
          nodeSprite.tint = parseInt(tinycolor(GAME.world.defaultObjectColor || window.defaultObjectColor).toHex(), 16)
        } if(colorData[3]) {
          nodeSprite.alpha = 1
        } else if(colorData[3] === 0){
          nodeSprite.alpha = 0
        }
        nodeSprite.x = x
        nodeSprite.y = y
        nodeSprite.width = size
        nodeSprite.height = size
        nodeSprite.interactive = true;
				nodeSprite.id = 'x:' + x + 'y:' + y
        nodeSprite
            .on('pointerdown', onButtonDown)
            .on('pointerup', onButtonUp)
            .on('pointerupoutside', onButtonUp)
            .on('pointerover', onButtonOver)
            .on('pointerout', onButtonOut);
        app.stage.addChild(nodeSprite)
      }
    }

    const ref = React.createRef()
    ReactDOM.render(
      React.createElement(SpriteEditorTools, { ref }),
      document.getElementById('sprite-editor-color-selector')
    )

    SPRITEEDITOR.toolsRef = ref
  }


  close() {
    this.objectSelected = null
  }


  saveRendererAsImageData(cb) {
    const renderer = this.app.renderer
    const sprite = this.app.stage
    const name = `spriteeditor-${global.uniqueID()}.png`

    renderer.render(sprite);
    const dataURI = renderer.view.toDataURL('image/png', 1)

    function urltoFile(url, filename, mimeType){
      return (fetch(url)
          .then(function(res){return res.arrayBuffer();})
          .then(function(buf){return new File([buf], filename,{type:mimeType});})
      );
    }

    urltoFile(dataURI, name, 'image/png').then(function(file){ cb(file, name) });
  }

  saveAndUploadAppStage(cb) {
    this.saveRendererAsImageData((file, name) => {
      PAGE.uploadToAws(file, name, (name, url) => {
        // add to textures here...
        if(!GAME.library.images) GAME.library.images = {}
        GAME.library.images[name] = {
          texture: true,
          name,
          url
        }
        // global.local.emit('onSendNotification', { playerUIHeroId: HERO.id, toast: true, text: 'Image saved'})
        global.socket.emit('updateLibrary', { images: GAME.library.images })
				if(SPRITEEDITOR.objectSelected.constructParts) {
					SPRITEEDITOR.objectSelected.constructParts.forEach((part) => {
						part.defaultSprite = name
					})
					MAPEDITOR.networkEditObject(SPRITEEDITOR.objectSelected, {id: SPRITEEDITOR.objectSelected.id, defaultSprite: name})
				} else {
					MAPEDITOR.networkEditObject(SPRITEEDITOR.objectSelected, {id: SPRITEEDITOR.objectSelected.id, defaultSprite: name})
				}
        cb()
        // console.log(name, url)
      })
    })
  }
}

function effectSprite(sprite) {
  if(!sprite) {
    // console.log('missing sprite')
    return
  }
  if(SPRITEEDITOR.toolSelected == 'color') {
    sprite.tint = parseInt(tinycolor(SPRITEEDITOR.colorSelected).toHex(), 16)
    sprite.alpha = 1
    sprite.erased = false
		sprite.prevTint = sprite.tint
  } else if(SPRITEEDITOR.toolSelected == 'eraser') {
    sprite.alpha = 0
    sprite.erased = true
    sprite.tint = null
  } else if(SPRITEEDITOR.toolSelected == 'select') {
    SPRITEEDITOR.toolsRef.current.selectColor( tinycolor(toColor(sprite.tint)).toHex() )
  }
}

function highlightSprite(sprite) {
  if(!sprite) {
    // console.log('missing sprite')
    return
  }
  if(sprite.highlighted) return

  sprite.prevTint = sprite.tint
  sprite.highlighted = true
  if(SPRITEEDITOR.toolSelected == 'color' || SPRITEEDITOR.toolSelected == 'bucket') {
    sprite.tint = parseInt(tinycolor(SPRITEEDITOR.colorSelected).toHex(), 16)
  } else if(SPRITEEDITOR.toolSelected == 'eraser') {
    // sprite.alpha = 0
    // sprite.erased = true
    // sprite.tint = null
  } else if(SPRITEEDITOR.toolSelected == 'select') {
    // SPRITEEDITOR.toolsRef.current.selectColor( tinycolor(toColor(sprite.tint)).toHex() )
  }

}

function onButtonDown() {
  SPRITEEDITOR.isMouseDown = true;
  if (this.isOver) {
		if(SPRITEEDITOR.toolSelected == 'bucket') {
			allNodesInArea(this, (sprite) => {
				sprite.tint = parseInt(tinycolor(SPRITEEDITOR.colorSelected).toHex(), 16)
				sprite.alpha = 1
				sprite.erased = false
				sprite.prevTint = sprite.tint
			})
		} else {
			allNodesWithinBrush(this, SPRITEEDITOR.brushSize + 4, effectSprite)
		}
    this.prevTint = this.tint
  }
}

function onButtonUp() {
  SPRITEEDITOR.isMouseDown = false;
}

function onButtonOver() {
  this.isOver = true;
  if(SPRITEEDITOR.isMouseDown) {
    allNodesWithinBrush(this, SPRITEEDITOR.brushSize + 4, effectSprite)
  }
  // console.log('highlighting')
  allNodesWithinBrush(this, SPRITEEDITOR.toolSelected == 'bucket' ? 1 : SPRITEEDITOR.brushSize + 4, highlightSprite)
}

function onButtonOut() {
  // console.log('unhighlight')
  // SPRITEEDITOR.spritesGrid.forEach((row) => {
  //   row.forEach((sprite) => {
  //     // console.log('reset', sprite.x, sprite.y)

  //   })
  // })
  allNodesWithinBrush(this, SPRITEEDITOR.brushSize + 4, (sprite) => {
    if(!sprite) {
      // console.log('no sprite unhighlight')
      return
    }
    sprite.tint = sprite.prevTint
    sprite.highlighted = false
    // console.log(sprite.x, sprite.y, sprite.tint, sprite.prevTint)
  })
  this.isOver = false;
}


// this doesnt work because of BS sizing stuff we do...
function allNodesInArea(node, fx) {
	const { spritesGrid } = SPRITEEDITOR

	let nodesToCheck = [node]
	let nodesToChange = [node]
	let nodesChecked = {}

	while (nodesToCheck.length) {
			let currentNode = nodesToCheck.pop()

			let x = currentNode.x
			let y = currentNode.y

			let x1 = x - 1
			let x2 = x + 1

			console.log(currentNode)

			if(spritesGrid[x1]) {
				// console.log('x1', x1)

				let n = spritesGrid[x1][y]
				if(n.prevTint == node.prevTint && !nodesChecked[n.displayOrder]) {
					nodesToChange.push(n)
					nodesToCheck.push(n)
					console.log('!')
					nodesChecked[n.displayOrder] = true
				}
			}

			if(spritesGrid[x2]) {
				// console.log('x2', x2)
				let n = spritesGrid[x2][y]
				if(n.prevTint == node.prevTint && !nodesChecked[n.displayOrder]) {
					nodesToChange.push(n)
					nodesToCheck.push(n)
					console.log('!!')

					nodesChecked[n.displayOrder] = true
				}
			}

			//
			// if(spritesGrid[x1]) {
			//
				let n = spritesGrid[x1][y + 1]
				if(n && n.prevTint == node.prevTint && !nodesChecked[n.displayOrder]) {
					nodesToChange.push(n)
					nodesToCheck.push(n)
					console.log('!y')

					nodesChecked[n.displayOrder] = true
				}

				let n2 = spritesGrid[x1][y - 1]
				if(n2 && n2.prevTint == node.prevTint && !nodesChecked[n2.displayOrder]) {
					nodesToChange.push(n2)
					nodesToCheck.push(n2)
					console.log('!!y')

					nodesChecked[n2.displayOrder] = true
				}

			// }


			// if(spritesGrid[x2]) {
			//
			// 	let n = spritesGrid[x2][y + 1]
			// 	if(n.prevTint == node.prevTint && !nodesChecked[n.displayOrder]) {
			// 		nodesToChange.push(n)
			// 		nodesToCheck.push(n)
			// 		nodesChecked[n.displayOrder] = true
			// 	}
			//
			// 	let n2 = spritesGrid[x2][y - 1]
			// 	if(n2.prevTint == node.tint && !nodesChecked[n2.displayOrder]) {
			// 		nodesToChange.push(n2)
			// 		nodesToCheck.push(n2)
			// 		nodesChecked[n2.displayOrder] = true
			// 	}
			// }
	}

	console.log(nodesToChange.length, nodesToCheck.length, nodesChecked)
	nodesToChange.forEach(fx)
}

function allNodesWithinBrush(node, size, fx) {
  let curr = size
  const { spritesGrid } = SPRITEEDITOR
  let x = node.x
  let y = node.y
  fx(node)
  while (curr > 0) {
      let x1 = x - curr
      let x2 = x + curr

      if(spritesGrid[x1]) {
        // console.log('x1', x1)
        fx(spritesGrid[x1][y])
      }
      if(spritesGrid[x2]) {
        // console.log('x2', x2)
        fx(spritesGrid[x2][y])
      }
      for (let i = 0; i < size; i++)
      {
          if(spritesGrid[x1]) {
            // console.log('y1', y + i + 1)
            // console.log('y2', y - (i + 1))

            fx(spritesGrid[x1][y + i + 1])
            fx(spritesGrid[x1][y - (i + 1)])
          }

          if(spritesGrid[x2]) {
            // console.log('did the same for second x')
            fx(spritesGrid[x2][y + i + 1])
            fx(spritesGrid[x2][y - (i + 1)])
          }
      }
      curr--;
  }
}

function toColor(num) {
    num >>>= 0;
    var b = num & 0xFF,
        g = (num & 0xFF00) >>> 8,
        r = (num & 0xFF0000) >>> 16,
        a = ( (num & 0xFF000000) >>> 24 ) / 255 ;
    return "rgba(" + [r, g, b, a].join(",") + ")";
}

global.SPRITEEDITOR = new SpriteEditor()
