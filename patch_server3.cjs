const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  /g => g\.country\?\.toUpperCase\(\) === countryCode/g,
  "g => g && typeof g.country === 'string' && g.country.toUpperCase() === countryCode"
);

fs.writeFileSync('server.ts', code);
