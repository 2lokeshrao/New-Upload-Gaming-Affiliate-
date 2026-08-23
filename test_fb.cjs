const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

const firebaseConfig = {
  projectId: "alien-aura-2xctm",
  appId: "1:174239214287:web:63078c091f820e5d4ca5ba",
  apiKey: "AIzaSyAXYCxpjm3iPIXoKwacqqYqU9nw4Bh0gGk"
};
const fbApp = initializeApp(firebaseConfig);
const firestoreDb = getFirestore(fbApp, "ai-studio-viprewardsgaming-107607cc-236e-4fc6-91c7-209f529cf75b");

async function run() {
  try {
    const snap = await getDocs(collection(firestoreDb, 'platforms'));
    console.log("Firebase platforms count:", snap.size);
    snap.forEach(doc => console.log(doc.id, doc.data().name));
  } catch(e) { console.error(e); }
  process.exit(0);
}
run();
