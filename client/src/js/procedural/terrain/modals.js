import * as PIXI from 'pixi.js'
import Swal from 'sweetalert2/src/sweetalert2.js';
import tinycolor from 'tinycolor2';

global.elevationColors = {
  'Deep Water': parseInt(tinycolor('#00008b').toHex(), 16),
  'Water': parseInt(tinycolor('#4F42B5').toHex(), 16),
  Sand: parseInt(tinycolor('#ffe29c').toHex(), 16),
  Grass: parseInt(tinycolor('#567d46').toHex(), 16),
  Forest: parseInt(tinycolor('#1F3D0C').toHex(), 16),
  Mountain: parseInt(tinycolor('#5b5036').toHex(), 16),
  Snow: parseInt(tinycolor('#eee').toHex(), 16)
}

global.heatColors = {
  'Coldest': parseInt(tinycolor('#00FFFF').toHex(), 16),
  'Colder': parseInt(tinycolor('#AAFFFF').toHex(), 16),
  'Cold': parseInt(tinycolor('#00CC99').toHex(), 16),
  'Warm': parseInt(tinycolor('#FFFF66').toHex(), 16),
  'Warmer': parseInt(tinycolor('#FF6600').toHex(), 16),
  'Warmest': parseInt(tinycolor('#EE1100').toHex(), 16),
}


function viewNoiseData({noiseNodes, nodeProperty, title, type, terrainData}) {

  const colorData = Object.keys(global.elevationColors).map((name) => {

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


      if(type == 'heat') {
        const prop = node.heat.toFixed(2)

        let heatType = global.heatIntegerLookup[prop]
        if(node.elevationBitmask != 15) {
          sprite.tint = 0x333
        } else {
          // console.log(heatType)
          if(!heatType) console.log(node.heat)
          sprite.tint = global.heatColors[heatType]
        }
      } else if(type == 'landwatergroups' && terrainData) {
        if(node.isFloodFilled) {
          if(node.isWater) {
            sprite.tint = global.elevationColors.Water
          }

          if(node.isLand) {
            if(terrainData.landMasses[node.landMassId].length < 10) {
              sprite.tint = global.elevationColors.Snow
            } else {
              sprite.tint = global.elevationColors.Grass
            }
          }
        }
      } else if(type == 'terrain') {
        const prop = node.elevation.toFixed(2)

        let terrainType = global.elevationIntegerLookup[prop]
        if(node.elevationBitmask != 15) {
          sprite.tint = 0x333
        } else {
          // console.log(terrainType)
          sprite.tint = global.elevationColors[terrainType]
        }
      } else if(type == 'water'){
        const prop = node.elevation.toFixed(2)

        if (prop < 0.4) sprite.tint = 0x0000FF;
        else sprite.tint = 0xFFFFFF
      } else if(nodeProperty){
        const prop = node[nodeProperty].toFixed(2)

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
