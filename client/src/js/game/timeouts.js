function setDefault() {
  if(GAME.gameState) {
    GAME.gameState.timeouts = []
    GAME.gameState.timeoutsById = {}
  }
}

function onUpdate(delta) {
  GAME.gameState.timeouts.forEach((timeout) => {
    if(timeout.paused) return
    timeout.timeRemaining -= delta
    if(timeout.timeRemaining <= 0) {
      if(timeout.fx) timeout.fx()
      else console.log('timeout without fx...')
    }
  })

  GAME.gameState.timeouts = GAME.gameState.timeouts.filter((timeout) => {
    if(timeout.timeRemaining <= 0) {
      return false
    }
    return true
  })
}

function addTimeout(id, numberOfSeconds, fx) {
  clearTimeout(id)
  if(PAGE.role.isHost) {
    if(numberOfSeconds <= 0) {
      fx()
      return -1
    } else {
      let timeout = {
        id,
        timeRemaining: numberOfSeconds,
        totalTime: numberOfSeconds,
        fx,
        resetTotal: 0,
      }
      GAME.gameState.timeouts.push(timeout)
      GAME.gameState.timeoutsById[id] = timeout

      return id
    }
  }
}

function addOrResetTimeout(id, numberOfSeconds, fx) {
  if(!GAME.gameState.timeoutsById[id] || (GAME.gameState.timeoutsById[id] && GAME.gameState.timeoutsById[id].timeRemaining <= 0)) {
    GAME.addTimeout(id, numberOfSeconds, fx)
  } else {
    GAME.resetTimeout(id, numberOfSeconds)
  }

  return id
}

function resetTimeout(id, numberOfSeconds) {
  if(numberOfSeconds) GAME.gameState.timeoutsById[id].timeRemaining = numberOfSeconds
  else GAME.gameState.timeoutsById[id].timeRemaining = GAME.gameState.timeoutsById[id].totalTime

  // if(numberOfSeconds) GAME.gameState.timeoutsById[id].totalTime += numberOfSeconds
  // else GAME.gameState.timeoutsById[id].totalTime += GAME.gameState.timeoutsById[id].totalTime

  GAME.gameState.timeoutsById[id].resetTotal++
}

function incrementTimeout(id, numberOfSeconds) {
  GAME.gameState.timeoutsById[id].timeRemaining+= numberOfSeconds
  GAME.gameState.timeoutsById[id].totalTime+= numberOfSeconds
}

function completeTimeout(id) {
  GAME.gameState.timeoutsById[id].timeRemaining = 0
}

function clearTimeout(id) {
  GAME.gameState.timeouts = GAME.gameState.timeouts.filter((timeout) => {
    if(timeout.id === id) return false
    return true
  })
  delete GAME.gameState.timeoutsById[id]
}

function pauseTimeout(id) {
  GAME.gameState.timeoutsById[id].paused = true
}

function resumeTimeout(id) {
  GAME.gameState.timeoutsById[id].paused = false
}

function getTimeLeft(id) {
  return GAME.gameState.timeoutsById[id].timeRemaining
}

export default {
  setDefault,
  onUpdate,
  addTimeout,
  completeTimeout,
  clearTimeout,
  incrementTimeout,
  resetTimeout,
  addOrResetTimeout,
  pauseTimeout,
  resumeTimeout,
}
