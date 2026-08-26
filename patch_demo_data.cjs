const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

// Replace /api/admin/data
const newDataEndpoint = `app.get('/api/admin/data', verifyJwtToken, (req, res) => {
  const geo = getGeoFromRequest(req);
  const isDemo = (req as any).user?.role === 'demo';

  let returnedPlatforms = statePlatforms;
  let returnedStats = stateStats;
  let returnedSubPartners = stateSubPartners;

  if (isDemo) {
    // Generate dummy earnings data
    returnedPlatforms = statePlatforms.map(p => ({
      ...p,
      stats: {
        totalRegistrations: Math.floor(Math.random() * 5000) + 1000,
        ftdCount: Math.floor(Math.random() * 2000) + 500,
        totalDepositsAmount: Math.floor(Math.random() * 50000) + 10000,
        netGamingRevenue: Math.floor(Math.random() * 20000) + 5000,
        commissionEarned: Math.floor(Math.random() * 8000) + 1000,
        revSharePercent: 50
      }
    }));
    
    returnedStats = {
      totalVisits: Math.floor(Math.random() * 500000) + 200000,
      totalOutboundClicks: Math.floor(Math.random() * 100000) + 50000,
      activeUsersLive: Math.floor(Math.random() * 150) + 20,
    };
    
    returnedSubPartners = [
      { id: 'demo1', fullName: 'Rahul Sharma', email: 'rahul.s@example.com', whatsapp: '919876543210', platformId: '10cric', platformName: '10CRIC', trafficSource: 'Telegram', estimatedMonthlyPlayers: '100-500', status: 'approved', appliedAt: new Date().toISOString() },
      { id: 'demo2', fullName: 'Amit Patel', email: 'amit@example.com', whatsapp: '919876543211', platformId: 'pinup', platformName: 'Pin-Up Casino', trafficSource: 'YouTube', estimatedMonthlyPlayers: '500+', status: 'pending', appliedAt: new Date().toISOString() },
      { id: 'demo3', fullName: 'Vikram Singh', email: 'vikram@example.com', whatsapp: '919876543212', platformId: '1xbet', platformName: '1xBet', trafficSource: 'SEO Blog', estimatedMonthlyPlayers: '50+', status: 'approved', appliedAt: new Date(Date.now() - 86400000).toISOString() }
    ];
  }

  res.json({
    isDemo,
    platforms: returnedPlatforms,
    config: stateConfig,
    stats: returnedStats,
    logs: stateTrackLogs,
    subPartners: returnedSubPartners,
    customPages: stateCustomPages,
    geo
  });
});`;

content = content.replace(/app\.get\('\/api\/admin\/data', verifyJwtToken, \(req, res\) => \{[\s\S]*?\}\);/, newDataEndpoint);

fs.writeFileSync('server.ts', content);
