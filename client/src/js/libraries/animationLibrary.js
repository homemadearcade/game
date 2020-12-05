window.local.on('onFirstPageGameLoaded', () => {
  window.particleEmitterLibrary = {
    gas: {
    	"alpha": {
    		"start": 0.4,
    		"end": 0
    	},
    	"scale": {
    		"start": 2,
    		"end": 0.4,
    		"minimumScaleMultiplier": 1
    	},
    	"color": {
    		"start": "#6bff61",
    		"end": "#d8ff4a"
    	},
    	"speed": {
    		"start": 1,
    		"end": 1,
    		"minimumSpeedMultiplier": 1
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
    		"min": .18,
    		"max": .2
    	},
    	"blendMode": "screen",
    	"frequency": 0.001,
    	"emitterLifetime": -1,
    	"maxParticles": 1000,
    	"pos": {
    		"x": 0.5,
    		"y": 0.5
    	},
    	"addAtBack": true,
    	"spawnType": "circle",
    	"spawnCircle": {
    		"x": 0,
    		"y": 0,
    		"r": 150
    	}
    },
    groundDisturbanceRight: {"alpha":{"start":1,"end":1},"scale":{"start":0.35,"end":0.35,"minimumScaleMultiplier":0},"color":{"start":"#fff191","end":"#ff622c"},"speed":{"start":2000,"end":2000,"minimumSpeedMultiplier":2.2},"acceleration":{"x":0,"y":140000},"maxSpeed":8050,"startRotation":{"min":265,"max":275},"noRotation":false,"rotationSpeed":{"min":100,"max":10000},"lifetime":{"min":1.81,"max":1.56},"blendMode":"normal","frequency":0.091,"emitterLifetime":6,"maxParticles":3,"pos":{"x":0,"y":0},"addAtBack":false,"spawnType":"burst","spawnCircle":{"x":0,"y":0,"r":2,"minR":156},"particles":["https://pixijs.io/pixi-particles-editor/assets/images/particle.png","https://pixijs.io/pixi-particles-editor/assets/images/Fire.png"],"spawnWaitTime":10,"speedType":"normal","matchObjectColor":true,"scaleToGameObject":false,"particlesPerWave":3,"particleSpacing":26,"angleStart":323,"animationType":"particle"},
    groundDisturbanceLeft: {"alpha":{"start":1,"end":1},"scale":{"start":0.35,"end":0.35,"minimumScaleMultiplier":0},"color":{"start":"#fff191","end":"#ff622c"},"speed":{"start":2000,"end":2000,"minimumSpeedMultiplier":2.2},"acceleration":{"x":0,"y":140000},"maxSpeed":8050,"startRotation":{"min":265,"max":275},"noRotation":false,"rotationSpeed":{"min":100,"max":10000},"lifetime":{"min":1.81,"max":1.56},"blendMode":"normal","frequency":0.091,"emitterLifetime":6,"maxParticles":3,"pos":{"x":0,"y":0},"addAtBack":false,"spawnType":"burst","spawnCircle":{"x":0,"y":0,"r":2,"minR":156},"particles":["https://pixijs.io/pixi-particles-editor/assets/images/particle.png","https://pixijs.io/pixi-particles-editor/assets/images/Fire.png"],"spawnWaitTime":10,"speedType":"normal","matchObjectColor":true,"scaleToGameObject":false,"particlesPerWave":3,"particleSpacing":26,"angleStart":206,"animationType":"particle"},

    fireBall: {
      acceleration: {x: 0, y: 0},
      addAtBack: false,
      alpha: {start: 0.5, end: 0.2},
      animationType: "particle",
      blendMode: "normal",
      color: {start: "#fce400", end: "#ff4e00"},
      emitterLifetime: -1,
      frequency: 0.001,
      lifetime: {min: 0.01, max: 0.01},
      maxParticles: 1000,
      maxSpeed: 0,
      noRotation: false,
      pos: {x: 0, y: 0},
      rotationSpeed: {min: 0, max: 20},
      scale: {start: 0.4, end: 0.7, minimumScaleMultiplier: 1},
      spawnCircle: {r: 24, minR: 0},
      spawnRect: { w: 200, h: 200, x: -100, y: -100},
      spawnType: "point",
      spawnWaitTime: 100,
      speed: {start: 1000, end: 200, minimumSpeedMultiplier: 1},
      speedType: "very fast",
      startRotation: {min: 0, max: 360},
      useUpdateOwnerPos: true,
    },
    smallFire: {
      images: {},
      "alpha": {
        "start": 1,
        "end": 1
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
      "speedType":"normal",
      useUpdateOwnerPos: true,
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
    		"x": -10,
    		"y": -10,
    		"w": 20,
    		"h": 20
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
      useOwnerSprite: true, useUpdateOwnerPos: true, persistAfterRemoved: true, scaleToGameObject: true, matchObjectColor: true
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
    },
    isolatedExplosion: {
    	"alpha": {
    		"start": 0.8,
    		"end": 0.1
    	},
    	"scale": {
    		"start": .5,
    		"end": 0.15,
    		"minimumScaleMultiplier": 1
    	},
    	"color": {
    		"start": "#fb1010",
    		"end": "#f5b830"
    	},
    	"speed": {
    		"start": 200,
    		"end": 100,
    		"minimumSpeedMultiplier": 1
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
    		"min": 0.05,
    		"max": 0.05
    	},
    	"blendMode": "normal",
    	"frequency": 0.0008,
    	"emitterLifetime": 0.031,
    	"maxParticles": 1000,
    	"pos": {
    		"x": 0,
    		"y": 0
    	},
    	"addAtBack": false,
    	"spawnType": "circle",
    	"spawnCircle": {
    		"x": 0,
    		"y": 0,
    		"r": 10
    	},
      useUpdateOwnerPos: true, persistAfterRemoved: true, matchObjectColor: true,
    },
    explosionCloud: {
    	"alpha": {
    		"start": 0.74,
    		"end": 0
    	},
    	"scale": {
    		"start": 5,
    		"end": 1.2,
    		"minimumScaleMultiplier": 1
    	},
    	"color": {
    		"start": "#ffdfa0",
    		"end": "#100f0c"
    	},
    	"speed": {
    		"start": 700,
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
    		"max": 360
    	},
    	"noRotation": false,
    	"rotationSpeed": {
    		"min": 0,
    		"max": 200
    	},
    	"lifetime": {
    		"min": 0.5,
    		"max": 1
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
    	"emitterLifetime": 0.1,
    	"maxParticles": 100,
    	"pos": {
    		"x": 0,
    		"y": 0
    	},
    	"addAtBack": true,
    	"spawnType": "point",
      useUpdateOwnerPos: true, persistAfterRemoved: true
    },
    raySplash: {
    	"alpha": {
    		"start": 0.8,
    		"end": 0.7
    	},
    	"scale": {
    		"start": 1,
    		"end": 0.3,
    		"minimumScaleMultiplier": 1
    	},
    	"color": {
    		"start": "#e3f9ff",
    		"end": "#0ec8f8"
    	},
    	"speed": {
    		"start": 200,
    		"end": 200,
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
    		"min": 0.8,
    		"max": 0.8
    	},
    	"blendMode": "normal",
    	"frequency": 0.2,
    	"emitterLifetime": 0.41,
    	"maxParticles": 1000,
    	"pos": {
    		"x": 0,
    		"y": 0
    	},
    	"addAtBack": false,
    	"spawnType": "burst",
    	"particlesPerWave": 8,
    	"particleSpacing": 45,
    	"angleStart": 0
    },
    pixiDust: {
    	"alpha": {
    		"start": 1,
    		"end": 0
    	},
    	"scale": {
    		"start": 0.1,
    		"end": 0.01,
    		"minimumScaleMultiplier": 1
    	},
    	"color": {
    		"start": "#e4f9ff",
    		"end": "#3fcbff"
    	},
    	"speed": {
    		"start": 200,
    		"end": 50,
    		"minimumSpeedMultiplier": 1
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
    		"min": 0.2,
    		"max": 0.8
    	},
    	"blendMode": "normal",
    	"frequency": 0.001,
    	"emitterLifetime": -1,
    	"maxParticles": 500,
    	"pos": {
    		"x": 0,
    		"y": 0
    	},
    	"addAtBack": false,
    	"spawnType": "circle",
    	"spawnCircle": {
    		"x": 0,
    		"y": 0,
    		"r": 0
    	}
    },
    bubbles: {
    	"alpha": {
    		"start": 1,
    		"end": 0.22
    	},
    	"scale": {
    		"start": 0.25,
    		"end": 0.75,
    		"minimumScaleMultiplier": 0.5
    	},
    	"color": {
    		"start": "#ffffff",
    		"end": "#ffffff"
    	},
    	"speed": {
    		"start": 200,
    		"end": 50,
    		"minimumSpeedMultiplier": 1
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
    		"max": 10
    	},
    	"lifetime": {
    		"min": 4,
    		"max": 4
    	},
    	"blendMode": "normal",
    	"frequency": 0.016,
    	"emitterLifetime": -1,
    	"maxParticles": 500,
    	"pos": {
    		"x": 0,
    		"y": 0
    	},
    	"addAtBack": false,
    	"spawnType": "point"
    },
    bubbleSpray: {
    	"alpha": {
    		"start": 1,
    		"end": 0.12
    	},
    	"scale": {
    		"start": 0.01,
    		"end": 0.8,
    		"minimumScaleMultiplier": 0.5
    	},
    	"color": {
    		"start": "#ffffff",
    		"end": "#ffffff"
    	},
    	"speed": {
    		"start": 600,
    		"end": 200,
    		"minimumSpeedMultiplier": 1
    	},
    	"acceleration": {
    		"x": 0,
    		"y": 0
    	},
    	"maxSpeed": 0,
    	"startRotation": {
    		"min": 260,
    		"max": 280
    	},
    	"noRotation": false,
    	"rotationSpeed": {
    		"min": 0,
    		"max": 10
    	},
    	"lifetime": {
    		"min": 0.5,
    		"max": 1
    	},
    	"blendMode": "normal",
    	"frequency": 0.008,
    	"emitterLifetime": 0.15,
    	"maxParticles": 500,
    	"pos": {
    		"x": 0,
    		"y": 0
    	},
    	"addAtBack": false,
    	"spawnType": "point"
    },
    snowScreen: {
    	"alpha": {
    		"start": 0.73,
    		"end": 0.46
    	},
    	"scale": {
    		"start": 0.15,
    		"end": 0.2,
    		"minimumScaleMultiplier": 0.5
    	},
    	"color": {
    		"start": "#ffffff",
    		"end": "#ffffff"
    	},
    	"speed": {
    		"start": 200,
    		"end": 200,
    		"minimumSpeedMultiplier": 1
    	},
    	"acceleration": {
    		"x": 0,
    		"y": 0
    	},
    	"maxSpeed": 0,
    	"startRotation": {
    		"min": 50,
    		"max": 70
    	},
    	"noRotation": false,
    	"rotationSpeed": {
    		"min": 0,
    		"max": 200
    	},
    	"lifetime": {
    		"min": 4,
    		"max": 4
    	},
    	"blendMode": "normal",
    	"ease": [
    		{
    			"s": 0,
    			"cp": 0.379,
    			"e": 0.548
    		},
    		{
    			"s": 0.548,
    			"cp": 0.717,
    			"e": 0.676
    		},
    		{
    			"s": 0.676,
    			"cp": 0.635,
    			"e": 1
    		}
    	],
    	"frequency": 0.004,
    	"emitterLifetime": -1,
    	"maxParticles": 1000,
    	"pos": {
    		"x": 0,
    		"y": 0
    	},
    	"addAtBack": false,
    	"spawnType": "rect",
    	"spawnRect": {
    		"x": -500,
    		"y": -300,
    		"w": 900,
    		"h": 20
    	},
      useUpdateOwnerPos: true
    },
    rainScreen: {
    	"alpha": {
    		"start": 0.5,
    		"end": 0.5
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
    		"start": 3000,
    		"end": 3000,
    		"minimumSpeedMultiplier": 1
    	},
    	"acceleration": {
    		"x": 0,
    		"y": 0
    	},
    	"maxSpeed": 0,
    	"startRotation": {
    		"min": 65,
    		"max": 65
    	},
    	"noRotation": false,
    	"rotationSpeed": {
    		"min": 0,
    		"max": 0
    	},
    	"lifetime": {
    		"min": 0.81,
    		"max": 0.81
    	},
    	"blendMode": "normal",
    	"frequency": 0.004,
    	"emitterLifetime": -1,
    	"maxParticles": 1000,
    	"pos": {
    		"x": 0,
    		"y": 0
    	},
    	"addAtBack": false,
    	"spawnType": "rect",
    	"spawnRect": {
    		"x": -600,
    		"y": -460,
    		"w": 900,
    		"h": 20
    	},
      useUpdateOwnerPos: true
    },
    bubbleScreen: {
    	"alpha": {
    		"start": 1,
    		"end": 0.22
    	},
    	"scale": {
    		"start": 0.25,
    		"end": 0.5,
    		"minimumScaleMultiplier": 0.5
    	},
    	"color": {
    		"start": "#ffffff",
    		"end": "#ffffff"
    	},
    	"speed": {
    		"start": 200,
    		"end": 200,
    		"minimumSpeedMultiplier": 1
    	},
    	"acceleration": {
    		"x": 0,
    		"y": 0
    	},
    	"maxSpeed": 0,
    	"startRotation": {
    		"min": 260,
    		"max": 280
    	},
    	"noRotation": false,
    	"rotationSpeed": {
    		"min": 0,
    		"max": 50
    	},
    	"lifetime": {
    		"min": 3.5,
    		"max": 4
    	},
    	"blendMode": "normal",
    	"frequency": 0.016,
    	"emitterLifetime": -1,
    	"maxParticles": 500,
    	"pos": {
    		"x": 0,
    		"y": 0
    	},
    	"addAtBack": false,
    	"spawnType": "rect",
    	"spawnRect": {
    		"x": -450,
    		"y": 200,
    		"w": 900,
    		"h": 0
    	},
      useUpdateOwnerPos: true
    },
    sparks: {
    	"alpha": {
    		"start": 1,
    		"end": 0.31
    	},
    	"scale": {
    		"start": 0.5,
    		"end": 1,
    		"minimumScaleMultiplier": 1
    	},
    	"color": {
    		"start": "#ffffff",
    		"end": "#9ff3ff"
    	},
    	"speed": {
    		"start": 1000,
    		"end": 200,
    		"minimumSpeedMultiplier": 1
    	},
    	"acceleration": {
    		"x": 0,
    		"y": 0
    	},
    	"maxSpeed": 0,
    	"startRotation": {
    		"min": 225,
    		"max": 320
    	},
    	"noRotation": false,
    	"rotationSpeed": {
    		"min": 0,
    		"max": 20
    	},
    	"lifetime": {
    		"min": 0.25,
    		"max": 0.5
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
    }
  }

  window.particleEmitterLibrary.addGameLibrary = function() {
    if(GAME.library.animations) {
      return {
        ...GAME.library.animations,
        ...window.particleEmitterLibrary,
      }
    } else {
      return window.particleEmitterLibrary
    }
  }
})
