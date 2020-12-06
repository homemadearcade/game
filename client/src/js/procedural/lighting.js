window._randomizeWorldAmbientLight = function() {
  const ambientLight = window.getRandomFloat(0, .7)

  window.socket.emit('editGameState', { ambientLight })
}


window._randomizeDarkAreaAmbientLight = function(objects) {
  if(!Array.isArray(objects)) objects = GAME.objects

  const editedObjects = []

  objects.forEach((object) => {
    if(object.subObjects) {
      OBJECTS.forAllSubObjects(object.subObjects, (so) => {
        if(so.tags && so.tags.darkArea) {
          window.socket.emit('editSubObject', object.id, so.subObjectName, { ambientLight: window.getRandomFloat(0, .7) })
        }
      })
    }

    if(object.tags.darkArea) {
      editedObjects.push({
        id: object.id,
        ambientLight: window.getRandomFloat(0, .7)
      })
    }
  })
  if(editedObjects.length) {
    window.socket.emit('editObjects', editedObjects)
  }
}


window._randomizeLightColor = function(objects) {
  if(!Array.isArray(objects)) objects = GAME.objects

  const editedObjects = []

  objects.forEach((object) => {
    if(object.subObjects) {
      OBJECTS.forAllSubObjects(object.subObjects, (so) => {
        if(so.tags && so.tags.light) {
          window.socket.emit('editSubObject', object.id, so.subObjectName, { lightColor: window.generateRandomColor() })
        }
      })
    }

    if(object.tags.light) {
      editedObjects.push({
        id: object.id,
        lightColor: window.generateRandomColor()
      })
    }
  })
  if(editedObjects.length) {
    window.socket.emit('editObjects', editedObjects)
  }
}

window._randomizeLightPower = function(objects) {
  if(!Array.isArray(objects)) objects = GAME.objects

  const editedObjects = []

  objects.forEach((object) => {
    if(object.subObjects) {
      OBJECTS.forAllSubObjects(object.subObjects, (so) => {
        if(so.tags && so.tags.light) {
          window.socket.emit('editSubObject', object.id, so.subObjectName, { lightPower: window.getRandomInt(5, 30) })
        }
      })
    }

    if(object.tags.light) {
      editedObjects.push({
        id: object.id,
        lightPower: window.getRandomInt(5, 30)
      })
    }
  })
  if(editedObjects.length) {
    window.socket.emit('editObjects', editedObjects)
  }
}

window._randomizeLightOpacity = function(objects) {
  if(!Array.isArray(objects)) objects = GAME.objects

  const editedObjects = []

  objects.forEach((object) => {
    if(object.subObjects) {
      OBJECTS.forAllSubObjects(object.subObjects, (so) => {
        if(so.tags && so.tags.light) {
          window.socket.emit('editSubObject', object.id, so.subObjectName, { lightOpacity: window.getRandomFloat(.2, 1) })
        }
      })
    }

    if(object.tags.light) {
      editedObjects.push({
        id: object.id,
        lightOpacity: window.getRandomFloat(.2, 1)
      })
    }
  })
  if(editedObjects.length) {
    window.socket.emit('editObjects', editedObjects)
  }
}
