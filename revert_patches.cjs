const fs = require('fs');

// Revert HeroSection.tsx
try {
  let heroCode = fs.readFileSync('src/components/HeroSection.tsx', 'utf8');

  heroCode = heroCode.replace(
    'grid grid-cols-4 gap-1 sm:gap-3 max-w-3xl mx-auto mb-6 sm:mb-10 text-slate-300 text-[9px] sm:text-sm font-mono',
    'grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto mb-10 text-slate-300 text-xs sm:text-sm font-mono'
  );

  heroCode = heroCode.replace(
    'grid grid-cols-4 gap-1.5 sm:gap-3 max-w-3xl mx-auto mb-6 sm:mb-10 text-slate-300 text-[9px] sm:text-sm font-medium',
    'grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto mb-10 text-slate-300 text-xs sm:text-sm font-medium'
  );

  heroCode = heroCode.replace(/text-xs sm:text-lg/g, 'text-base sm:text-lg');
  heroCode = heroCode.replace(/text-\[8px\] sm:text-\[10px\]/g, 'text-[10px]');
  heroCode = heroCode.replace(/text-\[8px\] sm:text-\[11px\]/g, 'text-[11px]');
  heroCode = heroCode.replace(/p-1\.5 sm:p-3 flex flex-col/g, 'p-3 flex flex-col');
  heroCode = heroCode.replace(/rounded-lg sm:rounded-xl p-1\.5 sm:p-3/g, 'rounded-xl p-3');
  heroCode = heroCode.replace(/rounded-lg sm:rounded-2xl p-1\.5 sm:p-3/g, 'rounded-2xl p-3');

  fs.writeFileSync('src/components/HeroSection.tsx', heroCode, 'utf8');
  console.log('Hero section reverted.');
} catch (e) {
  console.log('Error reverting hero:', e.message);
}

// Revert TopBanner.tsx
try {
  let bannerCode = fs.readFileSync('src/components/TopBanner.tsx', 'utf8');

  bannerCode = bannerCode.replace(
    'flex flex-row flex-wrap sm:flex-nowrap items-center justify-center gap-x-2 gap-y-1 sm:gap-4',
    'flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4'
  );

  fs.writeFileSync('src/components/TopBanner.tsx', bannerCode, 'utf8');
  console.log('TopBanner reverted.');
} catch (e) {
  console.log('Error reverting banner:', e.message);
}
