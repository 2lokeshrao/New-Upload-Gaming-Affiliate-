const fs = require('fs');
let content = fs.readFileSync('src/types.ts', 'utf-8');

content = content.replace(
  /platformStats:\s*Record<string,\s*{\s*clicks:\s*number;\s*copies:\s*number\s*}>;/,
  `platformStats: Record<string, { clicks: number; copies: number; registrations?: number; deposits?: number; revenue?: number }>;`
);

fs.writeFileSync('src/types.ts', content);
console.log('src/types.ts patched');
