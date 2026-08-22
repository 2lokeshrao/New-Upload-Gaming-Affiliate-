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
  
  const rajabets = data.platforms.find(p => p.id === 'rajabets');
  if (rajabets) {
    rajabets.postbackKey = 'pb_rajabets_777';
    await fetch('http://localhost:3000/api/admin/platforms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ platforms: data.platforms })
    });
    console.log("Updated Rajabets with postbackKey: pb_rajabets_777");
  } else {
    console.log("Rajabets not found!");
  }
}).catch(console.error);
