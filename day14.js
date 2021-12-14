const fs = require('fs');

const input = fs.readFileSync(__dirname + '/inputs/14.input', 'utf8').trim().split('\n\n');

const polymerTemplate = input[0];
const insertionRules = input[1].trim().split('\n')
  .map((rule) => rule.split(' -> '))
  .reduce((rules, rule) => {
    rules[rule[0]] = rule[1];
    return rules;
  }, {});

let pairsMap = makePairsMap(polymerTemplate);

for (let i = 0; i < 10; i++) {
  pairsMap = progressPairsMap(pairsMap, insertionRules);
}
console.log("Part 1: ", highestMinusLowest(charCountsFromPairsMap(pairsMap, polymerTemplate)));

for (let i = 0; i < 30; i++) {
  pairsMap = progressPairsMap(pairsMap, insertionRules);
}
console.log("Part 2: ", highestMinusLowest(charCountsFromPairsMap(pairsMap, polymerTemplate)));

function makePairsMap(string) {
  const pairCounts = {};

  for (let i = 0; i < string.length - 1; i++) {
    const pair = string[i] + string[i + 1];
    pairCounts[pair] ??= 0;
    pairCounts[pair]++;
  }

  return pairCounts;
}

function progressPairsMap(pairsMap, rules) {
  const result = {};
    
  for (const pair in pairsMap) {
    if (!rules.hasOwnProperty(pair)) {
      result[pair] = pairsMap[pair]
      continue;
    }

    const insertedChar = rules[pair];

    const first = pair[0] + insertedChar;
    result[first] ??= 0;
    result[first] += pairsMap[pair];

    const second = insertedChar + pair[1];
    result[second] ??= 0;
    result[second] += pairsMap[pair];
  }

  return result;
}

function charCountsFromPairsMap(pairsMap, initialString) {
  const counts = {};
  
  for (const pair in pairsMap) {
    counts[pair[0]] ??= 0;
    counts[pair[0]] += pairsMap[pair];
  }
  // The last char if the initial string is not the first char of
  // any pair, and is still the last char of the final string.
  counts[initialString[initialString.length - 1]]++;

  return counts;
}

function highestMinusLowest(charMap) {
  const sortedValues = Object.values(charMap).sort((a, b) => a - b);
  return sortedValues.at(-1) - sortedValues[0];
}
