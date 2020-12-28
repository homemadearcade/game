import React from 'react'
import { SketchPicker, SwatchesPicker } from 'react-color';
import classnames from 'classnames'

export default class SpriteEditorTools extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      colorSelected: null,
      toolSelected: 'color',
      brushSize: SPRITEEDITOR.brushSize
    }
  }

  selectColor = (hex) => {
    this.setState({
      colorSelected: hex
    })
    SPRITEEDITOR.colorSelected = hex
  }

  render() {
    const { colorSelected, toolSelected } = this.state
    return <div className="SpriteEditor">
      <div className="SpriteEditorTools">
        <div className={classnames("fa fas fa-palette SpriteEditorTool", {"SpriteEditorTool--selected": toolSelected === 'color'})}
          onClick={() => {
              this.setState({
                toolSelected: 'color'
              })
              SPRITEEDITOR.toolSelected = 'color'
          }}
        ></div>
        <div className={classnames("fa fas fa-eye-dropper SpriteEditorTool", {"SpriteEditorTool--selected": toolSelected === 'select'})}
          onClick={() => {
              this.setState({
                toolSelected: 'select'
              })
              SPRITEEDITOR.toolSelected = 'select'
          }}
        ></div>
        <div className={classnames("fa fas fa-eraser SpriteEditorTool", {"SpriteEditorTool--selected": toolSelected === 'eraser'})} onClick={() => {
            this.setState({
              toolSelected: 'eraser'
            })
            SPRITEEDITOR.toolSelected = 'eraser'
        }}></div>
      <div style={{marginLeft: '30px'}} className={classnames("fa fas fa-plus SpriteEditorTool")} onClick={() => {
            // this.setState({
            //   toolSelected: 'eraser'
            // })
            SPRITEEDITOR.brushSize += 1
            this.setState({
              brushSize: SPRITEEDITOR.brushSize
            })
        }}></div>
      <div className={classnames("SpriteEditorTool")}>{this.state.brushSize + 1}</div>
        <div className={classnames("fa fas fa-minus SpriteEditorTool")} onClick={() => {
              // this.setState({
              //   toolSelected: 'eraser'
              // })
              if(SPRITEEDITOR.brushSize > 0) {
                SPRITEEDITOR.brushSize -= 1
              }
              this.setState({
                brushSize: SPRITEEDITOR.brushSize
              })
          }}></div>
      </div>
      <SketchPicker
          color={colorSelected || GAME.world.defaultObjectColor || global.defaultObjectColor }
          onChange={(color) => {
            this.setState({
              colorSelected: color.hex,
              toolSelected: 'color'
            })
            SPRITEEDITOR.toolSelected = 'color'
            SPRITEEDITOR.colorSelected = color.hex
          }}
          onChangeComplete={ (color) => {
            this.setState({
              colorSelected: color.hex,
              toolSelected: 'color'
            })
            SPRITEEDITOR.toolSelected = 'color'
            SPRITEEDITOR.colorSelected = color.hex
          }}
        />
      <SwatchesPicker
        color={colorSelected || GAME.world.defaultObjectColor || global.defaultObjectColor}
        onChangeComplete={ (color) => {
          this.setState({
            colorSelected: color.hex,
            toolSelected: 'color'
          })
          SPRITEEDITOR.toolSelected = 'color'
          SPRITEEDITOR.colorSelected = color.hex
        }}/>
    </div>
  }
}
