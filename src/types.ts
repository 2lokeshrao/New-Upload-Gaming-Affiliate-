
export interface FaqItem {
  id: string;
  q: string;
  a: string;
  badge?: string;
  category: 'players' | 'partners';
}
export interface PartnerPanelConfig {
  platformId: string;
  platformName: string;
  apiKey?: string;
  partnerApiUrl?: string;
  affiliateId?: string;
  postbackKey?: string;
  syncEnabled: boolean;
  lastSyncedAt?: string;
  stats: {
    totalRegistrations: number;
    ftdCount: number; // First Time Deposits
    totalDepositsAmount: number; // in USD or INR
    netGamingRevenue: number;
    commissionEarned: number;
    revSharePercent?: number; // e.g. 50%
  };
}

export interface PushNotificationAlert {
  id: string;
  title: string;
  body: string;
  type: 'flash_bonus' | 'new_arrival' | 'custom';
  targetPlatformId?: string;
  targetPlatformName?: string;
  sentAt: string;
  recipientCount: number;
  promoCode?: string;
  actionUrl?: string;
}

export interface AbTestConfig {
  enabled: boolean;
  heroDesign: 'variant_a' | 'variant_b'; // Variant A: Golden Casino, Variant B: Cyber Neon Dark
  buttonColor: 'amber' | 'emerald' | 'purple'; // Amber Gold vs Emerald Green vs Royal Purple
  stats: {
    variantAViews: number;
    variantBViews: number;
    variantAClicks: number;
    variantBClicks: number;
  };
}

export interface TrackingPixelConfig {
  platformId: string;
  facebookPixelId?: string;
  googleAnalyticsId?: string;
  tiktokPixelId?: string;
  customHeaderScript?: string;
}

export interface PlatformFeedback {
  id: string;
  platformId: string;
  platformName: string;
  userName: string;
  userEmail?: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
  isApproved: boolean;
}

export interface GamingPlatform {
  id: string;
  slug: string;
  name: string;
  logoUrl: string;
  rating: number; // e.g. 9.8
  starRating: number; // 1 to 5
  badges: string[];
  bonusText: string;
  promoCode: string;
  rawAffiliateUrl: string;
  masterPartnerUrl?: string; // Sub-partner registration link for master panel
  claimUrl?: string;
  reviewContent?: string; // Custom HTML/Markdown for the brand review page
  isFeatured: boolean;
  featuredRank: number | null; // 1 (Gold), 2 (Silver), 3 (Bronze)
  isActive: boolean;
  clicksCount: number;
  copiesCount: number;
  category: string;
  bonusTitle?: string;
  minDeposit?: string;
  // Independent SEO Fields per platform
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  // Tracking pixels
  trackingPixels?: TrackingPixelConfig;
  averageUserRating?: number;
  totalReviewsCount?: number;
}

export interface CustomCoupon {
  id: string;
  brandName: string;
  title: string;
  code: string;
  description: string;
  targetUrl: string;
  category: string;
  badgeText?: string;
  isActive: boolean;
  expiresAt?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  clicksCount: number;
  copiesCount: number;
}

export interface ExitIntentPopupConfig {
  enabled?: boolean;
  overridePlatformId?: string; // 'custom' or any platform id
  customBrandName?: string;
  customLogoUrl?: string;
  customTitle?: string;
  customBonusText?: string;
  customPromoCode?: string;
  customAffiliateUrl?: string;
  customBadgeText?: string;
  customButtonText?: string;
}

export interface GlobalConfig {
  faqs?: FaqItem[];
  heroHeadline: string;
  heroSubheading: string;
  topBannerTemplate: string;
  exitIntentConfig?: ExitIntentPopupConfig;
  enableSubPartnerProgram: boolean;
  subPartnerHeadline: string;
  // Custom Standalone Coupons
  customCoupons?: CustomCoupon[];
  // Tracking Pixels & Feedback
  globalTrackingPixels?: TrackingPixelConfig;
  approvedFeedbacks?: PlatformFeedback[];
  // FCM Push Notifications & A/B Testing
  pushNotifications?: PushNotificationAlert[];
  abTestConfig?: AbTestConfig;
  partnerPanelConfigs?: PartnerPanelConfig[];
  // Ads
  sidebarAdHtml?: string;
  // Social Media Links
  telegramUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  whatsappGroupUrl?: string;
  youtubeUrl?: string;
  // Security & Admin Stealth Settings
  hideAdminLink?: boolean;
  secretKeyTrigger?: string; // e.g. "Ctrl+Shift+A" or secret keyword
  // Dynamic Footer
  footerColumns?: FooterColumn[];
  copyrightText?: string;
  footerDisclaimerText?: string;
  // AI Articles
  articles?: AIArticle[];
  autoBlogSettings?: {
    enabled: boolean;
    intervalHours: number;
    categories: string[];
    topics: string[];
  };

  // Email Eligibility Checker Settings
}

export interface EmailCheckResult {
  email: string;
  hasExistingAccount: boolean;
  platformName?: string;
  message: string;
  recommendedAction: string;
}

export interface SubPartnerApplication {
  id: string;
  fullName: string;
  email: string;
  whatsapp: string;
  platformId: string;
  platformName: string;
  trafficSource: string;
  estimatedMonthlyPlayers: string;
  status: 'pending' | 'approved' | 'contacted';
  appliedAt: string;
}

export interface AnalyticsStats {
  totalVisits: number;
  totalClicks: number;
  totalPromoCopies: number;
  totalSubPartnerApps: number;
  platformStats: Record<string, { clicks: number; copies: number }>;
  dailyTrends?: { date: string; clicks: number; conversions: number }[];
}

export interface TrackLog {
  id: string;
  platformId?: string;
  platformName?: string;
  eventType: 'visit' | 'click' | 'copy';
  timestamp: string;
  country: string;
  ip: string;
  userAgent: string;
}

export interface WinnerTickerItem {
  id: string;
  userName: string;
  amount: string;
  platformName: string;
  country: string;
  flagEmoji: string;
  timeAgo: string;
}

export interface UserGeo {
  country: string;
  countryCode: string;
  city: string;
  ip: string;
  flag: string;
}

export interface AffiliateLink {
  id: string;
  brandName: string;
  logoUrl?: string;
  title: string;
  description?: string;
  url: string;
  buttonText?: string;
  badgeText?: string;
  rating?: number;
}

export interface CustomPage {
  id: string;
  slug: string;
  title: string;
  content: string;
  isActive: boolean;
  affiliateLinks?: AffiliateLink[];
  metaTitle?: string;
  metaDescription?: string;
  targetKeywords?: string;
  promoCode?: string;
  faqs?: {q: string; a: string}[];
  schemaEnabled?: boolean;
  schemaType?: string;
  schemaRatingValue?: number;
  schemaRatingCount?: number;
  schemaSoftwarePlatform?: string;
}

export interface AIArticle {
  id: string;
  slug: string;
  title: string;
  content: string;
  category: string;
  platformId?: string;
  platformName?: string;
  metaTitle: string;
  metaDescription: string;
  coverImage?: string;
  publishedAt: string;
  author: string;
  tags: string[];
  views: number;
  status?: "draft" | "published";
  affiliateLinks?: AffiliateLink[];
}

export interface FooterLink {
  label: string;
  url: string;
}

export interface FooterColumn {
  id: string;
  title: string;
  links: FooterLink[];
}
