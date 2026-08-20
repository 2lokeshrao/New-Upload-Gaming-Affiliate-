const fs = require('fs');
let code = fs.readFileSync('src/components/Footer.tsx', 'utf8');

// 1. Add whitespace-nowrap and flex-wrap to buttons
code = code.replace(
  'className="flex items-center justify-center gap-4 text-[11px] pt-2"',
  'className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-[11px] pt-2"'
);

code = code.replace(
  'className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 cursor-pointer bg-slate-800/80 px-3 py-1 rounded-md border border-cyan-500/30"',
  'className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 cursor-pointer bg-slate-800/80 px-3 py-1.5 rounded-md border border-cyan-500/30 whitespace-nowrap"'
);

code = code.replace(
  'className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer bg-slate-800/80 px-3 py-1 rounded-md border border-emerald-500/30"',
  'className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer bg-slate-800/80 px-3 py-1.5 rounded-md border border-emerald-500/30 whitespace-nowrap"'
);

code = code.replace(
  'className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer bg-slate-800/80 px-3 py-1 rounded-md border border-amber-500/30"',
  'className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer bg-slate-800/80 px-3 py-1.5 rounded-md border border-amber-500/30 whitespace-nowrap"'
);

// 2. Add SocialMediaBar below disclaimer
const disclaimerCode = `</a>\n          </p>`;
const targetSocials = `</a>\n          </p>\n          {/* Social Media Footer Icons (Bottom) */}\n          <div className="flex justify-center py-2 mt-2">\n            <SocialMediaBar config={config} variant="footer" />\n          </div>`;
code = code.replace(disclaimerCode, targetSocials);

fs.writeFileSync('src/components/Footer.tsx', code, 'utf8');
console.log('Footer updated successfully.');
