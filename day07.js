const fs = require('fs');

const input = fs.readFileSync(__dirname + '/inputs/07.input', 'utf8').trim().split(',').map(Number);

const distance = (a, b) => Math.abs(a - b);
const sumOfArithmeticProgression = (a, b) => Math.abs(a - b) * (Math.abs(a - b) + 1) / 2;

console.log(`Part one: ${minFuel(input, distance)}`);
console.log(`Part two: ${minFuel(input, sumOfArithmeticProgression)}`);

function minFuel(input, measure) {
  const last = Math.max(...input);
  const memo = {};
  const memoizedCost = (i) => memo[i] || (memo[i] = input.reduce((a, v) => a + measure(v, i), 0));
  const search = (from, to, cost = memoizedCost)  => {
    const mid = Math.floor((from + to) / 2);
    if (cost(mid) > cost(mid + 1)) return search(mid, to);
    if (cost(mid) > cost(mid - 1)) return search(from, mid);
    return cost(mid);
  };

  return search(0, last); 
}

