const fs = require('fs');

let measurements = [];

fs.readFile(__dirname + '/inputs/01.input', (err, data) => {
  measurements = data.toString().split('\n').map(Number);

  let increases = 0;

  for(let i = 1; i < measurements.length; i++) {
    if (measurements[i] > measurements[i-1]) increases++;
  }
  
  console.log(`There were ${increases} measurements that are larger than the previous measurement.`);


  let windowIncreases = 0;

  for(let i = 1; i + 2 < measurements.length; i++) {
    if (measurements[i + 2] > measurements[i-1]) windowIncreases++;
  }
  
  console.log(`There were ${windowIncreases} three-measurement windows that have larger sums than the previous window.`);
});
