import React from 'react';
import { ShieldAlert, Award, Zap, ChevronDown, Mail, Terminal } from 'lucide-react';
import { AbTestConfig } from '../types';

interface HeroProps {
  headline: string;
  subheading: string;
  onScrollToOffers: () => void;
  abTestConfig?: AbTestConfig;
}

export const HeroSection: React.FC<HeroProps> = ({ headline, subheading, onScrollToOffers, abTestConfig }) => {
  const isVariantB = abTestConfig?.enabled && abTestConfig.heroDesign === 'variant_b';
  const buttonColor = abTestConfig?.buttonColor || 'amber';

  let buttonBgClass = "from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-amber-500/25";
  if (buttonColor === 'emerald') {
    buttonBgClass = "from-emerald-500 via-emerald-400 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 shadow-emerald-500/25";
  } else if (buttonColor === 'purple') {
    buttonBgClass = "from-purple-600 via-fuchsia-500 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white shadow-purple-500/30";
  }

  if (isVariantB) {
    return (
      <section className="relative overflow-hidden pt-12 pb-20 px-4 bg-slate-950 border-b border-cyan-500/30 shadow-2xl">
        {/* Cyber Neon Background graphics */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-purple-600/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-10 right-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Cyberpunk pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/50 text-cyan-300 text-xs sm:text-sm font-black mb-6 shadow-xl shadow-cyan-500/10 tracking-widest uppercase">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>CYBER NEON VIP REWARDS HUB [2026 EDITION]</span>
            <span className="w-2 h-2 rounded-full bg-cyan-400 " />
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12] mb-6">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-fuchsia-500 bg-clip-text text-transparent">
              {headline}
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-xl max-w-3xl mx-auto font-medium leading-relaxed mb-8">
            {subheading}
          </p>

          <div className="grid grid-cols-4 gap-1 sm:gap-3 max-w-3xl mx-auto mb-6 sm:mb-10 text-slate-300 text-[9px] sm:text-sm font-mono">
            <div className="bg-slate-900/90 border border-purple-500/30 rounded-2xl p-1.5 sm:p-3 flex flex-col items-center justify-center">
              <span className="text-purple-400 font-bold text-xs sm:text-lg">500% BOOST</span>
              <span className="text-slate-400 text-[8px] sm:text-[10px]">VERIFIED CODES</span>
            </div>
            <div className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-1.5 sm:p-3 flex flex-col items-center justify-center">
              <span className="text-cyan-400 font-bold text-xs sm:text-lg">INSTANT PIX/UPI</span>
              <span className="text-slate-400 text-[8px] sm:text-[10px]">0% WITHDRAWAL FEES</span>
            </div>
            <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-1.5 sm:p-3 flex flex-col items-center justify-center">
              <span className="text-emerald-400 font-bold text-xs sm:text-lg">NO KYC PASS</span>
              <span className="text-slate-400 text-[8px] sm:text-[10px]">DIRECT REGISTER</span>
            </div>
            <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-1.5 sm:p-3 flex flex-col items-center justify-center">
              <span className="text-amber-400 font-bold text-xs sm:text-lg">24/7 LIVE</span>
              <span className="text-slate-400 text-[8px] sm:text-[10px]">TELEGRAM SUPPORT</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onScrollToOffers}
              className={`w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r ${buttonBgClass} font-black text-lg sm:text-xl shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3 cursor-pointer group`}
            >
              <Zap className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span>CLAIM 500% BONUS NOW</span>
              <ChevronDown className="w-5 h-5 animate-bounce ml-1" />
            </button>


          </div>
        </div>
      </section>
    );
  }

  // Variant A: Classic Gold Casino
  return (
    <section className="relative overflow-hidden pt-10 pb-16 px-4 bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950 border-b border-slate-800/80">
      {/* Background glow graphics */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-purple-600/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Trust pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/40 text-amber-300 text-xs sm:text-sm font-semibold mb-6 shadow-lg shadow-amber-500/5">
          <Award className="w-4 h-4 text-amber-400" />
          <span>OFFICIAL 2026 VERIFIED GAMING REWARDS HUB</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500  ml-1" />
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-6 drop-shadow-md">
          {headline.split(' ').map((word, i) => {
            if (word.toLowerCase().includes('guaranteed') || word.toLowerCase().includes('bonuses') || word.toLowerCase().includes('100%')) {
              return (
                <span key={i} className="bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 bg-clip-text text-transparent underline decoration-amber-500/30">
                  {word}{' '}
                </span>
              );
            }
            return word + ' ';
          })}
        </h1>

        {/* Subheading */}
        <p className="text-slate-300 text-base sm:text-xl max-w-3xl mx-auto font-normal leading-relaxed mb-8">
          {subheading}
        </p>

        {/* Value metrics pill bar */}
        <div className="grid grid-cols-4 gap-1.5 sm:gap-3 max-w-3xl mx-auto mb-6 sm:mb-10 text-slate-300 text-[9px] sm:text-sm font-medium">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-1.5 sm:p-3 flex flex-col items-center justify-center">
            <span className="text-amber-400 font-bold text-xs sm:text-lg">Up to 500%</span>
            <span className="text-slate-400 text-[8px] sm:text-[11px]">Deposit Bonuses</span>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-1.5 sm:p-3 flex flex-col items-center justify-center">
            <span className="text-cyan-400 font-bold text-xs sm:text-lg">Instant</span>
            <span className="text-slate-400 text-[8px] sm:text-[11px]">UPI / Pix Withdrawals</span>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-1.5 sm:p-3 flex flex-col items-center justify-center">
            <span className="text-emerald-400 font-bold text-xs sm:text-lg">No KYC</span>
            <span className="text-slate-400 text-[8px] sm:text-[11px]">Fast Registration</span>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-1.5 sm:p-3 flex flex-col items-center justify-center">
            <span className="text-purple-400 font-bold text-xs sm:text-lg">24/7 Verified</span>
            <span className="text-slate-400 text-[8px] sm:text-[11px]">Licensed Sites Only</span>
          </div>
        </div>

        {/* Main CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onScrollToOffers}
            className={`w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r ${buttonBgClass} font-extrabold text-lg sm:text-xl shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3 cursor-pointer group`}
          >
            <Zap className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span>CLAIM VERIFIED BONUSES NOW</span>
            <ChevronDown className="w-5 h-5 animate-bounce ml-1" />
          </button>


        </div>

        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
          <span>18+ Play Responsibly | Licensed Gaming Regulators</span>
        </div>
      </div>
    </section>
  );
};

