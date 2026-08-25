import React, { useState } from 'react';
import { Search, Menu, X, Landmark, Globe, CreditCard, Sparkles, FileText, ChevronDown, Coins, Globe as GlobeIcon } from 'lucide-react';
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

  // Category classification helpers
  const isFinancePlatform = (p: GamingPlatform) => {
    const cat = (p.category || '').toLowerCase();
    const name = (p.name || '').toLowerCase();
    return cat.includes('loan') || 
           cat.includes('card') || 
           cat.includes('bank') || 
           cat.includes('demat') || 
           cat.includes('invest') || 
           cat.includes('hosting') || 
           cat.includes('finance') ||
           name.includes('hostinger') ||
           name.includes('bharatpe') ||
           name.includes('gromo') ||
           name.includes('loan');
  };

  const isCryptoPlatform = (p: GamingPlatform) => {
    const cat = (p.category || '').toLowerCase();
    const name = (p.name || '').toLowerCase();
    return cat.includes('crypto') || 
           cat.includes('exchange') || 
           cat.includes('wallet') || 
           name.includes('bybit') || 
           name.includes('binance') || 
           name.includes('stake');
  };

  const isGamingPlatform = (p: GamingPlatform) => {
    const cat = (p.category || '').toLowerCase();
    const name = (p.name || '').toLowerCase();
    // Exclude finance and pure non-gaming crypto/hosting
    if (isFinancePlatform(p)) return false;
    if (cat.includes('crypto exchange') || cat.includes('crypto wallet') || name.includes('bybit') || name.includes('binance') || name.includes('hostinger')) {
      return false;
    }
    return true;
  };

  const gamingPlatforms = platforms.filter(p => p.isActive && isGamingPlatform(p));
  const financePlatforms = platforms.filter(p => p.isActive && isFinancePlatform(p));
  const cryptoPlatforms = platforms.filter(p => p.isActive && isCryptoPlatform(p));
  const activeCustomPages = customPages.filter(p => p.isActive);

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <a href="/" onClick={(e) => handleNav(e, '/')} className="flex items-center gap-2 group">
              <img src="/logo.svg" alt="Bonus Promo Code" width="180" height="44" className="h-9 sm:h-11 w-auto" />
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-1 lg:space-x-4">
              <a href="/" onClick={(e) => handleNav(e, '/')} className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-bold whitespace-nowrap shrink-0">Home</a>
              
              {/* 1. Gaming Brands Only Dropdown */}
              <div className="relative group">
                <button className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-bold whitespace-nowrap shrink-0 flex items-center gap-1 group-hover:bg-slate-800">
                  <Landmark className="w-4 h-4 text-amber-400"/> Gaming Brands <ChevronDown className="w-3.5 h-3.5 text-slate-400 opacity-60 group-hover:opacity-100" />
                </button>
                <div className="absolute left-0 mt-0 w-60 bg-slate-800 border border-slate-700 rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2 top-full max-h-96 overflow-y-auto z-50">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-amber-400 uppercase tracking-wider border-b border-slate-700/60 mb-1">
                    🎰 Verified Gaming Platforms
                  </div>
                  {gamingPlatforms.map(p => (
                    <a
                      key={p.id}
                      href={`/brands/${p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-promo-code-${countrySlug}`}
                      onClick={(e) => handleNav(e, `/brands/${p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-promo-code-${countrySlug}`)}
                      className="block px-4 py-2 text-sm text-slate-300 hover:text-amber-400 hover:bg-slate-700/50 transition-colors"
                    >
                      {p.name}
                    </a>
                  ))}
                  {gamingPlatforms.length === 0 && (
                    <span className="block px-4 py-2 text-xs text-slate-400">No gaming platforms active</span>
                  )}
                </div>
              </div>

              {/* 2. Finance Hub Dropdown */}
              <div className="relative group">
                <button className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-bold whitespace-nowrap shrink-0 flex items-center gap-1 group-hover:bg-slate-800">
                  <CreditCard className="w-4 h-4 text-emerald-400"/> Finance Hub <ChevronDown className="w-3.5 h-3.5 text-slate-400 opacity-60 group-hover:opacity-100" />
                </button>
                <div className="absolute left-0 mt-0 w-64 bg-slate-800 border border-slate-700 rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2 top-full z-50">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-emerald-400 uppercase tracking-wider border-b border-slate-700/60 mb-1">
                    💳 Finance & Payment Services
                  </div>
                  <a href="/banking/best-virtual-cards-for-gaming" onClick={(e) => handleNav(e, '/banking/best-virtual-cards-for-gaming')} className="block px-4 py-2 text-sm text-slate-300 hover:text-emerald-400 hover:bg-slate-700/50 font-medium">Virtual Cards Guide</a>
                  <a href="/personal-loan" onClick={(e) => handleNav(e, '/personal-loan')} className="block px-4 py-2 text-sm text-slate-300 hover:text-emerald-400 hover:bg-slate-700/50 font-medium">Personal Loan Options</a>
                  <a href="/home-loan" onClick={(e) => handleNav(e, '/home-loan')} className="block px-4 py-2 text-sm text-slate-300 hover:text-emerald-400 hover:bg-slate-700/50 font-medium">Home Loan Guide</a>
                  
                  {financePlatforms.length > 0 && (
                    <>
                      <div className="border-t border-slate-700/60 my-1"></div>
                      <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Featured Finance Brands
                      </div>
                      {financePlatforms.map(p => (
                        <a
                          key={p.id}
                          href={`/brands/${p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-promo-code-${countrySlug}`}
                          onClick={(e) => handleNav(e, `/brands/${p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-promo-code-${countrySlug}`)}
                          className="block px-4 py-1.5 text-xs text-slate-300 hover:text-emerald-400 hover:bg-slate-700/50"
                        >
                          {p.name}
                        </a>
                      ))}
                    </>
                  )}
                </div>
              </div>

              {/* 3. Crypto Dropdown */}
              <div className="relative group">
                <button className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-bold whitespace-nowrap shrink-0 flex items-center gap-1 group-hover:bg-slate-800">
                  <Coins className="w-4 h-4 text-cyan-400"/> Crypto <ChevronDown className="w-3.5 h-3.5 text-slate-400 opacity-60 group-hover:opacity-100" />
                </button>
                <div className="absolute left-0 mt-0 w-64 bg-slate-800 border border-slate-700 rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2 top-full z-50">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-cyan-400 uppercase tracking-wider border-b border-slate-700/60 mb-1">
                    ⚡ Crypto Exchanges & Wallets
                  </div>
                  <a href="/crypto/binance-usdt-withdrawal-guide" onClick={(e) => handleNav(e, '/crypto/binance-usdt-withdrawal-guide')} className="block px-4 py-2 text-sm text-slate-300 hover:text-cyan-400 hover:bg-slate-700/50 font-medium">Binance USDT Guide</a>
                  
                  {cryptoPlatforms.length > 0 && (
                    <>
                      <div className="border-t border-slate-700/60 my-1"></div>
                      <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Crypto Platforms
                      </div>
                      {cryptoPlatforms.map(p => (
                        <a
                          key={p.id}
                          href={`/brands/${p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-promo-code-${countrySlug}`}
                          onClick={(e) => handleNav(e, `/brands/${p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-promo-code-${countrySlug}`)}
                          className="block px-4 py-1.5 text-xs text-slate-300 hover:text-cyan-400 hover:bg-slate-700/50"
                        >
                          {p.name}
                        </a>
                      ))}
                    </>
                  )}
                </div>
              </div>
              
              {/* 4. Articles Button & Dropdown (Renamed from Articles & Loans to Articles) */}
              <div className="relative group">
                <button className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-bold whitespace-nowrap shrink-0 flex items-center gap-1 group-hover:bg-slate-800">
                  <FileText className="w-4 h-4 text-purple-400"/> Articles <ChevronDown className="w-3.5 h-3.5 text-slate-400 opacity-60 group-hover:opacity-100" />
                </button>
                <div className="absolute left-0 mt-0 w-72 bg-slate-800 border border-slate-700 rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2 top-full max-h-96 overflow-y-auto z-50">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-purple-400 uppercase tracking-wider border-b border-slate-700/60 mb-1">
                    📚 All Articles & Guides
                  </div>
                  {activeCustomPages.map(p => (
                    <a
                      key={p.id}
                      href={`/${p.slug}`}
                      onClick={(e) => handleNav(e, `/${p.slug}`)}
                      className="block px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                    >
                      {p.title}
                    </a>
                  ))}
                  {activeCustomPages.length === 0 && (
                    <span className="block px-4 py-2 text-xs text-slate-400">No articles available</span>
                  )}
                  <div className="border-t border-slate-700/60 my-1"></div>
                  <a href="/articles" onClick={(e) => handleNav(e, '/articles')} className="block px-4 py-2 text-xs text-center font-bold text-amber-400 hover:text-amber-300 hover:bg-slate-700/50">
                    View All Articles &rarr;
                  </a>
                </div>
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
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center ml-1">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-slate-400 hover:text-white focus:outline-none p-1"
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-4 pt-2 pb-6 space-y-2 bg-slate-900 border-b border-slate-800 shadow-xl absolute w-full max-h-[85vh] overflow-y-auto">
          <a href="/" onClick={(e) => handleNav(e, '/')} className="text-slate-300 hover:text-white block px-3 py-3 rounded-md text-base font-bold bg-slate-800/50 flex items-center gap-2"><Landmark className="w-5 h-5 text-amber-400"/> Home</a>
          
          <div className="pt-2 pb-1 border-t border-slate-800 mt-2">
            <div className="px-3 text-xs font-bold text-amber-400 uppercase mb-2">Gaming Brands</div>
            {gamingPlatforms.slice(0, 8).map(p => (
              <a
                key={p.id}
                href={`/brands/${p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-promo-code-${countrySlug}`}
                onClick={(e) => handleNav(e, `/brands/${p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-promo-code-${countrySlug}`)}
                className="text-slate-300 hover:text-amber-400 block px-3 py-2 mb-1 rounded-md text-sm bg-slate-800/30"
              >
                {p.name}
              </a>
            ))}
          </div>

          <div className="pt-2 pb-1 border-t border-slate-800 mt-2">
            <div className="px-3 text-xs font-bold text-emerald-400 uppercase mb-2">Finance Hub</div>
            <a href="/banking/best-virtual-cards-for-gaming" onClick={(e) => handleNav(e, '/banking/best-virtual-cards-for-gaming')} className="text-slate-300 hover:text-emerald-400 block px-3 py-2 mb-1 rounded-md text-sm bg-slate-800/30">Virtual Cards Guide</a>
            <a href="/personal-loan" onClick={(e) => handleNav(e, '/personal-loan')} className="text-slate-300 hover:text-emerald-400 block px-3 py-2 mb-1 rounded-md text-sm bg-slate-800/30">Personal Loan Options</a>
            <a href="/home-loan" onClick={(e) => handleNav(e, '/home-loan')} className="text-slate-300 hover:text-emerald-400 block px-3 py-2 mb-1 rounded-md text-sm bg-slate-800/30">Home Loan Guide</a>
            {financePlatforms.map(p => (
              <a
                key={p.id}
                href={`/brands/${p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-promo-code-${countrySlug}`}
                onClick={(e) => handleNav(e, `/brands/${p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-promo-code-${countrySlug}`)}
                className="text-slate-300 hover:text-emerald-400 block px-3 py-2 mb-1 rounded-md text-sm bg-slate-800/30"
              >
                {p.name}
              </a>
            ))}
          </div>

          <div className="pt-2 pb-1 border-t border-slate-800 mt-2">
            <div className="px-3 text-xs font-bold text-cyan-400 uppercase mb-2">Crypto</div>
            <a href="/crypto/binance-usdt-withdrawal-guide" onClick={(e) => handleNav(e, '/crypto/binance-usdt-withdrawal-guide')} className="text-slate-300 hover:text-cyan-400 block px-3 py-2 mb-1 rounded-md text-sm bg-slate-800/30">Binance USDT Guide</a>
            {cryptoPlatforms.map(p => (
              <a
                key={p.id}
                href={`/brands/${p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-promo-code-${countrySlug}`}
                onClick={(e) => handleNav(e, `/brands/${p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-promo-code-${countrySlug}`)}
                className="text-slate-300 hover:text-cyan-400 block px-3 py-2 mb-1 rounded-md text-sm bg-slate-800/30"
              >
                {p.name}
              </a>
            ))}
          </div>

          <div className="pt-2 pb-1 border-t border-slate-800 mt-2">
            <div className="px-3 text-xs font-bold text-purple-400 uppercase mb-2">Articles</div>
            {activeCustomPages.map(p => (
              <a key={p.id} href={`/${p.slug}`} onClick={(e) => handleNav(e, `/${p.slug}`)} className="text-slate-300 hover:text-white block px-3 py-2 mb-1 rounded-md text-sm bg-slate-800/30">{p.title}</a>
            ))}
            <a href="/articles" onClick={(e) => handleNav(e, '/articles')} className="text-amber-400 hover:text-amber-300 block px-3 py-2 rounded-md text-sm font-bold bg-slate-800/50 mt-1">View All Articles &rarr;</a>
          </div>
        </div>
      )}
    </nav>
  );
};
