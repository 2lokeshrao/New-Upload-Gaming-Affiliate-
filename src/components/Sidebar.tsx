import DOMPurify from 'dompurify';
import React from 'react';
import { GamingPlatform, CustomPage, GlobalConfig, UserGeo } from '../types';
import { Star, ChevronRight, FileText } from 'lucide-react';

export const Sidebar: React.FC<{
  platforms: GamingPlatform[];
  customPages: CustomPage[];
  config: GlobalConfig;
  geo: UserGeo;
  currentPlatformId?: string;
}> = ({ platforms, customPages, config, geo, currentPlatformId }) => {
  const otherPlatforms = platforms.filter(p => p.isActive && p.id !== currentPlatformId).slice(0, 5);
  const activePages = customPages.filter(p => p.isActive).slice(0, 5);

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    window.history.pushState({}, '', href);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <div className="space-y-6">
      {/* Ad Slot */}
      {config.sidebarAdHtml && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl overflow-hidden min-h-[250px] flex items-center justify-center text-slate-600 text-sm">
          <div dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(config.sidebarAdHtml || '', {
                  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'span', 'div', 'h1', 'h2', 'h3', 'h4'],
                  ALLOWED_ATTR: ['href', 'target', 'rel', 'class']
                })
              }} />
        </div>
      )}

      {/* Top Brands Widget */}
      {otherPlatforms.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h3 className="text-white font-black mb-4 flex items-center gap-2 border-b border-slate-800 pb-2">
            <Star className="w-4 h-4 text-amber-400" />
            Top Brands
          </h3>
          <div className="space-y-4">
            {otherPlatforms.map(p => {
              const url = `/brands/${p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-promo-code-${geo.countryCode ? geo.countryCode.toLowerCase() : 'global'}`;
              return (
                <a 
                  key={p.id} 
                  href={url}
                  onClick={(e) => handleNav(e, url)}
                  className="group flex items-center gap-3 p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <img width="40" height="40" decoding="async" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAHBJREFUWEft0zEKACAQw8D7/6f90lJwEFzEQe5SU5qsqqpeZ373n/2YczxQYxMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwkro5m+0BP002ATXz2hAAAAAASUVORK5CYII="; }} loading="lazy" src={p.logoUrl || undefined} alt={p.name} className="w-10 h-10 rounded-full border-2 border-slate-700 object-cover" />
                  <div className="flex-1">
                    <h4 className="text-slate-200 font-bold text-sm group-hover:text-amber-400 transition-colors">{p.name}</h4>
                    <p className="text-xs text-emerald-400 font-bold">{p.bonusText || p.bonusTitle}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400 transition-colors" />
                </a>
              );
            })}
          </div>
        </div>
      )}

      {/* Latest Articles / Pages Widget */}
      {activePages.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h3 className="text-white font-black mb-4 flex items-center gap-2 border-b border-slate-800 pb-2">
            <FileText className="w-4 h-4 text-blue-400" />
            Resources & Guides
          </h3>
          <div className="space-y-2">
            {activePages.map(page => (
              <a
                key={page.id}
                href={`/${page.slug}`}
                onClick={(e) => handleNav(e, `/${page.slug}`)}
                className="group flex items-center justify-between p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <span className="text-slate-300 text-sm group-hover:text-blue-400 font-bold transition-colors">{page.title}</span>
                <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-blue-400 transition-colors" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Related/Recent Articles */}
      {config.articles && config.articles.filter(a => a.status !== 'draft').length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-800">
            <FileText className="w-5 h-5 text-emerald-400" />
            <h3 className="font-black text-white uppercase tracking-wider text-sm">Related Articles</h3>
          </div>
          <div className="space-y-4">
            {config.articles.filter(a => a.status !== 'draft').slice(0, 5).map(article => (
              <a 
                key={article.id}
                href={`/blog/${article.slug}`}
                onClick={(e) => handleNav(e, `/blog/${article.slug}`)}
                className="group block"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-slate-300 group-hover:text-amber-400 transition-colors line-clamp-2 leading-tight">
                      {article.title}
                    </h4>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mt-1">
                      {article.category}
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
