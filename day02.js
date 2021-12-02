const fs = require('fs');

let movements = [];

fs.readFile(__dirname + '/inputs/02.input', (err, data) => {
  movements = data.toString().trim().split('\n').map((line) => {
    const [direction, units] = line.split(' ');
    return {direction, units: Number(units)}
  });

  let horizontal = 0;
  let vertical = 0;

  for (const movement of movements) {
    switch(movement.direction) {
      case 'forward':
        horizontal += movement.units;
        break;
      case 'down':
        vertical += movement.units;
        break;
      case 'up':
        vertical -= movement.units;
        break;
      default:
        console.log(`Unexpected movement: ${JSON.stringify(movement)}`);
    }
  }
  
  console.log(`Horizontal x vertical: ${horizontal * vertical}`);

  horizontal = 0;
  vertical = 0;
  aim = 0;

  for (const movement of movements) {
    switch(movement.direction) {
      case 'forward':
        horizontal += movement.units;
        vertical += movement.units * aim;
        break;
      case 'down':
        aim += movement.units;
        break;
      case 'up':
        aim -= movement.units;
        break;
      default:
        console.log(`Unexpected movement: ${JSON.stringify(movement)}`);
    }
  }
  
  console.log(`Horizontal x vertical using aim: ${horizontal * vertical}`);
});
