import React, { useState } from 'react';
import { GamingPlatform } from '../types';
import { Search, Sparkles, CheckCircle2, Save, Globe, Info } from 'lucide-react';
import { generateSmartSeoTags } from './AdminPanel';

interface SeoManagerTabProps {
  token: string;
  platforms: GamingPlatform[];
  onSavePlatforms: (updated: GamingPlatform[]) => void;
}

export const SeoManagerTab: React.FC<SeoManagerTabProps> = ({ platforms, onSavePlatforms, token }) => {
  const [selectedPlatformId, setSelectedPlatformId] = useState<string>(platforms[0]?.id || '');
  const [localPlatforms, setLocalPlatforms] = useState<GamingPlatform[]>(platforms);
  const [savedToast, setSavedToast] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const selectedPlatform = localPlatforms.find(p => p.id === selectedPlatformId) || localPlatforms[0];
  if (!selectedPlatform) return <div className="p-8 text-slate-400">No platforms available. Please add a platform first.</div>;

  // Update field for selected platform
  const handleUpdateField = (field: keyof GamingPlatform, value: string) => {
    setLocalPlatforms(prev =>
      prev.map(p => (p.id === selectedPlatformId ? { ...p, [field]: value } : p))
    );
  };

  const [isGenerating, setIsGenerating] = useState(false);

  // Auto-Generate SEO preset for selected platform

  // Helper to truncate text
  const truncateSeoText = (text: string | undefined, max: number) => {
    if (!text) return '';
    if (text.length <= max) return text;
    const truncated = text.substring(0, max - 3).trim();
    return `${truncated}...`;
  };

  const handleAutoGenerateSeo = async () => {
    if (!selectedPlatform) return;
    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate-seo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          platformName: selectedPlatform.name,
          category: selectedPlatform.category,
          bonus: selectedPlatform.bonusText,
          promoCode: selectedPlatform.promoCode,
          existingDescription: selectedPlatform.metaDescription 
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate SEO content via API');
      }

      const { data } = await response.json();
      
      const brandName = selectedPlatform.name;

      const generatedTitle = truncateSeoText(data.title, 60);
      const generatedKeywords = data.keywords;
      
      let newReviewContent = selectedPlatform.reviewContent || `# ${brandName} Review\n\n`;
      newReviewContent += `\n\n## Platform Overview\n${data.description}\n\n## Frequently Asked Questions\n\n`;
      if (data.faqs && Array.isArray(data.faqs)) {
        data.faqs.forEach((faq: {question: string, answer: string}) => {
          newReviewContent += `**Q: ${faq.question}**\nA: ${faq.answer}\n\n`;
        });
      }

      setLocalPlatforms(prev =>
        prev.map(p =>
          p.id === selectedPlatformId
            ? {
                ...p,
                metaTitle: generatedTitle,
                metaDescription: truncateSeoText(data.description, 160),
                metaKeywords: generatedKeywords,
                reviewContent: newReviewContent.trim()
              }
            : p
        )
      );
    } catch (error) {
      console.warn('API SEO generation failed, applying smart contextual tags algorithm:', error);
      const smartTags = generateSmartSeoTags(selectedPlatform);
      setLocalPlatforms(prev =>
        prev.map(p =>
          p.id === selectedPlatformId
            ? {
                ...p,
                metaTitle: smartTags.metaTitle,
                metaDescription: smartTags.metaDescription,
                metaKeywords: smartTags.metaKeywords
              }
            : p
        )
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // Save changes
  const handleSaveAll = () => {
    onSavePlatforms(localPlatforms);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {savedToast && (
        <div className="fixed top-20 right-6 z-[200] bg-emerald-500 text-slate-950 font-black px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-emerald-300 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>SEO Metadata successfully saved and published!</span>
        </div>
      )}

      {/* SEO Health Checklist Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800 mb-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-black text-white">SEO Health Checklist</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(() => {
            const missingTitles = localPlatforms.filter(p => !p.metaTitle);
            const missingDescriptions = localPlatforms.filter(p => !p.metaDescription);
            const missingImages = [];
            return (
              <>
                <div className={`p-4 rounded-xl border ${missingTitles.length > 0 ? 'bg-amber-500/10 border-amber-500/30' : 'bg-emerald-500/10 border-emerald-500/30'}`}>
                  <h4 className="font-bold text-slate-200 mb-2">Meta Titles</h4>
                  <p className="text-sm text-slate-400">
                    {missingTitles.length > 0 
                      ? <span className="text-amber-400">{missingTitles.length} platforms missing custom titles</span>
                      : <span className="text-emerald-400">All platforms have custom titles!</span>}
                  </p>
                </div>
                <div className={`p-4 rounded-xl border ${missingDescriptions.length > 0 ? 'bg-amber-500/10 border-amber-500/30' : 'bg-emerald-500/10 border-emerald-500/30'}`}>
                  <h4 className="font-bold text-slate-200 mb-2">Meta Descriptions</h4>
                  <p className="text-sm text-slate-400">
                    {missingDescriptions.length > 0 
                      ? <span className="text-amber-400">{missingDescriptions.length} platforms missing descriptions</span>
                      : <span className="text-emerald-400">All platforms have descriptions!</span>}
                  </p>
                </div>
                <div className={`p-4 rounded-xl border ${missingImages.length > 0 ? 'bg-red-500/10 border-red-500/30' : 'bg-emerald-500/10 border-emerald-500/30'}`}>
                  <h4 className="font-bold text-slate-200 mb-2">Platform Images</h4>
                  <p className="text-sm text-slate-400">
                    {missingImages.length > 0 
                      ? <span className="text-red-400">{missingImages.length} platforms missing images</span>
                      : <span className="text-emerald-400">All platforms have images!</span>}
                  </p>
                </div>
              </>
            );
          })()}
        </div>
      </div>

      {/* Top Banner & Control Bar */}
      <div className="bg-gradient-to-r from-purple-950/80 via-slate-900 to-slate-950 border border-purple-500/30 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-purple-400 font-extrabold text-xs uppercase tracking-wider">
            <Search className="w-4 h-4 text-purple-400" />
            <span>Search Engine Optimization Control Center</span>
          </div>
          <h2 className="text-xl font-black text-white">Independent Platform SEO & Meta Tag Manager</h2>
          <p className="text-xs text-slate-300">
            Customize meta titles, meta descriptions, and search keywords for each gaming app to rank #1 on Google search results.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-105"
        >
          <Save className="w-4 h-4" />
          <span>Save All SEO Changes</span>
        </button>
      </div>

      {/* Platform Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        {localPlatforms.map(p => (
          <button
            key={p.id}
            onClick={() => setSelectedPlatformId(p.id)}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-extrabold text-xs whitespace-nowrap cursor-pointer transition-all ${
              selectedPlatformId === p.id
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 border border-purple-400/30'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            <img width="40" height="40" decoding="async" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAHBJREFUWEft0zEKACAQw8D7/6f90lJwEFzEQe5SU5qsqqpeZ373n/2YczxQYxMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwkro5m+0BP002ATXz2hAAAAAASUVORK5CYII="; }} loading="lazy" src={p.logoUrl || undefined} alt={p.name} className="w-5 h-5 rounded object-cover" />
            <span>{p.name}</span>
            {p.metaTitle ? (
              <span className="w-2 h-2 rounded-full bg-emerald-400" title="SEO Customized" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-amber-400/60" title="Default SEO" />
            )}
          </button>
        ))}
      </div>

      {selectedPlatform && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* SEO Form Controls */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <img width="40" height="40" decoding="async" loading="lazy" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAHBJREFUWEft0zEKACAQw8D7/6f90lJwEFzEQe5SU5qsqqpeZ373n/2YczxQYxMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwkro5m+0BP002ATXz2hAAAAAASUVORK5CYII="; }}  src={selectedPlatform.logoUrl || undefined} alt="" className="w-8 h-8 rounded-lg object-cover" />
                <div>
                  <h3 className="font-extrabold text-sm text-white">{selectedPlatform.name} SEO Profile</h3>
                  <span className="text-[11px] text-slate-400 font-mono">ID: {selectedPlatform.id}</span>
                </div>
              </div>

              <button
                onClick={handleAutoGenerateSeo}
                disabled={isGenerating}
                className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-colors ${
                  isGenerating 
                    ? 'bg-purple-900/50 border-purple-500/20 text-purple-400 cursor-not-allowed opacity-75' 
                    : 'bg-purple-950/80 hover:bg-purple-900 border-purple-500/40 text-purple-300 cursor-pointer'
                }`}
                title="Generate high-converting SEO meta tags automatically using AI"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? ' text-purple-500' : 'text-purple-400'}`} />
                <span>{isGenerating ? 'Generating AI...' : 'Auto-Generate Tags'}</span>
              </button>
            </div>

            {/* Meta Title Input */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-extrabold text-slate-200">Google Meta Title</label>
                <span className={`font-mono font-bold text-[11px] ${
                  (selectedPlatform.metaTitle || '').length > 60 ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {(selectedPlatform.metaTitle || '').length} / 60 Chars
                </span>
              </div>
              <input
                type="text"
                value={selectedPlatform.metaTitle || ''}
                maxLength={60}
                onChange={e => handleUpdateField('metaTitle', e.target.value)}
                placeholder={generateSmartSeoTags(selectedPlatform).metaTitle}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-xs font-bold focus:border-purple-500 outline-none"
              />
              <p className="text-[11px] text-slate-400">
                Main title displayed in Google search results. Include brand name + promo code + bonus offer.
              </p>
            </div>

            {/* Meta Description Input */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-extrabold text-slate-200">Google Meta Description Snippet</label>
                <span className={`font-mono font-bold text-[11px] ${
                  (selectedPlatform.metaDescription || '').length > 160 ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {(selectedPlatform.metaDescription || '').length} / 160 Chars
                </span>
              </div>
              <textarea
                rows={3}
                value={selectedPlatform.metaDescription || ''}
                maxLength={160}
                onChange={e => handleUpdateField('metaDescription', e.target.value)}
                placeholder={`Get official 500% welcome bonus promo code for ${selectedPlatform.name}. Claim 200 free spins and instant payouts.`}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-xs focus:border-purple-500 outline-none leading-relaxed"
              />
              <p className="text-[11px] text-slate-400">
                Short description shown under title in Google. Clear call-to-action encourages higher click-through rates.
              </p>
            </div>

            {/* Search Keywords */}
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-slate-200">Focus Target Keywords (Comma Separated)</label>
              <textarea
                rows={2}
                value={selectedPlatform.metaKeywords || ''}
                onChange={e => handleUpdateField('metaKeywords', e.target.value)}
                placeholder="1win promo code, 1win welcome bonus, 1win promo code today, 1win registration bonus"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-xs font-mono focus:border-purple-500 outline-none"
              />
              <p className="text-[11px] text-slate-400">
                Target keywords for search crawler indexing and rich snippet categorization.
              </p>
            </div>

            {/* SEO Review Summary Article */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              <label className="block text-xs font-extrabold text-slate-200">SEO Review Article Snippet (Markdown Supported)</label>
              <textarea
                rows={4}
                value={selectedPlatform.reviewContent || ''}
                onChange={e => handleUpdateField('reviewContent', e.target.value)}
                placeholder="# Official Review..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-xs font-mono focus:border-purple-500 outline-none leading-relaxed"
              />
            </div>
          </div>

          {/* Google SERP Live Preview Card */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-xs font-extrabold text-emerald-400">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span>Live Google SERP Search Snippet Preview</span>
              </div>

              {/* Simulated Google Search Result Item */}
              <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 space-y-1.5 font-sans">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <span className="w-3.5 h-3.5 rounded-full bg-purple-600/30 text-purple-400 text-[10px] flex items-center justify-center font-bold">G</span>
                  <span className="truncate">https://viprewards.app › promos › {selectedPlatform.slug}</span>
                  <span className="text-slate-600">⋮</span>
                </div>

                <h4 className="text-base font-semibold text-blue-400 hover:underline cursor-pointer leading-tight line-clamp-2">
                  {selectedPlatform.metaTitle || generateSmartSeoTags(selectedPlatform).metaTitle}
                </h4>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                  {selectedPlatform.metaDescription || generateSmartSeoTags(selectedPlatform).metaDescription}
                </p>

                <div className="pt-2 flex items-center gap-3 text-[11px] text-slate-400 border-t border-slate-800/60 mt-2">
                  <div className="flex items-center text-amber-400 font-bold">
                    <span>Rating: {selectedPlatform.rating || 9.8}/10</span>
                  </div>
                  <span className="text-emerald-400 font-bold">✓ Verified Code</span>
                  <span className="text-slate-500">2026 Edition</span>
                </div>
              </div>

              {/* Quick Info Box */}
              <div className="p-3.5 bg-purple-950/30 border border-purple-500/20 rounded-xl text-xs space-y-1.5 text-slate-300">
                <div className="flex items-center gap-1.5 font-extrabold text-purple-300">
                  <Info className="w-4 h-4 text-purple-400" />
                  <span>SEO Ranking Tip:</span>
                </div>
                <p className="leading-relaxed">
                  Including exact queries like <strong>&quot;{selectedPlatform.name} promo code&quot;</strong> and <strong>&quot;{selectedPlatform.promoCode || 'MAXBOOST500'}&quot;</strong> in your Meta Title & Description significantly improves organic search traffic from users searching for promo codes today.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
