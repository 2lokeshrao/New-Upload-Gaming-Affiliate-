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
  const r = data.platforms.find(p => p.id === 'rajabets');
  console.log("Admin Raw URL:", r.rawAffiliateUrl);
  console.log("Admin Master URL:", r.masterPartnerUrl);
}).catch(console.error);
