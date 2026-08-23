import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar } from './Sidebar';
import { GamingPlatform, CustomPage, GlobalConfig } from '../types';
import { CreditCard, CheckCircle, Landmark, Banknote, ShieldCheck, ArrowRight, Home, ChevronRight, Zap, Globe, TrendingUp, PiggyBank, Briefcase } from 'lucide-react';
import { UserGeo } from '../types';
import { LazyImage } from './LazyImage';
import { PlatformDetailsModal } from './PlatformDetailsModal';

export const FinancialHubPage: React.FC<{ path: string; geo: any; platforms: GamingPlatform[]; customPages: CustomPage[]; config: GlobalConfig }> = ({ path, geo, platforms, customPages, config }) => {
  // Determine primary intent based on URL
  const [selectedPlatform, setSelectedPlatform] = useState<GamingPlatform | null>(null);
  const isLoans = path.includes('/loans');
  const isCards = path.includes('/virtual-cards') || path.includes('/credit-card');
  
  const title = isLoans 
    ? "Instant Personal Loans & Short-Term Financing"
    : isCards 
      ? "Best Virtual & Credit Cards for iGaming"
      : "iGaming Financial & Payment Hub";
      
  const description = isLoans
    ? "Need quick funds? Explore our verified partners offering instant personal loans, digital credit lines, and fast approvals with minimal documentation."
    : "Discover the most reliable global virtual cards and local credit cards for seamless, secure, and instant deposits on top gaming platforms.";

  useEffect(() => {
    document.title = `${title} | BonusPromoCode.in`;
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);
  }, [title, description]);

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    window.history.pushState({}, '', href);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  // Geo-specific Fintech Offers
  const getCreditCards = (countryCode: string) => {
    const code = (countryCode || '').toUpperCase();
    if (code === 'IN') {
      return [
        { name: 'HDFC Millennia Credit Card', desc: '5% Cashback on digital spends. Great for online wallets.', icon: CreditCard, color: 'from-blue-900 to-blue-700', link: 'https://apply.hdfcbank.com/?ref=AFF_ID' },
        { name: 'SBI SimplyCLICK', desc: '10X Rewards on online partners. Instant virtual card generation.', icon: CreditCard, color: 'from-indigo-900 to-indigo-600', link: 'https://sbicard.com/?ref=AFF_ID' },
      ];
    }
    if (code === 'BR') {
      return [
        { name: 'Nubank Gold Mastercard', desc: 'Zero annual fee. Instant virtual card activation.', icon: CreditCard, color: 'from-purple-900 to-purple-600', link: 'https://nubank.com.br/?ref=AFF_ID' },
        { name: 'Banco Inter', desc: 'Free digital account with a global virtual credit card.', icon: Landmark, color: 'from-orange-700 to-orange-500', link: 'https://bancointer.com.br/?ref=AFF_ID' },
      ];
    }
    return [
      { name: 'American Express Global', desc: 'Premium rewards and universally accepted on premium iGaming sites.', icon: CreditCard, color: 'from-slate-800 to-slate-600', link: 'https://americanexpress.com/?ref=AFF_ID' },
      { name: 'Visa Platinum Digital', desc: 'Instant approval virtual cards for immediate online use.', icon: CreditCard, color: 'from-blue-800 to-blue-600', link: 'https://visa.com/?ref=AFF_ID' },
    ];
  };

  const virtualCards = [
    { name: 'AstroPay Card', desc: 'The #1 Virtual Card for iGaming. Deposit instantly worldwide.', icon: Globe, color: 'from-red-600 to-red-500', link: 'https://astropay.com/?ref=AFF_ID' },
    { name: 'Revolut Virtual', desc: 'Multi-currency virtual cards with top-tier security.', icon: Zap, color: 'from-slate-900 to-slate-700', link: 'https://revolut.com/?ref=AFF_ID' },
    { name: 'Wise (TransferWise)', desc: 'Low-fee digital card for international gaming deposits.', icon: Landmark, color: 'from-green-600 to-emerald-500', link: 'https://wise.com/?ref=AFF_ID' },
  ];

  const loanOffers = [
    { name: 'Instant Digital Credit', desc: 'Get approved for up to $5,000 instantly to fund your wallets.', icon: Banknote, provider: 'GlobalFin', time: '10 Mins', link: 'https://sales.gromo.in/c/gN1zWIvqOEWeGuKqedkZ8' },
    { name: 'Short-Term Cash Advance', desc: 'Fast, secure short-term funding directly to your bank account.', icon: Landmark, provider: 'QuickCash', time: '24 Hours', link: 'https://sales.gromo.in/c/gN1zWIvqOEWeGuKqedkZ8' },
  ];

  const creditCardPlatforms = platforms.filter(p => (p.category === 'Credit Cards' || p.category === 'Banking & Finance') && p.isActive !== false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-amber-400 selection:text-slate-950 flex flex-col">
      {/* Mini Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" onClick={(e) => handleNav(e, '/')} className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Landmark className="w-4 h-4 text-slate-950" />
            </div>
            <span className="font-black text-xl tracking-tight text-white group-hover:text-amber-400 transition-colors">BonusPromoCode <span className="text-amber-500 font-normal">Finance</span></span>
          </a>
          <a href="/" onClick={(e) => handleNav(e, '/')} className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-colors bg-slate-800/50 hover:bg-slate-800 px-4 py-2 rounded-full">
            <Home className="w-4 h-4" />
            Gaming Hub
          </a>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto px-4 py-12 w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-8">
          <a href="/" onClick={(e) => handleNav(e, '/')} className="hover:text-amber-400">Home</a>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-300">Financial Hub</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-amber-500">{isLoans ? 'Loans & Credit' : 'Virtual Cards'}</span>
        </div>

        {/* Hero Section */}
        <div className="mb-12 border-b border-slate-800/80 pb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-4 h-4" /> Verified Financial Partners
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4">{title}</h1>
          <p className="text-lg text-slate-400 leading-relaxed max-w-3xl">{description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-12">            
            {/* Global Virtual Cards Section */}
            {!isLoans && (
              <section id="virtual-cards">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Globe className="w-6 h-6 text-blue-400" />
                  Global Virtual Cards for Gaming
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {virtualCards.map((card, idx) => (
                    <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-blue-500/50 transition-all group flex flex-col">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white mb-4 shadow-lg`}>
                        <card.icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">{card.name}</h3>
                      
    <div className="flex-1 mb-6 flex flex-col gap-2">
      <p className="text-sm text-slate-400 font-medium">{card.desc}</p>
      {card.benefits && card.benefits.length > 0 && (
        <ul className="space-y-1.5 mt-2">
          {card.benefits.slice(0, 2).map((b: string, i: number) => (
            <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
              <span className="line-clamp-2">{b}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  
                      <a href={card.link} target="_blank" rel="noopener noreferrer" className="w-full py-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 font-bold text-sm flex items-center justify-center gap-2 transition-colors border border-blue-500/30">
                        Get Virtual Card <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Bank Accounts Section */}
            {!isLoans && (
              <section id="bank-accounts">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <PiggyBank className="w-6 h-6 text-pink-400" />
                  Top Bank & Savings Accounts
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {platforms.filter(p => p.category === 'Bank Accounts' && p.isActive !== false).map((bank, idx) => (
                    <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-pink-500/50 transition-all group flex flex-col">
                      <div className="w-full h-24 rounded-xl bg-slate-800 flex items-center justify-start px-6 mb-4 shadow-lg relative overflow-hidden">
                         <PiggyBank className="w-12 h-12 absolute -right-2 -bottom-2 opacity-10 text-white" />
                         {bank.logoUrl ? (
                           <LazyImage src={bank.logoUrl} alt={bank.name} className="w-16 h-16 object-contain" />
                         ) : (
                           <span className="font-black tracking-widest text-white/80">{bank.name}</span>
                         )}
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">{bank.name}</h3>
                      
    <div className="flex-1 mb-6 flex flex-col gap-2">
      <p className="text-sm text-slate-400 font-medium">{bank.bonusText || bank.badges?.join(' • ')}</p>
      {bank.benefits && bank.benefits.length > 0 && (
        <ul className="space-y-1.5 mt-2">
          {bank.benefits.slice(0, 2).map((b: string, i: number) => (
            <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
              <span className="line-clamp-2">{b}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  
                      <button onClick={() => setSelectedPlatform(bank)} className="w-full py-2.5 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 font-bold text-sm flex items-center justify-center gap-2 transition-colors border border-pink-500/30">
                        Open Account <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Demat Accounts Section */}
            {!isLoans && (
              <section id="demat-accounts">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-indigo-400" />
                  Demat & Trading Accounts
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {platforms.filter(p => p.category === 'Demat Accounts' && p.isActive !== false).map((demat, idx) => (
                    <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-indigo-500/50 transition-all group flex flex-col">
                      <div className="w-full h-24 rounded-xl bg-slate-800 flex items-center justify-start px-6 mb-4 shadow-lg relative overflow-hidden">
                         <TrendingUp className="w-12 h-12 absolute -right-2 -bottom-2 opacity-10 text-white" />
                         {demat.logoUrl ? (
                           <LazyImage src={demat.logoUrl} alt={demat.name} className="w-16 h-16 object-contain" />
                         ) : (
                           <span className="font-black tracking-widest text-white/80">{demat.name}</span>
                         )}
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">{demat.name}</h3>
                      
    <div className="flex-1 mb-6 flex flex-col gap-2">
      <p className="text-sm text-slate-400 font-medium">{demat.bonusText || demat.badges?.join(' • ')}</p>
      {demat.benefits && demat.benefits.length > 0 && (
        <ul className="space-y-1.5 mt-2">
          {demat.benefits.slice(0, 2).map((b: string, i: number) => (
            <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
              <span className="line-clamp-2">{b}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  
                      <button onClick={() => setSelectedPlatform(demat)} className="w-full py-2.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 font-bold text-sm flex items-center justify-center gap-2 transition-colors border border-indigo-500/30">
                        Start Trading <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Investments Section */}
            {!isLoans && (
              <section id="investments">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Briefcase className="w-6 h-6 text-orange-400" />
                  Wealth & Investments
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {platforms.filter(p => p.category === 'Investments' && p.isActive !== false).map((inv, idx) => (
                    <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-orange-500/50 transition-all group flex flex-col">
                      <div className="w-full h-24 rounded-xl bg-slate-800 flex items-center justify-start px-6 mb-4 shadow-lg relative overflow-hidden">
                         <Briefcase className="w-12 h-12 absolute -right-2 -bottom-2 opacity-10 text-white" />
                         {inv.logoUrl ? (
                           <LazyImage src={inv.logoUrl} alt={inv.name} className="w-16 h-16 object-contain" />
                         ) : (
                           <span className="font-black tracking-widest text-white/80">{inv.name}</span>
                         )}
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">{inv.name}</h3>
                      
    <div className="flex-1 mb-6 flex flex-col gap-2">
      <p className="text-sm text-slate-400 font-medium">{inv.bonusText || inv.badges?.join(' • ')}</p>
      {inv.benefits && inv.benefits.length > 0 && (
        <ul className="space-y-1.5 mt-2">
          {inv.benefits.slice(0, 2).map((b: string, i: number) => (
            <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
              <span className="line-clamp-2">{b}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  
                      <button onClick={() => setSelectedPlatform(inv)} className="w-full py-2.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 font-bold text-sm flex items-center justify-center gap-2 transition-colors border border-orange-500/30">
                        Invest Now <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Local Credit Cards Section */}
            {!isLoans && (
              <section id="credit-cards">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <CreditCard className="w-6 h-6 text-purple-400" />
                  Top Credit Cards in {geo.country || 'Your Region'}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {creditCardPlatforms.length > 0 ? creditCardPlatforms.map((card, idx) => (
                    <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-purple-500/50 transition-all group flex flex-col">
                      <div className="w-full h-24 rounded-xl bg-slate-800 flex items-center justify-start px-6 mb-4 shadow-lg relative overflow-hidden">
                         <CreditCard className="w-12 h-12 absolute -right-2 -bottom-2 opacity-10 text-white" />
                         {card.logoUrl ? (
                           <LazyImage src={card.logoUrl} alt={card.name} className="w-16 h-16 object-contain" />
                         ) : (
                           <span className="font-black tracking-widest text-white/80">{card.name}</span>
                         )}
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">{card.name}</h3>
                      <p className="text-sm text-slate-400 mb-6 flex-1">{card.bonusText || card.badges?.join(' • ')}</p>
                      <button onClick={() => setSelectedPlatform(card)} className="w-full py-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 font-bold text-sm flex items-center justify-center gap-2 transition-colors border border-purple-500/30">
                        Apply Now <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )) : (
                    <div className="col-span-1 sm:col-span-2 text-center py-8 text-slate-500">
                      No credit cards available for your region yet.
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Personal & Business Loans Section */}
            {isLoans && (
              <section id="loans">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Banknote className="w-6 h-6 text-emerald-400" />
                  Instant Personal & Business Loans
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {platforms.filter(p => p.category === 'Loans' && p.isActive !== false).map((loan, idx) => (
                    <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-emerald-500/50 transition-all group flex flex-col">
                      <div className="w-full h-24 rounded-xl bg-slate-800 flex items-center justify-start px-6 mb-4 shadow-lg relative overflow-hidden">
                         <Banknote className="w-12 h-12 absolute -right-2 -bottom-2 opacity-10 text-white" />
                         {loan.logoUrl ? (
                           <LazyImage src={loan.logoUrl} alt={loan.name} className="w-16 h-16 object-contain" />
                         ) : (
                           <span className="font-black tracking-widest text-white/80">{loan.name}</span>
                         )}
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">{loan.name}</h3>
                      
    <div className="flex-1 mb-6 flex flex-col gap-2">
      <p className="text-sm text-slate-400 font-medium">{loan.bonusText || loan.badges?.join(' • ')}</p>
      {loan.benefits && loan.benefits.length > 0 && (
        <ul className="space-y-1.5 mt-2">
          {loan.benefits.slice(0, 2).map((b: string, i: number) => (
            <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
              <span className="line-clamp-2">{b}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  
                      <button onClick={() => setSelectedPlatform(loan)} className="w-full py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold text-sm flex items-center justify-center gap-2 transition-colors border border-emerald-500/30">
                        Apply For Loan <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {platforms.filter(p => p.category === 'Loans' && p.isActive !== false).length === 0 && (
                    <div className="col-span-1 sm:col-span-2 text-center py-8 text-slate-500">
                      No loan offers available right now.
                    </div>
                  )}
                </div>
              </section>
            )}

          </div>

          {/* Sidebar / Loan Offers */}
          <aside className="lg:col-span-1 space-y-8">
            <div className="bg-gradient-to-br from-emerald-950 to-slate-900 border border-emerald-500/20 rounded-2xl p-6 relative">
              <div className="flex items-center gap-2 mb-6">
                <Banknote className="w-6 h-6 text-emerald-400" />
                <h3 className="text-xl font-black text-white">Instant Personal Loans</h3>
              </div>
              <p className="text-sm text-emerald-400/80 mb-6">
                Need extra funds? Apply for instant digital credit with our trusted fintech partners. High approval rates for active users.
              </p>
              
              <div className="space-y-4">
                {loanOffers.map((loan, idx) => (
                  <div key={idx} className="bg-slate-950/50 border border-emerald-500/10 rounded-xl p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-white font-bold text-sm">{loan.name}</h4>
                      <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
                        {loan.time}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mb-4">{loan.desc}</p>
                    <a href={loan.link} target="_blank" rel="noopener noreferrer" className="w-full py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-colors">
                      Check Eligibility <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-emerald-500/20 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <p className="text-[10px] text-slate-500 leading-tight">
                  All loans and credit facilities are subject to approval by the respective third-party financial institutions. Terms and conditions apply.
                </p>
              </div>
            </div>
            <Sidebar platforms={platforms} customPages={customPages} config={config} geo={geo} />
          </aside>
        </div>
      </main>

      
    
      {selectedPlatform && (
        <PlatformDetailsModal
          platform={selectedPlatform}
          onClose={() => setSelectedPlatform(null)}
        />
      )}
    </div>
  );
};
