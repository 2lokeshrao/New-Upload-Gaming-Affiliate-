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
  let i = 0;
  for (const doc of snap.docs) {
      if (i < 5) console.log(doc.id, doc.data().name, doc.data().link, doc.data().url, doc.data().promoCode);
      i++;
  }
  console.log(`Total: ${snap.size}`);
  process.exit(0);
}
run();
