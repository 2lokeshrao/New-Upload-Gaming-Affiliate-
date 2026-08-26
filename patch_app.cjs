const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Add isDemo state
content = content.replace(
  /const \[customPages, setCustomPages\] = useState<CustomPage\[\]>\(\[\]\);/,
  `const [customPages, setCustomPages] = useState<CustomPage[]>([]);
  const [isDemo, setIsDemo] = useState(false);`
);

// Update initial admin load
content = content.replace(
  /setCustomPages\(data\.customPages\);/,
  `setCustomPages(data.customPages);
        if (data.isDemo !== undefined) setIsDemo(data.isDemo);`
);

// Update login admin load
content = content.replace(
  /setCustomPages\(adminData\.customPages\);/,
  `setCustomPages(adminData.customPages);
            setIsDemo(adminData.isDemo || false);`
);

// Block optimistic saves if isDemo
content = content.replace(
  /const handleSavePlatformsFromAdmin = async \(updated: GamingPlatform\[\]\) => \{/,
  `const handleSavePlatformsFromAdmin = async (updated: GamingPlatform[]) => {
    if (isDemo) { alert("Saving is disabled in Demo Mode"); return; }`
);

content = content.replace(
  /const handleSaveConfigFromAdmin = async \(updatedConfig: GlobalConfig\) => \{/,
  `const handleSaveConfigFromAdmin = async (updatedConfig: GlobalConfig) => {
    if (isDemo) { alert("Saving is disabled in Demo Mode"); return; }`
);

content = content.replace(
  /const handleUpdateSubPartnerStatus = async \(id: string, status: 'approved' \| 'contacted' \| 'pending'\) => \{/,
  `const handleUpdateSubPartnerStatus = async (id: string, status: 'approved' | 'contacted' | 'pending') => {
    if (isDemo) { alert("Saving is disabled in Demo Mode"); return; }`
);

content = content.replace(
  /const handleSaveCustomPagesFromAdmin = async \(pages: CustomPage\[\]\) => \{/,
  `const handleSaveCustomPagesFromAdmin = async (pages: CustomPage[]) => {
    if (isDemo) { alert("Saving is disabled in Demo Mode"); return; }`
);

// Pass isDemo to AdminPanel
content = content.replace(
  /token=\{adminToken\}/,
  `token={adminToken}
        isDemo={isDemo}`
);

fs.writeFileSync('src/App.tsx', content);
