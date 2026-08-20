const fs = require('fs');
let code = fs.readFileSync('src/utils/seo.ts', 'utf8');

const newFn = `
export function injectCustomPageSchema(page: any) {
  if (typeof document === 'undefined') return;
  const scriptId = 'custom-page-schema-' + page.id;
  let scriptElement = document.getElementById(scriptId);
  
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
        "description": page.promoCode ? \`Use code \${page.promoCode} for bonuses\` : undefined
      };
    }
    
    schemaArr.push(mainEntity);
  }
  
  scriptElement.textContent = JSON.stringify(schemaArr.length === 1 ? schemaArr[0] : schemaArr, null, 2);
}
`;

code += '\n' + newFn;

fs.writeFileSync('src/utils/seo.ts', code, 'utf8');
console.log('Patched seo.ts');
