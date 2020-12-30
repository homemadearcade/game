/*
////////////////////////////////
TODO - ALMOST THERE!
/////////////////////////////////
Add some Time Fantasy Sprites, Fill out more descriptors for sprites

Game Over State
	specifically allow a hero to be destroyed and have the game run still?

Randomize hero physics

Home made arcade music

experience password for ha-live.
Have a random number based on the day, every will need to use that same number.
The first person that logs on with that number makes the server remember that number and only allows connections with that number

////////////////////////////////
SEQUENCE EDITOR UPGRADE
////////////////////////////////
Create
Editor
Animate
Sound
Mod honestly needs its own...
Its getting really complicated. For now im going to cheat it. It should have its own service and its own sequence type, feel me?
// onGameStart or onHeroLand sequences === automatically trigger on those events

////////////////////////////////
PUZZLE INTERFACES
////////////////////////////////
this https://github.com/alexeyivanov94/combination-lock-react FOR NUMBERS
and a straight up password input for ALPHANUMERIC
tag -- destroyOnPuzzleComplete
tag -- spawnAllInHeroInventoryOnPuzzleComplete
and then ud need a basic -- combination variable. Puzzle type + puzzle combination...  two variables?


////////////////////////////////////////////////////
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
###### BUGS
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
////////////////////////////////////////////////////

cacheing colors

If an array changes we need to send the whole thing in the DIFF

non host talks to object with the dialogue id maybe something fucks up??
^^ non-host dialogue really fucks up and also with the yellow murder mystery guy it fucks up..
--

Trigger pool not getting reset? Or for some reason on the first game load the trigger pool isnt set sometimes? idk

Try uploading game JSON on non host

Bombs need to be able to spawn the explosion onto real objects

////////////////////////////////////////////////////
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
LIBRARY IDEAS
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
////////////////////////////////////////////////////

// PARTICLES
// funny thing with particle landing... LOL even if you land on a LIVE DUDE ASS u skim off some of his particles. Ill need a quality tag for 'earth' vs 'human' or something like. 'scrapeable?'
Random Spout
Random Disturbance
Disturbance when leaving and entering something?

// MODS
Vanish cap ( lets you walk through walls? )
Fast fast cap..? Like mario racoon essentially, gives you better soaring and speed?
Shrink power, think metroid ball or CROUCH even
JETPACK!!!

//WEAPONS
Shoot bouncing ball

//TAGS
  destroyOnHeroLand
  cameraZoomToFit
  speed boost tile
  go down when hit obstacle ( mainly for goombas you feel me? )
  slow down tag ( MOD lowers speed of anything inside of it )
  water tag ( MOD lowers gravity of anything inside of it )
    _tempMods Array! Perfect
    -- temp mods !! so these would be tags that use the mod system essentially... the mod only lasts one loop, but it will keep getting reset
  one way platform ( can land on but can jump through from below)
  // 'increaseInputDirectionVelocity', <<--- better as tags probably
  // 'increaseMovementDirectionVelocity',
  Show grave when removed
  shrink down and shake until destroyed ( shrink other directions maybe too?)
  randomLightColorChange
  randomLightPowerChange
  randomLightOpacityChange
  randomColorChanges
  groundDisturbanceOnParticleLand
  groundDisturbanceOnJump
  RealRotateBackAndForth -  HAve an object twist to the left and the right, its common cheap animation for games it seems
*/
