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
  
  const mostbet = data.platforms.find(p => p.id === 'mostbet' || p.name.toLowerCase().includes('mostbet'));
  if (mostbet) {
    mostbet.postbackKey = 'pb_mostbet_882';
    await fetch('http://localhost:3000/api/admin/platforms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ platforms: data.platforms })
    });
    console.log("Updated Mostbet with postbackKey: pb_mostbet_882, ID:", mostbet.id);
  } else {
    console.log("Mostbet not found!");
  }
}).catch(console.error);
