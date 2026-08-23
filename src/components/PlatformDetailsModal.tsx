import React, { useState } from 'react';
import { X, CheckCircle2, Users, FileText, AlertTriangle, PlayCircle, Activity } from 'lucide-react';
import { GamingPlatform } from '../types';
import { LazyImage } from './LazyImage';

interface PlatformDetailsModalProps {
  platform: GamingPlatform;
  onClose: () => void;
}

export const PlatformDetailsModal: React.FC<PlatformDetailsModalProps> = ({ platform, onClose }) => {
  const [activeTab, setActiveTab] = useState<'benefits' | 'whomToSell' | 'howItWorks' | 'tnc'>('benefits');

  const tabs = [
    { id: 'benefits', label: 'Benefits', icon: CheckCircle2 },
    { id: 'whomToSell', label: 'Whom to sell?', icon: Users },
    { id: 'howItWorks', label: 'How it works?', icon: PlayCircle },
    { id: 'tnc', label: 'T&C', icon: FileText }
  ] as const;

  const renderContent = () => {
    switch (activeTab) {
      case 'benefits':
        return (
          <div className="platform-benefits-container space-y-4 sm:space-y-5">
            <h3 className="text-lg font-bold text-white mb-3">Benefits:</h3>
            <ul className="space-y-3">
              {(platform.benefits || []).map((b, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{b}</span>
                </li>
              ))}
              {(!platform.benefits || platform.benefits.length === 0) && (
                <p className="text-slate-500">No specific benefits listed.</p>
              )}
            </ul>
          </div>
        );
      case 'whomToSell':
        return (
          <div className="platform-benefits-container space-y-4 sm:space-y-5">
            <h3 className="text-lg font-bold text-white mb-3">Eligibility / Whom to sell?</h3>
            <ul className="space-y-3">
              {(platform.whomToSell || []).map((w, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-2.5" />
                  <span className="leading-relaxed">{w}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      case 'howItWorks':
        return (
          <div className="platform-benefits-container space-y-4 sm:space-y-5">
            <h3 className="text-lg font-bold text-white mb-3">How it works?</h3>
            <div className="space-y-4">
              {(platform.howItWorks || []).map((h, i) => (
                <p key={i} className="text-slate-300 leading-relaxed flex items-start gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center text-xs font-bold mt-0.5">{i + 1}</span>
                  <span className="mt-0.5">{h.replace(/^\d+\.\s*/, '')}</span>
                </p>
              ))}
            </div>
          </div>
        );
      case 'tnc':
        return (
          <div className="platform-benefits-container space-y-4 sm:space-y-5">
            <h3 className="text-lg font-bold text-white mb-3">Terms & Conditions</h3>
            <div className="space-y-4">
              {(platform.tnc || []).map((t, i) => {
                if (t === 'DOs') return <h4 key={i} className="text-emerald-400 font-bold mt-6 mb-2 uppercase text-sm tracking-wider">DOs</h4>;
                if (t === "DON'Ts") return <h4 key={i} className="text-red-400 font-bold mt-6 mb-2 uppercase text-sm tracking-wider">DON'Ts</h4>;
                return (
                  <div key={i} className="flex items-start gap-3 text-slate-300">
                    <AlertTriangle className="w-4 h-4 text-slate-500 shrink-0 mt-1" />
                    <p className="text-sm leading-relaxed">{t.replace(/^\d+\.\s*/, '')}</p>
                  </div>
                );
              })}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center">
              {platform.logoUrl ? (
                <LazyImage src={platform.logoUrl} alt={platform.name} className="w-8 h-8 object-contain" />
              ) : (
                <span className="font-bold text-slate-400">{platform.name.charAt(0)}</span>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{platform.name}</h2>
              <p className="text-sm text-slate-400">{platform.category}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-slate-800 hide-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-bold whitespace-nowrap transition-colors relative ${
                  isActive ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400" />
                )}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
          {renderContent()}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-slate-800 bg-slate-900/50 flex flex-col gap-4">
          {(platform.category === 'Loans' || platform.category === 'Credit Cards') && (
            <div className="bg-blue-950/40 border border-blue-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="text-left">
                <h4 className="text-blue-400 font-bold text-sm mb-1 flex items-center gap-2">
                  <Activity className="w-4 h-4" /> Step 1: Check Eligibility First
                </h4>
                <p className="text-xs text-slate-300">
                  Check your credit score for <span className="text-white font-bold">FREE</span> & get customised recommendations before applying.
                </p>
              </div>
              <a
                href="https://sales.gromo.in/c/gN1zWIvqOEWeGuKqedkZ8"
                target="_blank"
                rel="noopener noreferrer"
                className="whitespace-nowrap w-full sm:w-auto text-center px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-colors shrink-0 shadow-lg shadow-blue-500/20"
              >
                Check CIBIL Score
              </a>
            </div>
          )}

          <div className="flex flex-col">
            {(platform.category === 'Loans' || platform.category === 'Credit Cards') && (
              <h4 className="text-slate-400 font-bold text-sm mb-2 text-center">Step 2: Apply for {platform.name}</h4>
            )}
            <a
              href={platform.masterPartnerUrl || platform.rawAffiliateUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20"
            >
              Apply Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
