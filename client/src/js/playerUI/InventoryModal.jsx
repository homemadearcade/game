import React from 'react'
import PixiMapSprite from '../components/PixiMapSprite.jsx'
import Modal from '../components/Modal.jsx'
import classnames from 'classnames';

export default class InventoryModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      inventoryDisplay: []
    }
    this.getItemName = this.getItemName.bind(this)
  }

  componentDidMount() {
    const { inventoryItems } = this.props;
    let inventory = [];
    for (let prop in inventoryItems) {
      let item = inventoryItems[prop];
      if (item.inInventory === true) {
        //normalize the item's name
        item.name = this.getItemName(item, prop)
        inventory.push(item)
      }
    }
    this.setState({ inventoryDisplay: inventory })
  }

  getItemName(item, key) {
    if (item.name) {
        return item.name;
    } else if (item.subObjectName) {
        return item.subObjectName;
    }
    else return key;
  }

  _getItemCount(item) {
    let count = item.count + 'x'
    return <div className="Inventory__item-count" data-inventoryMenuId={item.id}>{count}</div>
  }

  _renderSprite(item) {
    if(item.defaultSprite && item.defaultSprite !== 'solidcolorsprite' && (!item.tags.invisible || item.tags.emitter || item.tags.outline)) {
      return <div className="Inventory__sprite" data-inventoryMenuId={item.id}><PixiMapSprite width="32" height="32" textureId={item.defaultSprite}/></div>
    } else {
      return <div className="Inventory__sprite Inventory__sprite--box" data-inventoryMenuId={item.id}/>
    }
  }

  _renderItem = (item) => {
    return <div key={item.id} data-inventoryMenuId={item.id} className={classnames("Inventory__item", { "Inventory__item--border": item.isEquipped})}>
      {this._renderSprite(item)}
      <div className="Inventory__item-text" data-inventoryMenuId={item.id}>
        {item.name}
      </div>
      {item.tags.stackable && this._getItemCount(item)}
    </div>
  }

  render() {
    const { onClose } = this.props;
    const { inventoryDisplay } = this.state;

    return <Modal className="InventoryModal" size="medium" onClose={onClose} onContainerClick={() => {}}>
      <div className="Modal__header">Inventory</div>
      <div className="Inventory">
        {inventoryDisplay.map((item) => {
          return this._renderItem(item)
        })}
      </div>
    </Modal>
  }
}
