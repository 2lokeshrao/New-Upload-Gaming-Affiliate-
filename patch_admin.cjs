const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

code = code.replace(
  "const newLinks = [...geoLinks];",
  "const newLinks = geoLinks.map(g => ({ ...g }));"
);

fs.writeFileSync('src/components/AdminPanel.tsx', code);
