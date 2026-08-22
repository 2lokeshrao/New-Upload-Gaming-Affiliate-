const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
const firebaseConfig = {
  projectId: "alien-aura-2xctm",
  appId: "1:174239214287:web:63078c091f820e5d4ca5ba",
  apiKey: "AIzaSyAXYCxpjm3iPIXoKwacqqYqU9nw4Bh0gGk",
  authDomain: "alien-aura-2xctm.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-viprewardsgaming-107607cc-236e-4fc6-91c7-209f529cf75b",
  storageBucket: "alien-aura-2xctm.firebasestorage.app",
  messagingSenderId: "174239214287",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

(async () => {
  const qs = await getDocs(collection(db, 's2s_postbacks'));
  let cnt = 0;
  qs.forEach(doc => { cnt++; console.log(doc.id, doc.data()); });
  console.log("Postbacks found:", cnt);
  
  const statsQs = await getDocs(collection(db, 'settings'));
  statsQs.forEach(doc => console.log(doc.id, doc.data()));
  process.exit();
})();
