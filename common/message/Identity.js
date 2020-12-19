import n from 'nengi'
let nengi = n
if(nengi.default) nengi = nengi.default

class Identity {
    constructor(rawId, smoothId) {
        this.rawId = rawId
        this.smoothId = smoothId
    }
}

Identity.protocol = {
    rawId: nengi.UInt16,
    smoothId: nengi.UInt16
}

export default Identity
