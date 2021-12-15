const fs = require('fs');
const {OFFSETS_WITHOUT_DIAGONALS, isValid, doForNeighbors} = require('./libs/matrix_utils.js');
const {IndexedPriorityQueue} = require('./libs/priority_queue.js');

const cave = fs.readFileSync(__dirname + '/inputs/15.input', 'utf8').trim().split('\n')
  .map((row) => row.trim().split('').map(Number));

console.log(`Part 1: ${findMinPath(cave)}`); 
console.log(`Part 2: ${findMinPath(expand(cave))}`);

function findMinPath(cave) {
  const destination = {row: cave.length - 1, col: cave[cave.length - 1].length - 1}; 
  let minCost = Infinity;

  const queue = new IndexedPriorityQueue();
  queue.addPair('0.0', 0);

  while (queue.peekMinValue() < minCost) {
    const [label, cost] = queue.pollMinPair();
    const [row, col] = label.split('.').map(Number);

    if (row === destination.row && col === destination.col) minCost = Math.min(cost, minCost);
   
    doForNeighbors(row, col, cave, OFFSETS_WITHOUT_DIAGONALS, (row, col, cave) => {
      const candidate = cost + cave[row][col];
      const locationString = row + '.' + col;

      if (!queue.labelToKeyIndex.has(locationString)) {
        queue.addPair(locationString, candidate);
      }

      queue.decreaseKey(locationString, candidate);
    });
  }
  return minCost;
}

function expand(cave) {
  const expanded = new Array(cave.length * 5).fill(0).map(row => new Array(cave[0].length * 5).fill(0));

  // paint across
  for (let row = 0; row < cave.length; row++) {
    for (let col = 0; col < expanded[row].length; col++) {
      if (col < cave[row].length) {
        expanded[row][col] = cave[row][col];
        continue;
      }

      expanded[row][col] = (expanded[row][col - cave[row].length] % 9) + 1;
    }
  } 
  
  // paint down
  for (let row = cave.length; row < expanded.length; row++) {
    for (let col = 0; col < expanded[row].length; col++) {
      expanded[row][col] = (expanded[row - cave.length][col] % 9) + 1;
    }
  }

  return expanded;  
}
