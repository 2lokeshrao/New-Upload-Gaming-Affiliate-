const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(/if \(!JWT_SECRET \|\| !ADMIN_PASSCODE \|\| !DEMO_PASSCODE\) \{[\s\S]*?throw new Error\("CRITICAL SECURITY ERROR[\s\S]*?\}\n/g, "");

fs.writeFileSync('server.ts', code);
