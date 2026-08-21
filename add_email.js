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
  const config = data.config;
  
  if (config.footerColumns) {
    let supportCol = config.footerColumns.find(c => c.title === 'Support' || c.title === 'Contact');
    if (!supportCol) {
      supportCol = { id: 'col_contact', title: 'Support', links: [] };
      config.footerColumns.push(supportCol);
    }
    
    if (!supportCol.links.find(l => l.url.includes('mailto:'))) {
      supportCol.links.push({
        label: 'business@bonuspromocode.in',
        url: 'mailto:business@bonuspromocode.in'
      });
      
      await fetch('http://localhost:3000/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ config })
      });
      console.log('Email added to footer in DB!');
    } else {
      console.log('Email already exists');
    }
  } else {
     console.log('No footer columns config found');
  }
}).catch(console.error);
