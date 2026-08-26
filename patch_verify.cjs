const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

// 1. Patch verifyJwtToken
content = content.replace(
  /const decoded = jwt.verify\(token, JWT_SECRET\);\n\s+\(req as any\).user = decoded;\n\s+next\(\);/,
  `const decoded = jwt.verify(token, JWT_SECRET) as any;
    (req as any).user = decoded;
    
    // Block write operations for demo users
    if (decoded.role === 'demo' && req.method !== 'GET') {
       return res.status(403).json({ error: 'Action disabled in Demo Mode.' });
    }
    next();`
);

// 2. Patch /api/admin/data
content = content.replace(
  /app.get\('\/api\/admin\/data', verifyJwtToken, \(req, res\) => \{\n\s+const geo = getGeoFromRequest\(req\);\n\s+res.json\(\{/,
  `app.get('/api/admin/data', verifyJwtToken, (req, res) => {
  const geo = getGeoFromRequest(req);
  res.json({
    isDemo: (req as any).user?.role === 'demo',`
);

fs.writeFileSync('server.ts', content);
