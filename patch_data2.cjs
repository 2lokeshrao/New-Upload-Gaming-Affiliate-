const fs = require('fs');
let code = fs.readFileSync('src/data.ts', 'utf-8');

const hostingerPage = `
  {
    id: "page_hostinger",
    slug: "hostinger-promo-code",
    title: "Hostinger Web Hosting Promo Code - Get 20% OFF",
    content: \`## Why You Need Professional Hosting\n\nWhether you are running an affiliate site, a blog, or an eCommerce store, your web hosting is the foundation of your online business.\n\n### Why We Recommend Hostinger\n1. **Unbeatable Value:** You get a Free Domain, Free SSL, and Free Email accounts with the Premium Plan.\n2. **Lightning Fast:** Powered by LiteSpeed web servers and NVMe storage.\n3. **Beginner Friendly:** Their hPanel is incredibly easy to use, and WordPress installs in just 1 click.\n\n### How to Claim Your 20% Discount\n1. Click the button below to visit Hostinger.\n2. Add the **Premium** or **Business** Web Hosting plan to your cart (48 months gives the best value).\n3. During checkout, enter the referral code **BONUS20OFF**.\n4. The 20% discount will be applied instantly!\n\nThis is a limited-time referral offer, so make sure you secure your hosting today.\`,
    isActive: true,
    metaTitle: "Hostinger Promo Code 2026 | Flat 20% OFF Coupon",
    metaDescription: "Claim your flat 20% OFF Hostinger promo code BONUS20OFF. Apply this referral code at checkout for huge discounts on premium web hosting.",
    targetKeywords: "hostinger promo code, hostinger coupon, BONUS20OFF",
    promoCode: "BONUS20OFF",
    affiliateLinks: [
      {
        id: "link_hostinger_1",
        brandName: "Hostinger",
        title: "Claim 20% OFF Hosting",
        url: "/go/hostinger",
        buttonText: "Claim Discount",
        badgeText: "VERIFIED"
      }
    ],
    faqs: [
      { q: "Is the domain really free?", a: "Yes! Hostinger includes a free domain for the first year with Premium and Business plans." },
      { q: "How do I apply the code BONUS20OFF?", a: "At the checkout page, look for the 'Have a coupon code?' section, enter BONUS20OFF and click Apply." }
    ],
    schemaEnabled: true,
    schemaType: "SoftwareApplication",
    schemaSoftwarePlatform: "Web Hosting"
  }
`;

if (!code.includes('"page_hostinger"')) {
  code = code.replace(
    /export const initialCustomPages: CustomPage\[\] = \[/,
    `export const initialCustomPages: CustomPage[] = [${hostingerPage},`
  );
  fs.writeFileSync('src/data.ts', code);
  console.log("Patched src/data.ts for Custom Pages");
}
