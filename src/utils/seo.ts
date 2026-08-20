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

  // Open Graph
  let ogTitle = document.querySelector('meta[property="og:title"]');
  if (!ogTitle) {
    ogTitle = document.createElement('meta');
    ogTitle.setAttribute('property', 'og:title');
    document.head.appendChild(ogTitle);
  }
  ogTitle.setAttribute('content', title);

  let ogDesc = document.querySelector('meta[property="og:description"]');
  if (!ogDesc) {
    ogDesc = document.createElement('meta');
    ogDesc.setAttribute('property', 'og:description');
    document.head.appendChild(ogDesc);
  }
  ogDesc.setAttribute('content', description);

  let ogUrl = document.querySelector('meta[property="og:url"]');
  if (!ogUrl) {
    ogUrl = document.createElement('meta');
    ogUrl.setAttribute('property', 'og:url');
    document.head.appendChild(ogUrl);
  }
  ogUrl.setAttribute('content', canonicalUrl);

  if (ogImage) {
    let metaOgImage = document.querySelector('meta[property="og:image"]');
    if (!metaOgImage) {
      metaOgImage = document.createElement('meta');
      metaOgImage.setAttribute('property', 'og:image');
      document.head.appendChild(metaOgImage);
    }
    metaOgImage.setAttribute('content', ogImage);
  }
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
