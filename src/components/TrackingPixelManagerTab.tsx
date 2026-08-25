import React, { useState } from 'react';
import { GlobalConfig, GamingPlatform, TrackingPixelConfig } from '../types';
import { Target, Save, CheckCircle2, Sparkles, Activity } from 'lucide-react';

interface TrackingPixelManagerTabProps {
  config: GlobalConfig;
  platforms: GamingPlatform[];
  onSaveConfig: (updatedConfig: GlobalConfig) => void;
  onSavePlatforms: (updatedPlatforms: GamingPlatform[]) => void;
}

export const TrackingPixelManagerTab: React.FC<TrackingPixelManagerTabProps> = ({
  config,
  platforms,
  onSaveConfig,
  onSavePlatforms
}) => {
  const [globalPixels, setGlobalPixels] = useState<TrackingPixelConfig>(
    config.globalTrackingPixels || {
      platformId: 'global',
      facebookPixelId: '',
      googleAnalyticsId: '',
      tiktokPixelId: '',
      customHeaderScript: ''
    }
  );

  const [localPlatforms, setLocalPlatforms] = useState<GamingPlatform[]>(platforms);
  const [selectedPlatformId, setSelectedPlatformId] = useState<string>('global');
  const [showToast, setShowToast] = useState(false);

  // Selected platform's current pixels
  const activePlatform = localPlatforms.find(p => p.id === selectedPlatformId);

  const handleSaveGlobalPixels = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig({
      ...config,
      globalTrackingPixels: globalPixels
    });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSavePlatformPixel = (platformId: string, pixelData: TrackingPixelConfig) => {
    const updated = localPlatforms.map(p => {
      if (p.id === platformId) {
        return {
          ...p,
          trackingPixels: pixelData
        };
      }
      return p;
    });

    setLocalPlatforms(updated);
    onSavePlatforms(updated);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {showToast && (
        <div className="fixed top-20 right-6 z-[200] bg-emerald-500 text-slate-950 font-black px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-emerald-300 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>Tracking Pixel Configurations updated and active live!</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-950/80 via-slate-900 to-slate-950 border border-purple-500/30 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-purple-400 font-extrabold text-xs uppercase tracking-wider">
            <Target className="w-4 h-4 text-amber-400" />
            <span>Conversion Analytics & Pixel Injection</span>
          </div>
          <h2 className="text-xl font-black text-white">Tracking Pixels & Custom Code Manager</h2>
          <p className="text-xs text-slate-300">
            Inject Facebook Pixel (Meta), Google Analytics (GA4), or ANY custom HTML/Scripts globally in the &lt;head&gt; and &lt;body&gt; of your website.
          </p>
        </div>
      </div>

      {/* Global Tracking Pixels Form */}
      <form onSubmit={handleSaveGlobalPixels} className="bg-slate-900 border border-purple-500/40 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-black text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Global Default Tracking Pixels (All Brands)</span>
          </h3>
          <span className="text-[10px] font-bold bg-purple-950 border border-purple-500/40 text-purple-300 px-2.5 py-1 rounded-full">
            Active for Site Visits & All Click Events
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Facebook Meta Pixel ID</label>
            <input
              type="text"
              value={globalPixels.facebookPixelId || ''}
              onChange={e => setGlobalPixels({ ...globalPixels, facebookPixelId: e.target.value })}
              placeholder="e.g. 123456789012345"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white text-xs font-mono focus:border-purple-500 outline-none"
            />
            <span className="text-[10px] text-slate-400 block mt-1">Triggers fbq('track', 'Lead') on registration click</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Google Analytics GA4 ID</label>
            <input
              type="text"
              value={globalPixels.googleAnalyticsId || ''}
              onChange={e => setGlobalPixels({ ...globalPixels, googleAnalyticsId: e.target.value })}
              placeholder="e.g. G-X1Y2Z3A4B5"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white text-xs font-mono focus:border-purple-500 outline-none"
            />
            <span className="text-[10px] text-slate-400 block mt-1">Triggers gtag('event', 'conversion') on claim</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">TikTok Pixel ID</label>
            <input
              type="text"
              value={globalPixels.tiktokPixelId || ''}
              onChange={e => setGlobalPixels({ ...globalPixels, tiktokPixelId: e.target.value })}
              placeholder="e.g. C1234567890"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white text-xs font-mono focus:border-purple-500 outline-none"
            />
            <span className="text-[10px] text-slate-400 block mt-1">Triggers ttq.track('CompleteRegistration')</span>
          </div>

          <div className="sm:col-span-3">
            <label className="block text-xs font-bold text-slate-300 mb-1">Custom Header HTML/Meta Tags (&lt;head&gt;)</label>
            <textarea
              rows={2}
              value={globalPixels.customHeaderScript || ''}
              onChange={e => setGlobalPixels({ ...globalPixels, customHeaderScript: e.target.value })}
              placeholder="<meta name='google-site-verification' content='...' />\n<script>console.log('Custom Header loaded');</script>"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-emerald-300 font-mono text-xs focus:border-purple-500 outline-none"
            />
          </div>

          <div className="sm:col-span-3 mt-2">
            <label className="block text-xs font-bold text-slate-300 mb-1">Custom Body HTML/Scripts (&lt;body&gt;)</label>
            <textarea
              rows={2}
              value={globalPixels.customBodyScript || ''}
              onChange={e => setGlobalPixels({ ...globalPixels, customBodyScript: e.target.value })}
              placeholder="<!-- Added just before closing </body> -->\n<script>console.log('Custom Body Script loaded');</script>"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-amber-300 font-mono text-xs focus:border-purple-500 outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Global Pixels</span>
          </button>
        </div>
      </form>

      {/* Individual Platform Pixel Configuration */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span>Individual Platform Pixel Overrides</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {localPlatforms.map(platform => {
            const currentPixels = platform.trackingPixels || {
              platformId: platform.id,
              facebookPixelId: '',
              googleAnalyticsId: '',
              tiktokPixelId: ''
            };

            return (
              <div key={platform.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2.5">
                  <img width="40" height="40" decoding="async" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAHBJREFUWEft0zEKACAQw8D7/6f90lJwEFzEQe5SU5qsqqpeZ373n/2YczxQYxMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwkro5m+0BP002ATXz2hAAAAAASUVORK5CYII="; }} loading="lazy" src={platform.logoUrl || undefined} alt={platform.name} className="w-7 h-7 rounded-lg object-cover" />
                  <span className="font-extrabold text-white text-sm">{platform.name}</span>
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    value={currentPixels.facebookPixelId || ''}
                    onChange={e => {
                      const updatedPx = { ...currentPixels, facebookPixelId: e.target.value };
                      handleSavePlatformPixel(platform.id, updatedPx);
                    }}
                    placeholder="FB Pixel ID for this platform"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-xs font-mono"
                  />

                  <input
                    type="text"
                    value={currentPixels.googleAnalyticsId || ''}
                    onChange={e => {
                      const updatedPx = { ...currentPixels, googleAnalyticsId: e.target.value };
                      handleSavePlatformPixel(platform.id, updatedPx);
                    }}
                    placeholder="GA4 Measurement ID for this platform"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-xs font-mono"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
