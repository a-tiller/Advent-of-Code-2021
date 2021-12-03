const fs = require('fs');

const input = fs.readFileSync(__dirname + '/inputs/03.input', 'utf8').trim().split('\n')
  .map((word) => Number.parseInt(word, 2));

const WORD_LENGTH = 12;
const COUNT_THRESHOLD = input.length / 2;

const bitCounts = new Array(WORD_LENGTH).fill(0);

for (const word of input) {
  for (let position = 0; position < WORD_LENGTH; position++) {
    if (word >> position & 1) {
      bitCounts[position]++;
    }
  }
}

let gamma = 0;
let epsilon = 0;

for (let position = 0; position < WORD_LENGTH; position++) {
  if (bitCounts[position] > COUNT_THRESHOLD) {
    gamma += 1 << position;
  } else {
    epsilon += 1 << position;
  }
}

console.log({gamma, epsilon, product: gamma * epsilon});

function winnowNumbers(words, comparator) {
  let position = WORD_LENGTH - 1;

  while(words.length > 1){
    const ones = [];
    const zeroes = [];
    let count = 0;

    for (const word of words) {
     if (word >> position & 1) {
        count++;
        ones.push(word);
      } else {
        zeroes.push(word);
      }
    }
    
    words = comparator(count, COUNT_THRESHOLD) ? ones : zeroes;
    position--; 
  }

  return words[0];
}

let oxygen = winnowNumbers(input.slice(0), (a, b) => a >= b);
let carbonDioxide = winnowNumbers(input.slice(0), (a, b) => a < b);
console.log({oxygen, carbonDioxide, product: oxygen * carbonDioxide});
