const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const app = initializeApp();
const db = getFirestore();

async function check() {
  const snapshot = await db.collection('platforms').get();
  console.log(`Found ${snapshot.docs.length} platforms`);
  snapshot.forEach(doc => {
    const data = doc.data();
    console.log(`- ${doc.id}: logoUrl length = ${data.logoUrl ? data.logoUrl.length : 0}`);
  });
}
check().catch(console.error);
