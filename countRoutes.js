const fs = require('fs');

const filePath = './app.js';

// Read the contents of the file
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error(`Error reading file: ${err}`);
    return;
  }

  // Define a regex pattern to match route definitions
  const routePattern = /app\.(get|post|put|delete|patch)\(/g;
  const matches = data.match(routePattern);

  const routeCount = matches ? matches.length : 0;
  console.log(`Total number of routes: ${routeCount}`);
});
