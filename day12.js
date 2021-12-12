const fs = require('fs');

const input = fs.readFileSync(__dirname + '/inputs/12.input', 'utf8').trim().split('\n').map((row) => row.split('-'));

const caveMap = makeUndirectedAdjacencyList(input);

console.log(`There are ${getPaths(caveMap, atMostOne).length} paths with single visits to small caves.`);
console.log(`There are ${getPaths(caveMap, singleRevisit).length} paths with a single double visit to a small cave.`);

function getPaths(adjacencyList, isValid) {
  const paths = [];
  const visited = {};

  const pathBuilder = (node, pathString = node) => {
    for (const next of adjacencyList[node]) {
      if (next === 'start') continue;

      const nextPath = pathString + '.' + next;
      
      if (next === 'end') {
        paths.push(nextPath);
        continue;
      }

      if (next === next.toUpperCase()) {
        pathBuilder(next, nextPath);
        continue;
      }

      visited[next] ??= 0;
      visited[next]++;
      if (isValid(visited)) pathBuilder(next, nextPath);
      visited[next]--;
    } 
  }

  pathBuilder('start');
  return paths;
}


function atMostOne(visited) {
  return Object.values(visited).every((value) => value < 2);
}

function singleRevisit(visited) {
  let sortedValues = Object.values(visited).sort((a, b) => a - b);
  if (sortedValues.pop() > 2) return false;
  return sortedValues.every((value) => value < 2);  
}

function makeUndirectedAdjacencyList(edgeList) {
  const adjacencyList = {};
  for (const [start, end] of input) {
    adjacencyList[start] ??= new Set();
    adjacencyList[start].add(end);
    adjacencyList[end] ??= new Set();
    adjacencyList[end].add(start);
  }
  return adjacencyList;
}
