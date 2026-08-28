const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const retryLogic = `
      let res;
      let usedAdmin = false;
      let retries = 3;
      while (retries > 0) {
        try {
          if (token) {
            res = await fetch('/api/admin/data', { headers: { Authorization: \`Bearer \${token}\` } });
            if (res.ok) usedAdmin = true;
          }
          if (!res || !res.ok) {
            res = await fetch('/api/data');
          }
          if (res && res.ok) break;
        } catch (err) {
          console.warn('Fetch attempt failed, retrying...', err);
        }
        retries--;
        if (retries > 0) await new Promise(r => setTimeout(r, 1000));
      }
`;

code = code.replace(
  /let res;\s*let usedAdmin = false;\s*if \(token\) \{\s*res = await fetch\('\/api\/admin\/data', \{ headers: \{ Authorization: `Bearer \$\{token\}` \} \}\);\s*if \(res\.ok\) usedAdmin = true;\s*\}\s*if \(\!res \|\| \!res\.ok\) \{\s*res = await fetch\('\/api\/data'\);\s*\}/,
  retryLogic.trim()
);

fs.writeFileSync('src/App.tsx', code);
