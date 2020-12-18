import React from 'react'
import classnames from 'classnames'
import modals from '../../sequenceeditor/modals.js'
export default class Metadata extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      author: global.user.username,
      ...GAME.metadata,
    }
  }

  _openEditTextModal(prop) {
    modals.openEditTextModal('edit ' + prop, this.state[prop], (result) => {
      if(result && result.value) {
        this.setState({[prop] : result.value })
      }
    })
  }

  _selectImageModal = () => {
    modals.openImageSelectModal((image) => {
      if(image) {
        this.setState({featuredImage : image })
      }
    })
  }

  save = () => {
    global.socket.emit('editMetadata', this.state)
  }

  render() {
    const { featuredImage, description, name, author, inMarketingArcade } = this.state

    return <div className="GameManager__Metadata">
      <div className="ManagerMenu__right">
        <div className="Manager__button" onClick={this.save}>Save</div>
      </div>
      <h4>{'Game id: ' + GAME.id}</h4>
      Name:
      <i className="fa fas fa-edit Manager__button" onClick={() => {
        this._openEditTextModal('name')
      }}/>
      <div className="SequenceItem__summary SequenceItem__summary--json">{name}</div>
      Author:
      <i className="fa fas fa-edit Manager__button" onClick={() => {
        this._openEditTextModal('author')
      }}/>
      <div className="SequenceItem__summary SequenceItem__summary--json">{author}</div>
      Description:
      <i className="fa fas fa-edit Manager__button" onClick={() => {
        this._openEditTextModal('description')
      }}/>
      <div className="SequenceItem__summary SequenceItem__summary--json">{description}</div>
      Featured Image:
      <i className="fa fas fa-edit Manager__button" onClick={() => this._selectImageModal()}/>
      {featuredImage && <div className="SequenceItem__summary SequenceItem__summary--json">{featuredImage.name}</div>}
      <div className="SequenceItem__effect-input"><input onChange={() => {
        this.setState({
          inMarketingArcade: !this.state.inMarketingArcade
        })
      }} checked={inMarketingArcade} type="checkbox"></input>In Marketing Arcade</div>

      <button onClick={() => {
        PAGE.publishGame({name, description, imageUrl: featuredImage.url})
      }}>Publish Game</button>
    </div>
  }
}
