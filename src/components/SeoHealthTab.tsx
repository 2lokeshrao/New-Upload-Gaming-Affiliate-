import React, { useState } from 'react';
import { GamingPlatform } from '../types';
import { Activity, CheckCircle2, AlertTriangle, Wand2, Save } from 'lucide-react';

interface SeoHealthTabProps {
  platforms: GamingPlatform[];
  onSavePlatforms: (updated: GamingPlatform[]) => void;
}

export const SeoHealthTab: React.FC<SeoHealthTabProps> = ({ platforms, onSavePlatforms }) => {
  const [localPlatforms, setLocalPlatforms] = useState<GamingPlatform[]>(platforms);
  const [savedToast, setSavedToast] = useState(false);

  // Helper to truncate text
  const truncateSeoText = (text: string | undefined, max: number) => {
    if (!text) return '';
    if (text.length <= max) return text;
    const truncated = text.substring(0, max - 3).trim();
    return `${truncated}...`;
  };

  const handleBulkFix = () => {
    const updated = localPlatforms.map(p => ({
      ...p,
      metaTitle: p.metaTitle ? truncateSeoText(p.metaTitle, 60) : p.metaTitle,
      metaDescription: p.metaDescription ? truncateSeoText(p.metaDescription, 160) : p.metaDescription
    }));
    setLocalPlatforms(updated);
  };

  const handleSave = () => {
    onSavePlatforms(localPlatforms);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  const problematicPlatforms = localPlatforms.filter(
    p => (p.metaTitle && p.metaTitle.length > 60) || (p.metaDescription && p.metaDescription.length > 160)
  );

  return (
    <div className="space-y-6">
      {savedToast && (
        <div className="fixed top-20 right-6 z-[200] bg-emerald-500 text-slate-950 font-black px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-emerald-300 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>SEO Data Successfully Saved!</span>
        </div>
      )}

      <div className="bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-blue-400 font-extrabold text-xs uppercase tracking-wider">
            <Activity className="w-4 h-4 text-blue-400" />
            <span>SEO Health Monitor</span>
          </div>
          <h2 className="text-xl font-black text-white">Google Optimization Limits</h2>
          <p className="text-xs text-slate-300">
            Monitor and bulk-fix meta tags exceeding recommended character limits (60 for titles, 160 for descriptions).
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleBulkFix}
            disabled={problematicPlatforms.length === 0}
            className={`px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-transform cursor-pointer ${
              problematicPlatforms.length > 0 
                ? 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 text-slate-950 hover:scale-105 shadow-blue-500/20' 
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <Wand2 className="w-4 h-4" />
            <span>Bulk Fix Limits</span>
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-105"
          >
            <Save className="w-4 h-4" />
            <span>Save All Changes</span>
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-950 text-slate-400 font-extrabold text-[10px] uppercase tracking-wider">
              <tr>
                <th className="p-4 border-b border-slate-800">Platform</th>
                <th className="p-4 border-b border-slate-800">Title Length (Max 60)</th>
                <th className="p-4 border-b border-slate-800">Description Length (Max 160)</th>
                <th className="p-4 border-b border-slate-800 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {localPlatforms.map((platform) => {
                const titleLen = platform.metaTitle?.length || 0;
                const descLen = platform.metaDescription?.length || 0;
                const titleExceeds = titleLen > 60;
                const descExceeds = descLen > 160;
                const isProblematic = titleExceeds || descExceeds;

                return (
                  <tr key={platform.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-bold text-slate-200">{platform.name}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold ${titleExceeds ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-emerald-400'}`}>
                        {titleLen} / 60
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold ${descExceeds ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-emerald-400'}`}>
                        {descLen} / 160
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {isProblematic ? (
                        <span className="inline-flex items-center gap-1.5 text-amber-400 text-xs font-bold">
                          <AlertTriangle className="w-4 h-4" />
                          Requires Fix
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                          <CheckCircle2 className="w-4 h-4" />
                          Optimized
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
