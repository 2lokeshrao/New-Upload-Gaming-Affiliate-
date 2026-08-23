import 'dotenv/config';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import https from 'https';

const firebaseConfig = {
  projectId: "alien-aura-2xctm",
  appId: "1:174239214287:web:63078c091f820e5d4ca5ba",
  apiKey: "AIzaSyAXYCxpjm3iPIXoKwacqqYqU9nw4Bh0gGk",
  authDomain: "alien-aura-2xctm.firebaseapp.com"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "ai-studio-viprewardsgaming-107607cc-236e-4fc6-91c7-209f529cf75b");

function fetchBuffer(url: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
            if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                return fetchBuffer(new URL(res.headers.location, url).toString()).then(resolve).catch(reject);
            }
            if (res.statusCode !== 200) return reject(new Error('Status: ' + res.statusCode));
            const chunks: Buffer[] = [];
            res.on('data', chunk => chunks.push(chunk));
            res.on('end', () => resolve(Buffer.concat(chunks)));
        });
        req.on('error', reject);
    });
}

function findDomainFast(brandName: string): string {
    const map: any = {
        '10cric': '10cric.com',
        '1win': '1win.pro',
        '1xbet': '1xbet.com',
        '22bet': '22bet.in',
        'parimatch': 'parimatch.in',
        'megapari': 'megapari.com',
        'batery': 'batery.in',
        'melbet': 'melbet.in',
        'betwinner': 'betwinner.in',
        'dafabet': 'dafabet.com',
        'kheloo': 'kheloo.com',
        'fairplay': 'fairplay.club',
        'pin-up': 'pin-up.casino',
        'stake': 'stake.com'
    };
    const key = brandName.toLowerCase().replace(/[^a-z0-9-]/g, '');
    if (map[key]) return map[key];
    return key + '.com'; // simple fallback
}

async function run() {
  const snap = await getDocs(collection(db, 'platforms'));
  let updated = 0;
  for (const document of snap.docs) {
      const data = document.data();
      const name = data.name || 'P';
      // Only process if it is still SVG (hasn't been updated yet)
      if (data.logoUrl && data.logoUrl.includes('image/png')) {
          console.log(`Skipping ${name} - already updated`);
          continue;
      }
      
      const domain = findDomainFast(name);
      console.log(`Fetching ${name} via ${domain}...`);
      const iconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
      
      try {
          const buffer = await fetchBuffer(iconUrl);
          if (buffer.length > 500) {
              const base64 = `data:image/png;base64,${buffer.toString('base64')}`;
              await updateDoc(doc(db, 'platforms', document.id), { logoUrl: base64 });
              console.log(`  Updated ${name}`);
              updated++;
          }
      } catch (err: any) {
          console.log(`  Failed ${name}`);
      }
      // Wait to avoid rate limits
      await new Promise(r => setTimeout(r, 400));
  }
  console.log(`Done. Updated ${updated} logos.`);
  process.exit(0);
}
run();
