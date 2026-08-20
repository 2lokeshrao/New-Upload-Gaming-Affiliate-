const fs = require('fs');
let code = fs.readFileSync('src/components/CustomPageManagerTab.tsx', 'utf8');

const schemaHtml = `
          {/* Automated Schema Builder */}
          <div className="mb-6 p-4 bg-slate-950 border border-purple-500/30 rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.1)]">
            <div className="flex items-center gap-3 mb-4 border-b border-slate-800 pb-3">
              <div className="bg-purple-600 p-2 rounded-lg text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
              </div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wider">Automated Schema Builder (JSON-LD)</h3>
            </div>
            
            <div className="mb-4 flex items-center gap-3 bg-slate-900 p-3 rounded-xl border border-slate-800">
              <input 
                type="checkbox" 
                checked={editingPage.schemaEnabled || false}
                onChange={e => setEditingPage({...editingPage, schemaEnabled: e.target.checked})}
                className="w-5 h-5 accent-purple-500 rounded cursor-pointer" 
              />
              <label className="text-sm font-bold text-slate-300">Enable Rich Snippets (Generates FAQPage & Rating Schema automatically)</label>
            </div>
            
            {editingPage.schemaEnabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Schema Type</label>
                  <select 
                    value={editingPage.schemaType || 'SoftwareApplication'}
                    onChange={e => setEditingPage({...editingPage, schemaType: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                  >
                    <option value="SoftwareApplication">Software Application (App/Game)</option>
                    <option value="Product">Product / Offer</option>
                    <option value="Article">Article</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Operating System / Platform</label>
                  <input 
                    type="text" 
                    value={editingPage.schemaSoftwarePlatform || 'Web, Android, iOS'}
                    onChange={e => setEditingPage({...editingPage, schemaSoftwarePlatform: e.target.value})}
                    placeholder="e.g., Android, iOS, Web"
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Aggregate Rating Value (Out of 5)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    min="1"
                    max="5"
                    value={editingPage.schemaRatingValue || ''}
                    onChange={e => setEditingPage({...editingPage, schemaRatingValue: parseFloat(e.target.value) || 0})}
                    placeholder="e.g., 4.8"
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white" 
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Review Count (Number of users)</label>
                  <input 
                    type="number" 
                    value={editingPage.schemaRatingCount || ''}
                    onChange={e => setEditingPage({...editingPage, schemaRatingCount: parseInt(e.target.value, 10) || 0})}
                    placeholder="e.g., 14500"
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white" 
                  />
                </div>
              </div>
            )}
          </div>
`;

code = code.replace(
  /<div className="mb-6 p-4 bg-slate-950 border border-slate-800 rounded-xl">[\s\S]*?Page FAQs[\s\S]*?<\/div>\n          <\/div>/,
  "$&" + '\n\n' + schemaHtml
);

fs.writeFileSync('src/components/CustomPageManagerTab.tsx', code, 'utf8');
console.log('Patched CustomPageManagerTab.tsx');
