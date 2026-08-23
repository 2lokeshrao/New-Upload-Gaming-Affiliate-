import React, { useState } from 'react';
import { GamingPlatform, UserGeo } from '../types';
import { Star, CheckCircle2, ShieldCheck, Copy, ExternalLink, Flame, Sparkles, Users, QrCode, MessageSquare, Wallet } from 'lucide-react';
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
  const activePlatforms = platforms.filter(p => p.isActive && !['Credit Cards', 'Banking & Finance', 'Loans', 'Demat Accounts', 'Bank Accounts', 'Investments'].includes(p.category || ''));
  
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

      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
        {sortedPlatforms.map((p, index) => {
          const rankLabel = `#${index + 1} VERIFIED PARTNER`;
          const badgeBg = 'from-slate-700 via-slate-800 to-slate-900';
          const cardGlow = 'border-slate-700/50 shadow-xl shadow-slate-900/20';

          return (
          <React.Fragment key={p.id}>
            <div
              className={`relative bg-slate-900/90 rounded-2xl p-6 border flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 ${cardGlow}`}
            >
              {/* Badge rank bar */}
              <div
                className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-black tracking-wider text-slate-300 bg-gradient-to-r shadow-md flex items-center gap-1.5 uppercase ${badgeBg}`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{rankLabel}</span>
              </div>

              <div>
                {/* Header info */}
                <div className="flex items-center justify-between mt-2 mb-4">
                  <div className="flex items-center gap-3">
                    <LazyImage
                      priority={index < 2}
                      src={p.logoUrl || undefined}
                      alt={p.name}
                      width="56"
                      height="56"
                      className="w-14 h-14 rounded-xl border-2 border-slate-700/80 shadow-md bg-slate-800"
                    />
                    <div>
                      <h3 className="font-extrabold text-lg text-white leading-tight flex items-center gap-1.5">
                        {p.name}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-1 text-xs text-amber-400 font-bold">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(p.averageUserRating || p.starRating) ? 'fill-amber-400 text-amber-400' : 'fill-slate-700 text-slate-700'}`} />
                          ))}
                        </div>
                        <span className="text-slate-300">({(p.totalReviewsCount || 10500).toLocaleString()})</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider">{t('card.globalRating')}</span>
                    <span className="text-lg font-black text-emerald-400">{p.averageUserRating?.toFixed(1) || p.starRating}.0<span className="text-xs text-emerald-600">/5</span></span>
                  </div>
                </div>

                {/* Bonus highlight box */}
                <div className="bg-gradient-to-br from-purple-950/80 to-slate-950 border border-purple-500/40 rounded-xl p-3.5 my-4 text-center">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-purple-300 uppercase tracking-widest block">
                      {t('card.exclusiveOffer')}
                    </span>
                  </div>
                  <div className="text-base sm:text-lg font-black text-amber-300 leading-tight">
                    {formatLocalizedBonus(p.bonusText, language)}
                  </div>
                </div>

                {/* Badges list */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>{t('badge.verified')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-indigo-400 font-bold">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{t('badge.fastWithdraw')}</span>
                  </div>
                  {p.badges.map((b, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400/50 shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>

                {/* Localized Payments based on Language / Geo */}
                <div className="mb-6 flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1 uppercase tracking-wider">
                    <Wallet className="w-3 h-3" /> {t('payment.local')}
                  </span>
                  <div className="flex gap-2 text-[10px] font-bold text-slate-300">
                    {language === 'pt' && (
                      <>
                        <span className="px-1.5 py-0.5 rounded bg-[#32BCAD]/10 border border-[#32BCAD]/30 text-[#32BCAD]">Pix</span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">PicPay</span>
                      </>
                    )}
                    {language === 'hi' && (
                      <>
                        <span className="px-1.5 py-0.5 rounded bg-[#32BCAD]/10 border border-[#32BCAD]/30 text-[#32BCAD]">UPI</span>
                        <span className="px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-400">Paytm</span>
                      </>
                    )}
                    {language === 'ru' && (
                      <>
                        <span className="px-1.5 py-0.5 rounded bg-[#F7931A]/10 border border-[#F7931A]/30 text-[#F7931A]">Bitcoin</span>
                        <span className="px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-400">Mir</span>
                      </>
                    )}
                    {language === 'es' && (
                      <>
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">Mercado Pago</span>
                        <span className="px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/30 text-red-400">OXXO</span>
                      </>
                    )}
                    {['en', 'fr', 'de', 'it', 'pl'].includes(language) && (
                      <>
                        <span className="px-1.5 py-0.5 rounded bg-[#F7931A]/10 border border-[#F7931A]/30 text-[#F7931A]">Crypto</span>
                        <span className="px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-400">Visa / MC</span>
                      </>
                    )}
                    {['zh-CN', 'ja', 'ko', 'vi', 'th', 'id', 'ar', 'tr'].includes(language) && (
                      <>
                        <span className="px-1.5 py-0.5 rounded bg-[#32BCAD]/10 border border-[#32BCAD]/30 text-[#32BCAD]">Tether (USDT)</span>
                        <span className="px-1.5 py-0.5 rounded bg-[#F7931A]/10 border border-[#F7931A]/30 text-[#F7931A]">Bitcoin</span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">Bank Transfer</span>
                      </>
                    )}
                    {language === 'unmatched_now' && (
                      <>
                        <span className="px-1.5 py-0.5 rounded bg-[#F7931A]/10 border border-[#F7931A]/30 text-[#F7931A]">Crypto</span>
                        <span className="px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-400">Visa / MC</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div>
                {/* Promo Code Box */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 mb-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">{t('card.promoCode')}</span>
                    <span className="font-mono font-black text-amber-400 text-sm tracking-wider notranslate" translate="no">
                      {p.promoCode}
                    </span>
                  </div>
                  <button
                    onClick={(e) => handleCopy(p, e)}
                    className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedId === p.id ? t('card.copied') : t('card.copy')}</span>
                  </button>
                </div>

                {/* Main CTA & Quick Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onClaimClick(p)}
                    className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5 group cursor-pointer"
                  >
                    <span>{t('card.claimBonus')}</span>
                    <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                  {onOpenQrModal && (
                    <button
                      onClick={() => onOpenQrModal(p)}
                      title="Scan Mobile QR Code"
                      className="p-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-400 hover:text-white transition-colors cursor-pointer shrink-0"
                    >
                      <QrCode className="w-4 h-4" />
                    </button>
                  )}
                  {onOpenFeedbackModal && (
                    <button
                      onClick={() => onOpenFeedbackModal(p)}
                      title="Community Reviews & Feedback"
                      className="px-4 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-400 hover:text-amber-300 transition-colors cursor-pointer shrink-0 flex items-center gap-2"
                    >
                      <Star className="w-4 h-4 fill-amber-400" />
                      <span className="text-xs font-bold">Reviews</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          {/* Smart ad-insertion: after every 3rd game item */}
          {(index + 1) % 3 === 0 && index !== sortedPlatforms.length - 1 && (
            <div className="col-span-1 md:col-span-3 py-2 w-full">
              <AdContainer slotId={'offer_grid_inline_' + index} />
            </div>
          )}
          </React.Fragment>
          );
        })}
      </div>
    </section>
  );
};
