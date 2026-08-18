import React, { useState, useEffect } from 'react';
import { GamingPlatform, CustomCoupon } from '../types';
import { Globe, RefreshCw, ExternalLink, Copy, Check, Code } from 'lucide-react';

interface SitemapManagerTabProps {
  platforms: GamingPlatform[];
  customCoupons: CustomCoupon[];
}

export const SitemapManagerTab: React.FC<SitemapManagerTabProps> = ({
  platforms,
  customCoupons
}) => {
  const [sitemapXml, setSitemapXml] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<string>('');

  const fetchSitemap = async () => {
    setLoading(true);
    try {
      const res = await fetch('/sitemap.xml');
      const text = await res.text();
      setSitemapXml(text);
      setLastGenerated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Failed to fetch sitemap XML:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSitemap();
  }, []);

  const handleCopyXml = () => {
    navigator.clipboard.writeText(sitemapXml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activePlatforms = platforms.filter(p => p.isActive);
  const activeCoupons = customCoupons.filter(c => c.isActive);
  const totalUrls = 1 + (activePlatforms.length * 2) + activeCoupons.length; // Homepage + 2 per platform (go & review) + coupons

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-950/80 via-slate-900 to-slate-950 border border-purple-500/30 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-purple-400 font-extrabold text-xs uppercase tracking-wider">
            <Globe className="w-4 h-4 text-amber-400" />
            <span>Search Engine Indexing Automation</span>
          </div>
          <h2 className="text-xl font-black text-white">Automated Sitemap XML Generator</h2>
          <p className="text-xs text-slate-300">
            Automatically generates and serves <span className="font-mono text-amber-300 font-bold">/sitemap.xml</span> containing all platform reviews, affiliate redirect slugs, and event promo coupons for Google, Bing, and Yandex crawlers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchSitemap}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs uppercase shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Generating...' : 'Refresh Sitemap'}</span>
          </button>

          <a
            href="/sitemap.xml"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>View Live XML</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Indexing Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">TOTAL INDEXED URLS</span>
          <span className="font-mono font-black text-2xl text-amber-300">{totalUrls}</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">PLATFORM ROUTES</span>
          <span className="font-mono font-black text-2xl text-purple-300">{activePlatforms.length * 2}</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">STANDALONE COUPONS</span>
          <span className="font-mono font-black text-2xl text-pink-300">{activeCoupons.length}</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">LAST REFRESHED</span>
          <span className="font-mono font-black text-xs text-emerald-400 block mt-1">{lastGenerated || 'Just now'}</span>
        </div>
      </div>

      {/* XML Code Preview Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-black text-white">Live sitemap.xml Output Preview</h3>
          </div>

          <button
            onClick={handleCopyXml}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">COPIED</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>COPY XML</span>
              </>
            )}
          </button>
        </div>

        <pre className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-emerald-400 font-mono text-xs overflow-x-auto max-h-96 leading-relaxed select-all">
          {sitemapXml || `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://domain/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`}
        </pre>
      </div>
    </div>
  );
};
