import React from 'react'
import classnames from 'classnames'
import {
  SpriteSheetTagsSelect,
  SpriteSheetAuthorSelect
} from '../../components/SelectComponents.jsx'
import modals from '../../sequenceeditor/modals.js'
import SpriteSheet from './SpriteSheet.jsx'

export default class SpriteSheetEditor extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      spriteSheet: {
        sprites: []
      },
      hideUncategorized: false,
      hideDescribed: false,
      dontSepereteModified: false,

    }
  }

  componentWillUnmount() {
    this._removeListener1()
  }

  componentDidMount() {
    this._removeListener1 = global.local.on('onEditSpriteData', (names, update) => {
      const ss = this.state.spriteSheet

      this.setState({
        spriteSheet: {
          ...this.state.spriteSheet,
          sprites: ss.sprites.map((s) => {
            if(names[s.textureId]) {
              if(update.descriptors) {
                if(!s.descriptors) s.descriptors = {}
                Object.assign(s.descriptors, update.descriptors)
              }
            }
            return s
          })
        }
      })
      global.local.emit('onClearTextureIdsSelection')
      this.forceUpdate()
    })

    const ss = global.spriteSheets.find(({id}) => id == this.props.id)
    if(!ss.tags) ss.tags= []
    this.setState({
      spriteSheet: ss
    })
  }

  getJSON = () => {
    return this.state.spriteSheet
  }

  _openEditTextModal = (title, value) => {
    const { spriteSheet } = this.state
    modals.openEditTextModal(title, spriteSheet[value], (result) => {
      if(result && result.value) {
        spriteSheet[value] = result.value
        this.setState({spriteSheet})
      }
    })
  }

  render() {
    const { spriteSheet, dontSepereteModified } = this.state;

    return <div className="SpriteSheetEditor">
      <div className="ManagerForm">
        <div className="ManagerInput__text"><i className="fa fas fa-edit Manager__button" onClick={() => this._openEditTextModal('Edit Name', 'name')}/>
          Name: <div className="ManagerInput__value">{spriteSheet.name}</div>
        </div>
        <SpriteSheetAuthorSelect currentValue={spriteSheet.author} onChange={(event) => {
          const { spriteSheet } = this.state;
          spriteSheet.author = event.value
          this.setState({spriteSheet})
        }}/>
        <div className="ManagerInput__text"><i className="fa fas fa-edit Manager__button" onClick={() => this._openEditTextModal('Edit image url', 'imageUrl')}/>
          Image url: <div className="ManagerInput__value">{spriteSheet.imageUrl}</div>
        </div>
        <SpriteSheetTagsSelect currentValue={spriteSheet.tags} onChange={(event) => {
          const { spriteSheet } = this.state;
          if(!event) spriteSheet.tags = []
          else spriteSheet.tags = event.map(({value}) => value)
          this.setState({spriteSheet})
        }}/>
        <div className="ManagerInput__text">
          Dont Seperate Modified
          <input type="checkbox"
            onClick={() => {
              const state = this.state
              state.dontSepereteModified = !state.dontSepereteModified
              this.setState(state)
              global.local.emit('onClearTextureIdsSelection')
            }}
            checked={this.state.dontSepereteModified}
          />
        </div>
        <div className="ManagerInput__text">
          Hide Uncategorized
          <input type="checkbox"
            onClick={() => {
              const state = this.state
              state.hideUncategorized = !state.hideUncategorized
              this.setState(state)
              global.local.emit('onClearTextureIdsSelection')
            }}
            checked={this.state.hideUncategorized}
          />
        </div>
        <div className="ManagerInput__text">
          Hide Described Sprites
          <input type="checkbox"
            onClick={() => {
              const state = this.state
              state.hideDescribed = !state.hideDescribed
              this.setState(state)
              global.local.emit('onClearTextureIdsSelection')
            }}
            checked={this.state.hideDescribed}
          />
        </div>
      </div>
      <SpriteSheet selectMultiple dontSepereteModified={dontSepereteModified} hideDescribed={this.state.hideDescribed} hideUncategorized={this.state.hideUncategorized} spriteSheet={spriteSheet}
        onClick={(sprite) => {

        }}/>
    </div>
  }
}
