const fs = require('fs');
let code = fs.readFileSync('src/components/Footer.tsx', 'utf8');

if (!code.includes('setShowPwaModal:')) {
  code = code.replace(
    'setShowReferModal: (val: boolean) => void;',
    'setShowReferModal: (val: boolean) => void;\n  setShowPwaModal?: (val: boolean) => void;'
  );
  
  code = code.replace(
    'setShowReferModal,',
    'setShowReferModal,\n  setShowPwaModal,'
  );
  
  // Also import Download or Smartphone icon from lucide-react
  code = code.replace(
    'ShieldCheck, Users',
    'ShieldCheck, Users, Smartphone'
  );
  
  const targetBtn = `<button
              onClick={() => setShowReferModal(true)}
              className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer bg-slate-800/80 px-3 py-1 rounded-md border border-emerald-500/30"
            >
              {t('footer.refer')}
            </button>`;
            
  const replacementBtn = `<button
              onClick={() => setShowReferModal(true)}
              className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer bg-slate-800/80 px-3 py-1 rounded-md border border-emerald-500/30"
            >
              {t('footer.refer')}
            </button>
            {setShowPwaModal && (
              <button
                onClick={() => setShowPwaModal(true)}
                className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer bg-slate-800/80 px-3 py-1 rounded-md border border-amber-500/30"
              >
                <Smartphone className="w-3 h-3" /> {t('nav.getApp')}
              </button>
            )}`;
            
  code = code.replace(targetBtn, replacementBtn);
  
  fs.writeFileSync('src/components/Footer.tsx', code, 'utf8');
  console.log('Footer patched.');
} else {
  console.log('Footer already patched.');
}
