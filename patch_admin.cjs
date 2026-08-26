const fs = require('fs');
let content = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

content = content.replace(
  /token: string;/,
  `token: string;
  isDemo?: boolean;`
);

content = content.replace(
  /export const AdminPanel: React.FC<AdminPanelProps> = \(\{/,
  `export const AdminPanel: React.FC<AdminPanelProps> = ({
  isDemo,`
);

content = content.replace(
  /<div className="max-w-7xl mx-auto p-4 sm:p-6">/,
  `<div className="max-w-7xl mx-auto p-4 sm:p-6">
      {isDemo && (
        <div className="mb-6 px-4 py-3 bg-amber-500/10 border border-amber-500/50 rounded-xl flex items-start sm:items-center gap-3">
          <span className="text-amber-400 text-xl flex-shrink-0">⚠️</span>
          <div>
            <h4 className="text-amber-400 font-bold text-sm">Demo Mode Active</h4>
            <p className="text-amber-300/80 text-xs mt-0.5">You are viewing the admin panel in Read-Only mode. Earning stats are simulated. Saving changes is disabled.</p>
          </div>
        </div>
      )}`
);

content = content.replace(
  /onClick=\{handleSave\}/g,
  `onClick={isDemo ? (e) => { e.preventDefault(); alert('Saving is disabled in Demo Mode'); } : handleSave}`
);

fs.writeFileSync('src/components/AdminPanel.tsx', content);
