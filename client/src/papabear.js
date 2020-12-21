/*
Im not sure what you were thinking before, but theres what you will be thinking now
This is not the live editor gaming experience you thought you had. It will be more stand alone, but you may want to run it via
This should be a node webkit app that someone can download on steam

It will be multiplayer only. It will not be able to be run on the client

There will be three parts
1-Prologue mini papa bear
2-Open narrative ends with papa bear again
3-Narrative recalling and saving, allows for this map to be used again in a different context

its really all about the maps!

--
Everyone has the SAME potential for combat if they have the tools for it

You need to ask what is the loop of the player? I have this person... I do __ I die and -> whats next?

----

ROLES
Terrain Control
  Buildings
  Nature
Control over lighting
Summoner - Auto generate objects based on spells
Seers - Take screenshots of another persons screen and view it
Some sort of control of nature combined with noise randomization?
They should be able to tweak the various parts of nature using a tweaker, how many predators, how many
Speed!
Find a role someone can play on their phone??

Think of more ULTIMATE powers.

--

TECHNICAL WISDOM
--
The event system needs to understand when an event starts and when an event ends
  dont send tons of game events...only game events the client needs to know
  send the ids with game events
  you need a clear structure for creating vs deleting vs updating

Beware of all object.forEach loops

Dont add grid nodes to the physics system, just to pathfinding and also check for them when hero moves. The only things that need to be added to a 'physics system' are things that are REALLY moving in strange ways and need to be corrected, etc

Always clamp whats visible! saves big time on the rendering...

Decrease your packet size, data size, everything. Use a bitmask for things if you can.. its crucial for networking to keep packet size low as possible

a 'general' piece of software can be an absolute nightmare, before you begin you need the game design prepared to start building...
^^ every element of it!

Dont fuck around, use nengi for networking, USE AUTHORITATIZE SERVER!

--only allow certain properties to be modded!! Modding is really great though, it needs to be there from the start...

Use touch start instead of collide for a lot of things

Physics should be center point by default, in case you want to rotate in the future

You need a map for everything, all tags of a game object

The format I used for dialogue should be used for almost every interaction!

///
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
Types of objects

Terrain
Element
Obstacle
Equippable
  Action Props is Good
Pickupable
Interactable
  This is basic interaction
  This is where home made arcade excels with its ability to manage many diferent interactables with triggers and stuff?

Foreground
  See Through
Background

Zone
  Trigger
  Spawn
  Resource
  Dark
  Camera Lock
  Camera Zoom
  Awareness
  Interact

Light
Emitter

Magic Object ( this is the normal HA object... )



/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

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

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
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


////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
PB IDEAS
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

HERO SWITCHING…
Need to know who is controlling what heros
( cant switch to that hero because it is in USE, request to switch to? )

All powers require items?

Take random screenshot of another player… A ‘seers stone’

Tall grass that moves when a player is in it
Also like the ‘MYSTERIOUS FOREST that you cant see inside of unless you are underneath? Is the foreground system I have all you need?

Shadow ZONES that are BELOW the FOREGROUND, this is NOT nightfall. This is just INSIDE without light… Good to try out new shadow system with

PB is all about information.

Definitely I like the idea of AGES similar to age of empires

Dark Ages is world 1 papa bear. A war breaks out and then everyone except one person dies of papa bear. What information can you gather from STAGE 1 that helps define STAGE 2??

I love the idea of using this random generation sprite thing to create concoctions

3 condition
	Papa bear defeated
		children write down the story and leave for the new world
	Papa bear destruction
		researchers come later
	No summon
		fight papa bear as a group

BETTER ANIMAL AI

MINION NPCS such as TAX COLLECTORS
That can be sent onto YOUR LAND. So I would need a territory system. If someone claims some of your land you get a notification.

Theres a big emphasis on afterlife and retrieval of items on LOSS

Send MAIL via carrier pigeon? LOL YES

-

INFORMATION SYSTEM, TRACKERS AND SEERS
Previous Owners of ITEMS. Created By X
Was recently visited by X, Dropped By X

OUTPOSTS OR GUARD TOWERS.. These give you notifications of what is happening around that area? Also What gives the starter of the town power? answer.. the AI is loyal to them

Guard options ->
	ATTACK WHO? Team Members vs Non Team Members vs Anyone
	WHEN? on sight
	on trespassing
	on territory claim
	on violence
	on steal

Close Gate/Open Gate
—

Pickup Price ? Thats how I do shops?
Withdraw Price?

—

Permission issues and betrayal issues

People are allowed to take items of anyone else at any time and enter areas of someone else’s at any time and welcome to use anyones things or deposit form them at any time

NPCs can be placed that have an INTELLIGENCE to attack if someone is doing something you dont want but the logic will be very simple.

There is no friendly fire, only poisoning? The person being poisoned cannot see but everyone else can

CURRENT TEAM IS JUST A COLOR RING AROUND SPRITE!!<<ys

	Everyone is wondering like “what am I gonna do when papa bear gets back?” Or like how will I prepare for papa bear ??

It’s easy to summon papa bear and someone gets to start with summoning in the afterlife “the place of true power”. They get told what to do if they want to meet with the bear and it’s a secret

	What’s the point of information? What are you looking for ? You are trying to see if someone is going to summon papa bear mainly, but what are the clues for that? I think overall you want to know what someone is up to and what they are capable of so you can defend yourself. This is a result of a world with many powers

	You can’t really stop someone from summoning papa bear if they want to. The real information is IF someone is and where and when
	And WHAT powers will papa bear have ?
	You summon papa bear with a magical weapon of any sort
	And that turns into what is papa bears power..
	You have to sacrifice yourself in front of the altar to summon him
	Where is the altar is the question ?!!

  //////////////////////////////////////////////////////
  //////////////////////////////////////////////////////
OLDER NOTES

// BIG PAPA BEAR INSIGHTS
// COMMON FOLKS, UPPER CLASS, GODS

// THE ART EXPANSION
 // HUMAN ART -> MUSIC, SCULPTURE, PAINTING, CRAFTING, GREAT CITIES, GREAT WONDERS
 // GOD ART -> ALLOW GODS TO CRAFT NATURAL WONDERS -> CANYONS, MOUNTAIN RANGES, SEAS, RIVERS, LAKES, FORESTS, ANIMALS? OTHER LIFE?
 // ( MAPS )
// THE LIFE EXPANSION
  // CHARACTERS HAVE LONG HISTORIES. FAMILY TREES
  // THEY HAVE DESCRIPTIONS

// IT GOES BY AGES
// BY SCENARIOS
// SOME ARE LARGE SCALE AGES PLAYED OUT

// BASICALLY IT GOES LIKE this
/*
they play the first papa bear until someone unlocks papa bear AKA eating the apple
They unleash evil into the world
Much devestation is done, this is the first apacalypse ( there are many )
The story is told. This is like a good first game tutorial pack
We SAVE the world and the ruins and EVERYTHING for the next game
perhaps theres like an 'aging' features that adds vines and stuff and forests grow and stuff

// EPILOGUES happen after the game and the stats. Everyone reflects on what happens and then we let the survivors record this moment into history
// we get a short peacetime where meaning is basically consolidated into history or art. Graves are made perhaps?

// SO i think basically papa bear is always optional to add to the equation but papa bear is always the most powerful narrative device
// other than that there is THE SCENARIO OF THE GAME. Think about various apocalpyse games ( moon coming down, winter coming, meteor coming, zombie army coming, tournament is being held, dragons being revived, new technolog released, etc )
// also maybe think about other premises such as murder mystery, secret hidden item, new king problem
// but destroying papa bear, the ultimate original evil of man is the most epic story. Papa bear is the SAURON, the NARAKU, the VOLDEMORT

// Youll need to have a good gauge as to the narrative power that items in the game have and that papa bear has and that each of these events have
// also theres a question as to if it will be beneficial for me to be there or not? I think to start off im going to have to watch every game and make sure it ends right, but eventually ill learn the systems involved to make it work


// I was thinking and if you want to make this extremely high quality. Youll want to add a dungeon master to each game. This dungeon master also needs to be be able to deal with the software
// What reigns could I REALLY give to the users. Is there a scope that works? I would need to define the world rules completely and the scope of it essentially completely. The scope wouldnt be able to change right?
The queestion is.. can the game be REALLY meaingful if the way the user interacts with it ISNT meaningful
What makes a game item meaningful is its POWER either horizontal or vertical POWER. Most games only deal with vertical power
other way to make an item meaningful is through history and narrative..

IM GOING TO START OFF WITH HAVING A GAME MASTER PRESENT AND THEN EVENTUALLY ILL LEARN WHAT THE PARTS I CAN SACRIFICE ARE


////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
###### LINKS FOR INSPIRATION
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
////////////////////////////////////////////////////

ACTUALLY THE ENGINE IVE BEEN WANTING...
https://github.com/timetocode/nengi-2d-csp

consider firebase?
*/
