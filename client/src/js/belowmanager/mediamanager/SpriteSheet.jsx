import React from 'react'
import classnames from 'classnames'
import PixiMapSprite from '../../components/PixiMapSprite.jsx'
import modals from '../../mapeditor/modals.js'

global.getModifierDescriptors = function(descriptors) {
  return Object.keys(descriptors).reduce((prev, descriptor) => {
    if(descriptors[descriptor] && global.descriptionModifiers[descriptor]) {
      prev.push(descriptor)
    }
    return prev
  }, [])
}

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
    this._removeListener1 = global.local.on('onClearTextureIdsSelection', () => {
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
        const { textureIdsSelected } = this.state
        const useTextures = Object.keys(textureIdsSelected).length
        console.log(textureIdsSelected, useTextures)
        modals.openEditDescriptorsModal({}, ({value}) => {
          if(value) {
            global.local.emit('onEditSpriteData', useTextures ? textureIdsSelected : {[JSON.parse(item.dataset.spritejson).textureId]: true}, { descriptors: value })
          }
        }, useTextures ? textureIdsSelected : {[JSON.parse(item.dataset.spritejson).textureId]: true})
      };
    }
  }

  _renderSprite(sprite, index) {
    const { selectMultiple, hideDescribed } = this.props
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
        <PixiMapSprite width="40" height="40" textureId={textureId} textureIdsSelected={this.state.textureIdsSelected} spriteData={sprite}/>
    </div>
  }

  render() {
    const { spriteSheet, selectMultiple, hideUncategorized, dontSepereteModified } = this.props;

    let ss
    // if(showDescribedOnly) {
      const categories = spriteSheet.sprites.reduce((prev, sprite) => {
        const descriptorList = Object.keys(sprite.descriptors || {}).filter((d) => sprite.descriptors[d])
        if(descriptorList.length) {
          const modifiers = global.getModifierDescriptors(sprite.descriptors)
          if(modifiers.length  && !dontSepereteModified) {
            const categoryName = descriptorList.join('-')
            if(!prev[categoryName]) prev[categoryName] = []
            prev[categoryName].push(sprite)
          } else {
            descriptorList.forEach((item, i) => {
              if(!prev[item]) prev[item] = []
              prev[item].push(sprite)
            });
          }
        } else if(!hideUncategorized){
          if(!prev.uncategorized) prev.uncategorized = []
          prev.uncategorized.push(sprite)
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
    // }

   //  else {
   //   ss =  spriteSheet.sprites.map((sprite, index) => {
   //           return this._renderSprite(sprite, index)
   //         })
   // }

    // {selectMultiple && <div className="SpriteSheet__edit-selected fa fa-edit" data-textureids={JSON.stringify(this.state.textureIdsSelected)}>Click to edit selected</div>}

    return <div className="SpriteSheet">
      {selectMultiple && <div className="SpriteSheet__edit-selected fa fa-edit" onClick={() => {
        const textureIdsSelected = spriteSheet.sprites.reduce((prev, next) => {
          prev[next.textureId] = true
          return prev
        }, {})
        this.setState({
          textureIdsSelected
        })
      }}>Select All</div>}
      {ss}
    </div>
  }
}
