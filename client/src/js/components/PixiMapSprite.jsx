import React from 'react'
export default class PixiMapSprite extends React.Component {
  render() {
    const texture = PIXIMAP.textures[this.props.textureId]

    const desiredWidth = this.props.width || GAME.grid.nodeSize
    const desiredHeight = this.props.height || GAME.grid.nodeSize

    if(!texture) {
      return <div style={{width: desiredWidth, height: desiredHeight}}></div>
    }
    const backgroundImage = "url('"+texture.baseTexture.textureCacheIds[0]+"')"
    const backgroundPositionX = -texture.orig.x
    const backgroundPositionY = -texture.orig.y
    const width = texture.orig.width
    const height = texture.orig.height

    const scale = desiredWidth/width
    const translate = (desiredWidth - width)/2 + 'px'

    const transform = `scale(${scale})`;

    const transformContainer = `translateX(${translate}) translateY(${translate})`
    return <div data-textureid={this.props.textureId} className={'PixiMapSpriteContainer ' + this.props.className} onClick={this.props.onClick} style={{transform: transformContainer, width: desiredWidth, height: desiredHeight, ...this.props.style}}>
      <div data-textureid={this.props.textureId} className="Sprite" style = {{
          backgroundImage,
          backgroundPositionY,
          backgroundPositionX,
          width,
          height,
          transform,
        }}>
      </div>
    </div>
  }
}
