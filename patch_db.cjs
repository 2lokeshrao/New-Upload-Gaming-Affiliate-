const updates = {
  'rajabets': {
    rawAffiliateUrl: 'https://record.rajaaffiliates.com/_EK9JxTwjj8IWqcfzuvZcQGNd7ZgqdRLk/1/',
    masterPartnerUrl: 'https://record.rajaaffiliates.com/_EK9JxTwjj8LT2Fu8bIPGIGNd7ZgqdRLk/1/'
  },
  'mostbet': {
    rawAffiliateUrl: 'https://vgfiiimb.com/y0aU',
    masterPartnerUrl: 'http://mbp-aff.com/register/referral/486691',
    promoCode: 'MOSTBONUSVVIP'
  },
  'melbet': {
    rawAffiliateUrl: 'https://refpa3665.com/L?tag=d_5958269m_45415c_&site=5958269&ad=45415&r=mainpage',
    masterPartnerUrl: 'https://refpa3665.com/L?tag=d_5958269m_18645c_&site=5958269&ad=18645',
    promoCode: 'ml_3249162'
  },
  '22bet': {
    rawAffiliateUrl: 'https://che.fluxbrox.com/redirect.aspx?pid=192318&bid=1484&redirectURL=https://22link.world/'
  },
  'ggbet': {
    rawAffiliateUrl: 'https://ggbetbestoffer.com/l/6a87d9fb42effdadd80312f2?click_id={click_id}',
    masterPartnerUrl: 'https://ggbetaff.com/affiliate/register?ref=r5bck'
  },
  'thunderpick': {
    rawAffiliateUrl: 'https://go.thunder.partners/visit/?bta=37833&brand=thunderpick&campaign=WELCOME',
    masterPartnerUrl: 'https://go.thunder.partners/visit/?bta=37833&brand=thunderpartnersaffiliates'
  },
  '10cric': {
    rawAffiliateUrl: 'https://partners.10cricaffiliates.com/visit/?bta=36032&brand=10cric',
    masterPartnerUrl: 'https://partners.10cricaffiliates.com/visit/?bta=36032&brand=10cricaffiliatesaffiliates'
  }
};

(async () => {
  try {
    const loginRes = await fetch('http://localhost:3000/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: '@dmin123' })
    });
    const { token } = await loginRes.json();
    
    const dataRes = await fetch('http://localhost:3000/api/admin/data', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await dataRes.json();
    
    let changed = false;
    for (const p of data.platforms) {
      if (updates[p.id]) {
        Object.assign(p, updates[p.id]);
        changed = true;
      }
    }
    
    if (changed) {
      await fetch('http://localhost:3000/api/admin/platforms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ platforms: data.platforms })
      });
      console.log('Database updated successfully!');
    } else {
      console.log('No updates applied to database.');
    }
  } catch (err) {
    console.error(err);
  }
})();
