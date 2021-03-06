import n from 'nengi'
let nengi = n
if(nengi.default) nengi = nengi.default

import nengiConfig from '../../../../common/nengiConfig.js'
import Simulator from './Simulator.js'

let previous = performance.now()
let tick = 0

class GameClient {
  // UNCOMMNENT FOR NENGI

    // onFirstPageGameLoaded = () => {
    //   this.client = new nengi.Client(nengiConfig, 100)
    //   this.simulator = new Simulator(this.client)
    //
    //   this.client.onConnect(res => {
    //       console.log('onConnect response:', res)
    //   })
    //
    //   this.client.onClose(() => {
    //       console.log('connection closed')
    //   })
    //
    //   this.client.connect('ws://localhost:8079', { heroId: HERO.id })
    // }

    // UNCOMMNENT FOR NENGI

    // onRender = () => {
      // let now = performance.now()
      // let delta = (now - previous) / 1000
      // previous = now
      // this.update(delta, tick++, now)
    // }

    update(delta, tick, now) {
        const network = this.client.readNetwork()

        network.entities.forEach(snapshot => {
            snapshot.createEntities.forEach(entity => {
                this.simulator.createEntity(entity)
            })

            snapshot.updateEntities.forEach(update => {
                this.simulator.updateEntity(update)
            })

            snapshot.deleteEntities.forEach(id => {
                this.simulator.deleteEntity(id)
            })
        })

        network.predictionErrors.forEach(predictionErrorFrame => {
            this.simulator.processPredictionError(predictionErrorFrame)
        })

        network.messages.forEach(message => {
            this.simulator.processMessage(message)
        })

        network.localMessages.forEach(localMessage => {
            this.simulator.processLocalMessage(localMessage)
        })

        this.simulator.update(delta)
        this.client.update()
    }
}

export default GameClient
