import React from 'react'
import SpriteSheet from './SpriteSheet.jsx'
import SpriteSheetEditor from './SpriteSheetEditor.jsx'
import SpriteSelector from './SpriteSelector.jsx'
import modals from '../../mapeditor/modals'
import Collapsible from 'react-collapsible';
import classnames from 'classnames';
import PixiMapSprite from '../../components/PixiMapSprite.jsx'

global.spriteSheetTags = {
  scifi: false,
  fantasy: false,
  modern : false,

  city: false,
  village: false,

  topdown: false,
  platformer: false,
  overworld: false,

  characters: false,

  environment: false,

  items: false,

  weapons: false,
  food: false,

  monsters: false,
  animals: false,
  vehicles: false,
  robots: false,
  farm: false,
  pets: false,

  indoors: false,
  outdoors: false,

  sports: false,
  road: false,

  crates: false,
  chests: false,
  dungeon: false,

  oryx: false,
  kenney: false,

  candy: false,
  retro: false,

  icons: false,
  ui: false,

  ['8px']: false,
  ['16px']: false,
  ['32px']: false,
  ['64px']: false,
  ['128px']: false,
}

export default class MediaManager extends React.Component {
  constructor(props) {
    super(props)

    this.selectedRef = React.createRef();
  }

  saveSelected = () => {
    if(this.selectedRef.current) {
      const json = this.selectedRef.current.getJSON()
      if(this.props.selectedMenu === 'SpriteSheetEditor') {
        if(global.location.href.indexOf('localhost') >= 0) {
          global.socket.emit('saveSpriteSheetJSON', json.id, json)
          global.spriteSheets = global.spriteSheets.map((ss) => {
            if(ss.id === json.id) return json
            return ss
          })
        } else {
          global.spriteSheets = global.spriteSheets.map((ss) => {
            if(ss.id === json.id) {
              PAGE.downloadObjectAsJson(json, json.id)
              return json
            }
            return ss
          })
        }

      } else if(this.props.selectedMenu === 'AudioEditor'){
        global.socket.emit('saveAudioDataJSON', json.id, json)
      }
    }

    this.props.returnToList(this.props.index)
  }

  _newSpriteSheet() {
    Swal.fire({
      title: 'Select a spritesheet author',
      showClass: {
        popup: 'animated fadeInDown faster'
      },
      hideClass: {
        popup: 'animated fadeOutUp faster'
      },
      input: 'select',
      inputOptions: Object.keys(global.spriteSheetAuthors),
    }).then((result) => {
      const ssAuthor = Object.keys(global.spriteSheetAuthors)[result.value]

      Swal.fire({
        title: 'Give the sprite sheet an id',
        showClass: {
          popup: 'animated fadeInDown faster'
        },
        hideClass: {
          popup: 'animated fadeOutUp faster'
        },
        input: 'text',
      }).then((result) => {
        const id = result.value

        Swal.fire({
          title: 'What is the image path from /images/',
          showClass: {
            popup: 'animated fadeInDown faster'
          },
          hideClass: {
            popup: 'animated fadeOutUp faster'
          },
          input: 'text',
        }).then((result) => {
          const imageUrl = result.value
          modals.openEditCodeModal('Paste spritesheet JSON code here', [], (result) => {
            if(result && result.value) {
              const sprites = JSON.parse(result.value)
              const json = {
                sprites,
                id,
                imageUrl,
                author: ssAuthor
              }
              global.socket.emit('saveSpriteSheetJSON', id, json)
              global.reload()
            }
          })
        })
      })
    })
  }

  _organizeSpriteSheets() {
    const byTag = {}

    global.spriteSheets.forEach((ss) => {
      if(PAGE.role.isAdmin || (GAME.heros[HERO.id].spriteSheets && GAME.heros[HERO.id].spriteSheets[ss.id])) {
        if(ss.tags) ss.tags.forEach((tag) => {
          if(!byTag[tag]) byTag[tag] = []
          byTag[tag].push(ss)
        })
      }
    })

    return byTag
  }

  _renderSpriteSheets() {
    if(this.props.selectedMenu === 'SpriteSheetEditor') {
      return global.spriteSheets.map((ss) => {
        return <div className="Manager__list-item" onClick={() => this.props.openId(this.props.index, ss.id)}>{ss.name || ss.id}</div>
      })
    }

    const assetsByTag = this._organizeSpriteSheets()
    return Object.keys(assetsByTag).map((tag) => {
      const tagList = assetsByTag[tag]
      return <Collapsible trigger={tag}>{tagList.map((ss) => {
          return <div className="Manager__list-item" onClick={() => this.props.openId(this.props.index, ss.id)}>{ss.name || ss.id}</div>
      })}
      </Collapsible>
    })
  }

  _renderAudioData(dataName) {
    const data = AUDIO.data[dataName]
    const categoryNames = Object.keys(data)

    return categoryNames.map((name) => {
      if(name === 'id' || !data[name].files) return
      return <Collapsible trigger={name}>
        {data[name].files.map((audioFile) => {
          return this._renderAudioFile(dataName, audioFile)
        })}
      </Collapsible>
    })
  }

  _renderAudioFile(dataName, audioFile) {
    const pageHasLoadedAsset = global.audio.sounds[audioFile.id]
    return <div>
      <div data-audioFileId={audioFile.id} className={classnames("Manager__list-item Manager__list-item--audio", {
          'Manager__list-item--border': pageHasLoadedAsset
        })} onClick={(e) => {
          if(pageHasLoadedAsset) {
            AUDIO.play(audioFile.id)
          } else {
            AUDIO.loadAsset(audioFile.assetURL, (ids) => {
              AUDIO.play(audioFile.id)
            })
            this.forceUpdate()
          }

          if(this.props.selectedMenu === 'AudioSelector') {
            if(this.props.objectSelected.id) {
              MAPEDITOR.networkEditObject(this.props.objectSelected, { id: this.props.objectSelected.id, defaultSprite: sprite.textureId })
            }
          }
        }}>{audioFile.name}</div>
    </div>
  }


  _onSelectSprite = (sprite) => {
    if(this.props.objectSelected === 'creator') {
      global.local.emit('onSelectTextureId', sprite.textureId, 'creator')
    } else if(this.props.objectSelected === 'constructEditor') {
      global.local.emit('onSelectTextureId', sprite.textureId, 'constructEditor')
    } else if(this.props.objectSelected.id) {
      if(this.props.spriteValue === 'default') {
        MAPEDITOR.networkEditObject(this.props.objectSelected, { id: this.props.objectSelected.id, defaultSprite: sprite.textureId })
      } else {
        global.local.emit('onSelectTextureId', sprite.textureId, this.props.objectSelected.id, this.props.spriteValue )
      }
    }
  }
  //tagList.map((ss) => {
  //     return <div className="Manager__list-item" onClick={() => this.props.openId(this.props.index, ss.id)}>{ss.name || ss.id}</div>
  // })

  render() {
    const { selectedMenu, selectedId } = this.props

    if(selectedId && selectedMenu === 'SpriteSheetEditor') {
      return <div className="Manager">
        <div className="ManagerMenu">
          <div className="ManagerMenu__right">
            <div className="Manager__button" onClick={() => this.props.returnToList(this.props.index)}>Cancel</div>
            <div className="Manager__button" onClick={this.saveSelected}>Save</div>
          </div>
          <div className="ManagerMenu__id" onClick={this._openEditIdModal}>{selectedId}</div>
        </div>
        <SpriteSheetEditor ref={this.selectedRef} id={selectedId}/>
      </div>
    }

    if(selectedId && selectedMenu === 'SpriteSelector') {
      return <div className="Manager">
        <div className="ManagerMenu">
          <i className="fas fa-arrow-left Manager__button Manager__button--large " onClick={() => this.props.returnToList(this.props.index)}></i>
        </div>
        <SpriteSelector onSelectSprite={this._onSelectSprite} objectSelected={this.props.objectSelected} ref={this.selectedRef} id={selectedId}/>
      </div>
    }

    if(selectedMenu === 'SpriteSheetEditor') {
      return <div className="Manager">
        <div className="Manager__list">
          <div className="ManagerMenu__right">
            <div className="Manager__button" onClick={() => this.props.openMenu(this.props.index, null)}>Return</div>
          </div>
          <div className="Manager__list-item" onClick={this._newSpriteSheet}>New SpriteSheet</div>
          {this._renderSpriteSheets()}
        </div>
      </div>
    }

    if(selectedMenu === 'SpriteSelector') {

      let recommendedTextures
      if(this.props.objectSelected.descriptors) {
        recommendedTextures = global.findTexturesForDescriptors(this.props.objectSelected.descriptors, { alwaysSearchchildren: true })
      }
      return <div className="Manager">
        <div className="Manager__list">
          <div className="Manager__button">Select Default Sprite</div>
          {recommendedTextures && <div className="Manager__recommended">
            Recommended:
            <SpriteSheet onClick={this._onSelectSprite} spriteSheet={{sprites: recommendedTextures}}></SpriteSheet>
          </div>}
          {this._renderSpriteSheets()}
        </div>
      </div>
    }

    if(selectedMenu === 'AudioEditor') {
      return <div className="Manager">
        <div className="ManagerMenu__right">
          <div className="Manager__button" onClick={() => this.props.openMenu(this.props.index, null)}>Return</div>
        </div>
        <div className="Manager__list">
          <Collapsible trigger={'Retro'}>
            {this._renderAudioData('retro')}
          </Collapsible>
          <Collapsible trigger={'UI'}>
            {this._renderAudioData('UI')}
          </Collapsible>
          <Collapsible trigger={'Moving'}>
            {this._renderAudioData('moving')}
          </Collapsible>
        </div>
      </div>
    }

    if(selectedId && selectedMenu === 'AudioSelector') {
      return <div className="Manager">
        <div className="Manager__list">
          <Collapsible trigger={'Retro'}>
            {this._renderAudioData('retro')}
          </Collapsible>
          <Collapsible trigger={'UI'}>
            {this._renderAudioData('UI')}
          </Collapsible>
          <Collapsible trigger={'Moving'}>
            {this._renderAudioData('moving')}
          </Collapsible>
        </div>
      </div>
    }


    return <div className="Manager">
      <div className="Manager__list">
        <div className="Manager__list-item" onClick={() => {
            this.props.openMenu(this.props.index, 'SpriteSheetEditor')
          }}
        >SpriteSheet Editor</div>
        <div className="Manager__list-item"
          onClick={() => {
              this.props.openMenu(this.props.index, 'AudioEditor')
            }}
        >Audio Editor</div>
      </div>
    </div>
  }
}
