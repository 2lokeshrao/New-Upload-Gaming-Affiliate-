import React, { useState } from 'react';
import { CustomCoupon } from '../types';
import { Ticket, Copy, Check, Sparkles, ExternalLink, Flame } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { formatLocalizedBonus } from '../utils/currency';

interface CustomCouponsSectionProps {
  coupons: CustomCoupon[];
  onClaimCoupon: (coupon: CustomCoupon) => void;
}

export const CustomCouponsSection: React.FC<CustomCouponsSectionProps> = ({ coupons, onClaimCoupon }) => {
  const { language } = useLanguage();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeCoupons = coupons.filter(c => c.isActive);

  if (!activeCoupons || activeCoupons.length === 0) return null;

  const handleCopy = (coupon: CustomCoupon, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(coupon.code);
    setCopiedId(coupon.id);
    window.dispatchEvent(new CustomEvent('show-toast', { detail: 'Coupon copied!' }));
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section className="py-10 px-4 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-purple-950/80 via-slate-900 to-slate-950 border border-purple-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>SPECIAL EVENT & CUSTOM PROMO CODES</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Featured Custom Promotional Coupons</span>
              <Flame className="w-6 h-6 text-amber-400 " />
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
              Exclusive promo codes for partner brands, cricket tournaments, and special casino rewards.
            </p>
          </div>

          <div className="text-right hidden sm:block">
            <span className="text-xs text-emerald-400 font-extrabold bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
              ✓ Verified & Tested Today
            </span>
          </div>
        </div>

        {/* Coupon Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {activeCoupons.map(coupon => (
            <div
              key={coupon.id}
              className="bg-slate-900/90 border border-purple-500/30 hover:border-purple-400/60 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4 group transition-all transform hover:-translate-y-1"
            >
              <div className="space-y-3">
                {/* Brand Badge & Category */}
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-purple-950 border border-purple-500/40 text-purple-300 font-black text-xs flex items-center gap-1.5">
                    <Ticket className="w-3.5 h-3.5 text-amber-400" />
                    <span>{coupon.brandName}</span>
                  </span>

                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-[10px] font-extrabold uppercase">
                    {coupon.badgeText || coupon.category || 'SPECIAL OFFER'}
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-base font-black text-white group-hover:text-purple-300 transition-colors leading-tight">
                    {formatLocalizedBonus(coupon.title, language)}
                  </h3>
                  <p className="text-slate-300 text-xs mt-1.5 leading-relaxed line-clamp-2">
                    {formatLocalizedBonus(coupon.description, language)}
                  </p>
                </div>
              </div>

              {/* Code Box & Claim CTA */}
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <div className="bg-slate-950 border border-dashed border-purple-500/50 rounded-xl p-2.5 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">PROMO CODE</span>
                    <span className="font-mono font-black text-amber-300 text-sm">{coupon.code}</span>
                  </div>

                  <button
                    onClick={(e) => handleCopy(coupon, e)}
                    className="px-3 py-1.5 rounded-lg bg-purple-900/80 hover:bg-purple-800 border border-purple-400/40 text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    {copiedId === coupon.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">COPIED</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-purple-300" />
                        <span>COPY</span>
                      </>
                    )}
                  </button>
                </div>

                <a
                  href={coupon.targetUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => onClaimCoupon(coupon)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
                >
                  <span>CLAIM THIS COUPON</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
