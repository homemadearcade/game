import React from 'react'
import modals from '../../mapeditor/modals'
import Collapsible from 'react-collapsible';
import classnames from 'classnames';

export default class Library extends React.Component {
  constructor(props) {
    super(props)
  }


  _renderLibrary(libraryName, data) {
    const libraryItems = Object.keys(data)

    return libraryItems.map((libraryId) => {
      return <div data-libraryname={libraryName} data-libraryid={libraryId} onClick={() => {
        modals.openEditCodeModal(libraryId, data[libraryId], () => {})
      }}
       className={classnames("Manager__list-item", {})}>
        {libraryId}
      </div>
    })
  }

  render() {
    const { selectedMenu } = this.props

    return <div className="Manager__list">
        <Collapsible trigger={'Objects (Core)'}>
          {this._renderLibrary('objectLibrary', window.objectLibrary)}
        </Collapsible>
        <Collapsible trigger={'Sub Objects (Core)'}>
          {this._renderLibrary('subObjectLibrary', window.subObjectLibrary)}
        </Collapsible>
        {GAME.library.object && <Collapsible trigger={'Objects (Game)'}>
          {this._renderLibrary('objectLibrary', GAME.library.object)}
        </Collapsible>}
        {GAME.library.subObject && <Collapsible trigger={'Sub Objects (Game)'}>
          {this._renderLibrary('subObjectLibrary', GAME.library.subObject)}
        </Collapsible>}
      </div>
  }
}
