// i might be missing school theme?
// Locker, Chalkboard, School Chair, Desk, Etc

function setDefault() {
  window.generalDescriptors = {
    'Scifi Theme': {
      children: [],
      inSprites: true,
    },
    'Fantasy Theme': {
      children: [],
      inSprites: true,
    },
    'Platformer Useable': {
      children: [],
      inSprites: true,
    },
  }

  window.elementDescriptors = {
    Grass: {
      children: [],
      inSprites: true,
    },
    Dirt: {
      children: [],
      inSprites: true,
    },
    Snow: {
      children: [],
      inSprites: true,
    },
    Ice: {
      children: [],
      inSprites: true,
    },
    Sand: {
      children: [],
      inSprites: true,
    },
    Water: {
      children: [],
      inSprites: true,
    },
    Stone: {
      children: [],
      inSprites: true,
    },
    Metal: {
      children: [],
      inSprites: true,
    },
    Wood: {
      children: [],
      inSprites: true,
    },
    Glass: {
      children: [],
      inSprites: true,
    },
    Gravel: {
      children: [],
      inSprites: true,
    },
    Concrete: {
      children: [],
      inSprites: true,
    },
    Mud: {
      children: [],
      inSprites: true,
    },
    Gem: {
      children: [],
      inSprites: true,
    },
    Ore: {
      children: [],
      inSprites: true,
    },
    Fire: {
      children: [],
      inSprites: true,
    },
    Electricity: {
      children: [],
      inSprites: true,
    },
  }

  window.waterElementDescriptors = {
    'Water Element': {
      dontShowAdminsInSpriteSheetEditor: true,
      children: ['Bubbles', 'Waterfall', 'Whirlpool', 'Lily Pad'],
      inSprites: true,
    },
    'Lily Pad': {
      children: [],
      inSprites: true,
    },
    'Dark Water': {
      withDescriptors: {
        Water: true,
        Dark: true
      }
    },
    'Bubbles': {
      children: [],
      inSprites: true,
    },
    'Waterfall': {
      children: [],
      inSprites: true,
    },
    'Whirlpool': {
      children: [],
      inSprites: true,
    },
  }

  window.overworldMapDescriptors = {
    Mountain : {
      children: [],
      inSprites: true,
    },
    Tree : {
      children: ['Dead Tree', 'Colored Tree', 'Forest'],
      inSprites: true,
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
    Forest : {
      withDescriptors: {
        Tree: true,
        Many: true
      }
    },
    Planet : {
      children: [],
      inSprites: true,
    },
    House : {
      children: ['Village'],
      inSprites: true,
    },
    Village: {
      children: ['House'],
      inSprites: true,
    },
    Castle : {
      children: [],
      inSprites: true,
    },
    Cave : {
      children: [],
      inSprites: true,
    },
    Building : {
      children: ['Castle', 'House', 'Church', 'Store', 'Village'],
      inSprites: true,
    },
    Church : {
      children: [],
      inSprites: true,
    },
    Store : {
      children: [],
      inSprites: true,
    },
    'Wall' : {
      children: [],
      inSprites: true,
    },
  }

  window.buildingPartDescriptors = {
    'Building Wall': {
      children: [],
      inSprites: true,
    },
    'Building Floor Tile': {
      children: [],
      inSprites: true,
    },
    // 'Special Floor Tile': {
    //   children: []
    // },
    'Magic Floor Tile': {
      children: [],//'Special Floor Tile',
      inSprites: true,
    },
    'Spaceship Wall': {
      children: [],
      inSprites: true,
    },
    Block: {
      children: [],
      inSprites: true,
    },
    Door: {
      children: [],
      inSprites: true,
    },
    Ladder: {
      children: [],
      inSprites: true,
    },
    Stairs: {
      children: [],
      inSprites: true,
    },
    Window: {
      children: [],
      inSprites: true,
    },
    Pipe: {
      children: [],
      inSprites: true,
    },
    Chimney: {
      children: [],
      inSprites: true,
    },
  }

  window.outsideBuildingDescriptors = {
    Fence: {
      children: [],
      inSprites: true,
    },
    Plant: {
      dontShowAdminsInSpriteSheetEditor: true,
      children: ['Crop', 'Bush', 'Flower'],
      inSprites: true,
    },
    Bush: {
      children: [],
      inSprites: true,
    },
    Flower: {
      children: [],
      inSprites: true,
    },
    Crop: {
      children: [],
      inSprites: true,
    },
    Sign: {
      children: [],
      inSprites: true,
    },
    Grave: {
      children: [],
      inSprites: true,
    },
    Flag: {
      children: [],
      inSprites: true,
    },
    Barrel: {
      children: [],
      inSprites: true,
    },
    Crate: {
      children: [],
      inSprites: true,
    },
    Pot: {
      children: [],
      inSprites: true,
    },
    Box: {
      dontShowAdminsInSpriteSheetEditor: true,
      children: ['Pot', 'Barrel', 'Crate'],
      inSprites: true,
    },
  }

  window.insideBuildingDescriptors = {
    'Musical Instrument': {
      children: [],
      inSprites: true,
    },
    Candle: {
      children: ['Torch'],
      inSprites: true,
    },
    Chest: {
      children: [],
      inSprites: true,
    },
    Appliance: {
      children: [],
      inSprites: true,
    },
    Machine: {
      children: ['Computer'],
      inSprites: true,
    },
    Computer: {
      children: [],
      inSprites: true,
    },
    Furniture: {
      children: ['Chair', 'Table', 'Fireplace', 'Couch'],
      inSprites: true,
    },
    Couch: {
      children: [],
      inSprites: true,
    },
    Chair: {
      children: [],
      inSprites: true,
    },
    Table: {
      children: [],
      inSprites: true,
    },
    Jewelry: {
      children: [],
      inSprites: true,
    },
    'Kitchen Utensil': {
      children: [],
      inSprites: true,
    },
    Food: {
      children: [],
      inSprites: true,
    },
    Device: {
      children: ['Clock', 'Computer', 'Phone'],
      inSprites: true,
    },
    Phone: {
      children: [],
      inSprites: true,
    },
    Clock: {
      children: [],
      inSprites: true,
    },
    Key: {
      children: [],
      inSprites: true,
    },
    KeyHole: {
      children: [],
      inSprites: true,
    },
    Fireplace: {
      children: [],
      inSprites: true,
    },
    Bed: {
      children: [],
      inSprites: true,
    },
  }

  window.otherDescriptors = {
    Stalagmite: {
      children: [],
      inSprites: true,
    },
    'Spider Web': {
      children: [],
      inSprites: true,
    },
    Candy: {
      children: [],
      inSprites: true,
    },
    'Sports Equipment': {
      children: [],
      inSprites: true,
    },
    'Christmas Item': {
      children: [],
      inSprites: true,
    },
    Manican: {
      children: [],
      inSprites: true,
    },
    Mirror: {
      children: [],
      inSprites: true,
    },
    'Bathroom Item': {
      children: ['Toilet', 'Sink'],
      inSprites: true,
    },
    Toilet: {
      children: [],
      inSprites: true,
    },
    Sink: {
      children: [],
      inSprites: true,
    },
    Statue: {
      children: [],
      inSprites: true,
    },
    'Church Item': {
      children: ['Candle'],
      inSprites: true,
    },
    'Public Item': {
      children: ['Trash', 'Mailbox', 'Fire Hydrant'],
      inSprites: true,
    },
    Trash: {
      children: [],
      inSprites: true,
    },
    Mailbox: {
      children: [],
      inSprites: true,
    },
    'Fire Hydrant': {
      children: [],
      inSprites: true,
    },
    'User Interface': {
      children: ['Heart'],
      inSprites: true,
    },
    'Undescribed': {
      children: [],
      inSprites: true,
    },
  }


  window.toolDescriptors = {
    Tool:  {
      dontShowAdminsInSpriteSheetEditor: true,
      children: ['Pickaxe', 'Torch', 'Device'],
      inSprites: true,
    },
    Device: window.insideBuildingDescriptors.Device,
    Pickaxe: {
      children: [],
      inSprites: true,
    },
    Torch: {
      children: [],
      inSprites: true,
    },
    Weapon: {
      dontShowAdminsInSpriteSheetEditor: true,
      children: ['Axe', 'Staff', 'Mace', 'Gun', 'Sword','Bow', 'Laser', 'Spear', 'Bomb'],
      inSprites: true,
    },
    'Melee Weapon': {
      dontShowAdminsInSpriteSheetEditor: true,
      children: ['Axe','Mace', 'Sword','Spear'],
      inSprites: true,
    },
    'Ranged Weapon': {
      dontShowAdminsInSpriteSheetEditor: true,
      children: ['Staff','Gun','Bow','Laser','Spear'],
      inSprites: true,
    },
    Axe: {
      children: [],
      inSprites: true,
    },
    Staff: {
      children: [],
      inSprites: true,
    },
    Mace: {
      children: [],
      inSprites: true,
    },
    Gun: {
      dontShowAdminsInSpriteSheetEditor: true,
      children: ['Cannon', 'Shotgun', 'Pistol', 'Rocket Launcher', 'Rifle', 'Machine Gun'],
      inSprites: true,
    },
    Cannon: {
      children: [],
      inSprites: true,
    },
    Shotgun: {
      children: [],
      inSprites: true,
    },
    Pistol: {
      children: [],
      inSprites: true,
    },
    'Rocket Launcher': {
      children: [],
      inSprites: true,
    },
    'Rifle': {
      children: [],
      inSprites: true,
    },
    'Machine Gun':{
      children: [],
      inSprites: true,
    },
    Sword: {
      children: [],
      inSprites: true,
    },
    Bow: {
      children: [],
      inSprites: true,
    },
    Laser: {
      children: [],
      inSprites: true,
    },
    Spear: {
      children: [],
      inSprites: true,
    },
    Bomb: {
      children: ['Dynamite'],
      inSprites: true,
    },
    'Dynamite': {
      children: [],
      inSprites: true,
    },
    Projectile: {
      dontShowAdminsInSpriteSheetEditor: true,
      children: ['Magic', 'Bullet', 'Arrow', 'Spear', 'Cannonball'],
      inSprites: true,
    },
    Magic: {
      children: [],
      inSprites: true,
    },
    Bullet: {
      children: [],
      inSprites: true,
    },
    Cannonball: {
      children: [],
      inSprites: true,
    },
    Arrow: {
      children: [],
      inSprites: true,
    },
    Wearable: {
      dontShowAdminsInSpriteSheetEditor: true,
      children: ['Armor', 'Clothes', 'Robes', 'Hat'],
      inSprites: true,
    },
    Armor: {
      children: [],
      inSprites: true,
    },
    Clothes: {
      children: [],
      inSprites: true,
    },
    Robes: {
      children: [],
      inSprites: true,
    },
    Hat: {
      children: [],
      inSprites: true,
    },
  }

  window.itemDescriptors = {
    Key: {
      children: window.insideBuildingDescriptors.Key,
      inSprites: true,
    },
    Bottle: {
      children: [],
      inSprites: true,
    },
    Heart: {
      children: [],
      inSprites: true,
    },
    Food: window.insideBuildingDescriptors.Food,
    Bullet: window.toolDescriptors.Bullet,
    'Expensive Item': {
      dontShowAdminsInSpriteSheetEditor: true,
      children: ['Gold', 'Jewelry', 'Coin'],
      inSprites: true,
    },
    Gold: {
      children: [],
      inSprites: true,
    },
    Coin: {
      children: [],
      inSprites: true,
    },
    Literature: {
      dontShowAdminsInSpriteSheetEditor: true,
      children: ['Book', 'Page', 'Scroll', 'Disk'],
      inSprites: true,
    },
    Book: {
      children: [],
      inSprites: true,
    },
    Page: {
      children: [],
      inSprites: true,
    },
    Scroll: {
      children: [],
      inSprites: true,
    },
    Disk: {
      children: []
    }
  }

  // window.dungeonItemDescriptors = {
  //   Door: window.insideBuildingDescriptors.Door,
  //   Ladder: window.insideBuildingDescriptors.Ladder,
  //   Stairs: window.insideBuildingDescriptors.Stairs,
  //   Key: window.insideBuildingDescriptors.Stairs
  //   Keyhole: {
  //     children: []
  //   },
  //   Chest: {
  //     children: []
  //   },
  //   Block: {
  //     children: []
  //   },
  //   'Magic Floor Tile': window.insideBuildingDescriptors['Magic Floor Tile']
  // }

  window.transportDescriptors = {
    Vehicle: {
      dontShowAdminsInSpriteSheetEditor: true,
      children: ['Car', 'Boat', 'Spaceship', 'Rail Car'],
      inSprites: true,
    },
    Boat: {
      children: [],
      inSprites: true,
    },
    Car: {
      children: [],
      inSprites: true,
    },
    // Tank: {
    //   children: []
    // },
    Spaceship: {
      children: [],
      inSprites: true,
    },
    // Plane: {
    //   children: []
    // },
    Rail: {
      children: [],
      inSprites: true,
    },
    'Rail Car': {
      children: [],
      inSprites: true,
    },
    Street: {
      children: [],
      inSprites: true,
    },
    'Traffic Item': {
      children: [],
      inSprites: true,
    },
    'Spaceship Wall': {
      children: [],
      inSprites: true,
    },
  }

  window.humanDescriptors = {
    Human: {
      dontShowAdminsInSpriteSheetEditor: true,
      children: ['Spaceman', 'Wizard', 'King', 'Archer', 'Thief', 'Athlete', 'Priest', 'Cop'],
      inSprites: true,
    },
    Spaceman: {
      children: [],
      inSprites: true,
    },
    Wizard: {
      children: [],
      inSprites: true,
    },
    King: {
      children: [],
      inSprites: true,
    },
    Archer: {
      children: [],
      inSprites: true,
    },
    Warrior: {
      children: [],
      inSprites: true,
    },
    Thief: {
      children: [],
      inSprites: true,
    },
    Athlete: {
      children: [],
      inSprites: true,
    },
    Priest: {
      children: [],
      inSprites: true,
    },
    Cop: {
      children: [],
      inSprites: true,
    },
  }

  window.animalDescriptors = {
    Animal: {
      dontShowAdminsInSpriteSheetEditor: true,
      children: ['Cat', 'Bird', 'Dog', 'Mouse', 'Chicken', 'Bug', 'Fish', 'Reptile', 'Bat', 'Deer', 'Bear'],
      inSprites: true,
    },
    /// sound oriented
    Cat: {
      children: [],
      inSprites: true,
    },
    Bird: {
      children: [],
      inSprites: true,
    },
    Dog: {
      children: [],
      inSprites: true,
    },
    Horse: {
      children: [],
      inSprites: true,
    },
    Lion: {
      children: [],
      inSprites: true,
    },
    Wolf: {
      children: [],
      inSprites: true,
    },
    Sheep: {
      children: [],
      inSprites: true,
    },
    Mouse: {
      children: ['Rat'],
      inSprites: true,
    },
    Chicken: {
      children: [],
      inSprites: true,
    },
    /// non sound oriented
    Bug: {
      children: [],
      inSprites: true,
    },
    Fish: {
      children: [],
      inSprites: true,
    },
    Reptile: {
      children: [],
      inSprites: true,
    },
    Bat: {
      children: [],
      inSprites: true,
    },
    Deer: {
      children: [],
      inSprites: true,
    },
    Bear: {
      children: [],
      inSprites: true,
    },
    'Mythical Beast': {
      children: [],
      inSprites: true,
    },
  }

  window.monsterDescriptors = {
    Monster: {
      dontShowAdminsInSpriteSheetEditor: true,
      children: ['Bug', 'Ghost', 'Goblin', 'Undead', 'Zombie', 'Alien', 'Mythical', 'Machine'],
      inSprites: true,
    },
    Bug: window.animalDescriptors.Bug,
    Ghost: {
      children: [],
      inSprites: true,
    },
    Goblin: {
      children: [],
      inSprites: true,
    },
    Undead: {
      children: [],
      inSprites: true,
    },
    Zombie: {
      children: [],
      inSprites: true,
    },
    Alien: {
      children: [],
      inSprites: true,
    },
    Robot: {
      children: [],
      inSprites: true,
    },
    'Mythical Beast': window.animalDescriptors['Mythical Beast']
  }

  window.edgeDescriptors = {
    'Top': {
      children: [],
      inSprites: true,
    },
    'Right': {
      children: [],
      inSprites: true,
    },
    'Left': {
      children: [],
      inSprites: true,
    },
    'Bottom': {
      children: [],
      inSprites: true,
    },
    'TopLeft': {
      children: [],
      inSprites: true,
    },
    'TopRight': {
      children: [],
      inSprites: true,
    },
    'BottomLeft': {
      children: [],
      inSprites: true,
    },
    'BottomRight': {
      children: [],
      inSprites: true,
    },
  }

  window.graphicalModifierDescriptors = {
    'Many': {
      children: [],
      inSprites: true,
    },
    'Dead': {
      children: [],
      inSprites: true,
    },
    'Darker': {
      children: [],
      inSprites: true,
    },
    'Broken': {
      children: [],
      inSprites: true,
    },
    Small: {
      audioRelated: true,
      dontShowAdminsInSpriteSheetEditor: true,
      children: [],
    },
    Large: {
      audioRelated: true,
      dontShowAdminsInSpriteSheetEditor: true,
      children: [],
    },
  }

  window.audioModifierDescriptor = {
    Small: window.graphicalModifierDescriptors.Small,
    Large: window.graphicalModifierDescriptors.Large,
    Cute: {
      audioRelated: true,
      dontShowAdminsInSpriteSheetEditor: true,
      children: [],
    },
    Mean: {
      audioRelated: true,
      dontShowAdminsInSpriteSheetEditor: true,
      children: [],
    },
    Evil: {
      audioRelated: true,
      dontShowAdminsInSpriteSheetEditor: true,
      children: [],
    },
    Mad: {
      audioRelated: true,
      dontShowAdminsInSpriteSheetEditor: true,
      children: [],
    },
    Happy: {
      audioRelated: true,
      dontShowAdminsInSpriteSheetEditor: true,
      children: [],
    },
    Random: {
      dontShowAdminsInSpriteSheetEditor: true,
      children: [],
    },
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
    ...window.edgeDescriptors,
    ...window.audioModifierDescriptors,
    ...window.graphicalModifierDescriptors,

  }

}

export default {
  setDefault
}
