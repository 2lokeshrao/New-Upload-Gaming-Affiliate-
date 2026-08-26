const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const betterSnippet = `
// Suppress noisy transient Firebase gRPC errors in Node.js
const originalConsoleError = console.error;
console.error = function (...args) {
  const logStr = args.map(a => typeof a === 'string' ? a : JSON.stringify(a)).join(' ');
  if (logStr.includes('@firebase/firestore') && logStr.includes('UNAVAILABLE: read ECONNRESET')) {
    return; // Suppress harmless grpc connection resets
  }
  originalConsoleError.apply(console, args);
};
`;

code = code.replace(/\/\/ Suppress noisy transient Firebase gRPC errors in Node\.js[\s\S]*?originalConsoleError\.apply\(console, args\);\n};\n/, betterSnippet + "\n");
fs.writeFileSync('server.ts', code);
console.log("Updated console.error patch");
