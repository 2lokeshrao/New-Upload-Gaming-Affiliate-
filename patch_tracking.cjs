const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const oldLogic = `
  // Safely build the dynamic Affiliate URL with tracking parameters
  if (targetUrl && targetUrl !== '/' && (clickId || sub1 || sub2)) {
    try {
      const formatted = targetUrl.startsWith('http://') || targetUrl.startsWith('https://') ? targetUrl : \`https://\${targetUrl}\`;
      const urlObj = new URL(formatted);
      if (clickId) {
        urlObj.searchParams.set('click_id', clickId as string);
        urlObj.searchParams.set('payload', clickId as string);
        urlObj.searchParams.set('sub3', clickId as string);
      }
      if (sub1) urlObj.searchParams.set('sub1', sub1 as string);
      if (sub2) urlObj.searchParams.set('sub2', sub2 as string);
      targetUrl = urlObj.toString();
    } catch (e) {
      logger.warn('Failed to parse URL for tracking params in /go/:slug', e);
    }
  }
`.trim();

const newLogic = `
  // Safely build the dynamic Affiliate URL with all tracking parameters
  if (targetUrl && targetUrl !== '/') {
    try {
      const formatted = targetUrl.startsWith('http://') || targetUrl.startsWith('https://') ? targetUrl : \`https://\${targetUrl}\`;
      const urlObj = new URL(formatted);
      
      // Forward all incoming query parameters
      for (const [key, value] of Object.entries(req.query)) {
        if (typeof value === 'string') {
          urlObj.searchParams.set(key, value);
        }
      }

      // Specific S2S mappings if click_id is present
      if (clickId) {
        urlObj.searchParams.set('click_id', clickId as string);
        if (!urlObj.searchParams.has('payload')) urlObj.searchParams.set('payload', clickId as string);
        if (!urlObj.searchParams.has('sub3')) urlObj.searchParams.set('sub3', clickId as string);
      }
      targetUrl = urlObj.toString();
    } catch (e) {
      logger.warn('Failed to parse URL for tracking params in /go/:slug', e);
    }
  }
`.trim();

code = code.replace(oldLogic, newLogic);
fs.writeFileSync('server.ts', code);
