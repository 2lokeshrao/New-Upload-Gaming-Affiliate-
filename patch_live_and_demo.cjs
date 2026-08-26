const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const regex = /app\.get\('\/api\/admin\/data', verifyJwtToken, \(req, res\) => \{[\s\S]*?\}\);/;

const newEndpoint = `app.get('/api/admin/data', verifyJwtToken, (req, res) => {
  const geo = getGeoFromRequest(req);
  const isDemo = (req as any).user?.role === 'demo';

  let returnedPlatforms = statePlatforms;
  let returnedStats = stateStats;
  let returnedSubPartners = stateSubPartners;
  let returnedConfig = JSON.parse(JSON.stringify(stateConfig)); // Deep copy to avoid mutating state

  if (isDemo) {
    // Generate dummy earnings data inside partnerPanelConfigs (which AdminDashboardTab reads)
    const dummyPanelConfigs = statePlatforms.map(p => ({
      platformId: p.id,
      platformName: p.name,
      apiKey: \`DEMO_KEY_\${Math.floor(Math.random() * 900000)}\`,
      partnerApiUrl: \`https://api.\${p.slug}.com/v1/stats\`,
      affiliateId: \`DEMO_ID_\${Math.floor(Math.random() * 9000)}\`,
      postbackKey: \`pb_demo_secret\`,
      syncEnabled: true,
      lastSyncedAt: new Date().toISOString(),
      stats: {
        totalRegistrations: Math.floor(Math.random() * 5000) + 1000,
        ftdCount: Math.floor(Math.random() * 2000) + 500,
        totalDepositsAmount: Math.floor(Math.random() * 50000) + 10000,
        netGamingRevenue: Math.floor(Math.random() * 20000) + 5000,
        commissionEarned: Math.floor(Math.random() * 8000) + 1000,
        revSharePercent: 50
      }
    }));

    returnedConfig.partnerPanelConfigs = dummyPanelConfigs;
    
    returnedStats = {
      totalVisits: Math.floor(Math.random() * 500000) + 200000,
      totalOutboundClicks: Math.floor(Math.random() * 100000) + 50000,
      activeUsersLive: Math.floor(Math.random() * 150) + 20,
      dailyTrends: [
        { date: 'Aug 20', clicks: 2000, conversions: 150 },
        { date: 'Aug 21', clicks: 2500, conversions: 180 },
        { date: 'Aug 22', clicks: 2100, conversions: 160 },
        { date: 'Aug 23', clicks: 3000, conversions: 220 },
        { date: 'Aug 24', clicks: 3500, conversions: 280 },
        { date: 'Aug 25', clicks: 4200, conversions: 350 },
        { date: 'Aug 26', clicks: 5000, conversions: 400 }
      ]
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
    config: returnedConfig,
    stats: returnedStats,
    logs: stateTrackLogs,
    subPartners: returnedSubPartners,
    customPages: stateCustomPages,
    geo
  });
});`;

content = content.replace(regex, newEndpoint);

fs.writeFileSync('server.ts', content);
