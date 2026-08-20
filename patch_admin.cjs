const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

code = code.replace(/<span>Gaming Platforms \(\{platforms.length\}\)<\/span>/g, "<span>Manage Platforms ({platforms.length})</span>");

fs.writeFileSync('src/components/AdminPanel.tsx', code, 'utf8');
console.log('Patched AdminPanel.tsx');
