const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

// Replace the lines for _filename and _dirname entirely
content = content.replace(/const _filename = [^\n]+\nconst _dirname = [^\n]+;/, 'const _dirname = process.cwd();');
fs.writeFileSync('server.ts', content);
