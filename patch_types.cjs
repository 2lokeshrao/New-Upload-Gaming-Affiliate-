const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

code = code.replace(
  'faqs?: {q: string; a: string}[];\n}',
  `faqs?: {q: string; a: string}[];\n  schemaEnabled?: boolean;\n  schemaType?: string;\n  schemaRatingValue?: number;\n  schemaRatingCount?: number;\n  schemaSoftwarePlatform?: string;\n}`
);

fs.writeFileSync('src/types.ts', code, 'utf8');
console.log('Patched types.ts');
