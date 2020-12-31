/*
// THE BEST FEATURES ARE THE ONES THAT THE PLAYER THINKS EXISTS BUT ACTUALLY DOESNT
// U CAN HAVE COOL GRAPHICS BUT IF THEY DONT MEAN ANYTHING MEANINGFUL TO THE GAMEPLAY IT DOESNT MATTER

Remember that fullstack guys random theater generator - you're close

// MARKETING IDEA
// Make a game for their birthday

and randomize perhaps the camera filter!! <--- yes on camera filter and also dont forget about camera shakes too, those are good animations,
RANDOMIZE EASE! remember ease..

//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
SMALL TASKS
//////////////////////////////////////////////////////////////////////////////////

View information popup. Tells the user what is going on behind this object, kind of satisfying a way to see what is going on
  also helps with debugging

Visalize sequences

advanced Hero physics for non platformer
    perheps a decay when where is no input vs a decay when there IS input?

////////////////////////////////////////
////////////////////////////////////////
EDITOR UPGRADES
////////////////////////////////////////
INSTEAD OF GUIDANCE - Green dot in corner of tools if the current editing hero has this option...
                      Allow right clikcing to add the option to the heros object

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

////////////////////////////////
////////////////////////////////
SOUND GENERATOR UPGRADE
////////////////////////////////
audio right click -> set as ___ sound

//FOR LIBRARY OBJECTS + OBJECTS ON MAP
speak SFX, destroy SFX, pickup SFX, dropSFX

FOR MODS
start SFX, endSFX, poweredUpParticle

ACTIONS
actionSFX

pick random song

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
// WEAPONS
various guns
  - BOOMERANG
  Bouncing ball action - mario fireball
bullets that ping around!
bullets that stop short before they are destroyed, so its like a limited range bullet. you can basically make a stopVelocityBeforeDestroyTimerComplete tag
Maybe dual stick shooter potential?

//PARTICLES
Random Spout ( think chimney smoke and maybe like a flamethrower type weapon )
Random Disturbance

  After TeleDash
  object jump squeeze thing, ( with and height anim )

  General glow around hero

  select particle sprite via sprite selector?
  useColorPallete from sprite<---

  Falling down action, like being destroyed like a castle
  // if an object falls on the edge of another object, show the scrape!

  Particles being sucked into the player ( POWER!!! )

//TAGS
Non scroller object ( sun )
Parallax scroller slower
Parallax scroller faster
  special camera relation, 0, .5, 2, 10, etc. might wanna encapsulale the camera changing logic into a function?
VISIBLE TO - select tags its visible to, ( visible to is an object with tags: true )
Background animation tag ( perhaps background stage and everything…)

// ANIMATIONS
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

////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
###### LINKS FOR INSPIRATION
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
////////////////////////////////////////////////////

IMPROVE AESTHETIC AND GAME AESHTIC CUSTOMIZATION
https://www.transparenttextures.com/

THIS IS FOR GENERATING SPRITESHEET JSON
https://www.leshylabs.com/apps/sstool/

BETTER LOCAL STORAGE
https://github.com/brianleroux/lawnchair

IMAGE MANIPULATION
http://camanjs.com/examples/
// aparently also FABRIC.js is good for that, I MEAN IDK MAN

PROCEDURAL
https://github.com/sequitur/improv

SHADOW ON CANVAS
https://codepen.io/mladen___/pen/gbvqBo

GREAT NICE SOUND, inspires me to make it a bit more retro
https://www.npmjs.com/package/gameboy-sound

AMAZING AUTOMOTON STUFF
I might need to add this http://sanojian.github.io/cellauto/#about
*/


/*
////////////////////////////////////////////////////
////////////////////////////////////////////////////
// DEFINITIONS
////////////////////////////////////////////////////
////////////////////////////////////////////////////
IN ORDER OF COMPLEXITY THE MORE I CAN PUSH TO THE DEFAULT COMPENDIUM AND INTO THE TAGS SYSTEM THE BETTER THIS SOFTWARE IS

DEFAULT COMPENDIUM
Has objects with preset -> triggers, tags, hooks
Has preset sequences
Has preset scenarios
Has preset worlds

TAG
Tag is Event + Effect with ONE CLICK! Easy to add. Common Triggers should become Tags

HOOK
rejects or modifies effects or game functionality via events

--

TRIGGER
Event -> Condition = Effect

SEQUENCE
Sequence is ( Condition, Effect, Wait, Choice, UI ) in any order you want

SCENARIO
Scenario is the setup for the game

--

MORPH is permanent and transformative
MUTATE is permanent and transitionary
MOD is temporary with a condition
*/

// ENGINE -> Events, Conditions, Effects
// UI -> Tags, Triggers, Hooks, Sequences, Descriptors
// GAME DATA -> Objects, Heros, World, Grid
// SCENARIOS..?

/*
HOMEMADE ARCADE TOOL MAP

CLASS 1 - Basic
----------
Creator
- Time: lowest, Specificity: highest

Tags
- Time: low, Specificity: high


CLASS 2 - Intermediate
----------
RightClickMenu Modals
- Time: medium, Specificity: medium ( Name, Dialogue, Color, CRUD operations )

Detail View
- Same possibilities as RightClickMenu Modals except bigger and at the bottom of the screen, has an added layer of convenience


CLASS 3 - Advanced
----------
SimpleSequence
( Stories, Branching Dialogue )
- Time: high, Specificity: medium

Sequence
( Animations, Stories, All Effects, Branching Dialogue, Conditions, Notifications, Adding Objects )
- Time: highest, Specificity: lowest


SPECIALIZED
----------
Sprite Selector
Path Editor
Construct Editor
Live Menu ( Physics, Day/Night, Particles )
*/
