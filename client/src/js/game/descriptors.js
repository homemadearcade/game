function setDefault() {

  window.generalDescriptors = {
    Scifi: {
      aliases: []
    },
    Fantasy: {
      aliases: []
    },
    Platformer: {
      aliases: []
    },
  }

  window.elementDescriptors = {
    Grass: {
      aliases: []
    },
    Dirt: {
      aliases: []
    },
    Snow: {
      aliases: []
    },
    Ice: {
      aliases: []
    },
    Sand: {
      aliases: []
    },
    Water: {
      aliases: []
    },
    Stone: {
      aliases: []
    },
    Metal: {
      aliases: []
    },
    Wood: {
      aliases: []
    },
    Glass: {
      aliases: []
    },
    Gravel: {
      aliases: []
    },
    Concrete: {
      aliases: []
    },
    Mud: {
      aliases: []
    },
    Gem: {
      aliases: []
    },
    Ore: {
      aliases: []
    },
    Fire: {
      aliases: []
    },
    Electricity: {
      aliases: []
    },
  }

  window.overworldMapDescriptors = {
    Mountain : {
      aliases: []
    },
    Tree : {
      aliases: []
    },
    Planet : {
      aliases: []
    },
    House : {
      aliases: []
    },
    Castle : {
      aliases: []
    },
    Cave : {
      aliases: []
    },
    Building : {
      aliases: []
    },
    'Fortified Wall' : {
      aliases: []
    },
  }

  window.buildingPartDescriptors = {
    'Building Wall': {
      aliases: []
    },
    'Building Floor Tile': {
      aliases: []
    },
    // 'Special Floor Tile': {
    //   aliases: []
    // },
    'Magic Floor Tile': {
      aliases: []//'Special Floor Tile'
    },
    'Spaceship Wall': {
      aliases: []
    },
    Block: {
      aliases: []
    },
    Door: {
      aliases: []
    },
    Ladder: {
      aliases: []
    },
    Stairs: {
      aliases: []
    },
    Window: {
      aliases: []
    },
    Pipe: {
      aliases: []
    },
    Chimney: {
      aliases: []
    },
  }

  window.outsideBuildingDescriptors = {
    Fence: {
      aliases: []
    },
    Plant: {
      playerFacing: true,
      aliases: ['Crop', 'Bush', 'Flower']
    },
    Bush: {
      aliases: []
    },
    Flower: {
      aliases: []
    },
    Crop: {
      aliases: []
    },
    Sign: {
      aliases: []
    },
    Grave: {
      aliases: []
    },
    Flag: {
      aliases: []
    },
    Barrel: {
      aliases: []
    },
    Crate: {
      aliases: []
    },
    Pot: {
      aliases: []
    },
    Box: {
      aliases: ['Pot', 'Barrel', 'Crate']
    },
  }



  window.insideBuildingDescriptors = {
    'Musical Instrument': {
      aliases: []
    },
    Candle: {
      aliases: ['Torch']
    },
    Chest: {
      aliases: []
    },
    Appliance: {
      aliases: []
    },
    Machine: {
      aliases: ['Computer']
    },
    Computer: {
      aliases: []
    },
    Furniture: {
      aliases: ['Chair', 'Table', 'Fireplace', 'Couch']
    },
    Couch: {
      aliases: []
    },
    Chair: {
      aliases: []
    },
    Table: {
      aliases: []
    },
    Jewelry: {
      aliases: []
    },
    'Kitchen Utensil': {
      aliases: []
    },
    Food: {
      aliases: []
    },
    Device: {
      aliases: ['Clock', 'Computer']
    },
    Clock: {
      aliases: []
    },
    Key: {
      aliases: []
    },
    Keyhole: {
      aliases: []
    },
    Fireplace: {
      aliases: []
    },
    Bed: {
      aliases: []
    },
  }

  window.otherDescriptors = {
    Stalagmite: {
      aliases: []
    },
    'Lily Pad': {
      aliases: []
    },
    'Spider Web': {
      aliases: []
    },
    Candy: {
      aliases: []
    },
    'Sports Equipment': {
      aliases: []
    },
    'Christmas Item': {
      aliases: []
    },
    Manican: {
      aliases: []
    },
    Mirror: {
      aliases: []
    },
    'Bathroom Item': {
      aliases: ['Toilet', 'Sink']
    },
    Toilet: {
      aliases: []
    },
    Sink: {
      aliases: []
    },
    Statue: {
      aliases: []
    },
    'Church Item': {
      aliases: ['Candle']
    },
    'Public Item': {
      aliases: ['Trash', 'Mailbox', 'Fire Hydrant']
    },
    Trash: {
      aliases: []
    },
    Mailbox: {
      aliases: []
    },
    'Fire Hydrant': {
      aliases: []
    },
    'User Interface': {
      aliases: ['Heart']
    },
    'Undescribed': {
      aliases: ['Heart']
    },
  }


  window.toolDescriptors = {
    Weapon: {
      playerFacing: true,
      aliases: ['Axe', 'Staff', 'Mace', 'Gun', 'Sword','Bow', 'Laser', 'Spear', 'Bomb']
    },
    'Melee Weapon': {
      playerFacing: true,
      aliases: ['Axe', 'Staff', 'Mace', 'Sword','Spear']
    },
    'Projectile Weapon': {
      playerFacing: true,
      aliases: ['Gun','Bow', 'Laser']
    },
    Axe: {
      aliases: []
    },
    Pickaxe: {
      aliases: []
    },
    Staff: {
      aliases: []
    },
    Mace: {
      aliases: []
    },
    Gun: {
      aliases: []
    },
    Sword: {
      aliases: []
    },
    Device: window.insideBuildingDescriptors.Device,
    Bow: {
      aliases: []
    },
    Laser: {
      aliases: []
    },
    Spear: {
      aliases: []
    },
    Bomb: {
      aliases: []
    },
    Projectile: {
      playerFacing: true,
      aliases: ['Magic', 'Bullet', 'Arrow', 'Spear']
    },
    Magic: {
      aliases: []
    },
    Bullet: {
      aliases: []
    },
    Arrow: {
      aliases: []
    },
    Wearable: {
      playerFacing: true,
      aliases: ['Armor', 'Clothes', 'Robes', 'Hat']
    },
    Armor: {
      aliases: []
    },
    Clothes: {
      aliases: []
    },
    Robes: {
      aliases: []
    },
    Hat: {
      aliases: []
    },
  }


  window.itemDescriptors = {
    Key: {
      aliases: window.insideBuildingDescriptors.Key
    },
    Bottle: {
      aliases: []
    },
    Heart: {
      aliases: []
    },
    Food: window.insideBuildingDescriptors.Food,
    Bullet: window.toolDescriptors.Bullet,
    'Expensive Item': {
      playerFacing: true,
      aliases: ['Gold', 'Jewelry', 'Coin']
    },
    Gold: {
      aliases: []
    },
    Coin: {
      aliases: []
    },
    Literature: {
      playerFacing: true,
      aliases: ['Book', 'Page', 'Scroll', 'Disk']
    },
    Book: {
      aliases: []
    },
    Page: {
      aliases: []
    },
    Scroll: {
      aliases: []
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
      playerFacing: true,
      aliases: ['Car', 'Boat', 'Spaceship', 'Rail Car']
    },
    Boat: {
      aliases: []
    },
    Car: {
      aliases: []
    },
    // Tank: {
    //   aliases: []
    // },
    Spaceship: {
      aliases: []
    },
    // Plane: {
    //   aliases: []
    // },
    Rail: {
      aliases: []
    },
    'Rail Car': {
      aliases: []
    },
    Street: {
      aliases: []
    },
    'Traffic Item': {
      aliases: []
    },
    'Spaceship Wall': {
      aliases: []
    },
  }

  window.humanDescriptors = {
    Spaceman: {
      aliases: []
    },
    Wizard: {
      aliases: []
    },
    King: {
      aliases: []
    },
    Archer: {
      aliases: []
    },
    Warrior: {
      aliases: []
    },
    Thief: {
      aliases: []
    },
    Athlete: {
      aliases: []
    },
    Priest: {
      aliases: []
    },
    Cop: {
      aliases: []
    },
  }

  window.animalDescriptors = {
    /// sound oriented
    Cat: {
      aliases: []
    },
    Bird: {
      aliases: []
    },
    Dog: {
      aliases: []
    },
    Horse: {
      aliases: []
    },
    Lion: {
      aliases: []
    },
    Wolf: {
      aliases: []
    },
    Sheep: {
      aliases: []
    },
    Mouse: {
      aliases: ['Rat']
    },
    Chicken: {
      aliases: []
    },
    /// non sound oriented
    Bug: {
      aliases: []
    },
    Fish: {
      aliases: []
    },
    Reptile: {
      aliases: []
    },
    Bat: {
      aliases: []
    },
    Deer: {
      aliases: []
    },
    Bear: {
      aliases: []
    },
  }

  window.monsterDescriptors = {
    Bug: {
      aliases: []
    },
    Ghost: {
      aliases: []
    },
    Goblin: {
      aliases: []
    },
    Undead: {
      aliases: []
    },
    Zombie: {
      aliases: []
    },
    Alien: {
      aliases: []
    },
    Mythical: {
      aliases: []
    },
    Machine: {
      aliases: []
    }
  }

  window.creatureDetailDescriptors = {
    Human: {
      playerFacing: true,
      aliases: ['Spaceman', 'Wizard', 'King', 'Archer', 'Thief', 'Athlete', 'Priest', 'Cop']
    },
    Monster: {
      playerFacing: true,
      aliases: ['Bug', 'Ghost', 'Goblin', 'Undead', 'Zombie', 'Alien', 'Mythical', 'Machine']
    },
    Animal: {
      playerFacing: true,
      aliases: ['Cat', 'Bird', 'Dog', 'Mouse', 'Chicken', 'Bug', 'Fish', 'Reptile', 'Bat', 'Deer', 'Bear']
    },
    Small: {
      audioOnly: true,
      aliases: []
    },
    Large: {
      audioOnly: true,
      aliases: []
    },
    Cute: {
      audioOnly: true,
      aliases: []
    },
    Mean: {
      audioOnly: true,
      aliases: []
    },
    Evil: {
      audioOnly: true,
      aliases: []
    },
    Mad: {
      audioOnly: true,
      aliases: []
    },
    Happy: {
      audioOnly: true,
      aliases: []
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
    ...window.creatureDetailDescriptors,
  }

}

export default {
  setDefault
}
