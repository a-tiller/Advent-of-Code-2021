const fs = require('fs');

const input = fs.readFileSync(__dirname + '/inputs/05.input', 'utf8').trim().split('\n').map((line) => 
  line.trim().split(' -> ').map((coordinate) => 
    coordinate.trim().split(',').map(Number)));

const thermalVentCounts = {};

for (const line of input) {
  addPoints(line, thermalVentCounts);
}

console.log(`There are ${countOverlaps(thermalVentCounts)} instances of vents overlapping.`);  

function addPoints(line, countMap) {
  const [start, end] = pickStartAndEnd(line);
  const next = pickIterator(start, end);
  const pos = start.slice(0);
  
  while(true) {
    const [x, y] = pos;
    countMap[x] ??= {};
    countMap[x][y] ??= 0;
    countMap[x][y]++;

    if (x === end[0] && y === end[1]) break;
    next(pos);
  }
}

function pickStartAndEnd([first, second]) {
  // If the line is along the y-axis, order by y value.
  if (first[0] === second[0]) return first[1] < second[1] ? [first, second] : [second, first];
  // Otherwise, order by x value.
  return first[0] < second[0] ? [first, second] : [second, first];
}

function pickIterator(start, end) {
  // If the line is along the y-axis, increment position by increasing the y value.
  if (start[0] === end[0]) return (pos) => pos[1]++;
  // If the line is along the x-axis, increment position by increasing the x value.
  if (start[1] === end[1]) return (pos) => pos[0]++;
  // Otherwise, increment the x value, and either increment or decrement the y value
  // depending on whether the line slopes upward or downward.
  return start[1] < end[1] ? (pos) => pos[0]++ && pos[1]++ : (pos) => pos[0]++ && pos[1]--;
}

function countOverlaps(countMap) {
  let overlaps = 0;

  for (const x in countMap) {
    for (const y in countMap[x]) {
      if (countMap[x][y] > 1) overlaps++;
    }
  }

  return overlaps;
}
