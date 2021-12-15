const OFFSETS_WITHOUT_DIAGONALS = [[0, 1], [1, 0], [0, -1], [-1, 0]];

const OFFSETS_WITH_DIAGONALS = [
[-1,  1], [0,  1], [ 1,  1],
[-1,  0], /*XXXX*/ [ 1,  0],
[-1, -1], [0, -1], [ 1, -1],
];

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

module.exports = {
  OFFSETS_WITHOUT_DIAGONALS,
  OFFSETS_WITH_DIAGONALS,
  doForNeighbors,
  isValid,
};
