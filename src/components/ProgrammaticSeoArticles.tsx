import DOMPurify from 'dompurify';
import React, { useState, useEffect } from 'react';
import { GamingPlatform, UserGeo } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { getGeoContext, getSeoTemplates } from '../utils/seoTemplates';
import { formatLocalizedBonus } from '../utils/currency';
import { ShieldCheck, CheckCircle, ArrowRight, ChevronLeft, ChevronRight, Landmark } from 'lucide-react';
import { WalletReferrals } from './WalletReferrals';

interface ProgrammaticSeoArticlesProps {
  platforms: GamingPlatform[];
  geo: UserGeo;
  onClaimClick: (platform: GamingPlatform) => void;
}

export const ProgrammaticSeoArticles: React.FC<ProgrammaticSeoArticlesProps> = ({ platforms, geo, onClaimClick }) => {
  const { language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  
  // Focus only on the top 4 featured/active platforms + 1 Finance Slide
  const topPlatforms = platforms.filter(p => p.isActive).slice(0, 4);
  const geoContext = getGeoContext(geo.countryCode);

  // Combine platforms and the financial guide into a single slides array
  const slides = [
    ...topPlatforms.map(p => ({ type: 'platform', data: p })),
    { type: 'finance', data: null }
  ];

  const totalSlides = slides.length;

  // Auto-Swipe Timer (15 seconds per slide)
  useEffect(() => {
    if (isPaused || totalSlides === 0 || userInteracted) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 15000);
    return () => clearInterval(timer);
  }, [totalSlides, isPaused, userInteracted]);

  const nextSlide = () => { setUserInteracted(true); setCurrentIndex((p) => (p + 1) % totalSlides); };
  const prevSlide = () => { setUserInteracted(true); setCurrentIndex((p) => (p - 1 + totalSlides) % totalSlides); };

  // Swipe Handlers for Mobile
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (Math.abs(distance) > 50) {
      setUserInteracted(true); // Disable auto-swipe on manual swipe
      if (distance > 50) setCurrentIndex((p) => (p + 1) % totalSlides); // Swiped left
      if (distance < -50) setCurrentIndex((p) => (p - 1 + totalSlides) % totalSlides); // Swiped right
    }
    setTouchStart(0);
    setTouchEnd(0);
  };

  if (topPlatforms.length === 0) return null;

  return (
    <section id="seo-article-blocks" className="py-12 bg-slate-950 border-t border-slate-900 overflow-hidden">
      <div className="max-w-4xl mx-auto px-4">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-black uppercase mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            Global Gaming Guides & Reviews
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Comprehensive Platform Reviews for {geoContext.country}
          </h2>
          <p className="text-slate-400 mt-2 text-sm">
            Swipe to read our verified guides on registration, localized payments ({geoContext.payment}), and security.
          </p>
        </div>

        {/* Carousel Container */}
        <div 
          className="relative rounded-2xl border border-slate-800 bg-slate-900/50 shadow-2xl pb-12"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={(e) => {
            setIsPaused(true);
            handleTouchStart(e);
          }}
          onTouchMove={handleTouchMove}
          onTouchEnd={(e) => {
            setIsPaused(false);
            handleTouchEnd();
          }}
        >
          
          <div className="overflow-hidden w-full rounded-2xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {slides.map((slide, idx) => {
                
                // --- PLATFORM SLIDE ---
                if (slide.type === 'platform') {
                  const platform = slide.data as GamingPlatform;
                  const localizedBonus = formatLocalizedBonus(platform.bonusText || platform.bonusTitle, language);
                  const content = getSeoTemplates(language, {
                    brand: platform.name,
                    promoCode: platform.promoCode || 'MAXBOOST500',
                    country: geoContext.country,
                    payment: geoContext.payment,
                    bonus: localizedBonus
                  });

                  return (
                    <div key={`slide-${platform.id}`} className="w-full flex-shrink-0 p-5 sm:p-8">
                      {/* Header */}
                      <div className="flex items-center gap-4 mb-6">
                        <img width="40" height="40" decoding="async" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAHBJREFUWEft0zEKACAQw8D7/6f90lJwEFzEQe5SU5qsqqpeZ373n/2YczxQYxMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwkro5m+0BP002ATXz2hAAAAAASUVORK5CYII="; }} loading="lazy" src={platform.logoUrl} alt={`${platform.name} logo`} className="w-12 h-12 rounded-full border-2 border-slate-800 bg-slate-950 object-cover shadow-lg" />
                        <div>
                          <h3 className="text-lg sm:text-xl font-black text-white">{platform.name} Review & Promo Guide</h3>
                          <p className="text-xs text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                            <CheckCircle className="w-3 h-3" /> Verified in {geoContext.country}
                          </p>
                        </div>
                      </div>

                      {/* SEO Article Text */}
                      <article className="prose prose-invert prose-slate max-w-none prose-h4:text-amber-300 prose-h4:font-bold prose-h4:mb-2 prose-h4:mt-6 prose-p:text-slate-300 prose-p:text-sm prose-p:leading-relaxed prose-strong:text-white prose-strong:font-bold prose-em:text-emerald-300">
                        <h4>{content.promoTitle}</h4>
                        <p dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(content.promoContent || '', {
                            ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'span', 'div', 'h1', 'h2', 'h3', 'h4'],
                            ALLOWED_ATTR: ['href', 'target', 'rel', 'class']
                          })
                        }} />

                        <h4>{content.paymentTitle}</h4>
                        <p dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(content.paymentContent || '', {
                            ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'span', 'div', 'h1', 'h2', 'h3', 'h4'],
                            ALLOWED_ATTR: ['href', 'target', 'rel', 'class']
                          })
                        }} />

                        <h4>{content.legalTitle}</h4>
                        <p dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(content.legalContent || '', {
                            ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'span', 'div', 'h1', 'h2', 'h3', 'h4'],
                            ALLOWED_ATTR: ['href', 'target', 'rel', 'class']
                          })
                        }} />
                      </article>
                      
                      {/* Internal link for dedicated page */}
                      <div className="mt-6 text-center sm:text-left border-t border-slate-800/80 pt-4">
                        <a 
                          href={`/brands/${platform.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-promo-code-${(geoContext.country || 'global').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                          onClick={(e) => {
                             e.preventDefault();
                             const targetUrl = `/brands/${platform.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-promo-code-${(geoContext.country || 'global').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
                             window.history.pushState({}, '', targetUrl);
                             window.dispatchEvent(new PopStateEvent('popstate'));
                          }}
                          className="inline-flex items-center gap-1 text-emerald-400 font-bold text-sm hover:text-emerald-300 hover:underline"
                        >
                          Read Full 2026 Dedicated Review Page <ArrowRight className="w-4 h-4" />
                        </a>
                      </div>

                      {/* Call to Action */}
                      <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-center sm:text-left">
                          <span className="text-[10px] uppercase font-bold text-slate-500 block">Use Promo Code</span>
                          <span className="font-mono font-black text-amber-400 text-lg tracking-wider bg-slate-950 px-3 py-1 rounded-lg border border-slate-800 mt-1 inline-block shadow-inner">
                            {platform.promoCode || 'MAXBOOST500'}
                          </span>
                        </div>
                        <button
                          onClick={() => onClaimClick(platform)}
                          className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm uppercase tracking-wide shadow-xl shadow-amber-500/20 transform active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                          Apply Code & Register <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                }

                // --- FINANCIAL & CRYPTO SLIDE ---
                return (
                  <div key="slide-finance" className="w-full flex-shrink-0 p-5 sm:p-8 bg-slate-900/30">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full border-2 border-slate-800 bg-emerald-500/10 flex items-center justify-center text-emerald-400 shadow-lg">
                        <Landmark className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-black text-white">Financial & Crypto Guide</h3>
                        <p className="text-xs text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                          <ShieldCheck className="w-3 h-3" /> Secure Global Payments
                        </p>
                      </div>
                    </div>

                    <div className="prose prose-invert max-w-none mb-6">
                      <h4 className="text-amber-300 font-bold">Best Payment Methods for iGaming</h4>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        To ensure your transactions are instant, secure, and private, we highly recommend using verified E-Wallets and Crypto Exchanges. This prevents banking blocks and ensures you get your winnings in minutes instead of days.
                      </p>
                    </div>

                    <WalletReferrals geo={geo} />

                    <div className="mt-8 text-center pt-6 border-t border-slate-800/80">
                      <a 
                        href="/banking/best-virtual-cards-for-gaming" 
                        onClick={(e) => {
                           e.preventDefault();
                           window.history.pushState({}, '', '/banking/best-virtual-cards-for-gaming');
                           window.dispatchEvent(new PopStateEvent('popstate'));
                        }}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-colors border border-slate-700"
                      >
                        Explore Full Financial Hub <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Arrows (Hidden on very small mobile, visible on sm+) */}
          <button 
            onClick={prevSlide}
            className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-950/80 border border-slate-800 items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-all z-10 shadow-lg"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={nextSlide}
            className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-950/80 border border-slate-800 items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-all z-10 shadow-lg"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Pagination Dots */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => { setUserInteracted(true); setCurrentIndex(idx); }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentIndex === idx ? 'bg-amber-400 w-6' : 'bg-slate-600 hover:bg-slate-500'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};
