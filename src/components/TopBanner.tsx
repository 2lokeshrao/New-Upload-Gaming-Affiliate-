import React, { useState, useEffect } from 'react';
import { UserGeo } from '../types';
import { ShieldCheck, Flame, Globe, Timer, Copy, Check } from 'lucide-react';

interface ActiveUrgencyTimer {
  platformName: string;
  promoCode: string;
  slug: string;
  endTime: number;
}

interface TopBannerProps {
  geo: UserGeo;
  bannerTemplate: string;
  activeUrgencyTimer?: ActiveUrgencyTimer | null;
}

export const TopBanner: React.FC<TopBannerProps> = ({ geo, bannerTemplate, activeUrgencyTimer }) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(0);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    if (!activeUrgencyTimer) return;

    const calcRemaining = () => {
      const remaining = Math.max(0, Math.floor((activeUrgencyTimer.endTime - Date.now()) / 1000));
      setSecondsLeft(remaining);
    };

    calcRemaining();
    const interval = setInterval(calcRemaining, 1000);
    return () => clearInterval(interval);
  }, [activeUrgencyTimer]);

  const formattedText = bannerTemplate.replace(
    '{{country}}',
    `${geo.flag} ${geo.country || 'Your Region'}`
  );

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Render high-urgency active timer banner if user triggered a claim button
  if (activeUrgencyTimer && secondsLeft > 0) {
    // Dynamic color shift calculation
    const isGreen = secondsLeft > 360; // 6m - 10m
    const isYellow = secondsLeft <= 360 && secondsLeft > 180; // 3m - 6m
    const isRed = secondsLeft <= 180; // < 3m

    const bannerBgClass = isRed
      ? 'bg-gradient-to-r from-red-950 via-rose-950 to-slate-950 border-red-500 '
      : isYellow
      ? 'bg-gradient-to-r from-amber-950 via-slate-950 to-amber-900 border-amber-500/80 '
      : 'bg-gradient-to-r from-emerald-950 via-slate-950 to-emerald-900 border-emerald-500/70';

    const timerBoxClass = isRed
      ? 'text-red-400 border-red-500 bg-red-950/80 ring-2 ring-red-500/60 animate-bounce'
      : isYellow
      ? 'text-amber-300 border-amber-500/80 bg-amber-950/80'
      : 'text-emerald-400 border-emerald-500/60 bg-emerald-950/80';

    const badgeLabel = isRed
      ? '🚨 CRITICAL WARNING - TIMER EXPIRING IN MINUTES!'
      : isYellow
      ? '⚠️ OFFER EXPIRING SOON - REGISTER NOW'
      : '🟢 10-MIN BONUS TIMER ACTIVATED';

    return (
      <div className={`${bannerBgClass} text-white py-2 px-4 shadow-2xl border-b sticky top-0 z-50 backdrop-blur-md transition-colors duration-500`}>
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between text-xs sm:text-sm font-extrabold gap-2">
          <div className="flex items-center gap-2">
            <Timer className={`w-4 h-4 ${isRed ? 'text-red-400 animate-spin' : isYellow ? 'text-amber-400 animate-spin' : 'text-emerald-400'}`} />
            <span className="uppercase tracking-wide">
              {badgeLabel} FOR <span className="text-white underline">{activeUrgencyTimer.platformName}</span>!
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-1.5 font-mono text-sm border px-3 py-1 rounded-lg shadow-inner font-black transition-all ${timerBoxClass}`}>
              <span className="text-[10px] uppercase text-slate-300 font-sans font-bold mr-1">REMAINING:</span>
              <span>{formatTime(secondsLeft)}</span>
            </div>

            <div className="hidden md:flex items-center gap-1.5 bg-slate-900 border border-slate-700 px-2.5 py-1 rounded-lg text-xs">
              <span className="text-slate-300 font-bold">CODE:</span>
              <span className="font-mono text-amber-300 font-black">{activeUrgencyTimer.promoCode}</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(activeUrgencyTimer.promoCode);
                  setCopiedCode(true);
                  window.dispatchEvent(new CustomEvent('show-toast', { detail: 'Banner code copied!' }));
                  setTimeout(() => setCopiedCode(false), 2000);
                }}
                className="ml-1 text-[10px] bg-amber-500/30 text-amber-300 hover:bg-amber-500/50 px-1.5 py-0.5 rounded cursor-pointer"
              >
                {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>

            <a
              href={`/go/${activeUrgencyTimer.slug}`}
              target="_blank"
              rel="noreferrer"
              className={`px-3.5 py-1.5 rounded-lg text-slate-950 font-black text-xs uppercase shadow-lg cursor-pointer transition-transform hover:scale-105 ${
                isRed ? 'bg-red-500 hover:bg-red-400 text-white ' : 'bg-amber-500 hover:bg-amber-400'
              }`}
            >
              FINISH REGISTRATION NOW
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Default banner
  return (
    <div className="bg-gradient-to-r from-purple-900 via-violet-900 to-indigo-950 text-white py-2.5 px-4 shadow-md border-b border-purple-500/30 sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between text-xs sm:text-sm font-medium gap-2">
        <div className="flex items-center gap-2 text-amber-300 font-semibold tracking-wide">
          <Flame className="w-4 h-4 animate-bounce text-amber-400 fill-amber-400" />
          <span>{formattedText}</span>
        </div>

        <div className="hidden sm:flex items-center gap-4 text-slate-300 text-xs">
          <span className="flex items-center gap-1 text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% Verified Platforms
          </span>
          <span className="flex items-center gap-1 text-slate-400">
            <Globe className="w-3.5 h-3.5" /> IP: {geo.ip || 'Detected'}
          </span>
        </div>
      </div>
    </div>
  );
};

