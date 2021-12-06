const fs = require('fs');

const input = fs.readFileSync(__dirname + '/inputs/06.input', 'utf8').trim().split(',').map(Number);

const DAYS_TO_PRINT = [80, 256];
const NEW_SPAWN_DAY = 8;
const POST_SPAWN_DAY = 6;

let population;
const populationTracker = fishProgress(input.reduce((fishState, fishDay) => {
  fishState[fishDay]++;
  return fishState;
}, new Array(NEW_SPAWN_DAY + 1).fill(0)));

for (let i = 1; i < 257; i++) {
  population = populationTracker.next();
  if (DAYS_TO_PRINT.includes(i)) console.log(`On day ${i} there are ${population.value} fish.`);
}

function* fishProgress(initialState) {
  const currentState = initialState.slice(0);

  while(true) {
    const spawned = currentState.shift();
    currentState.push(spawned);
    currentState[POST_SPAWN_DAY] += spawned;
    yield currentState.reduce((a, v) => a + v);
  }
}

