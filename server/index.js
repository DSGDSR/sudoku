import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { EVENTS } from './utils/enums.js';
import { continueGame, generateRoom, joinRoom, pauseGame, surrender } from './listeners.js';

const app = express();
//app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'localhost:8080',
    methods: ['GET', 'POST'],
  },
});

server.listen(3001, () => {
  console.log('Server listening on port 3001');
});

io.on('connection', (socket) => {
  socket.on(EVENTS.GENERATE_ROOM, () => generateRoom(socket));

  socket.on(EVENTS.JOIN_ROOM, (roomId) => joinRoom(socket, roomId));

  socket.on(EVENTS.PAUSE_GAME, () => pauseGame(socket));

  socket.on(EVENTS.CONTINUE_GAME, () => continueGame(socket));

  socket.on(EVENTS.SURRENDER, () => surrender(socket));
});

// When disconnect control
