class Tracking {
  onGameLoaded() {
    GAME.gameState.trackers = []
    GAME.gameState.trackersById = {}
  }

  //{ trackingObject, targetEvent, targetCount, targetTags }
  startTracking(tracker) {
    tracker.trackerId = 'tracker-' + global.uniqueID()
    tracker.count = 0
    GAME.gameState.trackers.push(tracker)
    return tracker
  }

  stopTracking(id) {
    if(GAME.gameState.trackers.length) GAME.gameState.trackers.forEach((tracker) => {
      if(id === tracker.trackerId) tracker.stopped = true
    })
  }

  tagMatch(targetTags, object) {
    return targetTags.some((tag) => {
      if(object.mod().tags[tag]) return true
    })
  }

  eventHappened(tracker, count = 1) {
    const { targetCount, trackingObject } = tracker
    tracker.count+= count
    if(targetCount) global.emitGameEvent('onUpdatePlayerUI', trackingObject)

    TRACKING.checkIfTrackerShouldStop(tracker)
  }

  checkIfTrackerShouldStop(tracker) {
    const { targetCount, trackingObject, onTargetCountReached } = tracker

    if(targetCount && tracker.count >= targetCount) {
      if(onTargetCountReached) onTargetCountReached()
      this.stopTracking(tracker.trackerId)
    }
  }

  onUpdate() {
    if(GAME.gameState.trackers.length) GAME.gameState.trackers.forEach((tracker) => {
      GAME.gameState.trackersById[tracker.trackerId] = tracker
      if(tracker.showTrackingNavigationTargets) {
        const possibleObjects = GAME.objectsByTag[tracker.targetTags[0]]
        if(possibleObjects && possibleObjects.length) {
          tracker.trackingObject.navigationTargetId = possibleObjects[0].id
        }
      }

      if(tracker.targetEvent === 'xInInventory') {
        const { trackingObject, targetTags, targetCount } = tracker

        let initialCount = tracker.count
        tracker.count = 0
        Object.keys(trackingObject.subObjects).forEach((soname) => {
          const so = trackingObject.subObjects[soname]

          if(so.inInventory && TRACKING.tagMatch(targetTags, so)) {
            tracker.count += (so.count || 1)
          }
        })

        if(targetCount && initialCount !== tracker.count) {
          global.emitGameEvent('onUpdatePlayerUI', trackingObject)
          TRACKING.checkIfTrackerShouldStop(tracker)
        }
      }
    })
  }

  onHeroTouchStart = (hero, object) => {
    if(GAME.gameState.trackers.length) GAME.gameState.trackers.forEach((tracker) => {
      if(tracker.stopped) return
      const { trackingObject, targetEvent, targetTags } = tracker
      if(targetEvent === 'touchX' &&
        trackingObject.id === hero.id &&
        this.tagMatch(targetTags, object)) {
          this.eventHappened(tracker)
      }
    })
  }

  onHeroPickup = (hero, object) => {
    if(GAME.gameState.trackers.length) GAME.gameState.trackers.forEach((tracker) => {
      if(tracker.stopped) return
      const { trackingObject, targetEvent, targetTags } = tracker
      if(targetEvent === 'collectX' &&
        trackingObject.id === hero.id &&
        this.tagMatch(targetTags, object)) {
          this.eventHappened(tracker, object.count || 1)
      }
    })
  }


  onHeroDrop = (hero, object) => {
    if(GAME.gameState.trackers.length) GAME.gameState.trackers.forEach((tracker) => {
      if(tracker.stopped) return
      const { trackingObject, targetEvent, targetTags } = tracker
      if(targetEvent === 'dropX' &&
        trackingObject.id === hero.id &&
        this.tagMatch(targetTags, object)) {
          this.eventHappened(tracker, object.count || 1)
      }
    })
  }

  onObjectDestroyed = (object, hero) => {
    if(GAME.gameState.trackers.length) GAME.gameState.trackers.forEach((tracker) => {
      if(tracker.stopped) return
      const { trackingObject, targetEvent, targetTags } = tracker
      if(targetEvent === 'destroyX' &&
        trackingObject.id === hero.id &&
        this.tagMatch(targetTags, object)) {
          this.eventHappened(tracker)
      }
    })
  }

  onHeroDestroyed = (object, hero) => {
    if(GAME.gameState.trackers.length) GAME.gameState.trackers.forEach((tracker) => {
      if(tracker.stopped) return
      const { trackingObject, targetEvent, targetTags } = tracker
      if(targetEvent === 'destroyX' &&
        trackingObject.id === hero.id &&
        this.tagMatch(targetTags, object)) {
          this.eventHappened(tracker)
      }
    })
  }
}

global.TRACKING = new Tracking()
