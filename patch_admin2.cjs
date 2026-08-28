const fs = require('fs');
let content = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

// 1. Inject state and sort handlers
const statePattern = /const \[platformFilter, setPlatformFilter\] = useState\<'all' \| 'active' \| 'inactive'\>\('all'\);/;
const stateReplacement = `const [platformFilter, setPlatformFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [platformSort, setPlatformSort] = useState<{field: 'rank' | 'name' | 'clicks' | 'status', direction: 'asc' | 'desc'}>({field: 'rank', direction: 'asc'});
  const [subPartnerSort, setSubPartnerSort] = useState<{field: 'name' | 'platform' | 'players' | 'status', direction: 'asc' | 'desc'}>({field: 'players', direction: 'desc'});

  const handlePlatformSort = (field: 'rank' | 'name' | 'clicks' | 'status') => {
    if (platformSort.field === field) {
      setPlatformSort({ field, direction: platformSort.direction === 'asc' ? 'desc' : 'asc' });
    } else {
      setPlatformSort({ field, direction: 'asc' });
    }
  };

  const handleSubPartnerSort = (field: 'name' | 'platform' | 'players' | 'status') => {
    if (subPartnerSort.field === field) {
      setSubPartnerSort({ field, direction: subPartnerSort.direction === 'asc' ? 'desc' : 'asc' });
    } else {
      setSubPartnerSort({ field, direction: 'asc' });
    }
  };`;
if (content.includes('const [platformFilter')) {
  content = content.replace(statePattern, stateReplacement);
}

// 2. Replace Platform headers
const platformHeadersT = `                    <tr>
                      <th className="p-3">Rank</th>
                      <th className="p-3">Platform</th>
                      <th className="p-3">Bonus & Code</th>
                      <th className="p-3">Clicks / Copies</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>`;
const platformHeadersR = `                    <tr>
                      <th className="p-3 cursor-pointer hover:text-white" onClick={() => handlePlatformSort('rank')}>
                        Rank {platformSort.field === 'rank' && (platformSort.direction === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="p-3 cursor-pointer hover:text-white" onClick={() => handlePlatformSort('name')}>
                        Platform {platformSort.field === 'name' && (platformSort.direction === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="p-3">Bonus & Code</th>
                      <th className="p-3 cursor-pointer hover:text-white" onClick={() => handlePlatformSort('clicks')}>
                        Clicks / Copies {platformSort.field === 'clicks' && (platformSort.direction === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="p-3 cursor-pointer hover:text-white" onClick={() => handlePlatformSort('status')}>
                        Status {platformSort.field === 'status' && (platformSort.direction === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>`;
content = content.replace(platformHeadersT, platformHeadersR);

// 3. Replace Platform map
const platformMapT = `.filter(p => {
                      const matchesSearch = p.name.toLowerCase().includes(platformSearch.toLowerCase());
                      const matchesFilter = platformFilter === 'all' ? true : platformFilter === 'active' ? p.isActive : !p.isActive;
                      return matchesSearch && matchesFilter;
                    })
                    .map((p) => {`;
const platformMapR = `.filter(p => {
                      const matchesSearch = p.name.toLowerCase().includes(platformSearch.toLowerCase());
                      const matchesFilter = platformFilter === 'all' ? true : platformFilter === 'active' ? p.isActive : !p.isActive;
                      return matchesSearch && matchesFilter;
                    })
                    .sort((a, b) => {
                      let modifier = platformSort.direction === 'asc' ? 1 : -1;
                      if (platformSort.field === 'name') return a.name.localeCompare(b.name) * modifier;
                      if (platformSort.field === 'clicks') return ((b.clicksCount || 0) - (a.clicksCount || 0)) * modifier;
                      if (platformSort.field === 'status') return (a.isActive === b.isActive ? 0 : a.isActive ? -1 : 1) * modifier;
                      const rankA = a.featuredRank || 999;
                      const rankB = b.featuredRank || 999;
                      return (rankA - rankB) * modifier;
                    })
                    .map((p) => {`;
content = content.replace(platformMapT, platformMapR);


// 4. Replace Sub-Partner headers
const subPartnerHeadersT = `                    <tr>
                      <th className="p-3">Candidate & Contact</th>
                      <th className="p-3">Gaming Platform</th>
                      <th className="p-3">Traffic Channel</th>
                      <th className="p-3">Est. Players</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>`;
const subPartnerHeadersR = `                    <tr>
                      <th className="p-3 cursor-pointer hover:text-white" onClick={() => handleSubPartnerSort('name')}>
                        Candidate & Contact {subPartnerSort.field === 'name' && (subPartnerSort.direction === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="p-3 cursor-pointer hover:text-white" onClick={() => handleSubPartnerSort('platform')}>
                        Gaming Platform {subPartnerSort.field === 'platform' && (subPartnerSort.direction === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="p-3">Traffic Channel</th>
                      <th className="p-3 cursor-pointer hover:text-white" onClick={() => handleSubPartnerSort('players')}>
                        Est. Players {subPartnerSort.field === 'players' && (subPartnerSort.direction === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="p-3 cursor-pointer hover:text-white" onClick={() => handleSubPartnerSort('status')}>
                        Status {subPartnerSort.field === 'status' && (subPartnerSort.direction === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>`;
content = content.replace(subPartnerHeadersT, subPartnerHeadersR);

// 5. Replace Sub-Partner map
const subPartnerMapT = `{(subPartners || []).map(sub => {`;
const subPartnerMapR = `{[...(subPartners || [])]
                      .sort((a, b) => {
                        let modifier = subPartnerSort.direction === 'asc' ? 1 : -1;
                        if (subPartnerSort.field === 'name') return a.fullName.localeCompare(b.fullName) * modifier;
                        if (subPartnerSort.field === 'platform') return a.platformName.localeCompare(b.platformName) * modifier;
                        if (subPartnerSort.field === 'players') {
                            const playersA = parseInt(a.estimatedPlayers.replace(/[^0-9]/g, '')) || 0;
                            const playersB = parseInt(b.estimatedPlayers.replace(/[^0-9]/g, '')) || 0;
                            return (playersB - playersA) * modifier;
                        }
                        if (subPartnerSort.field === 'status') return a.status.localeCompare(b.status) * modifier;
                        return 0;
                      })
                      .map(sub => {`;
content = content.replace(subPartnerMapT, subPartnerMapR);

fs.writeFileSync('src/components/AdminPanel.tsx', content);
