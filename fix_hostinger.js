fetch('http://localhost:3000/api/admin/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ password: '@dmin123' })
}).then(res => res.json()).then(async loginData => {
  const token = loginData.token;
  const dataRes = await fetch('http://localhost:3000/api/admin/data', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await dataRes.json();
  
  // 1. Fix custom page link
  const hostingerPage = data.customPages.find(c => c.id === 'page_hostinger');
  if (hostingerPage && hostingerPage.affiliateLinks && hostingerPage.affiliateLinks.length > 0) {
    hostingerPage.affiliateLinks[0].logoUrl = '/hostinger_logo_new.svg';
  }
  
  await fetch('http://localhost:3000/api/admin/custom-pages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ pages: data.customPages })
  });

  console.log("Updated hostinger custom page affiliate link with logoUrl");

}).catch(console.error);
