window.local.on('onFirstPageGameLoaded', () => {
  window.particleEmitterLibrary = {
    groundDisturbanceRight: {"alpha":{"start":1,"end":1},"scale":{"start":0.35,"end":0.35,"minimumScaleMultiplier":0},"color":{"start":"#fff191","end":"#ff622c"},"speed":{"start":2000,"end":2000,"minimumSpeedMultiplier":2.2},"acceleration":{"x":0,"y":140000},"maxSpeed":8050,"startRotation":{"min":265,"max":275},"noRotation":false,"rotationSpeed":{"min":100,"max":10000},"lifetime":{"min":1.81,"max":1.56},"blendMode":"normal","frequency":0.091,"emitterLifetime":6,"maxParticles":3,"pos":{"x":0,"y":0},"addAtBack":false,"spawnType":"burst","spawnCircle":{"x":0,"y":0,"r":2,"minR":156},"particles":["https://pixijs.io/pixi-particles-editor/assets/images/particle.png","https://pixijs.io/pixi-particles-editor/assets/images/Fire.png"],"spawnWaitTime":10,"speedType":"normal","matchObjectColor":true,"scaleToGameObject":false,"particlesPerWave":3,"particleSpacing":26,"angleStart":323,"animationType":"particle"},
    groundDisturbanceLeft: {"alpha":{"start":1,"end":1},"scale":{"start":0.35,"end":0.35,"minimumScaleMultiplier":0},"color":{"start":"#fff191","end":"#ff622c"},"speed":{"start":2000,"end":2000,"minimumSpeedMultiplier":2.2},"acceleration":{"x":0,"y":140000},"maxSpeed":8050,"startRotation":{"min":265,"max":275},"noRotation":false,"rotationSpeed":{"min":100,"max":10000},"lifetime":{"min":1.81,"max":1.56},"blendMode":"normal","frequency":0.091,"emitterLifetime":6,"maxParticles":3,"pos":{"x":0,"y":0},"addAtBack":false,"spawnType":"burst","spawnCircle":{"x":0,"y":0,"r":2,"minR":156},"particles":["https://pixijs.io/pixi-particles-editor/assets/images/particle.png","https://pixijs.io/pixi-particles-editor/assets/images/Fire.png"],"spawnWaitTime":10,"speedType":"normal","matchObjectColor":true,"scaleToGameObject":false,"particlesPerWave":3,"particleSpacing":26,"angleStart":206,"animationType":"particle"},
    smallFire: {
      "alpha": {
        "start": 0.62,
        "end": 0
      },
      "scale": {
        "start": 0.3,
        "end": .6,
        "minimumScaleMultiplier": .05
      },
      "color": {
        "start": "#fff191",
        "end": "#ff622c"
      },
      "speed": {
        "start": 100,
        "end": 50,
        "minimumSpeedMultiplier": 1
      },
      "acceleration": {
        "x": 0,
        "y": 0
      },
      "maxSpeed": 0,
      "startRotation": {
        "min": 265,
        "max": 275
      },
      "noRotation": false,
      "rotationSpeed": {
        "min": 50,
        "max": 50
      },
      "lifetime": {
        "min": 0.01,
        "max": 0.1
      },
      "blendMode": "normal",
      "frequency": 0.001,
      "emitterLifetime": -1,
      "maxParticles": 1000,
      "pos": {
        "x": 0,
        "y": 0,
      },
      "addAtBack": false,
      "spawnType": "circle",
      "spawnCircle": {
        "x": 0,
        "y": 0,
        "r": 2,
      },
      scaleToGameObject: true, matchObjectColor: true, useUpdateOwnerPos: true,
      particles: ['https://pixijs.io/pixi-particles-editor/assets/images/particle.png', 'https://pixijs.io/pixi-particles-editor/assets/images/Fire.png']
    },
    engineTrail: {
      "alpha": {
        "start": 0.5,
        "end": 0.5
      },
      "scale": {
        "start": .4,
        "end": 1,
        "minimumScaleMultiplier": 1
      },
      "color": {
        "start": "#654321",
        "end": "#534f44"
      },
      "speed": {
        "start": 0,
        "end": 0,
        "minimumSpeedMultiplier": 1
      },
      "acceleration": {
        "x": 0,
        "y": 0
      },
      "maxSpeed": 0,
      "startRotation": {
        "min": 0,
        "max": 0,
      },
      "noRotation": false,
      "rotationSpeed": {
        "min": 0,
        "max": 0
      },
      "lifetime": {
        "min": 0.2,
        "max": 0.2
      },
      "blendMode": "normal",
      "frequency": 0.01,
      "emitterLifetime": -1,
      "maxParticles": 1000,
      "pos": {
        "x": 0,
        "y": 0
      },
      "addAtBack": true,
      "spawnType": "rect",
    	"spawnRect": {
    		"x": -20,
    		"y": -20,
    		"w": 40,
    		"h": 40
    	},
      useUpdateOwnerPos: true
    },
    trail: {
    	"alpha": {
    		"start": 0.5,
    		"end": 0.01
    	},
    	"scale": {
    		"start": 1,
    		"end": 1,
    		"minimumScaleMultiplier": 1
    	},
    	"color": {
    		"start": "#e3f9ff",
    		"end": "#0ec8f8"
    	},
    	"speed": {
    		"start": 0,
    		"end": 0,
    		"minimumSpeedMultiplier": 1
    	},
    	"acceleration": {
    		"x": 0,
    		"y": 0
    	},
    	"maxSpeed": 0,
    	"startRotation": {
    		"min": 0,
    		"max": 0
    	},
    	"noRotation": false,
    	"rotationSpeed": {
    		"min": 0,
    		"max": 0
    	},
    	"lifetime": {
    		"min": 0.025,
    		"max": 0.025
    	},
    	"blendMode": "normal",
    	"frequency": 0.001,
    	"emitterLifetime": -1,
    	"maxParticles": 1000,
    	"pos": {
    		"x": 0,
    		"y": 0
    	},
    	"addAtBack": false,
    	"spawnType": "point"
    },
    spinOff: {
    	"alpha": {
    		"start": 1,
    		"end": 1,
    	},
    	"scale": {
    		"start": 1,
    		"end": 1,
    		"minimumScaleMultiplier": 1
    	},
    	"color": {
    		"start": "#ffffff",
    		"end": "#757575"
    	},
    	"speed": {
    		"start": 40000,
    		"end": 40000,
    		"minimumSpeedMultiplier": 1
    	},
    	"acceleration": {
    		"x": 0,
    		"y": 0
    	},
    	"maxSpeed": 0,
    	"startRotation": {
    		"min": 0,
    		"max": 360,
    	},
    	"noRotation": false,
    	"rotationSpeed": {
    		"min": 20000,
    		"max": 20000
    	},
    	"lifetime": {
    		"min": 100,
    		"max": 100,
    	},
    	"blendMode": "normal",
    	"ease": [
    		{
    			"s": 0,
    			"cp": 0.329,
    			"e": 0.548
    		},
    		{
    			"s": 0.548,
    			"cp": 0.767,
    			"e": 0.876
    		},
    		{
    			"s": 0.876,
    			"cp": 0.985,
    			"e": 1
    		}
    	],
    	"frequency": 0.001,
    	"emitterLifetime": 100,
    	"maxParticles": 1,
    	"pos": {
    		"x": 0,
    		"y": 0
    	},
    	"addAtBack": true,
    	"spawnType": "point",
      useUpdateOwnerPos: true, persistAfterRemoved: true, scaleToGameObject: true, matchObjectColor: true
    },
    explode: {
    	"alpha": {
    		"start": 1,
    		"end": 1
    	},
    	"scale": {
    		"start": 1,
    		"end": 1,
    		"minimumScaleMultiplier": 1
    	},
    	"color": {
    		"start": "#ffffff",
    		"end": "#ffffff"
    	},
    	"speed": {
    		"start": 20000,
    		"end": 0,
    		"minimumSpeedMultiplier": 0.4
    	},
    	"acceleration": {
    		"x": 0,
    		"y": 0
    	},
    	"maxSpeed": 0,
    	"startRotation": {
    		"min": 0,
    		"max": 360
    	},
    	"noRotation": false,
    	"rotationSpeed": {
    		"min": 0,
    		"max": 0
    	},
    	"lifetime": {
    		"min": 1000,
    		"max": 1000
    	},
    	"blendMode": "normal",
    	"ease": [
    		{
    			"s": 0,
    			"cp": 0.329,
    			"e": 0.548
    		},
    		{
    			"s": 0.548,
    			"cp": 0.767,
    			"e": 0.876
    		},
    		{
    			"s": 0.876,
    			"cp": 0.985,
    			"e": 1
    		}
    	],
    	"frequency": 0.00001,
    	"emitterLifetime": 10,
    	"maxParticles": 12,
    	"pos": {
    		"x": 0,
    		"y": 0
    	},
    	"addAtBack": true,
    	"spawnType": "point",
      useUpdateOwnerPos: true, persistAfterRemoved: true, matchObjectColor: true,
    }
  }
})
