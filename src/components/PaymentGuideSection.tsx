import React from 'react';
import { UserGeo } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { Wallet, ShieldCheck, ArrowRight, Zap, CreditCard, Banknote } from 'lucide-react';

interface PaymentGuideSectionProps {
  geo: UserGeo;
}

export const PaymentGuideSection: React.FC<PaymentGuideSectionProps> = ({ geo }) => {
  const { t } = useLanguage();

  const getGeoConfig = (countryCode: string) => {
    switch (countryCode.toUpperCase()) {
      case 'IN':
        return {
          title: t('guide.title.IN') || "Popular Payment Methods in India",
          methods: [
            { name: "UPI", icon: Zap, speed: "Instant", limit: "₹500 - ₹50,000" },
            { name: "Paytm", icon: Wallet, speed: "Instant", limit: "₹500 - ₹50,000" },
            { name: "PhonePe", icon: Banknote, speed: "Instant", limit: "₹500 - ₹50,000" },
          ],
          guideTitle: "How to deposit using UPI & withdraw winnings safely",
          guideSteps: [
            "Select 'UPI' in the deposit section of your chosen platform.",
            "Enter your desired amount (minimum ₹500).",
            "You will be redirected to your UPI app (GPay, PhonePe, Paytm).",
            "Approve the transaction. Funds appear instantly!",
            "For withdrawals, ensure your bank account matches your registered name for seamless processing within 15 minutes."
          ]
        };
      case 'BR':
        return {
          title: t('guide.title.BR') || "Popular Payment Methods in Brazil",
          methods: [
            { name: "Pix", icon: Zap, speed: "Instant", limit: "R$50 - R$10,000" },
            { name: "Boleto", icon: Banknote, speed: "1-2 Days", limit: "R$50 - R$5,000" },
            { name: "PicPay", icon: Wallet, speed: "Instant", limit: "R$50 - R$5,000" },
          ],
          guideTitle: "How to deposit using Pix & withdraw winnings safely",
          guideSteps: [
            "Select 'Pix' as your deposit method on the cashier page.",
            "Enter your CPF and the deposit amount.",
            "Scan the generated QR code or copy the Pix code.",
            "Paste the code into your banking app and confirm payment. Funds are credited instantly.",
            "Withdrawals via Pix are processed 24/7, usually within 10-15 minutes directly to your bank account."
          ]
        };
      case 'CA':
        return {
          title: t('guide.title.CA') || "Popular Payment Methods in Canada",
          methods: [
            { name: "Interac e-Transfer", icon: Zap, speed: "Instant", limit: "$10 - $3,000" },
            { name: "MuchBetter", icon: Wallet, speed: "Instant", limit: "$10 - $5,000" },
            { name: "Credit/Debit Card", icon: CreditCard, speed: "Instant", limit: "$20 - $5,000" },
          ],
          guideTitle: "How to deposit using Interac & withdraw winnings safely",
          guideSteps: [
            "Choose 'Interac e-Transfer' from the deposit menu.",
            "Enter the deposit amount and proceed.",
            "Log in to your Canadian online banking portal.",
            "Send the transfer using the provided email and security question/answer.",
            "Winnings can be withdrawn back to your bank account via Interac e-Transfer within 24-48 hours."
          ]
        };
      default:
        return {
          title: t('guide.title.Global') || "Global Secure Payment Methods",
          methods: [
            { name: "Crypto (USDT/BTC)", icon: Zap, speed: "Instant", limit: "$10 - Unlimited" },
            { name: "Credit Card (Visa/MC)", icon: CreditCard, speed: "Instant", limit: "$20 - $5,000" },
            { name: "E-Wallets (Skrill/Neteller)", icon: Wallet, speed: "Instant", limit: "$10 - $10,000" },
          ],
          guideTitle: "How to deposit & withdraw winnings safely",
          guideSteps: [
            "Select your preferred secure payment method from the cashier.",
            "Enter the deposit amount. For crypto, copy the unique wallet address provided.",
            "Complete the transaction using your wallet or banking app.",
            "Deposits are processed instantly and secured with AES-256 encryption.",
            "Verify your account identity early to ensure lightning-fast withdrawal processing."
          ]
        };
    }
  };

  const config = getGeoConfig(geo.countryCode);

  return (
    <section className="py-12 bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-4 h-4" />
            100% Secure Transactions
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            {config.title}
          </h2>
          <p className="text-slate-400 mt-2 text-sm max-w-2xl mx-auto">
            All our recommended platforms support localized and encrypted payment gateways for rapid deposits and seamless withdrawals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Payment Methods Cards */}
          <div className="space-y-4">
            {config.methods.map((method, idx) => {
              const Icon = method.icon;
              return (
                <div key={idx} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex items-center justify-between hover:border-emerald-500/40 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-lg">{method.name}</h4>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                        <span className="flex items-center gap-1">
                          <Zap className="w-3 h-3 text-amber-400" /> {method.speed}
                        </span>
                        <span>•</span>
                        <span>Limits: {method.limit}</span>
                      </div>
                    </div>
                  </div>
                  <div className="hidden sm:block text-slate-600">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Guide Section */}
          <div className="bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl" />
            <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
              <Wallet className="w-6 h-6 text-emerald-400" />
              {config.guideTitle}
            </h3>
            
            <ol className="space-y-4 relative z-10">
              {config.guideSteps.map((step, idx) => (
                <li key={idx} className="flex gap-4">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-slate-300 text-sm leading-relaxed">{step}</p>
                </li>
              ))}
            </ol>
            
            <div className="mt-6 pt-6 border-t border-slate-800 flex items-center gap-3">
              <ShieldCheck className="w-10 h-10 text-slate-600" />
              <p className="text-xs text-slate-500">
                All transactions are protected by bank-level SSL encryption. Your financial data is never stored on the platform servers.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
