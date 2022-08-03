export const countCells = (number, board, solution) => {
  let count = 0;
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] === number) {
        count++;
      } else {
        if (solution[i][j] !== board[i][j]) {
          count++;
        }
      }
    }
  }
  return count;
};

export const calculatePercentage = (missingCells, cellsToComplete) => {
  const percent = 100 - Math.round((missingCells / cellsToComplete) * 100, 0);

  return percent > 0 && percent < 100 ? percent : 0;
};
