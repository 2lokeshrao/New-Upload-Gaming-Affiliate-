const fs = require('fs');

let content = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

// Inject state variables
const activeTabPattern = /const \[activeTab, setActiveTab\] = useState[^;]+;/;
content = content.replace(activeTabPattern, (match) => {
  return match + `\n  const [platformSearch, setPlatformSearch] = useState('');\n  const [platformFilter, setPlatformFilter] = useState<'all' | 'active' | 'inactive'>('all');`;
});

// Inject filtered mapping and UI
const tablePattern = /\{\/\* Table of Platforms \*\/\}/;

const searchUI = `              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                <div className="relative flex-1 w-full">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-slate-500" />
                  </div>
                  <input
                    type="text"
                    value={platformSearch}
                    onChange={(e) => setPlatformSearch(e.target.value)}
                    placeholder="Search platforms by name..."
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-700 rounded-xl leading-5 bg-slate-900 text-slate-300 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 sm:text-sm"
                  />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <label className="text-slate-400 text-sm font-bold whitespace-nowrap">Status:</label>
                  <select
                    value={platformFilter}
                    onChange={(e) => setPlatformFilter(e.target.value as 'all' | 'active' | 'inactive')}
                    className="bg-slate-900 border border-slate-700 text-slate-300 font-bold text-sm rounded-xl focus:ring-purple-500 focus:border-purple-500 block p-2.5 outline-none cursor-pointer"
                  >
                    <option value="all">All</option>
                    <option value="active">Active Only</option>
                    <option value="inactive">Inactive Only</option>
                  </select>
                </div>
              </div>

              {/* Table of Platforms */}`;

content = content.replace(tablePattern, searchUI);

// Replace mapping inside tbody:
// {platforms.map((p, index) => (
const mapPattern = /\{platforms\.map\(\(p,\s*index\)\s*=>\s*\(/;

const filteredMap = `{platforms
                    .filter(p => {
                      const matchesSearch = p.name.toLowerCase().includes(platformSearch.toLowerCase());
                      const matchesFilter = platformFilter === 'all' ? true : platformFilter === 'active' ? p.isActive : !p.isActive;
                      return matchesSearch && matchesFilter;
                    })
                    .map((p) => {
                      const index = platforms.findIndex(pl => pl.id === p.id);
                      return (`;

if (mapPattern.test(content)) {
  content = content.replace(mapPattern, filteredMap);
  // Also we need to close the map block correctly if there is a closing parenthesis.
  // Wait, the original was `(p, index) => (` which returns JSX implicitly.
  // We added a `{` in `.map((p) => { ... return (`
  // So we have to close it by replacing the matching `)` with `})}` but since we can't easily find the closing parenthesis,
  // we can look at how it closes.
}
fs.writeFileSync('src/components/AdminPanel.tsx', content);
