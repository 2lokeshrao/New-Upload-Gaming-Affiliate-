const fs = require('fs');

let serverTs = fs.readFileSync('/app/applet/server.ts', 'utf8');

serverTs = serverTs.replace("await killPort(PORT);", "if (!isProduction) { await killPort(PORT); }");

fs.writeFileSync('/app/applet/server.ts', serverTs);
console.log('Successfully patched killPort');
