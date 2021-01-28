function setDefault() {
  global.movementTags = {
    moving: {
      relatedTags: ['gravityY', 'pacer', 'spelunker', 'wander', 'lemmings', 'goomba', 'goombaSideways']
    },
    pacer: false,
    spelunker: false,
    lemmings: false,
    wander: false,
    goomba: false,
    goombaSideways: false,
    goDownOnCollideWithObstacle: false,
  }

  global.targetTags = {
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

  global.physicsTags = {
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
    oneWayPlatform: false,
    rotateable: {
      relatedTags: ['realRotate', 'realRotateFast', 'realRotateBackAndForth', 'realRotateBackAndForthFast']
    },
  }

  global.featureOptimizationTags = {
    // if this objects gets effected from collisions..?
    collideEffects: false,

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
    moving: global.movementTags.moving,

    trackObjectsTouching: false,

    seperateParts: false,

    // this deletes it after 60 seconds
    destroyEventually: false,

    // this deletes it after 10 seconds
    destroySoon: false,

    // this deletes it after 3 seconds
    destroyQuickly: false,
  }

  // global.otherTags = {
  //   removeAfterTrigger: false,
  //   showInteractBorder: false,
  // }

  global.combatTags = {
    monsterDestroyer: false,
    monsterVictim: {
      relatedTags: ['respawn']
    },
    monster:  {
      relatedTags: ['respawn']
    },
    respawn: false,
    destroyOnHeroLand: false,
    // knockBackOnHit,
    // explodeOnDestroy: false,
    // fadeOutOnDestroy,
    // flashWhiteOnHit,
  }

  global.behaviorTags = {
    coin: false,
    behaviorOnHeroCollide: false,
    behaviorOnHeroInteract: false,
    // behaviorOnDestroy: false,
  }

  global.resourceZoneTags = {
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

  global.projectileTags = {
    destroyOnCollideWithObstacle: false,
    richochet: false,
  }

  global.spawnZoneTags = {
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

  global.dialogueTags = {
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

  global.heroUpdateTags = {
    heroUpdate: false,
    oneTimeHeroUpdate: false,
    revertHeroUpdateAfterTimeout: false,
    incrementRevertHeroUpdateTimeout: false,
    updateHeroOnHeroCollide: false,
    updateHeroOnHeroInteract: false,
    // updateHeroOnDestroy: false,
  }

  global.questTags = {
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

  global.graphicalTags = {
    glowing: {
      relatedTags: ['stopGlowingOnTrigger']
    },
    outline: false,
    invisible: {
      relatedTags: ['cameraLock', 'darkArea', 'cameraZoomToFit']
    },
    tilingSprite: false, //cant change
    inputDirectionSprites: false,
    light: {
      relatedTags: ['randomLightColorChange', 'randomLightPowerChange', 'randomLightOpacityChange']
    },
    darkArea: false,
    showXWhenRemoved: false,
    showGraveWhenRemoved: false,
    showX: false,
    stopGlowingOnTrigger: false,
    // invisibleOnHeroCollide: false
    randomLightColorChange: {
      relatedTags: ['randomizeQuickly']
    },
    randomLightPowerChange: {
      relatedTags: ['randomizeQuickly']
    },
    randomLightOpacityChange: {
      relatedTags: ['randomizeQuickly']
    },
    randomColorChange: {
      relatedTags: ['randomizeQuickly']
    },
    randomizeQuickly: false,
    // randomColor: false,
  }

  global.cameraTags = {
    cameraShakeOnCollide_quickrumble: false,
    cameraShakeOnCollide_longrumble: false,
    cameraShakeOnCollide_quick: false,
    cameraShakeOnCollide_short: false,
    cameraShakeOnCollide_long: false,
    cameraLock: false,
    cameraZoomToFit: false,
    hidden: false,
    seeThroughOnHeroCollide: false,
    background: false,
    foreground: {
      relatedTags: ['seeThroughOnHeroCollide']
    },
  }

  global.inventoryTags = {
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

  global.particleTags = {
    emitter: false,
    hasTrail: false,
    hasEngineTrail: false,
    explodeOnDestroy: false,
    spinOffOnDestroy: false,
    poweredUp: false,
    groundDisturbanceOnHeroTouchStart: false,
    groundDisturbanceOnHeroTouchEnd: false,
  }

  global.puzzleTags = {
    puzzleStartOnHeroInteract: {
      relatedTags: ['destroyOnPuzzleSolved', 'spawnAllInHeroInventory']
    },
    destroyOnPuzzleSolved: false,
    spawnAllInHeroInventoryOnPuzzleSolved: false,
  }

  global.animationTags = {
    shake: false,
    realRotate: false,
    realRotateFast: false,
    realRotateBackAndForth: false,
    realRotateBackAndForthFast: false,

    pulseAlpha: false,
    pulseDarken: false,
    pulseLighten: false,
    fadeInOnInit: false,
    flipYAtMaxVelocity: false,
    shakeOnTrigger: false,
    flashOnTrigger: false,
    // realHover: false,
  }

  global.pathTags = {
    path: false,
    pathfindLoop: false,
    pathfindPatrol: false,
    pathfindDumb: false,
    pathfindWait: false,
    pathfindAvoidUp: false,
  }

  global.popoverTags = {
    popCountDownTimer: false,
    popResourceCount: false,
    popCount: false,
  }

  global.heroTags = {
    hero: true,
    centerOfAttention: false,
    disableUpKeyMovement: false,
    disableDownKeyMovement: false,
    seeThroughForegrounds: false,
    seeHiddenObjects: false,
    autoUpdateMaxVelocity: true,
  }

  global.subObjectTags = {
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

  global.effectTags = {
    increaseHeroCurrentVelocityOnTouchStart: false,
    increaseHeroLeftVelocityOnTouchStart: false,
    increaseHeroRightVelocityOnTouchStart: false,
    increaseHeroUpVelocityOnTouchStart: false,
    increaseHeroDownVelocityOnTouchStart: false,
    stopHeroOnTouchStart: false,
    tempModOnHeroCollide: false,
    skipHeroGravityOnCollide: false,
  }

  global.elementalTags = {
    water: false,
  }

  global.defaultTags = {
    ...global.puzzleTags,
    ...global.physicsTags,
    ...global.spawnZoneTags,
    ...global.resourceZoneTags,
    ...global.behaviorTags,
    ...global.combatTags,
    ...global.triggerTags,
    ...global.heroUpdateTags,
    ...global.heroTags,
    ...global.dialogueTags,
    ...global.questTags,
    ...global.movementTags,
    ...global.graphicalTags,
    ...global.cameraTags,
    ...global.particleTags,
    ...global.inventoryTags,
    ...global.animationTags,
    ...global.featureOptimizationTags,
    ...global.proceduralTags,
    ...global.projectileTags,
    ...global.pathTags,
    ...global.popoverTags,
    ...global.targetTags,
    ...global.subObjectTags,
    ...global.effectTags,
    ...global.elementalTags,
  }


  /// THESE TAGS BELOW ARENT USED... in the SAME WAY... I guess..
  global.descriptiveTags = {
    plain: false,
    hero: false,
    fresh: false,
    spawned: false,
    // npc: false,
    // alive: false,
    // removed: false,
    maze: false,
  }

  global.audioQualityTags = {
    walkRetro: false,
    walkVehicle: false,
    walkDescriptor: false,
    walkOverhead: false,
  }

  global.defaultHeroTags = {
    ...global.heroTags,
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

    groundDisturbanceOnHeroPowerLand: false,
    groundDisturbanceOnHeroGroundJump: false,
    groundDisturbanceOnHeroFloatJump: false,

    inputDirectionSprites: false,

    trackObjectsWithin: false,
    trackObjectsTouching: true,
    poweredUp: false,
    // allowCameraRotation: false,

    ...global.audioQualityTags,
  }

  global.generatedTags = {
    lastAnticipatedObject: false,
    fresh: false,
    adminInch: false,
    heroHomePlatform: false,
  }

  global.keyInputTags = {
    disableUpKeyMovement: false,
    disableDownKeyMovement: false,
  }

  global.tags = JSON.parse(JSON.stringify(global.defaultTags))

  global.allTags = {
    ...global.tags,
    // ...global.defaultHeroTags,
    ...global.descriptiveTags,
    ...global.generatedTags,
    ...global.audioQualityTags,
    // ...global.allDescriptors,
  }


  global.propertyTags = {
    ...global.combatTags,
    ...global.movementTags,
    ...global.physicsTags,

    glowing: global.graphicalTags.glowing,
    invisible: global.graphicalTags.invisible,

    shake: global.animationTags.shake,
    realRotate: global.animationTags.realRotate,
    realRotateFast: global.animationTags.realRotateFast,
    pulseAlpha: global.animationTags.pulseAlpha,
    pulseDarken: global.animationTags.pulseDarken,
    pulseLighten: global.animationTags.pulseLighten,

    //
    hasTrail: global.particleTags.hasTrail,
    explodeOnDestroy: global.particleTags.explodeOnDestroy,
    spinOffOnDestroy: global.particleTags.spinOffOnDestroy,

    ...global.cameraTags,
  }

}

function addGameTags(tags) {
  // Object.assign(global.tags, tags)
  Object.assign(global.allTags, tags)
}

export default {
  setDefault,
  addGameTags,
}
