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
  const emptyLinks = data.customPages.flatMap(cp => cp.affiliateLinks || []).filter(l => l.logoUrl === "");
  console.log("Empty custom page logoUrls:", emptyLinks);
}).catch(console.error);
