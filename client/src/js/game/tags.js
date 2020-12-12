function setDefault() {
  window.movementTags = {
    moving: {
      relatedTags: ['gravityY', 'pacer', 'spelunker', 'wander', 'lemmings', 'goomba', 'goombaSideways']
    },
    pacer: false,
    spelunker: false,
    lemmings: false,
    wander: false,
    goomba: false,
    goombaSideways: false,
  }

  window.targetTags = {
    homing: {
      relatedTags: ['targetAuto', 'targetBehind', 'targetResetEveryRound', 'targetHeroOnAware', 'targetVictimOnAware', 'targetSwitchOnAware', 'targetClearOnUnaware']
    },
    zombie: {
      relatedTags: ['targetAuto', 'targetBehind', 'targetResetEveryRound', 'targetHeroOnAware', 'targetVictimOnAware', 'targetSwitchOnAware', 'targetClearOnUnaware']
    },
    targetAuto: false,
    targetBehind: false,
    targetResetEveryRound: false,
    targetHeroOnAware: false,
    targetVictimOnAware: false,
    targetSwitchOnAware: false,
    targetClearOnUnaware: false,
  }

  window.physicsTags = {
    gravityY: false,
    ignoreWorldGravity: false,
    obstacle: {
      relatedTags: ['noMonsterAllowed', 'heroPushable']
    },
    // projectile: false,
    noMonsterAllowed: false,
    noHeroAllowed: false,
    movingPlatform: false,
    heroPushable: false,
    skipHeroGravityOnCollide: false,
    rotateable: {
      relatedTags: ['realRotate', 'realRotateFast']
    },
  }

  window.featureOptimizationTags = {
    //no awareness, oncollide, interact, correction, anything, NOTHING. Most performant
    notInCollisions: false,

    //skips correction phase ( it will not move! but it will have collision effects  )
    skipCorrectionPhase: false,

    //skips awareness areas if false
    noticeable: false,

    // skips objects within tracking if false
    trackObjectsWithin: false,

    // shows interact border and checks for interaction
    interactable: false,

    // allows corrections and physics movement
    moving: window.movementTags.moving,

    trackObjectsTouching: false,

    seperateParts: false,

    // this deletes it after 60 seconds
    destroyEventually: false,

    // this deletes it after 10 seconds
    destroySoon: false,

    // this deletes it after 3 seconds
    destroyQuickly: false,
  }

  // window.otherTags = {
  //   removeAfterTrigger: false,
  //   showInteractBorder: false,
  // }

  window.combatTags = {
    monsterDestroyer: false,
    monsterVictim: {
      relatedTags: ['respawn']
    },
    monster:  {
      relatedTags: ['respawn']
    },
    respawn: false,
    // knockBackOnHit,
    // explodeOnDestroy: false,
    // fadeOutOnDestroy,
    // flashWhiteOnHit,
  }

  window.behaviorTags = {
    coin: false,
    behaviorOnHeroCollide: false,
    behaviorOnHeroInteract: false,
    // behaviorOnDestroy: false,
  }

  window.resourceZoneTags = {
    resource: false,
    resourceZone: {
      relatedTags: ['popResourceCount', 'resourceDepositOnInteract', 'resourceDepositAllOnCollide', 'resourceWithdrawOnCollide', 'resourceWithdrawOnInteract']
    },
    resourceDepositOnInteract: false,
    resourceDepositAllOnCollide: false,
    resourceWithdrawOnInteract: false,
    resourceWithdrawOnCollide: false,
    // resourceOnMap: false,
    // resourceStealable: false,
    // resourceFlammable: false,
  }

  window.projectileTags = {
    destroyOnCollideWithObstacle: false,
  }

  window.spawnZoneTags = {
    spawnZone: {
      relatedTags: ['spawnRandomlyWithin', 'spawnOnInterval', 'spawnAllOnDestroy', 'spawnAllInHeroInventory', 'destroyOnSpawnPoolDepleted']
    },
    spawnRandomlyWithin: {
      relatedTags: ['spawnOverObstacles', 'spawnOverNonObstacles', 'spawnClearAllObjects', 'spawnClearSpawnedObjects']
    },
    spawnOnInterval: false,

    // spawnAllOnStart: false,
    // spawnOnHeroCollide: false,
    spawnAllOnDestroy: false,
    spawnAllInHeroInventoryOnHeroInteract: false,
    // spawnOnHeroInteract: false,
    // spawnDontOverlap: false
    spawnOverObstacles: false,
    spawnOverNonObstacles: false,
    spawnClearAllObjects: false,
    spawnClearSpawnedObjects: false,
    destroyOnSpawnPoolDepleted: false,
  }

  window.dialogueTags = {
    talker: {
      relatedTags: ['talkOnStart', 'talkOnHeroCollide', 'talkOnHeroInteract', 'oneTimeTalker', 'loopInteractionOnDialogueComplete', 'autoTalkOnInteractable'],
    },
    talkOnStart: false,
    talkOnHeroCollide: false,
    talkOnHeroInteract: false,
    // talkOnDestroy: false,
    oneTimeTalker: false,
    loopInteractionOnDialogueComplete: false,
    autoTalkOnInteractable: false,
  }

  window.heroUpdateTags = {
    heroUpdate: false,
    oneTimeHeroUpdate: false,
    revertHeroUpdateAfterTimeout: false,
    incrementRevertHeroUpdateTimeout: false,
    updateHeroOnHeroCollide: false,
    updateHeroOnHeroInteract: false,
    // updateHeroOnDestroy: false,
  }

  window.questTags = {
    questGiver: false,
    giveQuestOnStart: false,
    giveQuestOnHeroCollide: false,
    giveQuestOnHeroInteract: false,
    // giveQuestOnDestroy: false,
    questCompleter: false,
    completeQuestOnHeroCollide: false,
    completeQuestOnHeroInteract: false,
    // completeQuestOnDestroy: false,
  }

  window.graphicalTags = {
    glowing: {
      relatedTags: ['stopGlowingOnTrigger']
    },
    outline: false,
    invisible: {
      relatedTags: ['cameraLock', 'darkArea']
    },
    tilingSprite: false, //cant change
    inputDirectionSprites: false,
    light: false,
    darkArea: false,
    showXWhenRemoved: false,
    showX: false,
    stopGlowingOnTrigger: false,
    // invisibleOnHeroCollide: false

    // randomColor: false,
  }

  window.cameraTags = {
    cameraShakeOnCollide_quickrumble: false,
    cameraShakeOnCollide_longrumble: false,
    cameraShakeOnCollide_quick: false,
    cameraShakeOnCollide_short: false,
    cameraShakeOnCollide_long: false,
    cameraLock: false,
    hidden: false,
    seeThroughOnHeroCollide: false,
    background: false,
    foreground: {
      relatedTags: ['seeThroughOnHeroCollide']
    },
  }

  window.inventoryTags = {
    pickupable: {
      relatedTags: ['startsPickedUp', 'startsEquipped', 'dontDestroyOnPickup', 'pickupOnHeroCollide', 'pickupOnHeroInteract', 'equipOnPickup']
    },
    dontDestroyOnPickup: false,
    pickupOnHeroInteract: false,
    pickupOnHeroCollide: false,
    equipOnPickup: false,
    // potential: false,
    stackable: {
      relatedTags: ['popCount', 'showCountInHUD']
    },
    // dropOnOwnerDestroyed: false,
    startsPickedUp: false,
    startsEquipped: false,
    showCountInHUD: false,
  }

  window.particleTags = {
    emitter: false,
    hasTrail: false,
    hasEngineTrail: false,
    explodeOnDestroy: false,
    spinOffOnDestroy: false,
    poweredUp: false,
  }

  window.animationTags = {
    shake: false,
    realRotate: false,
    realRotateFast: false,
    pulseAlpha: false,
    pulseDarken: false,
    pulseLighten: false,
    fadeInOnInit: false,
    flipYAtMaxVelocity: false,
    shakeOnTrigger: false,
    flashOnTrigger: false,
    // realHover: false,
  }

  window.pathTags = {
    path: false,
    pathfindLoop: false,
    pathfindPatrol: false,
    pathfindDumb: false,
    pathfindWait: false,
    pathfindAvoidUp: false,
  }

  window.popoverTags = {
    popCountDownTimer: false,
    popResourceCount: false,
    popCount: false,
  }

  window.heroTags = {
    hero: true,
    centerOfAttention: false,
    disableUpKeyMovement: false,
    disableDownKeyMovement: false,
    seeThroughForegrounds: false,
    seeHiddenObjects: false,
    autoUpdateMaxVelocity: true,
  }

  window.subObjectTags = {
    subObject: {
      relatedTags: ['potential','onMapWhenEquipped', 'awarenessTriggerArea', 'relativeToDirection','relativeToAngle' ]
    },
    onMapWhenEquipped: false, //cant change,
    // showCountInHUD: false,
    heroInteractTriggerArea: false,
    awarenessTriggerArea: false,
    objectInteractTriggerArea: false,
    relativeToDirection: false,
    relativeToAngle: false,
    potential: false, //cant change
  }

  window.defaultTags = {
    ...window.physicsTags,
    ...window.spawnZoneTags,
    ...window.resourceZoneTags,
    ...window.behaviorTags,
    ...window.combatBehaviorTags,
    ...window.triggerTags,
    ...window.heroUpdateTags,
    ...window.dialogueTags,
    ...window.questTags,
    ...window.movementTags,
    ...window.graphicalTags,
    ...window.cameraTags,
    ...window.particleTags,
    ...window.inventoryTags,
    ...window.animationTags,
    ...window.featureOptimizationTags,
    ...window.proceduralTags,
    ...window.pathTags,
    ...window.popoverTags,
    ...window.targetTags,
    ...window.subObjectTags,
  }


  /// THESE TAGS BELOW ARENT USED... in the SAME WAY... I guess..
  window.descriptiveTags = {
    plain: false,
    hero: false,
    fresh: false,
    spawned: false,
    // npc: false,
    // alive: false,
    // removed: false,
    maze: false,
  }

  window.audioQualityTags = {
    walkRetro: false,
    walkVehicle: false,
    walkDescriptor: false,
    walkOverhead: false,
  }

  window.defaultHeroTags = {
    ...window.heroTags,
    respawn: true,
    gravityY: false,
    saveAsDefaultHero: false,

    monsterDestroyer: false,
    obstacle: false,
    rotateable: false,
    hidden: false,
    hasTrail: false,
    moving: true,
    noticeable: true,

    inputDirectionSprites: false,

    trackObjectsWithin: false,
    trackObjectsTouching: true,
    poweredUp: false,
    // allowCameraRotation: false,

    ...window.audioQualityTags,
  }

  window.generatedTags = {
    lastAnticipatedObject: false,
    fresh: false,
    adminInch: false,
    heroHomePlatform: false,
  }

  window.tags = JSON.parse(JSON.stringify(window.defaultTags))

  window.allTags = {
    ...window.tags,
    // ...window.defaultHeroTags,
    ...window.descriptiveTags,
    ...window.generatedTags,
    ...window.allDescriptors,
  }

  window.propertyTags = {
    ...window.combatTags,
    ...window.movementTags,
    ...window.physicsTags,

    glowing: window.graphicalTags.glowing,
    invisible: window.graphicalTags.invisible,

    shake: window.animationTags.shake,
    realRotate: window.animationTags.realRotate,
    realRotateFast: window.animationTags.realRotateFast,
    pulseAlpha: window.animationTags.pulseAlpha,
    pulseDarken: window.animationTags.pulseDarken,
    pulseLighten: window.animationTags.pulseLighten,

    //
    hasTrail: window.particleTags.hasTrail,
    explodeOnDestroy: window.particleTags.explodeOnDestroy,
    spinOffOnDestroy: window.particleTags.spinOffOnDestroy,

    ...window.cameraTags,
  }

}

function addGameTags(tags) {
  Object.assign(window.tags, tags)
  Object.assign(window.allTags, tags)
}

export default {
  setDefault,
  addGameTags,
}
