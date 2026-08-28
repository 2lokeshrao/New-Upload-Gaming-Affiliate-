const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

content = content.replace(
  /const _dirname = typeof _dirname !== 'undefined' \? _dirname : path\.dirname\(_filename\);/,
  `const _dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(_filename);`
);

fs.writeFileSync('server.ts', content);
