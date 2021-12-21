const fs = require('fs');

const [[xMin, xMax], [yMin, yMax]] = fs.readFileSync(__dirname + '/inputs/17.input', 'utf8')
                          .trim().split(':')[1]
                          .trim().split(', ')
                          .map((pairString) => pairString.split('=')[1].split('..').map(Number));

const hits = new Set();
let peak = 0;

for (let xStarting = 0; xStarting < 300; xStarting++) {
  for (let yStarting = -300; yStarting < 300; yStarting++) {
    let xVelocity = xStarting;
    let yVelocity = yStarting;
    let xPos = 0;
    let yPos = 0;
    let localPeak = 0;

    while (xPos <= xMax && yPos >= yMin) {
      xPos += xVelocity;
      yPos += yVelocity;
      localPeak = Math.max(localPeak, yPos);
      if (onTarget(xPos, yPos)) {
        peak = Math.max(peak, localPeak);
        hits.add(xStarting + '.' + yStarting);
      }
      xVelocity--;
      if (xVelocity < 0) xVelocity = 0;
      yVelocity--;
    }
  }
}

console.log(peak);
console.log(hits.size);

function onTarget(x, y) {
  return (x >= xMin && x <= xMax && y >= yMin && y <= yMax);
}
