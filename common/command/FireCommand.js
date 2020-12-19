import n from 'nengi'
let nengi = n
if(nengi.default) nengi = nengi.default

class FireCommand {
    constructor(x, y) {
        // x,y or angle are both okay ways to represent firing
        this.x = x
        this.y = y
    }
}

FireCommand.protocol = {
    x: nengi.Int32,
    y: nengi.Int32
}

export default FireCommand
