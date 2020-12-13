/*
// THE BEST FEATURES ARE THE ONES THAT THE PLAYER THINKS EXISTS BUT ACTUALLY DOESNT
// U CAN HAVE COOL GRAPHICS BUT IF THEY DONT MEAN ANYTHING MEANINGFUL TO THE GAMEPLAY IT DOESNT MATTER
////////////////////////////////////////////////////
////////////////////////////////////////////////////

CASUAL WORK
Make a particle effect - see list
Add a sprite sheet
Organize Audio files ( on Mac )
relatedTags in descriptors
tagDescriptions

-----

FINISH LINE

FILL OUT SEQUENCE EDITOR, LIBRARY, EFFECTS, TAGS
PUZZLE INTERFACES
  this https://github.com/alexeyivanov94/combination-lock-react FOR NUMBERS
  and a straight up password input for ALPHANUMERIC
  tag -- destroyOnPuzzleComplete
  tag -- spawnAllInHeroInventoryOnPuzzleComplete
  and then ud need a basic -- combination variable. Puzzle type + puzzle combination...  two variables?
COMBAT + GOALS + QUESTS

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

TODO RIGHT NOW

Basically sprites should be able to be OVER TAGGED
and object should be able to be UNDER TAGGED

children is broken
if you have a child descriptor, you can remove the parent descriptor
If you have a descriptor on an object that has a withDescriptors property, do a strict look for a sprite that matches that

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Home made arcade music

If an array changes we need to send the whole thing in the DIFF

Create new descriptor tag in sprite editor, it just adds the descriptor to the sprite

update prologue to incorporate new flow. Draw -> Describe -> Dialogue -> Decide Themes

experience password for ha-live. Use month+day - 100

STORY - Fade in/out to game (we will probably use this in HA opening animations..)
//^^ take a loot at animate.css which i think is already installed..

Filter for fish tank from pixi filter demo

////////////////////////////////
////////////////////////////////
SEQUENCE EDITOR UPGRADE
////////////////////////////////
Create
Editor
Animate
Sound
Mod honestly needs its own...
add object needs to be its own thing with effect, wait, condition, etc.
Its getting really complicated. For now im going to cheat it. It should have its own service and its own sequence type, feel me?
// onGameStart or onHeroLand sequences === automatically trigger on those events
Visalize sequences

////////////////////////////////
////////////////////////////////
QUESTS UPGRADE
////////////////////////////////
Add Quest starting, completing, and succeeding to effects
Auto Complete/Fail quest based on goals the quest has
View Quests UI in player menu
onSucceedSequence, onFailSequence

////////////////////////////////
////////////////////////////////
GOALS UPGRADE
////////////////////////////////
Goal number -> as many as possible ( so its just tracking basically )
Chances -> fail on death
a Score parameter on heros and objects? ( score holding vs score giving )
Win/Lose States that can connect to the meta of the engine ( picking new game or replaying current game )

////////////////////////////////
////////////////////////////////
COMBAT UPGRADE
////////////////////////////////
WHAT DID I LEARN FROM DIALOGUE SETS THAT I CAN APPLY TO HIS, like DestroysTags, DestroyedByTags, WeakTo, ResistantTo

Main questions for this upgrade is
  -- How to detect the destroyer! Thats key... how does _destroyedById work -- by weapon, by bullet, by player?
  -- How much damage does it do?
  -- Start with just rock paper scissors??
  -- The key to CONVENIENCE is also making sure this system works without TRIGGERS
  -- allow a system for pattern recognition ( with patterns, timing )? wow like punchout..

HP, DEFENSE, ATTACK, ETC, hittable, LIVES, respawn options,
VICTIMS, ENEMIES, NEUTRAL,
Rock Paper Scissors?
AGGRESIVE
level system, ranged attacks, etc
Game Over State
	specifically allow a hero to be destoyed and have the game run still?

////////////////////////////////
////////////////////////////////
SOUND AND PIXEL GENERATOR UPGRADE
////////////////////////////////

IN DATA -> add genre descriptors to sprites via the spritesheet tags?

audio right click -> set as ___ sound

Only allow the use of ONE descriptor for construct parts? Pre select a single descriptor before generating?

//FOR LIBRARY OBJECTS + OBJECTS ON MAP
speak SFX, destroy SFX, pickup SFX, dropSFX

FOR MODS
start SFX, endSFX, poweredUpParticle

ACTIONS
actionSFX

pick random song
randomize hero physics
gameTheme: ’scifi vs fantasy vs retro vs fun vs horror’. This effects title selection randomization, sprite sheet selection?? and audio generation

and randomize perhaps the camera filter!! <--- yes on camera filter and also dont forget about camera shakes too, those are good animations, or EASE! remember ease..

////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
###### BUGS
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
////////////////////////////////////////////////////

remove emitter /1000 thing.. in pixi map app

NON host
Popover text remove after NOT destroyed for yellow
White flash did not reset
Added/removed sub Objects?? DO not change via map state?
--

Trigger pool not getting reset?

YOU CANNOT MOD DIALOGUE OR ANY ARRAYS
heroDialogue is an array, what else is?
tagsSeeking for lasers, is an ARRAY right now...

If object is outside of its custom grid to start off, It will not be able to find the correct grid
Theres needs to be a flag, perhaps the _fresh flag that allows it to use the other pathfinding grid to make its away to the new path

Try uploading game JSON on non host

Construct Editor on ha-demo bug?
  bug - it seems if a world is too wide or something??
  theres a problem with the construct editor camera not being able
  to go far enough right or down

Bombs need to be able to spawn the explosion onto real objects

////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
LIBRARY IDEAS
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
////////////////////////////////////////////////////

//PARTICLES
  Special Explosions... for CRAZY particles. Overall having some objects tagged as like special particle explosion1,2,3 or special heroTouchStartParticle1,2,3

  After TeleDash
  object jump squeeze thing, ( with and height anim )

  // hero walking on certain objects??
  // funny thing with particle landing... LOL even if you land on a LIVE DUDE ASS u skim off some of his particles. Ill need a quality tag for 'earth' vs 'human' or something like. 'scrapeable?'

  Jump sparks.. to show motion?

  General glow around hero

  Use copy of heros sprite for DASHES?
  select particle sprite via sprite selector?
  useColorPallete from sprite<---

  Falling down action, like being destroyed like a castle
  // if an object falls on the edge of another object, show the scrape!

  FIREWORK PARTICLES
  Smoke particles for chimney!
  Particles being sucked into the player ( POWER!!! )

// ANIMATIONS
Hero standing animation
Pulsing size and rotating
Glow Mod ( using Lights)

//ITEMS
Key? If you have a key u can open ____
one time use inventory objects,
such as potions, speed boosters.
Keep as action props so we can equip it too, FLEXIBLE nice!

//ACTIONS
unequip action
throw item?
// gun that swaps places with what it hits! so cool..
send clones power like that one game I made

//MODS
Metal mario! How did I not think of this. Sink and don't drown
Vanish cap ( lets you walk through walls? )
Fast fast cap..? Like mario racoon essentially, gives you better soaring and speed?
Shrink power, think metroid ball or CROUCH even
JETPACK!!!

//WEAPONS
bouncing ball
various guns
  - BOOMERANG
  Bouncing ball action - mario fireball
bullets that ping around!
bullets that stop short before they are destroyed, so its like a limited range bullet. you can basically make a stopVelocityBeforeDestroyTimerComplete tag
Maybe dual stick shooter potential?

//TAGS
  destoryOnHeroLand
  cameraZoomToFit
  speed boost tile
  go down when hit obstacle ( mainly for goombas you feel me? )
  slow down tag ( MOD lowers speed of anything inside of it )
  water tag ( MOD lowers gravity of anything inside of it )
    _tempMods Array! Perfect
    -- temp mods !! so these would be tags that use the mod system essentially... the mod only lasts one loop, but it will keep getting reset
  Non scroller object ( sun )
  Parallax scroller slower
  Parallax scroller faster
    special camera relation, 0, .5, 2, 10, etc. might wanna encapsulale the camera changing logic into a function?
  VISIBLE TO - select tags its visible to, ( visible to is an object with tags: true )
  Background animation tag ( perhaps background stage and everything…)
  one way platform ( can land on but can jump through from below)
  HAve an object twist to the left and the right, its common cheap animation for games it seems
  // 'increaseInputDirectionVelocity', <<--- better as tags probably
  // 'increaseMovementDirectionVelocity',
  Show grave when dead
  shrink down and shake until destroyed ( shrink other directions maybe too?)
  randomLightColorChange
  randomLightPowerChange
  randomLightOpacityChange
  randomColorChanges

  ////////////////////////////////////////////////////
  ////////////////////////////////////////////////////
  ////////////////////////////////////////////////////
  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  ###### LINKS FOR INSPIRATION
  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  ////////////////////////////////////////////////////

  THIS IS FOR GENERATING SPRITESHEET JSON
  https://www.leshylabs.com/apps/sstool/

  EXTRA SPRITES REMOVE BG
  ImageMagick + http://www.imagemagick.org/discourse-server/viewtopic.php?t=29224

  BETTER LOCAL STORAGE
  https://github.com/brianleroux/lawnchair

  IMAGE MANIPULATION
  http://camanjs.com/examples/
  // aparently also FABRIC.js is good for that, I MEAN IDK MAN

  IMPROVE AESTHETIC AND GAME AESHTIC CUSTOMIZATION
  https://www.transparenttextures.com/

  */
