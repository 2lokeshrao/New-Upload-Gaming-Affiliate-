const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'server.ts');
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "import { getFirestore, collection, doc, getDoc as fsGetDoc, getDocs as fsGetDocs, setDoc as fsSetDoc, updateDoc as fsUpdateDoc, deleteDoc } from 'firebase/firestore';",
  "import { getFirestore, collection, doc, getDoc as fsGetDoc, getDocs as fsGetDocs, setDoc as fsSetDoc, updateDoc as fsUpdateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';"
);

fs.writeFileSync(file, content);
console.log('Patched imports');
