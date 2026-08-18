import React from 'react';
import { X, Share, PlusSquare, Download } from 'lucide-react';

interface PwaInstallModalProps {
  onClose: () => void;
}

export const PwaInstallModal: React.FC<PwaInstallModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-sm p-6 overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-amber-400/20 text-amber-400 rounded-2xl flex items-center justify-center mb-4">
            <Download className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-white mb-2">Install Our App</h3>
          <p className="text-sm text-slate-400 mb-6">
            Get instant access to verified promo codes directly from your home screen. No App Store needed!
          </p>

          <div className="w-full bg-slate-800/50 rounded-xl p-4 text-left border border-slate-700 space-y-4 text-sm text-slate-300">
            <div className="flex items-center gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-700 text-white flex items-center justify-center font-bold text-xs">1</span>
              <p>Tap the <Share className="w-4 h-4 inline mx-1" /> Share button on your browser menu.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-700 text-white flex items-center justify-center font-bold text-xs">2</span>
              <p>Select <strong>"Add to Home Screen"</strong> <PlusSquare className="w-4 h-4 inline mx-1" />.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-700 text-white flex items-center justify-center font-bold text-xs">3</span>
              <p>Confirm by tapping <strong>Add</strong>.</p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="mt-6 w-full py-3 rounded-xl bg-amber-400 text-slate-900 font-bold hover:bg-amber-300 transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
