
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////
///TITLE
//////////
window.generateTitleTheme = function() {
  const newTitleTheme = GAME.theme.title || {}
  const indexAnimation = getRandomInt(0, window.titleAnimationStyles.length -1)
  newTitleTheme.animation = window.titleAnimationStyles[indexAnimation]
  const indexFont = getRandomInt(0, window.titleFontStyles.length -1)
  newTitleTheme.font = window.titleFontStyles[indexFont]
  window.socket.emit('updateTheme', { title: newTitleTheme })
}

window.generateTitleAnimation = function() {
  const newTitleTheme = GAME.theme.title || {}
  const indexAnimation = getRandomInt(0, window.titleAnimationStyles.length -1)
  newTitleTheme.animation = window.titleAnimationStyles[indexAnimation]
  window.socket.emit('updateTheme', { title: newTitleTheme })
}

window.generateTitleFont = function() {
  const newTitleTheme = GAME.theme.title || {}
  const indexFont = getRandomInt(0, window.titleFontStyles.length -1)
  newTitleTheme.font = window.titleFontStyles[indexFont]
  window.socket.emit('updateTheme', { title: newTitleTheme })
}
