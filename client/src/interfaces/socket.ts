import { Socket } from 'socket.io-client';

export enum SocketEvents {
  GENERATE_ROOM = 'generate_room',
  JOIN_ROOM = 'join_room',
  SUBSCRIBE_TO_ROOM = 'subscribe_to_room',
  ROOM_UPDATED = 'room_updated',
  UPDATE_BOARD = 'update_board',
  PAUSE_GAME = 'pause_game',
  CONTINUE_GAME = 'continue_game',
  USER_WIN = 'user_win',
  SURRENDER = 'surrender',
}

export interface SocketInterface {
  socket: Socket;
}
