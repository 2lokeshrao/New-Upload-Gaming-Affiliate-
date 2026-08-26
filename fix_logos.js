const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'affiliate_default_secure_jwt_secret_2026_key';
const token = jwt.sign({ role: 'admin', authAt: Date.now() }, JWT_SECRET, { expiresIn: '8h' });

async function run() {
    const res = await fetch('http://localhost:3000/api/admin/data', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const data = await res.json();
    let platforms = data.platforms;
    
    let count = 0;
    for (let p of platforms) {
      if (p.name.includes('10CRIC')) {
        p.logoUrl = 'https://logo.clearbit.com/10cric.com';
        count++;
      } else if (p.name.includes('Pin-Up') || p.name.includes('pinup')) {
        p.logoUrl = 'https://logo.clearbit.com/pin-up.casino';
        count++;
      } else if (p.name.includes('Parimatch')) {
        p.logoUrl = 'https://logo.clearbit.com/parimatch.com';
        count++;
      } else if (p.name.includes('AMEX')) {
        p.logoUrl = 'https://logo.clearbit.com/americanexpress.com';
        count++;
      } else if (p.name.includes('Equitas')) {
        p.logoUrl = 'https://logo.clearbit.com/equitasbank.com';
        count++;
      } else if (p.name.includes('Uni Gold')) {
        p.logoUrl = 'https://logo.clearbit.com/uni.cards';
        count++;
      } else if (p.name.includes('Instant Loan')) {
        p.logoUrl = 'https://logo.clearbit.com/kreditbee.in';
        count++;
      } else if (p.name.includes('Salary Advance')) {
        p.logoUrl = 'https://logo.clearbit.com/earlysalary.com';
        count++;
      } else if (p.name.includes('Smart Personal')) {
        p.logoUrl = 'https://logo.clearbit.com/navifinserv.com';
        count++;
      } else if (p.name.includes('Personal Loan Offer')) {
        p.logoUrl = 'https://logo.clearbit.com/moneytap.com';
        count++;
      } else if (p.name.includes('Loan Against Mutual')) {
        p.logoUrl = 'https://logo.clearbit.com/smallcase.com';
        count++;
      } else if (p.name.includes('Instant Personal Loan')) {
         p.logoUrl = 'https://logo.clearbit.com/paysense.com';
         count++;
      } else if (p.name.includes('1Win')) {
         p.logoUrl = 'https://logo.clearbit.com/1win.pro';
         count++;
      } else if (p.name.includes('1xBet')) {
         p.logoUrl = 'https://logo.clearbit.com/1xbet.com';
         count++;
      } else if (p.name.includes('Mostbet')) {
         p.logoUrl = 'https://logo.clearbit.com/mostbet.com';
         count++;
      } else if (p.name.includes('Rajabets')) {
         p.logoUrl = 'https://logo.clearbit.com/rajabets.com';
         count++;
      } else if (p.name.includes('Megapari')) {
         p.logoUrl = 'https://logo.clearbit.com/megapari.com';
         count++;
      } else if (p.name.includes('Melbet')) {
         p.logoUrl = 'https://logo.clearbit.com/melbet.com';
         count++;
      } else if (p.name.includes('GG.BET')) {
         p.logoUrl = 'https://logo.clearbit.com/gg.bet';
         count++;
      } else if (p.name.includes('Stake Crypto')) {
         p.logoUrl = 'https://logo.clearbit.com/stake.com';
         count++;
      } else if (p.name.includes('Bet365')) {
         p.logoUrl = 'https://logo.clearbit.com/bet365.com';
         count++;
      } else if (p.name.includes('BC.Game')) {
         p.logoUrl = 'https://logo.clearbit.com/bc.game';
         count++;
      } else if (p.name.includes('22Bet')) {
         p.logoUrl = 'https://logo.clearbit.com/22bet.com';
         count++;
      } else if (p.name.includes('Dafabet')) {
         p.logoUrl = 'https://logo.clearbit.com/dafabet.com';
         count++;
      }
    }
    
    console.log(`Updating ${count} platforms...`);

    const updateRes = await fetch('http://localhost:3000/api/admin/platforms', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ platforms })
    });
    
    console.log('Save response:', await updateRes.json());
}
run();
