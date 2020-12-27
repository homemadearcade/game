class SpriteEditor{
  open(objectSelected) {
    this.objectSelected = objectSelected

    const promise = Swal.fire({
      title,
      showClass: {
        popup: 'animated fadeInDown faster'
      },
      hideClass: {
        popup: 'animated fadeOutUp faster'
      },
      html:"<canvas id='sprite-editor'></canvas>",
      width: '840px'
    }).then(() => {

      app.stage.removeChildren()
    })

    const app = new PIXI.Application({
      backgroundColor: 0x000000, width: noiseNodes.length, height: noiseNodes[0].length, view: document.getElementById('sprite-editor')
    });

    app.renderer.preserveDrawingBuffer = true

    const texture = PIXIMAP.textures[gameObject.sprite]
    let sprite = new PIXI.Sprite(texture)
    app.stage.addChild(sprite)
  }

  close() {
    this.objectSelected = null
  }
}

global.SPRITEEDITOR = new SpriteEditor()
