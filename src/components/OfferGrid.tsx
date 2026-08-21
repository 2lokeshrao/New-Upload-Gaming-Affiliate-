import React, { useState } from 'react';
import { GamingPlatform, UserGeo } from '../types';
import { Star, ShieldCheck, Copy, ExternalLink, Flame, Sparkles, Users, QrCode, MessageSquare, Wallet } from 'lucide-react';
import { UrgencyTimer } from './UrgencyTimer';
import { AdContainer } from './AdContainer';
import { useLanguage } from '../i18n/LanguageContext';
import { formatLocalizedBonus } from '../utils/currency';
import { LazyImage } from './LazyImage';


interface OfferGridProps {
  platforms: GamingPlatform[];
  geo?: UserGeo;
  onClaimClick: (platform: GamingPlatform) => void;
  onCopyCode: (platform: GamingPlatform) => void;
  onSubPartnerClick?: (platform: GamingPlatform) => void;
  onOpenQrModal?: (platform: GamingPlatform) => void;
  onOpenFeedbackModal?: (platform: GamingPlatform) => void;
}

export const OfferGrid: React.FC<OfferGridProps> = ({
  platforms,
  geo,
  onClaimClick,
  onCopyCode,
  onSubPartnerClick,
  onOpenQrModal,
  onOpenFeedbackModal
}) => {
  const { language, t } = useLanguage();
  const activePlatforms = platforms.filter(p => p.isActive);
  
  // Localized redirect logic: Prioritize specific offers based on UserGeo (e.g., India)
  const sortedPlatforms = [...activePlatforms].sort((a, b) => {
    if (geo?.countryCode === 'IN') {
      // Prioritize platforms that might support UPI (just as an example logic, we'll boost '1win' and 'parimatch')
      const aIsLocal = a.name.toLowerCase().includes('1win') || a.name.toLowerCase().includes('parimatch') || a.name.toLowerCase().includes('melbet');
      const bIsLocal = b.name.toLowerCase().includes('1win') || b.name.toLowerCase().includes('parimatch') || b.name.toLowerCase().includes('melbet');
      
      if (aIsLocal && !bIsLocal) return -1;
      if (!aIsLocal && bIsLocal) return 1;
    }
    return 0; // fallback to original order
  });

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (p: GamingPlatform, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(p.promoCode);
    setCopiedId(p.id);
    onCopyCode(p);
    const confetti = (await import("canvas-confetti")).default;
    confetti({
      particleCount: 35,
      spread: 50,
      origin: { y: 0.8 }
    });
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <section id="offers-list" className="py-12 px-4 max-w-7xl mx-auto scroll-mt-20">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t('grid.title')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            {t('grid.subtitle')}
          </h2>
        </div>
        <div className="text-slate-400 text-xs font-medium bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Showing {activePlatforms.length} Active Verified Partners</span>
        </div>
      </div>

      <div className="space-y-4">
        {sortedPlatforms.map((p, index) => (
          <React.Fragment key={p.id}>
            <div
              className="bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-4 sm:p-5 transition-all duration-200 hover:shadow-xl hover:shadow-purple-900/10 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
            {/* Brand Logo & Name */}
            <div className="flex items-center gap-4 lg:w-1/4">
              <span className="font-extrabold text-slate-500 text-sm w-5 text-center shrink-0">
                #{index + 1}
              </span>
              <LazyImage
                priority={index < 2}
                src={"/api/cdn/images/" + p.id + ".webp"}
                alt={p.name}
                width="64"
                height="64"
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl border border-slate-700 bg-slate-800"
              />
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-white leading-tight flex items-center flex-wrap gap-2">
                  {p.name}
                  {p.isFeatured && !p.featuredRank && (
                    <span className="bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
                      FEATURED
                    </span>
                  )}
                  {p.isFeatured && p.featuredRank === 1 && (
                    <span className="bg-yellow-500/20 border border-yellow-500/50 text-yellow-300 text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 shadow-[0_0_8px_rgba(234,179,8,0.4)]">
                      🥇 GOLD RANK
                    </span>
                  )}
                  {p.isFeatured && p.featuredRank === 2 && (
                    <span className="bg-slate-300/20 border border-slate-300/50 text-slate-200 text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1">
                      🥈 SILVER RANK
                    </span>
                  )}
                  {p.isFeatured && p.featuredRank === 3 && (
                    <span className="bg-orange-700/30 border border-orange-500/50 text-orange-300 text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1">
                      🥉 BRONZE RANK
                    </span>
                  )}
                  {/* Conditional HOT badge for high CTR / popular offers */}
                  {(p.clicksCount > 500) && (
                    <span className="relative flex items-center justify-center ml-1">
                      <span className=" absolute inline-flex h-full w-full rounded-md bg-red-500 opacity-40"></span>
                      <span className="relative bg-gradient-to-r from-red-600 to-rose-600 border border-red-400 text-white text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 shadow-[0_0_10px_rgba(225,29,72,0.5)]">
                        <Flame className="w-3 h-3 text-white fill-white" />
                        HOT
                      </span>
                    </span>
                  )}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex" title={`${p.averageUserRating || p.starRating} out of 5 stars`}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${i < Math.floor(p.averageUserRating || p.starRating) ? 'fill-amber-400 text-amber-400' : 'fill-slate-700 text-slate-700'}`} />
                    ))}
                  </div>
                  <span className="text-xs text-amber-400 font-bold">{p.averageUserRating?.toFixed(1) || p.starRating}.0 / 5.0</span>
                  <span className="text-[10px] sm:text-xs text-slate-500 font-medium hidden sm:inline-block">({(p.totalReviewsCount || 10500).toLocaleString()} Reviews)</span>
                </div>
                <span className="text-[11px] text-slate-400 block mt-1">{p.category}</span>
              </div>
            </div>

            {/* Bonus Details & Badges */}
            <div className="flex-1 lg:w-2/4">
              <div className="bg-gradient-to-r from-purple-950/60 to-slate-950 border border-purple-500/30 rounded-xl p-3 mb-2 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-extrabold text-amber-400 tracking-wider block">
                    EXCLUSIVE PROMO OFFER
                  </span>
                  <span className="text-sm sm:text-base font-extrabold text-white">
                    {formatLocalizedBonus(p.bonusText, language)}
                  </span>
                </div>
                <UrgencyTimer initialMinutes={19} initialSeconds={30} variant="card" />
              </div>

              <div className="flex flex-wrap gap-1.5 mt-2">
                <span className="text-[11px] bg-emerald-950/50 border border-emerald-800 text-emerald-400 px-2.5 py-1 rounded-md font-bold flex items-center gap-1 shadow-[0_0_10px_rgba(16,185,129,0.15)]">
                  ✓ {t('badge.verified')}
                </span>
                <span className="text-[11px] bg-indigo-950/50 border border-indigo-800 text-indigo-400 px-2.5 py-1 rounded-md font-bold flex items-center gap-1">
                  ✓ {t('badge.fastWithdraw')}
                </span>
                {p.badges.map((badge, bIdx) => (
                  <span
                    key={bIdx}
                    className="text-[11px] bg-slate-950 border border-slate-800 text-slate-300 px-2.5 py-1 rounded-md font-medium"
                  >
                    ✓ {badge}
                  </span>
                ))}
              </div>

              {/* Localized Payments based on Language / Geo */}
              <div className="mt-3 flex items-center gap-2 flex-wrap">
                <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1 uppercase tracking-wider">
                  <Wallet className="w-3 h-3" /> {t('payment.local')}
                </span>
                <div className="flex gap-2 text-xs font-bold text-slate-300">
                  {language === 'pt' && (
                    <>
                      <span className="px-2 py-0.5 rounded bg-[#32BCAD]/10 border border-[#32BCAD]/30 text-[#32BCAD]">Pix</span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">PicPay</span>
                    </>
                  )}
                  {language === 'hi' && (
                    <>
                      <span className="px-2 py-0.5 rounded bg-[#32BCAD]/10 border border-[#32BCAD]/30 text-[#32BCAD]">UPI</span>
                      <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-400">Paytm</span>
                      <span className="px-2 py-0.5 rounded bg-green-500/10 border border-green-500/30 text-green-400">PhonePe</span>
                    </>
                  )}
                  {language === 'ru' && (
                    <>
                      <span className="px-2 py-0.5 rounded bg-[#F7931A]/10 border border-[#F7931A]/30 text-[#F7931A]">Bitcoin</span>
                      <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-400">Mir</span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">Piastrix</span>
                    </>
                  )}
                  {language === 'es' && (
                    <>
                      <span className="px-2 py-0.5 rounded bg-[#F7931A]/10 border border-[#F7931A]/30 text-[#F7931A]">Bitcoin</span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">Mercado Pago</span>
                      <span className="px-2 py-0.5 rounded bg-red-500/10 border border-red-500/30 text-red-400">OXXO</span>
                    </>
                  )}
                  {['en', 'fr', 'de', 'it', 'pl'].includes(language) && (
                    <>
                      <span className="px-2 py-0.5 rounded bg-[#F7931A]/10 border border-[#F7931A]/30 text-[#F7931A]">Crypto</span>
                      <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-400">Visa / MC</span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">Skrill</span>
                    </>
                  )}
                  {['zh-CN', 'ja', 'ko', 'vi', 'th', 'id', 'ar', 'tr'].includes(language) && (
                    <>
                      <span className="px-2 py-0.5 rounded bg-[#32BCAD]/10 border border-[#32BCAD]/30 text-[#32BCAD]">Tether (USDT)</span>
                      <span className="px-2 py-0.5 rounded bg-[#F7931A]/10 border border-[#F7931A]/30 text-[#F7931A]">Bitcoin</span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">Bank Transfer</span>
                    </>
                  )}
                  {language === 'unmatched_now' && (
                    <>
                      <span className="px-2 py-0.5 rounded bg-[#F7931A]/10 border border-[#F7931A]/30 text-[#F7931A]">Crypto</span>
                      <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-400">Visa / MC</span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">Skrill</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Promo Code, Claim CTA & Sub-Partner CTA */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end justify-center gap-2 lg:w-1/4">
              <div className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 flex items-center justify-between gap-3 w-full">
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">{t('card.promoCode')}</span>
                  <span className="font-mono font-black text-amber-400 text-xs tracking-wider notranslate" translate="no">
                    {p.promoCode}
                  </span>
                </div>
                <button
                  onClick={(e) => handleCopy(p, e)}
                  className="px-2 py-1 rounded-md bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer shrink-0"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedId === p.id ? t('card.copied') : t('card.copy')}</span>
                </button>
              </div>

              <div className="flex items-center gap-1.5 w-full">
                <button
                  onClick={() => onClaimClick(p)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs tracking-wide shadow-md shadow-amber-500/15 transition-all flex items-center justify-center gap-1.5 group cursor-pointer"
                >
                  <span>{t('card.claimBonus')}</span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>

                {onOpenQrModal && (
                  <button
                    onClick={() => onOpenQrModal(p)}
                    title="Scan Mobile QR Code"
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <QrCode className="w-4 h-4" />
                  </button>
                )}

                {onOpenFeedbackModal && (
                  <button
                    onClick={() => onOpenFeedbackModal(p)}
                    title="Community Reviews & Feedback"
                    className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-400 hover:text-amber-300 transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
                  >
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span className="text-xs font-bold">Reviews</span>
                  </button>
                )}
              </div>

              {onSubPartnerClick && (
                <button
                  onClick={() => onSubPartnerClick(p)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-cyan-500/30 text-cyan-300 font-extrabold text-[11px] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Become Sub-Partner (50% RevShare)</span>
                </button>
              )}
            </div>
          </div>
          {/* Smart ad-insertion: after every 4th game item */}
          {(index + 1) % 4 === 0 && index !== sortedPlatforms.length - 1 && (
            <div className="py-2">
              <AdContainer slotId={`offer_grid_inline_${index}`} />
            </div>
          )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};
