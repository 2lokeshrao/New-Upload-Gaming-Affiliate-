const fs = require('fs');
let content = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

// Fix platform sort
content = content.replace(/if \(platformSort\.field === 'name'\) return a\.name\.localeCompare\(b\.name\) \* modifier;/g,
  "if (platformSort.field === 'name') return (a.name || '').localeCompare(b.name || '') * modifier;");

// Fix subpartner sort
content = content.replace(/if \(subPartnerSort\.field === 'name'\) return a\.fullName\.localeCompare\(b\.fullName\) \* modifier;/g,
  "if (subPartnerSort.field === 'name') return (a.fullName || '').localeCompare(b.fullName || '') * modifier;");

content = content.replace(/if \(subPartnerSort\.field === 'platform'\) return a\.platformName\.localeCompare\(b\.platformName\) \* modifier;/g,
  "if (subPartnerSort.field === 'platform') return (a.platformName || '').localeCompare(b.platformName || '') * modifier;");

content = content.replace(/const playersA = parseInt\(a\.estimatedMonthlyPlayers\.replace\(\/\[\^0-9\]\/g, ''\)\) \|\| 0;/g,
  "const playersA = parseInt((a.estimatedMonthlyPlayers || '').replace(/[^0-9]/g, '')) || 0;");

content = content.replace(/const playersB = parseInt\(b\.estimatedMonthlyPlayers\.replace\(\/\[\^0-9\]\/g, ''\)\) \|\| 0;/g,
  "const playersB = parseInt((b.estimatedMonthlyPlayers || '').replace(/[^0-9]/g, '')) || 0;");

content = content.replace(/if \(subPartnerSort\.field === 'status'\) return a\.status\.localeCompare\(b\.status\) \* modifier;/g,
  "if (subPartnerSort.field === 'status') return (a.status || '').localeCompare(b.status || '') * modifier;");

fs.writeFileSync('src/components/AdminPanel.tsx', content);
