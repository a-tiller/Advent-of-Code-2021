const fs = require('fs');

const input = fs.readFileSync(__dirname + '/inputs/04.input', 'utf8').trim().split('\n\n');

const numbers = (input.shift()).split(',').map(Number);

const boards = input.map((boardString) => 
  boardString.trim().split('\n').map((row) => 
    row.trim().split(/\ +/).map(Number)));

const winners = new Set();
const called = new Set();

for (const number of numbers) {
  called.add(number);

  for (let i = 0; i < boards.length; i++) {
    if (winners.has(i) || !isWinningBoard(boards[i], called)) continue;

    if (winners.size === 0) console.log(`The first winning score is: ${calculateScore(boards[i], called, number)}`);

    winners.add(i);

    if (winners.size === boards.length) {
      console.log(`The final winning score is: ${calculateScore(boards[i], called, number)}`);
      return;
    }
  }
}

function isWinningBoard(board, called) {
  if (board.some((row) => row.every((val) => called.has(val)))) return true;

  for (let col = 0; col < board[0].length; col++) {
    if (board.every((row) => called.has(row[col]))) return true;
  }

  return false;
}

function calculateScore(board, called, lastCalled) {
  let sum = 0;

  for (const row of board) {
    for (const number of row) {
      if (!called.has(number)) sum += number;
    }
  }

  return sum * lastCalled;
}
