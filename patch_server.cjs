const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// Replace the recursive server.on('error') retry logic which creates an infinite loop if port is blocked
// and prevents the Cloud Run port check from completing cleanly.
code = code.replace(
/  server\.on\('error', \(e: any\) => \{[\s\S]*?\}\);/m,
`  server.on('error', (e: any) => {
    if (e.code === 'EADDRINUSE') {
      logger.error(\`Port \${PORT} is in use, aborting...\`);
      process.exit(1);
    } else {
      logger.error('Server error:', e);
    }
  });`
);

fs.writeFileSync('server.ts', code);
console.log('patched');
