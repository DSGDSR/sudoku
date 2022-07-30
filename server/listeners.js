import { nanoid } from 'nanoid';
import { EVENTS } from './utils/enums.js';

export const generateRoom = (socket) => {
    const roomId = nanoid(12);

    // Emit the new room id
    socket.emit(EVENTS.GENERATE_ROOM, { roomId });

    // Join the room for the create
    socket.join(roomId);
};

export const joinRoom = (socket, roomId) => {
    // Leave all rooms in case some still opened
    socket.rooms?.forEach(room => socket.leave(room));

    socket.join(roomId);
};

export const pauseGame = (socket) => {
    // We expect 1 single room for each socket conn
    const room = socket.rooms[0];

    if (room) {
      socket.to(room).broadcast(EVENTS.PAUSE_GAME)
    } else {
      // Control the error
    }
};

export const continueGame = (socket) => {
    // We expect 1 single room for each socket conn
    const room = socket.rooms[0];

    if (room) {
      socket.to(room).broadcast(EVENTS.CONTINUE_GAME)
    } else {
      // Control the error
    }
};

export const surrender = (socket) => {
    // We expect 1 single room for each socket conn
    const room = socket.rooms[0];

    if (room) {
      socket.to(room).broadcast(EVENTS.SURRENDER)
    } else {
      // Control the error
    }
};
