const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf-8');

const regexGo = /platform.clicksCount = \(platform.clicksCount \|\| 0\) \+ 1;\s*stateStats.totalClicks \+= 1; triggerStatsSave\(\);/;
const replacementGo = `
  platform.clicksCount = (platform.clicksCount || 0) + 1;
  stateStats.totalClicks += 1;
  if (!stateStats.platformStats) stateStats.platformStats = {};
  if (!stateStats.platformStats[platform.id]) stateStats.platformStats[platform.id] = { clicks: 0, copies: 0, registrations: 0, deposits: 0, revenue: 0 };
  stateStats.platformStats[platform.id].clicks = (stateStats.platformStats[platform.id].clicks || 0) + 1;
  triggerStatsSave();
`;

content = content.replace(regexGo, replacementGo);

fs.writeFileSync('server.ts', content);
console.log('server.ts go endpoint patched');
