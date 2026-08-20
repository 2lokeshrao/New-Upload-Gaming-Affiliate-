const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// The original logic:
// const customPageMatch = customPages.find(p => \`/pages/\${p.slug}\` === currentPath);
// We want to change this to:
// const customPageMatch = customPages.find(p => \`/pages/\${p.slug}\` === currentPath || \`/\${p.slug}\` === currentPath);

code = code.replace(
  "const customPageMatch = customPages.find(p => `/pages/${p.slug}` === currentPath);",
  "const customPageMatch = customPages.find(p => `/pages/${p.slug}` === currentPath || `/${p.slug.toLowerCase()}` === currentPath.toLowerCase());"
);

fs.writeFileSync('src/App.tsx', code, 'utf8');
console.log('Patched App.tsx');
