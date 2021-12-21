const fs = require('fs');

const binInput = fs.readFileSync(__dirname + '/inputs/16.input', 'utf8').trim().split('').map(hexToBinary).join('');

let vTotal = 0;
const output = parsePacket(binInput, 0);

console.log("Part 1: ", vTotal);
console.log("Part 2: ", output.value);

function parsePacket(input, pos) {
  const version = parseInt(input.substring(pos, pos += 3), 2);
  vTotal += version;

const type = parseInt(input.substring(pos, pos += 3), 2);
  let result;
  let getValue;

  switch (type) {
    case 0: 
      result = parseOperator(input, pos);
      getValue = (result) => result.values.reduce((a, v) => a + v);
      break;
    case 1: 
      result = parseOperator(input, pos);
      getValue = (result) => result.values.reduce((a, v) => a * v);
      break;
    case 2: 
      result = parseOperator(input, pos);
      getValue = (result) => Math.min(...result.values);
      break;
    case 3: 
      result = parseOperator(input, pos);
      getValue = (result) => Math.max(...result.values);
      break;
    case 4:
      result = parseLiteral(input, pos);
      getValue = (result) => result.values[0];
      break;
    case 5: 
      result = parseOperator(input, pos);
      getValue = (result) => (result.values[0] > result.values[1] ? 1: 0);
      break;
    case 6: 
      result = parseOperator(input, pos);
      getValue = (result) => (result.values[0] < result.values[1] ? 1: 0);
      break;
    case 7: 
      result = parseOperator(input, pos);
      getValue = (result) => (result.values[0] === result.values[1] ? 1: 0);
      break;
    default:
      console.log(`Unexpected type: ${type}`);
  }

  return {pos: result.pos, value: getValue(result)};
}

function parseLiteral(input, pos) {
  let startPos = pos;
  let literal = '';
  while (true) {
    const prefix = input[pos++];
    literal += input.substring(pos, pos += 4);
    if (prefix === '0') break;
  }
  return {pos, values: [parseInt(literal, 2)]};
}

function parseOperator(input, pos) {
  const lengthType = input[pos++];
  let result;

  switch (lengthType) {
    case '0':
      const numberOfBits = parseInt(input.substring(pos, pos += 15), 2);
      result = parsePacketsByLength(input, pos, pos + numberOfBits); 
      break;
    case '1':
      const numberOfPackets = parseInt(input.substring(pos, pos += 11), 2);
      result = parsePacketsByCount(input, pos, numberOfPackets);
      break;
  }

  return {pos: result.pos, values: result.values};
}

function parsePacketsByLength(input, pos, end) {
  const values = [];
  while (pos !== end) {
    result = parsePacket(input, pos);
    pos = result.pos;
    values.push(result.value);
  }
  return {pos, values};
}

function parsePacketsByCount(input, pos, count) {
  const values = [];
  for (let i = 0; i < count; i++) {
    result = parsePacket(input, pos);
    pos = result.pos;
    values.push(result.value);
  }
  return {pos, values};
}

function hexToBinary(digit) {
  let bin = parseInt(digit, 16).toString(2);
  while (bin.length < 4) {
    bin = '0' + bin;
  }
  return bin;
}

