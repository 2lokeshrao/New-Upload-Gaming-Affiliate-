// instrument.ts
import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import "dotenv/config";
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
      nodeProfilingIntegration()
    ],
    tracesSampleRate: 1,
    profilesSampleRate: 1
  });
  console.log("Sentry Node initialized.");
}

// server.ts
import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";
import { GoogleGenAI, Type } from "@google/genai";

// src/data.ts
var initialGlobalConfig = {
  articles: [
    {
      id: "art_crypto_wallet",
      slug: "best-crypto-wallets-gaming",
      title: "Best Crypto Wallets for Online Gaming in 2024",
      content: "## The Rise of Crypto in Gaming\n\nUsing cryptocurrencies for online gaming has become the gold standard. Not only do you get instant deposits and withdrawals, but you also avoid heavy banking fees.\n\n### 1. Binance\nBinance is the world's largest exchange and offers the lowest fees. It's perfect for buying USDT or TRX to use on gaming platforms.\n\n### 2. Bybit\nBybit offers incredible P2P rates and a very user-friendly interface. It's a great alternative if you want quick transactions without hassle.\n\n### 3. Trust Wallet\nFor those who prefer a decentralized approach, Trust Wallet gives you full control of your private keys.\n\nChoose the wallet that fits your style and enjoy seamless gaming!",
      category: "Crypto Wallet",
      metaTitle: "Top Crypto Wallets for Gaming & Fast Withdrawals",
      metaDescription: "Learn about the best crypto wallets like Binance and Bybit to use for seamless and instant online gaming deposits.",
      publishedAt: (/* @__PURE__ */ new Date()).toISOString(),
      author: "Admin",
      tags: ["Crypto", "Wallet", "USDT"],
      views: 1205
    },
    {
      id: "art_card_apply",
      slug: "virtual-credit-cards-gaming",
      title: "How to Apply for Virtual Cards for Gaming",
      content: "## Why Use a Virtual Card?\n\nVirtual cards offer an extra layer of security. If you are depositing on an online platform, a virtual card ensures your main bank account remains untouched.\n\n### Top Providers\n- **Revolut:** Offers single-use virtual cards that destroy themselves after one transaction.\n- **AstroPay:** A highly popular gaming wallet with built-in virtual cards.\n- **Skrill:** Comes with a virtual Mastercard specifically designed for gaming and betting.\n\nAlways ensure you use trusted payment providers when managing your bankroll.",
      category: "Cards & Payments",
      metaTitle: "Best Virtual Credit Cards for Online Gaming",
      metaDescription: "Discover how to apply for and use virtual credit cards to securely deposit funds into your favorite gaming platforms.",
      publishedAt: (/* @__PURE__ */ new Date()).toISOString(),
      author: "Admin",
      tags: ["Virtual Cards", "Payments", "Security"],
      views: 840
    },
    {
      id: "art_loan_apply",
      slug: "instant-gaming-bankroll-loans",
      title: "Getting an Instant Loan for Your Bankroll",
      content: "## Managing Your Bankroll\n\nSometimes you need a quick boost to your bankroll to take advantage of a massive deposit bonus. Instant loans can help, but they must be managed responsibly.\n\n### What to Look For\n- **Low Interest:** Always check the APR.\n- **Fast Approval:** Platforms that use AI to approve your loan within minutes.\n- **Flexible Repayment:** Ensure you can pay back the loan on your own terms.\n\n*Disclaimer: Please gamble responsibly. Never borrow more than you can afford to lose.*",
      category: "Loans",
      metaTitle: "Instant Loans for Bankrolls - Play Responsibly",
      metaDescription: "A guide to responsibly acquiring instant loans to boost your gaming bankroll for high-value deposit matches.",
      publishedAt: (/* @__PURE__ */ new Date()).toISOString(),
      author: "Admin",
      tags: ["Loans", "Bankroll", "Finance"],
      views: 432
    }
  ],
  heroHeadline: "Stop Wasting Money on Unverified Sites. Claim Your 100% Guaranteed Welcome Bonuses",
  heroSubheading: "Verified, licensed platforms with instant withdrawals, high RTP slots, and up to $1,500 + 500% first deposit bonuses.",
  topBannerTemplate: "\u{1F525} Top Verified Gaming Sites available in {{country}} today!",
  enableSubPartnerProgram: true,
  subPartnerHeadline: "Become an Official Gaming Sub-Partner & Earn 45%-50% Lifetime RevShare",
  // Standalone Custom Coupons
  customCoupons: [
    {
      id: "coupon_ipl2026",
      brandName: "Megapari",
      title: "IPL 2026 Cricket Special 100% Free Bet",
      code: "MEGACRICKET500",
      description: "Get 100% risk-free cricket bet up to \u20B910,000 / $150 + 50 free spins on registration.",
      targetUrl: "https://ww.megapari-148049.com",
      category: "Cricket & Sports",
      badgeText: "IPL 2026 SPECIAL",
      isActive: true,
      metaTitle: "Megapari Promo Code MEGACRICKET500 | Free Bet 2026",
      metaDescription: "Claim 100% risk free cricket bet with code MEGACRICKET500 on Megapari.",
      clicksCount: 0,
      copiesCount: 0
    },
    {
      id: "coupon_melbet",
      brandName: "Melbet",
      title: "Melbet Mega Deposit Boost 200%",
      code: "MELVIPMAX",
      description: "Unlock 200% first deposit bonus up to $250 + instant VIP cashback.",
      targetUrl: "https://melbet.com/?tag=VIPPROMO",
      category: "Casino & Slots",
      badgeText: "LIMITED TIME",
      isActive: true,
      metaTitle: "Melbet Promo Code MELVIPMAX | 200% Deposit Bonus",
      metaDescription: "Get official Melbet promo code MELVIPMAX for 200% deposit bonus.",
      clicksCount: 0,
      copiesCount: 0
    }
  ],
  // Tracking Pixels & Feedback
  globalTrackingPixels: {
    platformId: "global",
    facebookPixelId: "123456789012345",
    googleAnalyticsId: "G-MEASUREMENT123"
  },
  approvedFeedbacks: [
    {
      id: "fb_1",
      platformId: "1win",
      platformName: "1Win Casino & Sports",
      userName: "Rahul Sharma",
      rating: 5,
      comment: "The promo code worked perfectly! I got my 500% welcome bonus instantly. The UPI withdrawal was super fast, took only 10 minutes to reach my bank account.",
      createdAt: new Date(Date.now() - 864e5 * 2).toISOString(),
      isApproved: true
    },
    {
      id: "fb_2",
      platformId: "mostbet",
      platformName: "Mostbet Official",
      userName: "Priya Singh",
      rating: 5,
      comment: "Genuine and fast! Used the VIP bonus code while registering and the deposit boost was credited right away. Great odds for cricket matches.",
      createdAt: new Date(Date.now() - 864e5 * 3).toISOString(),
      isApproved: true
    },
    {
      id: "fb_3",
      platformId: "stake",
      platformName: "Stake Crypto Casino",
      userName: "Alex Johnson",
      rating: 5,
      comment: "Best platform for crypto users. No KYC delays and the withdrawal was literally instant to my USDT wallet. Code is 100% legit.",
      createdAt: new Date(Date.now() - 864e5 * 4).toISOString(),
      isApproved: true
    },
    {
      id: "fb_4",
      platformId: "pinup",
      platformName: "Pin-Up Casino",
      userName: "Amit Kumar",
      rating: 4,
      comment: "I love the 250 free spins! It was very easy to apply the promo code and start playing. Customer support is also very helpful on Telegram.",
      createdAt: new Date(Date.now() - 864e5 * 5).toISOString(),
      isApproved: true
    }
  ],
  // Social Media Channels
  telegramUrl: "https://t.me/BonusPromoCodeOfficial",
  instagramUrl: "https://instagram.com/bonuspromocode",
  tiktokUrl: "https://tiktok.com/@bonuspromocode",
  whatsappGroupUrl: "https://chat.whatsapp.com/BonusPromoCodeClub",
  youtubeUrl: "https://youtube.com/@BonusPromoCode",
  // FCM Push Notifications & A/B Testing Defaults
  pushNotifications: [
    {
      id: "pn_101",
      title: "\u{1F525} 500% FLASH BONUS ACTIVATED!",
      body: "Use promo code MAXBOOST500 on 1Win now. Extra 50 Free Spins ends in 1 hour!",
      type: "flash_bonus",
      targetPlatformId: "1win",
      targetPlatformName: "1Win",
      sentAt: "2026-08-10T08:00:00.000Z",
      recipientCount: 1420,
      promoCode: "MAXBOOST500",
      actionUrl: "/go/1win"
    },
    {
      id: "pn_102",
      title: "\u26A1 NEW ARRIVAL: Megapari 200% VIP Pass",
      body: "Exclusive code MEGAPRO200 is now live for instant casino & sports betting.",
      type: "new_arrival",
      targetPlatformId: "megapari",
      targetPlatformName: "Megapari",
      sentAt: "2026-08-09T16:30:00.000Z",
      recipientCount: 980,
      promoCode: "MEGAPRO200",
      actionUrl: "/go/megapari"
    }
  ],
  abTestConfig: {
    enabled: true,
    heroDesign: "variant_a",
    buttonColor: "amber",
    stats: {
      variantAViews: 0,
      variantBViews: 0,
      variantAClicks: 0,
      variantBClicks: 0
    }
  },
  partnerPanelConfigs: [
    {
      platformId: "1win",
      platformName: "1Win Casino & Sports",
      apiKey: "1WIN_AFF_883921_SECRET",
      partnerApiUrl: "https://api.1win-partners.com/v2/stats",
      affiliateId: "1WIN_883921",
      postbackKey: "pb_1win_2026_xyz",
      syncEnabled: true,
      lastSyncedAt: (/* @__PURE__ */ new Date()).toISOString(),
      stats: {
        totalRegistrations: 0,
        ftdCount: 0,
        totalDepositsAmount: 0,
        netGamingRevenue: 0,
        commissionEarned: 0,
        revSharePercent: 45
      }
    },
    {
      platformId: "mostbet",
      platformName: "Mostbet Official",
      apiKey: "MOSTBET_KEY_992014",
      partnerApiUrl: "https://mostbet-partners.com/api/v1/reports",
      affiliateId: "MOST_992014",
      postbackKey: "pb_mostbet_882",
      syncEnabled: true,
      lastSyncedAt: (/* @__PURE__ */ new Date()).toISOString(),
      stats: {
        totalRegistrations: 0,
        ftdCount: 0,
        totalDepositsAmount: 0,
        netGamingRevenue: 0,
        commissionEarned: 0,
        revSharePercent: 45
      }
    },
    {
      platformId: "pinup",
      platformName: "Pin-Up Casino",
      apiKey: "PINUP_SECRET_44210",
      partnerApiUrl: "https://pin-up.partners/api/stats",
      affiliateId: "PINUP_44210",
      postbackKey: "pb_pinup_993",
      syncEnabled: true,
      lastSyncedAt: (/* @__PURE__ */ new Date()).toISOString(),
      stats: {
        totalRegistrations: 0,
        ftdCount: 0,
        totalDepositsAmount: 0,
        netGamingRevenue: 0,
        commissionEarned: 0,
        revSharePercent: 45
      }
    },
    {
      platformId: "1xbet",
      platformName: "1xBet Partners",
      apiKey: "1XBET_API_77391",
      partnerApiUrl: "https://1xbet-partners.com/api/statistics",
      affiliateId: "1X_77391",
      postbackKey: "pb_1x_1029",
      syncEnabled: true,
      lastSyncedAt: (/* @__PURE__ */ new Date()).toISOString(),
      stats: {
        totalRegistrations: 0,
        ftdCount: 0,
        totalDepositsAmount: 0,
        netGamingRevenue: 0,
        commissionEarned: 0,
        revSharePercent: 45
      }
    }
  ],
  // Security & Admin Link Hiding
  hideAdminLink: true,
  secretKeyTrigger: "Ctrl+Shift+A"
};
var initialPlatforms = [
  {
    id: "1win",
    slug: "1win",
    name: "1Win Casino & Sports",
    logoUrl: "data:image/png;base64,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",
    claimUrl: "https://one-vv8838.com/casino/list?open=register&p=lkq7",
    rating: 9.9,
    starRating: 5,
    averageUserRating: 4.8,
    totalReviewsCount: 13968,
    badges: ["Instant UPI/Pix/Crypto", "No KYC Required", "24/7 Live Support", "High RTP Slots"],
    bonusText: "Get 500% Welcome Bonus + 100 Free Spins",
    promoCode: "500TOPUP",
    rawAffiliateUrl: "https://one-vv8838.com/casino/list?open=register&p=lkq7",
    masterPartnerUrl: "https://1win-partner.com/?p=mpsw",
    isFeatured: true,
    featuredRank: 1,
    // Gold
    isActive: true,
    clicksCount: 0,
    copiesCount: 0,
    category: "Casino & Sportsbook",
    metaTitle: "1Win Casino & Sports Promo Code 500TOPUP | Best Bonus 2026",
    metaDescription: "Use verified promo code 500TOPUP for 1Win Casino & Sports to claim your exclusive welcome bonus. Fast sign-up, instant withdrawals, and top rewards.",
    metaKeywords: "1win casino & sports promo code, 1win casino & sports bonus, MAXBOOST500, best 1win casino & sports promo",
    reviewContent: `
      # 1Win Casino & Sports Review 2026
      1Win is an industry-leading online gaming hub offering over 10,000 slots, live casino tables, crash games (Aviator, JetX), and sports betting.
      
      ### Key Highlights
      - **Instant Payouts:** Fast processing via UPI, Pix, USDT, Crypto, and Visa/Mastercard.
      - **Huge Welcome Bonus:** Up to 500% on first 4 deposits.
      - **Anonymity:** Fast 1-click registration without lengthy verification.
    `
  },
  {
    id: "mostbet",
    slug: "mostbet",
    name: "Mostbet Official",
    logoUrl: "data:image/png;base64,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",
    claimUrl: "https://n37ztcmb.com/y0aU",
    rating: 9.7,
    starRating: 5,
    averageUserRating: 4.9,
    totalReviewsCount: 30132,
    badges: ["Fast Deposit Boost", "125% Sports Bonus", "Fast Cashouts", "Licensed Platform"],
    bonusText: "125% Bonus up to $300 + 250 Free Spins",
    promoCode: "MOSTBONUSVVIP",
    rawAffiliateUrl: "https://mostbet.com/signup?partner=VIPGAMES",
    masterPartnerUrl: "http://mbp-aff.com/register/referral/486691",
    isFeatured: true,
    featuredRank: 2,
    // Silver
    isActive: true,
    clicksCount: 0,
    copiesCount: 0,
    category: "Sportsbook & Slots",
    metaTitle: "Mostbet Official Promo Code MOSTBONUSVIP | Best Bonus 2026",
    metaDescription: "Use verified promo code MOSTBONUSVIP for Mostbet Official to claim your exclusive welcome bonus. Fast sign-up, instant withdrawals, and top rewards.",
    metaKeywords: "mostbet official promo code, mostbet official bonus, MOSTBONUSVIP, best mostbet official promo",
    reviewContent: `
      # Mostbet Review
      Mostbet provides incredible sports odds, esports wagering, and top-tier slot provider integrations.
      
      ### Why Choose Mostbet?
      - 24/7 Customer Care
      - Express bet boosts up to 40% extra winnings.
    `
  },
  {
    id: "pinup",
    slug: "pinup",
    name: "Pin-Up Casino",
    logoUrl: "data:image/png;base64,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",
    rating: 9.6,
    starRating: 5,
    averageUserRating: 4.9,
    totalReviewsCount: 46796,
    badges: ["250 Free Spins", "Daily Cashback 10%", "Instant E-Wallets"],
    bonusText: "120% Bonus + 250 Free Spins on 1st Deposit",
    promoCode: "PINUPVIP2026",
    rawAffiliateUrl: "https://pin-up.casino/?promo=PINUPSUPER",
    masterPartnerUrl: "https://1win-partner.com/?p=mpsw",
    isFeatured: true,
    featuredRank: 3,
    // Bronze
    isActive: true,
    clicksCount: 0,
    copiesCount: 0,
    category: "Live Casino & Slots",
    metaTitle: "Pin-Up Casino Promo Code PINUPVIP2026 | Best Bonus 2026",
    metaDescription: "Use verified promo code PINUPVIP2026 for Pin-Up Casino to claim your exclusive welcome bonus. Fast sign-up, instant withdrawals, and top rewards.",
    metaKeywords: "pin-up casino promo code, pin-up casino bonus, PINUPVIP2026, best pin-up casino promo",
    reviewContent: `
      # Pin-Up Casino Review
      Retro themed casino with ultra modern payment methods and fast withdrawals.
    `
  },
  {
    id: "stake",
    slug: "stake",
    name: "Stake Crypto Casino",
    logoUrl: "data:image/png;base64,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",
    rating: 9.5,
    starRating: 5,
    averageUserRating: 4.8,
    totalReviewsCount: 35318,
    badges: ["Zero Fee Withdrawals", "VIP Rakeback", "Instant Crypto"],
    bonusText: "200% Deposit Match + VIP Level Up Boost",
    promoCode: "STAKEPRO2026",
    rawAffiliateUrl: "https://stake.com/?c=VIPPROMO",
    masterPartnerUrl: "https://1win-partner.com/?p=mpsw",
    isFeatured: false,
    featuredRank: null,
    isActive: true,
    clicksCount: 0,
    copiesCount: 0,
    category: "Crypto Gaming",
    metaTitle: "Stake Crypto Casino Promo Code STAKEPRO2026 | Best Bonus 2026",
    metaDescription: "Use verified promo code STAKEPRO2026 for Stake Crypto Casino to claim your exclusive welcome bonus. Fast sign-up, instant withdrawals, and top rewards.",
    metaKeywords: "stake crypto casino promo code, stake crypto casino bonus, STAKEPRO2026, best stake crypto casino promo",
    reviewContent: `
      # Stake.com Official Partner
      The world's biggest crypto casino with provably fair games and instant payouts.
    `
  },
  {
    id: "bcgame",
    slug: "bcgame",
    name: "BC.Game VIP",
    logoUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAAM1BMVEVHcEweISEz7oc07X8eISEeICAx75AdICAdICAdICAdDBohTTcpl1oux3Uld0ow3H4ss2g4Ub7KAAAACnRSTlMA////3pT/VRm78eGNzAAABvVJREFUeJzFW4ti2yAMjCFxEjCY///aYeMHRidbeLRVu7ZLuuk4CSHJ4vEA8vm8X9/ns2smz+f39f58kC4gUXk71blEENfaP++GC6fyfF/Q8LPqE4Sz5f8Q90f5siS8f0P9JAwJv7L8JK8/o38Vaobf1Q8Q/LL+iOCo/3V405jsR5P9raUc/KDwfx/cJiEM3v4IiGwvfIq3+lKU87ZrjmF3g9IBHEHQ92OwrRF8GQN0ZgAAIgTfGsFihA+J/3aECPqhMYDnh4vAyAYzgsYcJAroAcjYIDpjYys8GQKMLxXPn1HcD1DwAq9bsvT0RfW2LYAXcwgQACsDrb0gHgllEOIAzOuPNmiqfwpGMAspAaiVgF43tsEbugBkYEFR7gPzf8fVC5/DFEDSrg5OEH+y1g9R4knR3UPxBVEAAFD717BqN3YI4/a2doO/c1w9IQCDnXD+k7zQdN5F7SqXiKGehucDvmyJbrVimAHYQRfaJ4nvu2oaRAAWCPOXMXIfkvoSgl5p+AEA2zbs1awerH9GEDHosYoFKYDEQFy17jn1Ow01mYMMgNopUOsHXL9efpCnTxUmUNkHy0GyQvxBCkFugnz5kIGdAKW1VuMg2pMQwDEOjJvmDQHUv2OI6uOnEnljDQMqNwSFsHvAJgI7iOOA2r5zTggwTHZox8DBCNgHSgYiBHdBghhAisWVDAhIqImE6sIEq/IDBVFOSaiJhEf982kwvRZX2S8+mW2C3AxnkbHGCY8Q+qlejKnIJN7H3GDnQZdygkAQBzIK1K59DL7bkrGUlsUUIUEgRtCKreqE+cDGwJocD5bGuXhQ+7FXgIEoHILKUJyA8GlHpGHU5VZcOMD/pGIbrixEg554temGEVKgsR/IM6L122V4NdZBBA6WFAIAW+o7+56kNjMDsEE8GW4C2LXHr7JWEYMAUVAXiEZpomMscgRU3MviwOICYv1TiwEgGAEF8rMggqjpkxlPGUBbseY4ruvPGE8pAMV9xWkInfgMAdiN1AbyOFDdHoqOSABQEuUmqG+QUTcATiBmoNYAsxAjjLcZQDsoSTjBZokXyACAfCBwx1+IJyTvHoQC8htSBjgC3JyLcb0z6gXk/xEmJJwGt+RhbPfOXW0DIQPMGei25JhBYAbVBADjgi5LzvFpT9yQrEQGAK3PGHcoDrAnGt0EALKAdUVxAjmIu+QAgOwmGQAUBZ0qBfI03AFA4gBYW7l+BkF5Jt5kgBKA9Mfdak0pxYnUCICB+qemSBgKCboBgOIIMZP/MW0ypcrSuQWAcocFpku1NEsVro0aAhjZPqne+wOoRm1kgs6zLRK1tAk5AhoB6DxqVC4uQF5uEQfILvCYAR3WiGHXT9+CgZ7+hof6QRPANgFAI2HkgJIAjoxGkRAdRoQDetJ1d88Cehyjo9YXDMAmTFmdCAGUQxwj/L+9vlp//KV7CUkJgCkLVytobv20QBQCMAUAZnbC+Iv1k3xEDEAVAKANditw+jtSHgqTUkOGSLjKMHmix2/SpFhaF5hQAmAomDjomQbcJKQ+lgIgQyRsd8L4wK0f9SiExWk5RKJOqtOTriVtEEirYzLF0t8a3ii3AIhDXBxAo0y1o1yoTSVtUJBRprlDXju9QfWLWzRgG/R8j4ARagDUKOQA+HL9sxv8p37ULeZM0B2dYHlGI0dAQxC2AAuAGScTbwW0fo2iGcvAgQK1cRAknmhob4gjgAdQULDN0bjrfj33xAKGc54BuhPXcbJzCKYb8GMr/OzuBIA9rH9/aNifPQk1xjusn3ludgLgsBVVPkmjAvPgxHTWaVKMLATUPDVbhJ6JmyGcJw8Oo/bB0VpoES6OngLowmET5OML8Xh0g+32RsSkfVwrNLB+bvfgWbJtUUP2vK4/wlhQzB2J4NbJKsYA7N7Bs2QZAp+znz89X4uC9OaqfCmMCwyKb2c/r8bqp27IRkFmCqXILItmKDgdYfjigcYcQTfsw3yiAQpdM8Txklws8eNhHyb7Y+XEB6eK+SxuvfFQa0GCGcbcAOwoERghuZph+cjudsTwVhoBWqAg4Gr56abHlRMkBLMdwCagEDYnlIy0veS3i6a5gAsGDl0ypZ3gOdsbD7czYkPfn7vAtn7hINmz8oJVCgoMBXqbKJzUy0bp3swFBx5B5zcIHANaiecZlwsOdXfMpufy3Dhj2oZjkM6Ubvdsqm45JW/kO6WDuILa7zoJgtEBgvXlUPNqAS1KWhfJbnvVXvSbEy8KwclX3xWX/kTR6ACh8ykurBLzNF9VvhZX/uovuy1JUJJ5tL2qdCwuu9277jdnYpN01VcM2l04vHe3Ad47rfaD+4KufN7YC7eFvfn719d+H39+8fnx91e/Zxb+9PJ7ouEXr///A7oonmfeyz1yAAAAAElFTkSuQmCC",
    rating: 9.4,
    starRating: 5,
    averageUserRating: 4.9,
    totalReviewsCount: 12510,
    badges: ["180% First Deposit", "Daily Spin Rewards", "No Limits"],
    bonusText: "Up to 360% Deposit Match across 4 deposits",
    promoCode: "982zzt4b7s",
    rawAffiliateUrl: "https://bc.game/i-982zzt4b7s-n/",
    masterPartnerUrl: "https://1win-partner.com/?p=mpsw",
    isFeatured: false,
    featuredRank: null,
    isActive: true,
    clicksCount: 0,
    copiesCount: 0,
    category: "Crypto & Crash Games",
    metaTitle: "BC.Game VIP Promo Code 982zzt4b7s | Best Bonus 2026",
    metaDescription: "Use verified promo code 982zzt4b7s for BC.Game VIP to claim your exclusive welcome bonus. Fast sign-up, instant withdrawals, and top rewards.",
    metaKeywords: "bc.game vip promo code, bc.game vip bonus, 982zzt4b7s, best bc.game vip promo"
  },
  {
    id: "parimatch",
    slug: "parimatch",
    name: "Parimatch Global",
    logoUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAM1BMVEX4/xMGBgYlJQiOkg5hYwtSVAq7wRDp7xIVFgd/gg3K0BFDRApwcws0NQidog6ssQ/Z4BEcdTJnAAAAkElEQVQ4je2RSRKFIBBDwzyr9z/t7w5Q+i/gymxIwat0AODTi2p2aoSITpeASBP0PJlbbnCJgKUhEB9AXhzKNiL1TVZ3c+FaprKCmC6T+tqU8OyN0WGZHbP510zPOxj12VHhyH4uzGDg0FSvcolw8rrDa5wKhH2bBQ+2vSZLQN7jWEAR71GtLTjFtje+6dPWD1buAx9dWAqbAAAAAElFTkSuQmCC",
    rating: 9.3,
    starRating: 4,
    averageUserRating: 4.9,
    totalReviewsCount: 20403,
    badges: ["Cricket & Football Odds", "UPI / NetBanking", "Official Sponsor"],
    bonusText: "150% Sports Bonus up to $200",
    promoCode: "PARIBONUS",
    rawAffiliateUrl: "https://parimatch.com/?btag=VIP123",
    masterPartnerUrl: "https://1win-partner.com/?p=mpsw",
    isFeatured: false,
    featuredRank: null,
    isActive: true,
    clicksCount: 0,
    copiesCount: 0,
    category: "Sportsbook",
    metaTitle: "Parimatch Global Promo Code PARIBONUS | Best Bonus 2026",
    metaDescription: "Use verified promo code PARIBONUS for Parimatch Global to claim your exclusive welcome bonus. Fast sign-up, instant withdrawals, and top rewards.",
    metaKeywords: "parimatch global promo code, parimatch global bonus, PARIBONUS, best parimatch global promo"
  },
  {
    id: "ggbet",
    slug: "ggbet",
    name: "GG.BET",
    logoUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAAD1BMVEX/SAAAAAClLgDYPQBgGwAlT7LIAAACXklEQVR4nO3Z23LDIAwEUBv4/29u3BlfkFagJZm0D0tn+pJIHEv4Rrb9j8cmgAACCCCAAAIIIIAAAggggAACCCCAAOEnrZVS6nQ0GDiPKxNAK3VLjbYYNwZks1hA4+MQgEizbatxA0Ah0mx1cf4aA6j5r1aycRfcAbg8N6AtxlkAOf/VSnL+EMDmuVrJ9P8YLQCwBaircQGALcBZSTruPnl6AFvIE8AWIALQB3K2ko4rGAALUEtp/Sj336AAw7iGASiNv9v5AeCpOAvwB5JLAzpX5lEA4A8kdxgenp//CfA3k2QZXRwxfwdYzOPi6jwGAlwlkwVwgOz6swBbyfNAjmfDYED4tXLjuAYBUQfiy1OF8BIl9MQOEFYyvs6Wt+AzQOJOW96CW4BrZbQ2DDGEs4ColbNK8vDuNHkfEJ48MWBHgOVWrsKngGhtmKncgXJLYA/nybZyFT4FXJWs2+/b7Os/nGoAj+IaBITXs8cTDZoqBIRxGJC5oxjjeA0+BoR/DGDj5oD+GwTArne8BgEAwi3ArVmfyMyFL8TgacR+pT+0EDB9b6+4cr50qwD3RAxb6QEuzlau/zQGvN4s+lSwleCCa+OGJ8EIcHz5OcxnLQJM4goGfO+1sGEAneisJP1CHQG+tjWxB4DVTR5qc24EYGt5VXJ1W80ByBLcreTkMWB9h3QR7gCUoK7GjQBMpq6SRA3cvaq/5+QFfSvzp4K7ydqd0mwm9zvFhwDZVH7zKPlTiYuDP1jEL/b9zoCNSwS6oH/8q5kAAggggAACCCCAAAIIIIAAAggggAACfGn8AJ5BNfIMMfHtAAAAAElFTkSuQmCC",
    claimUrl: "https://ggbetbestoffer.com/l/6a7c9755e8090b9bb00f4f62",
    rating: 9.6,
    starRating: 5,
    averageUserRating: 4.7,
    totalReviewsCount: 25971,
    badges: ["Esports Focus", "Live Streams", "Fast Crypto Payouts", "High Odds"],
    bonusText: "200% Deposit Bonus + Free Bet",
    promoCode: "GGBONUS200",
    rawAffiliateUrl: "https://gg.bet/en/betting?ref=YOUR_ID",
    masterPartnerUrl: "https://ggbetaff.com/affiliate/register?ref=r5bck",
    isFeatured: false,
    featuredRank: null,
    isActive: true,
    clicksCount: 0,
    copiesCount: 0,
    category: "Esports Betting",
    metaTitle: "GG.BET Promo Code GGBONUS200 | Best Bonus 2026",
    metaDescription: "Use verified promo code GGBONUS200 for GG.BET to claim your exclusive welcome bonus. Fast sign-up, instant withdrawals, and top rewards.",
    metaKeywords: "gg.bet promo code, gg.bet bonus, GGBONUS200, best gg.bet promo"
  },
  {
    id: "betway",
    slug: "betway",
    name: "Betway Esports",
    logoUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAY1BMVEUAAAD////S0tIHBwf6+vpISEjBwcEbGxv39/e7u7uoqKhiYmJQUFA6OjoVFRVWVlbf39/s7OyNjY0sLCwjIyMxMTFdXV1sbGyDg4PIyMi5ubk+Pj7Z2dmcnJx7e3vl5eUPDw+YZYDPAAAArElEQVQ4je2QyxKDIAxFCYkQUUCEqvj+/6+sHV12umkXXXgWmSzOZG6uEDd/RGmuxVWperwRpOyiwLrGHoY8CutS4WrviijsdArc0KRmWSpoFtK8mm3IIUuJYTkFhVyCUtCBd2Qoh9a2M1ewQrwETQbawhfgcYSFYOLWMG6szgwZaNYLUKmZ+g6smrEJgcUA/hQwvi6lY7gjrBb7LjChtmbDj9+rpv6yv5sf8wShFwfz5pZZ5AAAAABJRU5ErkJggg==",
    claimUrl: "https://www.allslotscasino.com/?s=sp53582&a=spadid230923",
    rating: 9.5,
    starRating: 5,
    averageUserRating: 4.8,
    totalReviewsCount: 45239,
    badges: ["Global Brand", "CS:GO Sponsor", "Safe & Legal", "Daily Boosts"],
    bonusText: "100% Match up to \u20B92500 / $30",
    promoCode: "BETWAYVIP",
    rawAffiliateUrl: "https://betway.com/en/sports/cat/esports?ref=YOUR_ID",
    masterPartnerUrl: "https://1win-partner.com/?p=mpsw",
    isFeatured: false,
    featuredRank: null,
    isActive: true,
    clicksCount: 0,
    copiesCount: 0,
    category: "Esports Betting",
    metaTitle: "Betway Esports Promo Code BETWAYVIP | Best Bonus 2026",
    metaDescription: "Use verified promo code BETWAYVIP for Betway Esports to claim your exclusive welcome bonus. Fast sign-up, instant withdrawals, and top rewards.",
    metaKeywords: "betway esports promo code, betway esports bonus, BETWAYVIP, best betway esports promo"
  },
  {
    id: "rivalry",
    slug: "rivalry",
    name: "Rivalry",
    logoUrl: "data:image/png;base64,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",
    rating: 9.4,
    starRating: 5,
    averageUserRating: 4.8,
    totalReviewsCount: 18678,
    badges: ["Made for Gamers", "Instant Withdrawals", "Unique Markets", "Meme Friendly"],
    bonusText: "100% Welcome Bonus up to $100",
    promoCode: "RIVALRY100",
    rawAffiliateUrl: "https://www.rivalry.com/?ref=YOUR_ID",
    masterPartnerUrl: "https://1win-partner.com/?p=mpsw",
    isFeatured: false,
    featuredRank: null,
    isActive: true,
    clicksCount: 0,
    copiesCount: 0,
    category: "Esports Betting",
    metaTitle: "Rivalry Promo Code RIVALRY100 | Best Bonus 2026",
    metaDescription: "Use verified promo code RIVALRY100 for Rivalry to claim your exclusive welcome bonus. Fast sign-up, instant withdrawals, and top rewards.",
    metaKeywords: "rivalry promo code, rivalry bonus, RIVALRY100, best rivalry promo"
  },
  {
    id: "thunderpick",
    slug: "thunderpick",
    name: "Thunderpick",
    logoUrl: "data:image/png;base64,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",
    rating: 9.2,
    starRating: 4,
    averageUserRating: 4.8,
    totalReviewsCount: 45881,
    badges: ["Crypto Exclusive", "VIP Rewards", "Esports Live Betting"],
    bonusText: "100% First Deposit Bonus up to \u20AC500",
    promoCode: "THUNDER500",
    rawAffiliateUrl: "https://thunderpick.io/?ref=YOUR_ID",
    masterPartnerUrl: "https://1win-partner.com/?p=mpsw",
    isFeatured: false,
    featuredRank: null,
    isActive: true,
    clicksCount: 0,
    copiesCount: 0,
    category: "Crypto Esports",
    metaTitle: "Thunderpick Promo Code THUNDER500 | Best Bonus 2026",
    metaDescription: "Use verified promo code THUNDER500 for Thunderpick to claim your exclusive welcome bonus. Fast sign-up, instant withdrawals, and top rewards.",
    metaKeywords: "thunderpick promo code, thunderpick bonus, THUNDER500, best thunderpick promo"
  },
  {
    id: "pinnacle",
    slug: "pinnacle",
    name: "Pinnacle Esports",
    logoUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAAk1BMVEUABBX///7/UwAAAAAAABb4+vlVYWn2TgBrHg/WQADZ3N6VnqMAABMAABFeaXFiHgxnHwuGhomMlZnR09UNGikAAAwAAAZRWWFrdHz6TAAvPUl2gYdkbnZLVV4sMTrs7++9wcOBi5AXIC19f4Kxt7sAABtBSFEfMDwiKzaip6ktN0DHy8wFFCIgDBNbHAxJGA5QGQz6l5+tAAAB1ElEQVR4nO2ZXVeCQBCG2Qas1kUKxI9QF5XUUqv//+tSs1oMdLuY5Zx6n0u4mOfMzO4si+cBAAAAAAAAAPgFKVXTS5Wb+A/tCuJsNJ4ocqFALVFJoGWeEYUOBIJqg72EnM7Ys3BOYIfs9JiTcEFABDGljQoIkc9YDS4LiJy1FS0ERDtk7EQbgaBDzQoIqfiKYCUgYr4UlAT0/P5AXJxYJY9sKSgJyM9JFE5iXeqCEVsKTgSOT1VK/ZJBwTYbqwX2LwamgZxw1aBWIExzQ0Aveq4FPBqZTdDiaoJ6AUXmUhi4F/BIGgLZPxRQZC6DBkpAY+NNA02oSsswcL8My1uh641otxUvzRYUBduZpHoY0SorD6O5m2Gkp/GBpyIpz2PZdTOOa3F1IKlDM57MrQ6lbNugpUDhM34YWAhI1k+jywLJkrEAFgL5M9cmbCWg4y5v/PMCer1gvyM5I6Db/Q1r+X8KBMmRdV7ES3JxRXQyjFT3g41PzBcjNQIUHnFzR1gh4CwuBCAAAQhA4Itw1fmmz3z4qDYwf1Q1EB8AADzPt4Iv/ja6sSDacsX3X4bXFgwjrhz40ZUVdxCAAAQgwCbwemvFG9s0sJtFnNMIAAAAAAAAAP4i79NOJbUM/etIAAAAAElFTkSuQmCC",
    rating: 9.7,
    starRating: 5,
    averageUserRating: 4.9,
    totalReviewsCount: 30356,
    badges: ["Highest Odds", "No Limit Betting", "Sharp Bettors Welcome"],
    bonusText: "Best Esports Odds Guaranteed",
    promoCode: "PINNACLEVIP",
    rawAffiliateUrl: "https://www.pinnacle.com/en/esports/?ref=YOUR_ID",
    masterPartnerUrl: "https://1win-partner.com/?p=mpsw",
    isFeatured: false,
    featuredRank: null,
    isActive: true,
    clicksCount: 0,
    copiesCount: 0,
    category: "Esports Betting",
    metaTitle: "Pinnacle Esports Promo Code PINNACLEVIP | Best Bonus 2026",
    metaDescription: "Use verified promo code PINNACLEVIP for Pinnacle Esports to claim your exclusive welcome bonus. Fast sign-up, instant withdrawals, and top rewards.",
    metaKeywords: "pinnacle esports promo code, pinnacle esports bonus, PINNACLEVIP, best pinnacle esports promo"
  },
  {
    id: "1xbet",
    slug: "1xbet",
    name: "1xBet",
    logoUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAAMFBMVEVHcEwnaqUnaqUnaqUna6UnaqYnaqUnaqX///8CXJ4TY6Gku9S9z+FWiLba5e99ocX8KRjyAAAAB3RSTlMA8Za/I17YBsZ+HQAABFxJREFUeJztW9uCqyAMXEWrYNH//9sjWlskmYCeavZh5223ygwwCRfh5yeDpmnbtq5rY8xjRhXQASw/zg/Nz5r5lfnFpsmVL1G3tYFc5ahM3R6X0dSP/6eO8aiPiKir7gtVT1HVhZU33+feYAqaob6OfpGQoW+vpQ9oFau/QrDCl52P8ED8FzgfgOe/jX6OSN36B6j1/wbig1v8HyOJhRviP8U+H9zPv7fBhekfI+qERoO/6xrdBogHJh3+TxPcHoIbNhfcmwMjVKoWDGh0e2DrA6UYCDCqMRCgbIHVBArj0AetrgdXFyp6cJ2XqKWhgEo5CEIYqAZBCAN1AapRGOLwT0A+D7kY+7+2f+bewk/WWQGuGyJM00AweWfTkp2nz814+sMCnO9jDLbnMA57CXZiH+sn0gR1JhMn/L13oOh+snl+T7vAyAJISbazI1Awvku3QzF/RgApaZyr6dnCAzL8HWdWUQAtaZjLsE9ZAeAfLcthhH0BprEXE/M+zOgD/PN4DAVwnb2UAn04WP6t109HBTAlvaoBSKYT/LMANB9hy1ltlMZmlt9D/nlGwgrgKfotj3H9PMeYY1Xz4ScLAPz9uyKO/NRhfjb8RAEokX2cTHwY+HnVo0TPC0CJZLPA8syYkiB+3P0vAeX8fTyU+YQEtBq2/wYiwEH+Pi4s8uHTQtV5/iMCktaMSQD/lOc/ImDY2WnzoZD+pPA7IyCZzaysQvoRww8LwB5M29NvlWT5xxJ2uQWScp+pgNmHOP3lwg8LeLdAGtcDbVEP0w9RWy5gM5dPA5tMaJenQdIu8h8voFuJPXEWVyeUtPmnywSsLeBJ13KNig3LdVihgKUFvCPDDVOiwP+eoR4XEJiDudIhn1oATtAXlIYBJyA4KG8Bmb/Yh0wXrG8mxRELuAx/qQ+pgIU+ZwE0+xFeKRawEsgWQOG/x8kWWCBboIy/zIdoly4pa2cBnH4SlPiQFyBaQAz/Pc5MSFYBggUO8Jf4kBcgWEBYHDM42wLYArn0A188JABbAKQf3CrsIL4TwC7NgAXg4g9vGeQXJpwAaAGepHNCYqAbYwUCeAugxRcr+YMTAngLZBZ/UIDsQ14AZwGQ/rbihRWd6MOK26IhlipZ/J30Ib9HRGuZX/zBrSvZh5wAxgIg/e0Gm3M+fDAbldQCRYs/YY4iDAmcAGqBwsVfdhOXAbtVmzLx/NRaOB1hHzICBDdFYKPbdWhQgFMTQz9YEAtwQHsvtht4v6AmYL6YuOGZBd57cc7abppIGSgbcZ9s+M9N+c9U+xJs2Qu1/me7PwHqH6/VBagfYNA/wqF6iMX8hmM86geZ1I9yqR9mu/tQd4zH7zjQqH6kU/1Qq/6xXrU4+D1Hu9UPt+u4YHfpSkNAzK9/xUP9kov+NZ+7bUD5b83I7FWvO9uA59e/7qd/4VH/yufP5QNTwdVf7Wu/ixUuicjqyOXrr1/9Noeufr9EaF5+j2R8rv+bK67//wMIJLR8111CRQAAAABJRU5ErkJggg==",
    claimUrl: "https://reffpa.com/L?tag=d_5793442m_1236c_&site=5793442&ad=1236",
    rating: 9.3,
    starRating: 4,
    averageUserRating: 4.8,
    totalReviewsCount: 41354,
    badges: ["Massive Markets", "High Odds", "Fast Local Payments", "Navi Sponsor"],
    bonusText: "130% First Deposit Bonus up to \u20B933000",
    promoCode: "1x_5482230",
    rawAffiliateUrl: "https://reffpa.com/L?tag=d_5793442m_1236c_&site=5793442&ad=1236",
    masterPartnerUrl: "https://1win-partner.com/?p=mpsw",
    isFeatured: false,
    featuredRank: null,
    isActive: true,
    clicksCount: 0,
    copiesCount: 0,
    category: "Sportsbook",
    metaTitle: "1xBet Promo Code 1x_5482230 | Best Bonus 2026",
    metaDescription: "Use verified promo code 1x_5482230 for 1xBet to claim your exclusive welcome bonus. Fast sign-up, instant withdrawals, and top rewards.",
    metaKeywords: "1xbet promo code, 1xbet bonus, 1XBETMAX, best 1xbet promo"
  },
  {
    id: "rajabets",
    slug: "rajabets",
    name: "Rajabets",
    logoUrl: "data:image/jpeg;base64,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",
    claimUrl: "https://record.rajaaffiliates.com/_EK9JxTwjj8IWqcfzuvZcQGNd7ZgqdRLk/1/",
    rating: 9.6,
    starRating: 5,
    averageUserRating: 5,
    totalReviewsCount: 41544,
    badges: ["Instant UPI", "Indian Focus", "Hindi Support", "Cricket Specials"],
    bonusText: "150% Sports Welcome Bonus up to \u20B9100,000",
    promoCode: "RAJABOOST",
    rawAffiliateUrl: "https://rajabets.com/?ref=YOUR_ID",
    masterPartnerUrl: "https://1win-partner.com/?p=mpsw",
    isFeatured: false,
    featuredRank: null,
    isActive: true,
    clicksCount: 0,
    copiesCount: 0,
    category: "Indian Sportsbook",
    metaTitle: "Rajabets Promo Code RAJABOOST | Best Bonus 2026",
    metaDescription: "Use verified promo code RAJABOOST for Rajabets to claim your exclusive welcome bonus. Fast sign-up, instant withdrawals, and top rewards.",
    metaKeywords: "rajabets promo code, rajabets bonus, RAJABOOST, best rajabets promo"
  },
  {
    id: "dafabet",
    slug: "dafabet",
    name: "Dafabet India",
    logoUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACSUlEQVQ4jV3TzWtcZRQG8N+duTOTzCQzNYlJjI011sT6sbJ1owghLqVF0IWg3WkXbQkILgT/A/8IraWICyWC2xJRpIoGrAREiflosDrGNmm+mGSSmevipDF44eVe7nnPc57zPOckU3TjPMaRd/BkBweS/73Rxg1cSTGJ99F5P7FQofwIpR7k2N9ip87OClnrEOQsBpMpZnAakjyDLzH8Kq0dNn5l9y65IsVj8b3yDY3bhyBzKTqISyffYnCChSvUv2J/m2KV8nGKD1Dsjfid79j8HXSk92kPv8bDL3PzPVZnqTzE8CvUniJJKfVGS/VpKiM014JRmqFzkJE3mP+ItVn6TtM/TnWU5c/5ezoYDkwwdonVHylUad4jl6Hn2Who5WuOPUOhRnmIrB10sxatRlRvrlMaCEHzHeSg8iiNeiQ075LvpO955j9kb+s/W8tDdDzI3gb5Mu3mAUCSJ5eGXc0NRt5kdYa1m+F9hkIXYxfDzsZtes9EwRQaf4bShVro0f0EC1dp7ZPPUz3J2OX4/9O71J6Oe1mLNBGiyIULzfWo1v8CtVN0PUb1FJtzzExG74+/zR9fBrM0wfZyeD96geXPWLxKqS+02Jxj8WNWfw7ln3yHVjOKJg5agFufxrSdeD1sW/qE7aWYyEI3x89FbG+dXz5g914AJFP8gOeIgRkYZ+R8ONPepb1HrhSK168HcKN+uFi/pbiGMdSyff66zj/fUjkRwiaFsHZrid07ZNlh8jauJVOxC2fx4tF1bh9Z6+TIORL+Hl/8C/J2zGlqgzNlAAAAAElFTkSuQmCC",
    rating: 9.5,
    starRating: 5,
    averageUserRating: 4.8,
    totalReviewsCount: 18703,
    badges: ["Most Trusted", "Local Bank Transfer", "Exchange Betting"],
    bonusText: "170% First Deposit Bonus up to \u20B917,000",
    promoCode: "DAFA170",
    rawAffiliateUrl: "https://www.dafabet.com/in/?ref=YOUR_ID",
    masterPartnerUrl: "https://1win-partner.com/?p=mpsw",
    isFeatured: false,
    featuredRank: null,
    isActive: true,
    clicksCount: 0,
    copiesCount: 0,
    category: "Sportsbook & Exchange",
    metaTitle: "Dafabet India Promo Code DAFA170 | Best Bonus 2026",
    metaDescription: "Use verified promo code DAFA170 for Dafabet India to claim your exclusive welcome bonus. Fast sign-up, instant withdrawals, and top rewards.",
    metaKeywords: "dafabet india promo code, dafabet india bonus, DAFA170, best dafabet india promo"
  },
  {
    id: "10cric",
    slug: "10cric",
    name: "10CRIC",
    logoUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABUklEQVQ4jaXTPWtVQRDG8d+T3CBIfEmRYKKVlVooWBkwpYWtn0C082vYWinaC4JgI6QQvQi2VhKx0kohREOCb+D7PTkWd4/G5ahFBqbYmd0/88zMskNLkqkq1mCry2MP9pfYO3yCtm1/AZbLxc6uYYjDOI8zOFAAr7CM21jvCE2SdptfSHI6ydMq3nmT5GGSY0lIMqqSV5Ks/OXxdh8mmU+SESZL+VvYwCwm/tO/BpdrAHzFPaziBF5gGkfwoTT0EY7i4KCHPMQtnMXjcp7GrpL/gUVsYrGvzC/l8iHjEb7HG8xjhG9YwBwGfRI+4maRcLJoncB37MY+3MdxnKoBbQHs9edudLlU56u1hBZ38LJHWg18gut9i3Qxybkkq//YgWdJlpIYYMXvmQdvcRdruIQlzJTq1vEAN/Cc8V+YqUr7bNxpmDLu+GwBvC6QpvtMO7af20ZuT1bRBzEAAAAASUVORK5CYII=",
    claimUrl: "https://partners.10cricaffiliates.com/visit/?bta=36032&brand=10cric",
    rating: 9.7,
    starRating: 5,
    averageUserRating: 5,
    totalReviewsCount: 39396,
    badges: ["Made for India", "Fast UPI Withdrawals", "Exclusive Cricket Odds"],
    bonusText: "150% Welcome Bonus up to \u20B930,000",
    promoCode: "10CRICVIP",
    rawAffiliateUrl: "https://www.10cric.com/?ref=YOUR_ID",
    masterPartnerUrl: "https://partners.10cricaffiliates.com/visit/?bta=36032&brand=10cricaffiliatesaffiliates",
    isFeatured: false,
    featuredRank: null,
    isActive: true,
    clicksCount: 0,
    copiesCount: 0,
    category: "Indian Sportsbook",
    metaTitle: "10CRIC Promo Code 10CRICVIP | Best Bonus 2026",
    metaDescription: "Use verified promo code 10CRICVIP for 10CRIC to claim your exclusive welcome bonus. Fast sign-up, instant withdrawals, and top rewards.",
    metaKeywords: "10cric promo code, 10cric bonus, 10CRICVIP, best 10cric promo"
  },
  {
    id: "22bet",
    slug: "22bet",
    name: "22Bet India",
    logoUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAAXVBMVEUANTgLj5sBWmMBVVwCPkIFQUb/SUkEQEUDP0QEQEULjZkLlKADTFIKhZHwRUW5JycGb3kJe4YjP0QDY2vQJyfVR0hAP0NjPkGLRkm0RkjfNzeLLzEhWGBmWmA+U1ktDH7JAAAACnRSTlMI////TP//3qH0e2Ww/AAAB3lJREFUeJztmwt36jYMgElSCjUkJKHkQUv//8+8lmQ7fobYcMjZDtrZ7ta7TZ8eliUZNhsuHx/73e5r+0L52u32Hx8bIVz/fvf1WoCv3V4RgPoX60cCQJD6X6tcQSABxP/F1isAzIOPtewH4QSb1QJAAPvNi8+fKTwTNy/PfwPga7dZUz8QbNZUD/IGeAO8Ad4A0QAt/GHLqwC4qg6l7/sfJX3fdekIiwFQeY8yoN6TEIvhuD1KwX96EkDb9cMwjhcp1fV6/f7+lgyI0bWgtZBCEMWxUDTpAKT+Un1OUnFRDN/wKwCA4pyE/u4sJQeiVIC259ovVfWpEyACMgj9/R9XWSjtRX6u66ZpShD+a1Ofcx/BAgCu3zDehAAvkP7fPLfUlyXLsgOXLGOs5AiFi3AfoO1HsD4giGCoz0l9g8ozKYwTcASX4C5A149B7STX69D98mhP5pN6Ml0XVroE9wBaK/k8PrgMjvlgfWZpF2Eo4gDabgy7n0JwGW6/5/ys6efmO8ZLhsbOxHmAmfyTAKNtfw3qvdrRB3YQ7gAMdxIA7Zfmk/4GzedJ50Uo63MEQHsvAavLaNrPw5/RqQsBNHUEQNdf3JhXWlJcxpvt/4zM96vHg7AcADLA1n9FqQSMrj839BPAwTmKkAQxAPYFQJWXE1SUAJZ+iD/pD3qARQA4BFD0TnD9fCMBJqCm/9zw6iP0YxlkcA+wBwDwGqR7SOkXAj8ctQOQQwIymf7kAJ5wNdwIhn7WxABssQsRZxH049UHHQBwjX9OAsj8A1eUDafDuBh3QpQHlBfgPrpeZfvBmw/4mRMAdIAsAaAf2hECU8cwHgDdAJEYRfeF/Vc3WCWQVwA6//gn2k+NUQFkaadAR+AtESqHlhTa4HbADJyugLqRdhJAU+fHgoqTBsASAbZ6J76F9rMbBiMD+A1kXH9lLZoy6Rv585hCNAs0DJ4MmDyNAVDl+aD/xpMAeuMSMpRABoADlHO0HCifBMDT8qY1gdwB2eSAA2YAAQjn6KF5CgD06bc/RKDDXh4MkRGQBVoB2A5IBGixDiHD3+/vL3pZF37rawBTevI6mFv/qzSADgoTTEjjONw4BXRhTEwA+NezngIagH0I0wB4Fbqo+5EYbrfyJqXmV8CUnuCAcAomAmiNWkWeIG/88LuC10cYxLzngzkpmAQQaNQqMSLxGUFNiFghmZYBjgMSACABP10COaN10njRpBkZ0NgZkLIh6f2TitDfawUai0A5XcZOQ5oC0PknJTmk/vAM0B0ATcqUAWnDqWE+TIreBLhSq9JrPRIVoemKKp2pKBqgDdiv9P+YAYAaoCo0c+fCSIAWzr9/UMFmlQeg0wJgFkFoBNwjEAfQBdJP2m8FQN6D1KB5j2AUAITfmZNQ/adY00AATP2yTc08E1EsgDOkGPajA5wAqDnBdw3HAUBXGlBfyVUZlMDQEWT+E7AYYM58GpZ4w9ppY5o2J8gS5DsBCwFmzadhCbeUZgIUak6ABAwFYAlAFzJ/Ut937bbITQeoOYF5d1NLAdqg+bQiPIkl7fZY2AGgI8j8XcBSADx7gdqP6nFP3Xr0yxMAHeqcA+b3A1h6Q9aT8T1uyW39GAByAG8QuQOSltWo3mO+Zn1HjxVHTwBkBTjAjIJr89hltRrLZ9SLf9UXgIMIALRhfELN5f5+aUtGF58DINVj5iv9x7ywAsCmAIghkQBgob4QwFf5lXoBQAieAMhLkDugnoZEeD6ol+4JPStKde5PlIC4J+AIdgUQuzLUL7cExRG1N+XiPWHrnn558E/f6rEIzqA3AWhNdIAmhB5xSD2DW2kZgK/3qORL0bSr4qFonRJcqgrAJySMO2nHyvCAB+RDEbafJ/FWBE2IJwCYgEwmIFdPG/TD8vHc6wFA+JwgnDZcqwBYAcF+oV22Zg8B6J4QDH0XugPlkmIyPhJgdk8uHaHvyrUSnIkrSCaeJk8CEBjjYOnX2+ASt6TM2lcv3hEtAbjc7AQ4ywoAa+LGtt47ns0UomlJ7Lf/MlhdsL4Nwn1FJp4Mme6BpWs6uaEN26/vys0KIDf2whk6QMSWrBUvxn4/WLtylYASIPM+28G73fItWUsv9oP/WhwHpwJM23Lve4X/9fZuU6r5QX+6MF4rzR7AK/hy63s9XrCub1Uwps2Q9lZwNitQCICsT94PqA8wVJ7XomkOnLXebkWiALZmPsgSdDYTIAQQsj4GgER9kMN5r2sC+unV3v/ZhQQA5YfQe5nf+jzclSctKvHDNBqAOgDMfqK7Y30qAPfDn9aIaRWAudaHYv8IAMgEUNCy3qoAi6x/AIBacToEag6Ltv4BAH0YcmqAPPf3tacDHGcA2GLrnwNgVsHFsX8QIBiCKOsfA5jeBCRAtPWPAGxx4jE9EG39QwBb+uie8gBZP7OLeTqAQBB1IEux/lEA5QXe/ydZ/zgAIhxzPoIkWf8MgC2eyETrnwSAbkj+b/97H2x+A7wB3gBvgP8fwOpfdlv9636rf+Fx1a98fu3363/pdfWv/cIXn1cC0L96veZXv9f/8vu6X///B2Heouyq+ClUAAAAAElFTkSuQmCC",
    claimUrl: "https://welcome.toptrendyinc.com/redirect.aspx?pid=191445&bid=1484&lpid=17",
    rating: 9.4,
    starRating: 4,
    averageUserRating: 4.9,
    totalReviewsCount: 21739,
    badges: ["Huge Markets", "Hindi UI", "Paytm/UPI Accepted"],
    bonusText: "100% Bonus up to \u20B910,000",
    promoCode: "22MAX",
    rawAffiliateUrl: "https://22bet.in/?ref=YOUR_ID",
    masterPartnerUrl: "https://1win-partner.com/?p=mpsw",
    isFeatured: false,
    featuredRank: null,
    isActive: true,
    clicksCount: 0,
    copiesCount: 0,
    category: "Sportsbook & Casino",
    metaTitle: "22Bet India Promo Code 22MAX | Best Bonus 2026",
    metaDescription: "Use verified promo code 22MAX for 22Bet India to claim your exclusive welcome bonus. Fast sign-up, instant withdrawals, and top rewards.",
    metaKeywords: "22bet india promo code, 22bet india bonus, 22MAX, best 22bet india promo"
  },
  {
    id: "melbet",
    slug: "melbet",
    name: "Melbet",
    logoUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAAP1BMVEVHcEz/+ur/wQH/wQL/wQr/wQH/wQT/wQL/xST/wgT//PL//fX/////////wQD/////3oT/yzT/89D/01z/6q6fZ5FLAAAADnRSTlMA/s+LI0ZnswzqU8yWLlFXADEAAASKSURBVHicxVvbgqsgDCwoKtvdCsj/f+sirRYRkHBzzsN56TojCSHB5PEAY5p6MnQjpvz1Aad47AYyTfCHQdH3pBvpywM6DqSvp2IKkm/Aq4gq9EOHr8jNhShM30e8u6WhoISJRL+8aYuOFOInsJc3l6HEKkxjGvsb2RKmLod+XYUhi54k2N4GJsmRoe8SjW+hS7TDUOD138Ap+2Eq9PoatAOboc9y/jOg26GE9x0BMwMpuPwbKEDBUIEfEBKmOvwKka44VKJfFdy3/m/wn2v+Gv63YRHPSwV1+ecZXbhBVX40KzyD/FPx+PMFm9/4DfEXjr8GuJjnawW52Yefns1fIK8j1nIAztBs4vnn5u/rOMDCxGzh17kVstM/N7080Ss4jUDKs3MmkIN+Rk9XdhBvAM7YwiN+5WZXYHw888cfQYt+iVlIvwyH3b8Qi/rFKTmYovn58dlISMnUknz+MSl97/35/fJ+jC0g3gN54OUugeT2GCs76aP5cwQgueyPocetCInB7JrJCWHQ20vQQ2KgHdgi6dlyfAw2lwAYgxZ24Wk2kLTpjzkqPAhzvsRrEO79On6XIDENjBIhmS9Y0D0gZ6UBgYCH/OTrH4o9Mcg/hrmOQEIIhJAQUgXJy2CtdvN+LFcsBPz8ct4PxdKFcDT/lhfUzISD/JsN2ltgj+baBnUyoRCW/TTRNqiUCgb4v9tWZ0aAg7AIpBkq/pq7gHWY/wBP4mx6+yD9rVsO2ljkbOE5AZLBXHDH0aWq9VY+yJ0Viuxr1CMuuLMoxkmTTeBa/HX92ZoZAuOgOnADBYmT3ZdC6gKlg+3CfRdrFfxSB/eXSJ8KYQSUhC/bkkKXRItTB9c5ir+EEOz9O/wAncWOkgCttdmq5ACVHoXSRSQ30RQoIPBUtP+7hDAKpAeE/8VTSpIT/SFVhQlILssMWJkyUEBebXymhwsw8xkwxKk+SxGgw3qCLyDpoE8T8NKXXxANqlrxFUmwbWhABZpIESpQ+Es0YBxwiAjXp+sFUvDkwLBQ7BTxqQtPiy51nL74c1woJVQHk1KyrGL0fzzipNIY692Qx6G7pTQ2QFqlZH4BrQsjCyotb1+cG6BTze9EEcDwO8KyWL/l3uqF5Iby3ATtc28JM4H7W65ovhj0NdmNTkASr6pLAb8/nt1ng62l47bzaPticJcN8P758iYbfFtayvdNxcDsbLolFpmfb2u27vhwaKxqeVm4YTx8ubwhGlrfbpsvAT7yt1+CUwtD441w7mBod2e8gp57OKamJ4Krt7FlZoSdfTztPt/52kubnUm+1s5WRvD3GLc5FXGgx7nFTgh39zZQcNFdXN0RHU1cR1R2xEv+ylthjOitrtnPENfkX09B7JBBLQXxQw51/CDG/jsqKLj2/wNKjrisoFGd/SbKDflo/oSBK1LQDGPS4F2xSSOaOmpVZNQsa9isyLwLfMjqgNyg5Mi/W0pImnI7I3Hmk+KsYcdcCXQcio5AAwdvaVeWfkUfPfm8Dj6XZteYlIZLj6w2+r1pCImoPPxuyiDr+P/umJTiMZX7H5zEx9vpF9NYAAAAAElFTkSuQmCC",
    claimUrl: "https://refpa3665.com/L?tag=d_5958269m_45415c_&site=5958269&ad=45415&r=mainpage",
    rating: 9.3,
    starRating: 4,
    averageUserRating: 4.8,
    totalReviewsCount: 19967,
    badges: ["Fast Registration", "UPI/IMPS", "High Casino RTP"],
    bonusText: "100% Sports Bonus up to \u20B920,000",
    promoCode: "ml_3249162",
    rawAffiliateUrl: "https://melbet.com/en/?ref=YOUR_ID",
    masterPartnerUrl: "https://refpa3665.com/L?tag=d_5958269m_18645c_&site=5958269&ad=18645",
    isFeatured: false,
    featuredRank: null,
    isActive: true,
    clicksCount: 0,
    copiesCount: 0,
    category: "Sportsbook",
    metaTitle: "Melbet Promo Code MELBETINDIA | Best Bonus 2026",
    metaDescription: "Use verified promo code MELBETINDIA for Melbet to claim your exclusive welcome bonus. Fast sign-up, instant withdrawals, and top rewards.",
    metaKeywords: "melbet promo code, melbet bonus, MELBETINDIA, best melbet promo"
  },
  {
    id: "megapari",
    slug: "megapari",
    name: "Megapari",
    logoUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAAh1BMVEUSEhLmNSsbndkXExMXZYkWT2kSGBsSExQTIScTHyUiFRSWKCJbHhtEGhiFJR8SFhgVNUQVOksZhLYajsMVQlYYaI2fKSNfHhvJMCesKyQvFhU3GBbRMinWMinELydKGxh8Ix4XXX0YcZkULzsYeqcVRl0nFRS4LiZnIBymKiMdFBOSJyE+GRcsoOLTAAABxklEQVRoge3W63KCMBAFYDZcVEAEFfGKeKVa3//5Kp3R1pJs/hwynTbnBb5ZNiTHcWxsbGz+ekapv/O8nZ8FnRHZXjxznPY6IcbiJeMMTgS5aGUP/mj9cdu4D9NHGoOJzBBiAlRG0jk+Z8F9MU9lCJGjjIPaEOIAQo4ccsQY7CBCpBCE2UgTD4Ioju8jE4Qx4A0hEP9KqkMQS5nqkCkAOemQEwAxMomRnWhP1wCAGPlPzPzxmrsLdA2buIX584V6T7itYDbSJFC/8SMY4vQNtBUzvUveIHN87TbQhe/pfW/1+6yTVt8kSH0vzz0/BR4qGxubf50wrqLZLKric1eCWyzomfrN7cKI1/SSeQEnwgu1sgixxnLeNu7DrKDGWmYQbZY441rKDaLyCkMilUE0QxlbtUE0BCE1h9QYY8gZRFsI8s4jEQRRHN9H1gjjzBtEiMuSPVuopcQ6JAYghQ5B3MZGJtH8Jph/PtQhkFdF+pR8pUQYTsIjCQRZ8QjodVxwxgVjODcDg7BbwWykiat8tmpgxQsVTaKENq9QOksNbneuZC8Jvg7ffgxT3+BEk2G0eQibCFWFJFkVVZJUBbQD29jY2PzOfADXKhomB4ZA+AAAAABJRU5ErkJggg==",
    claimUrl: "https://ww.megapari-148049.com",
    rating: 9.2,
    starRating: 4,
    averageUserRating: 4.9,
    totalReviewsCount: 21676,
    badges: ["Low Minimum Deposit", "Crypto & INR", "Live Cricket"],
    bonusText: "100% Bonus up to \u20B926,000",
    promoCode: "MEGA26K",
    rawAffiliateUrl: "https://ww.megapari-148049.com",
    masterPartnerUrl: "https://ww.megapari-148049.com",
    isFeatured: false,
    featuredRank: null,
    isActive: true,
    clicksCount: 0,
    copiesCount: 0,
    category: "Sportsbook",
    metaTitle: "Megapari Promo Code MEGA26K | Best Bonus 2026",
    metaDescription: "Use verified promo code MEGA26K for Megapari to claim your exclusive welcome bonus. Fast sign-up, instant withdrawals, and top rewards.",
    metaKeywords: "megapari promo code, megapari bonus, MEGA26K, best megapari promo"
  },
  {
    id: "bet365",
    slug: "bet365",
    name: "Bet365",
    logoUrl: "data:image/png;base64,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",
    rating: 9.9,
    starRating: 5,
    averageUserRating: 4.7,
    totalReviewsCount: 27815,
    badges: ["Global #1", "Most Trusted", "Fully Legal", "Live Streaming"],
    bonusText: "15% in Bet Credits up to \u20B94,000",
    promoCode: "365WIN",
    rawAffiliateUrl: "https://www.bet365.com/?ref=YOUR_ID",
    masterPartnerUrl: "https://1win-partner.com/?p=mpsw",
    isFeatured: true,
    featuredRank: 1,
    isActive: true,
    clicksCount: 0,
    copiesCount: 0,
    category: "Sportsbook",
    metaTitle: "Bet365 Promo Code 365WIN | Best Global Bookmaker",
    metaDescription: "Bet365 is the most trusted global bookmaker. Use promo code 365WIN for best welcome bonuses and live sports streaming.",
    metaKeywords: "bet365, bet365 promo code, bet365 india, legal betting"
  },
  {
    id: "leovegas",
    slug: "leovegas",
    name: "LeoVegas",
    logoUrl: "data:image/png;base64,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",
    rating: 9.8,
    starRating: 5,
    averageUserRating: 4.9,
    totalReviewsCount: 35224,
    badges: ["King of Casino", "MGA License", "Award Winning App"],
    bonusText: "100% up to \u20B980,000 + 200 Free Spins",
    promoCode: "LEOVIP",
    rawAffiliateUrl: "https://www.leovegas.com/?ref=YOUR_ID",
    masterPartnerUrl: "https://1win-partner.com/?p=mpsw",
    isFeatured: false,
    featuredRank: null,
    isActive: true,
    clicksCount: 0,
    copiesCount: 0,
    category: "Legal Casino & Sports",
    metaTitle: "LeoVegas Promo Code LEOVIP | King of Casino",
    metaDescription: "Join LeoVegas, the award-winning online casino. Claim up to \u20B980,000 in welcome bonuses with our exclusive LEOVIP code.",
    metaKeywords: "leovegas, leovegas promo code, legal casino india"
  },
  {
    id: "888sport",
    slug: "888sport",
    name: "888sport",
    logoUrl: "data:image/png;base64,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",
    rating: 9.6,
    starRating: 5,
    averageUserRating: 4.7,
    totalReviewsCount: 36094,
    badges: ["UKGC Licensed", "Established 1997", "Daily Boosts"],
    bonusText: "Bet \u20AC10 Get \u20AC30 in Free Bets",
    promoCode: "888MAX",
    rawAffiliateUrl: "https://www.888sport.com/?ref=YOUR_ID",
    masterPartnerUrl: "https://1win-partner.com/?p=mpsw",
    isFeatured: false,
    featuredRank: null,
    isActive: true,
    clicksCount: 0,
    copiesCount: 0,
    category: "Regulated Sportsbook",
    metaTitle: "888sport Promo Code 888MAX | Free Bets 2026",
    metaDescription: "Bet securely with 888sport, a fully licensed UKGC operator. Use code 888MAX for an exclusive bet \u20AC10 get \u20AC30 offer.",
    metaKeywords: "888sport, 888sport promo, trusted sportsbook"
  },
  {
    id: "unibet",
    slug: "unibet",
    name: "Unibet",
    logoUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAB/klEQVRoge2YMU7DMBSGf6dq1IEh7CDlBrCUoSzuDehQBFtv0JWt5QSEE8DcDj0CqYSgsLQ3aCTE3A4MhbYxQ6hUoRLb7Us84E/yEr/n9/7YiZ8N6CMk7TjFlyv4a+HoOijgZTDmn2QhIFesANNYAaaxAkxjBZjGCjCNFWAaK8A0VoBp/uWJbCrpTzsTp/WpjE3CEOmH8gkAf4OfD2As8R3qJrPNDPQl/R6AByQ3ECv4zzNf4jvaIh9tOORXI+uzMdGw53kIAORLYZs2zit5ADjLQEAjTwEA0CNIetXucs4dQPKxUiylMXLeO9bxsZuIIeR/plwIoJ98AINvfhM+gHuk/zYnSBKX7cjKMKqBfsGRJLl6w1Mkm9QIOZULFosimXwDvMe9z8VHw2GFIwAQcdx3i4UwrA0i6ljkAirdkxaEaG+OxtpP9ddryngFysFOu+UbCFylmPDD8wO8dd9lJbkyZDNQ6ZQbUKxpHFaoPtYHIUVcsjMxY2iq2gosW2RxKQbhvWPva16c6Pi4xfl+WBvtvKmRzMBsVtKvabbx2YC5e6HSjKSkIBEwuBxE0KpxWESxfADKGRDiVtk0Zsq2MsgEuO4iAFgkt2TR88VLQBWXTEBYG03jpVNNF8Eid+lUqWICGdVClU65wRiaQiQHF8YQilj0XXcvCGsh6XngG9bxDe4LufjJAAAAAElFTkSuQmCC",
    rating: 9.7,
    starRating: 5,
    averageUserRating: 4.9,
    totalReviewsCount: 33707,
    badges: ["Kindred Group", "Award Winning", "Safe Betting"],
    bonusText: "Money Back as Bonus up to \u20AC40",
    promoCode: "UNIVIP",
    rawAffiliateUrl: "https://www.unibet.com/?ref=YOUR_ID",
    masterPartnerUrl: "https://1win-partner.com/?p=mpsw",
    isFeatured: false,
    featuredRank: null,
    isActive: true,
    clicksCount: 0,
    copiesCount: 0,
    category: "Global Sportsbook",
    metaTitle: "Unibet Promo Code UNIVIP | Trusted Betting 2026",
    metaDescription: "Unibet offers a secure, legal betting environment with incredible odds. Claim your money back bonus today.",
    metaKeywords: "unibet, unibet bonus, legal betting sites"
  }
];
var initialCustomPages = [
  {
    id: "page_privacy",
    slug: "privacy-policy",
    title: "Privacy Policy",
    content: `# Privacy Policy

Last Updated: 2026

## 1. Introduction
Welcome to BonusPromoCode.in. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.

## 2. Information We Collect
We may collect information about you in a variety of ways, including:
- **Personal Data:** We may collect your email address if you voluntarily submit it to us through forms or email checkers on our site.
- **Derivative Data:** Information our servers automatically collect when you access the site, such as your IP address, browser type, operating system, and access times.

## 3. Use of Your Information
Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. We may use information collected about you via the Site to:
- Deliver targeted advertising, coupons, newsletters, and other information regarding promotions.
- Monitor and analyze usage and trends to improve your experience with the Site.
- Compile anonymous statistical data and analysis for use internally or with third parties.

## 4. Third-Party Websites
The Site may contain links to third-party websites and applications of interest, including advertisements and external services, that are not affiliated with us. Once you have used these links to leave the Site, any information you provide to these third parties is not covered by this Privacy Policy.

## 5. Cookies and Tracking Technologies
We may use cookies, web beacons, tracking pixels, and other tracking technologies on the Site to help customize the Site and improve your experience. When you access the Site, your personal information is not collected through the use of tracking technology.
`,
    isActive: true
  },
  {
    id: "page_terms",
    slug: "terms",
    title: "Terms & Conditions",
    content: `# Terms & Conditions

Last Updated: 2026

## 1. Agreement to Terms
These Terms of Use constitute a legally binding agreement made between you and BonusPromoCode.in concerning your access to and use of the website.

## 2. Nature of the Website
BonusPromoCode.in is an independent affiliate promotional portal. We provide reviews, bonus codes, and informational content regarding third-party gaming and sports platforms. We are not an operator of gaming or gambling services.

**Important:** Users must be 18 years of age or older to use any services linked from this website. Please gamble responsibly.

## 3. Third-Party Links & Offers
The Site contains links to other websites ("Third-Party Websites") as well as articles, photographs, text, graphics, pictures, designs, video, information, and applications originating from third parties. Such Third-Party Websites and Third-Party Content are not investigated, monitored, or checked for accuracy, appropriateness, or completeness by us.

We are not responsible for any promotions, deposits, withdrawals, or issues you may face on third-party platforms. Any disputes must be handled directly with the respective platform operator.

## 4. Disclaimer
The information provided on the site is for general informational purposes only. We make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site.
`,
    isActive: true
  }
];

// server.ts
import rateLimit from "express-rate-limit";
import compression from "compression";
import mysql from "mysql2/promise";
import fs from "fs";
import * as Sentry2 from "@sentry/node";
import winston from "winston";
import sharp from "sharp";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console()
  ]
});
async function generateWithRetry(ai, params, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await ai.models.generateContent(params);
    } catch (e) {
      if ((e.status === 503 || e.status === 429) && i < retries - 1) {
        logger.warn(`AI API ${e.status} error, retrying in ${2 * (i + 1)}s...`);
        await new Promise((r) => setTimeout(r, 2e3 * (i + 1)));
      } else {
        throw e;
      }
    }
  }
}
var app = express();
app.set("trust proxy", 1);
app.use(compression({
  level: 6,
  threshold: 1024,
  filter: (req, res) => {
    if (req.headers["x-no-compression"]) return false;
    return compression.filter(req, res);
  }
}));
app.disable("x-powered-by");
var PORT = process.env.PORT || 3e3;
var JWT_SECRET = process.env.JWT_SECRET || "affiliate_default_secure_jwt_secret_2026_key";
var ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || "admin123456";
if (!process.env.JWT_SECRET || !process.env.ADMIN_PASSCODE) {
  logger.warn("WARNING: JWT_SECRET or ADMIN_PASSCODE environment variables not provided. Using secure default fallbacks.");
}
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});
var generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1e3,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false
});
app.use(generalLimiter);
var statePlatforms = [...initialPlatforms];
var stateConfig = { ...initialGlobalConfig };
var stateSubPartners = [];
var stateCustomPages = [];
var stateStats = { totalVisits: 0, totalClicks: 0, totalPromoCopies: 0, totalSubPartnerApps: 0, platformStats: {} };
var stateTrackLogs = [];
var DATA_FILE = path.join(process.cwd(), "app_data.json");
var mysqlPool = null;
var mysqlConnectionFailed = false;
async function getMysqlPool() {
  if (mysqlPool) return mysqlPool;
  if (mysqlConnectionFailed) return null;
  if (!process.env.DB_HOST || !process.env.DB_USER) return null;
  try {
    const tempPool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "u123456789_gamingdb",
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    await tempPool.query(`
      CREATE TABLE IF NOT EXISTS mysql_state_store (
        id INT NOT NULL DEFAULT 1,
        state_json LONGTEXT NOT NULL,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    mysqlPool = tempPool;
    return mysqlPool;
  } catch (err) {
    mysqlConnectionFailed = true;
    return null;
  }
}
async function readDataFile() {
  const db = { platforms: {}, settings: { globalConfig: {} }, custom_pages: {}, sub_partners: {} };
  try {
    const pool = await getMysqlPool();
    if (!pool) throw new Error("No MySQL Pool");
    const [jsonRows] = await pool.query("SELECT state_json FROM mysql_state_store WHERE id = 1");
    if (jsonRows && jsonRows.length > 0) {
      const fullJson = JSON.parse(jsonRows[0].state_json);
      if (fullJson.settings) db.settings = fullJson.settings;
      if (fullJson.platforms) db.platforms = fullJson.platforms;
      if (fullJson.custom_pages) db.custom_pages = fullJson.custom_pages;
      if (fullJson.sub_partners) db.sub_partners = fullJson.sub_partners;
    } else {
      throw new Error("No state_json found in mysql_state_store");
    }
  } catch (e) {
    try {
      let fileToRead = DATA_FILE;
      if (!fs.existsSync(fileToRead) && fs.existsSync("/tmp/app_data.json")) {
        fileToRead = "/tmp/app_data.json";
      }
      if (fs.existsSync(fileToRead)) {
        const fileContent = fs.readFileSync(fileToRead, "utf-8");
        const parsed = JSON.parse(fileContent);
        if (parsed.platforms) db.platforms = parsed.platforms;
        if (parsed.settings) db.settings = parsed.settings;
        if (parsed.custom_pages) db.custom_pages = parsed.custom_pages;
        if (parsed.sub_partners) db.sub_partners = parsed.sub_partners;
        logger.info("Loaded data from " + DATA_FILE);
      }
    } catch (fsErr) {
      logger.error("Error reading local data file", fsErr);
    }
  }
  if (Object.keys(db.platforms).length === 0) {
    db.platforms = {};
    for (const p of initialPlatforms) db.platforms[p.id] = p;
    db.settings.globalConfig = initialGlobalConfig;
    for (const c of initialCustomPages) db.custom_pages[c.slug] = c;
    await writeDataFile(db);
  }
  return db;
}
async function writeDataFile(data) {
  try {
    await fs.promises.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    try {
      DATA_FILE = "/tmp/app_data.json";
      await fs.promises.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
    } catch (err2) {
      logger.error("Error writing data file", err2);
    }
  }
  try {
    const pool = await getMysqlPool();
    if (pool) {
      const stateString = JSON.stringify(data);
      await pool.query(
        "INSERT INTO mysql_state_store (id, state_json) VALUES (1, ?) ON DUPLICATE KEY UPDATE state_json = ?",
        [stateString, stateString]
      );
      logger.info("Successfully persisted state to MySQL database.");
    }
  } catch (mysqlErr) {
    logger.error("Error persisting state to MySQL:", mysqlErr);
  }
}
async function setDoc(collection, docId, data) {
  const db = await readDataFile();
  if (!db[collection]) db[collection] = {};
  db[collection][docId] = data;
  await writeDataFile(db);
}
async function getCollection(collection) {
  const db = await readDataFile();
  if (!db[collection]) return [];
  return Object.values(db[collection]);
}
async function getDoc(collection, docId) {
  const db = await readDataFile();
  if (!db[collection]) return null;
  return db[collection][docId] || null;
}
async function saveState() {
  try {
    const db = await readDataFile();
    if (Array.isArray(statePlatforms)) {
      db.platforms = {};
      for (const p of statePlatforms) {
        db.platforms[p.id] = p;
      }
    }
    if (stateConfig) {
      db.settings = db.settings || {};
      db.settings["globalConfig"] = stateConfig;
    }
    if (Array.isArray(stateCustomPages)) {
      db.custom_pages = {};
      for (const cp of stateCustomPages) {
        db.custom_pages[cp.slug] = cp;
      }
    }
    if (Array.isArray(stateSubPartners)) {
      db.sub_partners = {};
      for (const sp of stateSubPartners) {
        db.sub_partners[sp.id] = sp;
      }
    }
    await writeDataFile(db);
    logger.info("Successfully synced all in-memory state to JSON database.");
  } catch (e) {
    logger.error("saveState error:", e);
  }
}
async function loadState() {
  try {
    const pSnap = await getCollection("platforms");
    if (pSnap.length > 0) {
      statePlatforms = pSnap;
    } else {
      logger.info("Database empty: Seeding initial platforms...");
      for (const p of initialPlatforms) {
        await setDoc("platforms", p.id, p);
      }
      statePlatforms = [...initialPlatforms];
    }
    const cSnap = await getDoc("settings", "globalConfig");
    if (cSnap) {
      stateConfig = cSnap;
    } else {
      logger.info("Database empty: Seeding initial global config...");
      await setDoc("settings", "globalConfig", initialGlobalConfig);
      stateConfig = { ...initialGlobalConfig };
    }
    const spSnap = await getCollection("sub_partners");
    if (spSnap.length > 0) stateSubPartners = spSnap;
    const cpSnap = await getCollection("custom_pages");
    stateCustomPages = cpSnap;
    for (const initCp of initialCustomPages) {
      if (!stateCustomPages.find((cp) => cp.slug === initCp.slug)) {
        logger.info(`Database missing custom page ${initCp.slug}: Seeding...`);
        await setDoc("custom_pages", initCp.slug, initCp);
        stateCustomPages.push(initCp);
      }
    }
    logger.info("Loaded state from MySQL Collections.");
  } catch (e) {
    logger.error("Load state error:", e);
  }
}
loadState();
app.get("/api/cdn/images/:platformId.webp", async (req, res) => {
  const platform = statePlatforms.find((p) => p.id === req.params.platformId);
  if (!platform || !platform.logoUrl) {
    return res.status(404).json({ error: "Image not found" });
  }
  try {
    let buffer;
    if (platform.logoUrl.startsWith("data:image/")) {
      const base64Data = platform.logoUrl.split(",")[1];
      buffer = Buffer.from(base64Data, "base64");
    } else {
      const response = await fetch(platform.logoUrl);
      if (!response.ok) throw new Error("Failed to fetch external image");
      const arrayBuffer = await response.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    }
    const webpBuffer = await sharp(buffer).resize({ width: 128, withoutEnlargement: true }).webp({ quality: 80 }).toBuffer();
    res.setHeader("Content-Type", "image/webp");
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    res.send(webpBuffer);
  } catch (e) {
    logger.error("Image optimization error:", e);
    res.redirect(platform.logoUrl);
  }
});
app.post("/api/sentry-webhook", async (req, res) => {
  try {
    if (req.header("Sentry-Hook-Resource") === "installation" || req.body?.action === "ping" || !req.body?.data?.event) {
      return res.status(200).send("ok");
    }
    const event = req.body.data.event;
    const errorTitle = event.title || "Unknown Error";
    const exception = event.exception?.values?.[0] || {};
    const stacktrace = exception.stacktrace?.frames || [];
    const tags = event.tags || [];
    logger.info(`Received Sentry webhook for error: ${errorTitle}`);
    if (process.env.GEMINI_API_KEY) {
      try {
        const ai = new GoogleGenAI({
          apiKey: process.env.GEMINI_API_KEY,
          httpOptions: {
            headers: { "User-Agent": "aistudio-build" }
          }
        });
        const systemPrompt = `You are an expert software engineer analyzing a Sentry error report.
Determine the root cause, suggest a code fix (diff/patch), and categorize the severity (Critical, Warning, Info).
Error Title: ${errorTitle}
Exception Type: ${exception.type || "N/A"}
Exception Value: ${exception.value || "N/A"}
Stack Trace: ${JSON.stringify(stacktrace.slice(-5))}
Tags: ${JSON.stringify(tags)}

Format your response exactly as JSON:
{
  "severity": "Critical|Warning|Info",
  "rootCause": "Short explanation",
  "suggestedFix": "Code patch or action"
}`;
        const response = await generateWithRetry(ai, {
          model: "gemini-3.7-flash",
          contents: systemPrompt,
          config: {
            responseMimeType: "application/json"
          }
        });
        const result = response.text;
        if (result) {
          logger.info(`Sentry Error Analysis for [${errorTitle}]:`, JSON.parse(result));
        }
      } catch (aiError) {
        logger.error("Error analyzing Sentry event with Gemini:", aiError);
      }
    } else {
      logger.warn("GEMINI_API_KEY not configured. Skipping AI analysis for Sentry error.");
    }
    res.status(200).send("ok");
  } catch (error) {
    logger.error("Error processing Sentry webhook:", error);
    res.status(200).send("ok");
  }
});
function getGeoFromRequest(req) {
  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress || "127.0.0.1";
  const countryHeader = req.headers["cf-ipcountry"] || req.headers["x-appengine-country"];
  if (countryHeader && countryHeader !== "XX") {
    return {
      country: countryHeader === "IN" ? "India" : countryHeader === "US" ? "United States" : countryHeader === "BR" ? "Brazil" : countryHeader,
      countryCode: countryHeader,
      city: "Detected City",
      ip,
      flag: countryHeader === "IN" ? "\u{1F1EE}\u{1F1F3}" : countryHeader === "US" ? "\u{1F1FA}\u{1F1F8}" : countryHeader === "BR" ? "\u{1F1E7}\u{1F1F7}" : "\u{1F310}"
    };
  }
  return {
    country: "United States",
    countryCode: "US",
    city: "Global Region",
    ip: ip === "::1" ? "127.0.0.1" : ip,
    flag: "\u{1F1FA}\u{1F1F8}"
  };
}
var BOT_USER_AGENTS = /googlebot|bingbot|yandex|baiduspider|facebookexternalhit|twitterbot|rogerbot|linkedinbot|embedly|quora link preview|showyoubot|outbrain|pinterest\/0\.|pinterestbot|slackbot|vkShare|W3C_Validator|AdsBot-Google|Mediapartners-Google|Lighthouse/i;
function verifyJwtToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: Missing token" });
  }
  const token = authHeader.split(" ")[1];
  const data = { statePlatforms, stateConfig, stateSubPartners };
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
var loginAttemptTracker = {};
var adminLoginRateLimiter = (req, res, next) => {
  const clientIp = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress || "127.0.0.1";
  const now = Date.now();
  const windowMs = 15 * 60 * 1e3;
  const maxAttempts = 5;
  if (!loginAttemptTracker[clientIp]) {
    loginAttemptTracker[clientIp] = { attempts: [], lockUntil: 0 };
  }
  const record = loginAttemptTracker[clientIp];
  if (record.lockUntil > now) {
    const remainingSeconds = Math.ceil((record.lockUntil - now) / 1e3);
    res.setHeader("Retry-After", remainingSeconds);
    res.setHeader("X-RateLimit-Limit", maxAttempts);
    res.setHeader("X-RateLimit-Remaining", 0);
    return res.status(429).json({
      success: false,
      message: `\u{1F512} BRUTE-FORCE LOCKOUT: Too many failed admin login attempts from IP ${clientIp}. Access blocked for ${remainingSeconds} seconds.`
    });
  }
  record.attempts = record.attempts.filter((timestamp) => now - timestamp < windowMs);
  if (record.attempts.length >= maxAttempts) {
    record.lockUntil = now + 15 * 60 * 1e3;
    res.setHeader("Retry-After", 900);
    return res.status(429).json({
      success: false,
      message: `\u{1F512} RATE LIMIT EXCEEDED: 5 failed attempts reached from IP ${clientIp}. Blocked for 15 minutes.`
    });
  }
  res.setHeader("X-RateLimit-Limit", maxAttempts);
  res.setHeader("X-RateLimit-Remaining", maxAttempts - record.attempts.length);
  next();
};
var handleAdminLogin = (req, res) => {
  const clientIp = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress || "127.0.0.1";
  const record = loginAttemptTracker[clientIp] || { attempts: [], lockUntil: 0 };
  const { password } = req.body;
  if (password === ADMIN_PASSCODE) {
    loginAttemptTracker[clientIp] = { attempts: [], lockUntil: 0 };
    const token = jwt.sign({ role: "admin", authAt: Date.now() }, JWT_SECRET, { expiresIn: "8h" });
    return res.json({ success: true, token });
  } else {
    record.attempts.push(Date.now());
    if (record.attempts.length >= 5) {
      record.lockUntil = Date.now() + 15 * 60 * 1e3;
    }
    loginAttemptTracker[clientIp] = record;
    setTimeout(() => {
      const remaining = 5 - record.attempts.length;
      return res.status(401).json({
        success: false,
        message: record.attempts.length >= 5 ? "\u{1F512} Account locked for 15 minutes due to 5 failed password attempts." : `Invalid passcode! Security Warning: ${remaining} attempt(s) remaining before IP lockout.`
      });
    }, 500);
  }
};
app.post("/api/auth/login", adminLoginRateLimiter, handleAdminLogin);
app.post("/api/admin/login", adminLoginRateLimiter, handleAdminLogin);
app.get("/api/postback/:platform", async (req, res) => {
  const secret = req.query.secret || req.query.key;
  const platform = statePlatforms.find((p) => p.id === req.params.platform || p.slug === req.params.platform);
  if (!platform || !secret || secret !== platform.postbackKey) {
    return res.status(403).send("Forbidden");
  }
  const reqPlatform = req.params.platform;
  const { click_id, event, player, sum, currency, ...otherParams } = req.query;
  const postbackData = {
    platform: reqPlatform,
    click_id: click_id || null,
    event: event || "unknown",
    player_id: player || null,
    sum: sum ? parseFloat(sum) : 0,
    currency: currency || null,
    rawQuery: req.query,
    receivedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  const data = { statePlatforms, stateConfig, stateSubPartners };
  try {
    await setDoc("s2s_postbacks", Date.now().toString(), postbackData);
    logger.info(`Saved S2S postback for ${reqPlatform} to MySQL.`);
    stateTrackLogs.unshift({
      id: `pb_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      eventType: "visit",
      platformId: platform.id,
      platformName: platform.name,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      country: "S2S",
      ip: "Server",
      userAgent: "S2S Webhook"
    });
    if (stateTrackLogs.length > 100) stateTrackLogs.pop();
    res.status(200).send("OK");
  } catch (error) {
    logger.error("Error saving postback:", error);
    res.status(500).send("Error");
  }
});
app.get("/api/image-optimize", async (req, res) => {
  const url = req.query.url;
  if (!url || typeof url !== "string") {
    return res.status(400).send("URL required");
  }
  const width = parseInt(req.query.w) || 400;
  const quality = parseInt(req.query.q) || 75;
  try {
    const fetchRes = await fetch(url);
    if (!fetchRes.ok) throw new Error("Failed to fetch image");
    const arrayBuffer = await fetchRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const optimized = await sharp(buffer).resize({ width, withoutEnlargement: true }).webp({ quality }).toBuffer();
    res.set("Content-Type", "image/webp");
    res.set("Cache-Control", "public, max-age=31536000, immutable");
    res.send(optimized);
  } catch (error) {
    res.redirect(url);
  }
});
app.get("/api/data", (req, res) => {
  stateStats.totalVisits += 1;
  const geo = getGeoFromRequest(req);
  const safePlatforms = statePlatforms.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    logoUrl: p.logoUrl,
    rating: p.rating,
    starRating: p.starRating,
    badges: p.badges,
    bonusText: p.bonusText,
    promoCode: p.promoCode,
    isFeatured: p.isFeatured,
    featuredRank: p.featuredRank,
    isActive: p.isActive,
    category: p.category
  }));
  const safeConfig = {
    heroHeadline: stateConfig.heroHeadline,
    heroSubheading: stateConfig.heroSubheading,
    topBannerTemplate: stateConfig.topBannerTemplate,
    enableSubPartnerProgram: stateConfig.enableSubPartnerProgram,
    subPartnerHeadline: stateConfig.subPartnerHeadline,
    customCoupons: stateConfig.customCoupons,
    approvedFeedbacks: stateConfig.approvedFeedbacks,
    pushNotifications: stateConfig.pushNotifications,
    abTestConfig: stateConfig.abTestConfig,
    sidebarAdHtml: stateConfig.sidebarAdHtml,
    telegramUrl: stateConfig.telegramUrl,
    instagramUrl: stateConfig.instagramUrl,
    tiktokUrl: stateConfig.tiktokUrl,
    whatsappGroupUrl: stateConfig.whatsappGroupUrl,
    youtubeUrl: stateConfig.youtubeUrl,
    articles: stateConfig.articles,
    footerColumns: stateConfig.footerColumns,
    copyrightText: stateConfig.copyrightText,
    footerDisclaimerText: stateConfig.footerDisclaimerText,
    autoBlogSettings: stateConfig.autoBlogSettings
  };
  res.json({
    platforms: safePlatforms,
    config: safeConfig,
    customPages: stateCustomPages,
    geo
  });
});
app.get("/api/admin/data", verifyJwtToken, (req, res) => {
  const geo = getGeoFromRequest(req);
  res.json({
    platforms: statePlatforms,
    config: stateConfig,
    stats: stateStats,
    logs: stateTrackLogs,
    subPartners: stateSubPartners,
    customPages: stateCustomPages,
    geo
  });
});
app.post("/api/sub-partners", (req, res) => {
  const { fullName, email, whatsapp, platformId, platformName, trafficSource, estimatedMonthlyPlayers } = req.body;
  if (!fullName || !email || !whatsapp) {
    return res.status(400).json({ error: "Name, email, and WhatsApp number are required" });
  }
  const newApp = {
    id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
    fullName,
    email,
    whatsapp,
    platformId: platformId || "1win",
    platformName: platformName || "1Win Casino",
    trafficSource: trafficSource || "Social Media",
    estimatedMonthlyPlayers: estimatedMonthlyPlayers || "50-100 Players",
    status: "pending",
    appliedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  stateSubPartners.unshift(newApp);
  stateStats.totalSubPartnerApps = (stateStats.totalSubPartnerApps || 0) + 1;
  res.json({ success: true, application: newApp });
});
app.patch("/api/admin/sub-partners/:id", verifyJwtToken, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const appItem = stateSubPartners.find((s) => s.id === id);
  if (!appItem) {
    return res.status(404).json({ error: "Sub-partner application not found" });
  }
  if (status) {
    appItem.status = status;
    saveState();
  }
  res.json({ success: true, application: appItem });
});
app.post("/api/admin/platforms", verifyJwtToken, (req, res) => {
  const { platforms } = req.body;
  if (Array.isArray(platforms)) {
    statePlatforms = platforms;
    saveState();
    return res.json({ success: true, platforms: statePlatforms });
  }
  return res.status(400).json({ error: "Invalid platform data array" });
});
app.post("/api/admin/custom-pages", verifyJwtToken, express.json(), (req, res) => {
  const { pages } = req.body;
  if (Array.isArray(pages)) {
    stateCustomPages = pages;
    saveState();
  }
  res.json({ success: true });
});
app.post("/api/admin/config", verifyJwtToken, (req, res) => {
  const { config } = req.body;
  if (config) {
    stateConfig = { ...stateConfig, ...config };
    saveState();
    return res.json({ success: true, config: stateConfig });
  }
  return res.status(400).json({ error: "Invalid config payload" });
});
app.post("/api/track", (req, res) => {
  const { eventType, platformId } = req.body;
  const geo = getGeoFromRequest(req);
  const platform = statePlatforms.find((p) => p.id === platformId);
  if (eventType === "click") {
    stateStats.totalClicks += 1;
    if (platform) platform.clicksCount = (platform.clicksCount || 0) + 1;
  } else if (eventType === "copy") {
    stateStats.totalPromoCopies += 1;
    if (platform) platform.copiesCount = (platform.copiesCount || 0) + 1;
  }
  const logEntry = {
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
    eventType,
    platformId,
    platformName: platform ? platform.name : "Wheel Spin",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    country: geo.country,
    ip: geo.ip,
    userAgent: req.headers["user-agent"] || "Unknown"
  };
  stateTrackLogs.unshift(logEntry);
  if (stateTrackLogs.length > 100) stateTrackLogs.pop();
  res.json({ success: true });
});
app.get("/go/:slug", (req, res) => {
  const { slug } = req.params;
  const userAgent = req.headers["user-agent"] || "";
  const isBot = BOT_USER_AGENTS.test(userAgent);
  const clickId = req.query.click_id || req.query.utm_source || "";
  const sub1 = req.query.sub1 || "";
  const sub2 = req.query.sub2 || "";
  const platform = statePlatforms.find((p) => p.slug === slug || p.id === slug);
  if (!platform) {
    return res.redirect("/");
  }
  let targetUrl = platform.rawAffiliateUrl;
  if (clickId || sub1 || sub2) {
    const urlObj = new URL(targetUrl);
    if (clickId) urlObj.searchParams.set("click_id", clickId);
    if (sub1) urlObj.searchParams.set("sub1", sub1);
    if (sub2) urlObj.searchParams.set("sub2", sub2);
    targetUrl = urlObj.toString();
  }
  platform.clicksCount = (platform.clicksCount || 0) + 1;
  stateStats.totalClicks += 1;
  const fbPixelId = platform.trackingPixels?.facebookPixelId || stateConfig.globalTrackingPixels?.facebookPixelId;
  const gaPixelId = platform.trackingPixels?.googleAnalyticsId || stateConfig.globalTrackingPixels?.googleAnalyticsId;
  const customScript = stateConfig.globalTrackingPixels?.customHeaderScript || "";
  const pixelScriptHeader = `
    ${fbPixelId ? `
      <script>
        !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
        n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
        document,'script','https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${fbPixelId}');
        fbq('track', 'Lead');
      </script>
    ` : ""}
    ${gaPixelId ? `
      <script async src="https://www.googletagmanager.com/gtag/js?id=${gaPixelId}"></script>
      <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${gaPixelId}');
        gtag('event', 'conversion', {'send_to': '${gaPixelId}'});
      </script>
    ` : ""}
    ${customScript ? customScript : ""}
  `;
  return res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Activating 500% Bonus - ${platform.name}</title>
      ${pixelScriptHeader}
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-slate-950 text-white font-sans min-h-screen flex items-center justify-center p-4">
      <div id="cardBox" class="max-w-md w-full bg-slate-900 border-2 border-emerald-500/70 rounded-3xl p-6 shadow-2xl text-center space-y-5 relative overflow-hidden transition-all duration-500">
        
        <!-- Glow accent -->
        <div id="glowAccent" class="absolute -top-12 -left-12 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none transition-all duration-500"></div>
        <div class="absolute -bottom-12 -right-12 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl pointer-events-none"></div>

        <!-- Header badge -->
        <div id="timerBadge" class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-xs font-black uppercase tracking-wider transition-all">
          <span>\u{1F7E2} 10-MINUTE REGISTRATION TIMER ACTIVATED</span>
        </div>

        <!-- Logo & Title -->
        <div class="flex flex-col items-center gap-2">
          <img src="${platform.logoUrl}" alt="${platform.name}" class="w-16 h-16 rounded-2xl border-2 border-amber-500/60 shadow-lg object-cover" />
          <h1 class="text-2xl font-black text-white">${platform.name} Welcome Bonus</h1>
          <p class="text-xs text-slate-300">Your 500% Deposit Bonus & 200 Free Spins are reserved for the next 10 minutes.</p>
        </div>

        <!-- 10 Minute Urgency Timer Box -->
        <div id="timerBox" class="bg-slate-950 border-2 border-emerald-500/50 rounded-2xl p-4 space-y-1 transition-all duration-500">
          <span id="timerLabel" class="text-[10px] uppercase font-black text-emerald-400 tracking-widest block">RESERVED BONUS COUNTDOWN</span>
          <div id="timer" class="font-mono text-4xl font-black text-emerald-300 tracking-wider">10:00</div>
          <span className="text-[11px] text-slate-400 block">Complete registration before timer expires to guarantee bonus</span>
        </div>

        <!-- Promo Code Box -->
        <div class="bg-purple-950/60 border border-purple-500/40 rounded-xl p-3 flex items-center justify-between">
          <div class="text-left">
            <span class="text-[9px] uppercase font-bold text-purple-300 block">REQUIRED PROMO CODE</span>
            <span class="font-mono font-black text-amber-300 text-base tracking-wider">${platform.promoCode || "MAXBOOST500"}</span>
          </div>
          <button onclick="copyCode()" id="copyBtn" class="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-400 transition-colors">
            COPY CODE
          </button>
        </div>

        <!-- CTA Direct Button -->
        <a id="redirectLink" href="${targetUrl}" class="block w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm uppercase tracking-wide shadow-xl shadow-amber-500/20 transform active:scale-95 transition-all">
          PROCEED TO OFFICIAL REGISTRATION NOW (<span id="count">2</span>s)
        </a>

        <p class="text-[11px] text-slate-500">18+ Only \u2022 Safe Encrypted Redirect to Official Registration Page</p>
      </div>

      <script>
        // Copy Code Functionality
        function copyCode() {
          navigator.clipboard.writeText('${platform.promoCode || "MAXBOOST500"}');
          const btn = document.getElementById('copyBtn');
          btn.innerText = 'COPIED! \u2705';
          btn.classList.add('bg-emerald-400', 'text-slate-950');
        }

        // 10 Minute Urgency Timer Counter with Dynamic Visual Color Shift & Pulse Animation
        let totalSeconds = 600;
        const timerElem = document.getElementById('timer');
        const timerBox = document.getElementById('timerBox');
        const timerLabel = document.getElementById('timerLabel');
        const cardBox = document.getElementById('cardBox');
        const timerBadge = document.getElementById('timerBadge');

        setInterval(() => {
          if (totalSeconds > 0) {
            totalSeconds--;
            const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
            const s = (totalSeconds % 60).toString().padStart(2, '0');
            timerElem.innerText = m + ':' + s;

            // Phase 1: 10m to 6m (> 360s) -> Emerald Green
            if (totalSeconds > 360) {
              // Default Green
            } 
            // Phase 2: 6m to 3m (180s - 360s) -> Amber Yellow Pulse
            else if (totalSeconds <= 360 && totalSeconds > 180) {
              cardBox.className = "max-w-md w-full bg-slate-900 border-2 border-amber-500/80 rounded-3xl p-6 shadow-2xl text-center space-y-5 relative overflow-hidden transition-all duration-500";
              timerBox.className = "bg-amber-950/80 border-2 border-amber-500 rounded-2xl p-4 space-y-1 animate-pulse transition-all duration-500";
              timerElem.className = "font-mono text-4xl font-black text-amber-300 tracking-wider";
              timerLabel.className = "text-[10px] uppercase font-black text-amber-400 tracking-widest block";
              timerLabel.innerText = "\u26A0\uFE0F OFFER EXPIRING SOON - REGISTER NOW";
              timerBadge.className = "inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-950 border border-amber-500/60 text-amber-300 text-xs font-black uppercase tracking-wider";
              timerBadge.innerText = "\u26A0\uFE0F OFFER EXPIRING SOON";
            } 
            // Phase 3: < 3m (0s - 180s) -> Crimson Red Urgent Rapid Pulse / Bounce
            else if (totalSeconds <= 180) {
              cardBox.className = "max-w-md w-full bg-slate-900 border-4 border-red-500 rounded-3xl p-6 shadow-2xl shadow-red-900/50 text-center space-y-5 relative overflow-hidden transition-all duration-500";
              timerBox.className = "bg-red-950 border-4 border-red-500 rounded-2xl p-4 space-y-1 animate-bounce transition-all duration-500";
              timerElem.className = "font-mono text-4xl font-black text-red-400 tracking-wider";
              timerLabel.className = "text-[10px] uppercase font-black text-red-300 tracking-widest block animate-pulse";
              timerLabel.innerText = "\u{1F6A8} CRITICAL WARNING - EXPIRING IN MINUTES!";
              timerBadge.className = "inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-red-950 border border-red-500 text-red-400 text-xs font-black uppercase tracking-wider animate-pulse";
              timerBadge.innerText = "\u{1F6A8} CRITICAL WARNING";
            }
          }
        }, 1000);

        // Auto Redirect Countdown
        let redirectSeconds = 2;
        const countElem = document.getElementById('count');
        const interval = setInterval(() => {
          redirectSeconds--;
          if (countElem) countElem.innerText = redirectSeconds;
          if (redirectSeconds <= 0) {
            clearInterval(interval);
            window.location.href = "${targetUrl}";
          }
        }, 1000);
      </script>
    </body>
    </html>
  `);
});
app.get("/robots.txt", (req, res) => {
  res.type("text/plain");
  res.send(`User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin
Disallow: /go/
Disallow: /api/admin/

Sitemap: https://bonuspromocode.in/sitemap.xml
`);
});
function injectSitemapRoute(app2) {
  app2.get("/sitemap.xml", (req, res) => {
    const host = `https://${req.get("host")}`;
    const now = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;
    xml += `  <url>
`;
    xml += `    <loc>${host}/</loc>
`;
    xml += `    <lastmod>${now}</lastmod>
`;
    xml += `    <changefreq>daily</changefreq>
`;
    xml += `    <priority>1.0</priority>
`;
    xml += `  </url>
`;
    statePlatforms.filter((p) => p.isActive).forEach((p) => {
      xml += `  <url>
`;
      xml += `    <loc>${host}/review/${p.slug}</loc>
`;
      xml += `    <lastmod>${now}</lastmod>
`;
      xml += `    <changefreq>weekly</changefreq>
`;
      xml += `    <priority>0.8</priority>
`;
      xml += `  </url>
`;
    });
    if (stateConfig.customCoupons) {
      stateConfig.customCoupons.filter((c) => c.isActive).forEach((c) => {
        xml += `  <url>
`;
        xml += `    <loc>${host}/coupon/${c.id}</loc>
`;
        xml += `    <lastmod>${now}</lastmod>
`;
        xml += `    <changefreq>daily</changefreq>
`;
        xml += `    <priority>0.85</priority>
`;
        xml += `  </url>
`;
      });
    }
    xml += `</urlset>`;
    res.header("Content-Type", "application/xml");
    res.send(xml);
  });
}
injectSitemapRoute(app);
app.post("/api/generate-seo", verifyJwtToken, async (req, res) => {
  const data = { statePlatforms, stateConfig, stateSubPartners };
  try {
    const { platformName, existingDescription } = req.body;
    if (!platformName) {
      return res.status(400).json({ error: "platformName is required" });
    }
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
    }
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
    const prompt = `You are an expert iGaming SEO copywriter. Generate SEO metadata (title, description, keywords) and exactly 2 FAQ entries for the gaming platform "${platformName}". Make the content sound professional, trustworthy, and engaging for affiliates and players. Focus on bonuses, withdrawals, and reliability. IMPORTANT: Keep the title strictly under 60 characters and the description strictly under 160 characters to comply with Google SEO guidelines.${existingDescription ? " Here is existing info to build on: " + existingDescription : ""}`;
    const response = await generateWithRetry(ai, {
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: "SEO optimized title strictly under 60 characters."
            },
            description: {
              type: Type.STRING,
              description: "SEO optimized description strictly under 160 characters."
            },
            keywords: {
              type: Type.STRING,
              description: "Comma separated list of 4-6 target keywords."
            },
            faqs: {
              type: Type.ARRAY,
              description: "Exactly 2 FAQ items about the platform.",
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  answer: { type: Type.STRING }
                },
                required: ["question", "answer"]
              }
            }
          },
          required: ["title", "description", "keywords", "faqs"]
        }
      }
    });
    const output = JSON.parse(response.text || "{}");
    res.json({ success: true, data: output });
  } catch (error) {
    logger.error("Error generating SEO content with Gemini:", error);
    res.status(500).json({ error: error.message || "Failed to generate SEO content" });
  }
});
app.post("/api/generate-article", verifyJwtToken, async (req, res) => {
  const data = { statePlatforms, stateConfig, stateSubPartners };
  try {
    const { topic, category, platformName, platformId } = req.body;
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not set on the server." });
    }
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const prompt = `You are an expert SEO content writer and copywriter for a gaming/finance affiliate website. 
    Write a comprehensive, engaging, and highly SEO-optimized article about "${topic}" in the category of "${category}".
    ${platformName ? `The article should focus heavily on the brand/platform: ${platformName}.` : ""}
    
    Guidelines:
    - Use proper markdown formatting (H2, H3, bold text, bullet points).
    - Write an engaging introduction and a strong conclusion.
    - Naturally include relevant keywords related to the topic.
    - Return the response as JSON matching the schema precisely.
    `;
    const response = await generateWithRetry(ai, {
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "A catchy, SEO-friendly H1 title" },
            metaTitle: { type: Type.STRING, description: "SEO Meta Title (max 60 chars)" },
            metaDescription: { type: Type.STRING, description: "SEO Meta Description (max 160 chars)" },
            content: { type: Type.STRING, description: "The full article content in Markdown format" },
            tags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "5-7 relevant SEO tags/keywords" }
          },
          required: ["title", "metaTitle", "metaDescription", "content", "tags"]
        }
      }
    });
    if (!response.text) {
      logger.error("AI returned empty response for article generation");
      return res.status(500).json({ error: "AI returned empty response" });
    }
    let generated;
    try {
      generated = JSON.parse(response.text);
    } catch (parseError) {
      logger.error("JSON parsing failed for AI response:", {
        error: parseError.message,
        rawText: response.text
      });
      return res.status(500).json({ error: "Failed to parse AI response as JSON.", details: parseError.message });
    }
    res.json(generated);
  } catch (error) {
    logger.error("Error generating AI article API call:", {
      message: error.message,
      name: error.name,
      status: error.status || error.code,
      stack: error.stack
    });
    let statusCode = error.status || error.code || 500;
    let errorMsg = "Failed to generate article: " + (error.message || "Unknown error");
    if (statusCode === 401 || error.message?.includes("API key")) {
      errorMsg = "AI API authentication failed (invalid or expired key).";
      statusCode = 401;
    } else if (statusCode === 429 || error.message?.includes("quota")) {
      errorMsg = "AI API rate limit or quota exceeded.";
      statusCode = 429;
    } else if (error.message?.includes("timeout") || error.name === "AbortError") {
      errorMsg = "AI API request timed out.";
      statusCode = 504;
    }
    res.status(statusCode).json({ error: errorMsg, details: error.message });
  }
});
async function startServer() {
  const isProduction = process.env.NODE_ENV === "production" || typeof __filename !== "undefined" && __filename.endsWith(".cjs");
  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const fs2 = await import("fs");
    const candidates = [
      path.join(process.cwd(), "dist"),
      path.join(__dirname, "dist"),
      path.join(__dirname),
      process.cwd()
    ];
    const distPath = candidates.find((c) => fs2.existsSync(path.join(c, "index.html")) && fs2.existsSync(path.join(c, "assets"))) || candidates.find((c) => fs2.existsSync(path.join(c, "index.html"))) || path.join(process.cwd(), "dist");
    logger.info(`[Production] Serving static files from: ${distPath}`);
    app.use(express.static(distPath, {
      maxAge: "1y",
      immutable: true,
      index: false,
      setHeaders: (res, filePath) => {
        if (filePath.endsWith(".js") || filePath.endsWith(".mjs")) {
          res.setHeader("Content-Type", "application/javascript; charset=UTF-8");
        } else if (filePath.endsWith(".css")) {
          res.setHeader("Content-Type", "text/css; charset=UTF-8");
        } else if (filePath.endsWith(".html")) {
          res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate, max-age=0");
          res.setHeader("Pragma", "no-cache");
          res.setHeader("Expires", "0");
        }
      }
    }));
    const assetsPath = path.join(distPath, "assets");
    if (fs2.existsSync(assetsPath)) {
      app.use("/assets", express.static(assetsPath, {
        maxAge: "1y",
        immutable: true,
        setHeaders: (res, filePath) => {
          if (filePath.endsWith(".js") || filePath.endsWith(".mjs")) {
            res.setHeader("Content-Type", "application/javascript; charset=UTF-8");
          } else if (filePath.endsWith(".css")) {
            res.setHeader("Content-Type", "text/css; charset=UTF-8");
          }
        }
      }));
    }
    app.use("/assets", (req, res) => {
      res.status(404).setHeader("Content-Type", "text/plain").send("Asset not found");
    });
    app.get("*", (req, res) => {
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate, max-age=0");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
      const htmlFile = path.join(distPath, "index.html");
      if (fs2.existsSync(htmlFile)) {
        let html = fs2.readFileSync(htmlFile, "utf-8");
        const geo = getGeoFromRequest(req);
        let seoTitle = stateConfig.heroHeadline || "Best Promo Codes";
        let seoDesc = stateConfig.heroSubheading || "Find the latest and greatest promo codes.";
        let injectedSchema = "";
        const platformMatch = req.path.match(/^\/platform\/([^/]+)/);
        if (platformMatch) {
          const pSlug = platformMatch[1];
          const platform = statePlatforms.find((p) => p.slug === pSlug);
          if (platform) {
            seoTitle = `${platform.name} Promo Code ${platform.promoCode} | Get ${platform.bonusText}`;
            seoDesc = `Claim the exclusive ${platform.name} bonus with promo code ${platform.promoCode}. ${platform.bonusText}. Updated and verified!`.substring(0, 160);
            const reviewSchema = {
              "@context": "https://schema.org/",
              "@type": "Review",
              "itemReviewed": {
                "@type": "Organization",
                "name": platform.name,
                "image": platform.logoUrl
              },
              "reviewRating": {
                "@type": "Rating",
                "ratingValue": platform.rating || "5.0",
                "bestRating": "5"
              },
              "author": {
                "@type": "Organization",
                "name": "Bonus Promo Code"
              }
            };
            const faqSchema = {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": `What is the best promo code for ${platform.name}?`,
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `The best promo code for ${platform.name} is ${platform.promoCode}. Use it to claim ${platform.bonusText}.`
                  }
                },
                {
                  "@type": "Question",
                  "name": `Is ${platform.name} legit?`,
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `Yes, ${platform.name} is a highly rated platform with a rating of ${platform.rating} out of 5 stars.`
                  }
                }
              ]
            };
            injectedSchema = `
<script type="application/ld+json">${JSON.stringify(reviewSchema)}</script>
<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>`;
          }
        }
        const articleMatch = req.path.match(/^\/blog\/([^/]+)/);
        if (articleMatch) {
          const aSlug = articleMatch[1];
          const article = stateConfig.articles?.find((a) => a.slug === aSlug);
          if (article) {
            seoTitle = article.metaTitle || article.title;
            seoDesc = (article.metaDescription || article.content.substring(0, 150)).substring(0, 160);
          }
        }
        html = html.replace(/<title>.*?<\/title>/, `<title>${seoTitle}</title>`);
        if (!html.includes('<meta name="description"')) {
          html = html.replace("<head>", `<head>
<meta name="description" content="${seoDesc}">`);
        } else {
          html = html.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${seoDesc}">`);
        }
        const safePlatforms = statePlatforms.map((p) => ({
          id: p.id,
          slug: p.slug,
          name: p.name,
          logoUrl: p.logoUrl,
          rating: p.rating,
          starRating: p.starRating,
          badges: p.badges,
          bonusText: p.bonusText,
          promoCode: p.promoCode,
          isFeatured: p.isFeatured,
          featuredRank: p.featuredRank,
          isActive: p.isActive,
          category: p.category
        }));
        const safeConfig = {
          heroHeadline: stateConfig.heroHeadline,
          heroSubheading: stateConfig.heroSubheading,
          topBannerTemplate: stateConfig.topBannerTemplate,
          enableSubPartnerProgram: stateConfig.enableSubPartnerProgram,
          subPartnerHeadline: stateConfig.subPartnerHeadline,
          customCoupons: stateConfig.customCoupons,
          approvedFeedbacks: stateConfig.approvedFeedbacks,
          pushNotifications: stateConfig.pushNotifications,
          abTestConfig: stateConfig.abTestConfig,
          sidebarAdHtml: stateConfig.sidebarAdHtml,
          telegramUrl: stateConfig.telegramUrl,
          instagramUrl: stateConfig.instagramUrl,
          tiktokUrl: stateConfig.tiktokUrl,
          whatsappGroupUrl: stateConfig.whatsappGroupUrl,
          youtubeUrl: stateConfig.youtubeUrl,
          articles: stateConfig.articles,
          footerColumns: stateConfig.footerColumns,
          copyrightText: stateConfig.copyrightText,
          footerDisclaimerText: stateConfig.footerDisclaimerText,
          autoBlogSettings: stateConfig.autoBlogSettings
        };
        const initialData = { platforms: safePlatforms, config: safeConfig, customPages: stateCustomPages, geo };
        const scriptTag = `${injectedSchema}<script>window.__INITIAL_DATA__ = ${JSON.stringify(initialData).replace(/</g, "\\u003c")};</script></head>`;
        html = html.replace("</head>", scriptTag);
        res.send(html);
      } else {
        res.status(500).send("Production build not found. Run npm run build.");
      }
    });
  }
  const autoblogInterval = setInterval(async () => {
    if (!stateConfig.autoBlogSettings?.enabled) return;
    if (!process.env.GEMINI_API_KEY) return;
    const { categories, topics } = stateConfig.autoBlogSettings;
    if (!categories || categories.length === 0) return;
    const data = { statePlatforms, stateConfig, stateSubPartners };
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const defaultCategories = ["Gaming", "Crypto", "Finance", "Loans", "Virtual Cards"];
      const cats = categories && categories.length > 0 ? categories : defaultCategories;
      const category = cats[Math.floor(Math.random() * cats.length)];
      const defaultTopics = ["Best crypto wallets for gaming withdrawals", "1Win vs Mostbet: Which is better?", "Best Casino Promo Codes 2026", "No KYC Crypto Casinos", "Instant Withdrawal Casinos in India", "Stake vs BC.Game Comparison", "Top 5 Casino Welcome Bonuses", "How to claim 1Win 500% Bonus"];
      const tops = topics && topics.length > 0 ? topics : defaultTopics;
      const topic = tops[Math.floor(Math.random() * tops.length)];
      logger.info(`[Auto-Blogger] Generating draft for: ${topic} in ${category}`);
      const prompt = `You are an expert iGaming SEO copywriter. Write a comprehensive, highly engaging, and highly converting article (800-1500 words) about: "${topic}".
    Category: ${category}.
    Make sure to include sections for:
    - Introduction and target audience
    - Detailed breakdown (Pros/Cons, Comparisons if applicable)
    - Payment methods and withdrawal speeds
    - Step-by-step guide on how to claim promo codes (mention code MAXBOOST500)
    - Responsible gambling disclaimer at the end
    
    Use rich Markdown formatting (H2, H3, bullet points, bold text).
    Return ONLY valid JSON in this exact format:
    {
      "title": "Catchy SEO Title",
      "content": "Markdown formatted content. At least 500 words.",
      "metaTitle": "SEO Meta Title under 60 chars",
      "metaDescription": "SEO Meta Description under 160 chars",
      "tags": ["tag1", "tag2", "tag3"]
    }`;
      const response = await generateWithRetry(ai, {
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              content: { type: Type.STRING },
              metaTitle: { type: Type.STRING },
              metaDescription: { type: Type.STRING },
              tags: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["title", "content", "metaTitle", "metaDescription", "tags"]
          }
        }
      });
      if (response.text) {
        const data2 = JSON.parse(response.text);
        const newArticle = {
          id: "art_auto_" + Math.floor(Math.random() * 1e6),
          slug: data2.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""),
          title: data2.title,
          content: data2.content,
          category,
          metaTitle: data2.metaTitle,
          metaDescription: data2.metaDescription,
          publishedAt: (/* @__PURE__ */ new Date()).toISOString(),
          author: "AI Auto-Blogger",
          tags: data2.tags || [],
          views: 0,
          status: "draft"
        };
        if (!stateConfig.articles) stateConfig.articles = [];
        stateConfig.articles = [newArticle, ...stateConfig.articles];
        logger.info(`[Auto-Blogger] Successfully created draft: ${data2.title}`);
      }
    } catch (err) {
      logger.error("[Auto-Blogger] Error generating article:", err);
    }
  }, (stateConfig.autoBlogSettings?.intervalHours || 24) * 60 * 60 * 1e3);
  if (process.env.SENTRY_DSN) {
    Sentry2.setupExpressErrorHandler(app);
  }
  const server = app.listen(Number(PORT), "0.0.0.0", () => {
    logger.info(`Affiliate Hub App listening on port ${PORT}`);
  });
  server.on("error", (e) => {
    if (e.code === "EADDRINUSE") {
      logger.error(`Port ${PORT} is in use, aborting...`);
      process.exit(1);
    } else {
      logger.error("Server error:", e);
    }
  });
}
startServer();
//# sourceMappingURL=server.js.map
