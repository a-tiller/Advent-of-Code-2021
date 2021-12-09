const fs = require('fs');

const input = fs.readFileSync(__dirname + '/inputs/09.input', 'utf8').trim().split('\n').map((entry) => 
  entry.trim().split('').map(Number));

let risk = 0;
const basins = [];

for (let row = 0; row < input.length; row++) {
  for (let col = 0; col < input[row].length; col++) {
    if (isLowPoint(row, col, input)) {
       risk += input[row][col] + 1;
       basins.push(basinSize(row, col, input)); 
    }
  }
}

console.log(`Part one: ${risk}`);

basins.sort((a, b) => b - a);
console.log(`Part two: ${basins[0] * basins[1] * basins[2]}`);

function isLowPoint(row, col, matrix) {
  const offsets = [[-1, 0], [0, -1], [1, 0], [0, 1]];

  for (const [rowOffset, colOffset] of offsets) {
    const [neighborRow, neighborCol] = [row + rowOffset, col + colOffset];
    if (isValid(neighborRow, neighborCol, matrix) && 
      matrix[neighborRow][neighborCol] <= matrix[row][col]) return false;
  }

  return true;
}

function isValid(row, col, matrix) {
  if (row < 0) return false;
  if (row >= matrix.length) return false;
  if (col < 0) return false;
  if (col >= matrix[row].length) return false;
  return true;
}

function basinSize(row, col, matrix) {
  const offsets = [[-1, 0], [0, -1], [1, 0], [0, 1]];
  const toExplore = [];
  const queued = new Set();
  let size = 0;

  toExplore.push([row, col]);
  queued.add(JSON.stringify([row, col]));

  while(toExplore.length) {
    const [currentRow, currentCol] = toExplore.pop();
    size++;

    for (const [rowOffset, colOffset] of offsets) {
      const [neighborRow, neighborCol] = [currentRow + rowOffset, currentCol + colOffset];
      if (shouldQueue(neighborRow, neighborCol, matrix, queued)) {  
        toExplore.push([neighborRow, neighborCol]);
        queued.add(JSON.stringify([neighborRow, neighborCol])); 
      }  
    }
  }

  return size;
}

function shouldQueue(row, col, matrix, queued) {
  if (!isValid(row, col, matrix)) return false;
  if (matrix[row][col] === 9) return false;
  if (queued.has(JSON.stringify([row, col]))) return false;
  return true;
}
