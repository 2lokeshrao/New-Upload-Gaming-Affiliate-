const fs = require('fs');
let code = fs.readFileSync('src/components/HeroSection.tsx', 'utf8');

code = code.replace(
  'grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto mb-10 text-slate-300 text-xs sm:text-sm font-mono',
  'grid grid-cols-4 gap-1 sm:gap-3 max-w-3xl mx-auto mb-6 sm:mb-10 text-slate-300 text-[9px] sm:text-sm font-mono'
);

code = code.replace(
  'grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto mb-10 text-slate-300 text-xs sm:text-sm font-medium',
  'grid grid-cols-4 gap-1.5 sm:gap-3 max-w-3xl mx-auto mb-6 sm:mb-10 text-slate-300 text-[9px] sm:text-sm font-medium'
);

code = code.replace(/text-base sm:text-lg/g, 'text-xs sm:text-lg');
code = code.replace(/text-\[10px\]/g, 'text-[8px] sm:text-[10px]');
code = code.replace(/text-\[11px\]/g, 'text-[8px] sm:text-[11px]');
code = code.replace(/p-3 flex flex-col/g, 'p-1.5 sm:p-3 flex flex-col');
code = code.replace(/rounded-xl p-3/g, 'rounded-lg sm:rounded-xl p-1.5 sm:p-3');
code = code.replace(/rounded-2xl p-3/g, 'rounded-lg sm:rounded-2xl p-1.5 sm:p-3');

fs.writeFileSync('src/components/HeroSection.tsx', code, 'utf8');
console.log('Hero section patched.');
