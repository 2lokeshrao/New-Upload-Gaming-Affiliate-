const fs = require('fs');
let content = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

const regex = /if \(category\.includes\('loan'\)[\s\S]*?\} else \{[\s\S]*?keywords = .*?;\n  \}/;

const replacement = `if (category.includes('loan') || category.includes('advance') || category.includes('credit')) {
    title = \`\${name} Instant Loan \${code ? \`Referral Code \${code}\` : 'Apply Online'} (\${currentYear})\`;
    description = \`Apply for \${name} instant paperless personal & business loans\${cleanBonus ? \` - \${cleanBonus}\` : ''}. Fast approval, lowest interest rates, and direct bank disbursal.\`;
    keywords = \`\${name.toLowerCase()} loan, \${name.toLowerCase()} apply online, instant cash loan, personal loan \${isIndia ? 'india' : ''}, \${code ? \`\${name.toLowerCase()} referral code \${code}\` : ''}\`;
  } else if (category.includes('bank') || category.includes('saving') || category.includes('finance') || category.includes('card') || category.includes('demat') || category.includes('invest')) {
    title = \`\${name} \${code ? \`Referral Code \${code}\` : 'Exclusive Offer'} | \${cleanBonus || 'Open Account'} \${currentYear}\`;
    description = \`Official \${name} offer\${code ? \` using code \${code}\` : ''}. \${cleanBonus || 'Zero balance account, instant activation, and cashback rewards'}. Secure paperless digital application.\`;
    keywords = \`\${name.toLowerCase()}, \${name.toLowerCase()} account, \${name.toLowerCase()} offers, \${name.toLowerCase()} promo code, banking perks \${currentYear}\`;
  } else if (category.includes('crypto') || category.includes('exchange') || category.includes('wallet')) {
    title = \`\${name} Referral Code \${code || 'VIP'} | \${cleanBonus || 'Sign Up Bonus'} \${currentYear}\`;
    description = \`Register on \${name} with verified referral code \${code || 'VIP'}. Claim \${cleanBonus || 'exclusive trading fee discounts & deposit rewards'}. Safe and instant crypto withdrawals.\`;
    keywords = \`\${name.toLowerCase()} referral code, \${name.toLowerCase()} promo code, \${name.toLowerCase()} sign up bonus, \${name.toLowerCase()} bonus code, crypto trading discount\`;
  } else if (category.includes('hosting') || category.includes('web') || category.includes('tech') || category.includes('domain')) {
    title = \`\${name} Coupon Code \${code || 'SAVE'} | \${cleanBonus || 'Best Discount'} \${currentYear}\`;
    description = \`Get the best discount on \${name}\${code ? \` with promo code \${code}\` : ''}. \${cleanBonus || 'Ultra-fast NVMe hosting, free SSL certificate & domain'}. Claim your deal today!\`;
    keywords = \`\${name.toLowerCase()} coupon code, \${name.toLowerCase()} promo code, \${name.toLowerCase()} discount voucher, \${name.toLowerCase()} web hosting deal\`;
  } else if (category.includes('sports') || category.includes('cricket') || category.includes('bet') || category.includes('gaming')) {
    title = \`\${name} Promo Code \${code} | \${cleanBonus || 'Real Bonus'} \${currentYear}\`;
    description = \`Use official \${name} promo code \${code} during registration to unlock \${cleanBonus || 'exclusive deposit bonus'}. Verified working for new players.\`;
    keywords = \`\${name.toLowerCase()} promo code, \${name.toLowerCase()} bonus code, \${name.toLowerCase()} sign up offer, \${code}\`;
  } else {
    title = \`\${name} Promo Code \${code} | \${cleanBonus || 'Welcome Bonus'} \${currentYear}\`;
    description = \`Official verified promo code for \${name}. Use code \${code} during registration to claim \${cleanBonus || 'your welcome bonus'}.\`;
    keywords = \`\${name.toLowerCase()} promo code, \${name.toLowerCase()} bonus code, \${name.toLowerCase()} welcome bonus, \${code}\`;
  }

  // Inject randomly selected seed keyword for variation if provided
  if (selectedSeed) {
    keywords += \`, \${selectedSeed}\`;
  }
`;

content = content.replace(regex, replacement);
fs.writeFileSync('src/components/AdminPanel.tsx', content);
