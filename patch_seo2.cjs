const fs = require('fs');
let code = fs.readFileSync('src/utils/seo.ts', 'utf8');

code = code.replace(
  "let scriptElement = document.getElementById(scriptId);",
  "let scriptElement = document.getElementById(scriptId) as HTMLScriptElement | null;"
);

fs.writeFileSync('src/utils/seo.ts', code, 'utf8');
console.log('Fixed seo.ts');
