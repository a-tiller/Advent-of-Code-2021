const fs = require('fs');

const input = fs.readFileSync(__dirname + '/inputs/11.input', 'utf8').trim().split('\n').map((row) => row.split('').map(Number));

const OFFSETS_WITH_DIAGONALS = [
[-1,  1], [0,  1], [ 1,  1],
[-1,  0], /*XXXX*/ [ 1,  0],
[-1, -1], [0, -1], [ 1, -1],
];

let flashed;
let toFlash;
let totalFlashes = 0;
let step = 1;

while (true) {
  flashed = new Set();
  toFlash = [];
  
  for (let row = 0; row < input.length; row++) {
    for (let col = 0; col < input[row].length; col++) {
      energize(row, col, input);
    }
  }

  while(toFlash.length) {
    const [row, col] = toFlash.pop();
    doForNeighbors(row, col, input, OFFSETS_WITH_DIAGONALS, energize);
  }

  for (const octopus of flashed) {
    const [row, col] = octopus.split('.');
    input[row][col] = 0;
  }

  if (step <= 100) totalFlashes += flashed.size;
  if (flashed.size === input.length * input[0].length) break;
  step++;
}

console.log(`There have been ${totalFlashes} total flashes after 100 rounds`);
console.log(`The first synchronization is at step ${step}`);

function energize(row, col, matrix) {
  if (flashed.has(row + '.' + col)) return;
  matrix[row][col]++;
  if (matrix[row][col] > 9) {
    toFlash.push([row, col]);
    flashed.add(row + '.' + col);
  }
}

function isValid(row, col, matrix) {
  if (row < 0) return false;
  if (row >= matrix.length) return false;
  if (col < 0) return false;
  if (col >= matrix[row].length) return false;
  return true; 
}

function doForNeighbors(row, col, matrix, offsets, callback) {
  for (const [rowOffset, colOffset] of offsets) {
    const [neighborRow, neighborCol] = [row + rowOffset, col + colOffset];
    if (!isValid(neighborRow, neighborCol, matrix)) continue;
    callback(neighborRow, neighborCol, matrix);
  }
}
