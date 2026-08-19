import React, { useState } from 'react';
import { Search, Menu, X, Landmark, Globe, CreditCard, Sparkles, Globe as GlobeIcon } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { GamingPlatform, CustomPage, UserGeo } from '../types';

export const Navbar: React.FC<{ platforms: GamingPlatform[]; customPages: CustomPage[]; geo: UserGeo; onOpenAppModal?: () => void }> = ({ platforms, customPages, geo, onOpenAppModal }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const [search, setSearch] = useState('');

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    window.history.pushState({}, '', href);
    window.dispatchEvent(new PopStateEvent('popstate'));
    setIsOpen(false);
    setSearch('');
  };

  const countrySlug = geo.countryCode ? geo.countryCode.toLowerCase() : 'global';

  const filteredPlatforms = search 
    ? platforms.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) && p.isActive)
    : [];
    
  const filteredPages = search 
    ? customPages.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) && p.isActive)
    : [];

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <a href="/" onClick={(e) => handleNav(e, '/')} className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <Landmark className="w-4 h-4 text-slate-950" />
              </div>
              <span className="font-black text-xl text-white hidden sm:block">BonusPromoCode</span>
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-1 lg:space-x-4">
              <a href="/" onClick={(e) => handleNav(e, '/')} className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-bold whitespace-nowrap shrink-0">Home</a>
              <a href="/banking/best-virtual-cards-for-gaming" onClick={(e) => handleNav(e, '/banking/best-virtual-cards-for-gaming')} className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-bold whitespace-nowrap shrink-0 flex items-center gap-1"><CreditCard className="w-4 h-4"/> Finance Hub</a>
              <a href="/crypto/binance-usdt-withdrawal-guide" onClick={(e) => handleNav(e, '/crypto/binance-usdt-withdrawal-guide')} className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-bold whitespace-nowrap shrink-0 flex items-center gap-1"><Globe className="w-4 h-4"/> Crypto</a>
              
              {/* Search */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  type="text"
                  className="block w-40 lg:w-64 pl-10 pr-3 py-2 border border-slate-700 rounded-lg leading-5 bg-slate-950 text-slate-300 placeholder-slate-500 focus:outline-none focus:bg-slate-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 sm:text-sm transition-all"
                  placeholder="Search articles, guides, brands..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                
                {/* Search Dropdown */}
                {search && (
                  <div className="absolute mt-2 w-full bg-slate-800 border border-slate-700 rounded-lg shadow-2xl max-h-80 overflow-y-auto overflow-hidden">
                    {filteredPlatforms.length === 0 && filteredPages.length === 0 && (
                      <div className="px-4 py-3 text-sm text-slate-400">No results found</div>
                    )}
                    {filteredPlatforms.length > 0 && <div className="px-3 py-2 text-xs font-bold text-slate-500 uppercase bg-slate-900/50">Brands</div>}
                    {filteredPlatforms.map(p => (
                      <a 
                        key={p.id}
                        href={`/brands/${p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-promo-code-${countrySlug}`}
                        onClick={(e) => handleNav(e, `/brands/${p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-promo-code-${countrySlug}`)}
                        className="block px-4 py-3 text-sm text-white hover:bg-slate-700 hover:text-amber-400 transition-colors border-b border-slate-700/50 last:border-0"
                      >
                        {p.name} Promo Guide
                      </a>
                    ))}
                    
                    {filteredPages.length > 0 && <div className="px-3 py-2 text-xs font-bold text-slate-500 uppercase bg-slate-900/50">Articles</div>}
                    {filteredPages.map(p => (
                      <a 
                        key={p.id}
                        href={`/${p.slug}`}
                        onClick={(e) => handleNav(e, `/${p.slug}`)}
                        className="block px-4 py-3 text-sm text-emerald-400 hover:bg-slate-700 hover:text-emerald-300 transition-colors border-b border-slate-700/50 last:border-0"
                      >
                        {p.title}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          
          <div className="flex items-center gap-3">
            <div className="relative group hidden sm:flex items-center bg-slate-800 border border-slate-700 rounded-lg px-2 py-1">
              <GlobeIcon className="w-4 h-4 text-slate-400 mr-1" />
              <select 
                className="bg-transparent text-xs text-slate-200 outline-none cursor-pointer appearance-none pr-4"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="en" className="bg-slate-900">EN</option>
                <option value="hi" className="bg-slate-900">HI</option>
                <option value="pt" className="bg-slate-900">PT</option>
                <option value="es" className="bg-slate-900">ES</option>
                <option value="ru" className="bg-slate-900">RU</option>
              </select>
            </div>
            {onOpenAppModal && (
              <button 
                onClick={onOpenAppModal}
                className="bg-amber-400 text-slate-900 px-3 py-1.5 text-sm font-black rounded-xl hover:bg-amber-300 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-amber-400/20 flex items-center gap-1"
              >
                <Sparkles className="w-4 h-4" /> 
                <span className="hidden sm:inline">Get App</span>
                <span className="sm:hidden">App</span>
              </button>
            )}
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center ml-1">
              <button onClick={() => setIsOpen(!isOpen)} className="text-slate-400 hover:text-white focus:outline-none p-1">
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-4 pt-2 pb-6 space-y-2 bg-slate-900 border-b border-slate-800 shadow-xl absolute w-full">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-slate-700 rounded-lg bg-slate-950 text-white focus:border-amber-500 outline-none"
              placeholder="Search guides..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
           {/* Mobile Search Results */}
          {search && (
            <div className="mb-4 max-h-60 overflow-y-auto bg-slate-950 rounded-lg border border-slate-800">
              {filteredPlatforms.map(p => (
                <a key={p.id} href={`/brands/${p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-promo-code-${countrySlug}`} onClick={(e) => handleNav(e, `/brands/${p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-promo-code-${countrySlug}`)} className="block px-4 py-3 text-sm text-white hover:bg-slate-800 border-b border-slate-800">{p.name} Promo Guide</a>
              ))}
              {filteredPages.map(p => (
                <a key={p.id} href={`/${p.slug}`} onClick={(e) => handleNav(e, `/${p.slug}`)} className="block px-4 py-3 text-sm text-emerald-400 hover:bg-slate-800 border-b border-slate-800">{p.title}</a>
              ))}
            </div>
          )}
          
          <a href="/" onClick={(e) => handleNav(e, '/')} className="text-slate-300 hover:text-white block px-3 py-3 rounded-md text-base font-bold bg-slate-800/50">Home</a>
          <a href="/banking/best-virtual-cards-for-gaming" onClick={(e) => handleNav(e, '/banking/best-virtual-cards-for-gaming')} className="text-slate-300 hover:text-white block px-3 py-3 rounded-md text-base font-bold bg-slate-800/50 flex items-center gap-2"><CreditCard className="w-5 h-5"/> Cards & Finance</a>
          <a href="/crypto/binance-usdt-withdrawal-guide" onClick={(e) => handleNav(e, '/crypto/binance-usdt-withdrawal-guide')} className="text-slate-300 hover:text-white block px-3 py-3 rounded-md text-base font-bold bg-slate-800/50 flex items-center gap-2"><Globe className="w-5 h-5"/> Crypto Guides</a>
        </div>
      )}
    </nav>
  );
};
