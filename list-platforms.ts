import 'dotenv/config';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "alien-aura-2xctm",
  appId: "1:174239214287:web:63078c091f820e5d4ca5ba",
  apiKey: "AIzaSyAXYCxpjm3iPIXoKwacqqYqU9nw4Bh0gGk",
  authDomain: "alien-aura-2xctm.firebaseapp.com"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "ai-studio-viprewardsgaming-107607cc-236e-4fc6-91c7-209f529cf75b");

async function run() {
  const snap = await getDocs(collection(db, 'platforms'));
  const platforms = [];
  snap.forEach(d => platforms.push(d.data()));
  console.log(JSON.stringify(platforms.map(p => ({ id: p.id, name: p.name, logo: p.logoUrl?.substring(0, 30) })), null, 2));
  process.exit(0);
}
run();
