const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `{/* Floating Action Button for PWA */}
      <button 
        onClick={() => setShowPwaModal(true)}
        className="fixed bottom-24 right-4 z-[5000] bg-amber-400 text-slate-900 rounded-full px-4 py-2 font-black shadow-lg shadow-amber-400/20 hover:scale-105 active:scale-95 transition-transform flex items-center gap-2 border border-amber-300"
      >
        <span className="text-xs uppercase tracking-wider">{t('nav.getApp')}</span>
      </button>`;

code = code.replace(targetStr, '');
fs.writeFileSync('src/App.tsx', code, 'utf8');
console.log('App patched.');
