import { ISudokuBoard } from '@algorithm.ts/sudoku';
import { Socket } from 'socket.io-client';
import { Difficulty } from '../interfaces/difficulty.enum';
import { SocketEvents } from '../interfaces/socket';

export const generateRoom = (socket: Socket, difficulty: Difficulty) => {
  socket.emit(SocketEvents.GENERATE_ROOM, difficulty);
};

export const joinRoom = (socket: Socket, roomId: string) => {
  socket.emit(SocketEvents.JOIN_ROOM, roomId);
};

export const subscribeToRoom = (
  socket: Socket,
  roomId: string,
  userId: number
) => {
  socket.emit(SocketEvents.SUBSCRIBE_TO_ROOM, roomId, userId);
};

export const updateBoard = (
  socket: Socket,
  roomId: string,
  userId: number,
  board: ISudokuBoard,
  solution: ISudokuBoard
) => {
  socket.emit(SocketEvents.UPDATE_BOARD, roomId, userId, board, solution);
};
