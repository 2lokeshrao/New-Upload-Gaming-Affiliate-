const fs = require('fs');
let content = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

// Update generateSmartSeoTags signature
content = content.replace(
  /export const generateSmartSeoTags = \(platform: Partial<GamingPlatform>\) => \{/,
  `export const generateSmartSeoTags = (platform: Partial<GamingPlatform>, seedKeywords?: string[]) => {`
);

// Add random selection inside generateSmartSeoTags
content = content.replace(
  /const currentYear = new Date\(\)\.getFullYear\(\);/,
  `const currentYear = new Date().getFullYear();\n  let selectedSeed = '';\n  if (seedKeywords && seedKeywords.length > 0) {\n    selectedSeed = seedKeywords[Math.floor(Math.random() * seedKeywords.length)];\n  }`
);

// We need to inject selectedSeed into the strings.
// Let's replace instances of keywords generation to include selectedSeed if present.
content = content.replace(
  /keywords = \`\$\{name\.toLowerCase\(\)\}.*?\`/g,
  `$& + (selectedSeed ? \`, \${selectedSeed}\` : '')`
);

fs.writeFileSync('src/components/AdminPanel.tsx', content);
