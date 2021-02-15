// function init() {
  // var saveCustomGameFx = document.getElementById("save-custom-fx");
  // saveCustomGameFx.addEventListener('click', () => {
  //   global.saveCodeEditor()
  // })

  // var resetCustomGameFx = document.getElementById("reset-custom-fx");
  // resetCustomGameFx.addEventListener('click', () => {
  //   global.resetCodeEditor()
  // })

  // global.overrideCustomGameCodeToggle = document.getElementById("override-custom-game").addEventListener('change', (e) => {
  //   global.socket.emit('updateWorld', { overrideCustomGameCode: e.target.checked})
  // })

window.local.on('onGameLoaded', () => {


  var editor = ace.edit("editor");
  editor.setTheme("ace/theme/monokai");
  editor.session.setMode("ace/mode/javascript");
  // editor.resize()
  if(!GAME.customFx) editor.setValue(global.templateGameString);
  else editor.setValue(GAME.customFx)
  
  editor.setOptions({
    fontSize: "20pt",
  });

  global.customGameEditor = editor
  // global.customGameEditor.session.on('change', function(delta) {
  //   if(document.getElementById("is-code-editor-saved").innerHTML) document.getElementById("is-code-editor-saved").innerHTML = "Not saved"
  // });

  // let codeEditorStorage = localStorage.getItem('codeEditor')
  // if(codeEditorStorage !== 'null' && codeEditorStorage !== 'undefined' && codeEditorStorage && codeEditorStorage.length > 3) {
  //   editor.setValue(localStorage.getItem('codeEditor'));
  //   setTimeout(() => {
  //     global.saveCodeEditor()
  //   }, 1000)
  // }

  global.saveCodeEditor = function() {
    try {
      let customFx = global.customGameEditor.getValue()
      global.ARCADE.evalLiveCustomFx(customFx)()
      global.socket.emit('updateCustomGameFx', customFx)
      localStorage.setItem('codeEditor', customFx)
    } catch (e) {
      console.log(e)
      document.getElementById("is-code-editor-saved").innerHTML = "THERE WAS AN ERROR IN FX CODE"
    }
  }

  global.resetCodeEditor = function() {
    global.customGameEditor.setValue(global.templateGameString);
    localStorage.setItem('codeEditor', null)
  }


})


  // document.body.addEventListener('click', function(e) {
  //   if(!e.target) return
  //      //when the document body is clicked
  //   if (e.target.className && e.target.className.indexOf('unload-game-fx-only') != -1) {
  //     global.socket.emit('customFxEvent', 'onGameUnload')
  //   } else if (e.target.className && e.target.className.indexOf('start-game-fx-only') != -1) {
  //     global.socket.emit('customFxEvent', 'onGameStart')
  //   } else if (e.target.className && e.target.className.indexOf('load-game-fx-only') != -1) {
  //     global.socket.emit('customFxEvent', 'onGameLoaded')
  //   }
  // })
// }
//
// export default {
//   init
// }
