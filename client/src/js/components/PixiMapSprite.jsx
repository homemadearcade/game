import React from 'react'
export default class PixiMapSprite extends React.Component {
  render() {
    const texture = PIXIMAP.textures[this.props.textureId]

    let desiredWidth = this.props.width
    let desiredHeight = this.props.height

    if(!desiredWidth) {
      if(texture) {
        desiredWidth = (texture.orig.width * 4)
      } else desiredWidth = 40
    }

    if(!desiredHeight) {
      if(texture) {
        desiredHeight = (texture.orig.height * 4)
      } else desiredHeight = 40
    }

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
    const translateY = (desiredHeight - height)/2 + 'px'

    const transform = `scale(${scale})`;

    const transformContainer = `translateX(${translate}) translateY(${translateY})`
    const spriteData = (this.props.spriteData && JSON.stringify(this.props.spriteData))
    return <div data-spritedata={spriteData} data-textureids={this.props.textureIdsSelected && Object.keys(this.props.textureIdsSelected).length ? JSON.stringify(this.props.textureIdsSelected): null} className={'PixiMapSpriteContainer ' + this.props.className} onClick={this.props.onClick} style={{transform: transformContainer, width: desiredWidth, height: desiredHeight, ...this.props.style}}>
      <div data-spritedata={spriteData} data-textureids={this.props.textureIdsSelected && Object.keys(this.props.textureIdsSelected).length ? JSON.stringify(this.props.textureIdsSelected) : null} className="Sprite" style = {{
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
