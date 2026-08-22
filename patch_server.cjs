const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf-8');

const replacement = `
    // Aggregation for S2S Postbacks
    if (!stateStats.platformStats) stateStats.platformStats = {};
    if (!stateStats.platformStats[platform.id]) {
      stateStats.platformStats[platform.id] = { clicks: 0, copies: 0, registrations: 0, deposits: 0, revenue: 0 };
    }
    const pStats = stateStats.platformStats[platform.id];
    
    if (event === 'registration') {
      pStats.registrations = (pStats.registrations || 0) + 1;
    } else if (event === 'deposit' || event === 'fd_approved' || event === 'redeposit' || event === 'firstbet') {
      pStats.deposits = (pStats.deposits || 0) + 1;
      if (sum) pStats.revenue = (pStats.revenue || 0) + sum;
    }
    triggerStatsSave();

    // Also push to local state for temporary viewing in admin
`;

content = content.replace('    // Also push to local state for temporary viewing in admin', replacement);

fs.writeFileSync('server.ts', content);
console.log('server.ts postback aggregation patched');
