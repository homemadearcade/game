!function(e){var t={};function n(o){if(t[o])return t[o].exports;var i=t[o]={i:o,l:!1,exports:{}};return e[o].call(i.exports,i,i.exports,n),i.l=!0,i.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)n.d(o,i,function(t){return e[t]}.bind(null,i));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="/",n(n.s=4)}([function(e,t,n){var o=n(1);"string"==typeof o&&(o=[[e.i,o,""]]);var i={insert:"head",singleton:!1};n(3)(o,i);o.locals&&(e.exports=o.locals)},function(e,t,n){(e.exports=n(2)(!0)).push([e.i,"","",{version:3,sources:[],names:[],mappings:"",file:"index.scss"}])},function(e,t,n){"use strict";e.exports=function(e){var t=[];return t.toString=function(){return this.map(function(t){var n=function(e,t){var n=e[1]||"",o=e[3];if(!o)return n;if(t&&"function"==typeof btoa){var i=(r=o,c=btoa(unescape(encodeURIComponent(JSON.stringify(r)))),l="sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(c),"/*# ".concat(l," */")),a=o.sources.map(function(e){return"/*# sourceURL=".concat(o.sourceRoot).concat(e," */")});return[n].concat(a).concat([i]).join("\n")}var r,c,l;return[n].join("\n")}(t,e);return t[2]?"@media ".concat(t[2],"{").concat(n,"}"):n}).join("")},t.i=function(e,n){"string"==typeof e&&(e=[[null,e,""]]);for(var o={},i=0;i<this.length;i++){var a=this[i][0];null!=a&&(o[a]=!0)}for(var r=0;r<e.length;r++){var c=e[r];null!=c[0]&&o[c[0]]||(n&&!c[2]?c[2]=n:n&&(c[2]="(".concat(c[2],") and (").concat(n,")")),t.push(c))}},t}},function(e,t,n){"use strict";var o,i={},a=function(){return void 0===o&&(o=Boolean(window&&document&&document.all&&!window.atob)),o},r=function(){var e={};return function(t){if(void 0===e[t]){var n=document.querySelector(t);if(window.HTMLIFrameElement&&n instanceof window.HTMLIFrameElement)try{n=n.contentDocument.head}catch(e){n=null}e[t]=n}return e[t]}}();function c(e,t){for(var n=[],o={},i=0;i<e.length;i++){var a=e[i],r=t.base?a[0]+t.base:a[0],c={css:a[1],media:a[2],sourceMap:a[3]};o[r]?o[r].parts.push(c):n.push(o[r]={id:r,parts:[c]})}return n}function l(e,t){for(var n=0;n<e.length;n++){var o=e[n],a=i[o.id],r=0;if(a){for(a.refs++;r<a.parts.length;r++)a.parts[r](o.parts[r]);for(;r<o.parts.length;r++)a.parts.push(p(o.parts[r],t))}else{for(var c=[];r<o.parts.length;r++)c.push(p(o.parts[r],t));i[o.id]={id:o.id,refs:1,parts:c}}}}function h(e){var t=document.createElement("style");if(void 0===e.attributes.nonce){var o=n.nc;o&&(e.attributes.nonce=o)}if(Object.keys(e.attributes).forEach(function(n){t.setAttribute(n,e.attributes[n])}),"function"==typeof e.insert)e.insert(t);else{var i=r(e.insert||"head");if(!i)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");i.appendChild(t)}return t}var s,d=(s=[],function(e,t){return s[e]=t,s.filter(Boolean).join("\n")});function u(e,t,n,o){var i=n?"":o.css;if(e.styleSheet)e.styleSheet.cssText=d(t,i);else{var a=document.createTextNode(i),r=e.childNodes;r[t]&&e.removeChild(r[t]),r.length?e.insertBefore(a,r[t]):e.appendChild(a)}}function f(e,t,n){var o=n.css,i=n.media,a=n.sourceMap;if(i&&e.setAttribute("media",i),a&&btoa&&(o+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(a))))," */")),e.styleSheet)e.styleSheet.cssText=o;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(o))}}var y=null,g=0;function p(e,t){var n,o,i;if(t.singleton){var a=g++;n=y||(y=h(t)),o=u.bind(null,n,a,!1),i=u.bind(null,n,a,!0)}else n=h(t),o=f.bind(null,n,t),i=function(){!function(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e)}(n)};return o(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;o(e=t)}else i()}}e.exports=function(e,t){(t=t||{}).attributes="object"==typeof t.attributes?t.attributes:{},t.singleton||"boolean"==typeof t.singleton||(t.singleton=a());var n=c(e,t);return l(n,t),function(e){for(var o=[],a=0;a<n.length;a++){var r=n[a],h=i[r.id];h&&(h.refs--,o.push(h))}e&&l(c(e,t),t);for(var s=0;s<o.length;s++){var d=o[s];if(0===d.refs){for(var u=0;u<d.parts.length;u++)d.parts[u]();delete i[d.id]}}}}},function(e,t,n){"use strict";n.r(t);n(0);var o={start:function(e,t){window.addEventListener("keydown",function(n){"32"==n.keyCode&&(e.chat.shift(),e.chat.length||(e.chat.onChatEnd&&e.chat.onChatEnd(),t.showChat=!1,t.heroPaused=!1))},!1)},update:function(e){},render:function(e,t,n){t.showChat&&function(e,t){e.fillStyle="rgb(250, 250, 250)",e.font="20px Helvetica",e.textAlign="left",e.textBaseline="top",e.fillText(t,200,e.canvas.height-80)}(e,n[0][0])}};const i={};var a={start:function(e,t){window.addEventListener("keydown",function(e){i[e.keyCode]=!0},!1),window.addEventListener("keyup",function(e){delete i[e.keyCode]},!1)},update:function(e,t,n){e.heroPaused||(38 in i&&(t._y=t.y-t.speed*n),40 in i&&(t._y=t.y+t.speed*n),37 in i&&(t._x=t.x-t.speed*n),39 in i&&(t._x=t.x+t.speed*n))}};var r={check:function(e,t){let n=!1;for(let o=0;o<t.length;o++)e._x<t[o].x+t[o].width&&t[o].x<e._x+e.width&&e._y<t[o].y+t[o].height&&t[o].y<e._y+e.height&&(t[o].obstacle&&(n=!0),t[o].onCollide&&t[o].onCollide());n&&(e._x=e.x,e._y=e.y),n||(e.x=e._x,e.y=e._y)}};const c={x:0,y:0};var l={set:function(e,t){c.x=t.x+t.width/2-e.canvas.width/2,c.y=t.y+t.height/2-e.canvas.height/2},drawObject:function(e,t,n=!0){t.color&&(e.fillStyle=t.color),e.fillRect(t.x-c.x,t.y-c.y,t.width,t.height),e.fillStyle="white",n&&function(e,t){e.fillStyle="rgb(250, 250, 250)",e.font="12px Helvetica",e.textAlign="left",e.textBaseline="top",e.fillText(t.name?t.name:"",t.x-c.x,t.y-c.y)}(e,t)}};const h={x:0,y:0},s={x:null,y:null},d=.3,u=[],f={};var y={init:function(e,t){window.addEventListener("keydown",function(e){f[e.keyCode]=!0},!1),window.addEventListener("keyup",function(e){delete f[e.keyCode]},!1),window.document.getElementById("game").addEventListener("click",function(e){if(f[32])console.log("x: "+e.offsetX/d,", y: "+e.offsetY/d);else if(s.x&&s.y){let n=window.document.getElementById("nameinput"),o={name:n.value,width:(e.offsetX-s.x)/d,height:(e.offsetY-s.y)/d,x:s.x/d,y:s.y/d,color:"#154880 ",obstacle:!0};t.unshift(o),u.unshift(o),console.log("added",JSON.stringify(o)),s.x=null,s.y=null,n.value=""}else s.x=e.offsetX,s.y=e.offsetY},!1),window.document.getElementById("savebutton").addEventListener("click",function(e){console.log(u)})},drawObject:function(e,t){e.fillRect(t.x*d-h.x,t.y*d-h.y,t.width*d,t.height*d)},render:function(e){for(let e=0;e<u.length;e++);}},g=[{color:"grey",height:196.66666666666669,name:"road",width:1313.3333333333335,x:2593.3333333333335,y:453.33333333333337},{name:"road-2",width:1333.3333333333335,height:176.66666666666669,x:2606.666666666667,y:1070,color:"grey"},{name:"road-connecter-1",width:83.33333333333334,height:420,x:2983.3333333333335,y:650,color:"grey"},{name:"road-connecter-2",width:83.33333333333334,height:420,x:3583.3333333333335,y:650,color:"grey"},{name:"road-to-town",width:-1680,height:198.33333333333334,x:2600,y:453.33333333333337,color:"grey"},{name:"hellojhios OK",width:-626.6666666666667,height:86.66666666666667,x:913.3333333333334,y:513.3333333333334,color:"grey"},{name:"",width:80,height:506.6666666666667,x:206.66666666666669,y:526.6666666666667,color:"grey"},{name:"",width:586.6666666666667,height:80,x:303.33333333333337,y:836.6666666666667,color:"grey"},{name:"",width:90,height:330,x:836.6666666666667,y:860,color:"grey"},{name:"",width:-556.6666666666667,height:-40,x:916.6666666666667,y:1196.6666666666667,color:"grey"},{name:"",width:493.33333333333337,height:53.333333333333336,x:336.6666666666667,y:1120,color:"grey"},{name:"",width:-536.6666666666667,height:-60,x:850,y:1180,color:"grey"},{name:"",width:43.333333333333336,height:10,x:323.33333333333337,y:1173.3333333333335,color:"grey"},{name:"road-00",width:-806.6666666666667,height:30,x:2613.3333333333335,y:1133.3333333333335,color:"grey"},{name:"makeoutpoint",width:86.66666666666667,height:63.333333333333336,x:1730,y:1113.3333333333335,color:"#154880 ",obstacle:!0},{name:"jeffreyestate",width:310,height:210,x:3570,y:223.33333333333334,color:"#cb4154",obstacle:!0},{name:"pedigoabode",width:310,height:190,x:3130,y:246.66666666666669,color:"#cb4154",obstacle:!0},{name:"gabeterrace",width:343.33333333333337,height:193.33333333333334,x:2650,y:256.6666666666667,color:"#cb4154",obstacle:!0},{name:"theslickcabin",width:96.66666666666667,height:66.66666666666667,x:3780,y:986.6666666666667,color:"#cb4154",obstacle:!0},{name:"susanscove",width:156.66666666666669,height:133.33333333333334,x:3390,y:910,color:"#cb4154",obstacle:!0},{name:"ericsloft",width:186.66666666666669,height:96.66666666666667,x:3116.666666666667,y:936.6666666666667,color:"#cb4154",obstacle:!0},{name:"jenniferscrashpad",width:316.6666666666667,height:190,x:2626.666666666667,y:863.3333333333334,color:"#cb4154",obstacle:!0},{name:"motel",width:143.33333333333334,height:96.66666666666667,x:736.6666666666667,y:403.33333333333337,color:"#154880 ",obstacle:!0},{name:"gas-station",width:103.33333333333334,height:66.66666666666667,x:606.6666666666667,y:423.33333333333337,color:"#154880 ",obstacle:!0},{name:"bar",width:183.33333333333334,height:86.66666666666667,x:393.33333333333337,y:400,color:"#154880 ",obstacle:!0},{name:"school",width:146.66666666666669,height:400,x:200,y:76.66666666666667,color:"#154880 ",obstacle:!0},{name:"cafe",width:133.33333333333334,height:83.33333333333334,x:323.33333333333337,y:736.6666666666667,color:"#154880 ",obstacle:!0},{name:"rivalcafe",width:150,height:66.66666666666667,x:493.33333333333337,y:746.6666666666667,color:"#154880 ",obstacle:!0},{name:"townhall",width:16.666666666666668,height:96.66666666666667,x:763.3333333333334,y:730,color:"#154880 ",obstacle:!0},{name:"watchtower",width:116.66666666666667,height:136.66666666666669,x:340,y:973.3333333333334,color:"#154880 ",obstacle:!0},{name:"haberdashery",width:83.33333333333334,height:86.66666666666667,x:500,y:1023.3333333333334,color:"#154880 ",obstacle:!0},{name:"generalstore",width:126.66666666666667,height:76.66666666666667,x:623.3333333333334,y:1030,color:"#154880 ",obstacle:!0},{name:"",width:256.6666666666667,height:190,x:960,y:906.6666666666667,color:"#154880 ",obstacle:!0}];const p={hitSize:20,speed:500};let m=150,w=m,b="right";const v={};var x={start:function(e,t,n){window.addEventListener("keydown",function(e){v[e.keyCode]=!0},!1),window.addEventListener("keyup",function(e){delete v[e.keyCode]},!1),e.mode="battle",p.hitSize=t,p.speed=n},update:function(e,t){v[32]&&w<e.canvas.width/2-p.hitSize/2+p.hitSize&&e.canvas.width/2-p.hitSize/2<w+5&&(alert("got it!"),v[32]=!1),"right"==b?(w+=p.speed*t)>e.canvas.width-m&&(b="left"):(w-=p.speed*t)<m&&(b="right")},render:function(e){e.fillStyle="white",e.fillRect(0,0,e.canvas.width,e.canvas.height),e.fillStyle="red",e.fillRect(e.canvas.width/2-p.hitSize/2,e.canvas.height-60,p.hitSize,30),e.fillStyle="blue",e.fillRect(w,e.canvas.height-60,5,30)}};g.push({width:50,height:50,obstacle:!0,onCollide:()=>{R.showChat=!0,R.heroPaused=!0,L.chat=[["They call me unstoppable joe because I kind"],["of have a reputation around here."],["I’ve never been beaten in a fight"],["Because I am both strong and agile."],["What’s that, punk? You don’t believe me!?"],["You think you have what it takes?"],["Hope you like delis..."],["cuz I’m about to give you a knuckle sandwich"],["extra ham"]],L.chat.onChatEnd=function(){x.start(_,20,1e3)}},x:3290,y:580,name:"unstoppable joe"});var S=document.createElement("canvas"),C=S.getContext("2d");S.width=800,S.height=380,S.id="game",document.body.appendChild(S);const k=localStorage.getItem("useMapEditor");if(k){var j=document.createElement("button");j.value="save new objects",j.id="savebutton",document.body.appendChild(j);var E=document.createElement("input");E.id="nameinput",document.body.appendChild(E)}var _={paused:!1},O={speed:256,width:40,height:40,paused:!1,x:3266.666666666667,y:483.33333333333337};O._x=O.x,O._y=O.y;var R={showChat:!1,heroPaused:!1};const L={chat:[]};var I=function(){var e,t=Date.now();e=(t-T)/1e3,"battle"!==_.mode?_.paused||(o.update(L.chat),a.update(R,O,e),r.check(O,g),localStorage.setItem("hero",JSON.stringify(O))):x.update(C,e),"true"===k?function(){C.fillStyle="black",C.fillRect(0,0,S.width,S.height),C.fillStyle="white";for(let e=0;e<g.length;e++)g[e].color&&(C.fillStyle=g[e].color),y.drawObject(C,g[e]),C.fillStyle="white";y.drawObject(C,O),y.render(C)}():function(){if("battle"!==_.mode){C.fillStyle="black",C.fillRect(0,0,S.width,S.height),l.set(C,O),C.fillStyle="white";for(let e=0;e<g.length;e++)l.drawObject(C,g[e]);l.drawObject(C,O),o.render(C,R,L.chat)}else x.render(C)}(),T=t,requestAnimationFrame(I)},M=window;requestAnimationFrame=M.requestAnimationFrame||M.webkitRequestAnimationFrame||M.msRequestAnimationFrame||M.mozRequestAnimationFrame;var T=Date.now();a.start(),o.start(L,R),k&&y.init(C,g),I()}]);