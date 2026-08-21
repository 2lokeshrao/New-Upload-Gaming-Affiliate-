const fs = require('fs');
const sharp = require('sharp');
const axios = require('axios');

axios.get('https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Hostinger_logo.svg/500px-Hostinger_logo.svg.png', {
  responseType: 'arraybuffer',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  }
}).then(res => {
  sharp(res.data)
    .webp({ quality: 80 })
    .toFile('public/hostinger.webp')
    .then(() => console.log('Hostinger logo saved as webp!'))
    .catch(console.error);
}).catch(console.error);
