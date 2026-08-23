import React, { useEffect, useMemo } from 'react';
import { CustomPage, GlobalConfig, AIArticle, GamingPlatform } from '../types';
import { ChevronRight, FileText, Search } from 'lucide-react';
import { Sidebar } from './Sidebar';

export const ArticlesHubPage: React.FC<{ 
  customPages?: CustomPage[];
  platforms?: GamingPlatform[];
  config?: GlobalConfig;
}> = ({ customPages = [], platforms = [], config }) => {

  useEffect(() => {
    document.title = "All Articles & Loans | BonusPromoCode";
  }, []);

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    window.history.pushState({}, '', href);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const [search, setSearch] = React.useState('');

  const activePages = useMemo(() => {
    let pages = customPages.filter(p => p.isActive);
    if (search) {
      pages = pages.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));
    }
    return pages;
  }, [customPages, search]);

  const autoArticles = useMemo(() => {
    let aiArts = config?.articles || [];
    if (search) {
      aiArts = aiArts.filter(a => a.title.toLowerCase().includes(search.toLowerCase()) || a.metaDescription.toLowerCase().includes(search.toLowerCase()));
    }
    return aiArts;
  }, [config, search]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans flex flex-col">
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
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-8">
          <a href="/" onClick={(e) => handleNav(e, '/')} className="hover:text-amber-400">Home</a>
          <ChevronRight className="w-3 h-3" />
          <span className="text-emerald-400">All Articles & Hub</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <main className="lg:col-span-3 space-y-8">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-10 shadow-2xl">
              <h1 className="text-3xl md:text-5xl font-black text-white mb-6">Content Hub</h1>
              <p className="text-slate-400 text-lg mb-8">Browse all our dedicated pages, loan guides, and articles in one place.</p>
              
              <div className="relative mb-10">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input 
                  type="text" 
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search articles and guides..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 pl-12 pr-4 text-white focus:border-amber-500 transition-colors"
                />
              </div>

              {activePages.length > 0 && (
                <div className="mb-10">
                  <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2 border-b border-slate-800 pb-2">
                    <FileText className="w-6 h-6 text-emerald-400" />
                    Dedicated Guides & Loans
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {activePages.map(p => (
                      <a 
                        key={p.id}
                        href={`/${p.slug}`}
                        onClick={(e) => handleNav(e, `/${p.slug}`)}
                        className="p-5 bg-slate-950 border border-slate-800 rounded-xl hover:border-emerald-500/50 transition-colors group"
                      >
                        <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 mb-2">{p.title}</h3>
                        <p className="text-sm text-slate-400 line-clamp-2">{p.metaDescription || 'Read our complete guide and offers.'}</p>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {autoArticles.length > 0 && (
                <div>
                  <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2 border-b border-slate-800 pb-2">
                    <FileText className="w-6 h-6 text-amber-400" />
                    Latest Articles
                  </h2>
                  <div className="grid grid-cols-1 gap-4">
                    {autoArticles.map(a => (
                      <a 
                        key={a.id}
                        href={`/blog/${a.slug}`}
                        onClick={(e) => handleNav(e, `/blog/${a.slug}`)}
                        className="p-5 bg-slate-950 border border-slate-800 rounded-xl hover:border-amber-500/50 transition-colors group flex flex-col md:flex-row gap-4 items-start"
                      >
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-white group-hover:text-amber-400 mb-2">{a.title}</h3>
                          <p className="text-sm text-slate-400 line-clamp-2 mb-2">{a.metaDescription}</p>
                          <div className="text-xs font-bold text-amber-500/70">{a.category}</div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {activePages.length === 0 && autoArticles.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                  No articles found matching your search.
                </div>
              )}

            </div>
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
