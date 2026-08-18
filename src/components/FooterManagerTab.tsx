import React, { useState } from 'react';
import { GlobalConfig, FooterColumn } from '../types';
import { Menu, Plus, Trash2, Save, CheckCircle2 } from 'lucide-react';

interface FooterManagerTabProps {
  config: GlobalConfig;
  onSaveConfig: (updatedConfig: GlobalConfig) => void;
}

export const FooterManagerTab: React.FC<FooterManagerTabProps> = ({ config, onSaveConfig }) => {
  const defaultColumns: FooterColumn[] = [
    {
      id: 'col_1',
      title: 'Financial Hub',
      links: [
        { label: 'Virtual Cards', url: '/banking/best-virtual-cards-for-gaming' },
        { label: 'Instant Loans', url: '/loans/instant-personal-loans-online' },
        { label: 'Credit Card Guide', url: '/payments/credit-card-deposit-guide' }
      ]
    },
    {
      id: 'col_2',
      title: 'Crypto Wallets',
      links: [
        { label: 'Binance Guide', url: '/crypto/binance-usdt-withdrawal-guide' },
        { label: 'Bybit Deposits', url: '/crypto/bybit-deposit-guide' },
        { label: 'AstroPay Wallet', url: '/wallets/astropay' }
      ]
    }
  ];

  const [columns, setColumns] = useState<FooterColumn[]>(config.footerColumns || defaultColumns);
  const [savedToast, setSavedToast] = useState(false);

  const [footerDisclaimerText, setFooterDisclaimerText] = useState(config.footerDisclaimerText || 'This site is an independent gaming review and affiliate portal. We provide promotional bonus codes and reviews for licensed online gaming and sports platforms. Please gamble responsibly. 18+ Only.');
  const [copyrightText, setCopyrightText] = useState(config.copyrightText || `BonusPromoCode.in Affiliate Portal &copy; ${new Date().getFullYear()}`);


  const handleAddColumn = () => {
    if (columns.length >= 4) return alert("Maximum 4 columns allowed.");
    setColumns([...columns, { id: 'col_' + Date.now(), title: 'New Column', links: [] }]);
  };

  const handleDeleteColumn = (id: string) => {
    setColumns(columns.filter(c => c.id !== id));
  };

  const handleUpdateColumnTitle = (id: string, title: string) => {
    setColumns(columns.map(c => c.id === id ? { ...c, title } : c));
  };

  const handleAddLink = (colId: string) => {
    setColumns(columns.map(c => {
      if (c.id === colId) {
        return { ...c, links: [...c.links, { label: 'New Link', url: '/' }] };
      }
      return c;
    }));
  };

  const handleUpdateLink = (colId: string, linkIndex: number, field: 'label' | 'url', value: string) => {
    setColumns(columns.map(c => {
      if (c.id === colId) {
        const newLinks = [...c.links];
        newLinks[linkIndex] = { ...newLinks[linkIndex], [field]: value };
        return { ...c, links: newLinks };
      }
      return c;
    }));
  };

  const handleDeleteLink = (colId: string, linkIndex: number) => {
    setColumns(columns.map(c => {
      if (c.id === colId) {
        const newLinks = [...c.links];
        newLinks.splice(linkIndex, 1);
        return { ...c, links: newLinks };
      }
      return c;
    }));
  };

  const handleSave = () => {
    onSaveConfig({ ...config, footerColumns: columns, copyrightText, footerDisclaimerText });


    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Menu className="w-5 h-5 text-cyan-400" />
            Footer Links Manager
          </h2>
          <p className="text-xs text-slate-400">Customize the columns and links displayed in the website footer.</p>
        </div>
        <button 
          onClick={handleSave} 
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded font-bold text-sm flex items-center gap-2"
        >
          {savedToast ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {savedToast ? 'Saved!' : 'Save Footer'}
        </button>
      </div>


      
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-6 space-y-4">
        <div>
          <label className="block text-white font-bold mb-2">Copyright & Footer Text</label>
          <input 
            type="text" 
            value={copyrightText}
            onChange={e => setCopyrightText(e.target.value)}
            placeholder="e.g. My Website &copy; 2024"
            className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white"
          />
          <p className="text-xs text-slate-400 mt-2">Use &amp;copy; for the copyright symbol.</p>
        </div>
        <div>
          <label className="block text-white font-bold mb-2">Footer Disclaimer Text</label>
          <textarea 
            rows={3}
            value={footerDisclaimerText}
            onChange={e => setFooterDisclaimerText(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


        {columns.map(col => (
          <div key={col.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <input 
                type="text" 
                value={col.title}
                onChange={e => handleUpdateColumnTitle(col.id, e.target.value)}
                className="bg-transparent border-b border-slate-700 text-white font-bold px-1 py-1 focus:outline-none focus:border-amber-400 w-2/3"
              />
              <button onClick={() => handleDeleteColumn(col.id)} className="text-red-400 hover:text-red-300 p-1">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-3 mb-4">
              {col.links.map((link, idx) => (
                <div key={idx} className="flex gap-2 items-center bg-slate-950 p-2 rounded-lg border border-slate-800">
                  <div className="flex-1 space-y-2">
                    <input 
                      type="text" 
                      value={link.label}
                      onChange={e => handleUpdateLink(col.id, idx, 'label', e.target.value)}
                      placeholder="Link Label"
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                    />
                    <input 
                      type="text" 
                      value={link.url}
                      onChange={e => handleUpdateLink(col.id, idx, 'url', e.target.value)}
                      placeholder="/url-slug"
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-400 font-mono"
                    />
                  </div>
                  <button onClick={() => handleDeleteLink(col.id, idx)} className="p-2 text-slate-500 hover:text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            
            <button 
              onClick={() => handleAddLink(col.id)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-bold rounded flex items-center justify-center gap-1"
            >
              <Plus className="w-3 h-3" /> Add Link
            </button>
          </div>
        ))}
        
        {columns.length < 4 && (
          <div className="border-2 border-dashed border-slate-800 rounded-xl p-5 flex flex-col items-center justify-center text-center">
             <button 
                onClick={handleAddColumn}
                className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-cyan-400 hover:bg-slate-700 hover:scale-105 transition-all mb-3"
              >
                <Plus className="w-6 h-6" />
              </button>
              <h4 className="text-white font-bold">Add Column</h4>
              <p className="text-xs text-slate-500 mt-1">Up to 4 columns max</p>
          </div>
        )}
      </div>
    </div>
  );
};
