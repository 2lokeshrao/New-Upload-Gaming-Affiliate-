const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'affiliate_default_secure_jwt_secret_2026_key';
const token = jwt.sign({ role: 'admin', authAt: Date.now() }, JWT_SECRET, { expiresIn: '8h' });

const domainMap = {
  "1Win Casino & Sports": "1win.pro",
  "1xBet": "1xbet.com",
  "Mostbet Official": "mostbet.com",
  "Hostinger": "hostinger.com",
  "Thunderpick": "thunderpick.io",
  "Rajabets": "rajabets.com",
  "10CRIC": "10cric.com",
  "Pin-Up Casino": "pin-up.casino",
  "Megapari": "megapari.com",
  "Melbet": "melbet.com",
  "GG.BET": "gg.bet",
  "Parimatch Global": "parimatch.com",
  "Stake Crypto Casino": "stake.com",
  "Bet365": "bet365.com",
  "BC.Game VIP": "bc.game",
  "22Bet India": "22bet.com",
  "5paisa Demat": "5paisa.com",
  "Dafabet India": "dafabet.com",
  "AMEX Platinum Reserve": "americanexpress.com",
  "Betway Esports": "betway.com",
  "Apollo Cash": "apollo247.com",
  "AU Bank Credit Card": "aubank.in",
  "Axis Bank MyZone": "axisbank.com",
  "Axis Bank Neo": "axisbank.com",
  "BharatPe Personal Loan": "bharatpe.com",
  "BharatPe Credit Line": "bharatpe.com",
  "BrightLoans": "brightloans.com",
  "Bybit": "bybit.com",
  "Digi Credit": "digicredit.com",
  "Equitas Selfe Saving": "equitasbank.com",
  "FatakPay": "fatakpay.com",
  "Flexible Credit Line": "creditline.com",
  "Flipkart Axis Bank": "flipkart.com",
  "Fuel RuPay Card": "rupay.co.in",
  "Fuel RuPay Card (Valueback)": "rupay.co.in",
  "Personal Loan Offer": "moneytap.com",
  "HDFC Diners Club": "hdfcbank.com",
  "HDFC Pixel Play": "hdfcbank.com",
  "HDFC Credit Card": "hdfcbank.com",
  "Hero Fincorp": "herofincorp.com",
  "IDFC First Bank": "idfcfirstbank.com",
  "IDFC First Bank Loan": "idfcfirstbank.com",
  "IDFC FIRST Bank Savings": "idfcfirstbank.com",
  "InCred Personal Loan": "incred.com",
  "IndianOil Credit Card": "iocl.com",
  "IndusInd Bank Tiger": "indusind.com",
  "Instant Loan Approval": "kreditbee.in",
  "Instant Personal Loan": "paysense.com",
  "Jiraaf Bonds": "jiraaf.com",
  "Jupiter Edge+": "jupiter.money",
  "Kissht Personal Loan": "kissht.com",
  "KIWI RuPay Credit Card": "gokiwi.in",
  "KIWI Yes Bank RuPay": "gokiwi.in",
  "Kotak 811 Super Savings": "kotak.com",
  "LeoVegas": "leovegas.com",
  "Kotak 811 Zero Balance": "kotak.com",
  "KreditBee Personal Loan": "kreditbee.in",
  "Lendingplate": "lendingplate.com",
  "LIC Credit Card": "liccards.com",
  "Moneyview": "moneyview.in",
  "Muthoot Finance Business Loan": "muthootfinance.com",
  "Loan Against Mutual Fund": "smallcase.com",
  "Myflot": "myflot.com",
  "MyMoneyBazaar": "mymoneybazaar.com",
  "Poonawalla Fincorp": "poonawallafincorp.com",
  "POP UPI RuPay": "popclub.co",
  "Quick Approval Loan": "quickapproval.com",
  "Quick Instant Loan": "quickloan.com",
  "RBL Bank Shoprite": "rblbank.com",
  "Ring Personal Loan": "paywithring.com",
  "Roarbank Credit Card": "roarbank.com",
  "Salary Advance Loan": "earlysalary.com",
  "SBI Credit Card (Rewards)": "sbicard.com",
  "Rivalry": "rivalry.com",
  "SBI Credit Card": "sbicard.com",
  "Scapia Federal Bank": "scapiacards.com",
  "Smart Personal Loan": "navifinserv.com",
  "STOCKO By InCred": "incred.com",
  "Tata Neu HDFC Bank": "tatadigital.com",
  "Tez Credit": "tezcredit.com",
  "Uni Gold Credit Card": "uni.cards",
  "Unity Small Finance Bank": "unitybank.co.in",
  "Upstox Demat": "upstox.com",
  "YES BANK Credit Card": "yesbank.in",
  "Zagg RuPay Credit Card": "zagg.com",
  "Unibet": "unibet.com",
  "Zapcash": "zapcash.com",
  "Zype Personal Loan": "getzype.com",
  "888sport": "888sport.com",
  "Pinnacle Esports": "pinnacle.com"
};

async function run() {
    const res = await fetch('http://localhost:3000/api/admin/data', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const data = await res.json();
    let platforms = data.platforms;
    
    let count = 0;
    
    for (let p of platforms) {
      let domain = domainMap[p.name];
      if (domain) {
          // Force update to Google Favicon for highest reliability 
          p.logoUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
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
