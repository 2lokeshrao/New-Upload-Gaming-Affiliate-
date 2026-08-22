const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf-8');

const regexClick = /stateStats.totalClicks \+= 1; triggerStatsSave\(\);/;
const replacementClick = `
    stateStats.totalClicks += 1;
    if (!stateStats.platformStats) stateStats.platformStats = {};
    if (platform && !stateStats.platformStats[platform.id]) stateStats.platformStats[platform.id] = { clicks: 0, copies: 0, registrations: 0, deposits: 0, revenue: 0 };
    if (platform) stateStats.platformStats[platform.id].clicks = (stateStats.platformStats[platform.id].clicks || 0) + 1;
    triggerStatsSave();
`;

const regexCopy = /stateStats.totalPromoCopies \+= 1; triggerStatsSave\(\);/;
const replacementCopy = `
    stateStats.totalPromoCopies += 1;
    if (!stateStats.platformStats) stateStats.platformStats = {};
    if (platform && !stateStats.platformStats[platform.id]) stateStats.platformStats[platform.id] = { clicks: 0, copies: 0, registrations: 0, deposits: 0, revenue: 0 };
    if (platform) stateStats.platformStats[platform.id].copies = (stateStats.platformStats[platform.id].copies || 0) + 1;
    triggerStatsSave();
`;

content = content.replace(regexClick, replacementClick);
content = content.replace(regexCopy, replacementCopy);

fs.writeFileSync('server.ts', content);
console.log('server.ts api track patched');
