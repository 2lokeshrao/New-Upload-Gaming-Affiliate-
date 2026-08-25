import React, { useEffect, useMemo } from 'react';
import { Sidebar } from './Sidebar';
import { GamingPlatform, CustomPage, GlobalConfig } from '../types';
import { Wallet, Bitcoin, Zap, ArrowRight, ShieldCheck, ChevronRight, Home, CreditCard, Landmark } from 'lucide-react';
import { UserGeo } from '../types';
import { injectSeoTags } from '../utils/seo';

export const WalletArticlePage: React.FC<{ path: string; geo: any; platforms: GamingPlatform[]; customPages: CustomPage[]; config: GlobalConfig }> = ({ path, geo, platforms, customPages, config }) => {
  // Parse URL: e.g., /wallets/astropay-deposit-guide
  const slug = path.split('/').pop() || '';
  
  // Basic content mapping
  let walletName = 'E-Wallet';
  let icon = Wallet;
  let color = 'text-blue-500';
  let bg = 'bg-blue-500/10';
  
  if (slug.includes('astropay')) { walletName = 'AstroPay'; icon = Wallet; color = 'text-red-500'; bg = 'bg-red-500/10'; }
  else if (slug.includes('binance') || slug.includes('crypto') || slug.includes('usdt')) { walletName = 'Binance'; icon = Bitcoin; color = 'text-yellow-500'; bg = 'bg-yellow-500/10'; }
  else if (slug.includes('pix')) { walletName = 'Pix'; icon = Zap; color = 'text-emerald-500'; bg = 'bg-emerald-500/10'; }
  else if (slug.includes('skrill')) { walletName = 'Skrill'; icon = CreditCard; color = 'text-purple-500'; bg = 'bg-purple-500/10'; }
  else if (slug.includes('pay4fun')) { walletName = 'Pay4Fun'; icon = Zap; color = 'text-green-500'; bg = 'bg-green-500/10'; }
  
  let brandName = 'Top Gaming Platforms';
  if (slug.includes('1win')) brandName = '1Win';
  if (slug.includes('mostbet')) brandName = 'Mostbet';
  if (slug.includes('stake')) brandName = 'Stake';

  const isCrypto = walletName === 'Binance' || slug.includes('crypto');
  const countryName = geo?.countryName || geo?.countryCode || 'Global';

  // Dynamic SEO Text
  const title = isCrypto 
    ? `Best Crypto Exchange for Betting Withdrawals: ${walletName} Guide (${countryName})`
    : `How to Create a ${walletName} Account & Deposit on ${brandName} (${countryName})`;
    
  const description = isCrypto
    ? `Learn how to withdraw your betting winnings instantly via ${walletName} in ${countryName}. Avoid bank blocks and get the lowest fees.`
    : `Complete guide on using ${walletName} for instant online gaming deposits on ${brandName} in ${countryName}. Get your ${walletName} account today and claim your welcome bonus.`;

  // Update SEO Meta Tags
  useEffect(() => {
    const canonical = `https://bonuspromocode.in${path}`;
    const ogImg = isCrypto ? 'https://bonuspromocode.in/og-crypto.png' : 'https://bonuspromocode.in/og-finance.png';
    injectSeoTags(title, description, canonical, ogImg);
  }, [title, description, path, isCrypto]);

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    window.history.pushState({}, '', href);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const Icon = icon;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-amber-400 selection:text-slate-950 flex flex-col">
      {/* Mini Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" onClick={(e) => handleNav(e, '/')} className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Landmark className="w-4 h-4 text-slate-950" />
            </div>
            <span className="font-black text-xl tracking-tight text-white group-hover:text-amber-400 transition-colors">BonusPromoCode</span>
          </a>
          <a href="/" onClick={(e) => handleNav(e, '/')} className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-colors bg-slate-800/50 hover:bg-slate-800 px-4 py-2 rounded-full">
            <Home className="w-4 h-4" />
            Back to Home
          </a>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto px-4 py-12 w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-8">
          <a href="/" onClick={(e) => handleNav(e, '/')} className="hover:text-amber-400">Home</a>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-300">{isCrypto ? 'Crypto Guides' : 'Wallet Guides'}</span>
          <ChevronRight className="w-3 h-3" />
          <span className={`${color}`}>{walletName} Deposit</span>
        </div>

        {/* Hero Article Header */}
        <div className="mb-12 text-center md:text-left md:flex items-center gap-8">
          <div className={`w-24 h-24 md:w-32 md:h-32 rounded-2xl flex-shrink-0 flex items-center justify-center mx-auto md:mx-0 mb-6 md:mb-0 border border-slate-800/80 ${bg} ${color}`}>
            <Icon className="w-12 h-12 md:w-16 md:h-16" />
          </div>
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4">{title}</h1>
            <p className="text-lg text-slate-400 leading-relaxed max-w-2xl">{description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
        {/* Article Body */}
        <article className="prose prose-invert prose-slate prose-lg max-w-none">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-10 shadow-2xl mb-10">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              Why Choose {walletName} for {brandName}?
            </h2>
            <p className="text-slate-300 leading-relaxed mb-6">
              {walletName} is one of the most widely accepted and secure payment methods for international gaming platforms like {brandName}. 
              It offers instant deposits and lightning-fast withdrawals, ensuring you never have to wait to start playing or to receive your winnings.
              By using a dedicated {isCrypto ? 'crypto exchange' : 'e-wallet'} like {walletName}, you keep your primary banking details entirely private and bypass traditional banking restrictions on iGaming.
            </p>

            <h2 className="text-2xl font-bold text-white mt-10 mb-4">Step-by-Step {isCrypto ? 'Withdrawal' : 'Deposit'} Guide</h2>
            <ul className="space-y-4 text-slate-300">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 text-amber-400 font-bold flex items-center justify-center">1</span>
                <div>
                  <strong className="text-white">Create a {walletName} Account:</strong> Visit the official {walletName} website and register for a free account. Complete any required KYC verification for faster limits.
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 text-amber-400 font-bold flex items-center justify-center">2</span>
                <div>
                  <strong className="text-white">Fund Your Wallet:</strong> Deposit funds into your {walletName} account using local methods like bank transfers, UPI, Pix, or credit cards.
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 text-amber-400 font-bold flex items-center justify-center">3</span>
                <div>
                  <strong className="text-white">Log into {brandName}:</strong> Head over to {brandName} and click on the "Deposit" or "Cashier" button.
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 text-amber-400 font-bold flex items-center justify-center">4</span>
                <div>
                  <strong className="text-white">Select {walletName}:</strong> Choose {walletName} from the list of payment providers, enter your desired amount, and follow the on-screen prompts to instantly authorize the transfer.
                </div>
              </li>
            </ul>

            {/* CTA Box */}
            <div className="mt-12 bg-gradient-to-r from-slate-950 to-slate-900 border border-amber-500/20 p-8 rounded-2xl text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none transform translate-x-1/2 -translate-y-1/2"></div>
              <h3 className="text-2xl font-black text-white mb-3">Ready to claim your 500% Welcome Bonus?</h3>
              <p className="text-slate-400 mb-8 max-w-lg mx-auto">Use our exclusive promo codes on top platforms. Sign up with your new {walletName} account today and get maximum rewards.</p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="/" onClick={(e) => handleNav(e, '/')} className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-8 py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-amber-500/25">
                  View Promo Codes <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </div>

          </div>
        </article>
          </div>
          <aside className="lg:col-span-1 space-y-8">
            <Sidebar platforms={platforms} customPages={customPages} config={config} geo={geo} />
          </aside>
        </div>
      </main>

      
    </div>
  );
};
