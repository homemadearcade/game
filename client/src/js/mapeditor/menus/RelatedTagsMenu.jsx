import React from 'react'
import Menu, { SubMenu, MenuItem } from 'rc-menu';
import modals from '../modals'

export default class RelatedTagsMenu extends React.Component {
    constructor(props) {
        super(props)

        this._handleTagMenuClick = ({ key }) => {
            const { objectSelected } = this.props;
            const { networkEditObject } = MAPEDITOR

            const newValue = !this.state.localTags[key]
            this.setState({
                localTags: {
                    ...this.state.localTags,
                    [key]: newValue
                }
            })

            networkEditObject(objectSelected, { tags: { [key]: newValue } })
        }

        this.state = {
            localTags: this.props.objectSelected.tags
        }
    }

    _renderTagMenuItems(tag) {
        const { objectSelected } = this.props
        const { localTags } = this.state
        if (localTags[tag]) {
            return <MenuItem className='dont-close-menu' key={tag}>{tag}<i style={{ marginLeft: '6px' }} className="fas fa-check"></i></MenuItem>
        } else {
            return <MenuItem className='dont-close-menu' key={tag}>{tag}</MenuItem>
        }
    }

    render() {
        const { objectSelected, subObject } = this.props
        let tagsToRender = Object.keys(objectSelected.tags).reduce((prev, next) => {
          if(global.allTags[next] && global.allTags[next].relatedTags) {
            prev.push(...global.allTags[next].relatedTags)
          }
          return prev
        }, [])

        tagsToRender = Object.keys(objectSelected.descriptors || {}).reduce((prev, next) => {
          if(global.allTags[next] && global.allTags[next].relatedTags) {
            prev.push(...global.allTags[next].relatedTags)
          }
          return prev
        }, tagsToRender)

        if(objectSelected.pathId) {
          tagsToRender.push(
            'pathfindLoop',
            'pathfindPatrol',
            'pathfindDumb',
            'pathfindWait',
            'pathfindAvoidUp',
          )
        }

        if(objectSelected.width > GAME.grid.nodeSize || objectSelected.height > GAME.grid.nodeSize) {
          tagsToRender.push(
            'tilingSprite',
          )
        }

        if(Object.keys(objectSelected.triggers || {}).length) {
          tagsToRender.push(
            'glowing',
            'stopGlowingOnTrigger',
            'shakeOnTrigger',
            'flashOnTrigger',
          )
        }

        tagsToRender = tagsToRender.filter((tag, i) => {
          if(objectSelected.tags[tag] || tagsToRender.indexOf(tag) != i) return false
          else return true
        })

        return <Menu onClick={this._handleTagMenuClick}>
            {tagsToRender.map((tag, index) => {
                return this._renderTagMenuItems(tag)
            })}
        </Menu>
    }
}
