import collisions from '../../collisions'
import gridTool from '../../grid.js'
import JSONEditor from 'jsoneditor'
import camera from '../camera.js'

function init() {
  var objectjsoneditor = document.createElement("div")
  objectjsoneditor.id = 'objectjsoneditor'
  document.body.appendChild(objectjsoneditor);
  window.objecteditor = new JSONEditor(objectjsoneditor, {
    modes: ['tree', 'code'], search: false, onChangeJSON: (objectEdited) => {
    if(objectEdited.id) {
      let object = window.objectsById[objectEdited.id]

      if((object.tags.obstacle == true && objectEdited.tags.obstacle == false) || (object.tags.stationary == true && objectEdited.tags.stationary == false)) {
        gridTool.removeObstacle({...object, tags: objectEdited.tags})
      }

      if((object.tags.obstacle == false && objectEdited.tags.obstacle == true) || (object.tags.stationary == false && objectEdited.tags.stationary == true) || (object.tags.onlyHeroAllowed == false && objectEdited.tags.onlyHeroAllowed == true)) {
        gridTool.addObstacle({...object, tags: objectEdited.tags})
      }

      window.objecteditor.saved = false
      window.updateObjectEditorNotifier()
    } else {
      window.objecteditor.saved = false
      window.updateObjectEditorNotifier()
    }
  }});

  var sendObjectPos = document.getElementById("send-object-pos");
  sendObjectPos.addEventListener('click', () => {
    let editingObject = window.objecteditor.get();
    window.sendObjectUpdate({ x: editingObject.x, y: editingObject.y })
  })

  var sendObjectOther = document.getElementById("send-object-other");
  sendObjectOther.addEventListener('click', () => {
    let editingObject = window.objecteditor.get();
    window.sendObjectUpdateOther(editingObject)
  })

  var removeObjectButton = document.getElementById("remove-object");
  removeObjectButton.addEventListener('click', () => window.socket.emit('removeObject', window.objecteditor.get()))
  var deleteObjectButton = document.getElementById("delete-object");
  deleteObjectButton.addEventListener('click', () => window.socket.emit('deleteObject', window.objecteditor.get()))
  window.syncObjectsToggle = document.getElementById('sync-objects')
  window.syncObjectsToggle.onclick = (e) => {
    if(e.srcElement.checked) {
      window.socket.emit('updateWorld', { syncObjects: true })
    } else {
      window.socket.emit('updateWorld', { syncObjects: false })
    }
  }
  window.setObjectSpawnToggle = document.getElementById('set-spawn-object')
  window.selectorObjectToggle = document.getElementById('select-object')
  window.setObjectPathfindingLimitToggle = document.getElementById('set-pathfinding-limit')
}

window.updateEditorState = function() {
  window.objecteditor.update(window.objectsById[window.objecteditor.get().id])
}

window.sendObjectUpdate = function(objectUpdate) {
  let objectCopy = { ...objectUpdate }
  let editorState = window.objecteditor.get()
  let updatedObject = JSON.parse(JSON.stringify(window.objectsById[editorState.id]))
  if(window.objecteditor.live && editorState.id) {
    let updatedObject = window.objectsById[editorState.id]
    window.mergeDeep(updatedObject, objectUpdate)
    window.socket.emit('editObjects', window.objects)
  }
}

window.sendObjectUpdateOther = function(objectUpdate) {
  let objectCopy = { ...objectUpdate }
  let editorState = window.objecteditor.get()
  window.mergeDeep(window.objectsById[editorState.id], objectCopy)
  window.emitEditObjectsOther()
  window.objecteditor.saved = true
  window.updateObjectEditorNotifier()
}

window.emitEditObjectsOther = function() {
  window.socket.emit('editObjects', JSON.parse(JSON.stringify(window.objects)).map((obj) => {
    delete obj.x
    delete obj.y
    return obj
  }))
}

window.findObject = function() {
  let editorState = window.objecteditor.get()
  if(editorState.id) {
    camera.setCamera(ctx, editorState)
  }
}

function loaded() {
  window.objecteditor.saved = true
  window.objecteditor.update(window.defaultObject)
  window.updateObjectEditorNotifier()
  window.objecteditor.expandAll()

  if(window.world.syncObjects) {
    syncObjectsToggle.checked = true;
  }
}

export default {
  init,
  loaded,
}
