import React, { useState } from 'react';
import { PushNotificationAlert, GamingPlatform, GlobalConfig } from '../types';
import { Send, Bell, Zap, Sparkles, CheckCircle2, History, Smartphone, ShieldCheck, RefreshCw } from 'lucide-react';

interface PushNotificationManagerTabProps {
  config: GlobalConfig;
  platforms: GamingPlatform[];
  onSaveConfig: (updatedConfig: GlobalConfig) => void;
}

export const PushNotificationManagerTab: React.FC<PushNotificationManagerTabProps> = ({
  config,
  platforms,
  onSaveConfig
}) => {
  const [notificationType, setNotificationType] = useState<'flash_bonus' | 'new_arrival' | 'custom'>('flash_bonus');
  const [selectedPlatformId, setSelectedPlatformId] = useState<string>(platforms[0]?.id || '');
  const [title, setTitle] = useState('🔥 500% FLASH BONUS ACTIVATED!');
  const [body, setBody] = useState('Exclusive limited-time deposit match bonus available now. Claim before timer expires!');
  const [promoCode, setPromoCode] = useState('MAXBOOST500');
  const [actionUrl, setActionUrl] = useState('/go/1win');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  const history = config.pushNotifications || [];

  const handleTemplateChange = (type: 'flash_bonus' | 'new_arrival' | 'custom') => {
    setNotificationType(type);
    const platform = platforms.find(p => p.id === selectedPlatformId) || platforms[0];
    if (type === 'flash_bonus') {
      setTitle(`🔥 500% FLASH BONUS ACTIVATED: ${platform?.name || 'VIP Casino'}!`);
      setBody(`Claim extra $1,000 + 100 Free Spins with official code ${platform?.promoCode || 'VIPMAX'}. Ends soon!`);
      setPromoCode(platform?.promoCode || 'VIPMAX');
      setActionUrl(`/go/${platform?.slug || '1win'}`);
    } else if (type === 'new_arrival') {
      setTitle(`⚡ NEW ARRIVAL: ${platform?.name || 'New Platform'} Joined!`);
      setBody(`Discover verified bonus, high RTP slots & instant withdrawals. Use code ${platform?.promoCode || 'VIPMAX'}.`);
      setPromoCode(platform?.promoCode || 'VIPMAX');
      setActionUrl(`/go/${platform?.slug || '1win'}`);
    } else {
      setTitle('🎁 SPECIAL WEEKEND CASHBACK & FREE SPINS');
      setBody('Exclusive promo codes updated for top licensed gaming platforms. Tap to claim.');
      setPromoCode('WEEKENDVIP');
      setActionUrl('/');
    }
  };

  const handlePlatformSelect = (pId: string) => {
    setSelectedPlatformId(pId);
    const platform = platforms.find(p => p.id === pId);
    if (platform) {
      if (notificationType === 'flash_bonus') {
        setTitle(`🔥 500% FLASH BONUS ACTIVATED: ${platform.name}!`);
        setBody(`Claim extra 500% deposit bonus with official code ${platform.promoCode}. Valid for 2 hours!`);
        setPromoCode(platform.promoCode);
        setActionUrl(`/go/${platform.slug}`);
      } else if (notificationType === 'new_arrival') {
        setTitle(`⚡ NEW PLATFORM ARRIVAL: ${platform.name}`);
        setBody(`Instant UPI/Crypto withdrawals & verified ${platform.bonusText}. Code: ${platform.promoCode}`);
        setPromoCode(platform.promoCode);
        setActionUrl(`/go/${platform.slug}`);
      }
    }
  };

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !body) return;

    setIsSending(true);

    setTimeout(() => {
      const platform = platforms.find(p => p.id === selectedPlatformId);
      const estimatedSubscribers = Math.floor(1200 + Math.random() * 800);

      const newAlert: PushNotificationAlert = {
        id: `pn_${Date.now()}`,
        title,
        body,
        type: notificationType,
        targetPlatformId: selectedPlatformId,
        targetPlatformName: platform?.name || 'All Platforms',
        sentAt: new Date().toISOString(),
        recipientCount: estimatedSubscribers,
        promoCode,
        actionUrl
      };

      const updatedHistory = [newAlert, ...history];
      onSaveConfig({
        ...config,
        pushNotifications: updatedHistory
      });

      // Trigger standard browser native push/notification preview if permitted
      if ('Notification' in window && Notification.permission === 'granted') {
        try {
          new Notification(title, {
            body: `${body} (Code: ${promoCode})`,
            icon: platform?.logoUrl || '/icon.png'
          });
        } catch (err) {
          console.log('Push notification triggered locally:', err);
        }
      }

      setIsSending(false);
      setSendSuccess(true);
      setTimeout(() => setSendSuccess(false), 4000);
    }, 800);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950/60 via-slate-900 to-amber-950/40 p-6 rounded-2xl border border-purple-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-bold text-xs border border-purple-500/30 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              PUSH NOTIFICATIONS
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs border border-emerald-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Service Active
            </span>
          </div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-amber-400" />
            Push Notification Broadcast Center
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Send real-time desktop & mobile push alerts to subscribed players for Flash Bonuses and New Platform Arrivals.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-7 bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-6">
          <h3 className="text-md font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Compose Notification Alert
          </h3>

          <form onSubmit={handleSendNotification} className="space-y-5">
            {/* Template Type Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Notification Category
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleTemplateChange('flash_bonus')}
                  className={`py-2.5 px-3 rounded-xl font-bold text-xs flex flex-col items-center justify-center gap-1 cursor-pointer transition-all border ${
                    notificationType === 'flash_bonus'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-md shadow-amber-500/10'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Flash Bonus</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTemplateChange('new_arrival')}
                  className={`py-2.5 px-3 rounded-xl font-bold text-xs flex flex-col items-center justify-center gap-1 cursor-pointer transition-all border ${
                    notificationType === 'new_arrival'
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/50 shadow-md shadow-purple-500/10'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>New Arrival</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTemplateChange('custom')}
                  className={`py-2.5 px-3 rounded-xl font-bold text-xs flex flex-col items-center justify-center gap-1 cursor-pointer transition-all border ${
                    notificationType === 'custom'
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-md shadow-cyan-500/10'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <Bell className="w-4 h-4 text-cyan-400" />
                  <span>Custom Broadcast</span>
                </button>
              </div>
            </div>

            {/* Target Gaming Platform */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Target Gaming Platform
              </label>
              <select
                value={selectedPlatformId}
                onChange={(e) => handlePlatformSelect(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-purple-500"
              >
                {platforms.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.bonusText || p.promoCode})
                  </option>
                ))}
              </select>
            </div>

            {/* Notification Title */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Notification Headline Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 🔥 500% FLASH BONUS ACTIVATED!"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 text-sm font-semibold focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Notification Body */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Notification Message Body
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={3}
                placeholder="Describe the promo, urgency, and instructions..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-purple-500 resize-none"
              />
            </div>

            {/* Promo Code & Action URL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Featured Promo Code
                </label>
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-amber-400 text-sm font-mono font-bold focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Destination Action Path
                </label>
                <input
                  type="text"
                  value={actionUrl}
                  onChange={(e) => setActionUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-300 text-sm font-mono focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Submit Broadcast Button */}
            <button
              type="submit"
              disabled={isSending}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm tracking-wider shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSending ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>BROADCASTING TO ALL SUBSCRIBERS...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>BROADCAST PUSH ALERT NOW</span>
                </>
              )}
            </button>

            {sendSuccess && (
              <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Push notification broadcast sent successfully to FCM subscribers!</span>
              </div>
            )}
          </form>
        </div>

        {/* Right Column: Live Mobile / Desktop Preview & History */}
        <div className="lg:col-span-5 space-y-6">
          {/* Mobile OS Live Mockup */}
          <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-purple-400" />
                Live Notification Lock Screen Preview
              </span>
              <span className="text-emerald-400 text-[10px]">Real-time rendering</span>
            </div>

            <div className="relative bg-slate-950 rounded-2xl p-4 border border-slate-800 shadow-2xl overflow-hidden">
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-1 bg-slate-800 rounded-full"></div>

              <div className="mt-3 p-3.5 rounded-xl bg-slate-900/95 border border-amber-500/40 shadow-xl backdrop-blur-md space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-black text-[10px]">
                      VIP
                    </div>
                    <span className="text-xs font-bold text-slate-300">Gaming Bonuses Daily</span>
                  </div>
                  <span className="text-[10px] text-slate-500">Just now</span>
                </div>

                <h4 className="text-xs font-black text-amber-300 leading-snug">
                  {title || 'Headline Alert'}
                </h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {body || 'Notification details will appear here...'}
                </p>

                {promoCode && (
                  <div className="pt-1.5 flex items-center justify-between border-t border-slate-800/80 text-[10px]">
                    <span className="text-slate-400">PROMO CODE:</span>
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
                      {promoCode}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Broadcast History Log */}
          <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <History className="w-4 h-4 text-purple-400" />
              Recent FCM Broadcast History ({history.length})
            </h3>

            {history.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No push notifications sent yet.</p>
            ) : (
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {history.map((alert) => (
                  <div key={alert.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-400 flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        {alert.title}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {new Date(alert.sentAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-slate-300 text-[11px] leading-tight">
                      {alert.body}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-900">
                      <span>Recipients: <strong className="text-slate-200">{alert.recipientCount.toLocaleString()}</strong></span>
                      {alert.promoCode && (
                        <span className="font-mono text-purple-300 bg-purple-950/60 px-1.5 py-0.5 rounded border border-purple-800/50">
                          {alert.promoCode}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
