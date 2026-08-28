const fs = require('fs');
let pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

pkg.scripts.build = "vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=server.cjs && echo 'import \"./server.cjs\";' > server.js && echo 'import \"./server.cjs\";' > app.js";

fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
