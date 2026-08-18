import React, { Suspense, useEffect } from 'react';
import { GamingPlatform, GlobalConfig, CustomPage, AIArticle } from '../types';
import { BackButton } from './BackButton';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { AffiliateLinkCard } from './AffiliateLinkCard';
import { Footer } from './Footer';
import { Eye, Calendar, Tag, ChevronRight } from 'lucide-react';
const Markdown = React.lazy(() => import('react-markdown'));

interface AiArticleViewProps {
  article: AIArticle;
  platforms: GamingPlatform[];
  customPages: CustomPage[];
  config: GlobalConfig;
  geo: any;
  onClaimClick: (platform: GamingPlatform) => void;
}

export const AiArticleView: React.FC<AiArticleViewProps> = ({ article, platforms, customPages, config, geo, onClaimClick }) => {
  const targetPlatform = article.platformId 
    ? platforms.find(p => p.id === article.platformId) 
    : (platforms.length > 0 ? platforms[0] : null);

  useEffect(() => {
    document.title = article.metaTitle || `${article.title} - VIP Rewards`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && article.metaDescription) {
      metaDesc.setAttribute('content', article.metaDescription);
    }
  }, [article]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans selection:bg-amber-500/30">
      <Navbar platforms={platforms} customPages={customPages} geo={geo} />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BackButton className="mb-6" />
          
          <div className="flex items-center text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider mb-8 overflow-x-auto whitespace-nowrap pb-2">
            <a href="/" className="hover:text-amber-400 transition-colors">Home</a>
            <ChevronRight className="w-3 h-3 mx-2 shrink-0" />
            <span className="text-slate-400">Blog</span>
            <ChevronRight className="w-3 h-3 mx-2 shrink-0" />
            <span className="text-amber-400 truncate max-w-[200px] sm:max-w-none">{article.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Main Content Area */}
            <div className="lg:col-span-8 space-y-8 animate-fade-in-up">
              
              <article className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-amber-500 to-purple-500"></div>
                
                <header className="mb-10">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-slate-800 text-amber-400 rounded-full text-xs font-bold uppercase tracking-wide border border-amber-500/20">
                      {article.category}
                    </span>
                    {article.platformName && (
                      <span className="px-3 py-1 bg-slate-800 text-cyan-400 rounded-full text-xs font-bold border border-cyan-500/20">
                        {article.platformName}
                      </span>
                    )}
                  </div>
                  
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight mb-6">
                    {article.title}
                  </h1>
                  
                  <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400 font-bold border-y border-slate-800/80 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-300">
                        A
                      </div>
                      <span className="text-slate-300">{article.author || 'Editorial Team'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(article.publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{(article.views || Math.floor(Math.random() * 500) + 120).toLocaleString()} Views</span>
                    </div>
                  </div>
                </header>

                <div className="prose prose-invert prose-slate max-w-none prose-headings:font-black prose-headings:text-white prose-a:text-amber-400 hover:prose-a:text-amber-300 prose-p:text-slate-300 prose-p:leading-relaxed prose-li:text-slate-300">

                  <div className="markdown-body">
                    {article.content.split('[CTA]').map((part, index, array) => (
                      <React.Fragment key={index}>
                        <Suspense fallback={<div>Loading content...</div>}>
<Markdown>{part}</Markdown>
</Suspense>
                        {index < array.length - 1 && targetPlatform && (
                           <div className="my-8 flex justify-center">
                             <button 
                               onClick={() => onClaimClick(targetPlatform)}
                               className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-lg uppercase tracking-widest shadow-lg transition-transform transform hover:scale-105 active:scale-95"
                             >
                               {targetPlatform.bonusText || 'Claim Bonus Now'}
                             </button>
                           </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                </div>
                
                {/* CTA Section */}
                {(() => {
if (!targetPlatform) return null;
                  
                  return (
                    <div className="mt-12 bg-gradient-to-br from-slate-900 to-slate-800 border border-emerald-500/30 rounded-2xl p-8 text-center relative overflow-hidden shadow-2xl shadow-emerald-900/20">
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
                      <div className="relative z-10">
                        <h3 className="text-2xl font-black text-white mb-2">Ready to Start Winning?</h3>
                        <p className="text-slate-300 mb-6 max-w-lg mx-auto">
                          Join {targetPlatform.name} today and claim your exclusive {targetPlatform.bonusText || 'Welcome Bonus'}!
                        </p>
                        <button 
                          onClick={() => onClaimClick(targetPlatform)}
                          className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-lg uppercase tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all transform hover:scale-105 active:scale-95"
                        >
                          Claim Bonus & Play Now
                        </button>
                      </div>
                    </div>
                  );
                })()}

                {article.tags && article.tags.length > 0 && (
                  <div className="mt-12 pt-6 border-t border-slate-800/80">
                    <div className="flex items-center gap-2 mb-3">
                      <Tag className="w-4 h-4 text-slate-500" />
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Related Tags</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {article.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs font-bold text-slate-400 hover:text-white hover:border-slate-700 transition-colors cursor-pointer">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              
                {article.affiliateLinks && article.affiliateLinks.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-slate-800">
                    <h3 className="text-xl font-black text-white mb-6">Recommended Offers</h3>
                    <div className="space-y-4">
                      {article.affiliateLinks.map((link) => (
                        <AffiliateLinkCard key={link.id} link={link} />
                      ))}
                    </div>
                  </div>
                )}
              </article>
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <Sidebar 
                platforms={platforms} 
                customPages={customPages} 
                config={config} 
                geo={geo} 
                currentPlatformId={article.platformId}
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer 
        platforms={platforms} 
        customPages={customPages} 
        geo={geo} 
        config={config} 
        setShowSubPartnerModal={() => {}}
        setShowReferModal={() => {}}
        setShowAdminLogin={() => {}}
        adminToken={null}
        setViewingAdmin={() => {}}
      />
    </div>
  );
};
