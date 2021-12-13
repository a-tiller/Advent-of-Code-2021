const fs = require('fs');

const input = fs.readFileSync(__dirname + '/inputs/13.input', 'utf8').trim().split('\n\n');

const initialState = input[0].split('\n').map((point) => point.split(',').map(Number));
const folds = input[1].split('\n')
  .map((instruction) => instruction.split(' ')[2].split('='))
  .map(([coordinate, units]) => [coordinate, Number(units)]);

function stateFromPoints(points) {
  const dimensions = points.reduce(([maxPreviousX, maxPreviousY], [x, y]) => 
    [Math.max(maxPreviousX, x), Math.max(maxPreviousY, y)], [0, 0]); 
  const state = new Array(dimensions[1] + 1).fill(0).map((row) => 
    new Array(dimensions[0] + 1).fill(0));

  for(const [x, y] of points) {
    state[y][x] = 1;
  }

  return state;  
}

function doFolds(state, folds) {
  let folded = state.slice(0);
  for (const fold of folds) {
    folded = doFold(folded, fold);
  }
  return folded;
}

function doFold(state, [dimension, units]) {
  // Vertical folds can be understood as a transpose and then a horizontal fold.
  const startState = (dimension === 'x') ? transpose(state) : state.slice(0);
  const endState = new Array(units).fill(0).map((row) =>
    new Array(startState[0].length).fill(0));

  for (let x = 0; x < startState[0].length; x++) {
    for (let diff = 1; diff <= units; diff++) {
      endState[units - diff][x] = startState[units + diff]?.[x] || startState[units - diff][x] ;
    }
  }

  // If there was a transposition, transpose back.
  return (dimension === 'x') ? transpose(endState) : endState;
}

function transpose(matrix) {
  const transposed= new Array(matrix[0].length).fill(0).map((row) => 
    new Array(matrix.length).fill(0));

  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[row].length; col++) {
      transposed[col][row] = matrix[row][col];
    }
  } 

  return transposed;
}

function countPoints(matrix) {
  return matrix.reduce((a, row) => a + row.reduce((a, v) => a + v), 0);
}

console.log("Part one: ", countPoints(doFold(stateFromPoints(initialState), folds[0])));
console.log("Part two:\n", doFolds(stateFromPoints(initialState), folds).map(row => row.join('').replace(/0/g, ' ')));
