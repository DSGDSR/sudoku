import { nanoid } from 'nanoid';
import { EVENTS } from './utils/enums.js';
import r from 'rethinkdb';
import { calculatePercentage, countCells } from './utils/sudoku.js';
import { SudokuCreator } from '@algorithm.ts/sudoku';

export const generateRoom = (socket, db, difficulty) => {
  const roomId = nanoid(12);

  const creator = new SudokuCreator({ childMatrixSize: 3 });
  const { puzzle: board, solution } = creator.createSudoku(difficulty);
  const cellsToComplete = countCells(-1, board, solution);

  // TODO Control rror
  r.table('games')
    .insert({
      _id: roomId,
      board,
      solution,
      cellsToComplete,
      missingCells_0: 999,
      missingCells_1: 999,
    })
    .run(db)
    .then(() => {
      console.log('Room created');
      // Emit the new room id
      socket.emit(EVENTS.GENERATE_ROOM, roomId, board, solution);
    })
    .catch((err) => {
      // TODO Control error
      console.log(err);
    });
};

export const updateBoard = (socket, db, roomId, user, board, solution) => {
  const missingCells = countCells(-1, board, solution);

  r.table('games')
    .filter((row) => row('_id').eq(roomId))
    .update({
      [`missingCells_${user}`]: missingCells,
    })
    .run(db)
    .then(() => {
      console.log(`Board updated`);
    })
    .catch((err) => {
      // TODO Control error
      console.log(err);
    });
};

export const joinRoom = (socket, db, roomId) => {
  // TODO Control rror
  r.table('games')
    .filter((row) => row('_id').eq(roomId))
    .run(db)
    .then((room) => {
      room.next((err, room) => {
        if (err) {
          // TODO Control error
          console.log(err);
        } else {
          console.log('Room joined ', room._id);
          // Emit the new room id
          socket.emit(EVENTS.JOIN_ROOM, room);
        }
      });
    })
    .catch((err) => {
      // TODO Control error
      console.log(err);
    });
};

export const subscribeToRoom = (socket, db, roomId, user) => {
  console.log(`Room ${roomId} subscribed `, user);

  r.table('games')
    .filter((row) => row('_id').eq(roomId))
    .changes()
    .run(db)
    .then((cursor) => {
      cursor.each((err, row) => {
        console.log('Board changed, user ', user);
        const enemyMissing = `missingCells_${user === 0 ? 1 : 0}`;

        if (err) {
          // TODO Control error
          console.log(err);
        } else if (row.new_val[`missingCells_${user}`] === 0) {
          socket.emit(EVENTS.USER_WIN, user);
        } else if (row.new_val[enemyMissing] === 0) {
          socket.emit(EVENTS.USER_WIN, user === 0 ? 1 : 0);
        } else {
          const cellsToComplete = row.new_val[`cellsToComplete`];
          const enemyMissingCells = row.new_val[enemyMissing];
          const missingCells = row.new_val[`missingCells_${user}`];

          const enemyPercentage = calculatePercentage(
            enemyMissingCells,
            cellsToComplete
          );
          const myPercentage = calculatePercentage(
            missingCells,
            cellsToComplete
          );

          socket.emit(EVENTS.ROOM_UPDATED, [myPercentage, enemyPercentage]);
        }
      });
    })
    .catch((err) => {
      // TODO Control error
      console.log(err);
    });
};

export const pauseGame = (socket) => {
  // We expect 1 single room for each socket conn
  const room = socket.rooms[0];

  if (room) {
    socket.to(room).broadcast(EVENTS.PAUSE_GAME);
  } else {
    // Control the error
  }
};

export const continueGame = (socket) => {
  // We expect 1 single room for each socket conn
  const room = socket.rooms[0];

  if (room) {
    socket.to(room).broadcast(EVENTS.CONTINUE_GAME);
  } else {
    // Control the error
  }
};

export const surrender = (socket) => {
  // We expect 1 single room for each socket conn
  const room = socket.rooms[0];

  if (room) {
    socket.to(room).broadcast(EVENTS.SURRENDER);
  } else {
    // Control the error
  }
};
