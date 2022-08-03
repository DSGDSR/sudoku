import { Server } from 'socket.io';
import { EVENTS } from './utils/enums.js';
import {
  continueGame,
  generateRoom,
  subscribeToRoom,
  pauseGame,
  surrender,
  updateBoard,
  joinRoom,
} from './listeners.js';
import r from 'rethinkdb';

const port = process.env.PORT || 8090;
// TODO cors
const io = new Server(port);

r.connect({
  host: 'localhost',
  port: 28015,
  db: 'sudoku',
})
  .then((db) => {
    io.on('connection', (client) => {
      client.on(EVENTS.GENERATE_ROOM, (difficulty) =>
        generateRoom(client, db, difficulty)
      );

      client.on(EVENTS.JOIN_ROOM, (roomId) => joinRoom(client, db, roomId));

      client.on(EVENTS.SUBSCRIBE_TO_ROOM, (roomId, userId) =>
        subscribeToRoom(client, db, roomId, userId)
      );

      client.on(EVENTS.UPDATE_BOARD, (roomId, userId, board, solution) =>
        updateBoard(client, db, roomId, userId, board, solution)
      );

      client.on(EVENTS.PAUSE_GAME, () => pauseGame(client));

      client.on(EVENTS.CONTINUE_GAME, () => continueGame(client));

      client.on(EVENTS.SURRENDER, () => surrender(client));
    });
  })
  .catch((err) => {
    console.log(err);
  });

// When disconnect control

console.log(`Server listening on port ${port}`);
