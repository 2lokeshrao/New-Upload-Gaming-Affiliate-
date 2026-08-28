const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const oldCode = `
      let fetchUrl = platform.logoUrl; if (fetchUrl.startsWith("/")) { fetchUrl = \`http://127.0.0.1:\${PORT}\${fetchUrl}\`; } const response = await fetch(fetchUrl);
      if (!response.ok) throw new Error('Failed to fetch external image');
      const arrayBuffer = await response.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
`.trim();

const newCode = `
      if (platform.logoUrl.startsWith("/")) {
        let localPath = path.join(process.cwd(), 'dist', platform.logoUrl);
        if (process.env.NODE_ENV !== 'production') {
            localPath = path.join(process.cwd(), 'public', platform.logoUrl);
        }
        const fsPromises = await import('fs/promises');
        try {
            buffer = await fsPromises.readFile(localPath);
        } catch (err) {
            // Fallback for local assets if not found (maybe placed directly in root)
            buffer = await fsPromises.readFile(path.join(process.cwd(), platform.logoUrl));
        }
      } else {
        const response = await fetch(platform.logoUrl);
        if (!response.ok) throw new Error('Failed to fetch external image');
        const arrayBuffer = await response.arrayBuffer();
        buffer = Buffer.from(arrayBuffer);
      }
`.trim();

code = code.replace(oldCode, newCode);

fs.writeFileSync('server.ts', code);
