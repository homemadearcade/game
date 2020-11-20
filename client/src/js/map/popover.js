import tippy, {roundArrow} from 'tippy.js';
// import 'tippy.js/themes/light.css';
import 'tippy.js/dist/tippy.css'; // optional for styling

window.local.on('onGameReady', () => {
  const tippyArea = document.querySelector('#GameContainer');

  const instance = tippy(tippyArea, {
    content: `<div class="Popover">
    HELLO
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

  let object = GAME.objectsById['object-260804255271']

  setInterval(() => {
    instance.setProps({
      getReferenceClientRect: () => {
        let y = (object.y * MAP.camera.multiplier) - MAP.camera.y
        let y2 = (object.y + object.height * MAP.camera.multiplier) - MAP.camera.y

        y+= 45
        y2+= 45

        return ({
          width: (object.width * MAP.camera.multiplier),
          height: (object.height * MAP.camera.multiplier),
          top: y,
          bottom: y2,
          left: (object.x * MAP.camera.multiplier) - MAP.camera.x,
          right: (object.x + object.width * MAP.camera.multiplier) - MAP.camera.x,
        })
      },
    });
  }, 40)


  instance.show();
})
