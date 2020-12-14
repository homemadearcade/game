import React from 'react'
import classnames from 'classnames'
import PixiMapSprite from '../../components/PixiMapSprite.jsx'
import modals from '../../mapeditor/modals.js'

export default class SpriteSheet extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      textureIdSelected:props.selectedTextureId || null,
      textureIndexSelected:null,
      textureIdsSelected: {}
    }
  }

  componentDidMount() {
    this._removeListener1 = window.local.on('onClearTextureIdsSelection', () => {
      this._clearTextureIdsSelection()
    })
  }

  componentWillUnmount() {
    this._removeListener1()
  }

  _clearTextureIdsSelection = () => {
    this.setState({
      textureIdsSelected: {}
    })
  }

  refCallback = (item) => {
    if (item) {
      item.ondblclick = () => {
        modals.viewFullSprite(JSON.parse(item.dataset.spritejson))
      };
    }
  }

  _renderSprite(sprite, index) {
    const { selectMultiple, hideDescribed, showDescribedOnly } = this.props
    const { textureId } = sprite


    // if(showDescribedOnly && (!descriptors || !descriptors.length)) return
    if(hideDescribed) {
      let descriptors = sprite.descriptors
      if(descriptors) descriptors = Object.keys(descriptors).reduce((prev, name) => {
        if(descriptors[name]) prev.push(name)
        return prev
      }, [])
      if(descriptors && descriptors.length) return
    }

    return <div
      className={classnames("SpriteContainer", {"SpriteContainer--selected": this.state.textureIdSelected === textureId || this.state.textureIdsSelected[textureId] })}
      ref={this.refCallback}
      data-spritejson={JSON.stringify(sprite)}
      onClick={() => {
        if(selectMultiple) {
          const newTextureIdsSelected = this.state.textureIdsSelected
          if(this.state.textureIdsSelected[textureId]) delete newTextureIdsSelected[textureId]
          else newTextureIdsSelected[textureId] = true
          this.setState({
            textureIdsSelected: newTextureIdsSelected
          })
        } else {
          this.setState({
            textureIdSelected: textureId,
            textureIndexSelected: index,
            textureIdsSelected: {
              [textureId]: true
            }
          })
        }

        if(this.props.onClick) this.props.onClick(sprite, index)
      }}
      style={{backgroundColor: GAME.world.backgroundColor || 'black'}}>
        <PixiMapSprite width="40" height="40" textureId={textureId} spriteData={sprite}/>
    </div>
  }

  render() {
    const { spriteSheet, selectMultiple, showDescribedOnly } = this.props;

    let ss
    if(showDescribedOnly) {
      const categories = spriteSheet.sprites.reduce((prev, sprite) => {
        if(sprite.descriptors) {
          Object.keys(sprite.descriptors).forEach((item, i) => {
            if(sprite.descriptors[item]) {
              if(!prev[item]) prev[item] = []
              prev[item].push(sprite)
            }
          });
        }
        return prev
      }, {})
      ss = Object.keys(categories).map((name) => {
          return <React.Fragment>
            <br/>
            <h3>{name + `(${categories[name].length}): `}</h3>
            {categories[name].map((sprite, index) => {
              return this._renderSprite(sprite, index)
            })}
          </React.Fragment>
        })
    } else {
      ss =  spriteSheet.sprites.map((sprite, index) => {
              return this._renderSprite(sprite, index)
            })
    }

    return <div className="SpriteSheet">
      {selectMultiple && <div className="SpriteSheet__edit-selected fa fa-edit" data-textureids={JSON.stringify(this.state.textureIdsSelected)}>Click to edit selected</div>}
      {ss}
    </div>
  }
}
