import { ISudokuBoard } from '@algorithm.ts/sudoku';
import { Difficulty } from './difficulty.enum';

export interface GameSavedata {
  board: ISudokuBoard;
  solution: ISudokuBoard;
  errors: number;
  time: number;
  difficulty: Difficulty;

  // Versus
  roomId?: string;
  userId?: 0 | 1;
}
