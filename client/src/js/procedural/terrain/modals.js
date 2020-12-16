import * as PIXI from 'pixi.js'
import Swal from 'sweetalert2/src/sweetalert2.js';
import tinycolor from 'tinycolor2';

window.elevationColors = {
  'Deep Water': parseInt(tinycolor('#00008b').toHex(), 16),
  'Water': parseInt(tinycolor('#4F42B5').toHex(), 16),
  Sand: parseInt(tinycolor('#ffe29c').toHex(), 16),
  Grass: parseInt(tinycolor('#567d46').toHex(), 16),
  Forest: parseInt(tinycolor('#1F3D0C').toHex(), 16),
  Mountain: parseInt(tinycolor('#5b5036').toHex(), 16),
  Snow: parseInt(tinycolor('#eee').toHex(), 16)
}


function viewNoiseData({noiseNodes, nodeProperty, title, type}) {

  const colorData = Object.keys(window.elevationColors).map((name) => {

  })
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
  }).then(() => {

    app.stage.removeChildren()
  })

  const app = new PIXI.Application({
    backgroundColor: 0x000000, width: noiseNodes.length, height: noiseNodes[0].length, view: document.getElementById('noise-viewer')
  });

  noiseNodes.forEach((row, x) => {
    row.forEach((node, y) => {
      const sprite = new PIXI.Sprite(PIXI.Texture.WHITE)
      // console.log(noise, (noise + 1)/2)

      const prop = node[nodeProperty].toFixed(2)
      if(type == 'terrain') {
        const terrainType = window.elevationIntegerLookup[prop]
        sprite.tint = window.elevationColors[terrainType]
        if(!terrainType) console.log(prop)
      } else if(type == 'water'){
        if (prop < 0.4) sprite.tint = 0x0000FF;
        else sprite.tint = 0xFFFFFF
      } else {
        sprite.tint = 0xFFFFFF
        sprite.alpha = prop
      }

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
