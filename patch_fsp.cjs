const fs = require('fs');

let serverTs = fs.readFileSync('/app/applet/server.ts', 'utf8');

serverTs = serverTs.replace(/fs_promises/g, "fs.promises");

fs.writeFileSync('/app/applet/server.ts', serverTs);
console.log('Successfully patched fs.promises');
