import { Difficulty } from '../interfaces/difficulty.enum';
import { GameStatus } from '../interfaces/game.enum';
import Stopwatch from './Stopwatch';
import './styles/BoardTopBar.css';

interface BoardTopBarProps {
  difficulty: Difficulty;
  startTime: number;
  errors: number;
  status: GameStatus;
  setBoardTime: (time: number) => void;
}

const BoardTopBar = (props: BoardTopBarProps) => {
  const { difficulty, errors, startTime, status, setBoardTime } = props;

  return (
    <div className="board-top-bar">
      <span className="board-top-bar__difficulty">
        {Difficulty[difficulty]}
      </span>

      <div className="board-top-bar__right">
        <span className="board-top-bar__stopwatch">
          <Stopwatch
            running={status === GameStatus.InProgress}
            startTime={startTime}
            setBoardTime={setBoardTime}
          />
        </span>
        <span className="board-top-bar__errors">
          Mistakes:{' '}
          <span
            className={`board-top-bar__errors__count ${
              errors >= 3 ? 'fail' : ''
            }`}
          >
            {errors}/3
          </span>
        </span>
      </div>
    </div>
  );
};

export default BoardTopBar;
