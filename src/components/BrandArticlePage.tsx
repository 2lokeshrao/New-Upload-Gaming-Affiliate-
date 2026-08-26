import DOMPurify from 'dompurify';
import React, { useEffect, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import { GamingPlatform, UserGeo, CustomPage, GlobalConfig } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { getGeoContext, getSeoTemplates } from '../utils/seoTemplates';
import { injectSeoTags } from '../utils/seo';
import { formatLocalizedBonus } from '../utils/currency';
import { CheckCircle, ArrowRight, Home, ChevronRight } from 'lucide-react';
import { WalletReferrals } from './WalletReferrals';
import { Sidebar } from './Sidebar';

export const BrandArticlePage: React.FC<{ 
  path: string; 
  geo: UserGeo; 
  platforms: GamingPlatform[]; 
  customPages: CustomPage[];
  config: GlobalConfig;
  onClaimClick: (p: GamingPlatform) => void 
}> = ({ path, geo, platforms, customPages, config, onClaimClick }) => {
  const { language } = useLanguage();
  const slug = path.split('/').pop() || '';
  
  // Find platform by slug (basic matching)
  const platformNameMatch = slug.split('-')[0].toLowerCase(); // e.g. "1win" from "1win-promo-code-india"
  const platform = platforms.find(p => p.name.toLowerCase().replace(/[^a-z0-9]/g, '').includes((platformNameMatch || '').replace(/[^a-z0-9]/g, ''))) || platforms.find(p => p.isActive) || platforms[0];
  
  const geoContext = getGeoContext(geo.countryCode);
  const localizedBonus = formatLocalizedBonus(platform?.bonusText || platform?.bonusTitle || '', language);
  
  const content = useMemo(() => getSeoTemplates(language, {
    brand: platform?.name || '',
    promoCode: platform?.promoCode || 'MAXBOOST500',
    country: geoContext.country,
    payment: geoContext.payment,
    bonus: localizedBonus
  }), [language, platform, geoContext, localizedBonus]);

  useEffect(() => {
    if (!platform) return;
    const title = platform.metaTitle || `${platform.name} Promo Code 2026 - ${platform.bonusText || '500% Bonus'} | BonusPromoCode`;
    const desc = platform.metaDescription || `Claim the best ${platform.name} promo code for ${geoContext.country}. Get ${localizedBonus} instantly. Read our complete review, payment methods, and withdrawal speed.`;
    const canonical = `https://bonuspromocode.in/brands/${slug}`;
    const ogImage = typeof platform.logoUrl === 'string' && platform.logoUrl.startsWith('data:') ? '' : `https://bonuspromocode.in${platform.logoUrl}`;
    
    injectSeoTags(title, desc, canonical, ogImage);
  }, [platform, geoContext.country, localizedBonus, slug]);

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    window.history.pushState({}, '', href);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  if (!platform) return <div className="p-20 text-center text-white">Platform not found</div>;

  return (
        <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-amber-400 selection:text-slate-950 flex flex-col">
      {/* Mini Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" onClick={(e) => handleNav(e, '/')} className="flex items-center gap-2 group">
            <span className="font-black text-xl tracking-tight text-white group-hover:text-amber-400 transition-colors">BonusPromoCode</span>
          </a>
          <a href="/" onClick={(e) => handleNav(e, '/')} className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-colors bg-slate-800/50 hover:bg-slate-800 px-4 py-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Back to Home
          </a>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 py-12 w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase mb-8 tracking-wider flex-wrap">
          <a href="/" onClick={(e) => handleNav(e, '/')} className="hover:text-amber-400">Home</a>
          <ChevronRight className="w-3 h-3" />
          <span>Brands</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-emerald-400">{platform.name} Review</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <main className="lg:col-span-3">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-10 shadow-2xl mb-10">
              <div className="flex flex-col md:flex-row items-center gap-6 mb-8 border-b border-slate-800 pb-8 text-center md:text-left">
                <img width="40" height="40" decoding="async" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAHBJREFUWEft0zEKACAQw8D7/6f90lJwEFzEQe5SU5qsqqpeZ373n/2YczxQYxMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwkro5m+0BP002ATXz2hAAAAAASUVORK5CYII="; }} loading="lazy" src={platform.logoUrl || undefined} alt={platform.name} className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-slate-800 bg-slate-950 object-cover shadow-xl" />
                <div>
                  <h1 className="text-3xl md:text-5xl font-black text-white mb-2">{platform.name} Review & Guide</h1>
                  <p className="text-emerald-400 font-bold flex items-center justify-center md:justify-start gap-1 mt-2">
                    <CheckCircle className="w-4 h-4" /> Official Guide for {geoContext.country}
                  </p>
                  <p className="text-slate-400 text-sm mt-2 max-w-lg">
                    Complete {new Date().getFullYear()} breakdown of {platform.name}'s welcome bonuses, payment methods, and registration process in {geoContext.country}.
                  </p>
                </div>
              </div>

              <article className="prose prose-invert prose-slate prose-lg max-w-none prose-h4:text-amber-300 prose-h4:font-bold prose-h4:text-2xl prose-h4:mt-10 prose-h4:mb-4 prose-p:text-slate-300 prose-p:leading-relaxed prose-strong:text-white">
                              {/* Financial Platform Specific Details */}
              {(platform.benefits || platform.whomToSell || platform.howItWorks) && (
                <div className="space-y-10 mb-10 border-b border-slate-800/80 pb-10">
                  {platform.benefits && platform.benefits.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-white flex items-center gap-2"><CheckCircle className="w-6 h-6 text-emerald-500" /> Offer Benefits</h3>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 p-0 m-0 list-none">
                        {platform.benefits.map((b, i) => (
                          <li key={i} className="flex items-start gap-3 bg-slate-800/30 p-3 rounded-lg border border-slate-700/50 m-0">
                            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                            <span className="text-slate-300 text-sm leading-relaxed">{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {platform.whomToSell && platform.whomToSell.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-white">Eligibility Criteria</h3>
                      <ul className="space-y-2 p-0 m-0 list-none">
                        {platform.whomToSell.map((w, i) => (
                          <li key={i} className="flex items-start gap-3 text-slate-300 bg-slate-800/30 p-3 rounded-lg border border-slate-700/50 m-0">
                            <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-2" />
                            <span className="text-sm leading-relaxed">{w}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {platform.howItWorks && platform.howItWorks.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-white">How to Apply</h3>
                      <div className="space-y-3 bg-slate-800/30 p-5 rounded-xl border border-slate-700/50">
                        {platform.howItWorks.map((h, i) => (
                          <p key={i} className="text-slate-300 text-sm leading-relaxed m-0">{h}</p>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {platform.tnc && platform.tnc.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-white">Terms & Conditions</h3>
                      <div className="space-y-2 text-sm text-slate-400 bg-slate-800/20 p-5 rounded-xl border border-slate-800">
                        {platform.tnc.map((t, i) => (
                          <p key={i} className={t === 'DOs' ? 'text-emerald-400 font-bold mt-4 mb-2 uppercase m-0' : t === "DON'Ts" ? 'text-red-400 font-bold mt-4 mb-2 uppercase m-0' : 'leading-relaxed m-0'}>{t}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {platform.reviewContent ? (
                <div className="mb-10">
                  <ReactMarkdown
                    rehypePlugins={[rehypeSanitize]}
                    components={{
                      h1: ({node, ...props}) => <h1 className="text-3xl font-black text-white mt-6 mb-4 leading-tight" {...props} />,
                      h2: ({node, ...props}) => <h2 className="text-2xl font-black text-white mt-6 mb-3 border-b border-slate-800 pb-2" {...props} />,
                      h3: ({node, ...props}) => <h3 className="text-xl font-bold text-white mt-4 mb-2" {...props} />,
                      p: ({node, ...props}) => <p className="text-slate-300 leading-relaxed mb-4 text-base" {...props} />,
                      a: ({node, ...props}) => (
                        <a 
                          className="text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-2 decoration-emerald-500/40 hover:decoration-emerald-400 transition-colors" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          {...props} 
                        />
                      ),
                      ul: ({node, ...props}) => <ul className="list-disc list-outside pl-6 mb-4 space-y-1.5 text-slate-300" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal list-outside pl-6 mb-4 space-y-1.5 text-slate-300" {...props} />,
                      li: ({node, ...props}) => <li className="leading-relaxed" {...props} />,
                      strong: ({node, ...props}) => <strong className="font-bold text-white" {...props} />,
                      blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-emerald-500 pl-4 py-2 italic bg-slate-950/60 text-slate-400 mb-4 rounded-r-lg" {...props} />
                    }}
                  >
                    {platform.reviewContent}
                  </ReactMarkdown>
                </div>
              ) : (
                <>
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
                </>
              )}
              </article>

              {/* CTA Area */}
              <div className="mt-12 bg-gradient-to-r from-slate-950 to-slate-900 border border-amber-500/20 p-8 rounded-2xl text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none transform translate-x-1/2 -translate-y-1/2"></div>
                <span className="text-xs uppercase font-bold text-slate-500 block mb-2">Exclusive Promo Code</span>
                <span className="font-mono font-black text-amber-400 text-3xl tracking-wider bg-slate-950 px-6 py-2 rounded-lg border border-slate-800 inline-block mb-6 shadow-inner">
                  {platform.promoCode || 'MAXBOOST500'}
                </span>
                <br/>
                <button
                  onClick={() => onClaimClick(platform)}
                  className="w-full md:w-auto px-10 py-4 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black text-lg uppercase tracking-wide shadow-xl shadow-amber-500/20 hover:scale-105 hover:from-amber-400 hover:to-yellow-300 transition-all flex items-center justify-center gap-2 mx-auto"
                >
                  Claim Bonus & Play Now <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              <WalletReferrals geo={geo} />
            </div>
          </main>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-8">
            <Sidebar platforms={platforms} customPages={customPages} config={config} geo={geo} currentPlatformId={platform.id} />
          </aside>
        </div>
      </main>
    </div>
  );
};
