import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { GoogleGenAI } from '@google/genai';
import sharp from 'sharp';

const firebaseConfig = {
  projectId: "alien-aura-2xctm",
  appId: "1:174239214287:web:63078c091f820e5d4ca5ba",
  apiKey: "AIzaSyAXYCxpjm3iPIXoKwacqqYqU9nw4Bh0gGk",
  authDomain: "alien-aura-2xctm.firebaseapp.com"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "ai-studio-viprewardsgaming-107607cc-236e-4fc6-91c7-209f529cf75b");
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const logosDir = path.join(process.cwd(), 'public', 'logos');
if (!fs.existsSync(logosDir)) fs.mkdirSync(logosDir, { recursive: true });

async function getDomain(name: string) {
    const n = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (n.includes('1win')) return '1win.pro';
    if (n.includes('parimatch')) return 'parimatch.com';
    if (n.includes('mostbet')) return 'mostbet.com';
    if (n.includes('1xbet')) return '1xbet.com';
    if (n.includes('megapari')) return 'megapari.com';
    if (n.includes('dafabet')) return 'dafabet.com';
    if (n.includes('22bet')) return '22bet.com';
    if (n.includes('stake')) return 'stake.com';
    if (n.includes('bcgame')) return 'bc.game';
    if (n.includes('bet365')) return 'bet365.com';
    if (n.includes('betway')) return 'betway.com';
    if (n.includes('888')) return '888casino.com';
    if (n.includes('leovegas')) return 'leovegas.com';
    if (n.includes('pinup')) return 'pin-up.casino';
    if (n.includes('rajabets')) return 'rajabets.com';
    if (n.includes('ggbet')) return 'gg.bet';
    if (n.includes('hostinger')) return 'hostinger.com';
    if (n.includes('hdfc')) return 'hdfcbank.com';
    if (n.includes('sbi')) return 'sbi.co.in';
    if (n.includes('icici')) return 'icicibank.com';
    if (n.includes('kotak')) return 'kotak.com';
    if (n.includes('idfc')) return 'idfcfirstbank.com';
    if (n.includes('axis')) return 'axisbank.com';
    if (n.includes('indusind')) return 'indusind.com';
    if (n.includes('yesbank')) return 'yesbank.in';
    return n + '.com';
}

async function createPlaceholder(text: string, filePath: string) {
    const letter = text.trim().charAt(0).toUpperCase() || 'P';
    const svg = `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg" style="background:#1e293b"><text x="100" y="140" font-size="120" font-family="Arial" font-weight="bold" fill="#fff" text-anchor="middle">${letter}</text></svg>`;
    await sharp(Buffer.from(svg)).webp().toFile(filePath);
}

async function sleep(ms: number) {
    return new Promise(r => setTimeout(r, ms));
}

async function processPlatform(platform: any) {
    console.log(`Processing ${platform.name}...`);
    
    // 1. Logo
    let hasValidLogo = false;
    const logoFileName = `${platform.id}.webp`;
    const logoFilePath = path.join(logosDir, logoFileName);
    const publicLogoUrl = `/logos/${logoFileName}`;

    if (platform.logoUrl && platform.logoUrl.startsWith('data:image')) {
       try {
           const b64 = platform.logoUrl.split(',')[1];
           const buf = Buffer.from(b64, 'base64');
           if (buf.length > 100) {
               await sharp(buf).webp().toFile(logoFilePath);
               hasValidLogo = true;
           }
       } catch (e) {}
    } else if (platform.logoUrl && platform.logoUrl.startsWith('/logos/')) {
        // already saved maybe, verify if it exists
        if (fs.existsSync(path.join(process.cwd(), 'public', platform.logoUrl))) {
            hasValidLogo = true;
        } else if (fs.existsSync(logoFilePath)) {
            hasValidLogo = true;
        }
    } else if (platform.logoUrl && platform.logoUrl.startsWith('http')) {
        try {
            const res = await fetch(platform.logoUrl);
            if (res.ok) {
                const arr = await res.arrayBuffer();
                await sharp(Buffer.from(arr)).webp().toFile(logoFilePath);
                hasValidLogo = true;
            }
        } catch(e) {}
    }

    if (!hasValidLogo) {
        const domain = await getDomain(platform.name);
        try {
            const res = await fetch(`https://logo.clearbit.com/${domain}`);
            if (res.ok) {
                const arr = await res.arrayBuffer();
                await sharp(Buffer.from(arr)).webp().toFile(logoFilePath);
                hasValidLogo = true;
            }
        } catch(e) {}
    }

    if (!hasValidLogo) {
        await createPlaceholder(platform.name, logoFilePath);
    }
    const updatePayload: any = { logoUrl: publicLogoUrl };

    // 2. SEO Content
    if (!platform.reviewContent || platform.reviewContent.length < 50) {
        let retries = 3;
        while(retries > 0) {
            try {
               const prompt = `Write a high-converting, SEO-optimized review for the affiliate platform "${platform.name}".
    It offers this bonus: "${platform.bonusText}".
    Category: ${platform.category}.
    Include:
    <h2>${platform.name} Review & Bonuses</h2>
    A short 2-sentence engaging introduction.
    <h3>Why Choose ${platform.name}?</h3>
    An unordered list (<ul>) with 3 strong benefits.
    <h3>How to use the Promo Code</h3>
    A short text mentioning promo code: "${platform.promoCode}".
    Return ONLY pure HTML (no markdown code blocks, just raw HTML). Keep it under 250 words.`;
               
               const result = await ai.models.generateContent({
                   model: 'gemini-2.5-flash',
                   contents: prompt
               });
               
               let review = result.text.trim();
               if (review.startsWith('```html')) review = review.substring(7);
               if (review.startsWith('```')) review = review.substring(3);
               if (review.endsWith('```')) review = review.substring(0, review.length-3);
               
               updatePayload.reviewContent = review.trim();
               updatePayload.metaTitle = `${platform.name} Promo Code ${platform.promoCode} | Review & Bonus`;
               updatePayload.metaDescription = `Read our full review of ${platform.name} and get the exclusive bonus: ${platform.bonusText} using promo code ${platform.promoCode}.`;
               break; // success
            } catch(e: any) {
               console.log(`Failed SEO generation for ${platform.name} (Retries left: ${retries-1}) - Error: ${e.status || e.message}`);
               retries--;
               await sleep(2000);
            }
        }
    }

    await updateDoc(doc(db, 'platforms', platform.id), updatePayload);
    console.log(`Updated ${platform.name}`);
}

async function run() {
  const snap = await getDocs(collection(db, 'platforms'));
  const platforms = [];
  snap.forEach(d => platforms.push(d.data()));
  console.log(`Found ${platforms.length} platforms`);
  
  for (const p of platforms) {
      await processPlatform(p);
      await sleep(500); // rate limiting
  }
  console.log('All done!');
  process.exit(0);
}

run();
