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
  const platforms = data.platforms;
  
  const hostinger = platforms.find(p => p.id === 'hostinger');
  if (hostinger) {
    hostinger.logoUrl = '/hostinger_logo_new.svg';
    await fetch('http://localhost:3000/api/admin/platforms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ platforms })
    });
    console.log('Hostinger logo updated to /hostinger_logo_new.svg in DB!');
  }
}).catch(console.error);
