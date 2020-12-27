import * as PIXI from 'pixi.js'
import Swal from 'sweetalert2/src/sweetalert2.js';
import tinycolor from 'tinycolor2';

global.biomeColors = {
  'Deep Water': parseInt(tinycolor('#00008b').toHex(), 16),
  'Water': parseInt(tinycolor('#4F42B5').toHex(), 16),
  'Colder Water': parseInt(tinycolor('#7777B5').toHex(), 16),
  'Coldest Water': parseInt(tinycolor('#9999B5').toHex(), 16),
  'Ice Water': parseInt(tinycolor('#bbbbB5').toHex(), 16),

  "Ice": parseInt(tinycolor('#FFFFFF').toHex(), 16),
  "Desert": parseInt(tinycolor('#eedd88').toHex(), 16),
  "Savanna": parseInt(tinycolor('#aacc77').toHex(), 16),
  "Tropical Rainforest": parseInt(tinycolor('#448822').toHex(), 16),
  "Tundra": parseInt(tinycolor('#668877').toHex(), 16),
  "Temperate Rainforest": parseInt(tinycolor('#225533').toHex(), 16),
  "Grassland": parseInt(tinycolor('#99dd66').toHex(), 16),
  "Seasonal Forest": parseInt(tinycolor('#556622').toHex(), 16),
  "Boreal Forest": parseInt(tinycolor('#667744').toHex(), 16),
  "Woodland": parseInt(tinycolor('#88aa66').toHex(), 16),
}

// Ice Water, Cold Water, Shallow Water/River, Deep Water

global.elevationColors = {
  'Deep Water': parseInt(tinycolor('#00008b').toHex(), 16),
  'Water': parseInt(tinycolor('#4F42B5').toHex(), 16),
  Shore: parseInt(tinycolor('#ffe29c').toHex(), 16),
  Mainland: parseInt(tinycolor('#567d46').toHex(), 16),
  Highland: parseInt(tinycolor('#1F3D0C').toHex(), 16),
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

global.moistureColors = {
  'Dryest': parseInt(tinycolor('#FF8811').toHex(), 16),
  'Dryer': parseInt(tinycolor('#EEEE11').toHex(), 16),
  'Dry': parseInt(tinycolor('#55FF00').toHex(), 16),
  'Wet': parseInt(tinycolor('#55FFFF').toHex(), 16),
  'Wetter': parseInt(tinycolor('#3355FF').toHex(), 16),
  'Wettest': parseInt(tinycolor('#000066').toHex(), 16),
}

function viewNoiseData({noiseNodes, nodeProperty, title, type, terrainData, rivers}) {

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

      if(type == 'biomes') {

        sprite.tint = global.biomeColors[node.biomeType]

        if(!global.biomeColors[node.biomeType]) console.log(node.biomeType, node.heatType, node.moistureType)

        // Water tiles
        if (node.elevationType == 'Deep Water') {
          sprite.tint = global.biomeColors['Deep Water'];
        } else if (node.elevationType == 'Water') {
          sprite.tint = global.biomeColors['Water'];
        }

        // draw rivers
        if (node.riverSize)
        {
            if (node.heatType == 'Coldest') {
              sprite.tint = global.biomeColors['Ice Water'];
            } else if (node.heatType == 'Colder') {
              sprite.tint = global.biomeColors['Colder Water'];
            } else if (node.HeatType == 'Cold') {
              sprite.tint = global.biomeColors['Cold Water'];
            } else {
              sprite.tint = global.biomeColors['Water'];
            }
        }

        // if () {
        // }

        // add a outline
        // if (node.biomeBitmask != 15 && node.elevation >= .5 && !node.riverSize)
        // {
        //   sprite.tint = 0x333
        // }
      } else if(type == 'moisture') {
        const prop = node.moisture.toFixed(2)

        let moistureType = global.moistureIntegerLookup[prop]
        if(node.elevationBitmask != 15) {
          sprite.tint = 0x333
        } else {
          // console.log(moistureType)
          if(!moistureType) console.log(node.moisture)
          sprite.tint = global.moistureColors[node.moistureType]
        }
      } else if(type == 'heat') {
        const prop = node.heat.toFixed(2)

        let heatType = global.heatIntegerLookup[prop]
        if(node.elevationBitmask != 15) {
          sprite.tint = 0x333
        } else {
          // console.log(heatType)
          if(!heatType) console.log(node.heat)
          sprite.tint = global.heatColors[node.heatType]
        }
      } else if(type == 'landwatergroups' && terrainData) {
        if(node.isFloodFilled) {
          if(node.isWater) {
            sprite.tint = global.elevationColors.Water
          }

          if(node.isLand) {
            // if(terrainData.landMasses[node.landMassId].length < 10) {
            //   sprite.tint = global.elevationColors.Snow
            // } else {
              sprite.tint = global.elevationColors.Mainland
            // }
          }
        }
      } else if(type == 'terrain') {
        // using this made things look REALLY cool
        // let terrainType = global.elevationIntegerLookup[node.elevationType]
        if(node.elevationBitmask != 15) {
          sprite.tint = 0x333
        } else {
          // console.log(terrainType)
          if(!node.elevationType) console.log('no type')
          sprite.tint = global.elevationColors[node.elevationType]
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

  if(rivers) {
    rivers.forEach(({nodes}) => {
      nodes.forEach((node) => {
        const sprite = new PIXI.Sprite(PIXI.Texture.WHITE)


        sprite.x = node.gridX
        sprite.y = node.gridY
        sprite.width = 1
        sprite.height = 1
        //parseInt(tinycolor(color).toHex(), 16)
        sprite.tint = 0xFF0000

        app.stage.addChild(sprite);
      })
    })
  }

  return promise
}

export {
  viewNoiseData
 }
