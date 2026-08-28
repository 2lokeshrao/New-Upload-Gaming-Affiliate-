const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  /if \(match && match\.link && match\.link\.trim\(\)\) \{/g,
  "if (match && typeof match.link === 'string' && match.link.trim()) {"
);

code = code.replace(
  /if \(p\.defaultLink && p\.defaultLink\.trim\(\)\) \{/g,
  "if (typeof p.defaultLink === 'string' && p.defaultLink.trim()) {"
);

code = code.replace(
  /\} else if \(p\.rawAffiliateUrl && p\.rawAffiliateUrl\.trim\(\)\) \{/g,
  "} else if (typeof p.rawAffiliateUrl === 'string' && p.rawAffiliateUrl.trim()) {"
);

fs.writeFileSync('server.ts', code);
