const fs = require('fs');
let code = fs.readFileSync('src/components/TopBanner.tsx', 'utf8');

code = code.replace(
  'flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4',
  'flex flex-row flex-wrap sm:flex-nowrap items-center justify-center gap-x-2 gap-y-1 sm:gap-4'
);

fs.writeFileSync('src/components/TopBanner.tsx', code, 'utf8');
console.log('TopBanner patched.');
