const fs = require('fs');
let code = fs.readFileSync('src/components/Navbar.tsx', 'utf-8');

code = code.replace(
  /<div className="w-8 h-8 rounded bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">[\s\S]*?<span className="font-black text-xl text-white hidden sm:block">BonusPromoCode<\/span>/,
  '<img src="/logo.svg" alt="Bonus Promo Code" className="h-9 sm:h-11 w-auto" />'
);

fs.writeFileSync('src/components/Navbar.tsx', code);
console.log("Navbar patched");
