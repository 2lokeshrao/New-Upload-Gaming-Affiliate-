const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'server.ts');
let content = fs.readFileSync(file, 'utf8');

const target = `async function loadState() {
  try {
    // 1. Load or Seed Platforms
    const pSnap = await getCollection('platforms');
    if (pSnap.length > 0) {
      statePlatforms = pSnap as GamingPlatform[];
    } else {
      logger.info("Database empty: Seeding initial platforms...");
      for (const p of initialPlatforms) {
        await setDoc('platforms', p.id, p);
      }
      statePlatforms = [...initialPlatforms];
    }

    // 2. Load or Seed Config
    const cSnap = await getDoc('settings', 'globalConfig');
    if (cSnap) {
      stateConfig = cSnap as GlobalConfig;
    } else {
      logger.info("Database empty: Seeding initial global config...");
      await setDoc('settings', 'globalConfig', initialGlobalConfig);
      stateConfig = { ...initialGlobalConfig };
    }

    // 3. Load Sub Partners & Pages
    const spSnap = await getCollection('sub_partners');
    if (spSnap.length > 0) stateSubPartners = spSnap as SubPartnerApplication[];
    
    const cpSnap = await getCollection('custom_pages');
    stateCustomPages = cpSnap as any[];
    
    // Seed missing default pages
    for (const initCp of initialCustomPages) {
      if (!stateCustomPages.find(cp => cp.slug === initCp.slug)) {
        logger.info(\`Database missing custom page \${initCp.slug}: Seeding...\`);
        await setDoc('custom_pages', initCp.slug, initCp);
        stateCustomPages.push(initCp);
      }
    }
    
    // 5. Load Stats
    const statsSnap = await getDoc('settings', 'globalStats');
    if (statsSnap) {
      stateStats = statsSnap as AnalyticsStats;
    } else {
      logger.info("Database missing globalStats: Seeding...");
      await setDoc('settings', 'globalStats', stateStats);
    }

    logger.info("Loaded state from MySQL Collections.");
  } catch (e) {
    logger.error("Load state error:", e);
  }
}`;

const replacement = `async function loadState() {
  try {
    // Listen to Platforms
    onSnapshot(collection(firestoreDb, 'platforms'), (snapshot) => {
      const data = [];
      snapshot.forEach(doc => data.push(doc.data()));
      statePlatforms = data;
    });

    // Listen to Global Config
    onSnapshot(doc(firestoreDb, 'settings', 'globalConfig'), (docSnap) => {
      if (docSnap.exists()) {
        stateConfig = docSnap.data() as GlobalConfig;
      }
    });

    // Listen to Sub Partners
    onSnapshot(collection(firestoreDb, 'sub_partners'), (snapshot) => {
      const data = [];
      snapshot.forEach(doc => data.push(doc.data()));
      stateSubPartners = data;
    });

    // Listen to Custom Pages
    onSnapshot(collection(firestoreDb, 'custom_pages'), (snapshot) => {
      const data = [];
      snapshot.forEach(doc => data.push(doc.data()));
      stateCustomPages = data;
    });

    // Listen to Global Stats
    onSnapshot(doc(firestoreDb, 'settings', 'globalStats'), (docSnap) => {
      if (docSnap.exists()) {
        stateStats = docSnap.data() as AnalyticsStats;
      }
    });

    logger.info("Listening to state from Firebase.");
  } catch (e) {
    logger.error("Load state error:", e);
  }
}`;

content = content.replace(target, replacement);
fs.writeFileSync(file, content);
console.log('Patched loadState successfully');
