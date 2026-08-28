const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  "const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.socket.remoteAddress || '127.0.0.1';",
  "let ipHeader = req.headers['x-forwarded-for'];\n  if (Array.isArray(ipHeader)) ipHeader = ipHeader[0];\n  const ip = (typeof ipHeader === 'string' ? ipHeader.split(',')[0] : ipHeader) || req.socket.remoteAddress || '127.0.0.1';"
);

fs.writeFileSync('server.ts', code);
