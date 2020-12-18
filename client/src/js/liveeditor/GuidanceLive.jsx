import React from 'react';
import DatGui, { DatBoolean, DatButton, DatFolder, DatColor, DatNumber, DatString } from 'react-dat-gui';

export default class GuidanceLive extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      objectSelected: this.props.objectSelected,
      animationColor: '#FFF',
    }

    this.handleUpdate = _.debounce(this.handleUpdate.bind(this), 100)
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.objectSelected.id !== prevState.objectSelected.id) {
      return { objectSelected: nextProps.objectSelected };
    }
    else return null;
  }

  // Update current state with changes from controls
  handleUpdate(newData) {
    const id = this.state.objectSelected.id

    this.setState({
      ...newData
    })

    const hero = newData.objectSelected
    const updatedObjectProps = {
      heroMenu: hero.heroMenu,
      worldMenu: hero.worldMenu,
      objectMenu: hero.objectMenu,
      creator: hero.creator,
      spriteSheets: hero.spriteSheets,
      flags: hero.flags
    }

    global.socket.emit('editHero', { id, ...updatedObjectProps })
  }

  _renderLibrary(libraryProp, libraryObjectNames) {
    return Object.keys(libraryObjectNames).map((name) => {
      const path = 'objectSelected.'+libraryProp+'.'+name
      return <DatBoolean path={path} label={name} />
    })
  }

  _renderLibraryArray(libraryProp, libraryArray) {
    return libraryArray.map((name) => {
      const path = 'objectSelected.'+libraryProp+'.'+name
      return <DatBoolean path={path} label={name} />
    })
  }

  render() {
    const { objectSelected } = this.state

    return (
      <div className='GuidanceLive'>
        <DatGui labelWidth="64%" data={this.state} onUpdate={this.handleUpdate}>
          <div className="LiveEditor__title">{'Guidance'}</div>
          <DatFolder title='Creator Library'>
            {this._renderLibrary('creator', global.homemadearcadeBasicLibrary)}
          </DatFolder>
          <DatFolder title='Right Click Menu'>
            <DatFolder title='Hero'>
              {this._renderLibrary('heroMenu', global.heroMenuLibrary)}
            </DatFolder>
            <DatFolder title='Objects'>
              {this._renderLibrary('objectMenu', global.objectMenuLibrary)}
            </DatFolder>
            <DatFolder title='World'>
              {this._renderLibrary('worldMenu', global.worldMenuLibrary)}
            </DatFolder>
          </DatFolder>
          <DatFolder title='Sprite Sheets'>
            <DatFolder title='Kenney'>
              {this._renderLibraryArray('spriteSheets', Object.keys(global.spriteSheetLibrary).filter(name => name.indexOf('kenney') >= 0))}
            </DatFolder>
            <DatFolder title='Oryx'>
              {this._renderLibraryArray('spriteSheets', Object.keys(global.spriteSheetLibrary).filter(name => name.indexOf('oryx') >= 0))}
            </DatFolder>
            <DatFolder title='Other'>
              {this._renderLibraryArray('spriteSheets', Object.keys(global.spriteSheetLibrary).filter(name => {
                return name.indexOf('kenney') == -1 && name.indexOf('oryx') == -1
              }))}
            </DatFolder>
          </DatFolder>
          <DatFolder title='Other'>
            {this._renderLibrary('flags', global.heroFlags)}
          </DatFolder>
          <DatFolder title='Demo'>
            <DatButton label="Send Explode" onClick={() => {
                global.socket.emit('objectAnimation', 'explode', objectSelected.id)
            }}></DatButton>
            <DatButton label="Send Spin Off" onClick={() => {
                global.socket.emit('objectAnimation', 'spinOff', objectSelected.id)
            }}></DatButton>
            <DatButton label="Send Flash" onClick={() => {
                global.socket.emit('objectAnimation', 'flash', objectSelected.id)
            }}></DatButton>
            <DatButton label="Send Quick Trail" onClick={() => {
                global.socket.emit('objectAnimation', 'quickTrail', objectSelected.id)
            }}></DatButton>
            <DatButton label="Send Camera Shake" onClick={() => {
                global.socket.emit('heroCameraEffect', 'cameraShake', objectSelected.id, {})
              }}></DatButton>
            <DatButton label="Send Toast" onClick={() => {
                global.socket.emit('sendNotification', { playerUIHeroId: objectSelected.id, toast: true, text: 'This is a toast' })
              }}></DatButton>
            <DatButton label="Send Chat" onClick={() => {
                global.socket.emit('sendNotification', { chatId: objectSelected.id, chat: true, text: 'This is a chat' })
              }}></DatButton>
            <DatButton label="Send Modal" onClick={() => {
              global.socket.emit('sendNotification', { playerUIHeroId: objectSelected.id, modal: true, text: 'This is the modal text', modalHeader: 'This is the modal header'})
              }}></DatButton>
            <DatButton label="Send Log" onClick={() => {
              global.socket.emit('sendNotification', { logRecipientId: objectSelected.id, logAuthorId: HERO.id, log: true, text: 'This is a log'})
              }}></DatButton>
          </DatFolder>
        </DatGui>
      </div>
    )
  }
}
