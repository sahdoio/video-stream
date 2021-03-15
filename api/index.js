'use strict'

const express = require('express')
const app = express()
const server = require('http').Server(app);
const io = require('socket.io')(server, {
  allowEIO3: true,
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
    credentials: true
  }
});
const {
  ExpressPeerServer
} = require('peer')
const peerServer = ExpressPeerServer(server, {
  debug: true
})
const bodyParser = require('body-parser')
var cors = require('cors')

var corsOptions = {
  origin: 'http://localhost:8080',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions))

app.use(bodyParser.json())
app.disable('x-powered-by')

/**
 * Routes Area
 */
const test_routes = require('./routes/test_routes')

app.use('/', [
  test_routes
])

app.use('/peerjs', peerServer);

/**
 * Stream Area
 */

const stream = require('./services/stream_service')
stream.start('177.103.216.179:8181', '9991', 'admin', '202013js')
// stream.start('192.168.1.133', '9991', 'admin', '202013js')
// stream.start('192.168.1.140', '9992', 'admin', '202013js')

/**
 * Socket.io Area
 */

io.on('connection', socket => {
  console.log('[connection] socket.id: ', socket.id)
  socket.on('join-room', (roomId, peerId) => {
    socket.join(roomId)

    console.log('#######################################')
    console.log('[JOIN ROOM] roomId: ', roomId)
    console.log('[JOIN ROOM] peerId: ', peerId)
    console.log('#######################################')

    socket.to(roomId).broadcast.emit('peer-connected', peerId);

    // messages
    socket.on('message', (message) => {
      //send message to the same room
      io.to(roomId).emit('createMessage', message)
    });

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('peer-disconnected', peerId)
    })
  })
})

module.exports = server
