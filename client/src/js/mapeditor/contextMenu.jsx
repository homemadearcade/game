import React from 'react'
import ReactDOM from 'react-dom'
import Menu, { SubMenu, MenuItem } from 'rc-menu';
import modals from './modals.js'

class contextMenuEl extends React.Component{
  constructor(props) {
    super(props)

    window.document.getElementById('game-canvas').addEventListener("contextmenu", e => {
      e.preventDefault();
      const origin = {
        left: e.pageX,
        top: e.pageY
      };
      this.setContextMenuPosition(origin);
      return false;
    });

    window.addEventListener("click", e => {
      this._toggleContextMenu("hide");
    });

    this.state = {
      hide: true
    }

    this._handleClick = ({ key }) => {
      const { editor } = this.props;

      if(key === 'add-object') {
        window.addObjects(editor.objectHighlighted)
      }

      if(key === "name-object") {
        modals.nameObject(editor.objectHighlighted)
      }

      if(key === "write-dialogue") {
        modals.writeDialogue(editor.objectHighlighted)
      }
    }
  }

  _toggleContextMenu(command) {
    if(command === "show") {
      this.setState({ hide: false })
    } else {
      this.setState({ hide: true })
    }
  };

  setContextMenuPosition({ top, left }) {
    const { editor } = this.props;
    editor.contextMenu.style.left = `${left}px`;
    editor.contextMenu.style.top = `${top}px`;
    this._toggleContextMenu('show');
  };

  render() {
    const { editor } = this.props;

    if(this.state.hide) {
      editor.contextMenuVisible = false
      return null
    }

    editor.contextMenuVisible = true
    if(!editor.objectHighlighted.id) {
      return <Menu onClick={this._handleClick}>
        <MenuItem key='add-object'>Add</MenuItem>
      </Menu>
    }

    return <Menu onClick={this._handleClick}>
      <MenuItem>Drag</MenuItem>
      <MenuItem>Resize</MenuItem>
      <MenuItem>Delete</MenuItem>
      <MenuItem>Copy</MenuItem>
      <MenuItem key="write-dialogue">Dialogue</MenuItem>
      <SubMenu title="Name">
        <MenuItem key="name-object">Give Name</MenuItem>
        <MenuItem>Position Name in Center</MenuItem>
        <MenuItem>Position Name above</MenuItem>
      </SubMenu>
    </Menu>
  }
}

function init(editor, options) {
  editor.contextMenu = document.getElementById('context-menu')

  // Mount React App
  ReactDOM.render(
    React.createElement(contextMenuEl, { editor, ref: ref => editor.contextMenuRef = ref }),
    editor.contextMenu
  )
}


export default {
  init
}