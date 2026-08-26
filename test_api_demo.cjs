const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'affiliate_default_secure_jwt_secret_2026_key';
const token = jwt.sign({ role: 'demo', authAt: Date.now() }, JWT_SECRET, { expiresIn: '8h' });

async function run() {
    try {
        const res = await fetch('http://localhost:3000/api/admin/data', {
          headers: { 'Authorization': 'Bearer ' + token }
        });
        console.log('Status Demo:', res.status);
        const data = await res.json();
        console.log('IsDemo:', data.isDemo);
        console.log('PartnerConfigs in Demo:', data.config?.partnerPanelConfigs?.length);
        if (data.config?.partnerPanelConfigs?.length > 0) {
           console.log('Sample Stat:', data.config.partnerPanelConfigs[0].stats);
        }
    } catch(e) { console.error("Err Demo", e) }
    
    // Live mode test
    const tokenAdmin = jwt.sign({ role: 'admin', authAt: Date.now() }, JWT_SECRET, { expiresIn: '8h' });
    try {
        const res2 = await fetch('http://localhost:3000/api/admin/data', {
          headers: { 'Authorization': 'Bearer ' + tokenAdmin }
        });
        console.log('Status Admin:', res2.status);
        const data2 = await res2.json();
        console.log('IsDemo (admin):', data2.isDemo);
        console.log('PartnerConfigs in Admin:', data2.config?.partnerPanelConfigs?.length);
    } catch(e) { console.error("Err Admin", e) }
}
run();
