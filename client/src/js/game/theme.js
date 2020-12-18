
function setDefault() {
  global.defaultTheme = {
    audio: {},
    ss: {},
    spriteSheetAuthor: '',
    title: {
      animation: 'sunny mornings',
      font: {}
    }
  }

  global.resetThemeToDefault = function() {
    global.socket.emit('updateTheme', global.defaultTheme)
  }
}


export default {
  setDefault
}
