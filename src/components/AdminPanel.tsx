import React, { Suspense, useState, useEffect } from 'react';
const MDEditor = React.lazy(() => import('@uiw/react-md-editor'));
import { GamingPlatform, GlobalConfig, AnalyticsStats, TrackLog, SubPartnerApplication, CustomPage } from '../types';
import { HelpCircle, LayoutDashboard, ChevronUp, ChevronDown, Activity, Gamepad2, Settings, BarChart2, Plus, Trash2, Edit3, Check, X, Menu, Key, Power, Flame, Eye, LogOut, Sparkles, Lock, Users, MessageCircle, ExternalLink, Mail, Search, Ticket } from 'lucide-react';
import { SeoManagerTab } from './SeoManagerTab';
import { SeoHealthTab } from './SeoHealthTab';
import { CustomCouponManagerTab } from './CustomCouponManagerTab';
import { FeedbackApprovalTab } from './FeedbackApprovalTab';
import { TrackingPixelManagerTab } from './TrackingPixelManagerTab';
import { SitemapManagerTab } from './SitemapManagerTab';
import { PushNotificationManagerTab } from './PushNotificationManagerTab';
import { AbTestDashboardTab } from './AbTestDashboardTab';
import { AdminDashboardTab } from './AdminDashboardTab';
import { AiArticleManagerTab } from './AiArticleManagerTab';
import { CustomPageManagerTab } from './CustomPageManagerTab';

import { FooterManagerTab } from './FooterManagerTab';
import { Target, Globe, MessageSquare, QrCode, Bell, Sliders, FileText } from 'lucide-react';

interface AdminPanelProps {
  token: string;
  onLogout: () => void;
  platforms: GamingPlatform[];
  config: GlobalConfig;
  stats: AnalyticsStats;
  logs: TrackLog[];
  subPartners?: SubPartnerApplication[];
  onSavePlatforms: (updated: GamingPlatform[]) => void;
  onSaveConfig: (updatedConfig: GlobalConfig) => void;
  onUpdateSubPartnerStatus?: (id: string, status: 'approved' | 'contacted' | 'pending') => void;
  customPages?: CustomPage[];
  onSaveCustomPages?: (pages: CustomPage[]) => void;
}


// Helper to truncate text
const truncateSeoText = (text: string | undefined, max: number) => {
  if (!text) return '';
  if (text.length <= max) return text;
  const truncated = text.substring(0, max - 3).trim();
  return `${truncated}...`;
};

export const AdminPanel: React.FC<AdminPanelProps> = ({
  token,
  onLogout,
  platforms,
  config,
  stats,
  logs,
  subPartners,
  onSavePlatforms,
  onSaveConfig,
  onUpdateSubPartnerStatus,
  customPages,
  onSaveCustomPages
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'partnerapi' | 'platforms' | 'config' | 'coupons' | 'analytics' | 'subpartners' | 'seo' | 'feedback' | 'pixels' | 'sitemap' | 'push' | 'abtest' | 'pages' | 'articles' | 'footer' | 'faqs'>('dashboard');

  // CMS state
  const [pagesList, setPagesList] = useState<CustomPage[]>(customPages || []);

  useEffect(() => {
    if (customPages) {
      setPagesList(customPages);
    }
  }, [customPages]);

  const [pageTitle, setPageTitle] = useState('');
  const [pageSlug, setPageSlug] = useState('');
  const [pageContent, setPageContent] = useState('');
  const [editingPageId, setEditingPageId] = useState<string | null>(null);

  const handleAddOrUpdatePage = () => {
    if (!pageTitle || !pageSlug || !pageContent) return;
    
    let updated;
    if (editingPageId) {
      updated = pagesList.map(p => p.id === editingPageId ? { ...p, title: pageTitle, slug: pageSlug, content: pageContent } : p);
    } else {
      updated = [...pagesList, { id: 'page_' + Date.now(), slug: pageSlug, title: pageTitle, content: pageContent, isActive: true }];
    }
    setPagesList(updated);
    setPageTitle('');
    setPageSlug('');
    setPageContent('');
    setEditingPageId(null);
  };

  const handleEditPage = (page: CustomPage) => {
    setEditingPageId(page.id);
    setPageTitle(page.title);
    setPageSlug(page.slug);
    setPageContent(page.content);
  };

  const handleDeletePage = (id: string) => {
    if(confirm('Are you sure you want to delete this page?')) {
      setPagesList(pagesList.filter(p => p.id !== id));
    }
  };

  const handleSavePages = () => {
    if (onSaveCustomPages) onSaveCustomPages(pagesList);
    alert('Pages saved successfully!');
  };
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Platform editing state
  const [editingPlatform, setEditingPlatform] = useState<Partial<GamingPlatform> | null>(null);
  const [isNew, setIsNew] = useState(false);

  // Global Config local form
  const [localConfig, setLocalConfig] = useState<GlobalConfig>(config);
  const [configSavedToast, setConfigSavedToast] = useState(false);

  useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  // Handle Save Platform
  const handleSavePlatform = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlatform) return;

    let updated: GamingPlatform[];

    if (isNew) {
      const newP: GamingPlatform = {
        id: editingPlatform.id || `plat_${Date.now()}`,
        slug: editingPlatform.slug || editingPlatform.name?.toLowerCase().replace(/\s+/g, '') || `platform_${Date.now()}`,
        name: editingPlatform.name || 'New Gaming Site',
        logoUrl: editingPlatform.logoUrl || 'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=160',
        rating: editingPlatform.rating || 9.5,
        starRating: 5,
        badges: editingPlatform.badges || ['Instant Withdrawal', 'Verified'],
        bonusText: editingPlatform.bonusText || '100% Welcome Bonus',
        promoCode: editingPlatform.promoCode || 'PROMO2026',
        rawAffiliateUrl: editingPlatform.rawAffiliateUrl || 'https://example.com',
        isFeatured: editingPlatform.isFeatured || false,
        featuredRank: editingPlatform.featuredRank || null,
        isActive: editingPlatform.isActive !== undefined ? editingPlatform.isActive : true,
        clicksCount: 0,
        copiesCount: 0,
        category: editingPlatform.category || 'Casino'
      };
      updated = [...platforms, newP];
    } else {
      updated = platforms.map(p => (p.id === editingPlatform.id ? ({ ...p, ...editingPlatform } as GamingPlatform) : p));
    }

    onSavePlatforms(updated);
    setEditingPlatform(null);
  };

  // Delete Platform
  const handleDeletePlatform = (id: string) => {
    if (confirm('Are you sure you want to delete this gaming platform?')) {
      const updated = platforms.filter(p => p.id !== id);
      onSavePlatforms(updated);
    }
  };

  // Move Platform (Reorder)
  const handleMovePlatform = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index > 0) {
      const updated = [...platforms];
      const temp = updated[index];
      updated[index] = updated[index - 1];
      updated[index - 1] = temp;
      onSavePlatforms(updated);
    } else if (direction === 'down' && index < platforms.length - 1) {
      const updated = [...platforms];
      const temp = updated[index];
      updated[index] = updated[index + 1];
      updated[index + 1] = temp;
      onSavePlatforms(updated);
    }
  };

  // Toggle Active/Inactive
  const handleToggleActive = (p: GamingPlatform) => {
    const updated = platforms.map(item =>
      item.id === p.id ? { ...item, isActive: !item.isActive } : item
    );
    onSavePlatforms(updated);
  };

  // Toggle Featured
  const handleToggleFeatured = (p: GamingPlatform) => {
    const updated = platforms.map(item =>
      item.id === p.id ? { ...item, isFeatured: !item.isFeatured } : item
    );
    onSavePlatforms(updated);
  };

  // Save Global Config
  const handleSaveGlobalConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(localConfig);
    setConfigSavedToast(true);
    setTimeout(() => setConfigSavedToast(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans">
      {/* Admin Header */}
      <header className="bg-slate-900 border-b border-slate-800 py-3.5 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center font-black text-white shadow-md shrink-0">
            <Lock className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm sm:text-lg leading-tight text-white">Affiliate Admin Control Center</h1>
            <span className="text-[10px] sm:text-xs text-emerald-400 font-mono">Status: Authenticated</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="text-[11px] sm:text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 sm:px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">View Live Site</span>
            <span className="sm:hidden">Live</span>
          </a>
          <button
            onClick={onLogout}
            className="text-[11px] sm:text-xs bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 px-2.5 sm:px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Admin Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
        {/* Mobile Navigation Sidebar Drawer (shows when hamburger is clicked) */}
        {isMobileMenuOpen && (
          <div className="lg:hidden col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2 shadow-2xl animate-fade-in z-20">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
              <span className="text-xs font-black text-amber-400 uppercase tracking-wider">Navigation Tabs</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-slate-400 hover:text-white text-xs p-1"
              >
                ✕ Close Menu
              </button>
            </div>

            <button
              onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-3 rounded-xl font-black text-xs flex items-center justify-between cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-amber-500 text-slate-950 font-black'
                  : 'bg-slate-950 text-amber-300 border border-amber-500/30'
              }`}
            >
              <div className="flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4" />
                <span>Partner Earnings Dashboard</span>
              </div>
              <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-slate-900 text-amber-400">LIVE</span>
            </button>

            <button
              onClick={() => { setActiveTab('partnerapi'); setIsMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer ${
                activeTab === 'partnerapi' ? 'bg-purple-600 text-white' : 'bg-slate-950 text-slate-300'
              }`}
            >
              <Key className="w-4 h-4 text-amber-400" />
              <span>Partner API Integration Settings</span>
            </button>

            <button
              onClick={() => { setActiveTab('platforms'); setIsMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer ${
                activeTab === 'platforms' ? 'bg-purple-600 text-white' : 'bg-slate-950 text-slate-300'
              }`}
            >
              <Gamepad2 className="w-4 h-4" />
              <span>Gaming Platforms ({platforms.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('config'); setIsMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer ${
                activeTab === 'config' ? 'bg-purple-600 text-white' : 'bg-slate-950 text-slate-300'
              }`}
            >
              <Edit3 className="w-4 h-4" />
              <span>Global Page Elements</span>
            </button>
                            <button 
              onClick={() => setActiveTab('pages')}
              className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-between cursor-pointer ${
                activeTab === 'pages' ? 'bg-purple-600 text-white' : 'bg-slate-950 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Custom Pages</span>
              </div>
            </button>

            <button
              onClick={() => { setActiveTab('articles'); setIsMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-3 transition-all ${
                activeTab === 'articles' ? 'bg-purple-600 text-white' : 'bg-slate-950 text-slate-300'
              } hover:bg-slate-800`}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>AI Auto-Blogger</span>
              </div>
            </button>

            <button
              onClick={() => { setActiveTab('footer'); setIsMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-3 transition-all ${
                activeTab === 'footer' ? 'bg-purple-600 text-white' : 'bg-slate-950 text-slate-300'
              } hover:bg-slate-800`}
            >
              <div className="flex items-center gap-2">
                <Menu className="w-4 h-4 text-cyan-400" />
                <span>Footer & Links Manager</span>
              </div>
            </button>
            <button
              onClick={() => { setActiveTab('faqs'); setIsMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-3 transition-all ${
                activeTab === 'faqs' ? 'bg-purple-600 text-white' : 'bg-slate-950 text-slate-300'
              } hover:bg-slate-800`}
            >
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-purple-400" />
                <span>FAQs Manager</span>
              </div>
            </button>


            <button 
              onClick={() => { setActiveTab('subpartners'); setIsMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-between cursor-pointer ${
                activeTab === 'subpartners' ? 'bg-purple-600 text-white' : 'bg-slate-950 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400" />
                <span>Sub-Partner Requests</span>
              </div>
              {subPartners && subPartners.length > 0 && (
                <span className="bg-amber-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full">
                  {subPartners.length}
                </span>
              )}
            </button>

            <button
              onClick={() => { setActiveTab('coupons'); setIsMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer ${
                activeTab === 'coupons' ? 'bg-purple-600 text-white' : 'bg-slate-950 text-slate-300'
              }`}
            >
              <Ticket className="w-4 h-4 text-amber-400" />
              <span>Custom Coupon Manager</span>
            </button>

            <button
              onClick={() => { setActiveTab('analytics'); setIsMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer ${
                activeTab === 'analytics' ? 'bg-purple-600 text-white' : 'bg-slate-950 text-slate-300'
              }`}
            >
              <BarChart2 className="w-4 h-4" />
              <span>Analytics & Click Counter</span>
            </button>

            <button
              onClick={() => { setActiveTab('seo'); setIsMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer ${
                activeTab === 'seo' ? 'bg-purple-600 text-white' : 'bg-slate-950 text-slate-300'
              }`}
            >
              <Search className="w-4 h-4 text-emerald-400" />
              <span>SEO Content Manager</span>
            </button>
            <button
              onClick={() => { setActiveTab('seo'); setIsMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer ${
                activeTab === 'seo' ? 'bg-purple-600 text-white' : 'bg-slate-950 text-slate-300'
              }`}
            >
              <Activity className="w-4 h-4 text-blue-400" />
              <span>SEO Health Limits</span>
            </button>

          </div>
        )}

        {/* Desktop Sidebar Nav */}
        <div className="hidden lg:block lg:col-span-3 space-y-2">
          {/* TAB 0: EXECUTIVE REVENUE & REGISTRATION DASHBOARD */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full text-left px-4 py-3.5 rounded-2xl font-black text-sm flex items-center justify-between cursor-pointer transition-all ${
              activeTab === 'dashboard'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/30 scale-[1.02]'
                : 'bg-slate-900 border border-amber-500/30 text-amber-300 hover:bg-slate-800 hover:text-amber-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-5 h-5" />
              <span>Partner Earnings Dashboard</span>
            </div>
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${activeTab === 'dashboard' ? 'bg-slate-950 text-amber-400' : 'bg-amber-500/20 text-amber-300'}`}>
              LIVE
            </span>
          </button>

          <button
            onClick={() => setActiveTab('partnerapi')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 cursor-pointer transition-colors ${
              activeTab === 'partnerapi'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Key className="w-5 h-5 text-amber-400" />
            <span>Partner API Integrations</span>
          </button>

          <button
            onClick={() => setActiveTab('platforms')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 cursor-pointer transition-colors ${
              activeTab === 'platforms'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Gamepad2 className="w-5 h-5" />
            <span>Gaming Platforms ({platforms.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('config')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 cursor-pointer transition-colors ${
              activeTab === 'config'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span>Global Page Elements</span>
          </button>

          <button
            onClick={() => setActiveTab('pages')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center justify-between cursor-pointer transition-colors ${
              activeTab === 'pages'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5" />
              <span>Custom Pages</span>
            </div>
          </button>
          <button 
            onClick={() => setActiveTab('subpartners')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center justify-between cursor-pointer transition-colors ${
              activeTab === 'subpartners'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-amber-400" />
              <span>Sub-Partner Requests</span>
            </div>
            {subPartners && subPartners.length > 0 && (
              <span className="bg-amber-500 text-slate-950 font-black text-xs px-2 py-0.5 rounded-full">
                {subPartners.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 cursor-pointer transition-colors ${
              activeTab === 'coupons'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Ticket className="w-5 h-5 text-amber-400" />
            <span>Custom Coupon Manager</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 cursor-pointer transition-colors ${
              activeTab === 'analytics'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <BarChart2 className="w-5 h-5" />
            <span>Analytics & Click Counter</span>
          </button>

          <button
            onClick={() => setActiveTab('articles')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 cursor-pointer transition-colors ${
              activeTab === 'articles'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <span>AI Auto-Blogger</span>
          </button>
          
          <button
            onClick={() => setActiveTab('footer')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 cursor-pointer transition-colors ${
              activeTab === 'footer'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Menu className="w-5 h-5 text-cyan-400" />
            <span>Footer & Links Manager</span>
            </button>
            <button 
              onClick={() => setActiveTab('faqs')}
              className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 cursor-pointer transition-all ${
                activeTab === 'faqs'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <HelpCircle className="w-5 h-5 text-purple-400" />
              <span>FAQs Manager</span>
            </button>


          <button
            onClick={() => setActiveTab('seo')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 cursor-pointer transition-colors ${
              activeTab === 'seo'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Search className="w-5 h-5 text-emerald-400" />
            <span>SEO Content Manager</span>
          </button>
          <button
            onClick={() => setActiveTab('seo')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 cursor-pointer transition-colors ${
              activeTab === 'seo'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Activity className="w-5 h-5 text-blue-400" />
            <span>SEO Health Limits</span>
          </button>


          <button
            onClick={() => setActiveTab('feedback')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 cursor-pointer transition-colors ${
              activeTab === 'feedback'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-5 h-5 text-amber-400" />
            <span>Feedback Approval Queue</span>
          </button>

          <button
            onClick={() => setActiveTab('pixels')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 cursor-pointer transition-colors ${
              activeTab === 'pixels'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Target className="w-5 h-5 text-cyan-400" />
            <span>Tracking Pixel Manager</span>
          </button>

          <button
            onClick={() => setActiveTab('sitemap')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 cursor-pointer transition-colors ${
              activeTab === 'sitemap'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Globe className="w-5 h-5 text-purple-400" />
            <span>Automated Sitemap Generator</span>
          </button>

          <button
            onClick={() => setActiveTab('push')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 cursor-pointer transition-colors ${
              activeTab === 'push'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Bell className="w-5 h-5 text-amber-400" />
            <span>FCM Push Notification Broadcast</span>
          </button>

          <button
            onClick={() => setActiveTab('abtest')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 cursor-pointer transition-colors ${
              activeTab === 'abtest'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-5 h-5 text-emerald-400" />
            <span>A/B Testing Dashboard</span>
          </button>
        </div>

        {/* Main Tab Content */}
        <div className="lg:col-span-9 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl">
          {/* TAB 0: EXECUTIVE DASHBOARD */}
          {activeTab === 'dashboard' && (
            <AdminDashboardTab
              config={localConfig}
              platforms={platforms}
              stats={stats}
              onSaveConfig={onSaveConfig}
            />
          )}




          {/* TAB: PARTNER API INTEGRATION SETTINGS */}
          {activeTab === 'partnerapi' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-extrabold text-[10px] border border-amber-500/30">
                    REAL-TIME SYNC ENGINE
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold text-[10px] border border-emerald-500/30">
                    SECURE ENCRYPTION
                  </span>
                </div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <Key className="w-6 h-6 text-amber-400" />
                  Partner API Integration Settings
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Configure unique API keys, partner tracking keys, affiliate IDs, and postback webhooks to auto-fetch live registration and earnings data directly from 1Win, Mostbet, Pin-Up, 1xBet, Stake, and other gaming platform partner panels.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {platforms.map((platform) => {
                  const currentPanel = localConfig.partnerPanelConfigs?.find(p => p.platformId === platform.id) || {
                    platformId: platform.id,
                    platformName: platform.name,
                    apiKey: `${platform.slug.toUpperCase()}_API_KEY_LIVE`,
                    partnerApiUrl: `https://affiliate.${platform.slug}.com/api/v1/stats`,
                    affiliateId: `${platform.slug.toUpperCase()}_AFF_882`,
                    postbackKey: `pb_${platform.slug}_secret_token`,
                    syncEnabled: true,
                    lastSyncedAt: new Date().toISOString(),
                    stats: {
                      totalRegistrations: 340,
                      ftdCount: 210,
                      totalDepositsAmount: 12500,
                      netGamingRevenue: 9375,
                      commissionEarned: 4218,
                      revSharePercent: 45
                    }
                  };

                  return (
                    <div key={platform.id} className="bg-slate-950 border border-slate-800 hover:border-purple-500/50 rounded-2xl p-4 sm:p-5 shadow-xl transition-all space-y-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                        <div className="flex items-center gap-3">
                          <img loading="lazy" width="40" height="40" decoding="async" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAHBJREFUWEft0zEKACAQw8D7/6f90lJwEFzEQe5SU5qsqqpeZ373n/2YczxQYxMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwkro5m+0BP002ATXz2hAAAAAASUVORK5CYII="; }}
                            src={"/api/cdn/images/" + platform.id + ".webp" || 'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=100'}
                            alt={platform.name}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-700 bg-slate-900"
                          />
                          <div>
                            <h3 className="font-extrabold text-white text-base leading-tight">{platform.name}</h3>
                            <span className="text-[11px] text-slate-400 font-mono">Slug: {platform.slug}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 "></span>
                            API Active
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        {/* API Key */}
                        <div>
                          <label className="text-[11px] font-extrabold text-slate-300 uppercase tracking-wider block mb-1">
                            Unique Partner Tracking / API Key
                          </label>
                          <input
                            type="text"
                            value={currentPanel.apiKey || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              const updatedPanels = [...(localConfig.partnerPanelConfigs || [])];
                              const idx = updatedPanels.findIndex(item => item.platformId === platform.id);
                              if (idx >= 0) {
                                updatedPanels[idx] = { ...updatedPanels[idx], apiKey: val };
                              } else {
                                updatedPanels.push({ ...currentPanel, apiKey: val });
                              }
                              const newCfg = { ...localConfig, partnerPanelConfigs: updatedPanels };
                              setLocalConfig(newCfg);
                              onSaveConfig(newCfg);
                            }}
                            placeholder="e.g. 1WIN_SECRET_KEY_9921"
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3 text-amber-300 font-mono text-xs focus:border-amber-500 outline-none"
                          />
                        </div>

                        {/* Affiliate ID */}
                        <div>
                          <label className="text-[11px] font-extrabold text-slate-300 uppercase tracking-wider block mb-1">
                            Partner Affiliate ID / Tag
                          </label>
                          <input
                            type="text"
                            value={currentPanel.affiliateId || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              const updatedPanels = [...(localConfig.partnerPanelConfigs || [])];
                              const idx = updatedPanels.findIndex(item => item.platformId === platform.id);
                              if (idx >= 0) {
                                updatedPanels[idx] = { ...updatedPanels[idx], affiliateId: val };
                              } else {
                                updatedPanels.push({ ...currentPanel, affiliateId: val });
                              }
                              const newCfg = { ...localConfig, partnerPanelConfigs: updatedPanels };
                              setLocalConfig(newCfg);
                              onSaveConfig(newCfg);
                            }}
                            placeholder="e.g. AFF_1WIN_992"
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3 text-white font-mono text-xs focus:border-purple-500 outline-none"
                          />
                        </div>

                        {/* API Endpoint URL */}
                        <div>
                          <label className="text-[11px] font-extrabold text-slate-300 uppercase tracking-wider block mb-1">
                            Partner API Endpoint URL
                          </label>
                          <input
                            type="text"
                            value={currentPanel.partnerApiUrl || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              const updatedPanels = [...(localConfig.partnerPanelConfigs || [])];
                              const idx = updatedPanels.findIndex(item => item.platformId === platform.id);
                              if (idx >= 0) {
                                updatedPanels[idx] = { ...updatedPanels[idx], partnerApiUrl: val };
                              } else {
                                updatedPanels.push({ ...currentPanel, partnerApiUrl: val });
                              }
                              const newCfg = { ...localConfig, partnerPanelConfigs: updatedPanels };
                              setLocalConfig(newCfg);
                              onSaveConfig(newCfg);
                            }}
                            placeholder="https://partner-api.example.com/stats"
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3 text-slate-300 font-mono text-xs focus:border-purple-500 outline-none"
                          />
                        </div>

                        {/* Postback Secret Key */}
                        <div>
                          <label className="text-[11px] font-extrabold text-slate-300 uppercase tracking-wider block mb-1">
                            S2S Postback Token / Secret
                          </label>
                          <input
                            type="text"
                            value={currentPanel.postbackKey || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              const updatedPanels = [...(localConfig.partnerPanelConfigs || [])];
                              const idx = updatedPanels.findIndex(item => item.platformId === platform.id);
                              if (idx >= 0) {
                                updatedPanels[idx] = { ...updatedPanels[idx], postbackKey: val };
                              } else {
                                updatedPanels.push({ ...currentPanel, postbackKey: val });
                              }
                              const newCfg = { ...localConfig, partnerPanelConfigs: updatedPanels };
                              setLocalConfig(newCfg);
                              onSaveConfig(newCfg);
                            }}
                            placeholder="pb_secret_token_123"
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3 text-slate-300 font-mono text-xs focus:border-purple-500 outline-none"
                          />
                        </div>
                      </div>

                      {/* Postback Webhook URL Guide */}
                      <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <div>
                          <span className="font-extrabold text-amber-400 block sm:inline mr-2">Postback Webhook URL:</span>
                          <code className="text-sky-300 font-mono break-all">{`https://yourdomain.com/api/postback?platform=${platform.id}&key=${currentPanel.postbackKey || 'TOKEN'}`}</code>
                        </div>
                        <span className="text-[10px] text-emerald-400 font-extrabold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 shrink-0">
                          Auto-Sync Ready
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 1: GAMING PLATFORMS CRUD */}
          {activeTab === 'platforms' && (
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-xl font-black text-white">Gaming Platform Offers</h2>
                  <p className="text-xs text-slate-400">Add, edit, or toggle active platforms on your affiliate hub.</p>
                </div>
                <button
                  onClick={() => {
                    setIsNew(true);
                    setEditingPlatform({
                      name: '',
                      logoUrl: 'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=160',
                      rating: 9.8,
                      badges: ['Instant Withdrawal', 'Verified'],
                      bonusText: '500% Welcome Bonus',
                      promoCode: 'BONUSVIP',
                      rawAffiliateUrl: 'https://',
                      isFeatured: false,
                      isActive: true,
                      category: 'Casino & Sports'
                    });
                  }}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Platform</span>
                </button>
              </div>

              {/* Form Modal for Edit/Add */}
              {editingPlatform && (
                <form onSubmit={handleSavePlatform} className="bg-slate-950 border border-purple-500/40 p-5 rounded-2xl mb-6 space-y-4 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="font-extrabold text-sm text-amber-300">
                      {isNew ? 'Create New Platform' : `Edit Platform: ${editingPlatform.name}`}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setEditingPlatform(null)}
                      className="text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Platform Name</label>
                      <input
                        type="text"
                        
                        value={editingPlatform.name || ''}
                        onChange={e => setEditingPlatform({ ...editingPlatform, name: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white font-medium focus:border-purple-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Slug ID (for /go/slug)</label>
                      <input
                        type="text"
                        
                        value={editingPlatform.slug || ''}
                        onChange={e => setEditingPlatform({ ...editingPlatform, slug: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white font-medium focus:border-purple-500 outline-none"
                        placeholder="e.g. 1win"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Raw Affiliate Redirect URL</label>
                      <input
                        type="url"
                        
                        value={editingPlatform.rawAffiliateUrl || ''}
                        onChange={e => setEditingPlatform({ ...editingPlatform, rawAffiliateUrl: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white font-medium focus:border-purple-500 outline-none"
                        placeholder="https://1win.pro/?p=YOUR_AFFILIATE_ID"
                      />
                    </div>

                    <div>
                      <label className="block text-amber-400 font-bold mb-1">Master Partner Panel Sign-Up Link</label>
                      <input
                        type="url"
                        value={editingPlatform.masterPartnerUrl || ''}
                        onChange={e => setEditingPlatform({ ...editingPlatform, masterPartnerUrl: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white font-medium focus:border-purple-500 outline-none"
                        placeholder="https://1win.run/affiliates?ref=YOUR_SUBAGENT_LINK"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Logo Image URL</label>
                      <input
                        type="url"
                        
                        value={editingPlatform.logoUrl || ''}
                        onChange={e => setEditingPlatform({ ...editingPlatform, logoUrl: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white font-medium focus:border-purple-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Promo Code</label>
                      <input
                        type="text"
                        
                        value={editingPlatform.promoCode || ''}
                        onChange={e => setEditingPlatform({ ...editingPlatform, promoCode: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white font-medium focus:border-purple-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Rating (e.g. 9.8)</label>
                      <input
                        type="number"
                        step="0.1"
                        max="10"
                        min="1"
                        value={editingPlatform.rating || 9.5}
                        onChange={e => setEditingPlatform({ ...editingPlatform, rating: parseFloat(e.target.value) })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white font-medium focus:border-purple-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Minimum Deposit (e.g. ₹300 / $5)</label>
                      <input
                        type="text"
                        value={editingPlatform.minDeposit || ''}
                        onChange={e => setEditingPlatform({ ...editingPlatform, minDeposit: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white font-medium focus:border-purple-500 outline-none"
                        placeholder="e.g. ₹300 / $5"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Category / Tag</label>
                      <input
                        type="text"
                        value={editingPlatform.category || 'Casino & Sports'}
                        onChange={e => setEditingPlatform({ ...editingPlatform, category: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white font-medium focus:border-purple-500 outline-none"
                        placeholder="e.g. Casino, Aviator, Sports, Slots"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-slate-400 font-bold mb-1">Main Bonus Headline</label>
                      <input
                        type="text"
                        
                        value={editingPlatform.bonusText || ''}
                        onChange={e => setEditingPlatform({ ...editingPlatform, bonusText: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white font-medium focus:border-purple-500 outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-slate-400 font-bold mb-1">Trust Badges (comma separated)</label>
                      <input
                        type="text"
                        value={editingPlatform.badges ? editingPlatform.badges.join(', ') : ''}
                        onChange={e =>
                          setEditingPlatform({
                            ...editingPlatform,
                            badges: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                          })
                        }
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white font-medium focus:border-purple-500 outline-none"
                        placeholder="Instant UPI, No KYC, 24/7 Live Support"
                      />
                    </div>

                    
                    <div className="sm:col-span-2 mt-4" data-color-mode="dark">
                      <label className="block text-amber-400 font-bold mb-2 text-sm border-b border-slate-800 pb-2 flex justify-between items-center">
                        <span>Custom Review Content (Optional)</span>
                        <span className="text-slate-500 text-[10px] font-normal tracking-wide uppercase">Overrides default SEO template</span>
                      </label>
                      <MDEditor
                        value={editingPlatform.reviewContent || ''}
                        onChange={(val) => setEditingPlatform({...editingPlatform, reviewContent: val || ''})}
                        height={400}
                        style={{ backgroundColor: '#020617' }}
                      />
                      <p className="text-[10px] text-slate-500 mt-2">Use Markdown to format. If left empty, the programmatic SEO template will be used for this brand's page.</p>
                    </div>

                    {/* SEO Metadata Sub-section inside Platform Add/Edit */}
                    <div className="sm:col-span-2 p-3.5 bg-slate-900/90 border border-purple-500/30 rounded-xl space-y-3 mt-1">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="font-extrabold text-xs text-purple-300 flex items-center gap-1.5">
                          <Search className="w-3.5 h-3.5 text-purple-400" />
                          <span>Search Engine Optimization (SEO) Meta Tags</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const name = editingPlatform.name || 'Gaming Platform';
                            const code = editingPlatform.promoCode || 'MAXBOOST500';
                                                        const generatedTitle = truncateSeoText(`${name} Promo Code ${code} | 500% Deposit Bonus 2026`, 60);
                            const generatedDesc = truncateSeoText(`Official verified promo code for ${name}. Use code ${code} during registration to claim 500% welcome bonus + 200 free spins instantly.`, 160);
                            setEditingPlatform({
                              ...editingPlatform,
                              metaTitle: generatedTitle,
                              metaDescription: generatedDesc,
                              metaKeywords: `${name.toLowerCase()} promo code, ${name.toLowerCase()} bonus code, ${name.toLowerCase()} welcome bonus 500%, ${code}`
                            });
                          }}
                          className="px-2.5 py-1 rounded bg-purple-950 border border-purple-500/40 text-purple-300 text-[11px] font-bold hover:bg-purple-900 cursor-pointer"
                        >
                          ✨ Auto-Generate SEO Tags
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-300 font-bold text-[11px] mb-1">SEO Meta Title</label>
                          <input
                            type="text"
                            value={editingPlatform.metaTitle || ''}
                            onChange={e => setEditingPlatform({ ...editingPlatform, metaTitle: e.target.value })}
                            placeholder="e.g. 1Win Promo Code MAXBOOST500 | 500% Bonus 2026"
                            className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white text-xs font-medium focus:border-purple-500 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-300 font-bold text-[11px] mb-1">SEO Target Keywords</label>
                          <input
                            type="text"
                            value={editingPlatform.metaKeywords || ''}
                            onChange={e => setEditingPlatform({ ...editingPlatform, metaKeywords: e.target.value })}
                            placeholder="e.g. 1win promo code, 1win bonus code"
                            className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white text-xs font-medium focus:border-purple-500 outline-none"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-slate-300 font-bold text-[11px] mb-1">SEO Meta Description</label>
                          <input
                            type="text"
                            value={editingPlatform.metaDescription || ''}
                            onChange={e => setEditingPlatform({ ...editingPlatform, metaDescription: e.target.value })}
                            placeholder="e.g. Get official 500% deposit bonus code for 1Win..."
                            className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white text-xs font-medium focus:border-purple-500 outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
                      <input
                        type="checkbox"
                        checked={editingPlatform.isFeatured || false}
                        onChange={e => setEditingPlatform({ ...editingPlatform, isFeatured: e.target.checked })}
                        className="w-4 h-4 rounded accent-amber-500"
                      />
                      <span>Mark as Featured Top Choice</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
                      <input
                        type="checkbox"
                        checked={editingPlatform.isActive !== false}
                        onChange={e => setEditingPlatform({ ...editingPlatform, isActive: e.target.checked })}
                        className="w-4 h-4 rounded accent-emerald-500"
                      />
                      <span>Active on Landing Page</span>
                    </label>
                  </div>
                  {editingPlatform.isFeatured && (
                    <div className="pt-2">
                      <label className="block text-slate-400 font-bold text-[11px] mb-1">Featured Rank (Gold, Silver, Bronze)</label>
                      <select
                        value={editingPlatform.featuredRank || ''}
                        onChange={e => {
                          const val = e.target.value;
                          setEditingPlatform({ ...editingPlatform, featuredRank: val ? parseInt(val, 10) : null });
                        }}
                        className="w-full sm:w-1/2 bg-slate-900 border border-slate-800 rounded p-2 text-white text-xs font-medium focus:border-amber-500 outline-none"
                      >
                        <option value="">No Special Rank</option>
                        <option value="1">🥇 Rank 1: Gold</option>
                        <option value="2">🥈 Rank 2: Silver</option>
                        <option value="3">🥉 Rank 3: Bronze</option>
                      </select>
                    </div>
                  )}

                  <div className="flex justify-end gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setEditingPlatform(null)}
                      className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-lg bg-purple-600 text-white text-xs font-extrabold hover:bg-purple-500 shadow-md cursor-pointer"
                    >
                      Save Platform
                    </button>
                  </div>
                </form>
              )}

              {/* Table of Platforms */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-extrabold border-b border-slate-800">
                    <tr>
                      <th className="p-3">Rank</th>
                      <th className="p-3">Platform</th>
                      <th className="p-3">Bonus & Code</th>
                      <th className="p-3">Clicks / Copies</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                                        {platforms.map((p, index) => (
                      <tr key={p.id} className="hover:bg-slate-800/30">
                        <td className="p-3">
                          <div className="flex flex-col items-center gap-1 w-6">
                            <button
                              onClick={() => handleMovePlatform(index, 'up')}
                              disabled={index === 0}
                              className={`p-1 rounded hover:bg-slate-700 ${index === 0 ? 'opacity-30 cursor-not-allowed' : 'text-slate-300'}`}
                              title="Move Up"
                            >
                              <ChevronUp className="w-4 h-4" />
                            </button>
                            <span className="font-mono text-xs text-slate-500 font-bold">{index + 1}</span>
                            <button
                              onClick={() => handleMovePlatform(index, 'down')}
                              disabled={index === platforms.length - 1}
                              className={`p-1 rounded hover:bg-slate-700 ${index === platforms.length - 1 ? 'opacity-30 cursor-not-allowed' : 'text-slate-300'}`}
                              title="Move Down"
                            >
                              <ChevronDown className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                        <td className="p-3 flex items-center gap-3">
                          <img width="40" height="40" decoding="async" loading="lazy" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAHBJREFUWEft0zEKACAQw8D7/6f90lJwEFzEQe5SU5qsqqpeZ373n/2YczxQYxMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwYhMwkro5m+0BP002ATXz2hAAAAAASUVORK5CYII="; }}  src={"/api/cdn/images/" + p.id + ".webp"} alt={p.name} className="w-9 h-9 rounded-lg object-cover bg-slate-800" />
                          <div>
                            <span className="font-extrabold text-white text-sm block">{p.name}</span>
                            <span className="text-[10px] text-purple-400 font-mono">/go/{p.slug}</span>
                          </div>
                        </td>

                        <td className="p-3">
                          <span className="font-bold text-slate-200 block max-w-xs truncate">{p.bonusText}</span>
                          <span className="font-mono text-amber-400 font-bold text-[11px]">{p.promoCode}</span>
                        </td>

                        <td className="p-3">
                          <div className="flex items-center gap-3 font-mono font-bold text-slate-300">
                            <span title="CTA Clicks" className="text-cyan-400">🖱️ {p.clicksCount || 0}</span>
                            <span title="Promo Copies" className="text-amber-400">📋 {p.copiesCount || 0}</span>
                          </div>
                        </td>

                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleToggleActive(p)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1 cursor-pointer ${
                                p.isActive
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                  : 'bg-slate-800 text-slate-500 border border-slate-700'
                              }`}
                            >
                              <Power className="w-3 h-3" />
                              <span>{p.isActive ? 'Active' : 'Disabled'}</span>
                            </button>

                            {p.isFeatured && (
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border ${p.featuredRank === 1 ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40' : p.featuredRank === 2 ? 'bg-slate-300/20 text-slate-300 border-slate-300/40' : p.featuredRank === 3 ? 'bg-orange-600/30 text-orange-300 border-orange-500/40' : 'bg-amber-500/20 text-amber-300 border-amber-500/40'}`}>
                                <Flame className="w-3 h-3 fill-current" />
                                {p.featuredRank === 1 ? 'Gold' : p.featuredRank === 2 ? 'Silver' : p.featuredRank === 3 ? 'Bronze' : 'Top'}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setIsNew(false);
                                setEditingPlatform(p);
                              }}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
                              title="Edit"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeletePlatform(p.id)}
                              className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: GLOBAL CONFIG EDITOR */}
          {activeTab === 'config' && (
            <form onSubmit={handleSaveGlobalConfig} className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-xl font-black text-white">Global Elements & Text Editor</h2>
                <p className="text-xs text-slate-400">Edit hero headlines, gamification pop-ups, and cloaking without touching code.</p>
              </div>

              {configSavedToast && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Global configurations saved successfully!</span>
                </div>
              )}

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-extrabold mb-1">Hero Main Headline</label>
                  <input
                    type="text"
                    
                    value={localConfig.heroHeadline}
                    onChange={e => setLocalConfig({ ...localConfig, heroHeadline: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-medium focus:border-purple-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-extrabold mb-1">Hero Subheading</label>
                  <textarea
                    rows={3}
                    
                    value={localConfig.heroSubheading}
                    onChange={e => setLocalConfig({ ...localConfig, heroSubheading: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-medium focus:border-purple-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-extrabold mb-1">Top Geo Country Banner Template</label>
                  <input
                    type="text"
                    
                    value={localConfig.topBannerTemplate}
                    onChange={e => setLocalConfig({ ...localConfig, topBannerTemplate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-medium focus:border-purple-500 outline-none"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Use <code className="text-amber-400 font-mono">&#123;&#123;country&#125;&#125;</code> as a dynamic placeholder for the user's detected country.
                  </span>
                </div>
                <div>
                  <label className="block text-slate-300 font-extrabold mb-1">Sidebar Ad/Widget HTML</label>
                  <textarea
                    rows={4}
                    value={localConfig.sidebarAdHtml || ''}
                    onChange={e => setLocalConfig({ ...localConfig, sidebarAdHtml: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono text-sm focus:border-purple-500 outline-none"
                    placeholder="<img src='...' /> or <script>...</script>"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    HTML injected into the right/left sidebar on Brand and Custom Pages. Useful for AdSense or direct banner ads.
                  </span>
                </div>

                {/* Exit Intent Popup Customizer & Promotion Manager */}
                <div className="pt-4 border-t border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-extrabold text-sm text-amber-400 flex items-center gap-2">
                        <Flame className="w-4 h-4 text-amber-400" />
                        <span>Exit Intent VIP Promotion Popup Settings</span>
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Choose which gaming company/offer is promoted when a user tries to close the website, or set a custom affiliate promotion.
                      </p>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                      <span className="text-[11px] font-bold text-slate-300">Enable Popup</span>
                      <input
                        type="checkbox"
                        checked={localConfig.exitIntentConfig?.enabled !== false}
                        onChange={e => {
                          const updated = {
                            ...(localConfig.exitIntentConfig || {}),
                            enabled: e.target.checked
                          };
                          setLocalConfig({ ...localConfig, exitIntentConfig: updated });
                        }}
                        className="w-4 h-4 rounded accent-amber-500"
                      />
                    </label>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
                    {/* Platform Selector */}
                    <div>
                      <label className="block text-slate-300 font-bold mb-1 text-[11px]">
                        Select Company / Offer to Promote
                      </label>
                      <select
                        value={localConfig.exitIntentConfig?.overridePlatformId || ''}
                        onChange={e => {
                          const val = e.target.value;
                          const selectedPlat = platforms.find(p => p.id === val);
                          const updated = {
                            ...(localConfig.exitIntentConfig || {}),
                            overridePlatformId: val,
                            // Pre-fill fields if a platform is picked
                            ...(selectedPlat ? {
                              customBrandName: selectedPlat.name,
                              customLogoUrl: selectedPlat.logoUrl,
                              customBonusText: selectedPlat.bonusText,
                              customPromoCode: selectedPlat.promoCode,
                              customAffiliateUrl: selectedPlat.rawAffiliateUrl
                            } : {})
                          };
                          setLocalConfig({ ...localConfig, exitIntentConfig: updated });
                        }}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white font-medium focus:border-amber-500 outline-none"
                      >
                        <option value="">⭐ Auto (Default Featured Platform)</option>
                        {platforms.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.promoCode} - {p.bonusText})
                          </option>
                        ))}
                        <option value="custom">⚙️ Custom Manual Promotion (Any Company / Custom Link)</option>
                      </select>
                    </div>

                    {/* Custom Offer Override Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                      <div>
                        <label className="block text-slate-300 font-bold mb-1">Company / Brand Name</label>
                        <input
                          type="text"
                          value={localConfig.exitIntentConfig?.customBrandName || ''}
                          onChange={e => {
                            const updated = { ...(localConfig.exitIntentConfig || {}), customBrandName: e.target.value };
                            setLocalConfig({ ...localConfig, exitIntentConfig: updated });
                          }}
                          placeholder="e.g. 1Win / Stake / Parimatch"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:border-amber-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-bold mb-1">Logo Image URL</label>
                        <input
                          type="url"
                          value={localConfig.exitIntentConfig?.customLogoUrl || ''}
                          onChange={e => {
                            const updated = { ...(localConfig.exitIntentConfig || {}), customLogoUrl: e.target.value };
                            setLocalConfig({ ...localConfig, exitIntentConfig: updated });
                          }}
                          placeholder="https://... or /logos/1win.png"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:border-amber-500 outline-none"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-slate-300 font-bold mb-1">
                          Referral / Affiliate Link (Target URL)
                        </label>
                        <input
                          type="url"
                          value={localConfig.exitIntentConfig?.customAffiliateUrl || ''}
                          onChange={e => {
                            const updated = { ...(localConfig.exitIntentConfig || {}), customAffiliateUrl: e.target.value };
                            setLocalConfig({ ...localConfig, exitIntentConfig: updated });
                          }}
                          placeholder="https://your-affiliate-link.com/?ref=123"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-amber-300 font-mono focus:border-amber-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-bold mb-1">Promo Code</label>
                        <input
                          type="text"
                          value={localConfig.exitIntentConfig?.customPromoCode || ''}
                          onChange={e => {
                            const updated = { ...(localConfig.exitIntentConfig || {}), customPromoCode: e.target.value };
                            setLocalConfig({ ...localConfig, exitIntentConfig: updated });
                          }}
                          placeholder="e.g. 500TOPUP or VIPBONUS"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white font-mono focus:border-amber-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-bold mb-1">Bonus Offer Subtitle</label>
                        <input
                          type="text"
                          value={localConfig.exitIntentConfig?.customBonusText || ''}
                          onChange={e => {
                            const updated = { ...(localConfig.exitIntentConfig || {}), customBonusText: e.target.value };
                            setLocalConfig({ ...localConfig, exitIntentConfig: updated });
                          }}
                          placeholder="e.g. Get 500% Welcome Bonus + 100 Free Spins"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:border-amber-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-bold mb-1">Top Badge Text</label>
                        <input
                          type="text"
                          value={localConfig.exitIntentConfig?.customBadgeText || ''}
                          onChange={e => {
                            const updated = { ...(localConfig.exitIntentConfig || {}), customBadgeText: e.target.value };
                            setLocalConfig({ ...localConfig, exitIntentConfig: updated });
                          }}
                          placeholder="e.g. EXCLUSIVE VIP OFFER"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:border-amber-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-bold mb-1">Action Button Text</label>
                        <input
                          type="text"
                          value={localConfig.exitIntentConfig?.customButtonText || ''}
                          onChange={e => {
                            const updated = { ...(localConfig.exitIntentConfig || {}), customButtonText: e.target.value };
                            setLocalConfig({ ...localConfig, exitIntentConfig: updated });
                          }}
                          placeholder="e.g. CLAIM 500% BONUS INSTANTLY"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:border-amber-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Toggles */}
                <div className="pt-4 border-t border-slate-800 space-y-3">
                  <h3 className="font-extrabold text-sm text-purple-400">Gamification & Bot Controls</h3>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                    <div>
                      <span className="font-bold text-white text-xs block">Enable Ad-Bot Cloaking Filter</span>
                      <span className="text-[11px] text-slate-400">Detects Googlebot/FB crawler user-agents on /go/* routes and displays a safe blog review instead of direct redirect.</span>
                      <span className="text-[11px] text-amber-500 font-bold block mt-1 uppercase">⚠️ Warning: Enabling this may violate Google Ads and Facebook Ads cloaking policies and lead to permanent account suspension.</span>
                    </div>
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded accent-emerald-500"
                    />
                  </label>

                  {/* Social Media Links Section */}
                  <div className="pt-4 border-t border-slate-800 space-y-3">
                    <h3 className="font-extrabold text-sm text-cyan-400 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      <span>Official Social Media Channel URLs</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-slate-300 font-bold mb-1">Telegram Channel URL</label>
                        <input
                          type="url"
                          value={localConfig.telegramUrl || ''}
                          onChange={e => setLocalConfig({ ...localConfig, telegramUrl: e.target.value })}
                          placeholder="https://t.me/YourOfficialChannel"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-cyan-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-bold mb-1">WhatsApp Group URL</label>
                        <input
                          type="url"
                          value={localConfig.whatsappGroupUrl || ''}
                          onChange={e => setLocalConfig({ ...localConfig, whatsappGroupUrl: e.target.value })}
                          placeholder="https://chat.whatsapp.com/YourGroup"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-cyan-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-bold mb-1">Instagram Page URL</label>
                        <input
                          type="url"
                          value={localConfig.instagramUrl || ''}
                          onChange={e => setLocalConfig({ ...localConfig, instagramUrl: e.target.value })}
                          placeholder="https://instagram.com/your_page"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-cyan-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-bold mb-1">TikTok Channel URL</label>
                        <input
                          type="url"
                          value={localConfig.tiktokUrl || ''}
                          onChange={e => setLocalConfig({ ...localConfig, tiktokUrl: e.target.value })}
                          placeholder="https://tiktok.com/@your_handle"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-cyan-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-bold mb-1">YouTube Channel URL</label>
                        <input
                          type="url"
                          value={localConfig.youtubeUrl || ''}
                          onChange={e => setLocalConfig({ ...localConfig, youtubeUrl: e.target.value })}
                          placeholder="https://youtube.com/@your_channel"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-cyan-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Security & Admin Stealth Section */}
                  <div className="pt-4 border-t border-slate-800 space-y-3">
                    <h3 className="font-extrabold text-sm text-amber-400 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-amber-400" />
                      <span>Admin Stealth Security & Anti-Brute-Force Shield</span>
                    </h3>

                    <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                      <div>
                        <span className="font-bold text-white text-xs block">Hide Public Admin Portal Buttons</span>
                        <span className="text-[11px] text-slate-400">Removes visible Admin links to prevent unauthorized brute-force hacking attempts. Access via Ctrl+Shift+A hotkey.</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={localConfig.hideAdminLink !== false}
                        onChange={e => setLocalConfig({ ...localConfig, hideAdminLink: e.target.checked })}
                        className="w-5 h-5 rounded accent-amber-500"
                      />
                    </label>

                    <div className="p-3 bg-amber-950/40 border border-amber-500/30 rounded-xl text-xs space-y-1 text-slate-300">
                      <span className="font-extrabold text-amber-300 block">🔒 ACTIVE SECURITY PROTECTION STATUS:</span>
                      <p>• <strong>Brute-Force Lockout:</strong> After 3 incorrect password entries, IP address is automatically locked out for 5 minutes.</p>
                      <p>• <strong>Stealth Keyboard Trigger:</strong> Press <kbd className="bg-slate-900 border border-slate-700 px-1.5 py-0.5 rounded text-amber-300 font-mono">Ctrl + Shift + A</kbd> anywhere on the website to open secret admin login.</p>
                      <p>• <strong>Secret URL Query:</strong> Visit website with <code className="text-amber-300 font-mono">?admin=1</code> to trigger secret login.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs shadow-lg shadow-purple-600/30 cursor-pointer"
                >
                  Save Global Configuration
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-xl font-black text-white">Built-in Conversion Analytics</h2>
                <p className="text-xs text-slate-400">Real-time click tracking, code copy metrics, and user event logs.</p>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                  <span className="text-xs text-slate-400 font-bold block">Total Landing Visits</span>
                  <span className="text-2xl font-black text-white mt-1 block">{stats?.totalVisits || 0}</span>
                </div>

                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                  <span className="text-xs text-slate-400 font-bold block">Total Offer Clicks</span>
                  <span className="text-2xl font-black text-cyan-400 mt-1 block">{stats?.totalClicks || 0}</span>
                </div>

                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                  <span className="text-xs text-slate-400 font-bold block">Promo Code Copies</span>
                  <span className="text-2xl font-black text-amber-400 mt-1 block">{stats?.totalPromoCopies || 0}</span>
                </div>

                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                  <span className="text-xs text-slate-400 font-bold block">Lucky Wheel Spins</span>
                </div>
              </div>

              {/* Activity Logs */}
              <div>
                <h3 className="font-extrabold text-sm text-white mb-3">Recent Conversion Activity Log</h3>
                <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden max-h-80 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 text-slate-400 uppercase font-bold sticky top-0">
                      <tr>
                        <th className="p-3">Timestamp</th>
                        <th className="p-3">Event</th>
                        <th className="p-3">Rank</th>
                      <th className="p-3">Platform</th>
                        <th className="p-3">Country</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                      {logs.slice(0, 15).map(log => (
                        <tr key={log.id} className="hover:bg-slate-900/40">
                          <td className="p-3 text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                                log.eventType === 'click'
                                  ? 'bg-cyan-500/20 text-cyan-300'
                                  : log.eventType === 'copy'
                                  ? 'bg-amber-500/20 text-amber-300'
                                  : 'bg-purple-500/20 text-purple-300'
                              }`}
                            >
                              {log.eventType}
                            </span>
                          </td>
                          <td className="p-3 text-white font-bold">{log.platformName || '-'}</td>
                          <td className="p-3 text-slate-300">{log.country}</td>
                        </tr>
                      ))}
                      {logs.length === 0 && (
                        <tr>
                          <td colSpan={4} className="p-4 text-center text-slate-500">
                            No conversion logs recorded yet in current session.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {/* TAB 4: SUB-PARTNER APPLICATIONS */}

          

          {activeTab === 'subpartners' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <span>Sub-Partner Agent Sign-Up Requests</span>
                    <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs px-2.5 py-0.5 rounded-full font-bold">
                      {subPartners?.length || 0} Registered Candidates
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Review incoming sub-partner candidates, click to chat directly on WhatsApp, and approve candidates for your master panel.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-extrabold border-b border-slate-800">
                    <tr>
                      <th className="p-3">Candidate & Contact</th>
                      <th className="p-3">Gaming Platform</th>
                      <th className="p-3">Traffic Channel</th>
                      <th className="p-3">Est. Players</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {(subPartners || []).map(sub => {
                      const cleanWhatsapp = sub.whatsapp.replace(/[^0-9]/g, '');
                      const waUrl = `https://wa.me/${cleanWhatsapp}?text=Hello%20${encodeURIComponent(sub.fullName)},%20I%20received%20your%20sub-partner%20application%20for%20${encodeURIComponent(sub.platformName)}!`;

                      return (
                        <tr key={sub.id} className="hover:bg-slate-800/30">
                          <td className="p-3">
                            <span className="font-black text-white text-sm block">{sub.fullName}</span>
                            <span className="text-slate-400 block text-[11px]">{sub.email}</span>
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-emerald-400 hover:underline font-bold text-[11px] mt-0.5"
                            >
                              <MessageCircle className="w-3 h-3 text-emerald-400" />
                              <span>{sub.whatsapp}</span>
                            </a>
                          </td>

                          <td className="p-3 font-bold text-amber-300">
                            {sub.platformName}
                          </td>

                          <td className="p-3 text-slate-300 max-w-xs truncate">
                            {sub.trafficSource}
                          </td>

                          <td className="p-3 font-mono font-bold text-slate-200">
                            {sub.estimatedMonthlyPlayers}
                          </td>

                          <td className="p-3">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase inline-block ${
                                sub.status === 'approved'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                  : sub.status === 'contacted'
                                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              }`}
                            >
                              {sub.status}
                            </span>
                          </td>

                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <a
                                href={waUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold flex items-center gap-1"
                              >
                                <span>WhatsApp</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>

                              {onUpdateSubPartnerStatus && sub.status !== 'approved' && (
                                <button
                                  onClick={() => onUpdateSubPartnerStatus(sub.id, 'approved')}
                                  className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold cursor-pointer"
                                >
                                  Approve
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                    {(!subPartners || subPartners.length === 0) && (
                      <tr>
                        <td colSpan={6} className="p-6 text-center text-slate-500">
                          No sub-partner applications received yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: SEO CONTENT MANAGER */}
          {activeTab === 'seo' && (
            <SeoManagerTab
              platforms={platforms}
              onSavePlatforms={onSavePlatforms}
              token={token}
            />
          )}




          {activeTab === 'seo' && (
            <SeoHealthTab
              platforms={platforms}
              onSavePlatforms={onSavePlatforms}
            />
          )}




          {/* TAB 6: CUSTOM COUPON MANAGER */}
          {activeTab === 'coupons' && (
            <CustomCouponManagerTab
              coupons={config.customCoupons || []}
              onSaveCoupons={(updatedCoupons) => {
                onSaveConfig({
                  ...config,
                  customCoupons: updatedCoupons
                });
              }}
            />
          )}




          {/* TAB 7: FEEDBACK APPROVAL QUEUE */}
          {activeTab === 'feedback' && (
            <FeedbackApprovalTab
              feedbacks={config.approvedFeedbacks || []}
              onUpdateFeedbacks={(updatedFeedbacks) => {
                onSaveConfig({
                  ...config,
                  approvedFeedbacks: updatedFeedbacks
                });
              }}
            />
          )}




          {/* TAB 8: TRACKING PIXEL MANAGER */}
          {activeTab === 'pixels' && (
            <TrackingPixelManagerTab
              config={config}
              platforms={platforms}
              onSaveConfig={onSaveConfig}
              onSavePlatforms={onSavePlatforms}
            />
          )}




          {/* TAB 9: AUTOMATED SITEMAP GENERATOR */}
          {activeTab === 'sitemap' && (
            <SitemapManagerTab
              platforms={platforms}
              customCoupons={config.customCoupons || []}
            />
          )}




          {/* TAB 10: FCM PUSH NOTIFICATION BROADCAST CENTER */}
          {activeTab === 'push' && (
            <PushNotificationManagerTab
              config={config}
              platforms={platforms}
              onSaveConfig={onSaveConfig}
            />
          )}




          {/* TAB 11: A/B TESTING DASHBOARD */}
          {activeTab === 'abtest' && (
            <AbTestDashboardTab
              config={config}
              onSaveConfig={onSaveConfig}
            />
          )}

          {/* TAB: CUSTOM PAGES */}
          
          {activeTab === 'faqs' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h2 className="text-xl font-black text-white">Manage FAQs</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const newFaqs = [...(localConfig.faqs || []), { id: Date.now().toString(), category: 'players' as const, q: '', a: '', badge: '' }];
                      setLocalConfig({ ...localConfig, faqs: newFaqs });
                    }}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm transition-all"
                  >
                    + Add Player FAQ
                  </button>
                  <button
                    onClick={() => {
                      const newFaqs = [...(localConfig.faqs || []), { id: Date.now().toString(), category: 'partners' as const, q: '', a: '', badge: '' }];
                      setLocalConfig({ ...localConfig, faqs: newFaqs });
                    }}
                    className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm transition-all"
                  >
                    + Add Partner FAQ
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {(localConfig.faqs || []).map((faq, idx) => (
                  <div key={faq.id || idx} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className={`text-xs font-bold px-2 py-1 rounded ${faq.category === 'players' ? 'bg-purple-500/20 text-purple-300' : 'bg-cyan-500/20 text-cyan-300'}`}>
                        {faq.category === 'players' ? 'Players FAQ' : 'Partners FAQ'}
                      </span>
                      <button
                        onClick={() => {
                          const newFaqs = [...localConfig.faqs];
                          newFaqs.splice(idx, 1);
                          setLocalConfig({ ...localConfig, faqs: newFaqs });
                        }}
                        className="text-red-400 hover:text-red-300 text-xs font-bold"
                      >
                        Delete
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1">Question</label>
                        <input
                          type="text"
                          value={faq.q}
                          onChange={(e) => {
                            const newFaqs = [...localConfig.faqs];
                            newFaqs[idx].q = e.target.value;
                            setLocalConfig({ ...localConfig, faqs: newFaqs });
                          }}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-bold text-sm"
                          placeholder="e.g. How to claim?"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1">Answer</label>
                        <textarea
                          value={faq.a}
                          onChange={(e) => {
                            const newFaqs = [...localConfig.faqs];
                            newFaqs[idx].a = e.target.value;
                            setLocalConfig({ ...localConfig, faqs: newFaqs });
                          }}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm"
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1">Badge (Optional)</label>
                        <input
                          type="text"
                          value={faq.badge || ''}
                          onChange={(e) => {
                            const newFaqs = [...localConfig.faqs];
                            newFaqs[idx].badge = e.target.value;
                            setLocalConfig({ ...localConfig, faqs: newFaqs });
                          }}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-bold text-sm"
                          placeholder="e.g. Important Rule"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                {(!localConfig.faqs || localConfig.faqs.length === 0) && (
                  <p className="text-slate-500 text-sm italic">No FAQs added yet. Defaults will be shown to users.</p>
                )}
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-800">
                <button
                  onClick={async () => {
                    // Similar to handleSaveConfig
                    try {
                      const res = await fetch('/api/admin/config', {
                        method: 'POST',
                        headers: { 
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ config: localConfig })
                      });
                      if (res.ok) alert('FAQs saved successfully!');
                      else alert('Failed to save FAQs');
                    } catch (e) {
                      console.error(e);
                    }
                  }}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-black hover:scale-105 transition-all shadow-lg shadow-emerald-500/20"
                >
                  Save FAQs
                </button>
              </div>
            </div>
          )}

          {activeTab === 'pages' && (
            <CustomPageManagerTab
              pages={pagesList}
              onSavePages={(newPages) => {
                setPagesList(newPages);
                if (onSaveCustomPages) onSaveCustomPages(newPages);
              }}
            />
          )}

          {/* TAB: AI ARTICLES */}

          {activeTab === 'articles' && (
            <AiArticleManagerTab
              config={config}
              platforms={platforms}
              onSaveConfig={onSaveConfig}
              token={token}
            />
          )}

          {/* TAB: FOOTER MANAGER */}
          {activeTab === 'footer' && (
            <FooterManagerTab
              config={config}
              onSaveConfig={onSaveConfig}
            />
          )}
        </div>
      </div>
    </div>
  );
};


