const fs = require('fs');

const input = fs.readFileSync(__dirname + '/inputs/05.input', 'utf8').trim().split('\n').map((line) => 
  line.split(' -> ').map((coordinate) => coordinate.trim().split(',').map(Number)));

const coordinateCounts = {};

for (const [[startX, startY], [endX, endY]] of input) {
  if (startX === endX) {
    coordinateCounts[startX] ??= {};
    for(let i = Math.min(startY, endY); i <= Math.max(startY, endY); i++) {
      coordinateCounts[startX][i] ??= 0;
      coordinateCounts[startX][i]++; 
    }
  } else if (startY === endY) {
    for(let i = Math.min(startX, endX); i <= Math.max(startX, endX); i++) {
      coordinateCounts[i] ??= {};
      coordinateCounts[i][startY] ??= 0;
      coordinateCounts[i][startY]++; 
    }
  }
}

let atLeastTwoVents = 0;

for (const x in coordinateCounts) {
  for (const y in coordinateCounts[x]) {
    if (coordinateCounts[x][y] > 1) atLeastTwoVents++;
  }
}

console.log(`Only taking into account horizontal and vertical lines, there are ${atLeastTwoVents} instances of vents overlapping.`);  

for (const [[startX, startY], [endX, endY]] of input) {
  if (startX !== endX && startY !== endY) {
    const [start, end] = startX < endX ? [[startX, startY], [endX, endY]] : [[endX, endY], [startX, startY]];
    const next = start[1] < end[1] ? ([x, y]) => [x + 1, y + 1] : ([x, y]) => [x + 1, y - 1];

    for (let pos = start; pos[0] <= end[0]; pos = next(pos)) {
      const [x, y] = pos;
      coordinateCounts[x] ??= {};
      coordinateCounts[x][y] ??= 0;
      coordinateCounts[x][y]++;
    } 
  }
}

atLeastTwoVents = 0;

for (const x in coordinateCounts) {
  for (const y in coordinateCounts[x]) {
    if (coordinateCounts[x][y] > 1) atLeastTwoVents++;
  }
}

console.log(`Taking into account all lines, there are ${atLeastTwoVents} instances of vents overlapping.`);  

