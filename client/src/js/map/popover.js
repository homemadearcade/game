import React from 'react'
import ReactDOM from 'react-dom'
import tippy, {roundArrow} from 'tippy.js';
// import 'tippy.js/themes/light.css';
import 'tippy.js/dist/tippy.css'; // optional for styling
import Popover from './popover/Root.jsx'

global.local.on('onFirstPageGameLoaded', () => {
  MAP.popoverInstances = []
  const tippyArea = document.querySelector('#game-canvas');

  MAP.closePopover = function(objectId) {
    MAP.popoverInstances =  MAP.popoverInstances.filter((instance) => {
      if(objectId === instance.objectId) {
        instance.hide()
        ReactDOM.unmountComponentAtNode(document.getElementById(instance.domId))
        instance.destroy()
        global.popoverOpen[objectId] = false
        return false
      } else return true
    })
  }

  MAP.closeAllPopovers = function() {
    MAP.popoverInstances.forEach((instance) => {
      instance.hide()
      ReactDOM.unmountComponentAtNode(document.getElementById(instance.domId))
      instance.destroy()
    })
    MAP.popoverInstances = []
    global.popoverOpen = {}
  }

  MAP.openPopover = function(object) {
    if(PATHEDITOR.open || CONSTRUCTEDITOR.open) return
    global.popoverOpen[object.id] = true
    const popoverDomId = object.id + '-popover'
    const instance = tippy(tippyArea, {
      content: `<div id="${popoverDomId}">
      </div>`,
      // appendTo: tippyArea,
      theme: 'light',
      allowHTML: true,
      placement: 'top',
      trigger: 'manual',
      interactive: true,
      hideOnClick: false,
      arrow: true,
      zIndex: 1,
      // offset: [0, 0],
    });

    instance.domId = popoverDomId
    instance.objectId = object.id
    setPopoverPosition(instance, object)
    instance.show();

    ReactDOM.render(
      React.createElement(Popover, { object: object }),
      document.getElementById(popoverDomId)
    )

    MAP.popoverInstances.push(instance)
  }

  MAP.updatePopovers = function() {
    MAP.popoverInstances.forEach((instance) => {
      let object = OBJECTS.getObjectOrHeroById(instance.objectId)
      if(!object && global.popoverOpen[instance.objectId]) {
        MAP.closePopover(instance.objectId)
        return
      }

      setPopoverPosition(instance, object)
    })
  }
})

function setPopoverPosition(instance, object) {
  instance.setProps({
    getReferenceClientRect: () => {
      let y = (object.y * MAP.camera.multiplier) - MAP.camera.y
      let y2 = ((object.y + object.height) * MAP.camera.multiplier) - MAP.camera.y

      y+= 45 - global.scrollY
      y2+= 45 - global.scrollY

      let pos = {
        width: (object.width * MAP.camera.multiplier),
        height: (object.height * MAP.camera.multiplier),
        top: y,
        bottom: y2,
        left: (object.x * MAP.camera.multiplier) - MAP.camera.x,
        right: ((object.x + object.width) * MAP.camera.multiplier) - MAP.camera.x,
      }

      if(object.id === HERO.id && instance.lastPos && Math.abs(instance.lastPos.left - pos.left) < 4 && Math.abs(instance.lastPos.top - pos.top) < 4) {
        return instance.lastPos
      }

      instance.lastPos = pos
      return pos
    },
  });
}
