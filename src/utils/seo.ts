import { GamingPlatform } from '../types';

export interface FAQItem {
  question: string;
  answer: string;
}

/**
 * Dynamically generates FAQ Schema (Schema.org / FAQPage JSON-LD) based on
 * platform offers, bonus promo codes, and custom FAQ entries.
 */
export function generateFaqSchema(
  platforms: GamingPlatform[],
  customFaqs?: FAQItem[]
) {
  const faqList: FAQItem[] = [];

  // Default global FAQs
  faqList.push(
    {
      question: "Are these online casino & sports betting promo codes 100% verified?",
      answer: "Yes, all promo codes and deposit bonus links featured on our platform are tested and verified daily in partnership with official gaming operators. Promo codes like MAXBOOST500, MOSTVIP2026, and PINUPMAX give guaranteed 100% to 500% welcome bonuses."
    },
    {
      question: "How do I claim a welcome bonus with a promo code?",
      answer: "Select your preferred gaming platform, click 'Claim Bonus' or copy the promo code, register a new account on the official platform page, and paste the code during sign-up to automatically trigger your deposit bonus and free spins."
    },
    {
      question: "Are fast withdrawals and local payment methods supported?",
      answer: "Yes. All listed platforms support local instant payment methods including UPI, PhonePe, Paytm, Google Pay, Pix, Mercado Pago, Visa, Mastercard, and instant Crypto payouts (USDT, BTC, ETH)."
    }
  );

  // Platform-specific FAQs dynamically derived from active platforms
  platforms.forEach((platform) => {
    if (platform.isActive) {
      faqList.push({
        question: `What is the best promo code for ${platform.name}?`,
        answer: `The official verified promo code for ${platform.name} is ${platform.promoCode}. Entering this promo code unlocks ${platform.bonusText || platform.bonusTitle || 'exclusive welcome deposit bonuses'} on your registration.`
      });
      faqList.push({
        question: `How fast are withdrawals and deposits on ${platform.name}?`,
        answer: `${platform.name} offers instant deposit processing with a minimum deposit starting at ${platform.minDeposit || '$10 / ₹500'}. Withdrawals are typically processed within 15 minutes.`
      });
    }
  });

  // Append any extra custom FAQs provided
  if (customFaqs && customFaqs.length > 0) {
    customFaqs.forEach(faq => faqList.push(faq));
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqList.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };


  // Generate SoftwareApplication Schema for featured platforms
  const softwareSchemas = platforms.filter(p => p.isActive && p.isFeatured).map(p => ({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": p.name,
    "applicationCategory": "GameApplication",
    "operatingSystem": "Web, Android, iOS",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": p.rating || 9.5,
      "ratingCount": p.totalReviewsCount || 15000
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  }));

  const combinedSchema = [faqSchema, ...softwareSchemas];

  return combinedSchema;
}


export function injectGoogleSiteVerification(verificationCode: string) {
  if (typeof document === 'undefined') return;
  const metaId = 'google-site-verification-meta';
  let metaTag = document.getElementById(metaId) as HTMLMetaElement | null;
  if (!metaTag) {
    metaTag = document.createElement('meta');
    metaTag.id = metaId;
    metaTag.name = 'google-site-verification';
    document.head.appendChild(metaTag);
  }
  metaTag.content = verificationCode;
}

/**
 * Dynamically injects or updates the FAQPage JSON-LD script tag in document head
 */
export function injectFaqSchemaInHead(
  platforms: GamingPlatform[],
  customFaqs?: FAQItem[]
) {
  if (typeof document === 'undefined') return;

  const schemaData = generateFaqSchema(platforms, customFaqs);
  const scriptId = 'dynamic-faq-jsonld-schema';

  let scriptElement = document.getElementById(scriptId) as HTMLScriptElement | null;

  if (!scriptElement) {
    scriptElement = document.createElement('script');
    scriptElement.id = scriptId;
    scriptElement.type = 'application/ld+json';
    document.head.appendChild(scriptElement);
  }

  scriptElement.textContent = JSON.stringify(schemaData, null, 2);
}


export function injectSeoTags(title: string, description: string, canonicalUrl: string, ogImage?: string) {
  if (typeof document === 'undefined') return;

  // Title
  document.title = title;

  // Meta Description
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    document.head.appendChild(metaDesc);
  }
  metaDesc.setAttribute('content', description);

  // Canonical
  let linkCanonical = document.querySelector('link[rel="canonical"]');
  if (!linkCanonical) {
    linkCanonical = document.createElement('link');
    linkCanonical.setAttribute('rel', 'canonical');
    document.head.appendChild(linkCanonical);
  }
  linkCanonical.setAttribute('href', canonicalUrl);

  // Open Graph Title
  let ogTitle = document.querySelector('meta[property="og:title"]');
  if (!ogTitle) {
    ogTitle = document.createElement('meta');
    ogTitle.setAttribute('property', 'og:title');
    document.head.appendChild(ogTitle);
  }
  ogTitle.setAttribute('content', title);

  // Open Graph Description
  let ogDesc = document.querySelector('meta[property="og:description"]');
  if (!ogDesc) {
    ogDesc = document.createElement('meta');
    ogDesc.setAttribute('property', 'og:description');
    document.head.appendChild(ogDesc);
  }
  ogDesc.setAttribute('content', description);

  // Open Graph URL
  let ogUrl = document.querySelector('meta[property="og:url"]');
  if (!ogUrl) {
    ogUrl = document.createElement('meta');
    ogUrl.setAttribute('property', 'og:url');
    document.head.appendChild(ogUrl);
  }
  ogUrl.setAttribute('content', canonicalUrl);

  // Open Graph Type
  let ogType = document.querySelector('meta[property="og:type"]');
  if (!ogType) {
    ogType = document.createElement('meta');
    ogType.setAttribute('property', 'og:type');
    document.head.appendChild(ogType);
  }
  ogType.setAttribute('content', 'website');

  // Open Graph Site Name
  let ogSiteName = document.querySelector('meta[property="og:site_name"]');
  if (!ogSiteName) {
    ogSiteName = document.createElement('meta');
    ogSiteName.setAttribute('property', 'og:site_name');
    document.head.appendChild(ogSiteName);
  }
  ogSiteName.setAttribute('content', 'Bonus Promo Code');

  // Twitter Card Meta Tags
  let twitterCard = document.querySelector('meta[name="twitter:card"]');
  if (!twitterCard) {
    twitterCard = document.createElement('meta');
    twitterCard.setAttribute('name', 'twitter:card');
    document.head.appendChild(twitterCard);
  }
  twitterCard.setAttribute('content', ogImage ? 'summary_large_image' : 'summary');

  let twitterTitle = document.querySelector('meta[name="twitter:title"]');
  if (!twitterTitle) {
    twitterTitle = document.createElement('meta');
    twitterTitle.setAttribute('name', 'twitter:title');
    document.head.appendChild(twitterTitle);
  }
  twitterTitle.setAttribute('content', title);

  let twitterDesc = document.querySelector('meta[name="twitter:description"]');
  if (!twitterDesc) {
    twitterDesc = document.createElement('meta');
    twitterDesc.setAttribute('name', 'twitter:description');
    document.head.appendChild(twitterDesc);
  }
  twitterDesc.setAttribute('content', description);

  if (ogImage) {
    let metaOgImage = document.querySelector('meta[property="og:image"]');
    if (!metaOgImage) {
      metaOgImage = document.createElement('meta');
      metaOgImage.setAttribute('property', 'og:image');
      document.head.appendChild(metaOgImage);
    }
    metaOgImage.setAttribute('content', ogImage);

    let metaTwitterImage = document.querySelector('meta[name="twitter:image"]');
    if (!metaTwitterImage) {
      metaTwitterImage = document.createElement('meta');
      metaTwitterImage.setAttribute('name', 'twitter:image');
      document.head.appendChild(metaTwitterImage);
    }
    metaTwitterImage.setAttribute('content', ogImage);
  }
}

export type SeoCategoryType = 'gaming' | 'finance' | 'crypto' | 'articles' | 'all';

export interface CategoryMetadata {
  title: string;
  description: string;
  canonicalUrl: string;
  ogImage: string;
  keywords: string;
}

/**
 * Generates dynamic SEO metadata for different categories (Gaming, Finance, Crypto, Articles).
 */
export function getCategoryMetadata(category: SeoCategoryType, countryName: string = 'Global'): CategoryMetadata {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://bonuspromocode.in';
  
  switch (category) {
    case 'gaming':
      return {
        title: `Top Verified Gaming & Casino Promo Codes 2026 (${countryName}) | 100% Guaranteed Bonuses`,
        description: `Compare official VIP gaming promo codes, up to 500% deposit matches, and free spins for 1Win, Mostbet, Stake & more in ${countryName}. Verified daily.`,
        canonicalUrl: `${baseUrl}/#offers`,
        ogImage: `${baseUrl}/og-gaming.png`,
        keywords: 'gaming promo code, casino bonus code, 1win promo code, mostbet promo code, free spins 2026'
      };

    case 'finance':
      return {
        title: `Finance Hub: Virtual Cards, Personal Loans & Banking Solutions (${countryName})`,
        description: `Explore instant approval virtual cards, low-interest personal loans, digital credit lines, and web hosting offers in ${countryName}.`,
        canonicalUrl: `${baseUrl}/banking/best-virtual-cards-for-gaming`,
        ogImage: `${baseUrl}/og-finance.png`,
        keywords: 'virtual cards, instant personal loan, credit cards, payment solutions, digital banking'
      };

    case 'crypto':
      return {
        title: `Crypto Hub: Best Crypto Exchanges, USDT Withdrawals & VIP Rakeback (${countryName})`,
        description: `Fast USDT & Bitcoin withdrawal tutorials, lowest trading fee crypto exchanges (Binance, Bybit), and anonymous crypto gaming guide for ${countryName}.`,
        canonicalUrl: `${baseUrl}/crypto/binance-usdt-withdrawal-guide`,
        ogImage: `${baseUrl}/og-crypto.png`,
        keywords: 'crypto withdrawal, binance usdt guide, bybit bonus, crypto exchange, crypto casino'
      };

    case 'articles':
      return {
        title: `Exclusive Guides, Strategies & Reviews 2026 | Bonus Promo Code Articles`,
        description: `Read in-depth reviews, bonus wagering strategies, loan approval guides, and step-by-step crypto withdrawal tutorials.`,
        canonicalUrl: `${baseUrl}/articles`,
        ogImage: `${baseUrl}/og-articles.png`,
        keywords: 'gaming guides, promo code reviews, deposit strategies, financial articles'
      };

    default:
      return {
        title: `100% Guaranteed Bonus Promo Codes & VIP Offers (2026) | BonusPromoCode`,
        description: `Claim tested & verified 2026 welcome bonus codes, up to 500% deposit bonus, free spins, instant personal loans, and virtual cards.`,
        canonicalUrl: `${baseUrl}/`,
        ogImage: `${baseUrl}/og-image.png`,
        keywords: 'bonus promo code, casino promo codes, financial offers, crypto bonuses'
      };
  }
}

/**
 * Injects dynamic meta tags into the DOM head for categories (Gaming, Finance, Crypto, Articles)
 * so that shared links render full Open Graph and Twitter card cards with correct rich snippets.
 */
export function injectCategoryMetaTags(category: SeoCategoryType, countryName: string = 'Global', customOgImage?: string) {
  if (typeof document === 'undefined') return;
  const meta = getCategoryMetadata(category, countryName);
  const ogImg = customOgImage || meta.ogImage;
  
  injectSeoTags(meta.title, meta.description, meta.canonicalUrl, ogImg);

  // Inject / update keywords meta tag
  let keywordsMeta = document.querySelector('meta[name="keywords"]');
  if (!keywordsMeta) {
    keywordsMeta = document.createElement('meta');
    keywordsMeta.setAttribute('name', 'keywords');
    document.head.appendChild(keywordsMeta);
  }
  keywordsMeta.setAttribute('content', meta.keywords);
}


export function injectCustomPageSchema(page: any) {
  if (typeof document === 'undefined') return;
  const scriptId = 'custom-page-schema-' + page.id;
  let scriptElement = document.getElementById(scriptId) as HTMLScriptElement | null;
  
  if (!page.schemaEnabled) {
    if (scriptElement) scriptElement.remove();
    return;
  }
  
  if (!scriptElement) {
    scriptElement = document.createElement('script');
    scriptElement.id = scriptId;
    scriptElement.type = 'application/ld+json';
    document.head.appendChild(scriptElement);
  }
  
  const schemaArr = [];
  
  // 1. FAQ Schema
  if (page.faqs && page.faqs.length > 0) {
    schemaArr.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": page.faqs.map((item: any) => ({
        "@type": "Question",
        "name": item.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.a
        }
      }))
    });
  }
  
  // 2. Main Entity Schema (SoftwareApplication, Product, etc)
  if (page.schemaType) {
    const mainEntity: any = {
      "@context": "https://schema.org",
      "@type": page.schemaType,
      "name": page.title,
      "description": page.metaDescription || page.title
    };
    
    if (page.schemaType === 'SoftwareApplication') {
      mainEntity.applicationCategory = "GameApplication";
      mainEntity.operatingSystem = page.schemaSoftwarePlatform || "Web, Android, iOS";
    }
    
    if (page.schemaRatingValue) {
      mainEntity.aggregateRating = {
        "@type": "AggregateRating",
        "ratingValue": page.schemaRatingValue,
        "ratingCount": page.schemaRatingCount || 100
      };
    }
    
    if (page.promoCode || page.schemaType === 'SoftwareApplication' || page.schemaType === 'Product') {
      mainEntity.offers = {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "description": page.promoCode ? `Use code ${page.promoCode} for bonuses` : undefined
      };
    }
    
    schemaArr.push(mainEntity);
  }
  
  scriptElement.textContent = JSON.stringify(schemaArr.length === 1 ? schemaArr[0] : schemaArr, null, 2);
}


