const fs = require('fs');

const input = fs.readFileSync(__dirname + '/inputs/05.input', 'utf8').trim().split('\n').map((line) => 
  line.trim().split(' -> ').map((coordinate) => 
    coordinate.trim().split(',').map(Number)));

const thermalVentCounts = {};

for (const line of input) {
  addPoints(line, thermalVentCounts);
}

console.log(`There are ${countOverlaps(thermalVentCounts)} instances of vents overlapping.`);  

function addPoints([start, end], countMap) {
  const next = buildPolyadicIterator(start, end);
  const point = start.slice(0);
  
  while(true) {
    const [x, y] = point;
    countMap[x] ??= {};
    countMap[x][y] ??= 0;
    countMap[x][y]++;

    if (x === end[0] && y === end[1]) break;
    next(point);
  }
}

function buildPolyadicIterator(start, end) {
  const dimensions = start.length;
  const iterators = [];

  for (let i = 0; i < dimensions; i++) {
    iterators.push(buildIterator(i, start, end));
  }

  return (point) => point.forEach((_, dimension, point) => iterators[dimension](point));  
}

function buildIterator(dimension, start, end) {
  if (start[dimension] < end[dimension]) return (point) => point[dimension]++;
  if (start[dimension] > end[dimension]) return (point) => point[dimension]--;
  return () => {};
}

function countOverlaps(countMap, threshold = 1) {
  let overlaps = 0;

  for (const x in countMap) {
    for (const y in countMap[x]) {
      if (countMap[x][y] > threshold) overlaps++;
    }
  }

  return overlaps;
}
