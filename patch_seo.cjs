const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

// Update API to accept seedKeywords and randomize them
content = content.replace(
  /const \{ platformName, category, bonus, promoCode, existingDescription \} = req\.body;/,
  `const { platformName, category, bonus, promoCode, existingDescription, seedKeywords } = req.body;\n\n    let selectedSeeds = [];\n    if (Array.isArray(seedKeywords) && seedKeywords.length > 0) {\n      const shuffled = [...seedKeywords].sort(() => 0.5 - Math.random());\n      selectedSeeds = shuffled.slice(0, Math.min(3, shuffled.length));\n    }`
);

content = content.replace(
  /Current Year: \$\{currentYear\}/,
  `Current Year: \${currentYear}\n\${selectedSeeds.length > 0 ? '- Seed Keywords to Incorporate: ' + selectedSeeds.join(', ') : ''}`
);

// Add rule to ensure variety based on seed keywords
content = content.replace(
  /3\. Keywords must be a comma-separated list of 4-6 specific, high-intent search queries for this platform\./,
  `3. Keywords must be a comma-separated list of 4-6 specific, high-intent search queries for this platform. \${selectedSeeds.length > 0 ? 'Make sure the titles, descriptions, and keywords creatively utilize and are highly influenced by the seed keywords to guarantee non-repetitive and distinct variations each time.' : 'Ensure the output is distinct and non-repetitive.'}`
);

fs.writeFileSync('server.ts', content);
