const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  /const server = app\.listen\(Number\(PORT\), '0\.0\.0\.0', \(\) => \{/g,
  "const server = app.listen(PORT, () => {"
);

fs.writeFileSync('server.ts', code);
