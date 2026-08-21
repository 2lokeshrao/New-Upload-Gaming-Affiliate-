import React, { useState } from 'react';
import { GamingPlatform } from '../types';
import { Users, Sparkles, CheckCircle2, ArrowRight, X, ExternalLink, MessageCircle, DollarSign } from 'lucide-react';

interface SubPartnerModalProps {
  platforms: GamingPlatform[];
  onClose: () => void;
  onSubmitApplication: (appData: {
    fullName: string;
    email: string;
    whatsapp: string;
    platformId: string;
    platformName: string;
    trafficSource: string;
    estimatedMonthlyPlayers: string;
  }) => Promise<void>;
}

export const SubPartnerModal: React.FC<SubPartnerModalProps> = ({
  platforms,
  onClose,
  onSubmitApplication
}) => {
  const activePlatforms = platforms.filter(p => p.isActive);
  const [selectedPlatformId, setSelectedPlatformId] = useState(activePlatforms[0]?.id || '1win');

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [trafficSource, setTrafficSource] = useState('Telegram Channel / Group');
  const [estimatedPlayers, setEstimatedPlayers] = useState('50 - 200 Players / Month');

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const selectedPlatform = activePlatforms.find(p => p.id === selectedPlatformId) || activePlatforms[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await onSubmitApplication({
        fullName,
        email,
        whatsapp,
        platformId: selectedPlatform?.id || '1win',
        platformName: selectedPlatform?.name || '1Win Casino',
        trafficSource,
        estimatedMonthlyPlayers: estimatedPlayers
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Failed sub-partner application:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDirectMasterRedirect = () => {
    if (selectedPlatform?.masterPartnerUrl) {
      window.open(selectedPlatform.masterPartnerUrl, '_blank');
    } else {
      window.open(selectedPlatform?.rawAffiliateUrl || 'https://', '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-amber-950/50 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black uppercase tracking-wider mb-2">
            <Users className="w-4 h-4 text-amber-400" />
            <span>MAIN PARTNER NETWORK - SUB-AGENT SIGN-UP</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Become a Gaming Sub-Partner & Earn 45%-50% RevShare
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-lg mx-auto">
            Register directly under our master affiliate panel to get instant sub-agent referral links, daily payouts, and dedicated 24/7 manager support.
          </p>
        </div>

        {/* Value Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 text-xs">
          <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl flex items-center gap-2.5">
            <DollarSign className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <span className="font-extrabold text-white block">Up to 50% RevShare</span>
              <span className="text-slate-400 text-[10px]">Lifetime Player Earnings</span>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl flex items-center gap-2.5">
            <MessageCircle className="w-5 h-5 text-cyan-400 shrink-0" />
            <div>
              <span className="font-extrabold text-white block">Instant Approval</span>
              <span className="text-slate-400 text-[10px]">WhatsApp / Telegram Support</span>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <span className="font-extrabold text-white block">Custom Sub-Links</span>
              <span className="text-slate-400 text-[10px]">Track Real-time Payouts</span>
            </div>
          </div>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold text-slate-300 mb-1">
                1. Select Gaming Platform to Become Sub-Partner For
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {activePlatforms.map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPlatformId(p.id)}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2 cursor-pointer transition-all ${
                      selectedPlatformId === p.id
                        ? 'bg-amber-500/20 border-amber-500/80 text-amber-300 ring-1 ring-amber-500/50'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <img width="40" height="40" decoding="async" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAHBJREFUWEft0zEKACAQw8D7/6f90lJwEFzEQe5SU5qsqqpeZ373n/2YczxQYxMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwkro5m+0BP002ATXz2hAAAAAASUVORK5CYII="; }} loading="lazy" src={p.logoUrl || undefined} alt={p.name} className="w-6 h-6 rounded-md object-cover" />
                    <span className="font-extrabold text-xs truncate">{p.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-extrabold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-medium focus:border-amber-500 outline-none placeholder:text-slate-600"
                />
              </div>

              <div>
                <label className="block font-extrabold text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-medium focus:border-amber-500 outline-none placeholder:text-slate-600"
                />
              </div>

              <div>
                <label className="block font-extrabold text-slate-300 mb-1">WhatsApp / Telegram Number</label>
                <input
                  type="text"
                  required
                  value={whatsapp}
                  onChange={e => setWhatsapp(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-medium focus:border-amber-500 outline-none placeholder:text-slate-600"
                />
              </div>

              <div>
                <label className="block font-extrabold text-slate-300 mb-1">Your Traffic Source</label>
                <select
                  value={trafficSource}
                  onChange={e => setTrafficSource(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-medium focus:border-amber-500 outline-none"
                >
                  <option value="Telegram Channel / Group">Telegram Channel / Group</option>
                  <option value="YouTube Channel">YouTube Channel</option>
                  <option value="Instagram / Facebook Page">Instagram / Facebook Page</option>
                  <option value="Website / Blog Traffic">Website / Blog Traffic</option>
                  <option value="Direct Personal Network">Direct Personal Network</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/20 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>SUBMIT SUB-PARTNER APPLICATION</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleDirectMasterRedirect}
                className="w-full sm:w-auto px-4 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-bold text-xs cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Direct Master Partner Panel Sign-Up</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-emerald-500/20 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-xl font-black text-white">Sub-Partner Application Received!</h3>
            <p className="text-slate-300 text-xs sm:text-sm max-w-md mx-auto">
              Our master affiliate manager will contact you on WhatsApp/Telegram shortly. You can also proceed directly to register on the official master panel below:
            </p>

            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={handleDirectMasterRedirect}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>OPEN OFFICIAL MASTER PARTNER REGISTER PAGE</span>
                <ExternalLink className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="px-4 py-3.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                Close Window
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
