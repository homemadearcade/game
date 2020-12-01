import React from 'react'
import classnames from 'classnames'
import PixiMapSprite from '../../components/PixiMapSprite.jsx'

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

  _renderSprite(sprite, index) {
    const { selectMultiple } = this.props
    const { textureId } = sprite
    return <div
      className={classnames("SpriteContainer", {"SpriteContainer--selected": this.state.textureIdSelected === textureId || this.state.textureIdsSelected[textureId] })}
      onClick={() => {
        if(selectMultiple) {
          const newTextureIdsSelected = this.state.textureIdsSelected
          newTextureIdsSelected[textureId] = !this.state.textureIdsSelected[textureId]
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
    const { spriteSheet, selectMultiple } = this.props;

    return <div className="SpriteSheet">
      {selectMultiple && <div className="SpriteSheet__edit-selected fa fa-edit" data-textureids={JSON.stringify(this.state.textureIdsSelected)}>Right click to edit selected</div>}
      {spriteSheet.sprites.map((sprite, index) => {
        return this._renderSprite(sprite, index)
      })}
    </div>
  }
}
