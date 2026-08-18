const { spawn } = require('child_process');
const proc = spawn('node', ['dist/server.cjs'], { env: { ...process.env, PORT: '3000' } });
proc.stdout.on('data', data => console.log('stdout:', data.toString()));
proc.stderr.on('data', data => console.log('stderr:', data.toString()));
proc.on('close', code => console.log('close:', code));
setTimeout(() => {
  proc.kill();
  console.log('killed');
}, 5000);
