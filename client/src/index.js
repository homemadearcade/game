/*
////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
###### BIG FEATURES
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
////////////////////////////////////////////////////

!!!!!!!! !!!! READY FOR HA BETA !!!! !!!!!!
PIXEL EDITOR
DETAIL VIEW
!!!!!!!! !!!! READY FOR HA RELEASE !!!! !!!!!!

SIMPLE SEQUENCE
(ELEMENTAL SYSTEM) Lava, water, tree (?), fire, mountain, sand, ice, ROCK ( FIRST WEAPONS )-> Trees. ( ROBOT PARTS TOO)
LEVEL UP SYSTEM

LOBBY - HERO SELECTION + CUSTOMIZATION.
  Might want to put this inside of PREGAME
  Basically get the game data and then BEFORE loading it, you can ask what hero they are, and then load the game
TEAMS
PROCEDURAL LARGE SCALE
FOG OF WAR
LEVELS ( sub worlds )

////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
###### SMALL FEATURES
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
////////////////////////////////////////////////////

Team mods?

Low bandwidth mode

STORY - Fade in/out to game

in-game checkpoints, set as spawn point when collided

KING MODE ( where its like you make various yes/no choices and that changes whats happening on the world map )

////////////////////////////////
////////////////////////////////
AUDIO UPGRADE
////////////////////////////////
// PLAY SOUND 3D - 3d sound effects system from papa bear
// sound quality tags, big, little, useArcadeWalkingSounds tag, and the elements? steel? etc...
are we NOT gonna use retro voice sound fx???
VOLUME, how to change the volume of these sounds so that the 3D sounds feels right, maybe they are already mixed right?
it looks like this a left/right thing. Ill need to add my own later in that make it 3D

// the ability to give power ups their own NOISES and various objects their own VOICES

// ambience spaces

////////////////////////////////
////////////////////////////////
DIALOGUE UPGRADES
///////////////////////////////
optional speakerId on each individual dialogue node so that we can have like a group conversation?
combine choices and dialogue??? hmmm?, since dialogue is an object now..?
use othe other propertys on a dialogueSet to automatically decide which dialogueSet to use, perhaps it can be based on tag or all sorts of conditions
https://stackoverflow.com/questions/44944123/typing-effect-word-per-word/44944418

////////////////////////////////
////////////////////////////////
BRANCH UPGRADES
///////////////////////////////
Perhaps actual branch view of branches??? Like I mean yes binary tree or whatever this is
https://bl.ocks.org/d3noob/8326869
Different roots for the branches...

////////////////////////////////
////////////////////////////////
PHYSICS UPGRADES
///////////////////////////////
Allow circles and triangles?
ELEVATION IS POSSIBLE THROUGH A VISUAL ILLUSION ( see littlewood game )
allow invisible obstacle creation on like a...background rpg or dnd map
Friction variable? increases the velocity decay
..also combine bounciness between two objects?

////////////////////////////////
////////////////////////////////
EDITOR UPGRADES
////////////////////////////////
action props editor
timer editor
quest editor ( inside of default hero editor )
never close right click menu if shift is pressed
GENRE libraries ( creator, generatedMenu )
global compendium service that I can add to remove without copying and pasting JSON
Toggle between drawing types?? Double object in construct editor to open drawing for that
draw absurd path with mouse ( as spencer suggested, just use like drag? but record mouse points. this is LOL but awesome )
get better json editor so I dont have to format so fuckin much, use the current json editor?
action props, spawn zones, etc would be better editing using this json editor not the ae editor and not context menus
add more bold stuff to the right click menu, its a great way of highlighting!, remove uneeded menus?
right click -> open advanced menu which switches to a new context menu
right click - follow, pathfindTo


////////////////////////////////
////////////////////////////////
LIGHT UPGRADE
Random opacity as a tag
Because its COOL
Random color as a tag
backgroundLighting stage
////////////////////////////////

////////////////////////////////
////////////////////////////////
ADD SUBOBJECT UPGRADES
////////////////////////////////
Similar to right click create object. I need a right click - create subobject
  // and it should have similar options as the object one
Spear
Gun
Inventory Item
Area x 2
Area X 3
Area x 4
Potential Sub Object
awareness areas toggleable, interact area toggleable in subobject library??idk
Shift click on sub object in creator to add it to the map! or other way around?

////////////////////////////////
////////////////////////////////
LIBRARY UPGRADE
////////////////////////////////
WORLDLIBRARY - Turn the editor world switching into something pulled out of a library, you feel me?..
The real thing is going from object/subobject -> creator
need to create interface for the entire library/compendium!
have CREATOR service always look up the JSON from the library, it should not store its own JSON

////////////////////////////////
////////////////////////////////
MOD UPGRADE
////////////////////////////////
local mods? ( client only mods for specific players/situations ) --- essentially this is a visibility mod for a player?
global mods -- all heros, or ANY object
optimize modding...
MODDING BROKE some crazy thing happened when I replaced a sub object? the modding just really broke, it was using an old version of the mod?? yeah idk maybe cuz the values were so nested. I hated it
// ^^ I think thishad to do with shift+stop

////////////////////////////////
////////////////////////////////
GAME FEEL UPGRADE
////////////////////////////////
Implement special extra physics for objects, not just heros
Object 'swinging' like on a rope. I mean... awesome right?
// planet gravity! Would be cool to have.. directional gravity
I want actual grid node by grid node movement and grid collision system. I want grid movement for OBJECTS too

////////////////////////////////
////////////////////////////////
SPAWN UPGRADE
////////////////////////////////
Hero removed -> respawn UI
HOOK UP RESPAWNS TO A SPAWN ZONE
spawn on interact ( spawn effect )
Combine spawning with anticipatedAdd. create like spawnType variable which defaults to, hatchFromParent

////////////////////////////////
////////////////////////////////
INVENTORY UPGRADE
////////////////////////////////
// max inventory ( number )
// drop last object when full ( boolean )
// prevent add when full ( boolean )

////////////////////////////////
////////////////////////////////
POPOVER UPGRADE
////////////////////////////////
UI - multiple resources to deposit and withdraw
Pop Heros inventory to others, but only if sub object has certain tags..?
  popCount vs popHeroInventoryToOthers. popcount should NOT pop if its in inventory
Add popovers to all UI everywhere, oh yeah! Including in creator
chatOnHover. use current chat service to create one that occurs on hover and is removed when mouse moves off...

////////////////////////////////
////////////////////////////////
ANIMATION UPGRADE
////////////////////////////////
allow chaining of animations and effects
onAnimationEnd
Wait for animation to complete
Randomize animations and physics together?
ADMIN to reselect sprites, remove sprites, combine sprites into animations

////////////////////////////////
////////////////////////////////
MAP UPGRADE
////////////////////////////////
Camera filters ??? Yeah? Like the pixie demo? Let them customize the LOOK and feel of it all
mini-map
map rotation having problems 1) object stage already pivoted for camera reason 2) admin canvas is not rotating with
maybe the key to rendering optimization is switching thigns like scale and position to the layers...?
cacheing colors
if you are a ghost, then shift+arrowkey should change camera temporarily instead of movement thing

////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
NOTES
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
////////////////////////////////////////////////////

THEMES
randomize soundFX
pick random song
randomize particleFX
randomize sprite theme ( this would require sprite the QUALITIES SYSTEM )
randomize hero physics
gameTheme: ’scifi vs fantasy vs retro vs fun vs horror’. This effects title selection randomization, sprite sheet selection?? and audio generation

and randomize perhaps the camera filter!! <--- yes on camera filter and also dont forget about camera shakes too, those are good animations, or EASE! remember ease..
--
  AMBIENCE --- these tags would play an ambience in any area
    caveAmbience
    waterAmbience
    jungleAmbience
    farmAmbience
    marketAmbience
    fireAmbience
    machineAmbience
    stopOtherAmbience

    and then you can say like. add SFX1 tag to all monsters or all pickupable or all resources, etc

    I THINK THATS IT!

---
Story/cutscenes SIMPLE EDITOR
  STORY SCREENSHOTS
  in Manager

  Screenshot button

  Name of story
  tabs 1, 2, 3, 4, 5, +
  Screenshot
  Text
  Effect
  Collapsed -> Preview
  DELETE

//// PLANS FOR MULTIPLAYER LOBBIES
Scenarios/BeginEnd
  TEAMS -> modify RESOURCES WITH STEALING? ADD FRIENDLY FIRE. ADD SCORE TO SCENARIOS FROM TEAMS

  SCREENS
  Score Screens
  Playable Lobby
  Lobby -> Team Select, Characters Select, Map Select
  Loading screen
  Controls
  Quests

  LOBBY OPTIONS
  ( multiplayer game )
  Hero select or hero random
  ( show all NPCS as heros )
  Team Select or team random
  new Heros allowed
  allow Bios

  SCREEN OPTIONS
  onGameStart is called after all heros reach the end
  centerText: "", bottomText: "" }

  SCORE SCREEN TYPE
  Teams
  ResourceZones
  Hero
    Kill Counts
    Score

/////
PLANS FOR ULTIMATE MINECRAFT SCALE

// moving grid based on hero ( chunks ) and only run simulation on those objects in the grid\
  // the problem is te pathfinding grid, hard to update that, too

Basically the grid will be a moving grid
the x and y of each grid node will get a getter based off the startX and startY and gridX
the grid will move its startX and startY with each hero with as its CHUNK

chunk padding is only used to calculate shadows as of now
CHUNK padding is the difference between the players view and the grid

It seems that theres VIEW padding and game padding. VIEW Padding seems to be for camera shakes and for moving very fast
game padding seems to be for smash brothers style deaths and managing object updates ( like mine craft )

A game boundary would likely dissapear, same with a camera lock
and then you would just have a grid that moves with you, the server would know each heros grid size and location
and update things accordingly

UPDATE ON THIS
If we seperate custom grid props from a path object and turn custom grids into their own objects, we can give the hero its own custom grid as a sub object and have monsters hook into it when they are in the area!

////////////////////////////////////////////////////
////////////////////////////////////////////////////
/// ALL SORTS OF EDITOR NOTES
/////////////////////////////

Default detail is your hero WITH a chat tab?

TEAM DETAIL MENU

OBJECT DETAIL MENU
TABS Info, Triggers, Color, Sprite, Tags, Combat Info, HERO: ( Quests, Skills, Inventory, Equipment, Controls )
// DEBUG - view everything this object is possibly involved in -> triggers, sequences, tags

INFO
Sprite Profile photo
Dialogue, Name,Description,
( Possible Effects list, Tag Descriptions? )
Path, Pathfinding Area, Parent, Relative, Groups, Respawn
--Flavor Text, Description, Quick Description

ENGINE DETAIL MENU
SpriteSheets, Sounds, Music, Games, Default Mod/Objects/Heros/Animations

GAME DETAIL MENU
Sequences, Stories, Scenarios, Sprites, Custom Mod/Objects/Heros/Animations

CHAT ON BOTTOM TOO

---

////////////////////////////////
////////////////////////////////
// PIXI FILTER NOTES

TWIST filter
Glow filter
Outline filter
—
Displacement filter — underwater effect
+ underwater overlay graphic??
Shockwave filter / Bulge pinch?
Reflection filter
Godray filter

Many of these are really good CAMERA effects
Dot filter
Old Film filter
Pixelate filter
Color Matrix filter
Cross Hatch filter
Crt filter
Zoom blur filter — Perhaps when you are like low on health??

OTHER DECORATIVE NOTES
// INVERT GAME, for example, when you get pacman powers
// grid object so its like outlines over the whole thing
// striped object!
have layered border, just draw another version at +2 and +4 and +6, -2 etc..
NEON vibe?

/*
////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
###### INFRASTUCTURE
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
////////////////////////////////////////////////////

combine all effects to all happen through effects service. all dialogue, all editor things ALL GAME effects should be done through effects? I think...?
I need to feel like I have CONTROL over effects and causes, right now I feel like my own tools have pulled me out of control!! thats why Ineed to keep it via tags and libray objects, I feel like I have control over those

// only allow modding for certain properties and certain tags, not for all...confusing with design AND bad for performance

// UGH so my pixi shit is bad. I cant be updating constantly.
// collisions also bad performance after a certain # I don't know how to deal with # of obstacles on screen
// I cant let players make something TOO big. The world have to be pretty small and we have to limit the projectile count

// SERVER MODE USING NENGI
// basically... HOST MODE and ARCADE MODE work as a great combo for home made arcade
// ^^ host mode and arcade mode would BREAK if i used a server model for running the game
// HOWEVER when trying to do accurate combat in multiplayer, we are going to want to have all the power of NENGI
// In that scenario i will try to implement server mode which will basically remove a client host and
// will make the server authoritative and solely responsible for updating, ill need to do a lot of changing...

// HOST GAME VS CLIENT GAME and their physics system, etc. right now non-hosts dont add subobjects for what reaason?? Its because adding aa sub object is quite complicated logic

// event system main problem is the different between onDeleteObject and 'onDeletedObject', very important, causing many issues :(

// allow pixi child sub object to go underneath their owner instead of always above, use tags please the whole time

// event system for physics, game logic, rendering, network update, ui, seperating helps!

// this is really scary. the host CANNOT refresh the page if any mods are used. The server is saving the modded version of the game currently because thats what we send to the clients

// revise physics system structure, allow like 'center point' to be changed and have it be used by default.
// ^^ so that rotation isnt a hack
// Rotational velocity also needs to be default.

// re organize parent, relative, owner, etc. What do these really all mean and why??
// event system is NOT named right. onDelete vs delete for example. I think that ones good, but like... 'startQuest'
// like whats our patterns. Is it Host Sends event through network -> Host picks up event through network?

// implement lodash fully with diffs, etc
// a try catch that if theres an error, the editor asks for a version of the game from like 1 minute ago
// switch tag fresh to an _fresh ( actually just go through all object state and make sure its consistent, there are others such as !!!target!!!<---( please make _ ) that could be an underscore property )
// lastHeroUpdateId, velocity? , i gridX, width, etc

// debug tools such as ( view all possible effects this object can have )
// view current POWERS
// VIEW DIFF from default version of this object

// auto save game state to DB, restore game state
// combine objectsById and objectsByTag with hero versions. Heros ARE objects. We can use .objectList and .heroList to diffentiate
// gameState => worldState
// convert all 'guestObject', 'mainObject', 'ownerObject' things to just ID stores
// dev dependencies to try to lower build file size

// DELETING object keys doesnt work, it just skips that update of that key. We need a good system for this

// another effects phase after correction, this is for things that should not be triggered unless it was legal

// we need more patterns to interact with the rendering system.
// standards for Adding Object to Game -> Add Object to Physics ->
// standards for edit object vs update object
// standards for network update/edit vs local update/edit
// many more standards for many more features
// Standards for DELETE, ADD, REMOVE, SPAWN, RESET, INITIALIZE, HIDE, (DISABLE?)

// CLIENT_GAME vs HOST_GAME

// local vs global positions, it makes total sense when you realize OH I need a global X for the entire game and local one thats more for the immediate surrounds and whats being rendere. Thers TWO axis

// ok so inssteadd of aappendding all these children to the dom, we should have a specified order so that we dont have to be gnarly with z ordering

// separate hero and PLAYER. the hero is just a game object then...

// queuing world and other updates so we can 'flush' them like feedly does

// admin vs player code much better seperated


////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
###### LINKS FOR INSPIRATION
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
////////////////////////////////////////////////////

// HONESTLY USING BOX 2D PHYSICS WOULD BE INCREDIBLE
// https://zimjs.com/bits/physics.html
// https://opengameart.org/content/colored-16x16-fantasy-tileset
// http://timefantasy.net/
// https://www.codeandweb.com/texturepacker/tutorials/how-to-create-sprite-sheets-and-animations-with-pixijs5
// https://github.com/YarnSpinnerTool/YarnEditor

/*
FOR SIMPLE SEQUENCE ( BRANCHING NARRATIVE )
https://www.npmjs.com/package/react-arrows

ACTUALLY THE ENGINE IVE BEEN WANTING...
https://github.com/timetocode/nengi-2d-csp

BETTER LOCAL STORAGE
https://github.com/brianleroux/lawnchair

MOUSE WHEEL
http://monospaced.github.io/hamster.js/

IDK
https://namuol.github.io/cheet.js/

GETTING SERIOUS ABOUT OPTIMIZATION
https://github.com/spite/rstats
https://github.com/geckosio/snapshot-interpolation
https://github.com/rgcl/jsonpack

IMAGE MANIPULATION
http://camanjs.com/examples/
// aparently also FABRIC.js is good for that, I MEAN IDK MAN

P COOL IDK
https://game-icons.net/

TWEENS
http://gizma.com/easing/#quad1

GAVE ME GREAT IDEA FOR LIKE EDGES OF THE GRID NODES
https://www.mipui.net/
IdK ANOTHER ONLINE https://hextml.playest.net/

THIS IS FOR GENERATING SPRITESHEET JSON
https://www.leshylabs.com/apps/sstool/

SpriteSheet
https://pixanna.nl/products/ancient-dungeons-base-pack/
https://craftpix.net/

IMPROVE AESTHETIC AND GAME AESHTIC CUSTOMIZATION
https://www.transparenttextures.com/

THINGS COULD GET FUCKIN NUTS WITH THIS HERE
https://www.iwm-tuebingen.de/iwmbrowser/lib/pixi/flippable.html

PROCEDURAL
https://github.com/sequitur/improv
https://github.com/redblobgames/mapgen2
https://github.com/BrianMacIntosh/icon-machine
https://github.com/redblobgames/mapgen4
https://github.com/kchapelier/procedural-generation
https://github.com/Dannark/BWO

SHADOW ON CANVAS
https://codepen.io/mladen___/pen/gbvqBo
*/


// MARKETING IDEA
// Make a game for their birthday

window.awsURL = 'https://homemadearcade.s3-us-west-1.amazonaws.com/'
window.HomemadeArcadeImageAssetURL = 'assets/images/'

import "core-js/stable";
import "regenerator-runtime/runtime";

import 'ace-builds'
import 'ace-builds/webpack-resolver';
// // then the mode, theme & extension
import 'ace-builds/src-noconflict/mode-json';

import './js/utils/utils.js'
import './js/page/index.js'
import './js/game/index.js'
import './js/arcade/index.js'
import './js/constructEditor/index.js'
import './js/pathEditor/index.js'
import './js/belowmanager/index.js'
import './js/map/index.js'
import './js/physics/index.js'
import './js/mapeditor/index.js'
import './js/playerUI/index.js'
import './js/editorUI/index.js'
import './js/game/notificationscontrol.js'
import './js/liveeditor/index.js'
import './js/creator/index.js'
import './js/audio/index.js'

import './js/procedural/index.js'

import './styles/index.scss'
import './styles/jsoneditor.css'

import './js/libraries/modLibrary.js'
import './js/libraries/subObjectLibrary.js'
import './js/libraries/objectLibrary.js'
import './js/libraries/heroLibrary.js'
import './js/libraries/spriteSheetLibrary.js'
import './js/libraries/dialogueChoiceLibrary.js'

// Broadcast that you're opening a page.
let otherPageOpen = false
localStorage.openpages = Date.now();
var onLocalStorageEvent = function(e){
  if(e.key == "openpages"){
      // Listen if anybody else is opening the same page!
    localStorage.page_available = Date.now();
  }
  if(e.key == "page_available"){
    otherPageOpen = true
  }
};
window.addEventListener('storage', onLocalStorageEvent, false);

setTimeout(() => {
  if(otherPageOpen) {
    alert("Another tab has Homemade Arcade open");
  } else {
    PAGE.load()
  }
}, 100)


// if(document.hasFocus()) {
// } else {
//   window.onfocus = PAGE.load
// }

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


TODO
----------
Pixel Editor
Branching Game
*/
