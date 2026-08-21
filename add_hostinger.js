fetch('http://localhost:3000/api/admin/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ password: '@dmin123' })
}).then(res => res.json()).then(async loginData => {
  const token = loginData.token;
  
  // Get current data
  const dataRes = await fetch('http://localhost:3000/api/admin/data', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await dataRes.json();
  
  const platforms = data.platforms;
  const customPages = data.customPages;
  
  // Add Hostinger
  const hostinger = {
    id: "hostinger",
    slug: "hostinger",
    name: "Hostinger",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Hostinger_logo.svg/2560px-Hostinger_logo.svg.png",
    rating: 9.8,
    starRating: 5,
    averageUserRating: 4.9,
    totalReviewsCount: 15420,
    badges: ["20% OFF", "Free Domain", "Free SSL"],
    bonusText: "Flat 20% OFF on Premium Web Hosting",
    promoCode: "BONUS20OFF",
    rawAffiliateUrl: "https://www.hostinger.com/in?REFERRALCODE=BONUS20OFF",
    masterPartnerUrl: "https://www.hostinger.com/in?REFERRALCODE=BONUS20OFF",
    isFeatured: true,
    featuredRank: 1, 
    isActive: true,
    clicksCount: 0,
    copiesCount: 0,
    category: "Web Hosting",
    metaTitle: "Hostinger Promo Code BONUS20OFF | Get 20% Discount",
    metaDescription: "Use referral code BONUS20OFF for Hostinger to claim a flat 20% discount on premium web hosting plans. Includes free domain and SSL.",
    metaKeywords: "hostinger promo code, hostinger referral code, BONUS20OFF, hostinger discount",
    reviewContent: `# Hostinger Web Hosting Review\n\nHostinger is one of the best and most affordable web hosting providers in the world.\n\n### Why Choose Hostinger?\n- **Free Domain & SSL** for the first year\n- **24/7 Live Support**\n- **Blazing Fast NVMe SSD Storage**\n- **99.9% Uptime Guarantee**\n\nUsing the promo code **BONUS20OFF** gives you an instant 20% discount on your hosting plan.`
  };
  
  if (!platforms.find(p => p.id === 'hostinger')) {
    platforms.push(hostinger);
    await fetch('http://localhost:3000/api/admin/platforms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ platforms })
    });
    console.log("Hostinger platform added.");
  }
  
  // Add Custom Page
  const hostingerPage = {
    id: "page_hostinger",
    slug: "hostinger-promo-code",
    title: "Hostinger Web Hosting Promo Code - Get 20% OFF",
    content: `## Why You Need Professional Hosting\n\nWhether you are running an affiliate site, a blog, or an eCommerce store, your web hosting is the foundation of your online business.\n\n### Why We Recommend Hostinger\n1. **Unbeatable Value:** You get a Free Domain, Free SSL, and Free Email accounts with the Premium Plan.\n2. **Lightning Fast:** Powered by LiteSpeed web servers and NVMe storage.\n3. **Beginner Friendly:** Their hPanel is incredibly easy to use, and WordPress installs in just 1 click.\n\n### How to Claim Your 20% Discount\n1. Click the button below to visit Hostinger.\n2. Add the **Premium** or **Business** Web Hosting plan to your cart (48 months gives the best value).\n3. During checkout, enter the referral code **BONUS20OFF**.\n4. The 20% discount will be applied instantly!\n\nThis is a limited-time referral offer, so make sure you secure your hosting today.`,
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
  };
  
  if (!customPages.find(p => p.slug === 'hostinger-promo-code')) {
    customPages.push(hostingerPage);
    await fetch('http://localhost:3000/api/admin/custom-pages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ pages: customPages })
    });
    console.log("Hostinger page added.");
  }
  
});
