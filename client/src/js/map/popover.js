import tippy, {roundArrow} from 'tippy.js';
// import 'tippy.js/themes/light.css';
import 'tippy.js/dist/tippy.css'; // optional for styling


window.local.on('onFirstPageGameLoaded', () => {
  MAP.popoverInstances = []
  const tippyArea = document.querySelector('#GameContainer');

  MAP.closePopover = function(object) {
    MAP.popoverInstances =  MAP.popoverInstances.filter((instance) => {
      if(object.id === instance.objectId) {
        instance.destroy()
        return false
      } else return true
    })
  }

  MAP.openPopover = function(object) {
    const instance = tippy(tippyArea, {
      content: `<div class="Popover">
        ${object.chat}
      </div>`,
      // appendTo: tippyArea,
      theme: 'light',
      allowHTML: true,
      placement: 'top',
      trigger: 'manual',
      interactive: true,
      hideOnClick: false,
      arrow: true,
      // offset: [0, 0],
    });

    instance.objectId = object.id
    setPopoverPosition(instance, object)
    instance.show();
    MAP.popoverInstances.push(instance)
  }

  MAP.updatePopovers = function() {
    MAP.popoverInstances.forEach((instance) => {
      let object = OBJECTS.getObjectOrHeroById(instance.objectId)
      setPopoverPosition(instance, object)
    })
  }
})

function setPopoverPosition(instance, object) {
  instance.setProps({
    getReferenceClientRect: () => {
      let y = (object.y * MAP.camera.multiplier) - MAP.camera.y
      let y2 = ((object.y + object.height) * MAP.camera.multiplier) - MAP.camera.y

      y+= 45 - window.scrollY
      y2+= 45 - window.scrollY

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
