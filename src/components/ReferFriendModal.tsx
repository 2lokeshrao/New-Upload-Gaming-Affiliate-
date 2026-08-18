import React, { useState } from 'react';
import { X, Gift, Copy, Check } from 'lucide-react';

interface ReferFriendModalProps {
  onClose: () => void;
}

export const ReferFriendModal: React.FC<ReferFriendModalProps> = ({ onClose }) => {
  const [copied, setCopied] = useState(false);
  const referralLink = "https://bonuspromocode.in/ref/XJ92K1"; // Example tracking URL

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    window.dispatchEvent(new CustomEvent('show-toast', { detail: 'Referral link copied!' }));
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md p-6 overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-4">
            <Gift className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black text-white mb-2">Refer a Friend</h3>
          <p className="text-sm text-slate-400 mb-6">
            Share this unique tracking URL with your friends. When they use our verified promo codes, you earn extra loyalty points!
          </p>

          <div className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 flex items-center mb-6">
            <input 
              type="text" 
              readOnly 
              value={referralLink}
              className="bg-transparent border-none outline-none text-slate-300 text-sm flex-1 px-3 w-full"
            />
            <button
              onClick={handleCopy}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-colors ${
                copied ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-white hover:bg-slate-700'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          
          <p className="text-xs text-slate-500">
            Terms and conditions apply. Points are credited within 24 hours of successful redemption.
          </p>
        </div>
      </div>
    </div>
  );
};
