import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { GamingPlatform } from '../types';
import { Smartphone, X, ExternalLink, Copy, Check } from 'lucide-react';

interface ClaimWithQrModalProps {
  platform: GamingPlatform | null;
  isOpen: boolean;
  onClose: () => void;
  onProceedDesktop: () => void;
}

export const ClaimWithQrModal: React.FC<ClaimWithQrModalProps> = ({
  platform,
  isOpen,
  onClose,
  onProceedDesktop
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !platform) return null;

  // The URL encoded in the QR code
  const redirectUrl = `${window.location.origin}/go/${platform.slug}`;
  const promoCode = platform.promoCode || 'MAXBOOST500';

  const handleCopyCode = () => {
    navigator.clipboard.writeText(promoCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-amber-500/60 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative space-y-6 overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute -top-16 -right-16 w-44 h-44 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-black uppercase">
            <Smartphone className="w-3.5 h-3.5 text-amber-400" />
            <span>CONTINUE ON MOBILE OR DESKTOP</span>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <img 
              loading="lazy" 
              decoding="async" 
              width="40"
              height="40"
              src={platform.logoUrl || undefined}
              alt={platform.name}
              className="w-10 h-10 rounded-xl object-cover border border-slate-700 bg-slate-950 shadow-md"
              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAHBJREFUWEft0zEKACAQw8D7/6f90lJwEFzEQe5SU5qsqqpeZ373n/2YczxQYxMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwkro5m+0BP002ATXz2hAAAAAASUVORK5CYII="; }}
            />
            <h2 className="text-2xl font-black text-white tracking-tight">{platform.name}</h2>
          </div>

          <p className="text-xs text-slate-300">
            Scan QR code with your mobile camera for instant 1-tap app registration, or click below to proceed on desktop.
          </p>
        </div>

        {/* QR Code Container */}
        <div className="bg-white p-5 rounded-2xl border-4 border-amber-400/80 shadow-inner flex flex-col items-center justify-center space-y-3 max-w-[240px] mx-auto group">
          <QRCodeSVG
            value={redirectUrl}
            size={180}
            level="H"
            includeMargin={true}
            imageSettings={{
              src: platform.logoUrl,
              x: undefined,
              y: undefined,
              height: 36,
              width: 36,
              excavate: true,
            }}
          />
          <div className="text-center">
            <span className="text-[10px] font-black text-slate-800 uppercase tracking-wider block">
              Scan with Smartphone Camera
            </span>
          </div>
        </div>

        {/* Promo Code Box */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">PROMO CODE</span>
            <span className="font-mono font-black text-amber-300 text-sm tracking-wider">{promoCode}</span>
          </div>

          <button
            onClick={handleCopyCode}
            className="px-3.5 py-1.5 rounded-xl bg-purple-900/80 hover:bg-purple-800 border border-purple-400/40 text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">COPIED</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-purple-300" />
                <span>COPY CODE</span>
              </>
            )}
          </button>
        </div>

        {/* Desktop Proceed Button */}
        <div className="space-y-2">
          <button
            onClick={onProceedDesktop}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
          >
            <span>CONTINUE ON DESKTOP DIRECTLY</span>
            <ExternalLink className="w-4 h-4" />
          </button>

          <p className="text-[10px] text-center text-slate-400">
            🔒 100% SSL Encrypted & Official VIP Registration Partner Link
          </p>
        </div>
      </div>
    </div>
  );
};
