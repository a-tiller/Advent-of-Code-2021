const fs = require('fs');

const input = fs.readFileSync(__dirname + '/inputs/08.input', 'utf8').trim().split('\n').map((entry) => 
  entry.trim().split('|').map((signal) => 
    signal.trim().split(' ').map((digit) =>
      digit.split('').sort().join(''))));

const uniqueLengths = new Set([2,3,4,7]);

let uniqueDigitOccurrencesInOutput = 0;

for (const [signals, output] of input) {
  for (const digit of output) {
    if (uniqueLengths.has(digit.length)) uniqueDigitOccurrencesInOutput++;
  }
} 

console.log('Part 1: ', uniqueDigitOccurrencesInOutput);

const outputs = [];

for (const [signals, output] of input) {
  const randomToDigit = {};
  signals.sort((a, b) => (a.length - b.length));
  
  randomToDigit[signals[0]] = '1';
  randomToDigit[signals[1]] = '7';
  randomToDigit[signals[2]] = '4';
  randomToDigit[signals[9]] = '8';

  // Of the three 5-length signals, only '3' includes both segments in '1'
  const threeString = signals.slice(3,6).filter((signal) => isSuperSetOf(signal, signals[0])).pop();
  randomToDigit[threeString] = '3';

  // Of the three 6-length signals, only '9' includes all the segments in '3'
  const nineString = signals.slice(6,9).filter((signal) => isSuperSetOf(signal, threeString)).pop();
  randomToDigit[nineString] = '9';

  // Of the remaining 6-length signals, '0' has both segments in 1, and '6' does not.
  for (let i = 6; i < 9; i++) {
    if (signals[i] === nineString) continue;
    if (isSuperSetOf(signals[i], signals[0])) randomToDigit[signals[i]] = '0'; 
    else randomToDigit[signals[i]] = '6'; 
  } 

  //Of the remaining 5-length signals, all the segments in '5' are in '9', but not so for '2'
  for (let i = 3; i < 6; i++) {
    if (signals[i] === threeString) continue;
    if (isSuperSetOf(nineString, signals[i])) randomToDigit[signals[i]] = '5'; 
    else randomToDigit[signals[i]] = '2'; 
  } 

  let outputString = '';
  for (const digitString of output) {
    outputString += randomToDigit[digitString]
  }
  outputs.push(Number(outputString));
}

function isSuperSetOf(superString, subString) {
  const superSet = new Set(superString);

  for (const letter of subString) {
    if(!superSet.has(letter)) return false;
  }

  return true
}

console.log('Part 2: ', outputs.reduce((a, v) => a + v));
