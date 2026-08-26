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
    
    // I will write a generic function that clears SVG/base64 generic logos and replaces them with a valid clearbit logo URL
    // Also replacing 10cric which might not have svg but the user asked for it.
    
    for (let p of platforms) {
      let isGeneric = false;
      if (!p.logoUrl || (typeof p.logoUrl === 'string' && p.logoUrl.includes('data:image/svg'))) {
        isGeneric = true;
      }
      
      const name = p.name.toLowerCase();
      let domain = null;
      
      // known mappings
      if (name.includes('10cric')) domain = '10cric.com';
      else if (name.includes('pin-up')) domain = 'pin-up.casino';
      else if (name.includes('parimatch')) domain = 'parimatch.com';
      else if (name.includes('amex') || name.includes('american express')) domain = 'americanexpress.com';
      else if (name.includes('equitas')) domain = 'equitasbank.com';
      else if (name.includes('uni gold')) domain = 'uni.cards';
      else if (name.includes('salary advance')) domain = 'earlysalary.com';
      else if (name.includes('smart personal')) domain = 'navifinserv.com';
      else if (name.includes('personal loan offer')) domain = 'moneytap.com';
      else if (name.includes('instant loan')) domain = 'kreditbee.in';
      else if (name.includes('mutual fund')) domain = 'smallcase.com';
      else if (name.includes('instant personal')) domain = 'paysense.com';
      else if (name.includes('1win')) domain = '1win.pro';
      else if (name.includes('1xbet')) domain = '1xbet.com';
      else if (name.includes('mostbet')) domain = 'mostbet.com';
      else if (name.includes('rajabets')) domain = 'rajabets.com';
      else if (name.includes('megapari')) domain = 'megapari.com';
      else if (name.includes('melbet')) domain = 'melbet.com';
      else if (name.includes('gg.bet')) domain = 'gg.bet';
      else if (name.includes('stake crypto')) domain = 'stake.com';
      else if (name.includes('bet365')) domain = 'bet365.com';
      else if (name.includes('bc.game')) domain = 'bc.game';
      else if (name.includes('22bet')) domain = '22bet.com';
      else if (name.includes('dafabet')) domain = 'dafabet.com';
      else if (name.includes('hostinger')) domain = 'hostinger.com';
      else if (name.includes('thunderpick')) domain = 'thunderpick.io';
      else if (name.includes('betway')) domain = 'betway.com';
      else if (name.includes('apollo')) domain = 'apollo247.com';
      else if (name.includes('au bank')) domain = 'aubank.in';
      else if (name.includes('axis bank')) domain = 'axisbank.com';
      else if (name.includes('bharatpe')) domain = 'bharatpe.com';
      else if (name.includes('brightloans')) domain = 'brightloans.com';
      else if (name.includes('bybit')) domain = 'bybit.com';
      else if (name.includes('digi credit')) domain = 'digicredit.com';
      else if (name.includes('fatakpay')) domain = 'fatakpay.com';
      else if (name.includes('flipkart')) domain = 'flipkart.com';
      else if (name.includes('fuel rupay')) domain = 'rupay.co.in';
      else if (name.includes('hdfc')) domain = 'hdfcbank.com';
      else if (name.includes('hero fincorp')) domain = 'herofincorp.com';
      else if (name.includes('idfc')) domain = 'idfcfirstbank.com';
      else if (name.includes('incred')) domain = 'incred.com';
      else if (name.includes('indianoil')) domain = 'iocl.com';
      else if (name.includes('indusind')) domain = 'indusind.com';
      else if (name.includes('jiraaf')) domain = 'jiraaf.com';
      else if (name.includes('jupiter')) domain = 'jupiter.money';
      else if (name.includes('kissht')) domain = 'kissht.com';
      else if (name.includes('kiwi')) domain = 'gokiwi.in';
      else if (name.includes('kotak')) domain = 'kotak.com';
      else if (name.includes('leovegas')) domain = 'leovegas.com';
      else if (name.includes('kreditbee')) domain = 'kreditbee.in';
      else if (name.includes('lendingplate')) domain = 'lendingplate.com';
      else if (name.includes('lic')) domain = 'liccards.com';
      else if (name.includes('moneyview')) domain = 'moneyview.in';
      else if (name.includes('muthoot')) domain = 'muthootfinance.com';
      else if (name.includes('myflot')) domain = 'myflot.com';
      else if (name.includes('mymoneybazaar')) domain = 'mymoneybazaar.com';
      else if (name.includes('poonawalla')) domain = 'poonawallafincorp.com';
      else if (name.includes('pop upi')) domain = 'popclub.co';
      else if (name.includes('rbl')) domain = 'rblbank.com';
      else if (name.includes('ring')) domain = 'paywithring.com';
      else if (name.includes('sbi')) domain = 'sbicard.com';
      else if (name.includes('rivalry')) domain = 'rivalry.com';
      else if (name.includes('scapia')) domain = 'scapiacards.com';
      else if (name.includes('tata neu')) domain = 'tatadigital.com';
      else if (name.includes('tez credit')) domain = 'tezcredit.com';
      else if (name.includes('unity')) domain = 'unitybank.co.in';
      else if (name.includes('upstox')) domain = 'upstox.com';
      else if (name.includes('yes bank')) domain = 'yesbank.in';
      else if (name.includes('unibet')) domain = 'unibet.com';
      else if (name.includes('zype')) domain = 'getzype.com';
      else if (name.includes('888sport')) domain = '888sport.com';
      else if (name.includes('pinnacle')) domain = 'pinnacle.com';

      // Always replace if generic, or if the user specifically complained about 10cric and pinup
      if (domain && (isGeneric || name.includes('10cric') || name.includes('pin-up') || name.includes('pinup') || name.includes('1xbet') || name.includes('mostbet') || name.includes('1win') || name.includes('thunderpick') || name.includes('betway') || name.includes('bet365'))) {
        p.logoUrl = 'https://logo.clearbit.com/' + domain;
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
