import { useEffect, useState } from 'react';
import Board from '../components/Board';
import Button from '../components/Button';
import TimeInput from '../components/TimeInput';
import { Difficulty } from '../interfaces/difficulty.enum';
import { GameStatus, GameType } from '../interfaces/game.enum';
import { GameSavedata } from '../interfaces/storage.interface';
import { deleteSudokuGame, loadSudokuGame } from '../services/storage.service';

interface AgainstTheClockProps {
  back: () => void;
}

const AgainstTheClock = ({ back }: AgainstTheClockProps) => {
  const [saveGame, setSaveGame] = useState<GameSavedata | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Easy);
  const [status, setStatus] = useState<GameStatus>(GameStatus.Waiting);
  const [timeLimit, setTimeLimit] = useState<number>(300);
  const [timeLimitStr, setTimeLimitStr] = useState<string>('05:00');

  useEffect(() => {
    const save = loadSudokuGame(GameType.AgainstTheClock);
    setSaveGame(save);
  }, []);

  const convertStrToSeconds = (timeStr: string): number => {
    const [minutes, secs] = timeStr.split(':');
    const seconds = +minutes * 60 + +secs;

    return seconds;
  };

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
          <div
            className="margin-top-large"
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <select
              className="margin-bottom-small"
              onChange={(value) =>
                setDifficulty(parseFloat(value.target.value))
              }
            >
              <option value={Difficulty.Easy}>Easy</option>
              <option value={Difficulty.Medium}>Medium</option>
              <option value={Difficulty.Hard}>Hard</option>
              <option value={Difficulty.Expert}>Expert</option>
            </select>
            <TimeInput
              value={timeLimitStr}
              onChange={(event: any) => {
                const timeStr = (event.target?.value as string).slice(0, 5);
                const time = convertStrToSeconds(timeStr);
                setTimeLimitStr(timeStr);
                setTimeLimit(time);
              }}
            />
          </div>

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
          mode={GameType.AgainstTheClock}
          sudoku={saveGame?.board}
          solution={saveGame?.solution}
          errors={saveGame?.errors}
          time={saveGame ? saveGame.time : timeLimit}
          countdown={true}
          back={back}
          onCountdownFinish={() => {
            // ToDo lose modal
            alert('time has finished :(((( cry! u bix');
            deleteSudokuGame(GameType.AgainstTheClock);
            back();
          }}
        />
      )}
    </>
  );
};

export default AgainstTheClock;
