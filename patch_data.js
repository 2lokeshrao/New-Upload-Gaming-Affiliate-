const fs = require('fs');
let content = fs.readFileSync('src/data.ts', 'utf-8');

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

for (const [id, update] of Object.entries(updates)) {
  // Find the block for this id
  const blockRegex = new RegExp(`id:\\s*["']${id}["'][\\s\\S]*?\\},`, 'g');
  content = content.replace(blockRegex, (match) => {
    let newBlock = match;
    for (const [key, value] of Object.entries(update)) {
      const propRegex = new RegExp(`${key}:\\s*["'][^"']*["']`);
      if (newBlock.match(propRegex)) {
        newBlock = newBlock.replace(propRegex, `${key}: "${value}"`);
      } else {
        // If property doesn't exist, we could add it before the end of the block.
        // It's a bit harder so let's check if they do.
        // Usually rawAffiliateUrl and promoCode exist.
        // If it's missing, add it before the last }
        const propAdd = `\n    ${key}: "${value}",`;
        newBlock = newBlock.replace(/\n\s*\},$/, propAdd + '\n  },');
      }
    }
    return newBlock;
  });
}

fs.writeFileSync('src/data.ts', content);
console.log('src/data.ts patched');
