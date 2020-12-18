global._randomizeWorldAmbientLight = function() {
  const ambientLight = global.getRandomFloat(0, .7)

  global.socket.emit('editGameState', { ambientLight })
}


global._randomizeDarkAreaAmbientLight = function(objects) {
  if(!Array.isArray(objects)) objects = GAME.objects

  const editedObjects = []

  objects.forEach((object) => {
    if(object.subObjects) {
      OBJECTS.forAllSubObjects(object.subObjects, (so) => {
        if(so.tags && so.tags.darkArea) {
          global.socket.emit('editSubObject', object.id, so.subObjectName, { ambientLight: global.getRandomFloat(0, .7) })
        }
      })
    }

    if(object.tags.darkArea) {
      editedObjects.push({
        id: object.id,
        ambientLight: global.getRandomFloat(0, .7)
      })
    }
  })
  if(editedObjects.length) {
    global.socket.emit('editObjects', editedObjects)
  }
}


global._randomizeLightColor = function(objects) {
  if(!Array.isArray(objects)) objects = GAME.objects

  const editedObjects = []

  objects.forEach((object) => {
    if(object.subObjects) {
      OBJECTS.forAllSubObjects(object.subObjects, (so) => {
        if(so.tags && so.tags.light) {
          global.socket.emit('editSubObject', object.id, so.subObjectName, { lightColor: global.generateRandomColor() })
        }
      })
    }

    if(object.tags.light) {
      editedObjects.push({
        id: object.id,
        lightColor: global.generateRandomColor()
      })
    }
  })
  if(editedObjects.length) {
    global.socket.emit('editObjects', editedObjects)
  }
}

global._randomizeLightPower = function(objects) {
  if(!Array.isArray(objects)) objects = GAME.objects

  const editedObjects = []

  objects.forEach((object) => {
    if(object.subObjects) {
      OBJECTS.forAllSubObjects(object.subObjects, (so) => {
        if(so.tags && so.tags.light) {
          global.socket.emit('editSubObject', object.id, so.subObjectName, { lightPower: global.getRandomInt(5, 30) })
        }
      })
    }

    if(object.tags.light) {
      editedObjects.push({
        id: object.id,
        lightPower: global.getRandomInt(5, 30)
      })
    }
  })
  if(editedObjects.length) {
    global.socket.emit('editObjects', editedObjects)
  }
}

global._randomizeLightOpacity = function(objects) {
  if(!Array.isArray(objects)) objects = GAME.objects

  const editedObjects = []

  objects.forEach((object) => {
    if(object.subObjects) {
      OBJECTS.forAllSubObjects(object.subObjects, (so) => {
        if(so.tags && so.tags.light) {
          global.socket.emit('editSubObject', object.id, so.subObjectName, { lightOpacity: global.getRandomFloat(.2, 1) })
        }
      })
    }

    if(object.tags.light) {
      editedObjects.push({
        id: object.id,
        lightOpacity: global.getRandomFloat(.2, 1)
      })
    }
  })
  if(editedObjects.length) {
    global.socket.emit('editObjects', editedObjects)
  }
}
