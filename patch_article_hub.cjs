const fs = require('fs');
let code = fs.readFileSync('src/components/ArticlesHubPage.tsx', 'utf8');

// A more robust replacement
code = code.replace(/href=\{\\\`\//g, 'href={`/');
code = code.replace(/\\\}\\\`\}/g, '}`}');
code = code.replace(/onClick=\{\(e\) => handleNav\(e, \\\`\//g, 'onClick={(e) => handleNav(e, `/');
code = code.replace(/\\\}\\\`\)\}/g, '}`)}');

// Ensure all escapes are gone
code = code.split('\\`').join('`');
code = code.split('\\$').join('$');

fs.writeFileSync('src/components/ArticlesHubPage.tsx', code, 'utf8');
console.log('Fixed syntax in ArticlesHubPage');
