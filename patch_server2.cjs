const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  /const allowed = \(p\.allowedCountries \|\| \[\]\)\.map\(c => c\.toUpperCase\(\)\);/g,
  "const allowed = (p.allowedCountries || []).filter(c => typeof c === 'string').map(c => c.toUpperCase());"
);

fs.writeFileSync('server.ts', code);
