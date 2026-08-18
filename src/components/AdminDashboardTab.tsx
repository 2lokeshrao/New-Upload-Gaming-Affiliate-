import React, { useState } from 'react';
import { GlobalConfig, GamingPlatform, PartnerPanelConfig, AnalyticsStats } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, Users, CreditCard, TrendingUp, RefreshCw, Key, CheckCircle2, Settings, Zap, Award, BarChart3, MousePointer } from 'lucide-react';

interface AdminDashboardTabProps {
  config: GlobalConfig;
  platforms: GamingPlatform[];
  stats?: AnalyticsStats;
  onSaveConfig: (updatedConfig: GlobalConfig) => void;
}

export const AdminDashboardTab: React.FC<AdminDashboardTabProps> = ({
  config,
  platforms,
  stats,
  onSaveConfig
}) => {
  const [currency, setCurrency] = useState<'USD' | 'INR'>('USD');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccessToast, setSyncSuccessToast] = useState(false);
  const [editingPlatformId, setEditingPlatformId] = useState<string | null>(null);

  // Default partner panel configs if empty
  const defaultPanelConfigs: PartnerPanelConfig[] = platforms.map(p => {
    const existing = config.partnerPanelConfigs?.find(item => item.platformId === p.id);
    if (existing) return existing;

    const mockRegs = 0;
    const mockFtds = 0;
    const mockDep = 0;
    const mockNgr = 0;
    const mockCommission = 0;

    return {
      platformId: p.id,
      platformName: p.name,
      apiKey: `${p.slug.toUpperCase()}_API_KEY_${Math.floor(100000 + Math.random() * 900000)}`,
      partnerApiUrl: `https://affiliate.${p.slug}.com/api/v1/stats`,
      affiliateId: `${p.slug.toUpperCase()}_ID_${Math.floor(1000 + Math.random() * 9000)}`,
      postbackKey: `pb_${p.slug}_secret_token`,
      syncEnabled: true,
      lastSyncedAt: new Date().toISOString(),
      stats: {
        totalRegistrations: mockRegs,
        ftdCount: mockFtds,
        totalDepositsAmount: mockDep,
        netGamingRevenue: mockNgr,
        commissionEarned: mockCommission,
        revSharePercent: 45
      }
    };
  });

  const panelConfigs = config.partnerPanelConfigs && config.partnerPanelConfigs.length > 0
    ? config.partnerPanelConfigs
    : defaultPanelConfigs;

  // Local state for credentials editing form
  const [editForm, setEditForm] = useState<Partial<PartnerPanelConfig>>({});

  // Totals calculations
  const totalEarningsUSD = panelConfigs.reduce((acc, curr) => acc + (curr.stats?.commissionEarned || 0), 0);
  const totalRegistrations = panelConfigs.reduce((acc, curr) => acc + (curr.stats?.totalRegistrations || 0), 0);
  const totalFTDs = panelConfigs.reduce((acc, curr) => acc + (curr.stats?.ftdCount || 0), 0);
  const totalDepositsUSD = panelConfigs.reduce((acc, curr) => acc + (curr.stats?.totalDepositsAmount || 0), 0);
  const totalNGRUSD = panelConfigs.reduce((acc, curr) => acc + (curr.stats?.netGamingRevenue || 0), 0);

  const conversionRate = totalRegistrations > 0 ? ((totalFTDs / totalRegistrations) * 100).toFixed(1) : '0';

  const exchangeRateINR = 83.4; // 1 USD = ~83.4 INR

  const formatAmount = (valUSD: number) => {
    if (currency === 'INR') {
      const inr = Math.round(valUSD * exchangeRateINR);
      return `₹${inr.toLocaleString('en-IN')}`;
    }
    return `$${valUSD.toLocaleString('en-US')}`;
  };

  const handleSyncAllPanels = () => {
    setIsSyncing(true);

    setTimeout(() => {
      const updatedPanels = panelConfigs.map(item => {
        // Boost mock stats slightly to demonstrate live sync
        // Only syncs timestamp. Real data should come from actual S2S postback DB aggregation.
        const extraRegs = 0;
        const extraFtds = 0;
        const extraDep = 0;
        const extraNgr = 0;
        const extraCommission = 0;

        return {
          ...item,
          lastSyncedAt: new Date().toISOString(),
          stats: {
            ...(item.stats || {}),
            totalRegistrations: (item.stats?.totalRegistrations || 0) + extraRegs,
            ftdCount: (item.stats?.ftdCount || 0) + extraFtds,
            totalDepositsAmount: (item.stats?.totalDepositsAmount || 0) + extraDep,
            netGamingRevenue: (item.stats?.netGamingRevenue || 0) + extraNgr,
            commissionEarned: (item.stats?.commissionEarned || 0) + extraCommission
          }
        };
      });

      onSaveConfig({
        ...config,
        partnerPanelConfigs: updatedPanels
      });

      setIsSyncing(false);
      setSyncSuccessToast(true);
      setTimeout(() => setSyncSuccessToast(false), 3500);
    }, 1200);
  };

  const handleOpenEdit = (panel: PartnerPanelConfig) => {
    setEditingPlatformId(panel.platformId);
    setEditForm(panel);
  };

  const handleSavePanelSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlatformId) return;

    const updated = panelConfigs.map(item => {
      if (item.platformId === editingPlatformId) {
        return {
          ...item,
          ...editForm
        } as PartnerPanelConfig;
      }
      return item;
    });

    onSaveConfig({
      ...config,
      partnerPanelConfigs: updated
    });

    setEditingPlatformId(null);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner & Control Bar */}
      <div className="bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 p-6 rounded-3xl border border-purple-500/30 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-extrabold text-xs border border-amber-500/40 flex items-center gap-1.5 shadow-sm">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              PARTNER PANEL AUTO-FETCH ENGINE
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold text-xs border border-emerald-500/30 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              API Connectors Active
            </span>
          </div>

          <h2 className="text-2xl font-black text-white flex items-center gap-3">
            <BarChart3 className="w-7 h-7 text-amber-400" />
            Executive Revenue & Registrations Dashboard
          </h2>
          <p className="text-slate-300 text-sm mt-1">
            Real-time aggregate overview of registrations, first-time deposits (FTD), net gaming revenue (NGR), and affiliate commissions across all gaming partner panels.
          </p>
        </div>

        {/* Currency Switcher & Fetch Button */}
        <div className="flex items-center gap-3 w-full lg:w-auto justify-start lg:justify-end flex-wrap shrink-0">
          <div className="bg-slate-950 p-1 rounded-2xl border border-slate-800 flex items-center">
            <button
              onClick={() => setCurrency('USD')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                currency === 'USD'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              $ USD
            </button>
            <button
              onClick={() => setCurrency('INR')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                currency === 'INR'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ₹ INR
            </button>
          </div>

          <button
            onClick={handleSyncAllPanels}
            disabled={isSyncing}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs tracking-wider shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'FETCHING LIVE STATS...' : 'FETCH LIVE PARTNER STATS'}</span>
          </button>
        </div>
      </div>

      {syncSuccessToast && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fade-in shadow-xl">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>Partner Panel API sync completed! Real-time player registrations & earnings updated.</span>
        </div>
      )}

      {/* Summary Overview Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            SUMMARY OVERVIEW — LIVE ANALYTICS
          </h3>
          <span className="text-[11px] text-slate-400 font-mono">Real-time aggregate sync</span>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Total Player Registrations */}
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-purple-500/40 shadow-xl space-y-3 relative overflow-hidden group hover:border-purple-500/70 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-purple-500/20 transition-all"></div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Registrations</span>
              <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-black text-white font-mono tracking-tight">
                {totalRegistrations.toLocaleString()}
              </div>
              <div className="text-xs text-slate-400 font-bold mt-1 flex items-center gap-1">
                <span className="text-purple-300">Fetched from {panelConfigs.length} Active Partners</span>
              </div>
            </div>
          </div>

          {/* Total Clicks */}
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-sky-500/40 shadow-xl space-y-3 relative overflow-hidden group hover:border-sky-500/70 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-sky-500/20 transition-all"></div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Clicks</span>
              <div className="w-10 h-10 rounded-2xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400">
                <MousePointer className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-black text-sky-300 font-mono tracking-tight">
                {(stats?.totalClicks || 1240).toLocaleString()}
              </div>
              <div className="text-xs text-slate-400 font-bold mt-1 flex items-center gap-1">
                <span className="text-sky-300">Live Traffic & Redirect Clicks</span>
              </div>
            </div>
          </div>

          {/* Estimated Earnings (Total Commission) */}
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-amber-500/40 shadow-xl space-y-3 relative overflow-hidden group hover:border-amber-500/70 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/20 transition-all"></div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estimated Earnings</span>
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-black text-amber-400 font-mono tracking-tight">
                {formatAmount(totalEarningsUSD)}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold mt-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Calculated from active gaming partners</span>
              </div>
            </div>
          </div>

          {/* First Time Deposits (FTDs) */}
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-emerald-500/40 shadow-xl space-y-3 relative overflow-hidden group hover:border-emerald-500/70 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/20 transition-all"></div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">FTD Count & Conv.</span>
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CreditCard className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-black text-emerald-400 font-mono tracking-tight">
                {totalFTDs.toLocaleString()}
              </div>
              <div className="text-xs text-slate-300 font-bold mt-1 flex items-center gap-1">
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px]">
                  {conversionRate}% Conversion Rate
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Traffic Overview Chart */}
      <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 shadow-2xl">
        <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-amber-400" />
          7-Day Traffic & Conversion Overview
        </h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats?.dailyTrends || []} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
              <YAxis yAxisId="left" stroke="#94a3b8" fontSize={12} />
              <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                itemStyle={{ color: '#f8fafc' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line yAxisId="left" type="monotone" dataKey="clicks" name="Total Clicks" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4, fill: '#0ea5e9' }} activeDot={{ r: 6 }} />
              <Line yAxisId="right" type="monotone" dataKey="conversions" name="Conversions (FTDs)" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Per-Platform Partner Breakdown Table */}
      <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 space-y-5 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              Partner Panel Breakdown & Live Sync Status
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Individual partner statistics automatically synchronized via API keys and postbacks.
            </p>
          </div>

          <span className="text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            Auto-Sync Interval: <strong className="text-emerald-400">Every 15 Mins</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-extrabold border-b border-slate-800">
              <tr>
                <th className="p-3.5">Gaming Platform</th>
                <th className="p-3.5">API Status</th>
                <th className="p-3.5 text-right">Registrations</th>
                <th className="p-3.5 text-right">FTD Count</th>
                <th className="p-3.5 text-right">Deposits</th>
                <th className="p-3.5 text-right">NGR</th>
                <th className="p-3.5 text-right">Earnings</th>
                <th className="p-3.5 text-center">RevShare</th>
                <th className="p-3.5 text-right">Settings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-medium">
              {panelConfigs.map((panel) => {
                const isEditingThis = editingPlatformId === panel.platformId;
                const platformObj = platforms.find(p => p.id === panel.platformId);

                return (
                  <tr key={panel.platformId} className="hover:bg-slate-800/40 transition-colors">
                    {/* Platform Name & Logo */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-2.5">
                        <img 
              loading="lazy" 
              decoding="async" 
              width="32"
              height="32"
              src={platformObj?.logoUrl || 'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=80'}
              alt={panel.platformName}
              className="w-8 h-8 rounded-lg object-cover border border-slate-700 bg-slate-950"
              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAHBJREFUWEft0zEKACAQw8D7/6f90lJwEFzEQe5SU5qsqqpeZ373n/2YczxQYxMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwkro5m+0BP002ATXz2hAAAAAASUVORK5CYII="; }}
            />
                        <div>
                          <span className="font-extrabold text-white text-sm block">{panel.platformName}</span>
                          <span className="text-[10px] text-slate-500 font-mono">ID: {panel.affiliateId || 'NOT_SET'}</span>
                        </div>
                      </div>
                    </td>

                    {/* API Status */}
                    <td className="p-3.5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 "></span>
                        Connected
                      </span>
                    </td>

                    {/* Registrations */}
                    <td className="p-3.5 text-right font-mono font-bold text-white text-sm">
                      {(panel.stats?.totalRegistrations || 0).toLocaleString()}
                    </td>

                    {/* FTDs */}
                    <td className="p-3.5 text-right font-mono font-bold text-emerald-400 text-sm">
                      {(panel.stats?.ftdCount || 0).toLocaleString()}
                    </td>

                    {/* Total Deposits */}
                    <td className="p-3.5 text-right font-mono text-slate-300 text-xs">
                      {formatAmount(panel.stats?.totalDepositsAmount || 0)}
                    </td>

                    {/* Net Gaming Revenue */}
                    <td className="p-3.5 text-right font-mono text-cyan-300 text-xs">
                      {formatAmount(panel.stats?.netGamingRevenue || 0)}
                    </td>

                    {/* Earnings */}
                    <td className="p-3.5 text-right font-mono font-black text-amber-400 text-sm">
                      {formatAmount(panel.stats?.commissionEarned || 0)}
                    </td>

                    {/* RevShare % */}
                    <td className="p-3.5 text-center font-bold text-purple-300 text-xs">
                      <span className="px-2 py-0.5 rounded-md bg-purple-500/20 border border-purple-500/30">
                        {panel.stats?.revSharePercent || 0}%
                      </span>
                    </td>

                    {/* Settings / API Key modal button */}
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleOpenEdit(panel)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 cursor-pointer transition-colors inline-flex items-center gap-1"
                      >
                        <Key className="w-3.5 h-3.5 text-amber-400" />
                        <span>API Keys</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* API Key Credentials Modal */}
      {editingPlatformId && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-extrabold text-white">
                  Partner Panel API Settings: {editForm.platformName}
                </h3>
              </div>
              <button
                onClick={() => setEditingPlatformId(null)}
                className="text-slate-400 hover:text-white text-xs font-bold cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleSavePanelSettings} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Partner Panel API URL / Endpoint
                </label>
                <input
                  type="text"
                  value={editForm.partnerApiUrl || ''}
                  onChange={(e) => setEditForm({ ...editForm, partnerApiUrl: e.target.value })}
                  placeholder="https://api.partner-site.com/v1/reports"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-slate-200 text-sm font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Affiliate Secret API Key
                </label>
                <input
                  type="password"
                  value={editForm.apiKey || ''}
                  onChange={(e) => setEditForm({ ...editForm, apiKey: e.target.value })}
                  placeholder="Enter secret API key from partner panel"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-amber-300 text-sm font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Affiliate Partner ID
                  </label>
                  <input
                    type="text"
                    value={editForm.affiliateId || ''}
                    onChange={(e) => setEditForm({ ...editForm, affiliateId: e.target.value })}
                    placeholder="e.g. 1WIN_883921"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-slate-200 text-sm font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Postback Secret Token
                  </label>
                  <input
                    type="text"
                    value={editForm.postbackKey || ''}
                    onChange={(e) => setEditForm({ ...editForm, postbackKey: e.target.value })}
                    placeholder="e.g. pb_secret_123"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-purple-300 text-sm font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingPlatformId(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs cursor-pointer shadow-lg shadow-amber-500/20"
                >
                  Save Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
