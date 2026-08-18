import DOMPurify from 'dompurify';
import React, { useEffect } from 'react';
import { CustomPage, GamingPlatform, GlobalConfig } from '../types';
import { ChevronRight } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { AffiliateLinkCard } from './AffiliateLinkCard';

export const CustomPageView: React.FC<{ 
  page: CustomPage;
  platforms?: GamingPlatform[];
  customPages?: CustomPage[];
  config?: GlobalConfig;
}> = ({ page, platforms = [], customPages = [], config }) => {
  useEffect(() => {
    document.title = `${page.title} | BonusPromoCode`;
  }, [page.title]);

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    window.history.pushState({}, '', href);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

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
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-8">
          <a href="/" onClick={(e) => handleNav(e, '/')} className="hover:text-amber-400">Home</a>
          <ChevronRight className="w-3 h-3" />
          <span className="text-emerald-400">{page.title}</span>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <main className="lg:col-span-3">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-10 shadow-2xl">
              <h1 className="text-3xl md:text-5xl font-black text-white mb-8">{page.title}</h1>
              <article 
                className="prose prose-invert prose-slate max-w-none prose-a:text-emerald-400 hover:prose-a:text-emerald-300"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(page.content || '', {
                    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'span', 'div', 'h1', 'h2', 'h3', 'h4'],
                    ALLOWED_ATTR: ['href', 'target', 'rel', 'class']
                  })
                }} 
              />
            </div>
          </main>

          {/* Sidebar */}
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
