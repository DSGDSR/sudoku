import { ISudokuBoard, SudokuCreator } from '@algorithm.ts/sudoku';
import { useEffect, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { Difficulty } from '../interfaces/difficulty.enum';
import { GameStatus, GameType } from '../interfaces/game.enum';
import { saveSudokuGame } from '../services/storage.service';
import { validateGame } from '../utils/validators';
import BoardTopBar from './BoardTopBar';
import Button, { ButtonSizes } from './Button';
import Cell from './Cell';
import NumberInputRow from './NumberInputRow';
import './styles/Board.css';

interface BoardProps {
  difficulty: Difficulty;
  status: GameStatus;
  mode: GameType;
  sudoku?: ISudokuBoard;
  solution?: ISudokuBoard;
  errors?: number;
  time?: number;
  changeStatus: (status: GameStatus) => void;
  back: () => void;
}

const Board = (props: BoardProps) => {
  const { difficulty, status, mode, changeStatus, back } = props;

  const [sudoku, setSudoku] = useState<ISudokuBoard>(props.sudoku ?? []);
  const [solution, setSolution] = useState<ISudokuBoard>(props.solution ?? []);
  const [errors, setErrors] = useState<number>(props.errors ?? 0);
  const [time, setTime] = useState<number>(props.time ?? 0);

  const [selectedCell, setSelectedCell] = useState<[number, number]>([-1, -1]);
  const [selectedNumber, setSelectedNumber] = useState<number>(-2);

  useEffect(() => {
    if (status === GameStatus.InProgress) generateSudoku();
    if (status === GameStatus.Finished) cleanSudoku();
  }, [difficulty, status]);

  const cleanSudoku = () => {
    setSudoku([]);
    setErrors(0);
    setSelectedCell([-1, -1]);
    setSelectedNumber(-2);
    setSolution([]);
  };

  const generateSudoku = () => {
    if (sudoku.length) {
      return;
    }

    // todo save start
    cleanSudoku();
    const creator = new SudokuCreator({ childMatrixSize: 3 });
    const { puzzle, solution } = creator.createSudoku(difficulty);
    setSudoku(puzzle);
    setSolution(solution);
  };

  const backToMenu = () => {
    saveGame();
    back();
  };

  const hasSudokuStarted = () => !!sudoku.length;

  const onSelect = (x: number, y: number) => {
    setSelectedCell([y, x]);
    setSelectedNumber(sudoku[y][x]);
  };

  const checkError = (input: number): boolean => {
    const numSolution = solution[selectedCell[0]][selectedCell[1]];

    if (numSolution !== input) {
      setErrors((errors) => {
        return errors + 1;
      });
      if (errors >= 2) {
        cleanSudoku();
        alert('You lost');
        changeStatus(GameStatus.Finished);
      }

      return true;
    }

    return false;
  };

  const saveGame = (err = false) => {
    saveSudokuGame(
      {
        board: sudoku,
        solution,
        errors: err ? errors + 1 : errors,
        time,
        difficulty,
      },
      mode
    );
  };

  const enterValue = (input: number | string): void => {
    if (
      sudoku[selectedCell[0]][selectedCell[1]] !==
      solution[selectedCell[0]][selectedCell[1]]
    ) {
      const number = +input - 1;
      const newBoard: ISudokuBoard = [...sudoku];
      const isError = checkError(number);
      newBoard[selectedCell[0]][selectedCell[1]] = number;
      setSudoku(newBoard);
      setSelectedNumber(number);
      saveGame(isError);

      if (validateGame(newBoard, solution)) {
        alert('You win!');
        changeStatus(GameStatus.Finished);
        cleanSudoku();
        // TODO delete game from storage
      }
    }
  };

  const arrowNavigation = (event: KeyboardEvent) => {
    const newSelectedCell: [number, number] = [
      selectedCell[0],
      selectedCell[1],
    ];

    const arrowActions: { [key: string]: () => void } = {
      ArrowDown: () =>
        (newSelectedCell[0] =
          selectedCell[0] + 1 > 8 ? 0 : selectedCell[0] + 1),
      ArrowUp: () =>
        (newSelectedCell[0] =
          selectedCell[0] - 1 < 0 ? 8 : selectedCell[0] - 1),
      ArrowLeft: () =>
        (newSelectedCell[1] =
          selectedCell[1] - 1 < 0 ? 8 : selectedCell[1] - 1),
      ArrowRight: () =>
        (newSelectedCell[1] =
          selectedCell[1] + 1 > 8 ? 0 : selectedCell[1] + 1),
    };

    arrowActions[event.key]();
    onSelect(newSelectedCell[1], newSelectedCell[0]);
  };

  useHotkeys(
    'Up, Left, Right, Down',
    arrowNavigation,
    { enabled: hasSudokuStarted() },
    [selectedCell, sudoku]
  );

  useHotkeys(
    '1,2,3,4,5,6,7,8,9',
    (event) => enterValue(event.key),
    { enabled: hasSudokuStarted() },
    [sudoku, solution, selectedCell, errors, time]
  );

  return !!sudoku?.length ? (
    <>
      <div className="board-container">
        <div className="board-top-buttons">
          <Button
            text="Back to main menu"
            onClick={backToMenu}
            size={ButtonSizes.Small}
          />
        </div>
        <BoardTopBar
          difficulty={difficulty}
          errors={errors}
          status={status}
          startTime={time}
          setBoardTime={setTime}
        />
        <div className="sudoku-board">
          {sudoku.map((row, rowIndex) => (
            <div className="sudoku-board__row" key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <Cell
                  key={`${rowIndex}-${cellIndex}`}
                  number={cell}
                  error={solution[rowIndex][cellIndex] !== cell}
                  highlight={selectedNumber >= 0 && selectedNumber == cell}
                  selected={
                    selectedCell[0] == rowIndex && selectedCell[1] == cellIndex
                  }
                  x={cellIndex}
                  y={rowIndex}
                  onSelect={onSelect}
                />
              ))}
            </div>
          ))}
        </div>
        <NumberInputRow onNumberPress={enterValue} />
      </div>
    </>
  ) : (
    <></>
  );
};

export default Board;
