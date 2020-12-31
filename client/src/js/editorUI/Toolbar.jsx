import React from 'react'
import classnames from 'classnames'
import { SketchPicker, SwatchesPicker } from 'react-color';
import Swal from 'sweetalert2/src/sweetalert2.js';
import modals from '../mapeditor/modals'
import ToolbarRow from './ToolbarRow.jsx'
import ToolbarButton from './ToolbarButton.jsx'

export default class Toolbar extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      open: true,
    }

    this._open = () => {
      this.setState({
        open: true,
      })
    }

    this._close = () => {
      this.setState({
        open: false,
      })
    }
  }

  render() {
    const { open } = this.state

    if(!open || CONSTRUCTEDITOR.open || PATHEDITOR.open) return null

    const COA = GAME.heroList.filter((hero) => {
      return hero.tags.centerOfAttention
    })[0]

    if(COA) HERO.editingId = COA.id

    const hero = GAME.heros[HERO.editingId]

    return (
      <div className="Toolbar">
        {/* Map Actions -> Pull out
        <ToolbarRow open iconName='fa-map'>
          <ToolbarButton iconName="fa-object-group"></i>
        </ToolbarRow>

        Bulldoze -> Map Action
        <i className="Toolbar__tool-selector fa fas fa-snowplow" onMouseEnter={() => {
          global.setFontAwesomeCursor("\uf7d2", "#FFF")
        }} onMouseLeave={() => {
          document.body.style.cursor = 'default';
        }}></i>
        */}

        {!GAME.gameState.started && !GAME.gameState.branch &&
          <ToolbarRow iconName="fa-play" onClick={() => {
            global.socket.emit('startGame')
          }}
          onShiftClick={() => {
            global.socket.emit('startGame', { dontRespawn: true })
          }}
          >
            <ToolbarButton iconName='fa-play-circle' onClick={() => {
              global.socket.emit('startPregame')
            }}/>
            <ToolbarButton iconName='fa-code-branch' onClick={async () => {
              const branchOptions = Object.keys(GAME.library.branches)
              branchOptions.unshift('New branch')
              const { value: branchOptionIndex } = await Swal.fire({
                title: 'Choose branch',
                showClass: {
                  popup: 'animated fadeInDown faster'
                },
                hideClass: {
                  popup: 'animated fadeOutUp faster'
                },
                input: 'select',
                inputOptions: branchOptions,
              })

              if(!branchOptionIndex) return

              const chosenOption = branchOptions[branchOptionIndex]
              if(chosenOption === 'New branch') {
                const { value: name } = await Swal.fire({
                  title: "What is the name of this branch?",
                  showClass: {
                    popup: 'animated fadeInDown faster'
                  },
                  hideClass: {
                    popup: 'animated fadeOutUp faster'
                  },
                  input: 'text',
                  showCancelButton: true,
                  confirmButtonText: 'Start Branch',
                })
                if(name) {
                  global.socket.emit('branchGame', name)
                }
              } else {
                global.socket.emit('branchGame', chosenOption)
              }
            }}/>
          </ToolbarRow>
        }
        {GAME.gameState.branch &&
          <ToolbarRow iconName="fa-code-branch" active={true} onClick={() => {
            global.socket.emit('branchGameSave')
          }}>
            <ToolbarButton iconName='fa-save' onClick={() => {
              global.socket.emit('branchGameSave')
            }}/>
            <ToolbarButton iconName='fa-trash' onClick={() => {
              global.socket.emit('branchGameCancel')
            }}/>
          </ToolbarRow>
        }
        {GAME.gameState.started && <ToolbarRow iconName='fa-stop'
          onShiftClick={async () => {
            const { value: confirm } = await Swal.fire({
              title: "Are you sure you to stop the game while preserving the game state?",
              showClass: {
                popup: 'animated fadeInDown faster'
              },
              hideClass: {
                popup: 'animated fadeOutUp faster'
              },
              showCancelButton: true,
              confirmButtonText: 'Yes, preserve this state',
            })
            if(confirm) {
              global.socket.emit('processEffect', {
                effectName: 'stopGamePreserve'
              })
            }
          }}
          onClick={() => {
            global.socket.emit('stopGame')
          }}>
          <ToolbarButton iconName={GAME.gameState.paused ? "fa-play" : "fa-pause"} onClick={() => {
            if(!GAME.gameState.paused) global.socket.emit('editGameState', { paused: true })
            if(GAME.gameState.paused) global.socket.emit('editGameState', { paused: false })
          }}/>
        </ToolbarRow>
      }
      <br/>

        {/* World Edit -> Pull out */}
        <ToolbarRow iconName='fa-globe'>
          {/* Day Night Cycle -> Dat GUI */}
          <ToolbarButton iconName="fa-cloud-sun-rain" onClick={() => {
            LIVEEDITOR.open(GAME.world, 'daynightcycle')
          }}/>
          <ToolbarButton iconName="fa-sliders-h" onClick={() => {
            LIVEEDITOR.open(GAME.world, 'world')
          }}/>

        <ToolbarButton iconName="fa-palette" onClick={() => {
            LIVEEDITOR.open(GAME.world, 'worldFilter')
          }}/>

          {/* Clear All Objects -> Map Action */}
          <ToolbarButton iconName="fa-trash-alt"
            onShiftClick={() => {
              global.socket.emit('resetObjects')
            }}
          onClick={async () => {
            const { value: confirm } = await Swal.fire({
              title: "Are you sure you want to delete all objects on the map?",
              showClass: {
                popup: 'animated fadeInDown faster'
              },
              hideClass: {
                popup: 'animated fadeOutUp faster'
              },
              showCancelButton: true,
              confirmButtonText: 'Yes, Delete all objects',
            })
            if(confirm) {
              global.socket.emit('resetObjects')
            }
          }}/>
        </ToolbarRow>

        <ToolbarRow iconName='fa-atlas'>
          <ToolbarButton text="Mario" onShiftClick onClick={() => {
            EDITOR.transformWorldTo('Mario')
          }}/>
          <ToolbarButton text="Zelda" onShiftClick onClick={() => {
            EDITOR.transformWorldTo('Zelda')
          }}/>
          <ToolbarButton text="Pacman" onShiftClick onClick={() => {
            EDITOR.transformWorldTo('Pacman')
          }}/>
          <ToolbarButton text="Smash" onShiftClick onClick={() => {
            EDITOR.transformWorldTo('Smash')
          }}/>
          <ToolbarButton text="Purg" onShiftClick onClick={() => {
            EDITOR.transformWorldTo('Purgatory')
          }}/>
          <ToolbarButton text="Default" onShiftClick onClick={() => {
            EDITOR.transformWorldTo('Default')
          }}/>
        </ToolbarRow>

        {/* Hero Edit -> Pull out */}
        <ToolbarRow open iconName='fa-street-view'>
          {/* Composer -> Menu */}
          <ToolbarButton iconName="fa-blind" onClick={() => {
            LIVEEDITOR.open(GAME.heros[HERO.editingId], 'guidance')
          }}/>

        {/* anticipate object
          <ToolbarButton iconName="fa-plus-square" onClick={() => {
            global.socket.emit('anticipateObject', { tags: { obstacle: true }}, HERO.editingId);
          }}
          onShiftClick={() => {
            global.socket.emit('anticipateObject', { tags: { obstacle: true }, wall: true}, HERO.editingId);
          }}
          />
        */}

          <ToolbarButton iconName="fa-sliders-h" onClick={() => {
            LIVEEDITOR.open(GAME.heros[HERO.editingId], 'hero')
          }}/>
          {/* star view */}
          {hero && hero.animationZoomTarget === global.constellationDistance ? <ToolbarButton iconName="fa-globe-asia" onClick={() => {
              global.socket.emit('editHero', { id: hero.id, animationZoomTarget: hero.zoomMultiplier, endAnimation: true, })
          }}/> : <ToolbarButton iconName="fa-star" onClick={() => {
              global.socket.emit('editHero', { id: hero.id, animationZoomTarget: global.constellationDistance, animationZoomMultiplier: hero.zoomMultiplier, endAnimation: false })
          }}/>}

          {/* camera shake

            <ToolbarButton iconName="fa-camera" onClick={() => {
              global.socket.emit('heroCameraEffect', 'cameraShake', HERO.editingId, { duration: 500, frequency: 20, amplitude: 36 })
            }}/>

            <ToolbarButton iconName="fa-cloud-meatball" onClick={() => {
              LIVEEDITOR.open(GAME.heros[HERO.editingId], 'particle')
            }}/>
          */}

        <ToolbarButton iconName="fa-camera-retro" onClick={async () => {
            const { value: name } = await Swal.fire({
              title: "What is the name of this photo?",
              showClass: {
                popup: 'animated fadeInDown faster'
              },
              hideClass: {
                popup: 'animated fadeOutUp faster'
              },
              input: 'text',
              showCancelButton: true,
              confirmButtonText: 'Take picture',
            })
            if(name) {
              PIXIMAP.snapCamera(name)
            }
          }}
          onShiftClick={() => {
            PIXIMAP.snapCamera()
          }}/>
          <ToolbarButton iconName="fa-code" onClick={() => {
            modals.editObjectCode(hero, 'Editing Hero JSON', hero);
          }}/>

          <ToolbarButton iconName="fa-recycle" onClick={() => {
              global.socket.emit('resetPhysicsProperties', hero.id)
            }}
            onShiftClick={() => {
              global.socket.emit('resetHeroToGameDefault', hero)
              // global.socket.emit('resetHeroToDefault', hero)
            }}
          />

          {/*
            {/* go incognito}
          <ToolbarButton iconName="fa-save"></i>
          <ToolbarButton iconName="fa-comment"></i>
          <ToolbarButton iconName="fa-gamepad"></i>
          */}
          {/*
          <ToolbarButton iconName="fa-skull"></i>
          <ToolbarButton iconName="fa-tag"></i>
          <ToolbarButton iconName="fa-briefcase"></i>
          */}
          <ToolbarButton iconName="fa-search-plus" onClick={() => {
            EDITOR.setHeroZoomTo('smaller')
          }}/>
          <ToolbarButton iconName="fa-search-minus" onClick={() => {
            EDITOR.setHeroZoomTo('larger')
          }}/>
        </ToolbarRow>

        <ToolbarRow open iconName='fa-chess'>
          {/* Quests -> Menu
            <ToolbarButton iconName="fa-check-square"></i>
          */}
          {/* Scenarios -> Menu
            <ToolbarButton iconName="fa-trophy"/>

            */}
          {/* Sequences -> Menu */}
          <ToolbarButton iconName="fa-sitemap" onClick={() => {
            BELOWMANAGER.open({ selectedManager: 'GameManager', selectedMenu: 'sequence'})
          }}/>
          <ToolbarButton iconName="fa-tags" onClick={() => {
            BELOWMANAGER.open({ selectedManager: 'GameManager', selectedMenu: 'metadata'})
          }}/>
          <ToolbarButton iconName="fa-book-dead" onClick={() => {
            BELOWMANAGER.open({ selectedManager: 'GameManager', selectedMenu: 'library'})
           }}/>
          {/* Default Heros -> Menu */}
          <ToolbarButton iconName="fa-theater-masks" onClick={() => {
            PAGE.typingMode = true
            modals.openEditCodeModal('Edit Default Hero JSON', GAME.defaultHero || global.defaultHero, (result) => {
              if(result && result.value) {
                const editedCode = JSON.parse(result.value)
                global.socket.emit('editGameHeroJSON', 'default', editedCode)
              }
              PAGE.typingMode = false
            })
          }}
          onShiftClick={() => {
            global.socket.emit('editGameHeroJSON', 'default', global.defaultHero)
          }}
          />
           <ToolbarButton iconName="fa-icons" onClick={() => {
             PAGE.typingMode = true
             modals.openEditCodeModal('Edit Theme JSON', GAME.theme, (result) => {
               if(result && result.value) {
                 const editedCode = JSON.parse(result.value)
                 global.socket.emit('updateTheme', editedCode)
               }
               PAGE.typingMode = false
             })
            }}>
           </ToolbarButton>

           <ToolbarButton iconName="fa-dice" onClick={() => {
               LIVEEDITOR.open({}, 'gameRandomizer')
            }}>
           </ToolbarButton>
        </ToolbarRow>
        <br/>

{/*          <ToolbarButton text="Structure" active={EDITOR.preferences.selectable.structure} onClick={() => {
            EDITOR.preferences.selectable.structure = !EDITOR.preferences.selectable.structure
            this.forceUpdate()
          }}/>*/}
        <ToolbarRow open iconName='fa-layer-group'>
          <ToolbarButton iconName='fa-th' active={EDITOR.preferences.showAdminGrid} onClick={() => {
            EDITOR.preferences.showAdminGrid = !EDITOR.preferences.showAdminGrid
            this.forceUpdate()
          }}/>
          <ToolbarButton text="Invisible" active={EDITOR.preferences.selectable.invisible} onClick={() => {
            EDITOR.preferences.selectable.invisible = !EDITOR.preferences.selectable.invisible
            this.forceUpdate()
          }}/>
        <ToolbarButton text="Darkness" active={EDITOR.preferences.selectable.darkness} onClick={() => {
            EDITOR.preferences.selectable.darkness = !EDITOR.preferences.selectable.darkness
            // PIXIMAP.updateAllSprites()
            this.forceUpdate()
          }}/>
          <ToolbarButton text="Foreground" active={EDITOR.preferences.selectable.foreground} onClick={() => {
            EDITOR.preferences.selectable.foreground = !EDITOR.preferences.selectable.foreground
            PIXIMAP.resetConstructParts()
            this.forceUpdate()
          }}/>
          <ToolbarButton text="Background" active={EDITOR.preferences.selectable.background} onClick={() => {
            EDITOR.preferences.selectable.background = !EDITOR.preferences.selectable.background
            PIXIMAP.resetConstructParts()
            this.forceUpdate()
          }}/>
          <ToolbarButton text="Constructs" active={EDITOR.preferences.selectable.constructParts} onClick={() => {
            EDITOR.preferences.selectable.constructParts = !EDITOR.preferences.selectable.constructParts
            PIXIMAP.resetConstructParts()
            this.forceUpdate()
          }}/>
          <ToolbarButton text="SubObjects" active={EDITOR.preferences.selectable.subObjects} onClick={() => {
              EDITOR.preferences.selectable.subObjects = !EDITOR.preferences.selectable.subObjects
              PIXIMAP.resetConstructParts()
              this.forceUpdate()
            }}/>
        </ToolbarRow>

        {/* Grid -> Menu
          <ToolbarButton iconName="fa-th"></i>*/}
        <ToolbarRow iconName='fa-search'>
          <ToolbarButton iconName="fa-search-plus" onClick={() => {
            EDITOR.preferences.zoomMultiplier -= (EDITOR.zoomDelta * 4)
            global.local.emit('onZoomChange', HERO.editingId)
          }}/>
          <ToolbarButton iconName="fa-search-minus" onClick={() => {
            EDITOR.preferences.zoomMultiplier += (EDITOR.zoomDelta * 4)
            global.local.emit('onZoomChange', HERO.editingId)
          }}/>
          <ToolbarButton iconName="fa-times" onClick={() => {
            EDITOR.preferences.zoomMultiplier = 0
            global.local.emit('onZoomChange', HERO.editingId)
          }}/>
        </ToolbarRow>

        <ToolbarRow active={HERO.editingId !== HERO.originalId} iconName="fa-mask">
          {/* go incognito */}
          <ToolbarButton active={GAME.heros[HERO.originalId].tags.hidden} iconName="fa-eye-slash" onClick={() => {
            if(GAME.heros[HERO.originalId].tags.hidden) {
              global.socket.emit('editHero', { id: HERO.originalId, tags: { hidden: false } })
            } else {
              global.socket.emit('editHero', { id: HERO.originalId, tags: { hidden: true } })
            }
          }}/>
          <ToolbarButton active={HERO.id === HERO.editingId && HERO.id !== HERO.originalId} iconName="fa-user-secret" onClick={() => {
              if(HERO.id === HERO.originalId) {
                HERO.id = HERO.editingId
              } else {
                HERO.id = HERO.originalId
              }
              EDITORUI.ref.forceUpdate()
            }}/>
            <ToolbarButton iconName="fa-gamepad" active={HERO.ghostControl} onClick={() => {
              HERO.ghostControl = !HERO.ghostControl
              EDITORUI.ref.forceUpdate()
            }}/>
          <ToolbarButton iconName="fa-chevron-left" onShiftClick onClick={() => {
            GHOST.previousHero()
            EDITORUI.ref.forceUpdate()
            global.local.emit('onZoomChange')
          }}/>
          <ToolbarButton iconName="fa-chevron-right" onShiftClick onClick={() => {
            GHOST.nextHero()
            EDITORUI.ref.forceUpdate()
            global.local.emit('onZoomChange')
          }}/>
          <ToolbarButton iconName="fa-times" onClick={() => {
              HERO.id = HERO.originalId
              HERO.editingId = HERO.originalId
              EDITORUI.ref.forceUpdate()
            }}/>
        </ToolbarRow>




        <br/>

        <ToolbarRow iconName='fa-cog'>
          <ToolbarButton iconName="fa-save" onClick={EDITOR.saveGame}/>
          <ToolbarButton iconName="fa-folder-open" onClick={EDITOR.loadGame}/>
          <ToolbarButton iconName="fa-file" onClick={EDITOR.newGame}/>
          <ToolbarButton iconName="fa-download" onClick={() => {
            let saveGame = GAME.cleanForSave(GAME)
            PAGE.downloadObjectAsJson(saveGame, GAME.id)
          }}/>
          <ToolbarButton iconName="fa-upload" onClick={() => {
            modals.openEditCodeModal('Paste JSON code here', {}, (result) => {
              if(result && result.value) {
                global.socket.emit('setGameJSON', JSON.parse(result.value))
              }
            })
          }}/>
          <ToolbarButton iconName="fa-icons" onClick={() => {
                BELOWMANAGER.open({ selectedManager: 'MediaManager' })
            }}>
          </ToolbarButton>
          <ToolbarButton iconName="fa-window-restore" className="haDraggable" onDragStart={(e) => {
            if(e.target.className.indexOf('haDraggable') == -1) return e.preventDefault()
            if(CONSTRUCTEDITOR.open || PATHEDITOR.open || !PAGE.role.isAdmin) return

            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.type = 'game'
            console.log('no need to log anything else')

            e.dataTransfer.setData('text/plain', JSON.stringify(GAME));
          }}
          onClick={() => {
                BELOWMANAGER.open({ selectedManager: 'MediaManager' })
            }}>
          </ToolbarButton>
        </ToolbarRow>

      </div>
    )
  }
}
//
// <ToolbarRow iconName="fa-icons" onClick={() => {
//     BELOWMANAGER.open({ selectedManager: 'MediaManager' })
// }}>
// </ToolbarRow>


// world transform
// set to mario ( hold shift to also change objects, hero )
// set to smash
// set to pacman
// set to zelda
// set to purgatory

// world actions
// edit day night
// edit world OTHER

// special map actions
// bulldoze
// select group
// clear all objects ( Set to platformer, maze, etc )
// clear spawned objects

// currentHero actions
// anticipate add
// CAMERA SHAKE
// SEND TO STAR VIEW
// ?
// Turn invisible
// change controls
// change chat service
// view inventory
// reset to default, respawn
// Live Edit
