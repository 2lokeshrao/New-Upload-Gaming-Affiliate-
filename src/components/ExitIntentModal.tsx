import React, { useState, useEffect } from 'react';
import { GamingPlatform, ExitIntentPopupConfig } from '../types';
import { Sparkles, Copy, ExternalLink, X, Flame, ShieldAlert, Award } from 'lucide-react';

interface ExitIntentModalProps {
  topPlatform: GamingPlatform;
  exitIntentConfig?: ExitIntentPopupConfig;
  onClaimClick: (platform: GamingPlatform) => void;
  onCopyCode: (platform: GamingPlatform) => void;
}

export const ExitIntentModal: React.FC<ExitIntentModalProps> = ({
  topPlatform,
  exitIntentConfig,
  onClaimClick,
  onCopyCode
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Check if disabled from admin
  if (exitIntentConfig?.enabled === false) {
    return null;
  }

  // Determine effective values from admin exitIntentConfig override or topPlatform fallback
  const isCustom = exitIntentConfig?.overridePlatformId === 'custom';
  
  const displayBrandName = isCustom && exitIntentConfig?.customBrandName 
    ? exitIntentConfig.customBrandName 
    : (topPlatform?.name || 'VIP Casino');

  const displayLogoUrl = isCustom && exitIntentConfig?.customLogoUrl 
    ? exitIntentConfig.customLogoUrl 
    : (topPlatform?.logoUrl || '');

  const displayTitle = exitIntentConfig?.customTitle 
    ? exitIntentConfig.customTitle 
    : `${displayBrandName} VIP Bonus Unlocked`;

  const displayBonusText = exitIntentConfig?.customBonusText 
    ? exitIntentConfig.customBonusText 
    : (topPlatform?.bonusText || '500% Deposit Match + 100 Free Spins');

  const displayPromoCode = exitIntentConfig?.customPromoCode 
    ? exitIntentConfig.customPromoCode 
    : (topPlatform?.promoCode || 'BONUSVIP');

  const displayBadgeText = exitIntentConfig?.customBadgeText 
    ? exitIntentConfig.customBadgeText 
    : 'EXCLUSIVE VIP OFFER';

  const displayButtonText = exitIntentConfig?.customButtonText 
    ? exitIntentConfig.customButtonText 
    : 'CLAIM 500% BONUS INSTANTLY';

  const targetPlatformOrCustom: GamingPlatform = isCustom && exitIntentConfig?.customAffiliateUrl ? {
    id: 'exit_custom',
    slug: 'exit-vip-offer',
    name: displayBrandName,
    logoUrl: displayLogoUrl,
    rating: 9.9,
    starRating: 5,
    badges: ['Verified VIP'],
    bonusText: displayBonusText,
    promoCode: displayPromoCode,
    rawAffiliateUrl: exitIntentConfig.customAffiliateUrl,
    isFeatured: true,
    featuredRank: 1,
    isActive: true,
    category: 'VIP Promotion',
    clicksCount: 0,
    copiesCount: 0
  } : topPlatform;

  useEffect(() => {
    // Check if exit intent was already triggered during this session
    const alreadyShown = sessionStorage.getItem('exit_intent_shown');
    if (alreadyShown) return;

    const handleMouseLeave = (e: MouseEvent) => {
      // Trigger if cursor leaves viewport at top boundary
      if (e.clientY <= 15 || e.relatedTarget === null) {
        triggerModal();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Potential exit on mobile or tab switch
        triggerModal();
      }
    };

    const triggerModal = async () => {
      if (!sessionStorage.getItem('exit_intent_shown')) {
        sessionStorage.setItem('exit_intent_shown', 'true');
        setIsOpen(true);
        try {
          const confetti = (await import("canvas-confetti")).default;
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.4 }
          });
        } catch (err) {
          console.log('Confetti effect:', err);
        }
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  if (!isOpen || !topPlatform) return null;

  const handleCopy = () => {
    onCopyCode(targetPlatformOrCustom);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border-2 border-amber-500/80 rounded-3xl p-6 md:p-8 shadow-2xl shadow-amber-500/20 overflow-hidden">
        {/* Glow ambient background element */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close button */}
        <button
          onClick={() => setIsOpen(false)}
          aria-label="Close modal"
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="flex items-center justify-start gap-2 mb-4">
          <span className="px-3.5 py-1.5 rounded-full bg-red-500/20 text-red-400 font-black text-xs border border-red-500/40 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            {displayBadgeText}
          </span>
        </div>

        {/* Hero Card Content */}
        <div className="text-center space-y-4">
          {displayLogoUrl && (
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-slate-950 border border-slate-800 shadow-inner">
              <img width="40" height="40" decoding="async" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAHBJREFUWEft0zEKACAQw8D7/6f90lJwEFzEQe5SU5qsqqpeZ373n/2YczxQYxMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwkro5m+0BP002ATXz2hAAAAAASUVORK5CYII="; }} loading="lazy"
                src={displayLogoUrl || undefined}
                alt={displayBrandName}
                className="h-12 object-contain"
              />
            </div>
          )}

          <div>
            <h3 className="text-2xl font-black text-white flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 text-amber-400 shrink-0" />
              <span>{displayTitle}</span>
            </h3>
            <p className="text-amber-300 font-extrabold text-lg mt-1">
              {displayBonusText}
            </p>
          </div>

          {/* Promo Code Box */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/40 space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Exclusive VIP Promo Code
            </div>
            <div className="flex items-center justify-between bg-slate-900 rounded-xl p-2.5 border border-slate-800">
              <span className="text-xl font-mono font-black text-amber-400 tracking-wider pl-2">
                {displayPromoCode}
              </span>

              <button
                onClick={handleCopy}
                className="px-4 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5"
              >
                <Copy className="w-4 h-4" />
                <span>{copied ? 'COPIED!' : 'COPY CODE'}</span>
              </button>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-2 gap-2 text-left text-xs font-semibold text-slate-300">
            <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-950/60 border border-slate-800">
              <Award className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Verified 100% Working</span>
            </div>
            <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-950/60 border border-slate-800">
              <Flame className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Instant Payouts</span>
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            onClick={() => {
              setIsOpen(false);
              onClaimClick(targetPlatformOrCustom);
            }}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm tracking-wide shadow-xl shadow-amber-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer group hover:scale-[1.02]"
          >
            <span>{displayButtonText}</span>
            <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => setIsOpen(false)}
            className="text-xs text-slate-500 hover:text-slate-400 cursor-pointer underline"
          >
            No thanks, I will forfeit this exclusive bonus
          </button>
        </div>
      </div>
    </div>
  );
};
