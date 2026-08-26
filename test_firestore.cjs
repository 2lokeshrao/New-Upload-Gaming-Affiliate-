const { initializeApp } = require('firebase/app');
const { initializeFirestore, getFirestore } = require('firebase/firestore');
console.log("initializeFirestore exists?", typeof initializeFirestore === 'function');
