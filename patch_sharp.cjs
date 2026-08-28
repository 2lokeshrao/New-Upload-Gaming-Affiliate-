const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace("import sharp from 'sharp';", "");

code = code.replace(
  "const webpBuffer = await sharp(buffer)\n      .resize({ width: 128, withoutEnlargement: true })\n      .webp({ quality: 80 })\n      .toBuffer();",
  "let webpBuffer = buffer; try { const sharp = (await import('sharp')).default; webpBuffer = await sharp(buffer).resize({ width: 128, withoutEnlargement: true }).webp({ quality: 80 }).toBuffer(); } catch(e) { console.error('Sharp error:', e); }"
);

code = code.replace(
  "const optimized = await sharp(buffer)\n      .resize({ width: 800, withoutEnlargement: true })\n      .webp({ quality: 85 })\n      .toBuffer();",
  "let optimized = buffer; try { const sharp = (await import('sharp')).default; optimized = await sharp(buffer).resize({ width: 800, withoutEnlargement: true }).webp({ quality: 85 }).toBuffer(); } catch(e) { console.error('Sharp error:', e); }"
);

fs.writeFileSync('server.ts', code);
