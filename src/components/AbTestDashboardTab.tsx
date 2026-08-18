import React, { useState } from 'react';
import { GlobalConfig, AbTestConfig } from '../types';
import { Sliders, ToggleLeft, ToggleRight, Sparkles, TrendingUp, Eye, MousePointerClick, RefreshCw, BarChart3, CheckCircle2, Award } from 'lucide-react';

interface AbTestDashboardTabProps {
  config: GlobalConfig;
  onSaveConfig: (updatedConfig: GlobalConfig) => void;
}

export const AbTestDashboardTab: React.FC<AbTestDashboardTabProps> = ({
  config,
  onSaveConfig
}) => {
  const currentAbConfig: AbTestConfig = config.abTestConfig || {
    enabled: true,
    heroDesign: 'variant_a',
    buttonColor: 'amber',
    stats: {
      variantAViews: 3420,
      variantBViews: 3180,
      variantAClicks: 890,
      variantBClicks: 1140
    }
  };

  const [enabled, setEnabled] = useState(currentAbConfig.enabled);
  const [heroDesign, setHeroDesign] = useState<'variant_a' | 'variant_b'>(currentAbConfig.heroDesign);
  const [buttonColor, setButtonColor] = useState<'amber' | 'emerald' | 'purple'>(currentAbConfig.buttonColor);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const stats = currentAbConfig.stats;

  const convRateA = stats.variantAViews > 0 ? ((stats.variantAClicks / stats.variantAViews) * 100).toFixed(1) : '0';
  const convRateB = stats.variantBViews > 0 ? ((stats.variantBClicks / stats.variantBViews) * 100).toFixed(1) : '0';

  const lift = parseFloat(convRateA) > 0 
    ? (((parseFloat(convRateB) - parseFloat(convRateA)) / parseFloat(convRateA)) * 100).toFixed(1)
    : '0';

  const handleSave = () => {
    const updated: AbTestConfig = {
      enabled,
      heroDesign,
      buttonColor,
      stats
    };

    onSaveConfig({
      ...config,
      abTestConfig: updated
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleResetStats = () => {
    if (confirm('Are you sure you want to reset A/B test conversion stats to zero?')) {
      const resetConfig: AbTestConfig = {
        enabled,
        heroDesign,
        buttonColor,
        stats: {
          variantAViews: 0,
          variantBViews: 0,
          variantAClicks: 0,
          variantBClicks: 0
        }
      };

      onSaveConfig({
        ...config,
        abTestConfig: resetConfig
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-amber-950/40 p-6 rounded-2xl border border-emerald-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/30 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              CONVERSION OPTIMIZATION ENGINE
            </span>
            <span className={`px-2.5 py-0.5 rounded-full font-bold text-xs border ${
              enabled 
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}>
              {enabled ? 'A/B Test Live' : 'Test Paused'}
            </span>
          </div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Sliders className="w-6 h-6 text-amber-400" />
            Hero Layout & CTA Button Color A/B Tester
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Experiment with visual hero styles and CTA button colorways to maximize affiliate conversion rates.
          </p>
        </div>

        <button
          onClick={() => setEnabled(!enabled)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 cursor-pointer transition-colors shrink-0"
        >
          {enabled ? (
            <>
              <ToggleRight className="w-6 h-6 text-emerald-400" />
              <span>A/B TEST ENABLED</span>
            </>
          ) : (
            <>
              <ToggleLeft className="w-6 h-6 text-slate-500" />
              <span>A/B TEST PAUSED</span>
            </>
          )}
        </button>
      </div>

      {/* Comparison Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Variant A Card */}
        <div className={`p-5 rounded-2xl border transition-all ${
          heroDesign === 'variant_a'
            ? 'bg-amber-950/20 border-amber-500/50 shadow-lg shadow-amber-500/10'
            : 'bg-slate-900/80 border-slate-800'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/30">
              VARIANT A
            </span>
            <span className="text-xs font-bold text-slate-400">Classic Casino Gold</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-slate-400" /> Impressions
              </span>
              <strong className="text-white font-mono">{stats.variantAViews.toLocaleString()}</strong>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1">
                <MousePointerClick className="w-3.5 h-3.5 text-amber-400" /> Clicks
              </span>
              <strong className="text-amber-400 font-mono">{stats.variantAClicks.toLocaleString()}</strong>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">Conversion Rate</span>
              <span className="text-lg font-black text-amber-400">{convRateA}%</span>
            </div>
          </div>
        </div>

        {/* Variant B Card */}
        <div className={`p-5 rounded-2xl border transition-all ${
          heroDesign === 'variant_b'
            ? 'bg-purple-950/20 border-purple-500/50 shadow-lg shadow-purple-500/10'
            : 'bg-slate-900/80 border-slate-800'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 font-bold text-xs border border-purple-500/30">
              VARIANT B
            </span>
            <span className="text-xs font-bold text-slate-400">Cyber Neon Dark</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-slate-400" /> Impressions
              </span>
              <strong className="text-white font-mono">{stats.variantBViews.toLocaleString()}</strong>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1">
                <MousePointerClick className="w-3.5 h-3.5 text-purple-400" /> Clicks
              </span>
              <strong className="text-purple-400 font-mono">{stats.variantBClicks.toLocaleString()}</strong>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">Conversion Rate</span>
              <span className="text-lg font-black text-purple-400">{convRateB}%</span>
            </div>
          </div>
        </div>

        {/* Winner / Conversion Lift summary */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-amber-400" />
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Performance Lift Analysis
              </h4>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              {parseFloat(convRateB) >= parseFloat(convRateA) ? (
                <>Variant B is currently outperforming Variant A by <strong className="text-emerald-400">+{lift}% higher conversion</strong>.</>
              ) : (
                <>Variant A is currently outperforming Variant B by <strong className="text-amber-400">+{Math.abs(parseFloat(lift))}% higher conversion</strong>.</>
              )}
            </p>
          </div>

          <button
            onClick={handleResetStats}
            className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-400 hover:text-slate-200 cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset A/B Conversion Stats</span>
          </button>
        </div>
      </div>

      {/* Test Controls */}
      <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-6">
        <h3 className="text-md font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
          <BarChart3 className="w-4 h-4 text-emerald-400" />
          Active Test Configurations
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Hero Design Variant Toggle */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
              1. Hero Section Visual Style
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setHeroDesign('variant_a')}
                className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                  heroDesign === 'variant_a'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md shadow-amber-500/10'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <div className="font-bold text-sm mb-1">Variant A: Gold Casino</div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  High-converting gold badges, trust banners & classic gaming headline.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setHeroDesign('variant_b')}
                className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                  heroDesign === 'variant_b'
                    ? 'bg-purple-500/20 border-purple-500 text-purple-300 shadow-md shadow-purple-500/10'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <div className="font-bold text-sm mb-1">Variant B: Cyber Neon</div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Modern dark futuristic neon look with glowing cyberpunk accents.
                </p>
              </button>
            </div>
          </div>

          {/* Button Color Toggle */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
              2. Main CTA Button Accent Colorway
            </label>

            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setButtonColor('amber')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                  buttonColor === 'amber'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 shadow-md"></div>
                <span className="text-xs font-bold">Amber Gold</span>
              </button>

              <button
                type="button"
                onClick={() => setButtonColor('emerald')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                  buttonColor === 'emerald'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 shadow-md"></div>
                <span className="text-xs font-bold">Emerald Green</span>
              </button>

              <button
                type="button"
                onClick={() => setButtonColor('purple')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                  buttonColor === 'purple'
                    ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-400 shadow-md"></div>
                <span className="text-xs font-bold">Royal Purple</span>
              </button>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Changes take effect live immediately on the visitor homepage.
          </div>

          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs tracking-wider shadow-lg shadow-amber-500/20 cursor-pointer transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>SAVE A/B TEST CONFIGURATION</span>
          </button>
        </div>

        {saveSuccess && (
          <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>A/B Testing parameters saved and deployed to live site!</span>
          </div>
        )}
      </div>
    </div>
  );
};
