const fs = require('fs');

const input = fs.readFileSync(__dirname + '/inputs/03.input', 'utf8').trim().split('\n');

const bits = new Array(input[0].length).fill(0);

for (const number of input) {
  for (let bit = 0; bit < number.length; bit++) {
    if (number[bit] === '1') {
      bits[bit]++;
    } else {
      bits[bit]--;
    }
  }
}

let gamma = 0;
let epsilon = 0;

for (let bit = 0; bit < bits.length; bit++) {
  if (bits[bits.length - 1 - bit] > 0) {
    gamma += 1 << bit;
  } else {
    epsilon += 1 << bit;
  }
}

console.log({gamma, epsilon, product: gamma * epsilon});

function winnowNumbers(numbers, comparator) {
  let bit = 0;

  while(numbers.length > 1){
    let count = 0;
    for (const number of numbers) {
     if (number[bit] === '1') {
        count++;
      } else {
        count--;
      }
    }
    numbers = numbers.filter((number) => {
      return comparator(count, 0) ? number[bit] === '1' : number[bit] === '0';
    }); 
    bit++; 
  }

  return Number.parseInt(numbers[0], 2);
}

let oxygen = winnowNumbers(input.slice(0), (a, b) => a >= b);
let carbonDioxide = winnowNumbers(input.slice(0), (a, b) => a < b);
console.log({oxygen, carbonDioxide, product: oxygen * carbonDioxide});
