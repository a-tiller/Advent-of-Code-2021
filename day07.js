const fs = require('fs');

const input = fs.readFileSync(__dirname + '/inputs/07.input', 'utf8').trim().split(',').map(Number);

const last = Math.max(...input);
let minFuel = Infinity;


for (let i = 0; i < last; i++) {
  const fuel = input.reduce((a, v) => a + Math.abs(v - i), 0);
  minFuel = Math.min(fuel, minFuel);
}

console.log(`Part one: ${minFuel}`);

minFuel = Infinity;


for (let i = 0; i < last; i++) {
  const fuel = input.reduce((a, v) => {
    const steps = Math.abs(v - i);
    let cost = 0;
    for (let i = 1; i <= steps; i++) {
      cost += i;
    }
    return a + cost;
  }, 0);
  minFuel = Math.min(fuel, minFuel);
}


console.log(`Part two: ${minFuel}`);
