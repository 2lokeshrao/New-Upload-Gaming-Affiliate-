
import DOMPurify from 'dompurify';
import React, { useEffect, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import { CustomPage, GamingPlatform, GlobalConfig, AIArticle } from '../types';
import { ChevronRight, HelpCircle, ChevronDown, Gamepad2, Gift, Globe } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { AffiliateLinkCard } from './AffiliateLinkCard';
import { injectSeoTags } from '../utils/seo';

export const CustomPageView: React.FC<{ 
  page: CustomPage;
  platforms?: GamingPlatform[];
  customPages?: CustomPage[];
  config?: GlobalConfig;
}> = ({ page, platforms = [], customPages = [], config }) => {

  useEffect(() => {
    const title = page.metaTitle || `${page.title} | BonusPromoCode`;
    const desc = page.metaDescription || page.title;
    const url = `https://bonuspromocode.in/${page.slug}`;
    injectSeoTags(title, desc, url, '');
  }, [page]);

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    window.history.pushState({}, '', href);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const relatedArticles = useMemo(() => {
    if (!config || !config.articles) return [];
    return config.articles.filter(a => 
      a.platformName?.toLowerCase() === page.title.toLowerCase() ||
      a.category?.toLowerCase() === page.slug.toLowerCase() ||
      a.category?.toLowerCase() === page.title.toLowerCase()
    );
  }, [config, page]);

  const [openFaq, setOpenFaq] = React.useState<number | null>(null);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-amber-400 selection:text-slate-950 flex flex-col">
      <header className="border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" onClick={(e) => handleNav(e, '/')} className="flex items-center gap-2 group">
            <span className="font-black text-xl tracking-tight text-white group-hover:text-amber-400 transition-colors">BonusPromoCode</span>
          </a>
          <a href="/" onClick={(e) => handleNav(e, '/')} className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-colors bg-slate-800/50 hover:bg-slate-800 px-4 py-2 rounded-full">
            Back to Home
          </a>
        </div>
      </header>
      
      <main className="flex-1 max-w-7xl mx-auto px-4 py-12 w-full">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-8 flex-wrap">
          <a href="/" onClick={(e) => handleNav(e, '/')} className="hover:text-amber-400">Home</a>
          <ChevronRight className="w-3 h-3" />
          <span className="text-emerald-400">{page.title}</span>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <main className="lg:col-span-3 space-y-8">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-10 shadow-2xl">
              <h1 className="text-3xl md:text-5xl font-black text-white mb-6">{page.title}</h1>
              
              {page.promoCode && (
                <div className="mb-8 p-4 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-xl flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <Gift className="w-8 h-8 text-amber-400" />
                    <div>
                      <div className="text-amber-300 text-xs font-bold uppercase tracking-wider">Exclusive Promo Code</div>
                      <div className="text-white font-black text-xl">{page.promoCode}</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(page.promoCode || '');
                      alert('Promo code copied!');
                    }}
                    className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-black rounded-lg transition-colors"
                  >
                    Copy Code
                  </button>
                </div>
              )}

              <article className="prose prose-invert prose-slate max-w-none prose-a:text-emerald-400 hover:prose-a:text-emerald-300">
                <ReactMarkdown 
                  rehypePlugins={[rehypeSanitize]}
                  components={{
                    h1: ({node, ...props}) => <h1 className="text-3xl md:text-5xl font-black text-white mt-12 mb-6 leading-tight" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-2xl md:text-3xl font-black text-white mt-10 mb-4 border-b border-slate-800 pb-2" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-xl md:text-2xl font-bold text-white mt-8 mb-4" {...props} />,
                    h4: ({node, ...props}) => <h4 className="text-lg md:text-xl font-bold text-white mt-6 mb-3" {...props} />,
                    p: ({node, ...props}) => <p className="text-slate-300 leading-relaxed mb-6 text-base md:text-lg" {...props} />,
                    a: ({node, ...props}) => <a className="text-emerald-400 hover:text-emerald-300 underline underline-offset-4 decoration-emerald-500/30 transition-colors" target="_blank" rel="noopener noreferrer" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc list-outside pl-6 mb-6 space-y-2 text-slate-300" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal list-outside pl-6 mb-6 space-y-2 text-slate-300" {...props} />,
                    li: ({node, ...props}) => <li className="leading-relaxed pl-2" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-bold text-white" {...props} />,
                    blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-emerald-500 pl-4 py-1 italic bg-slate-900/50 text-slate-400 mb-6 rounded-r-lg" {...props} />,
                    hr: ({node, ...props}) => <hr className="border-t border-slate-800 my-8" {...props} />
                  }}
                >
                  {page.content || ''}
                </ReactMarkdown>
              </article>
            </div>

            {page.affiliateLinks && page.affiliateLinks.length > 0 && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-10 shadow-2xl">
                <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                  <Globe className="w-6 h-6 text-cyan-400" />
                  Available Countries & Links
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {page.affiliateLinks.map((link, idx) => (
                    <a 
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl hover:border-cyan-500/50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        {link.logoUrl && (
                          <img src={link.logoUrl || undefined} alt={link.title} width="32" height="32" className="w-8 h-8 rounded-full object-contain" />
                        )}
                        <div>
                          <div className="text-white font-bold group-hover:text-cyan-400 transition-colors">{link.title}</div>
                          {link.description && <div className="text-xs text-slate-400">{link.description}</div>}
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {page.faqs && page.faqs.length > 0 && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-10 shadow-2xl">
                <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                  <HelpCircle className="w-6 h-6 text-purple-400" />
                  Frequently Asked Questions
                </h2>
                <div className="space-y-3">
                  {page.faqs.map((faq, i) => (
                    <div key={i} className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                      <button 
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        className="w-full text-left p-4 flex items-center justify-between text-white font-bold hover:bg-slate-800/50 transition-colors"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                      </button>
                      {openFaq === i && (
                        <div className="p-4 border-t border-slate-800 text-slate-300 text-sm leading-relaxed bg-slate-900/50">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {relatedArticles.length > 0 && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-10 shadow-2xl">
                <h2 className="text-2xl font-black text-white mb-6">Related Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {relatedArticles.map((article) => (
                    <a 
                      key={article.id}
                      href={`/blog/${article.slug}`}
                      onClick={(e) => handleNav(e, `/blog/${article.slug}`)}
                      className="block p-4 bg-slate-950 border border-slate-800 rounded-xl hover:border-amber-500/50 transition-all group"
                    >
                      <h3 className="text-white font-bold mb-2 group-hover:text-amber-400 transition-colors line-clamp-2">{article.title}</h3>
                      <p className="text-sm text-slate-400 line-clamp-2">{article.metaDescription}</p>
                    </a>
                  ))}
                </div>
              </div>
            )}

          </main>
          
          <aside className="lg:col-span-1 space-y-8">
            <Sidebar 
               platforms={platforms} 
               customPages={customPages} 
               config={config || {} as GlobalConfig} 
               geo={{ country: '', countryCode: '', city: '', ip: '', flag: '' }} 
             />
          </aside>
        </div>
      </main>
    </div>
  );
};
