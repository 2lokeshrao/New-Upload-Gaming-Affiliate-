const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

const targetStr = `app.get('*', (req, res) => {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');`;

const replacementStr = `app.get('*', (req, res) => {
      // Track visits properly for SSR
      if (!req.path.startsWith('/api/') && !req.path.startsWith('/assets/')) {
        stateStats.totalVisits += 1; 
        triggerStatsSave();
      }
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');`;

code = code.replace(targetStr, replacementStr);
fs.writeFileSync('server.ts', code);
console.log('Patched server.ts successfully');
