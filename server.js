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
import bcrypt from 'bcryptjs'

import User from "./db/User.js"
import GameSave from "./db/GameSave.js"

import nodemailer from 'nodemailer';

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  host: 'smtp.mail.yahoo.com',
  port: 465,
  service:'yahoo',
  secure: false,
  auth: {
    user: 'homemadearcade@yahoo.com', // generated ethereal user
    pass: 'wvycuhsnwofztmeo', // generated ethereal password
  },
  debug: false,
  logger: true,
});

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

global.gameSaveCache = null

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

if(process.env.ISHOST === 'true') {
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
  console.log('but somehow now..')
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

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
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


app.post('/gameSave', (req,res)=>{
   let q;
    q = [
      { $match: { _id: mongoose.Types.ObjectId(req.body.gameSaveId) } },
      // {
      //   $lookup: {
      //     from: "users",
      //     localField: "author",
      //     foreignField: "_id",
      //     as: "author"
      //   }
      // },
      {
        $project: {
          author: 1,
          data: 1,
          createdAt: 1,
        },
      },
    ];

    GameSave.findOne({ _id: mongoose.Types.ObjectId(req.body.gameSaveId) })
      .select("data author")
      .then((gameSave) => {
        res.status(200).json({ gameSave: gameSave.data, authorUserId: gameSave.author })
      });
})


// function getUserData(req, res, next) {
//   console.log(req.path)
//   next()
// };
//
// app.use(getUserData)

// PUT URL
app.post('/updateGameOnServerOnly', (req,res)=>{
  let prevGame = currentGame
  global.currentGame = req.body.game
  global.currentGame.grid = prevGame.grid
  res.send()
});


app.post('/addGameSave', (req, res) => {

  global.gameSaveCache = null

  new GameSave({
    author: req.body.userData._id,
    data: req.body.gameSave
  })
    .save()
    .then(gameSave => {
      res.status(200).json({ gameSaveId: gameSave._id });
    })
    .catch(err => {
      console.log(err);
      res.status(400).json({ message: err.message });
    });
})

let allGames = {}
app.get('/gameSaves', (req,res)=>{
  // let query;

  if(global.gameSaveCache) {
    res.status(200).json({ gameSaves: global.gameSaveCache });
    return
  }
   //
   // query = {
   //   $match: { author: mongoose.Types.ObjectId(req.userData.userId) },
   // };
   GameSave.aggregate([
     { $sort: { createdAt: -1 } },
     { $limit: 10000 },
   ])
     .then(gameSaves => {

       allGames = gameSaves
       let gameIdMap = {}
       gameSaves = gameSaves.map((gs) => {
         gs.data = JSON.parse(gs.data)
         return gs
       }).filter((gs) => {
         if(gameIdMap[gs.data.id]) return null
         gameIdMap[gs.data.id] = true
         return true
       })

       global.gameSaveCache = gameSaves


       res.status(200).json({ gameSaves });
     })
     .catch(err => {
       console.log(err);
       res.status(400).json({ message: err.message });
     });
})


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
  // socket.user = { email: 'pedigojon@gmail.com'}
  // callback(null, socket.user)
  // return
  const { email, password, signup, forgotPassword, resetPassword, token } = data

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

    // sign up
    if (signup) {

      bcrypt.hash(password, 10, async (err, hash) => {
        try {
          const username = data.firstname + ' ' + data.lastname
          const user = await User.create({
            firstName: data.firstname,
            lastName: data.lastname,
            username: username,
            email,
            password: hash
           })
          socket.user = user
          return callback(null, !!user)
        } catch (e){
          console.log(e)
          socket.emit('auth_message', { message: 'Authentication error. Email probably already exists'})
          callback(null)
        }
      })
      return
    }

    if(resetPassword) {
      const user = jwt.decode(token, process.env.JWT_KEY)
      if(password) {
        bcrypt.hash(password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({ message: err });
          } else {
            User.findOneAndUpdate({ email: user.email }, { password: hash })
              .then(() => {
                socket.emit('auth_message',  { message: 'Password has been reset'})
              })
              .catch((err) => {
                console.log(err.message);
                socket.emit('auth_message',  { message: 'Error'})
              });
          }
        });
      }

      return
    }

    if(forgotPassword) {
      User.findOne({ email: email })
        .select("email username")
        .then(async (user) => {
          if (user) {

            try {

              const { email } = user

              const token = jwt.sign(
                {
                  email
                },
                process.env.JWT_KEY,
                {
                  expiresIn: "10m",
                }
              );
              // send mail with defined transport object
              let info = await transporter.sendMail({
                from: '"Homemade Arcade - DONOTREPLY" <homemadearcade@yahoo.com>', // sender address
                to: email, // list of receivers
                subject: "Forgot Password", // Subject line
                html: "Go to this link to reset password: ha-game.herokuapp.com/?resetPasswordToken=" + token, // html body
              });

              return socket.emit('auth_message', { message: 'Email sent'})

            } catch(e) {
              console.log(e)
            }


          }
        }).catch((err) => {
          console.log(err)
          return socket.emit('auth_message', { message: 'No such email'})
        })
        return
    }

    // login
    const user = await User.findOne({ email })
    if (!user) {
      socket.emit('auth_message', { message: 'No such email and password combination'})
      return
    }

    bcrypt.compare(password, user.password, (err, result) => {
      if(err) {
        console.log(err)
        socket.emit('auth_message',  { message: 'Authentication Error 1'})
        return
      }

      if(!result) {
        socket.emit('auth_message',  { message: 'No such email and password combination'})
        return
      }

      socket.user = user
      return callback(null, user)
    });
    // if(user.validPassword(password)) {
    //
    // }

    // error handling
    // socket.emit('auth_message',  { message: 'No such email and password combination'})
  } catch (error) {
    socket.emit('auth_message', { message: 'Authentication Error 2'})
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
