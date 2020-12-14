// i might be missing school theme?
// Locker, Chalkboard, School Chair, Desk, Etc

function setDefault() {
  window.generalDescriptors = {
    'Scifi Theme': {},
    'Fantasy Theme': {},
    'Platformer View': {},
  }

  window.elementDescriptors = {
    Grass: {},
    Dirt: {},
    Snow: {},
    Ice: {},
    Sand: {},
    Water: {},
    Stone: {},
    Metal: {},
    Wood: {},
    Glass: {},
    Gravel: {},
    Concrete: {},
    Brick: {},
    Mud: {},

    Gem: {},
    Ore: {},

    Fire: {},
    Electricity: {},
  }

  window.waterElementDescriptors = {
    'Water Element': {
      dontShowAdminsInSpriteSheetEditor: true,
      children: ['Bubbles', 'Waterfall', 'Whirlpool', 'Lily Pad'],
    },
    'Lily Pad': {},
    'Bubbles': {},
    'Waterfall': {},
    'Whirlpool': {},
  }

  window.overworldMapDescriptors = {
    Mountain : {},
    Tree : {
      children: ['Dead Tree', 'Colored Tree', 'Forest'],
    },
    'Hill' : {},
    Planet : {},
    Sun: {},
    Star: {},
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
  }

  window.buildingPartDescriptors = {
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
    'Magic Floor Tile': {
      children: [],//'Special Floor Tile',
    },
  }

  window.outsideBuildingDescriptors = {
    Fence: {},
    Plant: {
      children: ['Crop', 'Bush', 'Flower', 'Mushroom'],
    },
    Cactus: {},
    Mushroom: {},
    Bush: {},
    Flower: {},
    Crop: {},
    Sign: {},
    Grave: {},
    Gravestone: {},
    Coffin: {},
    Barrel: {},
    Crate: {},
    Pot: {},
    Box: {
      dontShowAdminsInSpriteSheetEditor: true,
      children: ['Pot', 'Barrel', 'Crate'],
    },
    Fountain: {}
  }

  window.insideBuildingDescriptors = {
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
      children: ['Computer', 'Engine'],
    },
    Computer: {},
    Furniture: {
      children: ['Chair', 'Table', 'Fireplace', 'Couch', 'Bookshelf', 'Stove', 'Oven'],
    },
    Booshelf: {},
    Couch: {},
    Chair: {},
    Table: {},
    Jewelry: {
      children: ['Necklace', 'Ring', 'Chalice']
    },
    Chalice: {},
    Necklance: {},
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
    Candy: {},
    Soda: {},
    Snack: {},
    Meat: {},
    Fruit: {},
    Vegetable: {},
    Drink: {},

    Device: {
      children: ['Clock', 'Computer', 'Phone'],
    },
    Engine: {},
    Phone: {},
    Clock: {},
    Fireplace: {},
    Bed: {},
    Throne: {},
    Carpet: {},
    'Display Case': {},
    'Weapon/Armor Stand': {}
  }

  window.otherDescriptors = {
    Stick: {},
    Rocks: {},
    Stalagmite: {},
    'Spider Web': {},
    'Sports Equipment': {},
    'Christmas Item': {},
    Manican: {},
    Mirror: {},
    'Bathroom Item': {
      children: ['Toilet', 'Sink'],
    },
    Toilet: {},
    Sink: {},
    Statue: {},
    'Church Item': {
      children: ['Candle', 'Altar'],
    },
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
    'Gas Can': {}
  }


  window.toolDescriptors = {
    Tool:  {
      dontShowAdminsInSpriteSheetEditor: true,
      children: ['Axe', 'Pickaxe', 'Torch', 'Device', 'Shovel'],
    },
    Device: window.insideBuildingDescriptors.Device,
    Pickaxe: {},
    Torch: {},

    Shovel: {},
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
    Magic: {},
    Bullet: {},
    Cannonball: {},
    Arrow: {},
    Wearable: {
      dontShowAdminsInSpriteSheetEditor: true,
      children: ['Cape', 'Robe', 'Hood', 'Shield', 'Armor', 'Helment', 'Clothes', 'Hat', 'Gloves', 'Boots'],
    },
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

  window.itemDescriptors = {
    Key: {
      children: window.insideBuildingDescriptors.Key,
    },
    Bottle: {},
    Heart: {},
    Food: window.insideBuildingDescriptors.Food,
    Bullet: window.toolDescriptors.Bullet,
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

  window.dungeonItemDescriptors = {
    Door: window.insideBuildingDescriptors.Door,
    Ladder: window.insideBuildingDescriptors.Ladder,
    Stairs: window.insideBuildingDescriptors.Stairs,
    Key: window.insideBuildingDescriptors.Key,
    Keyhole: {},
    Chest: {},
    Block: {},
    'Spikes': {},
    'Hole': {},
    'Switch': {},
    'Magic Floor Tile': window.insideBuildingDescriptors['Magic Floor Tile'],
    'Arrow Tile': {},
    'Warp Tile': {},
    'Button Tile': {},
  }

  window.transportDescriptors = {
    Vehicle: {
      dontShowAdminsInSpriteSheetEditor: true,
      children: ['Car', 'Boat', 'Spaceship', 'Rail Car'],
    },
    Boat: {},
    Car: {},
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

  window.humanDescriptors = {
    Human: {
      dontShowAdminsInSpriteSheetEditor: true,
      children: ['Spaceman', 'Wizard', 'King', 'Archer', 'Thief', 'Athlete', 'Priest', 'Cop'],
    },
    Spaceman: {},
    Wizard: {},
    King: {},
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
    Cop: {},
    'Citizen': {},
    'Villager': {},
    Detective: {},
  }

  window.animalDescriptors = {
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
      children: ['Unicorn', 'Dragon', 'Mermaid', 'Vampire', 'Mermaid', 'Demon', 'Golem', 'Griffin', 'Ent', 'Hag', 'Harpie'],
    },
    /// mythical
    Unicorn: {},
    Dragon: {},
    Demon: {},
    Ent: {},
  }

  window.reptileDescriptors = {
    Alligator: {},
    Cobra: {},
    Crocodile: {},
    Frog: {},
    Turtles: {},
    Snake: {},
  }

  window.lawnAnimalDescriptors = {
    Bunny: {},
    Mouse: {},
    Racoon: {},
    Squirrel: {},
    Mole: {},
    Frog: window.reptileDescriptors.Frog
  }

  window.farmAnimalDescriptors = {
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

  window.birdDescriptors = {
    Chicken: window.farmAnimalDescriptors.Chicken,
    Crow: {},
    Bat: {},
    Duck: {},
    Ostrich:{},
    Owl: {},
    Penguin: {},
    Seagull: {},
    Egg: {},
  }

  window.monsterDescriptors = {
    Monster: {
      dontShowAdminsInSpriteSheetEditor: true,
      children: ['Bug', 'Ghost', 'Goblin', 'Undead', 'Zombie', 'Alien', 'Mythical Beast', 'Machine'],
    },
    // Pest: {},
    Ghost: {},
    Goblin: {},
    Skeleton: {},
    Zombie: {},
    Mummy: {},
    Slime: {},
    Alien: {},
    Robot: {},
    Golem: {},
    Mermaid: {},
    Vampire: {},
    Hag: {},
    Harpie: {},
    Elemental: {},
    'Evil Eyeball': {
      withDescriptors: {
        Eyeball: true,
        Evil: true,
      }
    }
  }

  window.edgeDescriptors = {
    'Top': {},
    'Right': {},
    'Left': {},
    'Bottom': {},
    'TopLeft': {},
    'TopRight': {},
    'BottomLeft': {},
    'BottomRight': {},
  }

  window.graphicalModifierDescriptors = {
    'Many': {},
    'Dead': {},
    'Broken': {},
    'Carpeted': {},
    'Messy': {},
    'Frozen': {},
    'With Snow': {},
    'With Fruit': {},
    'Pine': {},
    'Tropical': {},
    'On Fire': {},
    'In Water': {},
    'In Air': {},
    'With Blood': {},
    'Elf': {},
    'Goblin': {},
    'Two Headed': {},
    'Open': {},
    'Mounted': {},
    'Boarded Up': {},
    'With Window': {},
    'Mythical': {},
    'Magical': {},
    'Child': {},
    'Male': {},
    "Female": {},
    'Horned': {},
    'Evil': {},
    Small: {
      audioRelated: true,
      dontShowAdminsInSpriteSheetEditor: true,},
    Large: {
      audioRelated: true,
      dontShowAdminsInSpriteSheetEditor: true,},
  }

  window.audioModifierDescriptor = {
    Small: window.graphicalModifierDescriptors.Small,
    Large: window.graphicalModifierDescriptors.Large,
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

  window.colorModifiers = {
    'Dark': {},
    'Brown': {},
    'Orange': {},
    'Grey': {},
    'Blue': {},
    'Red': {},
    'Rainbow': {},
    'Purple': {},
    'White': {},
    'Flame': {},
    'Pink': {}
  }

  window.complexDescriptors = {
    Forest : {
      withDescriptors: {
        Tree: true,
        Many: true
      }
    },
    // 'Mountain Range' : {
    //   withDescriptors: {
    //     Mountain: true,
    //     Many: true
    //   }
    // },
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
        Darker: true
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
        'On Fire': true
      }
    },
    'Lantern (On)': {
      withDescriptors: {
        Lantern: true,
        'On Fire': true
      }
    },
    'Quiver': {
      withDescriptors: {
        Arrow: true,
        Many: true
      }
    },
    Cavalry: {
      withDescriptors: {
        Knight: true,
        Mounted: true
      }
    },
    'Evil Eyeball': window.monsterDescriptors['Evil Eyeball']
  }

  window.goreDescriptors = {
    'Body Part': {
      children: ['Eyeball', 'Arm', 'Leg', 'Torso', 'Head']
    },
    Eyeball: {},
    Arm: {},
    Leg: {},
    Torso: {},
    Head: {}
  }

  window.allDescriptors = {
    ...window.generalDescriptors,
    ...window.elementDescriptors,
    ...window.overworldMapDescriptors,
    ...window.buildingPartDescriptors,
    ...window.outsideBuildingDescriptors,
    ...window.insideBuildingDescriptors,
    ...window.otherDescriptors,
    ...window.toolDescriptors,
    ...window.itemDescriptors,
    ...window.transportDescriptors,
    ...window.humanDescriptors,
    ...window.monsterDescriptors,
    ...window.animalDescriptors,
    ...window.farmAnimalDescriptors,
    ...window.lawnAnimalDescriptors,
    ...window.reptileDescriptors,
    ...window.birdDescriptors,
    ...window.edgeDescriptors,
    ...window.audioModifierDescriptors,
    ...window.graphicalModifierDescriptors,
    ...window.complexDescriptors,
    ...window.goreDescriptors,
    ...window.colorModifiers,
  }

}

export default {
  setDefault
}
