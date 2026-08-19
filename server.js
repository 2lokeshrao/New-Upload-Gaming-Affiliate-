// We compile down to CJS but this project is "type": "module".
// To satisfy Hostinger's default Express "server.js" entry point expectations
// we use a dynamic import that connects the two correctly.
import('./dist/server.cjs').catch(err => {
  console.error("Failed to load server:", err);
  process.exit(1);
});
