import n from 'nengi'
let nengi = n
if(nengi.default) nengi = nengi.default
class WeaponFired {
    constructor(sourceId, x, y, tx, ty) {
        this.sourceId = sourceId
        this.x = x
        this.y = y
        this.tx = tx
        this.ty = ty
    }
}

WeaponFired.protocol = {
    sourceId: nengi.UInt16,
    x: nengi.Float32,
    y: nengi.Float32,
    tx: nengi.Float32,
    ty: nengi.Float32
}

export default WeaponFired;
