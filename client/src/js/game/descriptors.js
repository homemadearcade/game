// i might be missing school theme?
// Locker, Chalkboard, School Chair, Desk, Etc

function setDefault() {
  window.generalDescriptors = {
    'Scifi Theme': {},
    'Fantasy Theme': {},
    'Platformer Useable': {},
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
    'Dark Water': {
      withDescriptors: {
        Water: true,
        Dark: true
      }
    },
    'Bubbles': {},
    'Waterfall': {},
    'Whirlpool': {},
  }

  window.overworldMapDescriptors = {
    Mountain : {},
    Tree : {
      children: ['Dead Tree', 'Colored Tree', 'Forest'],
    },
    'Dead Tree' : {
      withDescriptors: {
        Tree: true,
        Dead: true
      }
    },
    'Dark Tree' : {
      withDescriptors: {
        Tree: true,
        Darker: true
      }
    },
    'Sand Dune' : {
      withDescriptors: {
        Mountain: true,
        Sand: true
      }
    },
    'Hill' : {},
    Forest : {
      withDescriptors: {
        Tree: true,
        Many: true
      }
    },
    Planet : {},
    House : {
      children: ['Village'],
    },
    Village: {
      withDescriptors: {
        House: true,
        Many: true
      }
    },
    Castle : {},
    Cave : {},
    Building : {
      children: ['Castle', 'House', 'Church', 'Store', 'Village'],
    },
    Church : {},
    Store : {},
    'Wall' : {},
  }

  window.buildingPartDescriptors = {
    'Building Wall': {},
    'Building Floor Tile': {},
    // 'Special Floor Tile': {
    //   children: []
    // },
    'Magic Floor Tile': {
      children: [],//'Special Floor Tile',
    },
    'Spaceship Wall': {},
    Block: {},
    Door: {},
    Ladder: {},
    Stairs: {},
    Window: {},
    Pipe: {},
    Chimney: {},
  }

  window.outsideBuildingDescriptors = {
    Fence: {},
    Plant: {
      dontShowAdminsInSpriteSheetEditor: true,
      children: ['Crop', 'Bush', 'Flower'],
    },
    Bush: {},
    Flower: {},
    Crop: {},
    Sign: {},
    Grave: {},
    Flag: {},
    Barrel: {},
    Crate: {},
    Pot: {},
    Box: {
      dontShowAdminsInSpriteSheetEditor: true,
      children: ['Pot', 'Barrel', 'Crate'],
    },
  }

  window.insideBuildingDescriptors = {
    'Musical Instrument': {},
    Candle: {
      relatedSprites: ['Torch'],
    },
    Appliance: {},
    Machine: {
      children: ['Computer'],
    },
    Computer: {},
    Furniture: {
      children: ['Chair', 'Table', 'Fireplace', 'Couch'],
    },
    Couch: {},
    Chair: {},
    Table: {},
    Jewelry: {
      children: ['Necklace', 'Ring']
    },
    Necklance: {},
    Ring: {},
    'Kitchen Utensil': {},
    Food: {},
    Device: {
      children: ['Clock', 'Computer', 'Phone'],
    },
    Phone: {},
    Clock: {},
    Fireplace: {},
    Bed: {},
  }

  window.otherDescriptors = {
    Stalagmite: {},
    'Spider Web': {},
    Candy: {},
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
      children: ['Candle'],
    },
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
    'Undescribed': {},
  }


  window.toolDescriptors = {
    Tool:  {
      dontShowAdminsInSpriteSheetEditor: true,
      children: ['Pickaxe', 'Torch', 'Device'],
    },
    Device: window.insideBuildingDescriptors.Device,
    Pickaxe: {},
    Torch: {},
    Weapon: {
      dontShowAdminsInSpriteSheetEditor: true,
      children: ['Axe', 'Staff', 'Mace', 'Gun', 'Sword','Bow', 'Laser', 'Spear', 'Bomb'],
    },
    'Melee Weapon': {
      dontShowAdminsInSpriteSheetEditor: true,
      children: ['Axe','Mace', 'Sword','Spear', 'Whip'],
    },
    'Ranged Weapon': {
      dontShowAdminsInSpriteSheetEditor: true,
      children: ['Staff','Gun','Bow','Laser','Spear', 'Wand'],
    },
    Axe: {},
    Staff: {},
    Wand: {},
    Mace: {},
    Gun: {
      dontShowAdminsInSpriteSheetEditor: true,
      children: ['Cannon', 'Shotgun', 'Pistol', 'Rocket Launcher', 'Rifle', 'Machine Gun'],
    },
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
    Bomb: {
      children: ['Dynamite'],
    },
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
      children: ['Armor', 'Clothes', 'Robes', 'Hat', 'Gloves', 'Boots'],
    },
    Armor: {},
    Clothes: {},
    Gloves: {},
    Boots: {},
    Robes: {},
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
    'Magic Floor Tile': window.insideBuildingDescriptors['Magic Floor Tile']
  }

  window.transportDescriptors = {
    Vehicle: {
      dontShowAdminsInSpriteSheetEditor: true,
      children: ['Car', 'Boat', 'Spaceship', 'Rail Car'],
    },
    Boat: {},
    Car: {},
    // Tank: {
    //   children: []
    // },
    Spaceship: {},
    // Plane: {
    //   children: []
    // },
    Rail: {},
    'Rail Car': {},
    Street: {},
    'Traffic Item': {},
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
    Cavalry: {},
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
    Fish: {
      children: ['Mola Mola', 'Shark']
    },
    Bug: {
      children: [
        'Bee',
        'Butterfly'
      ]
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
    'Mola Mola': {},
    Shark: {},
    Eel: {},
    Jellyfish: {},
    Crayfish: {},
    Whale: {},

    // other
    'Musk Ox': {},
    Hippo: {},
    Bison: {},
    Monkey: {},
    Panda: {},
    Elephant: {},

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
    Bee: {},
    Butterfly: {},
    Scorpion: {},
    Fly: {},
    Ladybug: {},
    Spider: {},
    Leech: {},
    Beetle: {},
    Grasshopper: {},


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
    'Yak': {}
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
    Harpie: {}
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
    'Darker': {},
    'Broken': {},
    'In Water': {},
    'In Air': {},
    'Mythical': {},
    'Magical': {},
    'Child': {},
    'Male': {},
    "Female": {},
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

  }

}

export default {
  setDefault
}
