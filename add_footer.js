fetch('http://localhost:3000/api/admin/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ password: '@dmin123' })
}).then(res => res.json()).then(async loginData => {
  const token = loginData.token;
  
  // Get current data
  const dataRes = await fetch('http://localhost:3000/api/admin/data', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await dataRes.json();
  const config = data.config;
  
  if (config.footerColumns) {
    const usefulLinks = config.footerColumns.find(c => c.title === 'Useful Links' || c.title === 'Links' || c.title === 'Quick Links' || c.id === 'col_2' || c.id === 'links');
    if (usefulLinks) {
       if (!usefulLinks.links.find(l => l.url.includes('hostinger'))) {
         usefulLinks.links.push({
           label: 'Hostinger 20% OFF',
           url: '/page/hostinger-promo-code'
         });
         
         await fetch('http://localhost:3000/api/admin/config', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ config })
         });
         console.log('Added Hostinger to footer.');
       }
    }
  }
});
