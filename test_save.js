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
  const hostinger = data.platforms.find(p => p.id === 'hostinger');
  console.log("Before save:", hostinger?.logoUrl);
  
  hostinger.logoUrl = '/hostinger_logo_new.svg';
  
  await fetch('http://localhost:3000/api/admin/platforms', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ platforms: data.platforms })
  });
  
  const dataRes2 = await fetch('http://localhost:3000/api/admin/data', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data2 = await dataRes2.json();
  console.log("After save:", data2.platforms.find(p => p.id === 'hostinger')?.logoUrl);
}).catch(console.error);
