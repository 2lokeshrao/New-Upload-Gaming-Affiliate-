// Force HMR invalidation
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import { GamingPlatform, CustomCoupon } from '../types';
import { Search, CheckCircle2, Flame, Award, Tag, Ticket, X, Copy, ExternalLink } from 'lucide-react';

import { UserGeo } from '../types';

interface SeoContentSectionProps {
  geo: UserGeo;
  platforms: GamingPlatform[];
  customCoupons?: CustomCoupon[];
  onClaimClick: (platform: GamingPlatform) => void;
  onCustomCouponClaim?: (coupon: CustomCoupon) => void;
}

export const SeoContentSection: React.FC<SeoContentSectionProps> = ({
  platforms,
  customCoupons = [],
  geo,
  onClaimClick,
  onCustomCouponClaim
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<GamingPlatform | null>(null);

  const validPlatforms = platforms.filter(p => {
    const code = p.promoCode?.trim().toLowerCase();
    return code && !['not applicable', 'n/a', 'blank', 'none', '-'].includes(code);
  });

  // Generate Dynamic FAQ Schema.org JSON-LD for Search Engines
  const dynamicFaqQuestions = validPlatforms.map(p => ([
    {
      "@type": "Question",
      "name": `Is ${p.name} legit and safe to play in 2026?`,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": `Yes, ${p.name} is a 100% verified and licensed gaming platform featuring SSL encryption, instant withdrawals via UPI/Pix/USDT, and high RTP slots.`
      }
    },
    {
      "@type": "Question",
      "name": `What is the official promo code for ${p.name}?`,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": `The official verified promo code for ${p.name} is ${p.promoCode || 'MAXBOOST500'}. Enter ${p.promoCode || 'MAXBOOST500'} during registration to claim your welcome deposit bonus package.`
      }
    }
  ])).flat();


  const breadcrumbSchemaData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://bonuspromocode.in/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Promo Codes 2026",
        "item": "https://bonuspromocode.in/#seo-content-section"
      }
    ]
  };

  const faqSchemaData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      ...dynamicFaqQuestions,
      {
        "@type": "Question",
        "name": "How to claim maximum 500% welcome deposit bonus across gaming apps?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Choose your preferred verified brand from our list, copy the active promo code, and click GET BONUS. Enter the code during account sign-up to unlock instant bonus funds."
        }
      }
    ]
  };

  return (
    <section id="seo-content-section" className="py-12 px-4 max-w-7xl mx-auto border-t border-slate-800/80 scroll-mt-24">
      {/* Inject Dynamic Schema.org JSON-LD FAQ Markup for Google Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchemaData) }}
      />


      {/* Table of Contents */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-10 shadow-lg">
        <h3 className="text-lg font-black text-white flex items-center gap-2 mb-4">
          <Search className="w-5 h-5 text-amber-400" />
          <span>Table of Contents</span>
        </h3>
        <nav className="flex flex-col gap-2 text-sm font-medium">
          <a href="#seo-compare-table" className="text-blue-400 hover:text-blue-300 hover:underline transition-colors flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            2026 Gaming & Custom Coupon Search Index
          </a>
          <a href="#seo-article-blocks" className="text-purple-400 hover:text-purple-300 hover:underline transition-colors flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
            Trust & Legitimacy Guide
          </a>
          <a href="#seo-tag-cloud" className="text-emerald-400 hover:text-emerald-300 hover:underline transition-colors flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Popular Search Tags
          </a>
        </nav>
      </div>

      {/* SEO Title & Description */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-black uppercase mb-2">
          <Search className="w-3.5 h-3.5 text-amber-400" />
          <span>TOP SEARCHED CASINO & GAMING PROMO CODES 2026</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          {geo.country || "Global"} Official Promo Codes for 1Win, Mostbet, Stake & Custom Events
        </h2>
        <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-2xl mx-auto leading-relaxed">
          Looking for verified <strong>1Win promo code today</strong>, <strong>Mostbet deposit bonus</strong>, or <strong>IPL 2026 special promo codes</strong>? Claim up to 500% welcome deposit bonus + 200 free spins instantly.
        </p>
      </div>

      {/* Structured SEO Keyword Comparison Table */}
      <div id="seo-compare-table" className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl mb-10 scroll-mt-24">
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400 " />
            <span>2026 Gaming & Custom Coupon Search Index</span>
          </h3>
          <span className="text-xs text-amber-400 font-bold bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-full">
            Updated Daily
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-950/80 text-slate-400 font-extrabold uppercase text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-3.5">Gaming App / Brand</th>
                <th className="p-3.5">Verified Promo Code</th>
                <th className="p-3.5">Welcome Bonus Package</th>
                <th className="p-3.5">Type / Min Deposit</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {/* Standard Gaming Platforms */}
              {validPlatforms.map(p => (
                <tr key={p.id} className="hover:bg-slate-800/40 transition-colors cursor-pointer" onClick={() => setSelectedPlatform(p)}>
                  <td className="p-3.5 flex items-center gap-2.5">
                    <img onError={(e) => { console.error('Image failed to load in SEO Table:', p.logoUrl); }} src={p.logoUrl || undefined} alt={p.name} width="28" height="28" loading="lazy" decoding="async" className="w-7 h-7 rounded-lg object-cover" />
                    <div>
                      <span className="font-extrabold text-white block">{p.name}</span>
                      <span className="text-[10px] text-slate-400">{(p.category || 'Casino').toUpperCase()}</span>
                    </div>
                  </td>

                  <td className="p-3.5">
                    <span className="bg-amber-500/15 border border-amber-500/40 text-amber-300 font-mono font-black text-xs px-2.5 py-1 rounded-md inline-block">
                      {p.promoCode || 'MAXBOOST500'}
                    </span>
                  </td>

                  <td className="p-3.5 text-emerald-400 font-bold">
                    {p.bonusTitle || p.bonusText}
                  </td>

                  <td className="p-3.5 text-slate-300 font-mono">
                    {p.minDeposit || (
  p.category === 'Loans' ? 'Flexible' :
  p.category === 'Credit Cards' ? 'Check Fees' :
  p.category === 'Bank Accounts' ? 'Zero Balance' :
  p.category === 'Demat Accounts' ? 'Free Account' :
  'Min $5 / ₹300'
)}
                  </td>

                  <td className="p-3.5 text-right">
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedPlatform(p); }}
                      className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold text-xs shadow-md shadow-purple-600/20 cursor-pointer"
                    >
                      GET BONUS
                    </button>
                  </td>
                </tr>
              ))}

              {/* Custom Standalone Coupons */}
              {customCoupons.map(c => (
                <tr key={c.id} className="bg-purple-950/20 hover:bg-purple-900/30 transition-colors border-l-2 border-purple-500">
                  <td className="p-3.5 flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-purple-900/80 border border-purple-500/40 flex items-center justify-center text-purple-300">
                      <Ticket className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-extrabold text-purple-200 block">{c.brandName}</span>
                      <span className="text-[10px] text-purple-400 uppercase font-bold">{c.category || 'EVENT OFFER'}</span>
                    </div>
                  </td>

                  <td className="p-3.5">
                    <span className="bg-purple-500/20 border border-purple-400/50 text-purple-200 font-mono font-black text-xs px-2.5 py-1 rounded-md inline-block">
                      {c.code}
                    </span>
                  </td>

                  <td className="p-3.5 text-purple-300 font-bold">
                    {c.title}
                  </td>

                  <td className="p-3.5 text-slate-300">
                    <span className="bg-purple-950 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded text-[10px] font-extrabold">
                      {c.badgeText || 'SPECIAL COUPON'}
                    </span>
                  </td>

                  <td className="p-3.5 text-right">
                    <a
                      href={c.targetUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => onCustomCouponClaim && onCustomCouponClaim(c)}
                      className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md inline-block cursor-pointer"
                    >
                      CLAIM COUPON
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rich Article Blocks for SEO indexing */}
      <div id="seo-article-blocks" className="grid grid-cols-1 md:grid-cols-3 gap-6 text-slate-300 text-xs sm:text-sm leading-relaxed scroll-mt-24">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-extrabold text-sm mb-1">
            <Award className="w-4 h-4" />
            <h3>Is 1Win & Mostbet Legit?</h3>
          </div>
          <p>
            Yes! Both <strong>1Win</strong> and <strong>Mostbet</strong> hold valid international gaming licenses with audited RNG certification. Using official code <strong>MAXBOOST500</strong> guarantees maximum 500% welcome bonuses.
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-sm mb-1">
            <CheckCircle2 className="w-4 h-4" />
            <h3>Mostbet & Custom Event Bonuses</h3>
          </div>
          <p>
            Looking for custom event coupon codes or special cricket promos? Our live Admin Coupon Manager regularly updates active codes for IPL, World Cup, and major esports tournaments.
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-extrabold text-sm mb-1">
            <Tag className="w-4 h-4" />
            <h3>10-Minute Registration Timer</h3>
          </div>
          <p>
            Claiming any promo code reserves your 500% deposit match for 10 minutes. Make sure to complete your registration before the timer expires to secure free spins and instant cashback eligibility.
          </p>
        </div>
      </div>

      {/* SEO Tag Cloud for Search Crawlers */}
      <div id="seo-tag-cloud" className="mt-8 pt-6 border-t border-slate-800/60 flex flex-wrap items-center justify-center gap-1.5 text-[11px] text-slate-400 scroll-mt-24">
        <span className="font-extrabold text-slate-300 uppercase mr-1">Popular Search Tags:</span>
        {[
          "is 1win legit",
          "1win promo code 2026",
          "is mostbet safe",
          "mostbet promo code today",
          "is stake casino legit",
          "stake bonus code 2026",
          "bc.game deposit promo code",
          "pinup casino promo code",
          "ipl 2026 cricket promo code",
          "custom coupon code casino",
          "aviator bonus code 500%"
        ].map((tag, idx) => (
          <span key={idx} className="bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-md text-slate-300 hover:text-amber-300 transition-colors">
            #{tag}
          </span>
        ))}
      </div>

      {/* Custom Popup Modal for Platform Benefits */}
      {selectedPlatform && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl relative my-10" onClick={e => e.stopPropagation()}>
            <button 
              onClick={(e) => { e.stopPropagation(); setSelectedPlatform(null); }}
              className="absolute top-4 right-4 p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-800">
                <img src={selectedPlatform.logoUrl || undefined} alt={selectedPlatform.name} width="64" height="64" loading="lazy" decoding="async" className="w-16 h-16 rounded-xl object-cover bg-slate-800 border border-slate-700" />
                <div>
                  <h2 className="text-2xl font-black text-white">{selectedPlatform.name}</h2>
                  <span className="text-emerald-400 font-bold">{selectedPlatform.bonusText || selectedPlatform.bonusTitle}</span>
                </div>
              </div>

              {selectedPlatform.reviewContent ? (
                <div className="prose prose-invert prose-sm max-w-none mb-8 prose-headings:text-slate-200 prose-headings:font-black prose-a:text-emerald-400 hover:prose-a:text-emerald-300 prose-a:underline prose-ul:text-slate-300">
                  <ReactMarkdown
                    rehypePlugins={[rehypeSanitize]}
                    components={{
                      h1: ({node, ...props}) => <h1 className="text-xl font-black text-white mt-4 mb-2" {...props} />,
                      h2: ({node, ...props}) => <h2 className="text-lg font-black text-white mt-4 mb-2 border-b border-slate-800 pb-1" {...props} />,
                      h3: ({node, ...props}) => <h3 className="text-base font-bold text-white mt-3 mb-1.5" {...props} />,
                      p: ({node, ...props}) => <p className="text-slate-300 leading-relaxed mb-3 text-sm" {...props} />,
                      a: ({node, ...props}) => (
                        <a 
                          className="text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-2 decoration-emerald-500/40 hover:decoration-emerald-400 transition-colors" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          onClick={(e) => e.stopPropagation()} 
                          {...props} 
                        />
                      ),
                      ul: ({node, ...props}) => <ul className="list-disc list-outside pl-5 mb-3 space-y-1 text-slate-300 text-sm" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal list-outside pl-5 mb-3 space-y-1 text-slate-300 text-sm" {...props} />,
                      li: ({node, ...props}) => <li className="leading-relaxed" {...props} />,
                      strong: ({node, ...props}) => <strong className="font-bold text-white" {...props} />,
                      blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-emerald-500 pl-3 py-1 italic bg-slate-950/60 text-slate-400 mb-3 rounded-r" {...props} />
                    }}
                  >
                    {selectedPlatform.reviewContent}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-white mb-3">Why Choose {selectedPlatform.name}?</h3>
                  <p className="text-slate-300 mb-4">Unlock exclusive benefits and massive bonuses when you join {selectedPlatform.name}. Fast withdrawals, huge game selection, and VIP rewards await!</p>
                  <ul className="space-y-2 text-slate-300">
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" /> Verified & Trusted Platform</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" /> Fast & Secure Withdrawals</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" /> 24/7 Customer Support</li>
                  </ul>
                </div>
              )}

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="text-center sm:text-left">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">Your Exclusive Promo Code</span>
                  <span className="text-3xl font-black text-amber-400 font-mono tracking-tight">{selectedPlatform.promoCode || 'MAXBOOST500'}</span>
                </div>
                <button
                  onClick={(e) => {
                     e.stopPropagation();
                     navigator.clipboard.writeText(selectedPlatform.promoCode || 'MAXBOOST500');
                     onClaimClick(selectedPlatform);
                     setSelectedPlatform(null);
                  }}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-emerald-900/50 flex items-center justify-center gap-2 transition-all transform hover:scale-105"
                >
                  <Copy className="w-5 h-5" />
                  <span>COPY & CLAIM BONUS</span>
                  <ExternalLink className="w-4 h-4 ml-1 opacity-70" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
