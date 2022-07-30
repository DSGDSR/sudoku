import { useEffect, useState } from 'react';
import { connect, io } from 'socket.io-client';
import Board from '../components/Board';
import Button from '../components/Button';
import { Difficulty } from '../interfaces/difficulty.enum';
import { GameStatus, GameType } from '../interfaces/game.enum';
import { SocketEvents } from '../interfaces/socket.enum';
import { GameSavedata } from '../interfaces/storage.interface';
import { loadSudokuGame } from '../services/storage.service';

interface VersusGameProps {
  back: () => void;
}

const VersusGame = ({ back }: VersusGameProps) => {
  const [saveGame, setSaveGame] = useState<GameSavedata | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Easy);
  const [status, setStatus] = useState<GameStatus>(GameStatus.Waiting);

  useEffect(() => {
    const conn = connect('http://localhost:3001', { transports: ['websocket', 'polling', 'flashsocket'] });
    conn.on(SocketEvents.GENERATE_ROOM, (room) => console.log(room))
    conn.emit(SocketEvents.GENERATE_ROOM);
    const save = loadSudokuGame(GameType.Multiplayer);
    setSaveGame(save);
  }, []);

  return (
    <>
      {status !== GameStatus.InProgress && (
        <>
          {saveGame && (
            <div>
              <Button
                style={{ width: '100%' }}
                className="btn-primary"
                onClick={() => {
                  setDifficulty(difficulty);
                  setStatus(GameStatus.InProgress);
                }}
                text="Continue game"
              />
            </div>
          )}
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
                setStatus(GameStatus.InProgress);
              }}
              text="Start new game"
            />
          </div>
        </>
      )}
      {status === GameStatus.InProgress && (
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
        />
      )}
    </>
  );
};

export default VersusGame;
