import { GameType } from '../interfaces/game.enum';
import { GameSavedata } from '../interfaces/storage.interface';

export const saveSudokuGame = (game: GameSavedata, mode: GameType) => {
  localStorage.setItem(`sp_${mode}_sudoku`, JSON.stringify(game));
};

export const loadSudokuGame = (mode: GameType): GameSavedata | null => {
  return JSON.parse(localStorage.getItem(`sp_${mode}_sudoku`) ?? 'null');
};

export const deleteSudokuGame = (mode: GameType) => {
  localStorage.removeItem(`sp_${mode}_sudoku`);
};
