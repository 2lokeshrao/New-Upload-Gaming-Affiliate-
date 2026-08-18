import React, { Suspense, useState } from 'react';
const MDEditor = React.lazy(() => import('@uiw/react-md-editor'));
import { AffiliateLinksEditor } from "./AffiliateLinksEditor";
import { GlobalConfig, GamingPlatform, AIArticle } from '../types';
import { Sparkles, Save, Edit3, Trash2, FileText, RefreshCw } from 'lucide-react';

interface AiArticleManagerTabProps {
  config: GlobalConfig;
  platforms: GamingPlatform[];
  onSaveConfig: (updatedConfig: GlobalConfig) => void;
  token: string;
}

export const AiArticleManagerTab: React.FC<AiArticleManagerTabProps> = ({ config, platforms, onSaveConfig, token }) => {
  const [articles, setArticles] = useState<AIArticle[]>(config.articles || []);
  const [topic, setTopic] = useState('');
  const [selectedPlatformId, setSelectedPlatformId] = useState('');
  const [category, setCategory] = useState('Gaming & Casinos');
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedToast, setSavedToast] = useState(false);
  
  const [editingArticle, setEditingArticle] = useState<AIArticle | null>(null);

  const categories = ['Gaming & Casinos', 'Crypto & Blockchain', 'Banking & Virtual Cards', 'Loans & Finance', 'Sports Betting'];

  const handleGenerate = async () => {
    if (!topic || !category) return alert('Please enter a topic and category.');
    setIsGenerating(true);
    
    try {
      const platform = platforms.find(p => p.id === selectedPlatformId);
      const res = await fetch('/api/generate-article', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          topic, 
          category, 
          platformName: platform?.name || '',
          platformId: platform?.id || ''
        })
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to generate');

      
      const newArticle: AIArticle = {
        id: 'art_' + Date.now(),
        slug: topic.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000),
        title: data.title || topic,
        content: data.content,
        category,
        platformId: platform?.id,
        platformName: platform?.name,
        metaTitle: data.metaTitle || topic,
        metaDescription: data.metaDescription || '',
        publishedAt: new Date().toISOString(),
        author: 'AI Editorial Team',
        tags: data.tags || [],
        views: 0
      };
      
      const updated = [newArticle, ...articles];
      setArticles(updated);
      onSaveConfig({ ...config, articles: updated });
      setTopic('');
    } catch (err: any) {
      alert('Error generating article: ' + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this article?')) return;
    const updated = articles.filter(a => a.id !== id);
    setArticles(updated);
    onSaveConfig({ ...config, articles: updated });
  };

  const handleSaveEdit = () => {
    if (!editingArticle) return;
    
    // Auto-generate slug if it's missing or empty
    if (!editingArticle.slug || editingArticle.id.startsWith('new_')) {
      editingArticle.slug = editingArticle.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      if (!editingArticle.slug) editingArticle.slug = 'article-' + Math.floor(Math.random() * 1000);
    }

    let updated;
    if (editingArticle.id.startsWith('new_')) {
      // Remove 'new_' prefix to save as a real id
      const newArt = { ...editingArticle, id: 'art_' + Math.floor(Math.random() * 1000000) };
      updated = [newArt, ...articles];
    } else {
      updated = articles.map(a => a.id === editingArticle.id ? editingArticle : a);
    }
    
    setArticles(updated);
    onSaveConfig({ ...config, articles: updated });
    setEditingArticle(null);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            AI Auto-Blogger
          </h2>
          <p className="text-xs text-slate-400">Generate SEO-optimized articles based on current Google Search trends in one click.</p>
        </div>
      </div>

      
      {/* Auto-Blogger Configuration */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-purple-400" />
          Automated Content Service
        </h3>
        <p className="text-sm text-slate-400 mb-4">
          Enable the Gemini-powered background service to automatically generate trending articles and save them as drafts for your review.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex items-center gap-3 text-white cursor-pointer bg-slate-950 p-4 rounded-xl border border-slate-800">
            <input 
              type="checkbox"
              checked={config.autoBlogSettings?.enabled || false}
              onChange={e => onSaveConfig({...config, autoBlogSettings: {...config.autoBlogSettings, enabled: e.target.checked}} as any)}
              className="w-5 h-5 accent-purple-500 rounded"
            />
            <span className="font-bold">Enable Automated Auto-Blogger</span>
          </label>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Interval (Hours)</label>
            <input 
              type="number"
              min="1"
              value={config.autoBlogSettings?.intervalHours || 24}
              onChange={e => onSaveConfig({...config, autoBlogSettings: {...config.autoBlogSettings, intervalHours: parseInt(e.target.value)}} as any)}
              className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-white" 
            />
          </div>
        </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Content Categories (comma separated)</label>
            <input 
              type="text"
              value={config.autoBlogSettings?.categories?.join(', ') || 'Gaming, Crypto, Finance, Loans, Virtual Cards'}
              onChange={e => onSaveConfig({...config, autoBlogSettings: {...(config.autoBlogSettings || {}), categories: e.target.value.split(',').map(s => s.trim()).filter(Boolean)}} as any)}
              className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-white" 
              placeholder="e.g. Gaming, Crypto, Loans"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Topics / Prompts (comma separated)</label>
            <textarea 
              value={config.autoBlogSettings?.topics?.join(', ') || 'Best crypto wallets for gaming, Top virtual cards for cashout, Instant loan apps for gamers'}
              onChange={e => onSaveConfig({...config, autoBlogSettings: {...(config.autoBlogSettings || {}), topics: e.target.value.split(',').map(s => s.trim()).filter(Boolean)}} as any)}
              className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-white font-mono text-sm" 
              rows={3}
              placeholder="Enter specific topics you want the AI to write about"
            />
          </div>

      </div>

      {/* Generator Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-white font-bold mb-4">Write New Trending Article</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Target Keyword / Trending Topic</label>
            <input 
              type="text" 
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g. 1win Aviator tips 2024"
              className="w-full bg-slate-950 border border-slate-700 rounded p-2.5 text-white text-sm" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Link to Platform (Optional)</label>
            <select
              value={selectedPlatformId}
              onChange={e => setSelectedPlatformId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded p-2.5 text-white text-sm"
            >
              <option value="">None (General Topic)</option>
              {platforms.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded p-2.5 text-white text-sm"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={handleGenerate}
            disabled={isGenerating || !topic}
            className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {isGenerating ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            {isGenerating ? 'AI is researching & writing...' : 'Generate Full SEO Article'}
          </button>
          
          <button 
            onClick={() => {
              const platform = platforms.find(p => p.id === selectedPlatformId);
              setEditingArticle({
                id: 'new_' + Math.floor(Math.random() * 1000000),
                slug: '',
                title: '',
                content: '# Write your article here...',
                category: category || categories[0],
                platformId: selectedPlatformId || undefined,
                platformName: platform?.name,
                metaTitle: '',
                metaDescription: '',
                publishedAt: new Date().toISOString(),
                author: 'Admin',
                tags: [],
                views: 0
              });
            }}
            className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold flex justify-center items-center gap-2"
          >
            <Edit3 className="w-5 h-5" />
            Write Manually
          </button>
        </div>
      </div>

      {/* Editor Modal */}
      {editingArticle && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[200] p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h3 className="text-xl font-bold text-white mb-4">Edit Article</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Title</label>
                <input 
                  type="text" 
                  value={editingArticle.title}
                  onChange={e => setEditingArticle({...editingArticle, title: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white" 
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Content (Markdown supported)</label>
                
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Status</label>
                <select 
                  value={editingArticle.status || 'published'}
                  onChange={e => setEditingArticle({...editingArticle, status: e.target.value as any})}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white" 
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft (Hidden)</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <AffiliateLinksEditor 
                  links={editingArticle.affiliateLinks} 
                  onChange={(links) => setEditingArticle({...editingArticle, affiliateLinks: links})} 
                />
              </div>
              
              <div className="md:col-span-2" data-color-mode="dark">

                  <MDEditor
                    value={editingArticle.content}
                    onChange={(val) => setEditingArticle({...editingArticle, content: val || ''})}
                    height={400}
                    style={{ backgroundColor: '#020617' }}
                  />
                  <p className="text-[10px] text-slate-500 mt-2">Use Markdown to format. To add a custom affiliate button, you can just type [CTA] and it will be replaced automatically in the frontend.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Meta Title</label>
                    <input type="text" value={editingArticle.metaTitle} onChange={e => setEditingArticle({...editingArticle, metaTitle: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white" />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Meta Description</label>
                    <input type="text" value={editingArticle.metaDescription} onChange={e => setEditingArticle({...editingArticle, metaDescription: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white" />
                 </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <button onClick={() => setEditingArticle(null)} className="px-4 py-2 bg-slate-800 text-white rounded font-bold">Cancel</button>
              <button onClick={handleSaveEdit} className="px-4 py-2 bg-emerald-500 text-white rounded font-bold">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-4">
        <h4 className="text-white font-bold border-b border-slate-800 pb-2">Published Articles ({articles.length})</h4>
        {articles.length === 0 ? (
          <div className="text-center p-8 bg-slate-900 border border-slate-800 rounded-xl">
            <FileText className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="text-slate-400 text-sm">No articles generated yet.</p>
          </div>
        ) : (
          articles.map(art => (
            
            <div key={art.id} className={`bg-slate-900 border border-slate-800 rounded-lg p-4 flex items-center justify-between ${art.status === 'draft' ? 'opacity-70 border-dashed' : ''}`}>
              <div>
                <div className="flex items-center gap-2">
                  <h5 className="font-bold text-white text-sm">{art.title}</h5>
                  {art.status === 'draft' && <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-[10px] rounded uppercase font-bold tracking-wider">Draft</span>}
                </div>
                <div className="flex gap-3 text-xs text-slate-400 mt-1">
                  <span className="bg-slate-800 px-2 py-0.5 rounded">{art.category}</span>
                  <span>{new Date(art.publishedAt).toLocaleDateString()}</span>
                  <span>/blog/{art.slug}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditingArticle(art)} className="p-2 bg-slate-800 text-blue-400 rounded hover:bg-slate-700"><Edit3 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(art.id)} className="p-2 bg-slate-800 text-red-400 rounded hover:bg-slate-700"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
