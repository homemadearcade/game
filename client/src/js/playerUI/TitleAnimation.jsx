import anime from 'animejs/lib/anime.es.js';
import React from 'react'
import classnames from 'classnames';

// FONT STEPS
// load font in index.scss

// ANIM STEPS
// replace placeholder title with {title} prop
// switch class to className

window.titleAnimationStyles = [
  'sunny mornings',
  'great thinkers',
  'beautiful questions',
  'made with love',
  'a new production',
  'hello goodbye',
  'thursday',
  // 'signal and noise'
]


//https://www.cdnfonts.com/
window.titleFontStyles = [
  "'Black Empire', sans-serif",
  "'Alien Mine', sans-serif",
  // "'Some Weatz Swashes', sans-serif",
  // "'Some Weatz Symbols', sans-serif",
  "'Daydream Daily', sans-serif",
  "'Umber SSi', sans-serif",
  "'wuwu perspectiva', sans-serif",
  "'Equine', sans-serif",
  // "Comic Sans",
  "'American Lemon', sans-serif",
  "Courier",
  "'Press Start 2P', sans-serif",
  "'Magic School One', sans-serif",
  "'Magic School Two', sans-serif",
  "'Medieval Sharp', sans-serif'",
]

export default class TitleAnimation extends React.Component{
  render() {
    const { style, title, font } = this.props

    if(!style || style === 'sunny mornings') {
      return <h1 className="TitleAnimation ml2" style={{fontFamily: font}}>{title}</h1>
    }

    if(style === 'great thinkers') {
      return <h1 className="TitleAnimation ml3" style={{fontFamily: font}}>{title}</h1>
    }

    if(style === 'beautiful questions') {
      return <h1 class="TitleAnimation ml6">
        <span class="text-wrapper">
          <span class="letters" style={{fontFamily: font}}>{title}</span>
        </span>
      </h1>
    }

    if(style === 'made with love') {
      return <h1 class="TitleAnimation ml16" style={{fontFamily: font}}>{title}</h1>
    }

    if(style === 'a new production') {
      return <h1 class="TitleAnimation ml12" style={{fontFamily: font}}>{title}</h1>
    }

    if(style === 'hello goodbye') {
      return <h1 class="TitleAnimation ml11">
        <span class="text-wrapper">
          <span class="line line1"></span>
          <span class="letters" style={{fontFamily: font}}>{title}</span>
        </span>
      </h1>
    }

    if(style === 'thursday') {
      return <h1 class="TitleAnimation ml1">
        <span class="text-wrapper">
          <span class="line line1"></span>
          <span style={{fontFamily: font}} class="letters">{title}</span>
          <span class="line line2"></span>
        </span>
      </h1>
    }


    if(style === 'signal and noise') {

      // <span class="letters letters-left">Signal</span>
      // <span class="letters ampersand">&amp;</span>
      // <span class="letters letters-right">Noise</span>
      return <h1 class="TitleAnimation ml5">
        <span class="text-wrapper">
          <span class="line line1"></span>
          <span style={{fontFamily: font}} class="letters ampersand">{title}</span>
          <span class="line line2"></span>
        </span>
      </h1>
    }

  }

  componentDidMount() {
    // setTimeout(() => {
      this._startAnimation()
    // }, 200)
  }

  _startAnimation() {

    const { style, onComplete } = this.props

    setTimeout(() => {
      AUDIO.play(GAME.theme.audio.onGameTitleAppears)
    }, 300)

    if(!style || style === 'sunny mornings') {
      // Wrap every letter in a span
      var textWrapper = document.querySelector('.ml2');
      textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

      anime.timeline({loop: window.demoTitles})
        .add({
          targets: '.ml2 .letter',
          scale: [4,1],
          opacity: [0,1],
          translateZ: 0,
          easing: "easeOutExpo",
          duration: 950,
          delay: (el, i) => 70*i,
          complete: function(anim) {
            onComplete()
          }
        })
        // .add({
        //   targets: '.ml2',
        //   opacity: 0,
        //   duration: 1000,
        //   easing: "easeOutExpo",
        //   delay: 1000
        // });
    }

    if(style === 'great thinkers') {
      // Wrap every letter in a span
      var textWrapper = document.querySelector('.ml3');
      textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

      anime.timeline({loop: window.demoTitles})
        .add({
          targets: '.ml3 .letter',
          opacity: [0,1],
          easing: "easeInOutQuad",
          duration: 2250,
          delay: (el, i) => 150 * (i+1),
          complete: function(anim) {
            onComplete()
          }
        })
        //
        // .add({
        //   targets: '.ml3',
        //   opacity: 0,
        //   duration: 1000,
        //   easing: "easeOutExpo",
        //   delay: 1000
        // });
    }

    if(style === 'beautiful questions') {
      // Wrap every letter in a span
      var textWrapper = document.querySelector('.ml6 .letters');
      textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

      anime.timeline({loop: window.demoTitles})
        .add({
          targets: '.ml6 .letter',
          translateY: ["1.1em", 0],
          translateZ: 0,
          duration: 750,
          delay: (el, i) => 50 * i,
          complete: function(anim) {
            onComplete()
          }
        })
        // .add({
        //   targets: '.ml6',
        //   opacity: 0,
        //   duration: 1000,
        //   easing: "easeOutExpo",
        //   delay: 1000,
        //
        // });
    }

    if(style === 'made with love') {
      // Wrap every letter in a span
      var textWrapper = document.querySelector('.ml16');
      textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

      anime.timeline({loop: window.demoTitles})
        .add({
          targets: '.ml16 .letter',
          translateY: [-100,0],
          easing: "easeOutExpo",
          duration: 1400,
          delay: (el, i) => 30 * i,
          complete: function(anim) {
            onComplete()
          }
        })
        // .add({
        //   targets: '.ml16',
        //   opacity: 0,
        //   duration: 1000,
        //   easing: "easeOutExpo",
        //   delay: 1000,
        //
        // });
    }

    if(style === 'a new production') {
      // Wrap every letter in a span
      var textWrapper = document.querySelector('.ml12');
      textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

      anime.timeline({loop: window.demoTitles})
        .add({
          targets: '.ml12 .letter',
          translateX: [40,0],
          translateZ: 0,
          opacity: [0,1],
          easing: "easeOutExpo",
          duration: 800,
          delay: (el, i) => 500 + 30 * i,
          complete: function(anim) {
            onComplete()
          }
        })

        // .add({
        //   targets: '.ml12 .letter',
        //   translateX: [0,-30],
        //   opacity: [1,0],
        //   easing: "easeInExpo",
        //   duration: 1100,
        //   delay: (el, i) => 100 + 30 * i,
        //   complete: function(anim) {
        //     onComplete()
        //   }
        // });
    }


    if(style === 'hello goodbye') {
      // Wrap every letter in a span
      var textWrapper = document.querySelector('.ml11 .letters');
      textWrapper.innerHTML = textWrapper.textContent.replace(/([^\x00-\x80]|\w)/g, "<span class='letter'>$&</span>");

      anime.timeline({loop: window.demoTitles})
        .add({
          targets: '.ml11 .line',
          scaleY: [0,1],
          opacity: [0.5,1],
          easing: "easeOutExpo",
          duration: 700
        })
        .add({
          targets: '.ml11 .line',
          translateX: [0, document.querySelector('.ml11 .letters').getBoundingClientRect().width + 10],
          easing: "easeOutExpo",
          duration: 700,
          delay: 100
        }).add({
          targets: '.ml11 .letter',
          opacity: [0,1],
          easing: "easeOutExpo",
          duration: 600,
          offset: '-=775',
          delay: (el, i) => 34 * (i+1),
          complete: function(anim) {
            onComplete()
          }
        })

        // .add({
        //   targets: '.ml11',
        //   opacity: 0,
        //   duration: 1000,
        //   easing: "easeOutExpo",
        //   delay: 1000
        // });
    }


    if(style === 'thursday') {
      // Wrap every letter in a span
      var textWrapper = document.querySelector('.ml1 .letters');
      textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

      anime.timeline({loop: window.demoTitles})
        .add({
          targets: '.ml1 .letter',
          scale: [0.3,1],
          opacity: [0,1],
          translateZ: 0,
          easing: "easeOutExpo",
          duration: 600,
          delay: (el, i) => 70 * (i+1)
        }).add({
          targets: '.ml1 .line',
          scaleX: [0,1],
          opacity: [0.5,1],
          easing: "easeOutExpo",
          duration: 700,
          offset: '-=875',
          delay: (el, i, l) => 80 * (l - i),
          complete: function(anim) {
            onComplete()
          }
        })

        // .add({
        //   targets: '.ml1',
        //   opacity: 0,
        //   duration: 1000,
        //   easing: "easeOutExpo",
        //   delay: 1000
        // });
    }

    if(style === 'signal and noise') {
      anime.timeline({loop: window.demoTitles})
      .add({
        targets: '.ml5 .line',
        opacity: [0.5,1],
        scaleX: [0, 1],
        easing: "easeInOutExpo",
        duration: 700
      }).add({
        targets: '.ml5 .line',
        duration: 600,
        easing: "easeOutExpo",
        translateY: (el, i) => (-0.625 + 0.625*2*i) + "em"
      }).add({
        targets: '.ml5 .ampersand',
        opacity: [0,1],
        scaleY: [0.5, 1],
        easing: "easeOutExpo",
        duration: 600,
        offset: '-=600'
      }).add({
        targets: '.ml5 .letters-left',
        opacity: [0,1],
        translateX: ["0.5em", 0],
        easing: "easeOutExpo",
        duration: 600,
        offset: '-=300'
      }).add({
        targets: '.ml5 .letters-right',
        opacity: [0,1],
        translateX: ["-0.5em", 0],
        easing: "easeOutExpo",
        duration: 600,
        offset: '-=600',
        complete: function(anim) {
          onComplete()
        }
      })

      // .add({
      //   targets: '.ml5',
      //   opacity: 0,
      //   duration: 1000,
      //   easing: "easeOutExpo",
      //   delay: 1000,
      //
      // });
    }
  }
}
