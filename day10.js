const fs = require('fs');

const input = fs.readFileSync(__dirname + '/inputs/10.input', 'utf8').trim().split('\n');

const PAIRS = {
  '(': ')',
  '[': ']',
  '{': '}',
  '<': '>',
};

const unexpectedSymbols = [];
const autocompletes = [];

for (const line of input) {
  let openStack = [];
  let errorFree = true;

  for (const symbol of line) {
    if (PAIRS.hasOwnProperty(symbol)) {
      openStack.push(symbol);
      continue;
    }
    
    if (symbol ===  PAIRS[openStack.at(-1)]) {
      openStack.pop();
      continue;
    } 

    // console.log(`Expected ${PAIRS[openStack.pop()]}, but found ${symbol} instead.`);
    errorFree = false;
    unexpectedSymbols.push(symbol);
    break;
  }

  if (errorFree) {
    const autocomplete = [];
    while (openStack.length) {
      autocomplete.push(PAIRS[openStack.pop()]);
    }
    // console.log(`${line} - Complete by adding ${autocomplete.join('')}.`);
    autocompletes.push(autocomplete);
  }
}

const partOneScore = unexpectedSymbols.reduce((score, symbol) => {
  switch (symbol) {
    case ')':
      return score + 3;
    case ']':
      return score + 57;
    case '}':
      return score + 1197;
    case '>':
      return score + 25137;
    default:
      console.log(`Unexpected symbol: ${symbol}`);
  }
  return score; 
}, 0);
console.log(`Part one: ${partOneScore}`); 

const partTwoScores = autocompletes.reduce((scores, line) => {
  let score = 0;
  for (const symbol of line) {
    score *= 5;
    switch (symbol) {
      case ')':
        score += 1;
        break;
      case ']':
        score += 2;
        break;
      case '}':
        score += 3;
        break;
      case '>':
        score += 4;
        break;
      default:
        console.log(`Unexpected symbol: ${symbol}`);
    }
  }
  scores.push(score);
  return scores;
}, []);
console.log(`Part two: ${partTwoScores.sort((a, b) => a - b).at((partTwoScores.length - 1) / 2)}`);
