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
