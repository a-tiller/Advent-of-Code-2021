const fs = require('fs');

const numbers = fs.readFileSync(__dirname + '/inputs/18.input', 'utf8').trim().split('\n');

console.log('Part 1: ', magnitude(numbers.reduce((a, v) => add(a,v))));

let maxMagnitude = -Infinity;
for (let i = 0; i < numbers.length - 1; i++) {
  for (let j = i + 1; j < numbers.length; j++) {
    maxMagnitude = Math.max(
      maxMagnitude, 
      magnitude(add(numbers[i], numbers[j])), 
      magnitude(add(numbers[j], numbers[i])));
  }
}

console.log('Part 2: ', maxMagnitude);

function add(left, right) {
  return reduce(`[${left}, ${right}]`);
}

function reduce(number) {
  let depth = 0;
  for (let i = 0; i < number.length; i++) {
    if (number[i] === '[') depth++;
    if (number[i] === ']') depth--;
    if (depth === 5) {
      return reduce(explode(number, i));
    }
  }

  depth = 0;
  for (let i = 0; i < number.length - 1; i++) {
    if (number[i] === '[') depth++;
    if (number[i] === ']') depth--;
    if (number[i].match(/\d/) && number[i + 1].match(/\d/)) {
      return reduce(split(number, i, depth === 4));
    }
  }

  return number;
}

function explode(number, position) {
  const exploderEnd = number.indexOf(']', position) + 1;
  const exploder = JSON.parse(number.substring(position, exploderEnd));

  let left = number.substring(0, position);
  for (let i = left.length - 1; i > 0; i--) {
    if (left[i].match(/\d/)) {
      const remainderStart = i + 1
      let digit = '';
      while (left[i].match(/\d/)) {
        digit = left[i] + digit;
        i--;
      }

      left = left.substring(0, i + 1) 
        + (Number(digit) + exploder[0]) 
        + left.substring(remainderStart);
      break;
    }
  }

  let right = number.substring(exploderEnd);
  for (let i = 0; i < right.length; i++) {
    if (right[i].match(/\d/)) {
      const initialEnd = i;
      let digit = '';
      while (right[i].match(/\d/)) {
        digit = digit + right[i];
        i++;
      }

      right = right.substring(0, initialEnd) 
        + (Number(digit) + exploder[1]) 
        + right.substring(i);
      break;
    }
  }

  return left + 0 + right;
}

function split(number, position, explodeResult) {
  const splitter = Number(number.substring(position, position + 2));
  let result = number.substring(0, position) 
    + `[${Math.floor(splitter / 2)}, ${Math.ceil(splitter / 2)}]` 
    + number.substring(position + 2);
  if (explodeResult) result = explode(result, position);
  return result;
}

function magnitude(number) {
  if (Array.isArray(number)) return (3 * magnitude(number[0])) + (2 * magnitude(number[1]));

  if (number[0] === '[') return magnitude(JSON.parse(number));

  return Number(number);
}
