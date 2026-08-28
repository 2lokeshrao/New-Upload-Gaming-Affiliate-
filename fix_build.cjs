const fs = require('fs');
// check package.json to make sure esbuild target is cjs or whatever
let pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.scripts.build = "vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=server.cjs";
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
