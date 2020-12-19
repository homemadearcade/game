import express from 'express'
import fs from 'fs';
import socketEvents from './sockets.js'
import http from 'http';
import socketIO from 'socket.io';
import path from 'path';
import aws from './aws.js';
import cors from 'cors';
import socketioAuth from "socketio-auth";
import jwt from 'jsonwebtoken'
import cookie from 'cookie'
import dotenv from 'dotenv'; // Loading dotenv to have access to env variables
// Connect to the Database
import mongoose from "mongoose"
import bluebird from 'bluebird'

import User from "./db/User.js"

// import winston from 'winston';
//
// const logger = winston.createLogger({
//   level: 'info',
//   format: winston.format.json(),
//   defaultMeta: { service: 'user-service' },
//   transports: [
//     //
//     // - Write all logs with level `error` and below to `error.log`
//     // - Write all logs with level `info` and below to `combined.log`
//     //
//     new winston.transports.File({ filename: 'error.log', level: 'error' }),
//     new winston.transports.File({ filename: 'combined.log' }),
//   ],
// });
//
// //
// // If we're not in production then log to the `console` with the format:
// // `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
// //
// if (process.env.NODE_ENV !== 'production') {
//   logger.add(new winston.transports.Console({
//     format: winston.format.simple(),
//   }));
// }
//
// var logger_info_old = logger.info;
// logger.info = function(msg) {
//   var fileAndLine = traceCaller(1);
//   return logger_info_old.call(this, fileAndLine + ":" + msg);
// }
//
// /**
// * examines the call stack and returns a string indicating
// * the file and line number of the n'th previous ancestor call.
// * this works in chrome, and should work in nodejs as well.
// *
// * @param n : int (default: n=1) - the number of calls to trace up the
// *   stack from the current call.  `n=0` gives you your current file/line.
// *  `n=1` gives the file/line that called you.
// */
// function traceCaller(n) {
//   let b
//   if( isNaN(n) || n<0) n=1;
//   n+=1;
//   var s = (new Error()).stack
//     , a=s.indexOf('\n',5);
//   while(n--) {
//     a=s.indexOf('\n',a+1);
//     if( a<0 ) { a=s.lastIndexOf('\n',s.length); break;}
//   }
//   b=s.indexOf('\n',a+1); if( b<0 ) b=s.length;
//   a=Math.max(s.lastIndexOf(' ',b), s.lastIndexOf('/',b));
//   b=s.lastIndexOf(':',b);
//   s=s.substring(a+1,b);
//   return s;
// }
//
// console.log = function(data1, data2, data3, data4) {
//   logger.info(data1, data2, data3, data4);
// }

mongoose.Promise = bluebird

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const server = http.Server(app)
const io = socketIO(server)

dotenv.config()

global.window = {}; // Temporarily define window for server-side
import LocalStorage from 'node-localstorage'
global.localStorage = new LocalStorage.LocalStorage('./scratch');

import './server/clientSideEventMock.js'
import './client/src/js/game/index.js'
import './client/src/js/editorUI/editor.js'
import './client/src/js/physics/index.js'
import './client/src/js/utils/utils.js'
import './client/src/js/page/loop.js'
import './server/index.js'

if(process.env.ISHOST) {
  global.PAGE = {
    role: {
      isHost: true,
      isAdmin: true,
    },
    establishRoleFromQueryAndHero: () => {},
    logRole: () => {
      console.log(global.PAGE.role)
    },
    closeLog: () => {

    }
  }
  global.constellationDistance = 4000

  //BS FOR CLIENT CRAP
  global.MAP = {
    camera: {
      setLimit: () => {},
      clearLimit: () => {}
    },
    popoverInstances: [],
    closePopover: () => {}
  },

  global.PIXIMAP = {
    deleteObject: () => {}
  }
  global.CONSTRUCTEDITOR = {}
  global.PATHEDITOR = {}

  global.popoverOpen = {},
  global.user = {
    isServer: true,
    firstName: "Server",
    lastName: "McServer",
  }
  global.addEventListener = () => {}
  global.removeEventListener = () => {}

  global.local.emit('onPageLoaded')
  global.local.emit('onPlayerIdentified')
  global.socket = {
    emit: (eventName, arg1, arg2, arg3, arg4, arg5, arg6) => {
      global.local.emit(eventName, arg1, arg2, arg3, arg4, arg5, arg6)
    },
    on: (eventName, arg1, arg2, arg3, arg4, arg5, arg6) => {
      global.local.on(eventName, arg1, arg2, arg3, arg4, arg5, arg6)
    }
  }

  socketEvents(fs,
    {
      emit: (eventName, arg1, arg2, arg3, arg4, arg5, arg6) => {
        global.local.emit(eventName, arg1, arg2, arg3, arg4, arg5, arg6)
        io.emit(eventName, arg1, arg2, arg3, arg4, arg5, arg6)
      },
      on: (eventName, arg1, arg2, arg3, arg4, arg5, arg6) => {
        io.on(eventName, arg1, arg2, arg3, arg4, arg5, arg6)
      }
    },
    global.local
  )

  global.isServerHost = true

  console.log(global.modLibrary)
}

const mongoOpts = {
  useNewUrlParser: true,
  keepAlive: 1, connectTimeoutMS: 30000,
}
const mongoUrl = process.env.DATABASE
mongoose
  .connect(mongoUrl, mongoOpts)
  .catch(e => console.log(e))

app.use((req, res, next) => {
  // console.log(req)
  next()
})

app.use(express.json());
app.use(cors());

// GET URL
app.get('/generate-get-url', (req, res) => {
  // Both Key and ContentType are defined in the client side.
  // Key refers to the remote name of the file.
  const { Key } = req.query;
  aws.generateGetUrl(Key)
    .then(url => {
      res.send(url);
    })
    .catch(err => {
      res.send(err);
    });
});

// PUT URL
app.get('/generate-put-url', (req,res)=>{
  // Both Key and ContentType are defined in the client side.
  // Key refers to the remote name of the file.
  // ContentType refers to the MIME content type, in this case image/jpeg
  const { Key, ContentType } =  req.query;
  aws.generatePutUrl(Key, ContentType).then(url => {
    res.send({url});
  })
  .catch(err => {
    res.send(err);
  });
});


app.get('/game', (req,res)=>{
  const { gameId } =  req.query;
  fs.readFile('data/game/' +gameId+'.json', 'utf8', function readFileCallback(err, data){
    if (err){
      res.send(err);
    } else {
      let game = JSON.parse(data);
      res.send({game})
    }
  });
});

app.get('/gamesmetadata', (req,res)=>{
  const { gameId } =  req.query;
  fs.readdir('data/game/', (err, files) => {
    const games = []
    files.filter((name) => name.indexOf('.json') >=0).forEach((gameId) => {
      const game = JSON.parse(fs.readFileSync('data/game/' +gameId, 'utf8'))

      games.push({
        id: game.id,
        metadata: game.metadata
      })
    })
    res.send({games})
  });
});

function getSpriteSheet(id, cb) {
  const data = fs.readFileSync('./data/sprite/' +id+'.json', 'utf8')
  return JSON.parse(data)
}

function getAudioData(id, cb) {
  const data = fs.readFileSync('./data/audio/' +id+'.json', 'utf8')
  return JSON.parse(data)
}


app.get('/spriteSheets', (req,res)=>{
  const { spriteSheetIds } =  req.query;

  const sss = []
  spriteSheetIds.forEach((id) => {
    sss.push(getSpriteSheet(id))
  })

  res.send({spriteSheets: sss})
})

app.get('/audioData', (req,res)=>{
  res.send({
    retro: getAudioData('retro'),
    UI: getAudioData('UI'),
    moving: getAudioData('moving'),
  })
})

app.use(express.static(__dirname + '/dist'))

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/dist/index.html')
})

server.listen(process.env.PORT || 4000, function(){
  console.log('listening on *:' + (process.env.PORT || 4000));
});


// Authenticate!
const authenticate = async (socket, data, callback) => {
  const { email, password, signup } = data

  try {
    // session
    if (socket.handshake.headers.cookie){
      const cookieUser = cookie.parse(socket.handshake.headers.cookie).user
      if (cookieUser) {
        const email = jwt.decode(cookieUser, process.env.JWT_KEY)
        if(email){
          const user = await User.findOne({ email })
          if (!user) {
            socket.emit('auth_message', { message: 'No such email and password combination'})
          } else {
            socket.user = user
            return callback(null, !!user)
          }
        }
      }
    }

    // // sign up
    // if (signup) {
    //   const user = await User.create({ email, password })
    //   socket.user = user
    //   return callback(null, !!user)
    // }

    // login
    const user = await User.findOne({ email })
    if (!user) {
      socket.emit('auth_message', { message: 'No such email and password combination'})
      return
    }
    if(user.validPassword(password)) {
      socket.user = user
      return callback(null, user)
    }

    // error handling
    socket.emit('auth_message',  { message: 'No such email and password combination'})
  } catch (error) {
    socket.emit('auth_message', { message: 'Authentication error. Email probably already exists'})
    console.log(error)
    callback(error)
  }
}

const postAuthenticate = socket => {
  socket.emit('authenticated', {cookie: jwt.sign(socket.user.email, process.env.JWT_KEY), user: socket.user})
  socketEvents(fs, { emit: (eventName, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) => {
    if(global.isServerHost) {
      global.local.emit(eventName, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8)
    }
    io.emit(eventName, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8)
  }}, socket)
}

// Configure Authentication
socketioAuth(io, { authenticate, postAuthenticate, timeout: "none" })
