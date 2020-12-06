window.defaultTheme = {
  audio: {},
  ss: {},
  spriteSheetAuthor: '',
  title: {
    animation: 'sunny mornings',
    font: {}
  }
}

window.resetThemeToDefault = function() {
  window.socket.emit('updateTheme', window.defaultTheme)
}
