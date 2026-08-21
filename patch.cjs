const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. Add import
if (!code.includes("from './data'")) {
    code = code.replace("import { formatLocalizedBonus } from './utils/currency';", "import { formatLocalizedBonus } from './utils/currency';\nimport { initialPlatforms, initialGlobalConfig, initialCustomPages } from './data';");
}

// 2. Modify catch block
const targetStr = `console.error('Failed to load initial affiliate data:', err);`;
const replacementStr = `console.error('Failed to load initial affiliate data:', err);
      // Fallback to local data to prevent hanging skeleton on fetch failure
      setPlatforms(initialPlatforms);
      setConfig(initialGlobalConfig);
      setCustomPages(initialCustomPages);`;

if (!code.includes('Fallback to local data')) {
    code = code.replace(targetStr, replacementStr);
}

fs.writeFileSync('src/App.tsx', code);
console.log('Patched src/App.tsx successfully');
