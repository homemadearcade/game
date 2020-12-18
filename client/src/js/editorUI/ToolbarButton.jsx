import React from 'react'
import classnames from 'classnames'
import { SketchPicker, SwatchesPicker } from 'react-color';

export default class ToolbarButton extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { active, iconName, text, cursorIcon, onClick, onShiftClick, children, backgroundColor } = this.props
    return (
      <i
        className={classnames("Toolbar__tool-selector fa fas ", iconName, { "Toolbar__tool-selector--normal-cursor": !cursorIcon, "Toolbar__tool-selector--text": text, "Toolbar__tool-selector--shift": onShiftClick && EDITOR.shiftPressed, "Toolbar__tool-selector--active": active })}
        onClick={() => {
          if(typeof onShiftClick == 'function' && EDITOR.shiftPressed) {
            onShiftClick()
          } else {
            if(onClick) onClick()
          }
        }}
        style={{backgroundColor}}
        onMouseEnter={() => {
          if(cursorIcon) {
            global.setFontAwesomeCursor(cursorIcon, "#FFF")
          }
        }} onMouseLeave={() => {
          if(cursorIcon) {
            document.body.style.cursor = 'default';
          }
        }}
      >
        {text}
        {children && children}
      </i>
    )
  }
}
