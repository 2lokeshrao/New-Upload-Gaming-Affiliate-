import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldCheck, Users, Gamepad2 } from 'lucide-react';
import { GlobalConfig, FaqItem } from '../types';
import { SocialMediaBar } from './SocialMediaBar';



const PLAYER_FAQS: FaqItem[] = [
  { id: "p1", category: "players", q: "Kya mera purana account hote hue bhi mujhe 500% Welcome Bonus milega?", a: "Nahi! Gaming platforms (jaise 1Win, Mostbet) ke rules ke mutabiq 500% Welcome Deposit Bonus aur 200 Free Spins sirf NAYE REGISTRATION (First-time Users) ke liye hote hain. Agar aapka pehle se account hai, toh aap hamare 'Email Eligibility Checker' se check karein aur naye email id ya fresh mobile number se register karein.", badge: "Important Rule" },
  { id: "p2", category: "players", q: "Welcome bonus code 'MAXBOOST500' ko activate kaise karein?", a: "Registration page par 'Add Promo Code' par click karein aur promo code 'MAXBOOST500' enter karein. Apne first deposit (Minimum ₹300 / $5) par 500% bonus aapke wallet me instantly add ho jayega.", badge: "Promo Guide" },
  { id: "p3", category: "players", q: "Withdrawal (Paisa Nikalna) kitna fast hota he aur kaunse payment options hain?", a: "Sabhi listed platforms 100% instant withdrawals support karte hain via UPI (GPay, PhonePe, Paytm), IMPS, Crypto (USDT, BTC), aur Bank Transfer. Maximum cashout time 5 se 15 minute rehta hai.", badge: "Fast Cashout" },
  { id: "p4", category: "players", q: "Kya in gaming apps par KYC verify karna zaroori hai?", a: "Nahi! Minimum deposit aur standard withdrawals ke liye koi KYC biometric identity proof submit karne ki zarurat nahi hoti. Aap turant registration ke baad games play kar sakte hain.", badge: "No KYC" },
  { id: "p5", category: "players", q: "Lucky Wheel Spin se jeeta hua bonus kaise claim karein?", a: "Jaise hi aap Lucky Wheel spin karte hain aur prize unlock hota hai, 'REGISTER & CLAIM NOW' button par click karein. Yeh aapko official promo claim page par redirect kar dega jahan promo code auto-applied milega.", badge: "Lucky Wheel" }
];

const B2B_PARTNER_FAQS: FaqItem[] = [
  { id: "b1", category: "partners", q: "Hamari Gaming Application ko is portal par list karne ka kya process he?", a: "Agar aap ek Gaming Application, Casino operator, ya Gambling brand hain aur hamare portal par top recommendation badge pana chahte hain, toh aap hamare Sub-Partner & Listing form ke zariye submit kar sakte hain ya Admin Support se WhatsApp/Telegram par rabta kar sakte hain.", badge: "Platform Listing" },
  { id: "b2", category: "partners", q: "Sub-Partner Program kya hai aur kitna RevShare commission milta hai?", a: "Hamare Master Affiliate Panel ke zariye sub-partners ko 45% se 50% tak LIFETIME Revenue Share milta hai. Jo bhi players aapke referral link ya promo code se register karke deposit karte hain, unka net revenue aapko daily payout me milta hai.", badge: "50% RevShare" },
  { id: "b3", category: "partners", q: "Payouts kaise aur kab transfer kiye jaate hain?", a: "Sub-partner commissions daily/weekly settle kiye jaate hain via USDT (TRC20/BEP20), Crypto, Bank Transfer, ya Direct Telegram Wallet. Koi hidden deduction ya negative carryover nahi hota.", badge: "Daily Payouts" },
  { id: "b4", category: "partners", q: "Kya naye Partners ko dedicated affiliate manager milta hai?", a: "Haan! Har approved sub-partner aur gaming app team ko ek 24/7 Dedicated Account Manager allocate hota hai jo custom promo codes, banner graphics, aur tracking analytics me help karta hai.", badge: "24/7 Support" },
  { id: "b5", category: "partners", q: "API / Postback URL integration kaise setup hota hai?", a: "Aap hamare master admin panel se S2S Postback URLs, Server-to-Server webhooks, aur real-time player conversion tracking APIs easily connect kar sakte hain.", badge: "S2S Postback" }
];

interface FaqSectionProps {
  config?: GlobalConfig;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ config }) => {
  const [activeTab, setActiveTab] = useState<'players' | 'partners'>('players');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = activeTab === 'players' ? PLAYER_FAQS : B2B_PARTNER_FAQS;

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section className="py-12 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase mb-2">
          <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
          <span>HELP & FREQUENTLY ASKED QUESTIONS</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Frequently Asked Questions (FAQ)
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-lg mx-auto">
          Common queries answered for players claiming bonuses as well as gaming application partners joining our network.
        </p>

        {/* Tab Toggle */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => { setActiveTab('players'); setOpenIndex(0); }}
            className={`px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'players'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/30 ring-1 ring-purple-400'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Gamepad2 className="w-4 h-4 text-amber-300" />
            <span>Players / Users FAQ</span>
          </button>

          <button
            onClick={() => { setActiveTab('partners'); setOpenIndex(0); }}
            className={`px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'partners'
                ? 'bg-gradient-to-r from-cyan-600 to-emerald-600 text-white shadow-lg shadow-cyan-600/30 ring-1 ring-cyan-400'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4 text-cyan-300" />
            <span>Gaming Apps & Partners FAQ</span>
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden transition-all hover:border-slate-700"
            >
              <button
                onClick={() => toggle(i)}
                className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-extrabold text-white text-sm sm:text-base cursor-pointer hover:bg-slate-800/40"
              >
                <div className="flex items-center gap-2.5">
                  {faq.badge && (
                    <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-black uppercase px-2 py-0.5 rounded-md shrink-0">
                      {faq.badge}
                    </span>
                  )}
                  <span>{faq.q}</span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-amber-400 transition-transform duration-200 shrink-0 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-4 pb-5 sm:px-5 text-slate-300 text-xs sm:text-sm leading-relaxed border-t border-slate-800/60 pt-3.5 bg-slate-950/40">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3 text-xs text-slate-400">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
        <span>
          Disclaimer: All listed platforms are verified for licensing and prompt payments. Please gamble responsibly.
        </span>
      </div>

      {config && (
        <div className="mt-5 flex justify-center">
          <SocialMediaBar config={config} variant="pills" />
        </div>
      )}
    </section>
  );
};
