import fs from 'fs';
import sharp from 'sharp';

fetch('https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Hostinger_logo.svg/500px-Hostinger_logo.svg.png', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  }
}).then(res => res.arrayBuffer()).then(buffer => {
  sharp(Buffer.from(buffer))
    .webp({ quality: 80 })
    .toFile('public/hostinger_icon.webp')
    .then(() => console.log('Hostinger icon saved as webp!'))
    .catch(console.error);
});
