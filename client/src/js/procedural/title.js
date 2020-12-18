
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////
///TITLE
//////////
global.generateTitleTheme = function() {
  const newTitleTheme = GAME.theme.title || {}
  const indexAnimation = getRandomInt(0, global.titleAnimationStyles.length -1)
  newTitleTheme.animation = global.titleAnimationStyles[indexAnimation]
  const indexFont = getRandomInt(0, global.titleFontStyles.length -1)
  newTitleTheme.font = global.titleFontStyles[indexFont]
  global.socket.emit('updateTheme', { title: newTitleTheme })
}

global.generateTitleAnimation = function() {
  const newTitleTheme = GAME.theme.title || {}
  const indexAnimation = getRandomInt(0, global.titleAnimationStyles.length -1)
  newTitleTheme.animation = global.titleAnimationStyles[indexAnimation]
  global.socket.emit('updateTheme', { title: newTitleTheme })
}

global.generateTitleFont = function() {
  const newTitleTheme = GAME.theme.title || {}
  const indexFont = getRandomInt(0, global.titleFontStyles.length -1)
  newTitleTheme.font = global.titleFontStyles[indexFont]
  global.socket.emit('updateTheme', { title: newTitleTheme })
}
