import React from 'react';
import { UserGeo } from '../types';
import { Wallet, Bitcoin, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export const WalletReferrals: React.FC<{ geo: UserGeo }> = ({ geo }) => {
  const getWallets = (countryCode: string) => {
    const cryptoWallets = [
      { name: 'Binance', desc: 'Buy USDT & Crypto (0% Fees)', icon: Bitcoin, link: 'https://binance.com/en/register?ref=YOUR_BINANCE_ID', color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
      { name: 'Bybit', desc: 'Fastest Crypto Withdrawals', icon: Zap, link: 'https://bybit.com/register?ref=YOUR_BYBIT_ID', color: 'text-amber-400', bg: 'bg-amber-400/10' },
    ];

    let localWallets = [];
    switch ((countryCode || '').toUpperCase()) {
      case 'BR':
        localWallets = [
          { name: 'Pay4Fun', desc: 'Best for Pix & Boletos', icon: Wallet, link: 'https://p4f.com/?ref=YOUR_P4F_ID', color: 'text-green-500', bg: 'bg-green-500/10' },
          { name: 'AstroPay', desc: 'Instant LATAM Deposits', icon: Wallet, link: 'https://astropay.com/?ref=YOUR_ASTROPAY_ID', color: 'text-red-500', bg: 'bg-red-500/10' },
        ];
        break;
      case 'IN':
        localWallets = [
          { name: 'AstroPay', desc: 'UPI & Local Bank Transfers', icon: Wallet, link: 'https://astropay.com/?ref=YOUR_ASTROPAY_ID', color: 'text-red-500', bg: 'bg-red-500/10' },
          { name: 'Skrill', desc: 'Fast Gaming E-Wallet', icon: Wallet, link: 'https://skrill.com/?ref=YOUR_SKRILL_ID', color: 'text-purple-500', bg: 'bg-purple-500/10' },
        ];
        break;
      default:
        localWallets = [
          { name: 'Skrill', desc: 'Global E-Wallet for Gaming', icon: Wallet, link: 'https://skrill.com/?ref=YOUR_SKRILL_ID', color: 'text-purple-500', bg: 'bg-purple-500/10' },
          { name: 'AstroPay', desc: 'Secure Prepaid Cards', icon: Wallet, link: 'https://astropay.com/?ref=YOUR_ASTROPAY_ID', color: 'text-red-500', bg: 'bg-red-500/10' },
        ];
        break;
    }

    return [...localWallets, ...cryptoWallets];
  };

  const wallets = getWallets(geo.countryCode);

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    window.history.pushState({}, '', href);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <div className="mt-8 pt-8 border-t border-slate-800/80">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h4 className="text-white font-bold text-sm sm:text-base">Recommended Payment & Crypto Wallets</h4>
        </div>
      </div>
      <p className="text-slate-400 text-xs mb-5">
        <strong>Card declined? Don't have a local bank account?</strong> Learn how to deposit instantly using our comprehensive wallet and crypto guides. Open an account with our trusted local and global payment partners.
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {wallets.map((w, idx) => {
          const Icon = w.icon;
          const isCrypto = w.name === 'Binance' || w.name === 'Bybit';
          const seoUrl = isCrypto ? `/crypto/${w.name.toLowerCase()}-usdt-withdrawal-guide` : `/wallets/${w.name.toLowerCase()}-deposit-guide`;

          return (
            <div key={idx} className="flex flex-col gap-2 p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 transition-all group">
              <a 
                href={w.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${w.bg} ${w.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm">{w.name}</div>
                    <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wide">{w.desc}</div>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 transition-colors">
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400" />
                </div>
              </a>
              <div className="border-t border-slate-800/50 pt-2 mt-1">
                <a 
                  href={seoUrl} 
                  onClick={(e) => handleNav(e, seoUrl)}
                  className="text-[11px] text-amber-500 hover:text-amber-400 font-medium hover:underline flex items-center gap-1"
                >
                  Read full {w.name} guide &rarr;
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
