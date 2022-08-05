import { ISudokuBoard } from '@algorithm.ts/sudoku';

export const validateNumber = (num: number): boolean => {
  return num >= 1 && num <= 9;
};

export const validateGame = (
  sudoku: ISudokuBoard,
  solution: ISudokuBoard
): boolean => {
  const hasWrongValues =
    sudoku.filter((row, r) => {
      return (
        row.filter((num, c) => {
          return num !== solution[r][c];
        }).length > 0
      );
    }).length > 0;

  return !hasWrongValues;
};
