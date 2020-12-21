// i might be missing school theme?
// Locker, Chalkboard, School Chair, Desk, Etc

function setDefault() {
  global.generalDescriptors = {
    'Scifi Theme': {},
    'Fantasy Theme': {},
    'Platformer View': {},
  }

  global.elementDescriptors = {
    Grass: {},
    Dirt: {},
    Snow: {},
    Ice: {},
    Sand: {},
    Stone: {},
    Metal: {},
    Wood: {},
    Glass: {},
    Gravel: {},
    Concrete: {},
    Brick: {},
    Mud: {},

    Cloth: {},
    Bone: {},
    Slime: {},

    Gem: {},
    Ore: {},

    Fire: {},
    Electricity: {},
  }

  global.waterElementDescriptors = {
    Water: {},
    'Water Element': {
      dontShowAdminsInSpriteSheetEditor: true,
      children: ['Bubbles', 'Waterfall', 'Whirlpool', 'Lily Pad'],
    },
    'Wave': {},
    'Lily Pad': {},
    'Bubbles': {},
    'Waterfall': {},
    'Whirlpool': {},
    'Coral': {},
    'Seaweed': {}
  }

  global.overworldMapDescriptors = {
    Mountain : {},
    Tree : {
      children: ['Dead Tree', 'Colored Tree', 'Forest'],
    },
    'Hill' : {},
    House : {
      children: ['Village'],
    },
    Castle : {},
    Cave : {},
    Building : {
      children: ['Castle', 'House', 'Church', 'Store', 'Village'],
    },
    Church : {},
    Store : {
      children: ['Weapon Store', 'Item Store']
    },
    'Weapon Store': {},
    'Item Store': {},
    'Castle Wall' : {},
    Tornado: {},
    Volcano: {},
    Lightning: {},
    Gazebo: {},
    Totem: {},
    Farm: {},
    Lake: {},
    Graveyard: {},
    Mine: {},
    Bridge: {},
    'Mountain Wall': {},
    Planet : {},
    Sun: {},
    Star: {},
    'Moon': {},
    'Earth': {},
  }

  global.buildingPartDescriptors = {
    'Building Wall': {},
    'Building Floor Tile': {},
    // 'Special Floor Tile': {
    //   children: []
    // },
    'Spaceship Wall': {},
    'Spaceship Floor': {},
    Block: {},
    Door: {},
    Archway: {},
    Entryway: {},
    Ladder: {},
    Stairs: {},
    Window: {},
    Pipe: {},
    Chimney: {},
    Column: {},
    'Roof Tile/Shillings': {},
  }

  global.outsideBuildingDescriptors = {
    Fence: {},
    Well: {},
    Plant: {
      children: ['Crop', 'Bush', 'Flower', 'Mushroom', 'Ivy', 'Grass Tuft'],
    },
    'Venus Flytrap': {},
    Ivy: {},
    Cactus: {},
    Mushroom: {},
    Bush: {},
    Flower: {},
    Crop: {},
    'Grass Tufft': {},
    Sign: {},
    'Directional Sign': {},
    Grave: {},
    Gravestone: {},
    Skull: {},
    Skeleton: {},
    Coffin: {},
    Barrel: {},
    Crate: {},
    Pot: {},
    Cauldron: {},
    Box: {},
    Fountain: {}
  }

  global.insideBuildingDescriptors = {
    'Musical Instrument': {
      children: ['Harp', 'Guitar','Drum', 'Flute', 'Piano']
    },
    Harp: {},
    Guitar: {},
    Drum: {},
    Flute: {},
    Piano: {},
    Candle: {
      relatedSprites: ['Torch'],
    },
    Lantern: {},
    Altar: {},
    Appliance: {},
    Machine: {
      children: ['Computer', 'Engine', 'Generator'],
    },
    Computer: {},
    Furniture: {
      children: ['Chair', 'Desk', 'Table', 'Fireplace', 'Couch', 'Bookshelf', 'Stove', 'Oven'],
    },
    Desk: {},
    Bookshelf: {},
    Couch: {},
    Chair: {},
    Bench: {},
    Table: {},
    Jewelry: {
      children: ['Necklace', 'Ring', 'Chalice']
    },
    Chalice: {},
    Necklace: {},
    Ring: {},
    'Kitchen Utensil': {
      children: ['Fork', 'Knife', 'Spoon']
    },
    Fork: {},
    Knife: {},
    Spoon: {},
    Stove: {},
    Oven: {},
    Food: {
      children: ['Meat', 'Fruit', 'Vegetable', 'Drink']
    },
    Device: {
      children: ['Clock', 'Computer', 'Phone', 'Compass'],
    },
    Engine: {},
    Generator: {},
    Phone: {},
    Clock: {},
    Fireplace: {},
    Bed: {},
    Throne: {},
    Carpet: {},
    'Display Case': {},
    'Weapon/Armor Stand': {},
    'Liquid Tank': {},
  }

  global.otherDescriptors = {
    Stick: {},
    Rock: {},
    Stalagmite: {},
    Gear: {},
    'Spider Web': {},
    'Sports Equipment': {},
    'Candy Cane': {},
    Manican: {},
    Mirror: {},
    'Bathroom Item': {
      children: ['Toilet', 'Sink'],
    },
    'Weight': {},
    'Alarm Light': {},
    'Security Camera': {},
    Toilet: {},
    Sink: {},
    Statue: {},
    'Jail Cell Bars': {},
    'Church Item': {
      children: ['Candlelabra','Candle', 'Altar'],
    },
    'Candelabra': {},
    'Stained Glass Window': {},
    Awning: {},
    Clothesline: {},
    'Food Stand': {},
    'Public Item': {
      children: ['Trash', 'Mailbox', 'Fire Hydrant'],
    },
    Trash: {},
    Mailbox: {},
    'Fire Hydrant': {},
    'User Interface': {
      children: ['Heart'],
    },
    'Genie Lamp': {},
    'Crystal Ball': {},
    'Magnifying Glass': {},
    'Glasses': {},
    Parasol: {},
    'Toxic Waste': {},
    Flag: {},
    Banner: {},
    'Medal': {},
    Feather: {},
    Syringe: {},
    'Gas Can': {},
    Undescribed: {},
    Circle: {},
    Triangle: {},
    Square: {},
  }

  global.weaponDescriptors = {
    Weapon: {
      dontShowAdminsInSpriteSheetEditor: true,
      children: ['Waraxe', 'Staff', 'Mace', 'Gun', 'Sword','Bow', 'Crossbow', 'Laser', 'Spear', 'Halbierd', 'Scythe', 'Bomb', 'Scimitar', 'Rapier'],
    },
    'Melee Weapon': {
      dontShowAdminsInSpriteSheetEditor: true,
      children: ['Waraxe','Mace', 'Sword','Spear', 'Whip', 'Scimitar', 'Rapier', 'Scythe', 'Halbierd', 'Dagger'],
    },
    'Ranged Weapon': {
      dontShowAdminsInSpriteSheetEditor: true,
      children: ['Staff','Gun','Bow','Crossbow', 'Laser','Spear', 'Wand', 'Sling', 'Boomerang'],
    },
    Waraxe: {},
    Crossbow: {},
    Scythe: {},
    Halbierd: {},
    Dagger: {},
    Axe: {},
    Scimitar: {},
    Rapier: {},
    Boomerang: {},
    Staff: {},
    Wand: {},
    Mace: {},
    Gun: {
      dontShowAdminsInSpriteSheetEditor: true,
      children: ['Cannon', 'Shotgun', 'Pistol', 'Rocket Launcher', 'Rifle', 'Machine Gun'],
    },
    Sling: {},
    Cannon: {},
    Shotgun: {},
    Pistol: {},
    'Rocket Launcher': {},
    'Rifle': {},
    'Machine Gun':{},
    Whip: {},
    Sword: {},
    Bow: {},
    Laser: {},
    Spear: {},
    Bomb: {},
    'Grenade': {},
    'Dynamite': {},
    Projectile: {
      dontShowAdminsInSpriteSheetEditor: true,
      children: ['Magic', 'Bullet', 'Arrow', 'Spear', 'Cannonball'],
    },
    'Magic Ball': {},
    Bullet: {},
    Cannonball: {},
    Arrow: {},
    'Quiver': {},
  }

  global.toolDescriptors = {
    Tool:  {
      dontShowAdminsInSpriteSheetEditor: true,
      children: ['Axe', 'Pickaxe', 'Torch', 'Device', 'Shovel', 'Hammer', "Shears"],
    },
    Shears: {},
    'Mortar and Pestle': {},
    Compass: {},
    Hammer: {},
    Anvil: {},
    Device: global.insideBuildingDescriptors.Device,
    Pickaxe: {},
    Torch: {},
    Shovel: {},
    Wearable: {
      dontShowAdminsInSpriteSheetEditor: true,
      children: ['Pants', 'Shirt', 'Cape', 'Robe', 'Hood', 'Shield', 'Armor', 'Helment', 'Clothes', 'Hat', 'Gloves', 'Boots'],
    },
    Pants: {},
    Shirt: {},
    'Crown': {},
    Helmet: {},
    'Plate Leggings': {},
    'Platebody': {},
    'Chainmail': {},
    Armor: {
      children: ['Armor', 'Gloves', 'Boots', 'Shield', 'Helment', 'Plate Leggings', 'Platebody', 'Chainmail']
    },
    Clothes: {},
    Gloves: {},
    Boots: {},
    Robe: {},
    Hood: {},
    Cape: {},
    Shield: {},
    Hat: {},
  }

  global.itemDescriptors = {
    Key: {
      children: global.insideBuildingDescriptors.Key,
    },
    Bucket: {},
    Bottle: {},
    Potion: {},
    Bag: {},
    Heart: {},
    'First Aid Kit': {},
    Food: global.insideBuildingDescriptors.Food,
    Candy: {},
    Soda: {},
    Snack: {},
    Meat: {},
    Fruit: {},
    Vegetable: {},
    Drink: {},
    Bread: {},
    Bullet: global.toolDescriptors.Bullet,
    'Expensive Item': {
      dontShowAdminsInSpriteSheetEditor: true,
      children: ['Gold', 'Jewelry', 'Coin'],
    },
    Gold: {},
    Coin: {},
    Literature: {
      dontShowAdminsInSpriteSheetEditor: true,
      children: ['Book', 'Page', 'Scroll', 'Disk'],
    },
    Book: {},
    Page: {},
    Scroll: {},
    Disk: {
      children: []
    }
  }

  global.dungeonItemDescriptors = {
    Door: global.buildingPartDescriptors.Door,
    Ladder: global.buildingPartDescriptors.Ladder,
    Stairs: global.buildingPartDescriptors.Stairs,
    Key: global.itemDescriptors.Key,
    Keyhole: {},
    'Trap Door': {},
    Chest: {},
    Block: {},
    Icicle: {},
    Spring: {},
    Lever: {},
    Switch: {},
    'Upward Chomper': {},
    'Spikes': {},
    'Bear Trap': {},
    'Hole': {},
    'Switch': {},
    'Magic Floor Tile': {},
    'Arrow Tile': {},
    'Warp Tile': {},
    'Button Tile': {},
  }

  global.transportDescriptors = {
    Vehicle: {
      dontShowAdminsInSpriteSheetEditor: true,
      children: ['Car', 'Boat', 'Spaceship', 'Rail Car'],
    },
    Boat: {},
    Car: {},
    Motorcycle: {},
    Tank: {
      children: []
    },
    Spaceship: {},
    // Plane: {
    //   children: []
    // },
    Rail: {},
    'Rail Car': {},
    Street: {},
    'Traffic Item': {
      children: ['Traffic Cone', 'Traffic Light', 'Traffic Barricade']
    },
    'Traffic Cone': {},
    'Traffic Light': {},
    'Traffic Barricade': {},
    'Spaceship Wall': {},
  }

  global.humanDescriptors = {
    Human: {
      dontShowAdminsInSpriteSheetEditor: true,
      children: ['Astronaut', 'Wizard', 'King', 'Archer', 'Thief', 'Athlete', 'Priest', 'Cop'],
    },
    Astronaut: {},
    Soilder: {},
    Space: {},
    Wizard: {},
    King: {},
    Queen: {},
    Archer: {},
    Warrior: {},
    'Rogue': {
      children: ['Thief', 'Ninja']
    },
    'Angel': {},
    'Thief': {},
    'Ninja': {},
    'Musician': {},
    Engineer: {},
    Athlete: {},
    Priest: {},
    Nun: {},
    Cop: {},
    'Citizen': {},
    'Villager': {},
    Detective: {},
    Knight: {},
  }

  global.animalDescriptors = {
    Animal: {
      dontShowAdminsInSpriteSheetEditor: true,
      children: ['Cat', 'Bird', 'Dog', 'Mouse', 'Chicken', 'Bug', 'Fish', 'Reptile', 'Deer', 'Bear'],
    },
    /// sound oriented
    Bird: {
      children: [ 'Chicken', 'Crow', 'Bat', 'Duck', 'Ostrich', 'Owl', 'Penguin', 'Seagull',],
    },
    'Farm Animal': {
      dontShowAdminsInSpriteSheetEditor: true,
      children: [ 'Donkey', 'Horse', 'Chicken', 'Cow', 'Goat', 'Bull', 'Pig', 'Yak']
    },
    'Saddle Animal': {
      dontShowAdminsInSpriteSheetEditor: true,
      children: [ 'Donkey', 'Horse', 'Camel']
    },
    'Lawn Animal': {
      dontShowAdminsInSpriteSheetEditor: true,
      children: [ 'Bunny', 'Mouse', 'Racoon', 'Squirrel', 'Frog', 'Mole']
    },
    Reptile: {
      children: [
        'Alligator',
        'Cobra',
        'Crocodile',
        'Frog',
        'Turtles',
        'Snake'
      ]
    },

    // fish
    Fish: {
      children: ['Mola Mola', 'Stingray', 'Anglerfish', 'Shark', 'Eel', 'Jellyfish', 'Crayfish', 'Whale', 'Squid', 'Seahorse']
    },
    'Anglerfish': {},
    'Mola Mola': {},
    Shark: {},
    Eel: {},
    Jellyfish: {},
    Crayfish: {},
    Whale: {},
    Squid: {},
    Seahorse: {},
    Stingray: {},

    // other
    'Musk Ox': {},
    Hippo: {},
    Bison: {},
    Monkey: {},
    Panda: {},
    Elephant: {},
    Gorilla: {},

    // pets
    Cat: {},
    Dog: {},
    Ferret: {},
    Chinchilla: {},

    // predator
    Cougar: {},
    Tiger: {},
    Lion: {},
    Wolf: {},

    // Woodland
    Deer: {},
    Bear: {},
    Badger: {},
    Fox: {},
    Boar: {},

    // Bugs
    Bug: {
      children: [
        'Bee',
        'Butterfly',
        'Ant',
        'Scorpion',
        'Fly',
        'Ladybug',
        'Spier',
        'Leech',
        'Beetle',
        'Grasshopper',
        'Worm'
      ]
    },
    Ant: {},
    Bee: {},
    Butterfly: {},
    Scorpion: {},
    Fly: {},
    Ladybug: {},
    Spider: {},
    Leech: {},
    Beetle: {},
    Grasshopper: {},
    Worm: {},

    'Mythical Beast': {
      children: ['Cyclops', 'Unicorn', 'Dragon', 'Mermaid', 'Vampire', 'Mermaid', 'Demon', 'Golem', 'Griffin', 'Ent', 'Hag', 'Harpie', 'Siren', 'Genie', 'Minotaur', 'Troll', 'Centaur'],
    },
    /// mythical
    Unicorn: {},
    Dragon: {},
    Demon: {},
    Ent: {},
    Mermaid: {},
    'Genie': {},
    'Minotaur': {},
    Troll: {},
    Centaur: {},
    Cyclops: {},

  }

  global.reptileDescriptors = {
    Alligator: {},
    Cobra: {},
    Crocodile: {},
    Frog: {},
    Turtles: {},
    Snake: {},
  }

  global.lawnAnimalDescriptors = {
    Bunny: {},
    Mouse: {},
    Racoon: {},
    Squirrel: {},
    Mole: {},
    Frog: global.reptileDescriptors.Frog
  }

  global.farmAnimalDescriptors = {
    'Donkey': {},
    'Horse': {},
    'Chicken': {},
    'Cow': {},
    'Goat': {},
    'Bull': {},
    'Pig': {},
    'Yak': {},
    'Turkey': {}
  }

  global.birdDescriptors = {
    Chicken: global.farmAnimalDescriptors.Chicken,
    Crow: {},
    Bat: {},
    Duck: {},
    Ostrich:{},
    Owl: {},
    Penguin: {},
    Seagull: {},
    Egg: {},
  }

  global.monsterDescriptors = {
    Monster: {
      dontShowAdminsInSpriteSheetEditor: true,
      children: ['Bug', 'Ghost', 'Goblin', 'Undead', 'Zombie', 'Alien', 'Mythical Beast', 'Machine'],
    },
    // Pest: {},
    Ghost: {},
    Goblin: {},
    'Skeleton Monster': {},
    Zombie: {},
    Mummy: {},
    'Slime Monster': {},
    Alien: {},
    Robot: {},
    Golem: {},
    Vampire: {},
    Hag: {},
    Harpie: {},
    'Elemental Monster': {},
    'Possessed Object': {},
    'Evil Eyeball': {
      withDescriptors: {
        Eyeball: true,
        Evil: true,
      }
    }
  }

  global.edgeModifiers = {
    'Top': {},
    'Right': {},
    'Left': {},
    'Bottom': {},
    'Center': {},
    'TopLeft': {},
    'TopRight': {},
    'BottomLeft': {},
    'BottomRight': {},
  }

  global.facingModifiers = {
    'FacingUp': {},
    'FacingRight': {},
    'FacingLeft': {},
    'FacingDown': {},
    'Going Up': {},
    'Going Down': {}
  }

  global.pathModifiers= {
    'Up-Right': {},
    'Up-Down': {},
    'Up-Left': {},
    'Down-Right': {},
    'Down-Left': {},
    'Right-Left': {},
    'Up-Down-Right-Left': {},
    'Up-Right-Left': {},
    'Down-Right-Left': {},
    'Up-Down-Right': {},
    'Up-Down-Left': {},
    'TopRight-BottomLeft': {},
    'TopLeft-BottomRight': {},
  }

  global.modifierDescriptors = {
    'Many': {},
    'Empty': {},
    'Broken': {},
    'Turned On': {},
    'Messy': {},
    'Open': {},
    'Closed': {},
    'Boarded Up': {},
    'With Window': {},
    'With Blood': {},
    'Scaley': {},
    'Carpeted': {},
    'Potted': {},
    'Decorated': {},
    'Powered Up': {},
    'Elevated': {},
    'Checkered': {},
    'Alt1': {},
    'Alt2': {},
    'Duplicate': {},
      Small: {
      audioRelated: true,
      dontShowAdminsInSpriteSheetEditor: true,},
    Large: {
      audioRelated: true,
      dontShowAdminsInSpriteSheetEditor: true,},
  }

  global.livingCreatureModifiers = {
    'Holding Weapon': {},
    'Elf': {},
    'Goblin': {},
    'Two Headed': {},
    'Mounted': {},
    'Mythical': {},
    'Magical': {},
    'Child': {},
    'Male': {},
    "Female": {},
    'Horned': {},
    'Evil': {},
    'Dead': {},
    'With Face': {},
  }

  global.elementalModifiers = {
    'Mossy': {},
    'Ivied': {},
    'Frozen': {},
    'With Snow': {},
    'With Fruit': {},
    'Pine': {},
    'Willow': {},
    'Cherry Blossom': {},
    'Muddy': {},
    'Tropical': {},
    'On Fire': {},
    'In Water': {},
    'Waters Edge': {},
    'In Air': {},
    'Lightning Charged': {},
  }

  global.audioModifierDescriptor = {
    Small: global.modifierDescriptors.Small,
    Large: global.modifierDescriptors.Large,
    Cute: {
      audioRelated: true,
      dontShowAdminsInSpriteSheetEditor: true,},
    Mean: {
      audioRelated: true,
      dontShowAdminsInSpriteSheetEditor: true,},
    Evil: {
      audioRelated: true,
      dontShowAdminsInSpriteSheetEditor: true,},
    Mad: {
      audioRelated: true,
      dontShowAdminsInSpriteSheetEditor: true,},
    Happy: {
      audioRelated: true,
      dontShowAdminsInSpriteSheetEditor: true,},
    Random: {
      dontShowAdminsInSpriteSheetEditor: true,},
  }

  global.colorModifiers = {
    'Dark': {},
    'Light': {},
    'Brown': {},
    'Orange': {},
    'GreenBlue': {},
    'Yellow': {},
    'Green': {},
    'Grey': {},
    'Dark Grey': {},
    'Blue': {},
    'Red': {},
    'Rainbow': {},
    'Purple': {},
    'White': {},
    'Pink': {},
    'Flame': {},
    'Christmas': {}
  }

  global.complexDescriptors = {
    Forest : {
      withDescriptors: {
        Tree: true,
        Many: true
      }
    },
    'Mountain Range' : {
      withDescriptors: {
        Mountain: true,
        Many: true
      }
    },
    'Mountain (Snow)' : {
      withDescriptors: {
        Mountain: true,
        'With Snow': true
      }
    },
    'House (Snow)' : {
      withDescriptors: {
        House: true,
        'With Snow': true
      }
    },
    Village: {
      withDescriptors: {
        House: true,
        Many: true
      }
    },
    'Tree (Pine)' : {
      withDescriptors: {
        Tree: true,
        Pine: true
      }
    },
    'Tree (Cherry Blossom)' : {
      withDescriptors: {
        Tree: true,
        Pink: true
      }
    },
    'Tree (Tropical)' : {
      withDescriptors: {
        Tree: true,
        Tropical: true
      }
    },
    'Tree (Fruit)' : {
      withDescriptors: {
        Tree: true,
        'With Fruit': true
      }
    },
    'Tree (Dead)' : {
      withDescriptors: {
        Tree: true,
        Dead: true
      }
    },
    'Tree (Snow)' : {
      withDescriptors: {
        Tree: true,
        'With Snow': true
      }
    },
    'Tree (Frozen)' : {
      withDescriptors: {
        Tree: true,
        Blue: true
      }
    },
    'Tree (Hot)' : {
      withDescriptors: {
        Tree: true,
        Red: true
      }
    },
    'Tree (Dark)' : {
      withDescriptors: {
        Tree: true,
        Dark: true
      }
    },
    'Grass (Dark)': {
      withDescriptors: {
        Grass: true,
        Dark: true
      }
    },
    'Water (Deep)': {
      withDescriptors: {
        Water: true,
        Dark: true
      }
    },
    'Sand Dune' : {
      withDescriptors: {
        Mountain: true,
        Sand: true
      }
    },
    'Coin Stack' : {
      withDescriptors: {
        Coin: true,
        Many: true
      }
    },
    'Chest (Open)' : {
      withDescriptors: {
        Chest: true,
        Open: true
      }
    },
    'Lumber' : {
      withDescriptors: {
        Wood: true,
        Many: true
      }
    },
    'Carpeted Stairs' : {
      withDescriptors: {
        Stairs: true,
        carpeted: true
      }
    },
    'Carpeted Tile' : {
      withDescriptors: {
        'Building Floor Tile': true,
        carpeted: true
      }
    },
    'Torch (On)': {
      withDescriptors: {
        Torch: true,
        'Turned On': true
      }
    },
    'Lantern (On)': {
      withDescriptors: {
        Lantern: true,
        'Turned On': true
      }
    },
    'Evil Eyeball': global.monsterDescriptors['Evil Eyeball']
  }

  global.goreDescriptors = {
    'Body Part': {
      children: ['Eyeball', 'Arm', 'Leg', 'Torso', 'Head']
    },
    Eyeball: {},
    Arm: {},
    Leg: {},
    Torso: {},
    Head: {}
  }

  global.allDescriptors = {
    ...global.generalDescriptors,
    ...global.elementDescriptors,
    ...global.waterElementDescriptors,
    ...global.overworldMapDescriptors,
    ...global.buildingPartDescriptors,
    ...global.outsideBuildingDescriptors,
    ...global.insideBuildingDescriptors,
    ...global.otherDescriptors,
    ...global.toolDescriptors,
    ...global.itemDescriptors,
    ...global.transportDescriptors,
    ...global.humanDescriptors,
    ...global.monsterDescriptors,
    ...global.animalDescriptors,
    ...global.farmAnimalDescriptors,
    ...global.lawnAnimalDescriptors,
    ...global.reptileDescriptors,
    ...global.birdDescriptors,
    ...global.edgeModifiers,
    ...global.pathModifiers,
    ...global.audioModifierDescriptors,
    ...global.modifierDescriptors,
    ...global.weaponDescriptors,
    // ...global.complexDescriptors,
    ...global.goreDescriptors,
    ...global.colorModifiers,
    ...global.dungeonItemDescriptors,
    ...global.elementalModifiers,
    ...global.livingCreatureModifiers,
    ...global.facingModifiers,
  }

  global.descriptionModifiers = {
    ...global.colorModifiers,
    ...global.edgeModifiers,
    ...global.pathModifiers,
    ...global.audioModifierDescriptors,
    ...global.modifierDescriptors,
    ...global.elementalModifiers,
    ...global.livingCreatureModifiers,
    ...global.facingModifiers,
  }

}

export default {
  setDefault
}
