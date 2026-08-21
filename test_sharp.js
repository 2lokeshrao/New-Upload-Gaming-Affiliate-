import fs from 'fs';
import sharp from 'sharp';

(async () => {
  try {
    const buffer = fs.readFileSync('public/hostinger_logo_new.svg');
    const webpBuffer = await sharp(buffer)
      .resize({ width: 128, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();
    console.log("Success");
  } catch (e) {
    console.error("Error:", e);
  }
})();
