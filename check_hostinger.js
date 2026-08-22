fetch('http://localhost:3000/api/data')
  .then(res => res.json())
  .then(data => {
    const p = data.customPages.find(c => c.id === 'page_hostinger');
    console.log(p.affiliateLinks);
  }).catch(console.error);
