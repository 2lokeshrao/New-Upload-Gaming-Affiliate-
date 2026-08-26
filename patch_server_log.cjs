const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const snippet = `
// Suppress noisy transient Firebase gRPC errors in Node.js
const originalConsoleError = console.error;
console.error = function (...args) {
  if (typeof args[0] === 'string' && args[0].includes('@firebase/firestore') && args[0].includes('UNAVAILABLE: read ECONNRESET')) {
    return; // Suppress harmless grpc connection resets
  }
  originalConsoleError.apply(console, args);
};
`;

if (!code.includes('originalConsoleError')) {
  code = code.replace(/import express from 'express';/g, snippet + "\nimport express from 'express';");
  fs.writeFileSync('server.ts', code);
  console.log("Patched server.ts with console.error override");
} else {
  console.log("Already patched");
}
