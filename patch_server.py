import re

with open('server.ts', 'r') as f:
    content = f.read()

# Add Firebase imports
if "import { initializeApp" not in content:
    content = content.replace("import path from 'path';", "import path from 'path';\nimport { initializeApp } from 'firebase/app';\nimport { getFirestore, collection, doc, getDoc as fsGetDoc, getDocs as fsGetDocs, setDoc as fsSetDoc, updateDoc as fsUpdateDoc, deleteDoc } from 'firebase/firestore';")

# Add Firebase init
firebase_init = """
const firebaseConfig = {
  projectId: "alien-aura-2xctm",
  appId: "1:174239214287:web:63078c091f820e5d4ca5ba",
  apiKey: "AIzaSyAXYCxpjm3iPIXoKwacqqYqU9nw4Bh0gGk",
  authDomain: "alien-aura-2xctm.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-viprewardsgaming-107607cc-236e-4fc6-91c7-209f529cf75b",
  storageBucket: "alien-aura-2xctm.firebasestorage.app",
  messagingSenderId: "174239214287",
  measurementId: ""
};

const fbApp = initializeApp(firebaseConfig);
// Note: We leave databaseId empty or specify it if needed. For web SDK, we can pass it if supported, or rely on default if it matches.
// Wait, web SDK doesn't natively accept databaseId in getFirestore(app) easily unless it's v10+.
// AI Studio Firebase tool uses a named database: 'ai-studio-viprewardsgaming-107607cc-236e-4fc6-91c7-209f529cf75b'
// Actually, in Web SDK: getFirestore(app, "databaseId")
const firestoreDb = getFirestore(fbApp, "ai-studio-viprewardsgaming-107607cc-236e-4fc6-91c7-209f529cf75b");
"""

if "const fbApp = initializeApp" not in content:
    content = content.replace("let DATA_FILE = path.join(process.cwd(), 'app_data.json');", "let DATA_FILE = path.join(process.cwd(), 'app_data.json');\n" + firebase_init)

# Replace DB functions
db_funcs = """
async function setDoc(coll: string, docId: string, data: any) {
  try {
    await fsSetDoc(doc(firestoreDb, coll, docId), data);
  } catch (e) {
    logger.error(`Error setting doc ${coll}/${docId}:`, e);
  }
}
async function getCollection(coll: string) {
  try {
    const querySnapshot = await fsGetDocs(collection(firestoreDb, coll));
    const docs: any[] = [];
    querySnapshot.forEach((doc) => docs.push(doc.data()));
    return docs;
  } catch (e) {
    logger.error(`Error getting collection ${coll}:`, e);
    return [];
  }
}
async function getDoc(coll: string, docId: string) {
  try {
    const docSnap = await fsGetDoc(doc(firestoreDb, coll, docId));
    if (docSnap.exists()) return docSnap.data();
    return null;
  } catch (e) {
    logger.error(`Error getting doc ${coll}/${docId}:`, e);
    return null;
  }
}
async function updateDoc(coll: string, docId: string, updates: any) {
  try {
    await fsUpdateDoc(doc(firestoreDb, coll, docId), updates);
  } catch (e) {
    logger.error(`Error updating doc ${coll}/${docId}:`, e);
  }
}

// Dummy these out so old code won't crash if it calls them
async function readDataFile() { return {}; }
async function writeDataFile(data: any) {}
"""

# Regex to replace from readDataFile to the end of updateDoc
# We'll use a precise replacement.
pattern = re.compile(r'async function readDataFile\(\) \{.*?\n\}\n\}', re.DOTALL)
# Actually, the regex approach might be brittle. Let's just find the start of readDataFile and end of updateDoc.
start_idx = content.find("async function readDataFile()")
end_idx = content.find("async function saveState()")

if start_idx != -1 and end_idx != -1:
    content = content[:start_idx] + db_funcs + "\n" + content[end_idx:]

with open('server.ts', 'w') as f:
    f.write(content)
