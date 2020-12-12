import React from 'react'
import SequenceEditor from '../../sequenceeditor/SequenceEditor.jsx'
import Metadata from './Metadata.jsx'
import Library from './Library.jsx'

export default class GameManager extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { selectedMenu } = this.props

    if(selectedMenu === 'sequence') {
      return <div className="GameManager Manager">
          <SequenceEditor/>
      </div>
    }
    if(selectedMenu === 'metadata') {
      return <div className="GameManager Manager">
          <Metadata/>
      </div>
    }
    if(selectedMenu === 'library') {
      return <div className="GameManager Manager">
          <Library/>
      </div>
    }
  }
}
