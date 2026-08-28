import React, { useState, useEffect, lazy, Suspense } from 'react';
import { GamingPlatform, GlobalConfig, AnalyticsStats, TrackLog, UserGeo, SubPartnerApplication } from './types';
import { injectFaqSchemaInHead, injectGoogleSiteVerification, injectSeoTags } from './utils/seo';
import { TopBanner } from './components/TopBanner';
import { HeroSection } from './components/HeroSection';
import { TopThreeCarousel } from './components/TopThreeCarousel';
import { SocialMediaBar } from './components/SocialMediaBar';
import { Sparkles, Users, Mail } from 'lucide-react';
import { TopLoadingBar } from './components/TopLoadingBar';

import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { CustomPage } from './types';


import { AdContainer } from './components/AdContainer';
import { AppSkeleton } from './components/Skeletons';
import { ToastNotification } from './components/ToastNotification';

import { useLanguage } from './i18n/LanguageContext';
import { LazyLoad } from "./components/LazyLoad";
import { ScrollToTop } from './components/ScrollToTop';

import { formatLocalizedBonus } from './utils/currency';
import { initialPlatforms, initialGlobalConfig, initialCustomPages } from './data';

import { Language } from './i18n/translations';

// Code-Splitting with React.lazy for heavy components & modals

const BrandArticlePage = lazy(() => import('./components/BrandArticlePage').then(m => ({ default: m.BrandArticlePage })));
const AiArticleView = lazy(() => import('./components/AiArticleView').then(m => ({ default: m.AiArticleView })));
const WalletArticlePage = lazy(() => import('./components/WalletArticlePage').then(m => ({ default: m.WalletArticlePage })));
const FinancialHubPage = lazy(() => import('./components/FinancialHubPage').then(m => ({ default: m.FinancialHubPage })));
const CustomPageView = lazy(() => import('./components/CustomPageView').then(m => ({ default: m.CustomPageView })));
const ArticlesHubPage = lazy(() => import('./components/ArticlesHubPage').then(m => ({ default: m.ArticlesHubPage })));
const PwaInstallModal = lazy(() => import('./components/PwaInstallModal').then(m => ({ default: m.PwaInstallModal })));
const ReferFriendModal = lazy(() => import('./components/ReferFriendModal').then(m => ({ default: m.ReferFriendModal })));
const OfferGrid = lazy(() => import('./components/OfferGrid').then(m => ({ default: m.OfferGrid })));

const AdminPanel = lazy(() => import('./components/AdminPanel').then(m => ({ default: m.AdminPanel })));
const SeoContentSection = lazy(() => import('./components/SeoContentSection').then(m => ({ default: m.SeoContentSection })));
const ProgrammaticSeoArticles = lazy(() => import('./components/ProgrammaticSeoArticles').then(m => ({ default: m.ProgrammaticSeoArticles })));
const FaqSection = lazy(() => import('./components/FaqSection').then(m => ({ default: m.FaqSection })));
const PaymentGuideSection = lazy(() => import('./components/PaymentGuideSection').then(m => ({ default: m.PaymentGuideSection })));
const CustomCouponsSection = lazy(() => import('./components/CustomCouponsSection').then(m => ({ default: m.CustomCouponsSection })));
const SubPartnerModal = lazy(() => import('./components/SubPartnerModal').then(m => ({ default: m.SubPartnerModal })));
const ClaimWithQrModal = lazy(() => import('./components/ClaimWithQrModal').then(m => ({ default: m.ClaimWithQrModal })));
const TestimonialsSection = lazy(() => import('./components/TestimonialsSection').then(m => ({ default: m.TestimonialsSection })));
const PlatformFeedbackModal = lazy(() => import('./components/PlatformFeedbackModal').then(m => ({ default: m.PlatformFeedbackModal })));
const AdminLoginModal = lazy(() => import('./components/AdminLoginModal').then(m => ({ default: m.AdminLoginModal })));
const ExitIntentModal = lazy(() => import('./components/ExitIntentModal').then(m => ({ default: m.ExitIntentModal })));

export default function App() {
  const { language, setLanguage, t } = useLanguage();
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  
  useEffect(() => {
    const handleLocationChange = () => {
      setIsNavigating(true);
      setTimeout(() => {
        setCurrentPath(window.location.pathname);
        setIsNavigating(false);
      }, 300); // 300ms fake delay for navigation feedback
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const initialData = (typeof window !== 'undefined' && (window as any).__INITIAL_DATA__) || {};
  const [platforms, setPlatforms] = useState<GamingPlatform[]>(initialData.platforms || []);

  const [config, setConfig] = useState<GlobalConfig | null>(initialData.config || null);
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [logs, setLogs] = useState<TrackLog[]>([]);
  const [customPages, setCustomPages] = useState<CustomPage[]>(initialData.customPages || []);
  const [isDemo, setIsDemo] = useState(false);
  const [subPartners, setSubPartners] = useState<SubPartnerApplication[]>([]);
  const [geo, setGeo] = useState<UserGeo>(initialData.geo || {
    country: 'United States',
    countryCode: 'US',
    city: 'Detecting...',
    ip: '127.0.0.1',
    flag: '🇺🇸'
  });

  const [loading, setLoading] = useState(!initialData.config);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    let title = "Bonus Promo Code | 500% Welcome Bonus & Casino Promo Codes 2026";
    let desc = "Get official 500% Welcome Bonus promo codes for top gaming platforms including 1Win, Mostbet, Stake, BC.Game, Pin-Up Casino, Parimatch, and Melbet. Use promo code MAXBOOST500 to claim instant cashback & 200 free spins!";
    let canonical = `https://bonuspromocode.in${currentPath === '/' ? '' : currentPath}`;
    
    // Only inject for these top level routes, dynamic routes handle their own
    if (currentPath === '/') {
      injectSeoTags(title, desc, canonical, 'https://bonuspromocode.in/logos/1win.png');
    }
  }, [currentPath]);


  // Modals
  const [showSubPartnerModal, setShowSubPartnerModal] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [selectedQrPlatform, setSelectedQrPlatform] = useState<GamingPlatform | null>(null);
  const [selectedFeedbackPlatform, setSelectedFeedbackPlatform] = useState<GamingPlatform | null>(null);
  const [showPwaModal, setShowPwaModal] = useState(false);
  const [showReferModal, setShowReferModal] = useState(false);

  // Admin Auth State
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [viewingAdmin, setViewingAdmin] = useState(false);

  // Active Urgency Timer State
  const [activeUrgencyTimer, setActiveUrgencyTimer] = useState<{
    platformName: string;
    promoCode: string;
    slug: string;
    endTime: number;
  } | null>(() => {
    try {
      const saved = sessionStorage.getItem('active_urgency_timer');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.endTime > Date.now()) {
          return parsed;
        }
      }
    } catch {}
    return null;
  });

  // Stealth Hotkey (Ctrl + Shift + A) & URL Query Listener for Secret Admin Access
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        if (adminToken) {
          setViewingAdmin(true);
        } else {
          setShowAdminLogin(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Check URL query ?admin=1
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === '1' || params.get('secret') === 'admin') {
      if (adminToken) {
        setViewingAdmin(true);
      } else {
        setShowAdminLogin(true);
      }
    }

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [adminToken]);

  // Fetch data on load
  const loadData = async () => {
    try {
      const token = adminToken;
      
      // If we have initial data injected and we are not an admin, we can skip the fetch to save a network request!
      if (!token && initialData.config) {
        setLoading(false);
        // We still run localization check from initialData.geo
        if (initialData.geo) {
          const langMap: Record<string, string> = {
            IN: 'hi', BR: 'pt', BD: 'bn', RU: 'ru', ID: 'id', PK: 'ur', TR: 'tr', ES: 'es', MX: 'es'
          };
          const targetLang = langMap[initialData.geo.countryCode];
          if (targetLang) {
            const cookieVal = `/en/${targetLang}`;
            if (!document.cookie.includes(`googtrans=${cookieVal}`) && !sessionStorage.getItem('googtrans_attempted')) {
              sessionStorage.setItem('googtrans_attempted', 'true');
              document.cookie = `googtrans=${cookieVal}; path=/`;
              document.cookie = `googtrans=${cookieVal}; path=/; domain=${window.location.hostname}`;
              setTimeout(() => { window.location.reload(); }, 500);
            }
          }
        }
        return;
      }

      let res;
      let usedAdmin = false;
      if (token) {
        res = await fetch('/api/admin/data', { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) usedAdmin = true;
      }
      if (!res || !res.ok) {
        res = await fetch('/api/data');
      }
      
      if (res.ok) {
        const data = await res.json();
        setPlatforms(data.platforms);
        setConfig(data.config);
        
        if (data.stats) setStats(data.stats);
        if (data.logs) setLogs(data.logs);
        if (data.subPartners) setSubPartners(data.subPartners);
        if (data.customPages) setCustomPages(data.customPages);
        if (data.isDemo !== undefined) setIsDemo(data.isDemo);
        if (data.geo) {
          setGeo(data.geo);
          
          // Auto-localization logic based on geo IP
          const langMap: Record<string, string> = {
            IN: 'hi', // Hindi
            BR: 'pt', // Portuguese
            BD: 'bn', // Bengali
            RU: 'ru', // Russian
            ID: 'id', // Indonesian
            PK: 'ur', // Urdu
            TR: 'tr', // Turkish
            ES: 'es', // Spain
            MX: 'es'  // Mexico
          };
          
          const targetLang = langMap[data.geo.countryCode];
          if (targetLang) {
            const cookieVal = `/en/${targetLang}`;
            // If the translation cookie isn't set, set it and let the script pick it up on reload or immediately
            if (!document.cookie.includes(`googtrans=${cookieVal}`) && !sessionStorage.getItem('googtrans_attempted')) {
              sessionStorage.setItem('googtrans_attempted', 'true');
              document.cookie = `googtrans=${cookieVal}; path=/`;
              document.cookie = `googtrans=${cookieVal}; path=/; domain=${window.location.hostname}`;
              setTimeout(() => {
                window.location.reload();
              }, 500); // Reload so google translate applies the targeted language
            }
          }
        }

        // Record A/B test view impression
        if (data.config?.abTestConfig?.enabled && !sessionStorage.getItem('ab_view_recorded')) {
          sessionStorage.setItem('ab_view_recorded', 'true');
          const design = data.config.abTestConfig.heroDesign;
          const abStats = data.config.abTestConfig.stats || { variantAViews: 0, variantBViews: 0, variantAClicks: 0, variantBClicks: 0 };
          const updatedAb = {
            ...data.config.abTestConfig,
            stats: {
              ...abStats,
              variantAViews: design === 'variant_a' ? abStats.variantAViews + 1 : abStats.variantAViews,
              variantBViews: design === 'variant_b' ? abStats.variantBViews + 1 : abStats.variantBViews
            }
          };
          const updatedConfig = { ...data.config, abTestConfig: updatedAb };
          setConfig(updatedConfig);
          handleSaveConfigFromAdmin(updatedConfig);
        }

        // Inject Google Search Console Verification Meta Tag
        injectGoogleSiteVerification("YOUR_GSC_VERIFICATION_CODE");
        
      }
    } catch (err) {
      console.error('Failed to load initial affiliate data:', err);
      // Removed fallback to prevent showing default data.
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadData();
  }, [adminToken]);

  // Live data polling for Admin
  useEffect(() => {
    let interval: any;
    if (viewingAdmin && adminToken) {
      interval = setInterval(() => {
        fetch('/api/admin/data', { headers: { Authorization: `Bearer ${adminToken}` } })
          .then(res => {
            if (!res.ok) {
              if (res.status === 401 || res.status === 403) return null;
              throw new Error(`HTTP ${res.status}`);
            }
            return res.json();
          })
          .then(data => {
            if (!data) return;
            if (data.stats) setStats(data.stats);
            if (data.logs) setLogs(data.logs);
            if (data.subPartners) setSubPartners(data.subPartners);
          })
          .catch(err => {
            // Non-blocking debug log for transient network blips
            if (err?.name !== 'AbortError') {
              console.debug("Live data polling notice:", err?.message || err);
            }
          });
      }, 7000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [viewingAdmin, adminToken]);


  // Inject dynamic FAQ Schema.org JSON-LD into head for SEO crawlers
  useEffect(() => {
    if (platforms && platforms.length > 0) {
      injectFaqSchemaInHead(platforms);
    }
  }, [platforms]);


  // Handle Event Tracking
  const trackEvent = async (eventType: 'click' | 'copy', platformId?: string) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventType, { platform_id: platformId });
    }
    try {
      await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType, platformId })
      });
    } catch (err) {
      console.error('Tracking error:', err);
    }
  };

  // Submit Sub-Partner Application
  const handleSubmitSubPartner = async (appData: {
    fullName: string;
    email: string;
    whatsapp: string;
    platformId: string;
    platformName: string;
    trafficSource: string;
    estimatedMonthlyPlayers: string;
  }) => {
    try {
      const res = await fetch('/api/sub-partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appData)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.application) {
          setSubPartners(prev => [data.application, ...prev]);
        }
      }
    } catch (err) {
      console.error('Failed to submit sub-partner application:', err);
    }
  };

  // Update Sub-Partner Status from Admin
  const handleUpdateSubPartnerStatus = async (id: string, status: 'approved' | 'contacted' | 'pending') => {
    if (isDemo) { alert("Saving is disabled in Demo Mode"); return; }
    try {
      const res = await fetch(`/api/admin/sub-partners/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setSubPartners(prev => prev.map(s => (s.id === id ? { ...s, status } : s)));
      }
    } catch (err) {
      console.error('Failed to update sub-partner status:', err);
    }
  };

  // Capture Click ID / URL Params on load for S2S Postback Tracking
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const clickId = params.get('click_id') || params.get('utm_source');
    const sub1 = params.get('sub1');
    const sub2 = params.get('sub2');
    
    if (clickId) sessionStorage.setItem('tracker_click_id', clickId);
    if (sub1) sessionStorage.setItem('tracker_sub1', sub1);
    if (sub2) sessionStorage.setItem('tracker_sub2', sub2);
  }, []);

  // Claim click handler -> Activates 10 min urgency timer & redirects to /go/slug
  const handleClaimClick = (p: GamingPlatform) => {
        trackEvent('click', p.id);
    const endTime = Date.now() + 10 * 60 * 1000; // 10 minutes from now
    const timerData = {
      platformName: p.name,
      promoCode: p.promoCode || 'MAXBOOST500',
      slug: p.slug,
      endTime
    };
    setActiveUrgencyTimer(timerData);
    try {
      sessionStorage.setItem('active_urgency_timer', JSON.stringify(timerData));
    } catch {}

    // Append tracked parameters to the outbound cloak link
    const clickId = sessionStorage.getItem('tracker_click_id') || '';
    const sub1 = sessionStorage.getItem('tracker_sub1') || geo.countryCode || '';
    const sub2 = sessionStorage.getItem('tracker_sub2') || 'bonuspromocode_web';
    
    let target = `/go/${p.slug}?sub1=${sub1}&sub2=${sub2}`;
    if (clickId) target += `&click_id=${clickId}`;

    window.open(target, '_blank');
  };

  // Submit Feedback Handler (adds to pending queue for Admin Approval)
  const handleSubmitFeedback = (fb: { platformId: string; platformName: string; userName: string; rating: number; comment: string }) => {
    const newFb = {
      ...fb,
      id: `fb_${Date.now()}`,
      createdAt: new Date().toISOString(),
      isApproved: false
    };

    if (config) {
      const updatedApproved = [...(config.approvedFeedbacks || []), newFb];
      const updatedConfig = { ...config, approvedFeedbacks: updatedApproved };
      setConfig(updatedConfig);
      handleSaveConfigFromAdmin(updatedConfig);
    }
  };

  // Copy code handler
  const handleCopyCode = (p: GamingPlatform) => {
    trackEvent('copy', p.id);
    window.dispatchEvent(new CustomEvent('show-toast', { detail: 'Promo code copied!' }));
  };


  // Admin Login
  const handleAdminLogin = async (passcode: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passcode })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.token) {
          
          setAdminToken(data.token);
          // Refetch with admin token to get stats, logs, etc.
          const adminRes = await fetch('/api/admin/data', { headers: { Authorization: `Bearer ${data.token}` } });
          if (adminRes.ok) {
            const adminData = await adminRes.json();
            if (adminData.stats) setStats(adminData.stats);
            if (adminData.logs) setLogs(adminData.logs);
            if (adminData.subPartners) setSubPartners(adminData.subPartners);
            if (adminData.customPages) setCustomPages(adminData.customPages);
            setIsDemo(adminData.isDemo || false);
            setConfig(adminData.config);
            setPlatforms(adminData.platforms);
          }
          setShowAdminLogin(false);
          setViewingAdmin(true);
          return true;
        }
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  const handleAdminLogout = () => {
    
    setAdminToken(null);
    setViewingAdmin(false);
  };

  // Save Platforms from Admin
  const handleSavePlatformsFromAdmin = async (updated: GamingPlatform[]) => {
    if (isDemo) { alert("Saving is disabled in Demo Mode"); return; }
    setPlatforms(updated);
    if (!adminToken) return;

    try {
      await fetch('/api/admin/platforms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ platforms: updated })
      });
    } catch (err) {
      console.error('Failed to save platforms:', err);
    }
  };

  // Save Config from Admin
  const handleSaveConfigFromAdmin = async (updatedConfig: GlobalConfig) => {
    if (isDemo) { alert("Saving is disabled in Demo Mode"); return; }
    setConfig(updatedConfig);
    if (!adminToken) return;

    try {
      await fetch('/api/admin/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ config: updatedConfig })
      });
    } catch (err) {
      console.error('Failed to save config:', err);
    }
  };

  const handleSaveCustomPagesFromAdmin = async (updatedPages: CustomPage[]) => {
    if (isDemo) { alert("Saving is disabled in Demo Mode"); return; }
    setCustomPages(updatedPages);
    if (!adminToken) return;

    try {
      await fetch('/api/admin/custom-pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ pages: updatedPages })
      });
    } catch (err) {
      console.error('Failed to save custom pages:', err);
    }
  };

  const scrollToOffers = () => {
    const elem = document.getElementById('offers-list');
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading || !config) {
    return <AppSkeleton />;
  }

  // If currently viewing full admin panel
  if (viewingAdmin && adminToken && stats) {
    return (
      <Suspense fallback={<div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4"><div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"></div><p className="text-purple-400 font-bold animate-pulse">Loading Admin Control Center...</p></div>}>
        <AdminPanel
        token={adminToken}
        isDemo={isDemo}
        onLogout={handleAdminLogout}
        platforms={platforms}
        config={config}
        stats={stats}
        logs={logs}
        subPartners={subPartners}
        onSavePlatforms={handleSavePlatformsFromAdmin}
        onSaveConfig={handleSaveConfigFromAdmin}
        onUpdateSubPartnerStatus={handleUpdateSubPartnerStatus}
        customPages={customPages}
        onSaveCustomPages={handleSaveCustomPagesFromAdmin}
      />
      </Suspense>
    );
  }

  // Basic Client-Side Routing for static pages

  
  // Custom Page Routing
  const activePlatforms = platforms.filter(p => p.isActive !== false);

  const customPageMatch = customPages.find(p => currentPath === `/${p.slug}`);
  const articleMatch = config?.articles?.find(a => currentPath === `/blog/${a.slug}`);

  if (articleMatch) {
    return (
      <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-amber-400">Loading Article...</div>}>
        <AiArticleView article={articleMatch} platforms={activePlatforms} customPages={customPages} config={config!} geo={geo} onClaimClick={handleClaimClick} />
      </Suspense>
    );
  }

  if (customPageMatch) {
    return (
      <>
        <ScrollToTop />
      <TopLoadingBar isLoading={isNavigating} />
        <Navbar platforms={activePlatforms} customPages={customPages} geo={geo} onOpenAppModal={() => setShowPwaModal(true)} />
        <Suspense fallback={<div className="min-h-screen pt-24"><AppSkeleton /></div>}><CustomPageView page={customPageMatch} platforms={activePlatforms} customPages={customPages} config={config} /></Suspense>
        <Footer
          platforms={activePlatforms}
          customPages={customPages}
          geo={geo}
          config={config}
          setShowSubPartnerModal={setShowSubPartnerModal}
          setShowReferModal={setShowReferModal} setShowPwaModal={setShowPwaModal}
          setShowAdminLogin={setShowAdminLogin}
          adminToken={adminToken}
          setViewingAdmin={setViewingAdmin}
        />
      </>
    );
  }

  // Dynamic Brand Pages (Programmatic SEO Category 1)
  
  if (currentPath === '/articles') {
    return (
      <>
        <ScrollToTop />
      <TopLoadingBar isLoading={isNavigating} />
        <Suspense fallback={<div className="min-h-screen pt-24"><AppSkeleton /></div>}><ArticlesHubPage customPages={customPages} platforms={activePlatforms} config={config} /></Suspense>
        <Footer
          platforms={activePlatforms}
          customPages={customPages}
          geo={geo}
          config={config}
          setShowSubPartnerModal={setShowSubPartnerModal}
          setShowReferModal={setShowReferModal} setShowPwaModal={setShowPwaModal}
          setShowAdminLogin={setShowAdminLogin}
          adminToken={adminToken}
          setViewingAdmin={setViewingAdmin}
        />
      </>
    );
  }

  
  if (currentPath === '/articles') {
    return (
      <>
        <ScrollToTop />
      <TopLoadingBar isLoading={isNavigating} />
        <Suspense fallback={<div className="min-h-screen pt-24"><AppSkeleton /></div>}><ArticlesHubPage customPages={customPages} platforms={activePlatforms} config={config} /></Suspense>
        <Footer
          platforms={activePlatforms}
          customPages={customPages}
          geo={geo}
          config={config}
          setShowSubPartnerModal={setShowSubPartnerModal}
          setShowReferModal={setShowReferModal} setShowPwaModal={setShowPwaModal}
          setShowAdminLogin={setShowAdminLogin}
          adminToken={adminToken}
          setViewingAdmin={setViewingAdmin}
        />
      </>
    );
  }

  if (currentPath.startsWith('/brands/')) {
    return (
      <>
        <ScrollToTop />
      <TopLoadingBar isLoading={isNavigating} />
        <Navbar platforms={activePlatforms} customPages={customPages} geo={geo} onOpenAppModal={() => setShowPwaModal(true)} />
        <Suspense fallback={<div className="min-h-screen pt-24"><AppSkeleton /></div>}><BrandArticlePage path={currentPath} geo={geo} platforms={activePlatforms} customPages={customPages} config={config} onClaimClick={handleClaimClick} /></Suspense>
        <Footer
          platforms={activePlatforms}
          customPages={customPages}
          geo={geo}
          config={config}
          setShowSubPartnerModal={setShowSubPartnerModal}
          setShowReferModal={setShowReferModal} setShowPwaModal={setShowPwaModal}
          setShowAdminLogin={setShowAdminLogin}
          adminToken={adminToken}
          setViewingAdmin={setViewingAdmin}
        />
      </>
    );
  }

  // Financial Hub Routing (Programmatic SEO Category 3)
  if (currentPath.startsWith('/banking') || currentPath.startsWith('/loans') || currentPath.startsWith('/finance') || currentPath.startsWith('/payments/credit-card')) {
    return (
      <>
        <ScrollToTop />
      <TopLoadingBar isLoading={isNavigating} />
        <Suspense fallback={<div className="min-h-screen pt-24 text-center text-emerald-500">Loading Financial Hub...</div>}><FinancialHubPage path={currentPath} geo={geo} platforms={activePlatforms} customPages={customPages} config={config} /></Suspense>
        <Footer
          platforms={activePlatforms}
          customPages={customPages}
          geo={geo}
          config={config}
          setShowSubPartnerModal={setShowSubPartnerModal}
          setShowReferModal={setShowReferModal} setShowPwaModal={setShowPwaModal}
          setShowAdminLogin={setShowAdminLogin}
          adminToken={adminToken}
          setViewingAdmin={setViewingAdmin}
        />
      </>
    );
  }

  if (currentPath.startsWith('/wallets/') || currentPath.startsWith('/crypto/') || currentPath.startsWith('/payments/')) {
    return (
      <>
        <ScrollToTop />
      <TopLoadingBar isLoading={isNavigating} />
        <Suspense fallback={<div className="min-h-screen pt-24 text-center text-amber-500">Loading Wallet Data...</div>}><WalletArticlePage path={currentPath} geo={geo} platforms={activePlatforms} customPages={customPages} config={config} /></Suspense>
        <Footer
          platforms={activePlatforms}
          customPages={customPages}
          geo={geo}
          config={config}
          setShowSubPartnerModal={setShowSubPartnerModal}
          setShowReferModal={setShowReferModal} setShowPwaModal={setShowPwaModal}
          setShowAdminLogin={setShowAdminLogin}
          adminToken={adminToken}
          setViewingAdmin={setViewingAdmin}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans antialiased selection:bg-amber-400 selection:text-slate-950">
      <ScrollToTop />
      <TopLoadingBar isLoading={isNavigating} />
      {/* Sticky Header Navigation */}
      <header className="sticky top-0 z-[100] flex flex-col bg-slate-950/95 backdrop-blur-md shadow-lg">
        <Navbar platforms={activePlatforms} customPages={customPages} geo={geo} onOpenAppModal={() => setShowPwaModal(true)} />
      </header>

      <div className="flex flex-col border-b border-slate-800 bg-slate-950">
        <TopBanner geo={geo} bannerTemplate={config.topBannerTemplate} activeUrgencyTimer={activeUrgencyTimer} />
        <SocialMediaBar config={config} variant="banner" />
      </div>

      {/* Main Container */}
      <main className="pb-16">
        {/* 2. Hero Section */}
        <HeroSection
          headline={formatLocalizedBonus(config.heroHeadline, language)}
          subheading={formatLocalizedBonus(config.heroSubheading, language)}
          onScrollToOffers={scrollToOffers}
          abTestConfig={config.abTestConfig}
        />

        <AdContainer slotId="hero_banner" />

        {/* 3. Top 3 Featured Carousel / Cards — rendered eagerly (not lazy): this is
             above-the-fold content and is very likely the LCP element, so code-splitting
             it forces an extra fetch+parse round trip before the browser can paint it. */}
        <TopThreeCarousel
          platforms={activePlatforms}
          onClaimClick={handleClaimClick}
          onCopyCode={handleCopyCode}
          onOpenQrModal={(p) => setSelectedQrPlatform(p)}
          onOpenFeedbackModal={(p) => setSelectedFeedbackPlatform(p)}
        />

        {/* Floating Action Launchers */}
        <div className="max-w-7xl mx-auto px-4 my-6 flex flex-wrap items-center justify-center gap-3">

          {config.enableSubPartnerProgram !== false && (
            <button
              onClick={() => setShowSubPartnerModal(true)}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-500 hover:from-cyan-500 hover:to-emerald-400 font-black text-xs sm:text-sm text-white shadow-xl shadow-cyan-600/30 flex items-center gap-2 cursor-pointer transform hover:scale-105 transition-transform"
            >
              <Users className="w-4 h-4 text-cyan-200" />
              <span>{t('hero.subPartner')}</span>
            </button>
          )}
        </div>

        <Suspense fallback={<div className="h-20" />}>
          {/* 4. Standalone Custom Coupons Section */}
          {config.customCoupons && config.customCoupons.length > 0 && (
            <CustomCouponsSection
              coupons={config.customCoupons}
              onClaimCoupon={(c) => {
                trackEvent('click', c.id);
              }}
            />
          )}

          {/* 5. Complete Offers Directory */}
          <LazyLoad rootMargin="600px"><Suspense fallback={<div className="min-h-[400px] flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full"></div></div>}><OfferGrid
            platforms={activePlatforms}
            onClaimClick={handleClaimClick}
            onCopyCode={handleCopyCode}
            onSubPartnerClick={() => setShowSubPartnerModal(true)}
            onOpenQrModal={(p) => setSelectedQrPlatform(p)}
            onOpenFeedbackModal={(p) => setSelectedFeedbackPlatform(p)}
          /></Suspense></LazyLoad>

          {/* 6. SEO Article & Keyword Index Table */}
          
          <LazyLoad rootMargin="600px"><Suspense fallback={<div className="min-h-40" />}>
            <TestimonialsSection feedbacks={config?.approvedFeedbacks || []} />
          </Suspense></LazyLoad>

          <LazyLoad rootMargin="600px"><ProgrammaticSeoArticles
            platforms={activePlatforms}
            geo={geo}
            onClaimClick={handleClaimClick}
          /></LazyLoad>

          {/* Original Table */}
          <LazyLoad rootMargin="600px"><SeoContentSection geo={geo}
            platforms={activePlatforms}
            customCoupons={config.customCoupons || []}
            onClaimClick={handleClaimClick}
          /></LazyLoad>

          {/* 7. FAQ Section */}
          <LazyLoad rootMargin="600px"><PaymentGuideSection geo={geo} /></LazyLoad>

          {/* 7. FAQ Section */}
          <LazyLoad rootMargin="600px"><FaqSection config={config} /></LazyLoad>
        </Suspense>
      </main>

      {/* Footer */}
      <Footer
        platforms={activePlatforms}
        customPages={customPages}
        geo={geo}
        config={config}
        setShowSubPartnerModal={setShowSubPartnerModal}
        setShowReferModal={setShowReferModal} setShowPwaModal={setShowPwaModal}
        setShowAdminLogin={setShowAdminLogin}
        adminToken={adminToken}
        setViewingAdmin={setViewingAdmin}
      />

      {/* Pop-up Modals & Floating Components */}
      <Suspense fallback={null}>

        {showSubPartnerModal && (
          <SubPartnerModal
            platforms={activePlatforms}
            onClose={() => setShowSubPartnerModal(false)}
            onSubmitApplication={handleSubmitSubPartner}
          />
        )}

        {showAdminLogin && (
          <AdminLoginModal
            onLogin={handleAdminLogin}
            onClose={() => setShowAdminLogin(false)}
          />
        )}

        {/* QR Code Continuation Modal */}
        {selectedQrPlatform && (
          <ClaimWithQrModal
            platform={selectedQrPlatform}
            isOpen={!!selectedQrPlatform}
            onClose={() => setSelectedQrPlatform(null)}
            onProceedDesktop={() => {
              const p = selectedQrPlatform;
              setSelectedQrPlatform(null);
              handleClaimClick(p);
            }}
          />
        )}

        {/* Community Feedback & Review Modal */}
        {selectedFeedbackPlatform && (
          <PlatformFeedbackModal
            platform={selectedFeedbackPlatform}
            approvedFeedbacks={config?.approvedFeedbacks?.filter(f => f.isApproved) || []}
            isOpen={!!selectedFeedbackPlatform}
            onClose={() => setSelectedFeedbackPlatform(null)}
            onSubmitFeedback={handleSubmitFeedback}
          />
        )}

        {/* Exit-Intent Popup Modal */}
        {activePlatforms.length > 0 && (
          <ExitIntentModal
            topPlatform={
              (config?.exitIntentConfig?.overridePlatformId && config.exitIntentConfig.overridePlatformId !== 'custom')
                ? (activePlatforms.find(p => p.id === config.exitIntentConfig?.overridePlatformId) || activePlatforms.find(p => p.isFeatured) || activePlatforms[0])
                : (activePlatforms.find(p => p.isFeatured) || activePlatforms[0])
            }
            exitIntentConfig={config?.exitIntentConfig}
            onClaimClick={handleClaimClick}
            onCopyCode={handleCopyCode}
          />
        )}

        {showPwaModal && (
          <Suspense fallback={null}><PwaInstallModal onClose={() => setShowPwaModal(false)} /></Suspense>
        )}

        {showReferModal && (
          <Suspense fallback={null}><ReferFriendModal onClose={() => setShowReferModal(false)} /></Suspense>
        )}
      </Suspense>

      

      <ToastNotification />
    </div>
  );
}
