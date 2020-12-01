// i might be missing school theme?
// Locker, Chalkboard, School Chair, Desk, Etc

function setDefault() {

  window.generalDescriptors = {
    'Scifi Theme': {
      aliases: [],
      inSprites: true,
    },
    'Fantasy Theme': {
      aliases: [],
      inSprites: true,
    },
    'Platformer Useable': {
      aliases: [],
      inSprites: true,
    },
  }

  window.elementDescriptors = {
    Grass: {
      aliases: [],
      inSprites: true,
    },
    Dirt: {
      aliases: [],
      inSprites: true,
    },
    Snow: {
      aliases: [],
      inSprites: true,
    },
    Ice: {
      aliases: [],
      inSprites: true,
    },
    Sand: {
      aliases: [],
      inSprites: true,
    },
    Water: {
      aliases: ['Waters Edge', 'Deep Water', 'Swamp Water'],
      inSprites: true,
    },
    Stone: {
      aliases: [],
      inSprites: true,
    },
    Metal: {
      aliases: [],
      inSprites: true,
    },
    Wood: {
      aliases: [],
      inSprites: true,
    },
    Glass: {
      aliases: [],
      inSprites: true,
    },
    Gravel: {
      aliases: [],
      inSprites: true,
    },
    Concrete: {
      aliases: [],
      inSprites: true,
    },
    Mud: {
      aliases: [],
      inSprites: true,
    },
    Gem: {
      aliases: [],
      inSprites: true,
    },
    Ore: {
      aliases: [],
      inSprites: true,
    },
    Fire: {
      aliases: [],
      inSprites: true,
    },
    Electricity: {
      aliases: [],
      inSprites: true,
    },
  }

  window.waterElementDescriptors = {
    'Water Element': {
      dontShowAdminsInSpriteSheetEditor: true,
      aliases: ['Bubbles', 'Waterfall', 'Whirlpool', 'Lily Pad'],
      inSprites: true,
    },
    'Lily Pad': {
      aliases: [],
      inSprites: true,
    },
    'Deep Water': {
      aliases: [],
      inSprites: true,
    },
    'Swamp Water': {
      aliases: [],
      inSprites: true,
    },
    'Waters Edge': {
      aliases: [],
      inSprites: true,
    },
    'Bubbles': {
      aliases: [],
      inSprites: true,
    },
    'Waterfall': {
      aliases: [],
      inSprites: true,
    },
    'Whirlpool': {
      aliases: [],
      inSprites: true,
    },
  }

  window.overworldMapDescriptors = {
    Mountain : {
      aliases: [],
      inSprites: true,
    },
    Tree : {
      aliases: ['Dead Tree', 'Colored Tree', 'Forest'],
      inSprites: true,
    },
    'Dead Tree' : {
      aliases: [],
      inSprites: true,
    },
    'Colored Tree' : {
      aliases: [],
      inSprites: true,
    },
    Forest : {
      aliases: ['Tree'],
      inSprites: true,
    },
    Planet : {
      aliases: [],
      inSprites: true,
    },
    House : {
      aliases: ['Village'],
      inSprites: true,
    },
    Village: {
      aliases: ['House'],
      inSprites: true,
    },
    Castle : {
      aliases: [],
      inSprites: true,
    },
    Cave : {
      aliases: [],
      inSprites: true,
    },
    Building : {
      aliases: ['Castle', 'House', 'Church', 'Store', 'Village'],
      inSprites: true,
    },
    Church : {
      aliases: [],
      inSprites: true,
    },
    Store : {
      aliases: [],
      inSprites: true,
    },
    'Fortified Wall' : {
      aliases: [],
      inSprites: true,
    },
  }

  window.buildingPartDescriptors = {
    'Building Wall': {
      aliases: [],
      inSprites: true,
    },
    'Building Floor Tile': {
      aliases: [],
      inSprites: true,
    },
    // 'Special Floor Tile': {
    //   aliases: []
    // },
    'Magic Floor Tile': {
      aliases: [],//'Special Floor Tile',
      inSprites: true,
    },
    'Spaceship Wall': {
      aliases: [],
      inSprites: true,
    },
    Block: {
      aliases: [],
      inSprites: true,
    },
    Door: {
      aliases: [],
      inSprites: true,
    },
    Ladder: {
      aliases: [],
      inSprites: true,
    },
    Stairs: {
      aliases: [],
      inSprites: true,
    },
    Window: {
      aliases: [],
      inSprites: true,
    },
    Pipe: {
      aliases: [],
      inSprites: true,
    },
    Chimney: {
      aliases: [],
      inSprites: true,
    },
  }

  window.outsideBuildingDescriptors = {
    Fence: {
      aliases: [],
      inSprites: true,
    },
    Plant: {
      dontShowAdminsInSpriteSheetEditor: true,
      aliases: ['Crop', 'Bush', 'Flower'],
      inSprites: true,
    },
    Bush: {
      aliases: [],
      inSprites: true,
    },
    Flower: {
      aliases: [],
      inSprites: true,
    },
    Crop: {
      aliases: [],
      inSprites: true,
    },
    Sign: {
      aliases: [],
      inSprites: true,
    },
    Grave: {
      aliases: [],
      inSprites: true,
    },
    Flag: {
      aliases: [],
      inSprites: true,
    },
    Barrel: {
      aliases: [],
      inSprites: true,
    },
    Crate: {
      aliases: [],
      inSprites: true,
    },
    Pot: {
      aliases: [],
      inSprites: true,
    },
    Box: {
      aliases: ['Pot', 'Barrel', 'Crate'],
      inSprites: true,
    },
  }



  window.insideBuildingDescriptors = {
    'Musical Instrument': {
      aliases: [],
      inSprites: true,
    },
    Candle: {
      aliases: ['Torch'],
      inSprites: true,
    },
    Chest: {
      aliases: [],
      inSprites: true,
    },
    Appliance: {
      aliases: [],
      inSprites: true,
    },
    Machine: {
      aliases: ['Computer'],
      inSprites: true,
    },
    Computer: {
      aliases: [],
      inSprites: true,
    },
    Furniture: {
      aliases: ['Chair', 'Table', 'Fireplace', 'Couch'],
      inSprites: true,
    },
    Couch: {
      aliases: [],
      inSprites: true,
    },
    Chair: {
      aliases: [],
      inSprites: true,
    },
    Table: {
      aliases: [],
      inSprites: true,
    },
    Jewelry: {
      aliases: [],
      inSprites: true,
    },
    'Kitchen Utensil': {
      aliases: [],
      inSprites: true,
    },
    Food: {
      aliases: [],
      inSprites: true,
    },
    Device: {
      aliases: ['Clock', 'Computer', 'Phone'],
      inSprites: true,
    },
    Phone: {
      aliases: [],
      inSprites: true,
    },
    Clock: {
      aliases: [],
      inSprites: true,
    },
    Key: {
      aliases: [],
      inSprites: true,
    },
    KeyHole: {
      aliases: [],
      inSprites: true,
    },
    Fireplace: {
      aliases: [],
      inSprites: true,
    },
    Bed: {
      aliases: [],
      inSprites: true,
    },
  }

  window.otherDescriptors = {
    Stalagmite: {
      aliases: [],
      inSprites: true,
    },
    'Spider Web': {
      aliases: [],
      inSprites: true,
    },
    Candy: {
      aliases: [],
      inSprites: true,
    },
    'Sports Equipment': {
      aliases: [],
      inSprites: true,
    },
    'Christmas Item': {
      aliases: [],
      inSprites: true,
    },
    Manican: {
      aliases: [],
      inSprites: true,
    },
    Mirror: {
      aliases: [],
      inSprites: true,
    },
    'Bathroom Item': {
      aliases: ['Toilet', 'Sink'],
      inSprites: true,
    },
    Toilet: {
      aliases: [],
      inSprites: true,
    },
    Sink: {
      aliases: [],
      inSprites: true,
    },
    Statue: {
      aliases: [],
      inSprites: true,
    },
    'Church Item': {
      aliases: ['Candle'],
      inSprites: true,
    },
    'Public Item': {
      aliases: ['Trash', 'Mailbox', 'Fire Hydrant'],
      inSprites: true,
    },
    Trash: {
      aliases: [],
      inSprites: true,
    },
    Mailbox: {
      aliases: [],
      inSprites: true,
    },
    'Fire Hydrant': {
      aliases: [],
      inSprites: true,
    },
    'User Interface': {
      aliases: ['Heart'],
      inSprites: true,
    },
    'Undescribed': {
      aliases: [],
      inSprites: true,
    },
  }


  window.toolDescriptors = {
    Tool:  {
      dontShowAdminsInSpriteSheetEditor: true,
      aliases: ['Pickaxe', 'Torch', 'Device'],
      inSprites: true,
    },
    Device: window.insideBuildingDescriptors.Device,
    Pickaxe: {
      aliases: [],
      inSprites: true,
    },
    Torch: {
      aliases: [],
      inSprites: true,
    },
    Weapon: {
      dontShowAdminsInSpriteSheetEditor: true,
      aliases: ['Axe', 'Staff', 'Mace', 'Gun', 'Sword','Bow', 'Laser', 'Spear', 'Bomb'],
      inSprites: true,
    },
    'Melee Weapon': {
      dontShowAdminsInSpriteSheetEditor: true,
      aliases: ['Axe','Mace', 'Sword','Spear'],
      inSprites: true,
    },
    'Ranged Weapon': {
      dontShowAdminsInSpriteSheetEditor: true,
      aliases: ['Staff','Gun','Bow','Laser','Spear'],
      inSprites: true,
    },
    Axe: {
      aliases: [],
      inSprites: true,
    },
    Staff: {
      aliases: [],
      inSprites: true,
    },
    Mace: {
      aliases: [],
      inSprites: true,
    },
    Gun: {
      dontShowAdminsInSpriteSheetEditor: true,
      aliases: ['Cannon', 'Shotgun', 'Pistol', 'Rocket Launcher', 'Rifle', 'Machine Gun'],
      inSprites: true,
    },
    Cannon: {
      aliases: [],
      inSprites: true,
    },
    Shotgun: {
      aliases: [],
      inSprites: true,
    },
    Pistol: {
      aliases: [],
      inSprites: true,
    },
    'Rocket Launcher': {
      aliases: [],
      inSprites: true,
    },
    'Rifle': {
      aliases: [],
      inSprites: true,
    },
    'Machine Gun':{
      aliases: [],
      inSprites: true,
    },
    Sword: {
      aliases: [],
      inSprites: true,
    },
    Bow: {
      aliases: [],
      inSprites: true,
    },
    Laser: {
      aliases: [],
      inSprites: true,
    },
    Spear: {
      aliases: [],
      inSprites: true,
    },
    Bomb: {
      aliases: ['Dynamite'],
      inSprites: true,
    },
    'Dynamite': {
      aliases: [],
      inSprites: true,
    },
    Projectile: {
      dontShowAdminsInSpriteSheetEditor: true,
      aliases: ['Magic', 'Bullet', 'Arrow', 'Spear', 'Cannonball'],
      inSprites: true,
    },
    Magic: {
      aliases: [],
      inSprites: true,
    },
    Bullet: {
      aliases: [],
      inSprites: true,
    },
    Cannonball: {
      aliases: [],
      inSprites: true,
    },
    Arrow: {
      aliases: [],
      inSprites: true,
    },
    Wearable: {
      dontShowAdminsInSpriteSheetEditor: true,
      aliases: ['Armor', 'Clothes', 'Robes', 'Hat'],
      inSprites: true,
    },
    Armor: {
      aliases: [],
      inSprites: true,
    },
    Clothes: {
      aliases: [],
      inSprites: true,
    },
    Robes: {
      aliases: [],
      inSprites: true,
    },
    Hat: {
      aliases: [],
      inSprites: true,
    },
  }

  window.itemDescriptors = {
    Key: {
      aliases: window.insideBuildingDescriptors.Key,
      inSprites: true,
    },
    Bottle: {
      aliases: [],
      inSprites: true,
    },
    Heart: {
      aliases: [],
      inSprites: true,
    },
    Food: window.insideBuildingDescriptors.Food,
    Bullet: window.toolDescriptors.Bullet,
    'Expensive Item': {
      dontShowAdminsInSpriteSheetEditor: true,
      aliases: ['Gold', 'Jewelry', 'Coin'],
      inSprites: true,
    },
    Gold: {
      aliases: [],
      inSprites: true,
    },
    Coin: {
      aliases: [],
      inSprites: true,
    },
    Literature: {
      dontShowAdminsInSpriteSheetEditor: true,
      aliases: ['Book', 'Page', 'Scroll', 'Disk'],
      inSprites: true,
    },
    Book: {
      aliases: [],
      inSprites: true,
    },
    Page: {
      aliases: [],
      inSprites: true,
    },
    Scroll: {
      aliases: [],
      inSprites: true,
    },
    Disk: {
      aliases: []
    }
  }

  // window.dungeonItemDescriptors = {
  //   Door: window.insideBuildingDescriptors.Door,
  //   Ladder: window.insideBuildingDescriptors.Ladder,
  //   Stairs: window.insideBuildingDescriptors.Stairs,
  //   Key: window.insideBuildingDescriptors.Stairs
  //   Keyhole: {
  //     aliases: []
  //   },
  //   Chest: {
  //     aliases: []
  //   },
  //   Block: {
  //     aliases: []
  //   },
  //   'Magic Floor Tile': window.insideBuildingDescriptors['Magic Floor Tile']
  // }

  window.transportDescriptors = {
    Vehicle: {
      dontShowAdminsInSpriteSheetEditor: true,
      aliases: ['Car', 'Boat', 'Spaceship', 'Rail Car'],
      inSprites: true,
    },
    Boat: {
      aliases: [],
      inSprites: true,
    },
    Car: {
      aliases: [],
      inSprites: true,
    },
    // Tank: {
    //   aliases: []
    // },
    Spaceship: {
      aliases: [],
      inSprites: true,
    },
    // Plane: {
    //   aliases: []
    // },
    Rail: {
      aliases: [],
      inSprites: true,
    },
    'Rail Car': {
      aliases: [],
      inSprites: true,
    },
    Street: {
      aliases: [],
      inSprites: true,
    },
    'Traffic Item': {
      aliases: [],
      inSprites: true,
    },
    'Spaceship Wall': {
      aliases: [],
      inSprites: true,
    },
  }

  window.humanDescriptors = {
    Human: {
      dontShowAdminsInSpriteSheetEditor: true,
      aliases: ['Spaceman', 'Wizard', 'King', 'Archer', 'Thief', 'Athlete', 'Priest', 'Cop'],
      inSprites: true,
    },
    Spaceman: {
      aliases: [],
      inSprites: true,
    },
    Wizard: {
      aliases: [],
      inSprites: true,
    },
    King: {
      aliases: [],
      inSprites: true,
    },
    Archer: {
      aliases: [],
      inSprites: true,
    },
    Warrior: {
      aliases: [],
      inSprites: true,
    },
    Thief: {
      aliases: [],
      inSprites: true,
    },
    Athlete: {
      aliases: [],
      inSprites: true,
    },
    Priest: {
      aliases: [],
      inSprites: true,
    },
    Cop: {
      aliases: [],
      inSprites: true,
    },
  }

  window.animalDescriptors = {
    Animal: {
      dontShowAdminsInSpriteSheetEditor: true,
      aliases: ['Cat', 'Bird', 'Dog', 'Mouse', 'Chicken', 'Bug', 'Fish', 'Reptile', 'Bat', 'Deer', 'Bear'],
      inSprites: true,
    },
    /// sound oriented
    Cat: {
      aliases: [],
      inSprites: true,
    },
    Bird: {
      aliases: [],
      inSprites: true,
    },
    Dog: {
      aliases: [],
      inSprites: true,
    },
    Horse: {
      aliases: [],
      inSprites: true,
    },
    Lion: {
      aliases: [],
      inSprites: true,
    },
    Wolf: {
      aliases: [],
      inSprites: true,
    },
    Sheep: {
      aliases: [],
      inSprites: true,
    },
    Mouse: {
      aliases: ['Rat'],
      inSprites: true,
    },
    Chicken: {
      aliases: [],
      inSprites: true,
    },
    /// non sound oriented
    Bug: {
      aliases: [],
      inSprites: true,
    },
    Fish: {
      aliases: [],
      inSprites: true,
    },
    Reptile: {
      aliases: [],
      inSprites: true,
    },
    Bat: {
      aliases: [],
      inSprites: true,
    },
    Deer: {
      aliases: [],
      inSprites: true,
    },
    Bear: {
      aliases: [],
      inSprites: true,
    },
    'Mythical Beast': {
      aliases: [],
      inSprites: true,
    },
  }

  window.monsterDescriptors = {
    Monster: {
      dontShowAdminsInSpriteSheetEditor: true,
      aliases: ['Bug', 'Ghost', 'Goblin', 'Undead', 'Zombie', 'Alien', 'Mythical', 'Machine'],
      inSprites: true,
    },
    Bug: window.animalDescriptors.Bug,
    Ghost: {
      aliases: [],
      inSprites: true,
    },
    Goblin: {
      aliases: [],
      inSprites: true,
    },
    Undead: {
      aliases: [],
      inSprites: true,
    },
    Zombie: {
      aliases: [],
      inSprites: true,
    },
    Alien: {
      aliases: [],
      inSprites: true,
    },
    Robot: {
      aliases: [],
      inSprites: true,
    },
    'Mythical Beast': window.animalDescriptors['Mythical Beast']
  }

  window.modifierDescriptors = {
    'Broken': {
      aliases: [],
      inSprites: true,
    },
    Small: {
      audioOnly: true,
      aliases: [],
    },
    Large: {
      audioOnly: true,
      aliases: [],
    },
    Cute: {
      audioOnly: true,
      aliases: [],
    },
    Mean: {
      audioOnly: true,
      aliases: [],
    },
    Evil: {
      audioOnly: true,
      aliases: [],
    },
    Mad: {
      audioOnly: true,
      aliases: [],
    },
    Happy: {
      audioOnly: true,
      aliases: [],
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
    ...window.modifierDescriptors,
  }

}

export default {
  setDefault
}
