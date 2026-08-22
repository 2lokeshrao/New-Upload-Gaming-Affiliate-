fetch('http://localhost:3000/api/data')
  .then(res => res.json())
  .then(data => {
    const r = data.platforms.find(p => p.id === 'rajabets');
    console.log("Raw URL:", r.rawAffiliateUrl);
    console.log("Master URL:", r.masterPartnerUrl);
  }).catch(console.error);
