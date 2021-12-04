const fs = require('fs');

const input = fs.readFileSync(__dirname + '/inputs/04.input', 'utf8').trim().split('\n\n');

const numbers = (input.shift()).split(',');

const boards = input.map((boardString) => 
  boardString.trim().split('\n').map((row) => 
    row.trim().split(/\ +/)));

const played = Array.from(boards, (board) => 
  board.map((row) => 
    row.map((number) => 0)));

const numberToCoordinateMaps = boards.map((board) => {
  const numberToCoordinates = {};

  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      numberToCoordinates[board[row][col]] = {row, col};
    }
  }

  return numberToCoordinates;
});

function isWinningBoard(board) {
  for (let row = 0; row < board.length; row++) {
    if (!board[row].includes(0)) return true;
  }

  for (let col = 0; col < board[0].length; col++) {
    let isWin = true

    for (let row = 0; row < board.length; row++) {
      isWin = board[row][col] && isWin;
    }

    if (isWin) return true;
  }

  return false;
}

function calculateScore(playedSquares, squareValues, numberPlayed) {
  let sum = 0;
  for (let row = 0; row < playedSquares.length; row++) {
    for (let col = 0; col < playedSquares.length; col++) {
      if (!playedSquares[row][col]) sum += Number(squareValues[row][col]);
    }
  }

  return sum * numberPlayed;
}

const inPlay = new Set(boards.keys());
let firstWin = true;

for (const number of numbers) {
  for (let i = 0; i < boards.length; i++) {
    if (!numberToCoordinateMaps[i].hasOwnProperty(number)) continue;

    const {row, col} = numberToCoordinateMaps[i][number];
    played[i][row][col] = 1;

    if (!inPlay.has(i) || !isWinningBoard(played[i])) continue;

    if (firstWin) {
      console.log(`The first winning score is: ${calculateScore(played[i], boards[i], number)}`);
      firstWin = false;
    }

    if (inPlay.size === 1) {
      console.log(`The final winning score is: ${calculateScore(played[i], boards[i], number)}`);
      return;
    }

    inPlay.delete(i);
  }
}
