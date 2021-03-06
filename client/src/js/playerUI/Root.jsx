import React from 'react'
import Toolbar from './Toolbar.jsx'
import DialogueBox from './DialogueBox.jsx'
import Cutscene from './Cutscene.jsx'
import Goals from './Goals.jsx'
import GameOver from './GameOver.jsx'
import GameList from './GameList.jsx'

import InventoryModal from './InventoryModal.jsx'
import MainMenuModal from './MainMenuModal.jsx'
import HeroMenuModal from './HeroMenuModal.jsx'
import ControlsInfo from './ControlsInfo.jsx'
import ControlsHUD from './ControlsHUD.jsx'
import InventoryHUD from './InventoryHUD.jsx'
import GameLogs from './GameLogs.jsx'
import Modal from '../components/Modal.jsx'
import { ToastContainer, toast, Slide, Zoom, Flip, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import modals from './modals.js';
import keycode from 'keycode'

global.readyForControlsToast = true

global.currentToasts = []

function getToastTextData(text) {
  let parenthesisIndex = text.indexOf('(')
  if(parenthesisIndex >= 0) {
    text = text.slice(0, parenthesisIndex - 1)
  }
  return text
}

export default class Root extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activeQuest: {},
      gameState: {},
      toastingActiveQuestGoalId: null,
      toastingActiveQuestGoalToastId: null,
      showInventoryModal: false,
      showControlsInfoModal: false,
      showHeroMenuModal: false,
      hero: GAME.heros[HERO.id],
    }

    this.gameLogRef = React.createRef()

    this.onUpdateState = (heroOverride) => {
      const hero = GAME.heros[HERO.id]
      if(heroOverride) {
        this.setState({
          hero: {...hero, ...heroOverride},
          activeQuest: this._getActiveQuest(hero),
          quests: hero.quests,
        }, () => {
          this._showActiveQuestGoalToast()
        })
      }
      this.setState({
        hero,
        activeQuest: this._getActiveQuest(hero),
        quests: hero.quests,
      }, () => {
        this._showActiveQuestGoalToast()
      })
    }

    this.onHeroStartQuest = function (heroId, questId) {
      const hero = GAME.heros[heroId]
      const quest = hero.quests[questId]
      if (hero.id === HERO.id && quest) {
        if (quest.startMessage.length) {
          modals.openModal(quest.id + ' Started!', quest.startMessage)
        } else {
          toast('quest started: ' + quest.id, {
            // position: "top-right",
            autoClose: 6000,
            newestOnTop: true,
          })
        }
      }
    }

    this.onHeroCompleteQuest = function (heroId, questId) {
      const hero = GAME.heros[heroId]
      const quest = hero.quests[questId]
      if (hero.id === HERO.id && quest) {
        if (quest.completionMessage.length) {
          modals.openModal(quest.id + ' Complete!', quest.completionMessage)
        } else {
          toast('quest completed: ' + quest.id, {
            // position: "top-right",
            autoClose: 6000,
            newestOnTop: true,
          })
        }
      }
    }
  }

  componentDidMount() {
    document.addEventListener("keydown", this._onKeyDown, false);
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this._onKeyDown, false);
  }

  onSendNotification = (data) => {
    if(data.toast) {
      let currentToast
      global.currentToasts.forEach((toast) => {
        if(!toast.text) return
        const text = getToastTextData(toast.text)
        if(data.text === text) currentToast = toast
      })
      if(currentToast) {
        let newText = getToastTextData(currentToast.text)
        currentToast.count++
        toast.update(currentToast.id, {
          render: newText + ` (${currentToast.count})`
        })
        return
      }

      const toastInfo = {
        // position: "top-right",
        autoClose: (data.duration * 1000) || 4000,
        newestOnTop: true,
        closeOnClick: data.duration <= 0,
        onClose: (props) => {
          global.currentToasts = global.currentToasts.filter((toast) => {
            return toast.id !== toastId
          })
        }
      }
      if(data.viewControlsOnClick) {
        // sometimes we edit the controls a lot... so we dont show if theres too many. We need a... id control system for this
        if(!global.readyForControlsToast) return
        toastInfo.onClick = () => {
          AUDIO.play(GAME.theme.audio.onPlayerUIMenuOpen || global.defaultAudioTheme.onPlayerUIMenuOpen, { volume: 0.6 })
          this.setState({
            showControlsInfoModal: true
          })
        }
        global.readyForControlsToast = false
        setTimeout(() => {
          global.readyForControlsToast = true
        }, 4000)
      }

      let toastId = toast(data.text, toastInfo)
      // AUDIO.play(GAME.theme.audio.onPlayerUIToast || global.defaultAudioTheme.onPlayerUIToast, { volume: 1 })

      global.currentToasts.push({
        id: toastId,
        text: data.text,
        count: 1,
      })
    }

    if(data.modal) {
      modals.openModal(data.modalHeader, data.text)
    }
  }

  _renderGameLog() {
    if(!GAME.world.tags.hasGameLog || !PAGE.isGameReady) return

    return <React.Fragment>
      {PAGE.isLogOpen && <GameLogs ref={this.gameLogRef} logs={GAME.gameState.logs}/>}
      {!PAGE.isLogOpen && <div className="PlayerUI__open-log"><i className="fa fas fa-chevron-left" onClick={PAGE.openLog}/></div>}
      {PAGE.isLogOpen && <div className="PlayerUI__close-log"><i className="fa fas fa-times" onClick={PAGE.closeLog}/></div>}
    </React.Fragment>
  }

  showInventoryModal = () => {
    AUDIO.play(GAME.theme.audio.onPlayerUIMenuOpen || global.defaultAudioTheme.onPlayerUIMenuOpen, { volume: 0.6 })
    this.setState({
      showInventoryModal: true,
      showControlsInfoModal: false,
      showHeroMenuModal: false,
    })
  }

  _renderFontPreLoad() {
    return <div style={{position: 'fixed', opacity: 0}}>
      {global.titleFontStyles.map((font) => {
        return <div style={{fontFamily: font.fontFamily}}>ABCDEFGHIJKL</div>
      })}
    </div>
  }

  render() {
    const { showInventoryModal, showControlsInfoModal, showHeroMenuModal, hero } = this.state;

    let toastContainer = <ToastContainer
      position="top-center"
      autoClose={false}
      hideProgressBar={true}
      closeOnClick={false}
      newestOnTop={false}
      closeButton={false}
      draggable={false}
      transition={Slide}
    />
    if (CONSTRUCTEDITOR.open || PATHEDITOR.open) return toastContainer
    if (!GAME.gameState || !GAME.gameState.loaded) return toastContainer

    // <div className="ShortcutPanel">
    //   <i className="ShortcutPanel__main-menu fa fas fa-bars"></i>
    // </div>

    const hasDialogue = hero.dialogue && hero.dialogue.length > 0

    const cutscene = hero.flags && hero.flags.showCutscene && hero.cutscenes

    return (
      <div className="PlayerUI">
        {this._renderFontPreLoad()}
        {cutscene &&  <Cutscene scenes={hero.cutscenes} />}
        {GAME.gameState.selectGame && <GameList showTitle/>}
        {!cutscene && GAME.gameState.gameOver && !GAME.gameState.started && <GameOver/>}
        {hero.flags && hero.flags.showDialogue && hasDialogue && <DialogueBox verticleMiddle dialogue={hero.dialogue} name={hero.dialogueName} id={hero.dialogueId} />}
        {hero.flags && hero.flags.showChoices && !hasDialogue && hero.choiceOptions && <DialogueBox verticleMiddle options={hero.choiceOptions} name={hero.dialogueName} id={hero.dialogueId}/>}
        <div className="RightHUD" style={{ right: PAGE.isLogOpen ? '22%' : '20px'}}>
          <InventoryHUD/>
          {hero.goals && hero.goals.length && <Goals goals={hero.goals} />}
        </div>

        {showHeroMenuModal && <HeroMenuModal
          hero={hero}
          onClose={() => this.setState({ showHeroMenuModal: false })}
          onOpenControlsInfoModal={() => {
            AUDIO.play(GAME.theme.audio.onPlayerUIMenuOpen || global.defaultAudioTheme.onPlayerUIMenuOpen, { volume: 0.6 })
            this.setState({ showControlsInfoModal: true })
          }}
          onOpenInventoryModal={() => {
            AUDIO.play(GAME.theme.audio.onPlayerUIMenuOpen || global.defaultAudioTheme.onPlayerUIMenuOpen, { volume: 0.6 })
            this.setState({ showInventoryModal: true })
          }}
        />}
        {showControlsInfoModal && <Modal
          size="medium"
          onClose={this._closeControlsInfoModal}
        >
          <ControlsInfo onClose={this._closeControlsInfoModal}/>
        </Modal>}
        {showInventoryModal && <InventoryModal
          onClose={() => this.setState({ showInventoryModal: false })}
          inventoryItems={hero.subObjects}
        />}
        {toastContainer}
        {this._renderGameLog()}
        {!PAGE.role.isArcadeMode && <Toolbar/>}
        {hero.flags.showBrandImageScreen && <div className="Cutscene" style={{backgroundImage: "url('"+global.HomemadeArcadeImageAssetURL + 'homemade-arcade-play.png'+"')" }}>
        </div>}
        <ControlsHUD/>
      </div>
    )
  }

  _closeControlsInfoModal = () => {
    this.setState({ showControlsInfoModal: false })
  }

  _getActiveQuest(hero) {
    let activeQuest;
    if (hero.questState) {
      Object.keys(hero.questState).forEach((questId) => {
        if (hero.questState[questId].active) {
          activeQuest = hero.quests[questId]
        }
      })
    }
    return activeQuest
  }

  hideUIGoalToast() {
    const {
      editorGoalToastId
    } = this.state;

    toast.dismiss(editorGoalToastId)
  }

  showUIGoalToast(text) {
    this.setState({
      editorGoalToastId: toast(text)
    })
  }

  _showActiveQuestGoalToast() {
    const {
      activeQuest,
      toastingActiveQuestGoalId,
      toastingActiveQuestGoalToastId
    } = this.state;

    if (!activeQuest) {
      if (toastingActiveQuestGoalToastId) {
        toast.dismiss(toastingActiveQuestGoalToastId)
      }
      this.setState({
        toastingActiveQuestGoalId: null,
        toastingActiveQuestGoalToastId: null,
      })

      return
    }

    if (activeQuest && activeQuest.id !== toastingActiveQuestGoalId) {
      if (toastingActiveQuestGoalToastId) {
        toast.dismiss(toastingActiveQuestGoalToastId)
      }

      this.setState({
        toastingActiveQuestGoalId: activeQuest.id,
        toastingActiveQuestGoalToastId: toast(activeQuest.goal)
      })
    }
  }

  _isModalOpen = () => {
    const { showInventoryModal, showControlsInfoModal, showHeroMenuModal } = this.state;

    return showInventoryModal || showControlsInfoModal || showHeroMenuModal
  }

  _onKeyDown = (event) => {
    const key = keycode(event.keyCode)

    if(GAME.world.tags.allowHeroChat && key === 't' && PAGE.isLogOpen) {
      this.gameLogRef.current.onTPressed(event)
    }

    if(GAME.world.tags.allowHeroChat && key === 'enter' && PAGE.isLogOpen) {
      this.gameLogRef.current.onEnterPressed(event)
    }

    if(key === 'esc') {
      if(this.gameLogRef.current) {
        this.gameLogRef.current.onEscPressed()
        return
      }
      this.setState({ showHeroMenuModal: false, showInventoryModal: false, showControlsInfoModal: false })
    }

    if(PAGE.typingMode) return

    // if (key === "i") {
    //   this.setState({ showInventoryModal: !this.state.showInventoryModal })
    // }
    //
    // if(key === 'esc') {
    //   event.preventDefault();
    //   if(this.state.showMainMenuModal) {
    //     this.setState({ showMainMenuModal: false })
    //   } else if(this._isModalOpen()){
    //     this.setState({ showMainMenuModal: false, showInventoryModal: false, showControlsInfoModal: false, showHeroMenuModal: false })
    //   } else {
    //     this.setState({ showMainMenuModal: true })
    //   }
    // }

    if(key === 'tab') {
      event.preventDefault();
      if(this.state.showHeroMenuModal) {
        this.setState({ showHeroMenuModal: false })
      } else if(this._isModalOpen()){
        AUDIO.play(GAME.theme.audio.onPlayerUIMenuOpen || global.defaultAudioTheme.onPlayerUIMenuOpen, { volume: 0.6 })
        this.setState({ showHeroMenuModal: true, showInventoryModal: false, showControlsInfoModal: false })
      } else {
        AUDIO.play(GAME.theme.audio.onPlayerUIMenuOpen || global.defaultAudioTheme.onPlayerUIMenuOpen, { volume: 0.6 })
        this.setState({ showHeroMenuModal: true })
      }
    }
  }
}
