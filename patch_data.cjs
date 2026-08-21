const fs = require('fs');
let code = fs.readFileSync('src/data.ts', 'utf-8');

const hostingerPlatform = `
  {
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
    reviewContent: \`# Hostinger Web Hosting Review\n\nHostinger is one of the best and most affordable web hosting providers in the world.\n\n### Why Choose Hostinger?\n- **Free Domain & SSL** for the first year\n- **24/7 Live Support**\n- **Blazing Fast NVMe SSD Storage**\n- **99.9% Uptime Guarantee**\n\nUsing the promo code **BONUS20OFF** gives you an instant 20% discount on your hosting plan.\`
  }
`;

if (!code.includes('"hostinger"')) {
  code = code.replace(
    /export const initialPlatforms: GamingPlatform\[\] = \[/,
    `export const initialPlatforms: GamingPlatform[] = [${hostingerPlatform},`
  );
  fs.writeFileSync('src/data.ts', code);
  console.log("Patched src/data.ts");
}
