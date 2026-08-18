const fs = require('fs');

let serverTs = fs.readFileSync('/app/applet/server.ts', 'utf8');

// Use process.env.PORT
serverTs = serverTs.replace("const PORT = 3000;", "const PORT = process.env.PORT || 3000;");

// Use /tmp/app_data.json
serverTs = serverTs.replace("const DATA_FILE = path.join(process.cwd(), 'app_data.json');", "const DATA_FILE = '/tmp/app_data.json';");

fs.writeFileSync('/app/applet/server.ts', serverTs);
console.log('Successfully patched port and data file');
