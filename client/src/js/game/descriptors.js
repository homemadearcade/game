function setDefault() {

  window.generalDescriptors  = {
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

  window.elementDesciptors = {
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
    Fire: {
      aliases: []
    },
    Gem: {
      aliases: ['ore', 'jewelry']
    },
    Electricity: {
      aliases: []
    },
    Ore: {
      aliases: ['ore']
    },
  }

  window.overworldMapDesciptors = {
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
      // aliases: ['Special Floor Tile']
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

  window.outsideBuildingElementDescriptors = {
    Fence: {
      aliases: []
    },
    Plant: {
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
    Box: {
      aliases: []
    },
    Pot: {
      aliases: []
    },
  }



  window.insideBuildingElementDescriptors = {
    'Musical Instrument': {
      aliases: []
    },
    Candle: {
      aliases: ['Fire', 'Torch']
    },
    Pot: {
      aliases: ['Box']
    },
    Box: {
      aliases: ['Pot']
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
      aliases: ['Machine']
    },
    Furniture: {
      aliases: ['Chair', 'Table']
    },
    Chair: {
      aliases: []
    },
    Table: {
      aliases: []
    },
    'Kitchen Utensil': {
      aliases: []
    },
    Food: {
      aliases: []
    },
    Device: {
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
    Grave: {
      aliases: []
    },
    'Spider Web': {
      aliases: []
    },
    Crop: {
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
    Toilet: {
      aliases: []
    },
    Statue: {
      aliases: []
    },
    'Church Item': {
      aliases: ['Candle']
    },
    'Public Items': {
      aliases: ['Trash', 'Mailbox', 'Fire Hydrant']
    },
    // Trash: {
    //   aliases: []
    // },
    // Mailbox: {
    //   aliases: []
    // },
    // Fire Hydrant: {
    //   aliases: []
    // },
    'User Interface': {
      aliases: []
    },
  }


  window.toolDescriptors = {
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
    Device: {
      aliases: []
    },
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
    Projectiles: {
      aliases: []
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
    Wearables: {
      aliases: []
    },
    Armor: {
      aliases: []
    },
    Clothes: {
      aliases: []
    },
  }


  window.itemDescriptors = {
    Key: {
      aliases: []
    },
    Bottle: {
      aliases: []
    },
    Heart: {
      aliases: []
    },
    Food: {
      aliases: []
    },
    Bullet: {
      aliases: []
    },
    Valuable: {
      aliases: []
    },
    Gold: {
      aliases: []
    },
    Jewelry: {
      aliases: []
    },
    Coin: {
      aliases: []
    },
    Literature: {
      aliases: []
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

  window.gameItemDescriptors = {
    Door: {
      aliases: []
    },
    Ladder: {
      aliases: []
    },
    Stairs: {
      aliases: []
    },
    Key: {
      aliases: []
    },
    Keyhole: {
      aliases: []
    },
    Chest: {
      aliases: []
    },
    Block: {
      aliases: []
    },
    'Magic Floor Tile': window.insideBuildingElementDescriptors['Magic Floor Tile']
  }

  window.transportDescriptors = {
    Boat: {
      aliases: []
    },
    Car: {
      aliases: []
    },
    Tank: {
      aliases: []
    },
    Spaceship: {
      aliases: []
    },
    Plane: {
      aliases: []
    },
    Rail: {
      aliases: []
    },
    Street: {
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
    Sporty: {
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
      aliases: []
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

  window.monsterDescriptors ={
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
    },
    Other: {
      aliases: []
    },
  }

  window.creatureDetailDescriptors = {
    Human: {
      aliases: []
    },
    Animal: {
      aliases: []
    },
    Monster: {
      aliases: []
    },
    Small: {
      aliases: []
    },
    Large: {
      aliases: []
    },
    Cute: {
      aliases: []
    },
    Mean: {
      aliases: []
    },
    Evil: {
      aliases: []
    },
    Mad: {
      aliases: []
    },
    Happy: {
      aliases: []
    },
  }

}
