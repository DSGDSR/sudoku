import { ISudokuBoard } from '@algorithm.ts/sudoku';
import { useEffect, useState } from 'react';
import Board from '../components/Board';
import Button from '../components/Button';
import ProgressBar from '../components/ProgressBar';
import { Difficulty } from '../interfaces/difficulty.enum';
import { GameStatus, GameType } from '../interfaces/game.enum';
import { SocketEvents, SocketInterface } from '../interfaces/socket';
import { GameSavedata } from '../interfaces/storage.interface';
import {
  generateRoom,
  joinRoom,
  subscribeToRoom,
  updateBoard,
} from '../services/api.service';
import { loadSudokuGame, saveSudokuGame } from '../services/storage.service';

interface VersusGameProps extends SocketInterface {
  back: () => void;
  urlParams: URLSearchParams;
}

const VersusGame = ({ back, socket, urlParams }: VersusGameProps) => {
  const [saveGame, setSaveGame] = useState<GameSavedata | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Easy);
  const [room, setRoom] = useState<string | null>(null);
  const [status, setStatus] = useState<GameStatus>(GameStatus.Waiting);
  const [percentage, setPercentage] = useState<[number, number]>([0, 0]);

  const joinRoomCallback = (roomObj: any) => {
    const game: GameSavedata = {
      board: roomObj.board,
      difficulty,
      errors: 0,
      time: 0,
      solution: roomObj.solution,
      roomId: roomObj._id,
      userId: 1,
    };
    saveSudokuGame(game, GameType.Multiplayer);
    setSaveGame(game);
    setStatus(GameStatus.WaitingVersus);
    subscribeToRoom(socket, roomObj._id, 1);
  };

  const createRoomCallback = (
    roomId: string,
    board: ISudokuBoard,
    solution: ISudokuBoard
  ) => {
    const game: GameSavedata = {
      board,
      difficulty,
      errors: 0,
      time: 0,
      solution,
      roomId,
      userId: 0,
    };
    setRoom(roomId);
    saveSudokuGame(game, GameType.Multiplayer);
    setSaveGame(game);
    setStatus(GameStatus.WaitingVersus);
    subscribeToRoom(socket, roomId, 0);
  };

  useEffect(() => {
    const save = loadSudokuGame(GameType.Multiplayer);
    setSaveGame(save);
  }, []);

  useEffect(() => {
    const r = urlParams?.get('r');
    if (r) {
      joinRoom(socket, r);
    }
  }, [urlParams]);

  useEffect(() => {
    if (socket) {
      socket.on(SocketEvents.GENERATE_ROOM, createRoomCallback);
      socket.on(SocketEvents.JOIN_ROOM, joinRoomCallback);
      socket.on(SocketEvents.ROOM_UPDATED, setPercentage);
      socket.on(SocketEvents.USER_WIN, alert);

      return () => {
        socket.off(SocketEvents.GENERATE_ROOM, createRoomCallback);
        socket.off(SocketEvents.JOIN_ROOM, joinRoomCallback);
        socket.off(SocketEvents.ROOM_UPDATED, setPercentage);
        socket.off(SocketEvents.USER_WIN, alert);
      };
    } else {
      // TODO control and back
      console.error('Socket not initialized');
      back();
    }
  }, [socket]);

  const onBoardChange = (
    sudoku: ISudokuBoard,
    solution: ISudokuBoard,
    x: number,
    y: number
  ) => {
    if (saveGame?.roomId && typeof saveGame?.userId === 'number') {
      updateBoard(socket, saveGame.roomId, saveGame.userId, sudoku, solution);
    }
  };

  return (
    <>
      {status !== GameStatus.InProgress && status !== GameStatus.WaitingVersus && (
        <>
          <input
            type={'text'}
            placeholder={'Room ID'}
            onChange={(value) => setRoom(value.target.value)}
          />
          <div className="margin-top-small margin-bottom-medium">
            <Button
              style={{ width: '100%' }}
              onClick={() => {
                if (room) {
                  joinRoom(socket, room);
                }
              }}
              text="Join game"
            />
          </div>

          <select
            className="margin-top-large"
            onChange={(value) => setDifficulty(parseFloat(value.target.value))}
          >
            <option value={Difficulty.Easy}>Easy</option>
            <option value={Difficulty.Medium}>Medium</option>
            <option value={Difficulty.Hard}>Hard</option>
            <option value={Difficulty.Expert}>Expert</option>
          </select>

          <div className="buttons margin-top-small">
            <Button onClick={() => back()} text="Back to main menu" />
            <Button
              className="margin-left-large"
              onClick={() => {
                setDifficulty(difficulty);
                setSaveGame(null);
                generateRoom(socket, difficulty);
              }}
              text="Create game"
            />
          </div>
        </>
      )}
      {status === GameStatus.InProgress ||
        (status === GameStatus.WaitingVersus && (
          <>
            {room}
            <ProgressBar percentages={percentage} />
            <Board
              difficulty={difficulty}
              status={status}
              changeStatus={setStatus}
              mode={GameType.Individual}
              sudoku={saveGame?.board}
              solution={saveGame?.solution}
              errors={saveGame?.errors}
              time={saveGame?.time}
              back={back}
              onChange={onBoardChange}
            />
          </>
        ))}
    </>
  );
};

export default VersusGame;
