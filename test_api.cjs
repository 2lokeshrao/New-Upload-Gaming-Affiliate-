const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'affiliate_default_secure_jwt_secret_2026_key';
const token = jwt.sign({ role: 'admin', authAt: Date.now() }, JWT_SECRET, { expiresIn: '8h' });

async function run() {
    const res = await fetch('http://localhost:3000/api/admin/data', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    console.log('Status:', res.status);
    const data = await res.json();
    console.log('Platforms:', data.platforms?.length);
    console.log('Stats:', data.stats);
}
run();
