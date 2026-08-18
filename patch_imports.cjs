const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');
code = code.replace("import fs_promises from 'fs/promises';\\nimport path from 'path';", "import fs_promises from 'fs/promises';\nimport path from 'path';");
fs.writeFileSync('server.ts', code);
