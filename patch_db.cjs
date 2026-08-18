const fs = require('fs');

let serverTs = fs.readFileSync('/app/applet/server.ts', 'utf8');

const replacement = `// 1. FLAT FILE JSON STORAGE (Since MySQL is not running)
const DATA_FILE = path.join(process.cwd(), 'app_data.json');

async function readDataFile() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      await fs.promises.writeFile(DATA_FILE, JSON.stringify({
        platforms: {},
        settings: {},
        custom_pages: {},
        sub_partners: {}
      }));
    }
    const raw = await fs.promises.readFile(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    logger.error('Error reading data file', e);
    return { platforms: {}, settings: {}, custom_pages: {}, sub_partners: {} };
  }
}

async function writeDataFile(data) {
  try {
    await fs.promises.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    logger.error('Error writing data file', e);
  }
}

async function setDoc(collection, docId, data) {
  const db = await readDataFile();
  if (!db[collection]) db[collection] = {};
  db[collection][docId] = data;
  await writeDataFile(db);
}

async function getCollection(collection) {
  const db = await readDataFile();
  if (!db[collection]) return [];
  return Object.values(db[collection]);
}

async function getDoc(collection, docId) {
  const db = await readDataFile();
  if (!db[collection]) return null;
  return db[collection][docId] || null;
}

async function updateDoc(collection, docId, updates) {
  const existing = await getDoc(collection, docId);
  if (existing) {
    await setDoc(collection, docId, { ...existing, ...updates });
  }
}

async function saveState() {
  try {
    const db = await readDataFile();
    
    // 1. Sync Platforms
    if (Array.isArray(statePlatforms)) {
      db.platforms = {};
      for (const p of statePlatforms) {
        db.platforms[p.id] = p;
      }
    }

    // 2. Sync Config
    if (stateConfig) {
      db.settings = db.settings || {};
      db.settings['globalConfig'] = stateConfig;
    }

    // 3. Sync Custom Pages
    if (Array.isArray(stateCustomPages)) {
      db.custom_pages = {};
      for (const cp of stateCustomPages) {
        db.custom_pages[cp.slug] = cp;
      }
    }

    // 4. Sync Sub Partners
    if (Array.isArray(stateSubPartners)) {
      db.sub_partners = {};
      for (const sp of stateSubPartners) {
        db.sub_partners[sp.id] = sp;
      }
    }

    await writeDataFile(db);
    logger.info("Successfully synced all in-memory state to JSON database.");
  } catch (e) {
    logger.error("saveState error:", e);
  }
}`;

const startIndex = serverTs.indexOf('// 1. SECURE MYSQL INITIALIZATION');
const endIndex = serverTs.indexOf('async function loadState() {');

if (startIndex !== -1 && endIndex !== -1) {
  serverTs = serverTs.substring(0, startIndex) + replacement + '\n\n' + serverTs.substring(endIndex);
  
  // Replace import mysql with nothing (we use fs.promises)
  serverTs = serverTs.replace("import mysql from 'mysql2/promise';", "");
  
  fs.writeFileSync('/app/applet/server.ts', serverTs);
  console.log('Successfully patched server.ts to use JSON instead of MySQL');
} else {
  console.log('Could not find sections to replace in server.ts');
}
