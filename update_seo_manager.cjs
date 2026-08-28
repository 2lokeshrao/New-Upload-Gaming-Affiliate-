const fs = require('fs');
let content = fs.readFileSync('src/components/SeoManagerTab.tsx', 'utf8');

const SEED_KEYWORDS_ARRAY_STR = `const seoSeedKeywords = [
    'official verified 2026',
    'maximum cashback',
    'exclusive discount deal',
    'instant approval',
    'vip upgrade',
    'highest success rate',
    'best promo offer',
    'secret referral code',
    'guaranteed welcome bonus',
    'fastest withdrawal',
    'zero hidden fees',
    'premium member benefits',
    'tested working today'
  ];`;

// Inject seed keywords array
content = content.replace(
  /const handleAutoGenerateSeo = async \(\) => \{/,
  `${SEED_KEYWORDS_ARRAY_STR}\n\n  const handleAutoGenerateSeo = async () => {`
);

// Add to fetch body
content = content.replace(
  /existingDescription: selectedPlatform\.metaDescription/,
  `existingDescription: selectedPlatform.metaDescription,\n          seedKeywords: seoSeedKeywords`
);

// Add to generateSmartSeoTags fallback
content = content.replace(
  /const smartTags = generateSmartSeoTags\(selectedPlatform\);/,
  `const smartTags = generateSmartSeoTags(selectedPlatform, seoSeedKeywords);`
);

// Also fix AdminPanel's auto-generate button
let adminContent = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');
adminContent = adminContent.replace(
  /const tags = generateSmartSeoTags\(editingPlatform\);/,
  `const seoSeedKeywords = ['official verified 2026', 'maximum cashback', 'exclusive discount deal', 'instant approval', 'vip upgrade', 'highest success rate', 'best promo offer', 'secret referral code', 'guaranteed welcome bonus', 'fastest withdrawal', 'zero hidden fees', 'premium member benefits', 'tested working today'];\n                            const tags = generateSmartSeoTags(editingPlatform, seoSeedKeywords);`
);

// Also fix SeoManagerTab placeholder calling generateSmartSeoTags(selectedPlatform)
content = content.replace(
  /generateSmartSeoTags\(selectedPlatform\)\.metaTitle/g,
  `generateSmartSeoTags(selectedPlatform, []).metaTitle`
);
content = content.replace(
  /generateSmartSeoTags\(selectedPlatform\)\.metaDescription/g,
  `generateSmartSeoTags(selectedPlatform, []).metaDescription`
);

fs.writeFileSync('src/components/SeoManagerTab.tsx', content);
fs.writeFileSync('src/components/AdminPanel.tsx', adminContent);

