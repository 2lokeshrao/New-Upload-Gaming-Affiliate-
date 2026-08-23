import 'dotenv/config';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, limit, query } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "alien-aura-2xctm",
  appId: "1:174239214287:web:63078c091f820e5d4ca5ba",
  apiKey: "AIzaSyAXYCxpjm3iPIXoKwacqqYqU9nw4Bh0gGk",
  authDomain: "alien-aura-2xctm.firebaseapp.com"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "ai-studio-viprewardsgaming-107607cc-236e-4fc6-91c7-209f529cf75b");

async function run() {
  const snap = await getDocs(query(collection(db, 'platforms'), limit(1)));
  snap.forEach(d => {
      console.log(d.id, JSON.stringify(d.data(), null, 2));
  });
  process.exit(0);
}
run();
