import React, { Suspense, useState } from 'react';
import { CustomPage, GlobalConfig } from '../types';
import { Plus, Trash2, Edit3, Save, Globe } from 'lucide-react';
import { AffiliateLinksEditor } from './AffiliateLinksEditor';
const MDEditor = React.lazy(() => import('@uiw/react-md-editor'));

interface CustomPageManagerTabProps {
  pages: CustomPage[];
  onSavePages: (pages: CustomPage[]) => void;
}

export const CustomPageManagerTab: React.FC<CustomPageManagerTabProps> = ({ pages, onSavePages }) => {
  const [editingPage, setEditingPage] = useState<CustomPage | null>(null);

  const handleCreate = () => {
    setEditingPage({
      id: 'page_' + Math.floor(Math.random() * 1000000),
      slug: 'new-page',
      title: 'New Page',
      content: '# New Page Content\n\nWrite something here.',
      isActive: true
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this page?')) {
      onSavePages(pages.filter(p => p.id !== id));
    }
  };

  const handleSave = () => {
    if (!editingPage) return;
    
    // Auto-generate slug if missing
    if (!editingPage.slug) {
      editingPage.slug = editingPage.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    let updated;
    const exists = pages.find(p => p.id === editingPage.id);
    if (exists) {
      updated = pages.map(p => p.id === editingPage.id ? editingPage : p);
    } else {
      updated = [editingPage, ...pages];
    }
    
    onSavePages(updated);
    setEditingPage(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-emerald-400" />
            Custom Pages
          </h2>
          <p className="text-xs text-slate-400">Create standalone pages like /about, /terms, or custom landing pages.</p>
        </div>
        <button onClick={handleCreate} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Page
        </button>
      </div>

      {editingPage ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Edit Page</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Page Title</label>
              <input 
                type="text" 
                value={editingPage.title}
                onChange={e => setEditingPage({...editingPage, title: e.target.value})}
                className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">URL Slug (e.g. /about)</label>
              <input 
                type="text" 
                value={editingPage.slug}
                onChange={e => setEditingPage({...editingPage, slug: e.target.value})}
                className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white" 
              />
            </div>
          </div>
          
          
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">SEO Title</label>
              <input 
                type="text" 
                value={editingPage.metaTitle || ''}
                onChange={e => setEditingPage({...editingPage, metaTitle: e.target.value})}
                className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Promo Code (Optional)</label>
              <input 
                type="text" 
                value={editingPage.promoCode || ''}
                onChange={e => setEditingPage({...editingPage, promoCode: e.target.value})}
                className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white" 
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">SEO Description</label>
            <textarea 
              value={editingPage.metaDescription || ''}
              onChange={e => setEditingPage({...editingPage, metaDescription: e.target.value})}
              className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
              rows={2}
            />
          </div>
          <div className="mb-4">
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Target Keywords (Comma separated)</label>
            <input 
              type="text" 
              value={editingPage.targetKeywords || ''}
              onChange={e => setEditingPage({...editingPage, targetKeywords: e.target.value})}
              className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white" 
            />
          </div>
          
          <div className="mb-6 p-4 bg-slate-950 border border-slate-800 rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-bold text-slate-300 uppercase">Page FAQs</label>
              <button 
                onClick={() => {
                  const newFaqs = [...(editingPage.faqs || []), {q: '', a: ''}];
                  setEditingPage({...editingPage, faqs: newFaqs});
                }}
                className="px-3 py-1 bg-purple-600 text-white rounded text-xs font-bold"
              >
                + Add FAQ
              </button>
            </div>
            <div className="space-y-4">
              {(editingPage.faqs || []).map((faq, idx) => (
                <div key={idx} className="flex gap-2 items-start bg-slate-900 p-3 rounded border border-slate-800">
                  <div className="flex-1 space-y-2">
                    <input 
                      type="text"
                      placeholder="Question"
                      value={faq.q}
                      onChange={e => {
                        const newFaqs = [...editingPage.faqs];
                        newFaqs[idx].q = e.target.value;
                        setEditingPage({...editingPage, faqs: newFaqs});
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-sm"
                    />
                    <textarea 
                      placeholder="Answer"
                      value={faq.a}
                      onChange={e => {
                        const newFaqs = [...editingPage.faqs];
                        newFaqs[idx].a = e.target.value;
                        setEditingPage({...editingPage, faqs: newFaqs});
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-sm"
                      rows={2}
                    />
                  </div>
                  <button 
                    onClick={() => {
                      const newFaqs = [...editingPage.faqs];
                      newFaqs.splice(idx, 1);
                      setEditingPage({...editingPage, faqs: newFaqs});
                    }}
                    className="p-2 text-red-400 hover:text-red-300 bg-red-400/10 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>


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


          <div className="mb-6">
            <AffiliateLinksEditor 
              links={editingPage.affiliateLinks} 
              onChange={(links) => setEditingPage({...editingPage, affiliateLinks: links})} 
            />
          </div>
          
          <div className="mb-4" data-color-mode="dark">
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Content</label>
            <MDEditor
              value={editingPage.content}
              onChange={(val) => setEditingPage({...editingPage, content: val || ''})}
              height={400}
              style={{ backgroundColor: '#020617' }}
            />
          </div>

          <div className="flex justify-end gap-3">
            <button onClick={() => setEditingPage(null)} className="px-4 py-2 bg-slate-800 text-white rounded font-bold">Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 bg-emerald-500 text-white rounded font-bold flex items-center gap-2">
              <Save className="w-4 h-4" /> Save Page
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {pages.length === 0 ? (
            <div className="text-center p-8 bg-slate-900 border border-slate-800 rounded-xl text-slate-400">
              No custom pages found.
            </div>
          ) : (
            pages.map(page => (
              <div key={page.id} className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-white text-sm">{page.title}</h5>
                  <div className="flex gap-3 text-xs text-slate-400 mt-1">
                    <span className="text-amber-400">/{page.slug}</span>
                    <span className={page.isActive ? 'text-emerald-400' : 'text-red-400'}>
                      {page.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditingPage(page)} className="p-2 bg-slate-800 text-blue-400 rounded hover:bg-slate-700"><Edit3 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(page.id)} className="p-2 bg-slate-800 text-red-400 rounded hover:bg-slate-700"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
