import * as PIXI from 'pixi.js'
import Swal from 'sweetalert2/src/sweetalert2.js';
import tinycolor from 'tinycolor2';

function viewNoiseData(noiseNodes, title) {
  const promise = Swal.fire({
    title,
    showClass: {
      popup: 'animated fadeInDown faster'
    },
    hideClass: {
      popup: 'animated fadeOutUp faster'
    },
    html:"<canvas id='noise-viewer'></canvas>",
    width: '840px'
  })

  const app = new PIXI.Application({
    backgroundColor: 0x000000, width: noiseNodes.length, height: noiseNodes[0].length, view: document.getElementById('noise-viewer')
  });

  noiseNodes.forEach((row, x) => {
    row.forEach(({noise}, y) => {
      const sprite = new PIXI.Sprite(PIXI.Texture.WHITE)
      sprite.tint = 0xFFFFFF
      // console.log(noise, (noise + 1)/2)
      sprite.alpha = (noise + 1)/2
      sprite.x = x
      sprite.y = y
      sprite.width = 1
      sprite.height = 1
      //parseInt(tinycolor(color).toHex(), 16)

      app.stage.addChild(sprite);
    })
  })

  return promise
}

export {
  viewNoiseData
 }
