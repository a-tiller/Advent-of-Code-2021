
const fs = require('fs');

const input = fs.readFileSync(__dirname + '/inputs/06.input', 'utf8').trim().split(',').map(Number);

const simulationInput = input.slice(0);
for (let i = 0; i < 80; i++) {
  advance(simulationInput);
}

console.log(`There are ${simulationInput.length} lanternfish at 80 days.`);

function advance(fishList) {
  const newFish = [];

  for (let i = 0; i < fishList.length; i++) {
    if (fishList[i] === 0) {
      fishList[i] = 6;
      newFish.push(8);
    } else {
      fishList[i]--;
    }
  }

  fishList.push(...newFish);
}


let fishCounts = new Array(9).fill(0);
for (const fish of input) {
 fishCounts[fish]++;
}

for (let i = 0; i < 256; i++) {
  fishCounts = rotationalAdvance(fishCounts);
}

console.log(`There are ${fishCounts.reduce((a, v) => a + v)} lanternfish at 256 days.`);

function rotationalAdvance([zero, one, two, three, four, five, six, seven, eight]) {
  return [one, two, three, four, five, six, seven + zero, eight, zero];
}
