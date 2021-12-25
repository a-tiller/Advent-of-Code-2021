const fs = require('fs');

const relativeCubes = fs.readFileSync(__dirname + '/inputs/19.input', 'utf8').trim().split('\n\n')
  .map((scanner) => scanner.split('\n').slice(1)
    .map((pointString) => pointString.split(',').map(Number)));

const TRANSFORMS = [
  ([x, y, z]) => [ x,  y,  z],
  ([x, y, z]) => [ x,  z, -y],
  ([x, y, z]) => [ x, -y, -z],
  ([x, y, z]) => [ x, -z,  y],
  ([x, y, z]) => [-x,  y, -z],
  ([x, y, z]) => [-x,  z,  y],
  ([x, y, z]) => [-x, -y,  z],
  ([x, y, z]) => [-x, -z, -y],
  ([x, y, z]) => [ y, -x,  z],
  ([x, y, z]) => [ y,  z,  x],
  ([x, y, z]) => [ y,  x, -z],
  ([x, y, z]) => [ y, -z, -x],
  ([x, y, z]) => [-y, -x, -z],
  ([x, y, z]) => [-y,  z, -x],
  ([x, y, z]) => [-y,  x,  z],
  ([x, y, z]) => [-y, -z,  x],
  ([x, y, z]) => [ z,  y, -x],
  ([x, y, z]) => [ z, -x, -y],
  ([x, y, z]) => [ z, -y,  x],
  ([x, y, z]) => [ z,  x,  y],
  ([x, y, z]) => [-z,  y,  x],
  ([x, y, z]) => [-z, -x,  y],
  ([x, y, z]) => [-z, -y, -x],
  ([x, y, z]) => [-z,  x, -y],
];

const ocean = new Set();
const scanners = [];

const absoluteCubes = [];
const cubeZero = new Set(relativeCubes.shift().map((coordinates) => coordinates.join(',')));
absoluteCubes.push(cubeZero);
for (const pointString of cubeZero) {
  ocean.add(pointString);
}

while (relativeCubes.length) {
  const relativeCube = relativeCubes.shift();
  const relativeCubeRotations = TRANSFORMS.map((transform) => relativeCube.map((point) => transform(point))); 
  
  let matched = false;
  for (const absoluteCube of absoluteCubes) {
    for (const rotation of relativeCubeRotations) {
      const {overlap, transformed} = compare(absoluteCube, rotation);
      if (overlap) {
        absoluteCubes.push(new Set(transformed));
        for (const point of transformed) {
          ocean.add(point);
        }
        matched = true;
        break;
      }
    }
    if (matched) break;
  }
  if (!matched) relativeCubes.push(relativeCube);
}

console.log("Part 1: ", ocean.size);
console.log("Part 2: ", greatestManhattanDistance(scanners));

function compare(absoluteCube, rotation, minimumOverlaps = 12) {
  const absoluteCoordinates = Array.from(absoluteCube).map((pointString) => pointString.split(',').map(Number));

  for (const absolutePoint of absoluteCoordinates) {
    for (const rotatedPoint of rotation) {
      let transform = [];
      for (let i = 0; i < rotatedPoint.length; i++) {
        transform.push(absolutePoint[i] - rotatedPoint[i]);
      }
      const transformed = rotation.map((rp) => {
        let transformedPoint = [];
        for (let j = 0; j < rp.length; j++) {
          transformedPoint.push(rp[j] + transform[j]);
        }
        return transformedPoint.join(',');
      });

      let overlap = 0;
      for (const transformedPoint of transformed) {
        if (absoluteCube.has(transformedPoint)) overlap++;
        if (overlap >= minimumOverlaps) {
          scanners.push(transform);
          return {overlap: true, transformed};
        }
      }
    }
  }
  
  return {overlap: false};
}

function greatestManhattanDistance(points) {
  let maxDistance = -Infinity;
  for (let i = 0; i < points.length - 1; i++) {
    for (let j = i + 1; j < points.length; j++) {
      let distance = 0;
      for (let k = 0; k < points[i].length; k++) {
        distance += Math.abs(points[i][k] - points[j][k]);
      }
      maxDistance = Math.max(maxDistance, distance);
    }
  }
  return maxDistance;
}
