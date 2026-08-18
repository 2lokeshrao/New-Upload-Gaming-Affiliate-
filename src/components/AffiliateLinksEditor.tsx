import React from 'react';
import { AffiliateLink } from '../types';
import { Plus, Trash2, GripVertical } from 'lucide-react';

interface Props {
  links?: AffiliateLink[];
  onChange: (links: AffiliateLink[]) => void;
}

export const AffiliateLinksEditor: React.FC<Props> = ({ links = [], onChange }) => {
  const addLink = () => {
    const newLink: AffiliateLink = {
      id: 'link_' + Math.random().toString(36).substr(2, 9),
      brandName: '',
      title: '',
      url: '',
      buttonText: 'Apply Now'
    };
    onChange([...links, newLink]);
  };

  const removeLink = (id: string) => {
    onChange(links.filter(l => l.id !== id));
  };

  const updateLink = (id: string, updates: Partial<AffiliateLink>) => {
    onChange(links.map(l => l.id === id ? { ...l, ...updates } : l));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-700 pb-2">
        <h4 className="font-bold text-white text-sm">Recommended Offers / Affiliate Links</h4>
        <button onClick={addLink} className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
          <Plus className="w-3 h-3" /> Add Link
        </button>
      </div>

      {links.length === 0 ? (
        <p className="text-xs text-slate-500 italic">No affiliate links added yet.</p>
      ) : (
        <div className="space-y-4">
          {links.map((link, index) => (
            <div key={link.id} className="bg-slate-950/50 p-4 rounded-xl border border-slate-700 relative">
              <button 
                onClick={() => removeLink(link.id)} 
                className="absolute top-2 right-2 text-red-400 hover:text-red-300 p-1"
                title="Remove Link"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Brand Name</label>
                  <input
                    type="text"
                    value={link.brandName}
                    onChange={(e) => updateLink(link.id, { brandName: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-xs text-white"
                    placeholder="e.g. HDFC Bank"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Title</label>
                  <input
                    type="text"
                    value={link.title}
                    onChange={(e) => updateLink(link.id, { title: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-xs text-white"
                    placeholder="e.g. Personal Loan up to ₹10 Lakh"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Target URL</label>
                  <input
                    type="text"
                    value={link.url}
                    onChange={(e) => updateLink(link.id, { url: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-xs text-white"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Logo URL (Optional)</label>
                  <input
                    type="text"
                    value={link.logoUrl || ''}
                    onChange={(e) => updateLink(link.id, { logoUrl: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-xs text-white"
                    placeholder="https://...logo.png"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Button Text</label>
                    <input
                      type="text"
                      value={link.buttonText || ''}
                      onChange={(e) => updateLink(link.id, { buttonText: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-xs text-white"
                      placeholder="Apply Now"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Badge (Optional)</label>
                    <input
                      type="text"
                      value={link.badgeText || ''}
                      onChange={(e) => updateLink(link.id, { badgeText: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-xs text-white"
                      placeholder="e.g. Instant Approval"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Rating (Optional)</label>
                    <input
                      type="number"
                      min="1" max="5" step="0.1"
                      value={link.rating || ''}
                      onChange={(e) => updateLink(link.id, { rating: parseFloat(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-xs text-white"
                      placeholder="e.g. 4.8"
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Description (Optional)</label>
                  <input
                    type="text"
                    value={link.description || ''}
                    onChange={(e) => updateLink(link.id, { description: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-xs text-white"
                    placeholder="Quick short description..."
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
