const fs = require('fs');
let content = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');

const regex = /stats:\s*\{\s*totalRegistrations:\s*340,\s*ftdCount:\s*210,\s*totalDepositsAmount:\s*12500,\s*netGamingRevenue:\s*9375,\s*commissionEarned:\s*4218,\s*revSharePercent:\s*45\s*\}/g;

const replacement = `stats: {
                      totalRegistrations: stats?.platformStats?.[platform.id]?.registrations || 0,
                      ftdCount: stats?.platformStats?.[platform.id]?.deposits || 0,
                      totalDepositsAmount: 0,
                      netGamingRevenue: 0,
                      commissionEarned: stats?.platformStats?.[platform.id]?.revenue || 0,
                      revSharePercent: 45
                    }`;

content = content.replace(regex, replacement);

fs.writeFileSync('src/components/AdminPanel.tsx', content);
console.log('src/components/AdminPanel.tsx patched for mock data');
