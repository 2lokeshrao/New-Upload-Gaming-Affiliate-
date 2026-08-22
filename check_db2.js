fetch('http://localhost:3000/api/data')
  .then(res => res.json())
  .then(data => {
    const hostingerPlatform = data.platforms.find(p => p.id === 'hostinger');
    console.log("Platform Hostinger logoUrl:", hostingerPlatform?.logoUrl);
    
    const hostingerPage = data.customPages.find(c => c.id === 'page_hostinger');
    console.log("Custom Page Hostinger Links:");
    console.log(JSON.stringify(hostingerPage?.affiliateLinks, null, 2));
  }).catch(console.error);
