const fs = require('fs');
let content = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

// Fix the syntax error I introduced
content = content.replace(
  /\$\{code \? \` \+ \(selectedSeed \? \`\, \$\{selectedSeed\}\` : ''\)\$\{name\.toLowerCase\(\)\} referral code \$\{code\}\` : ''\}/,
  `\${code ? \`\${name.toLowerCase()} referral code \${code}\` : ''}\` + (selectedSeed ? \`, \${selectedSeed}\` : '')`
);

fs.writeFileSync('src/components/AdminPanel.tsx', content);
