const fs = require('fs');

const code = fs.readFileSync('server.ts', 'utf8');

const regexRead = /async function readDataFile\(\) \{[\s\S]*?^async function writeDataFile/m;

const replacement = `
let mysqlPool: any = null;

async function getMysqlPool() {
  if (mysqlPool) return mysqlPool;
  if (!process.env.DB_HOST || !process.env.DB_USER) return null;
  
  try {
    mysqlPool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'u123456789_gamingdb',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    
    // Auto-create table if not exists
    await mysqlPool.query(\`
      CREATE TABLE IF NOT EXISTS mysql_state_store (
        id INT NOT NULL DEFAULT 1,
        state_json LONGTEXT NOT NULL,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    \`);
    
    return mysqlPool;
  } catch (err) {
    logger.error('MySQL connection failed', err);
    return null;
  }
}

async function readDataFile() {
  try {
    const pool = await getMysqlPool();
    if (pool) {
      const [rows] = await pool.query('SELECT state_json FROM mysql_state_store WHERE id = 1');
      if (rows && rows.length > 0) {
        return JSON.parse(rows[0].state_json);
      }
    }
  } catch(e) {
    logger.error('Error reading from MySQL, falling back to JSON', e);
  }

  // Fallback to File
  try {
    if (!fs.existsSync(DATA_FILE)) {
      try {
        await fs.promises.writeFile(DATA_FILE, JSON.stringify({
          platforms: {}, settings: {}, custom_pages: {}, sub_partners: {}
        }));
      } catch (writeErr) {
        DATA_FILE = '/tmp/app_data.json';
        if (!fs.existsSync(DATA_FILE)) {
          await fs.promises.writeFile(DATA_FILE, JSON.stringify({
            platforms: {}, settings: {}, custom_pages: {}, sub_partners: {}
          }));
        }
      }
    }
    const raw = await fs.promises.readFile(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    logger.error('Error reading data file', e);
    return { platforms: {}, settings: {}, custom_pages: {}, sub_partners: {} };
  }
}

async function writeDataFile
`;

const updated1 = code.replace(regexRead, replacement.trim() + '\\n');

const regexWrite = /async function writeDataFile\(data: any\) \{[\s\S]*?^async function setDoc/m;

const replacementWrite = `async function writeDataFile(data: any) {
  const jsonStr = JSON.stringify(data, null, 2);
  
  // Try MySQL
  try {
    const pool = await getMysqlPool();
    if (pool) {
      await pool.query(
        'INSERT INTO mysql_state_store (id, state_json) VALUES (1, ?) ON DUPLICATE KEY UPDATE state_json = VALUES(state_json)',
        [jsonStr]
      );
      return; // If MySQL succeeds, we can skip file writing or write both. We'll write file as backup just in case.
    }
  } catch(e) {
    logger.error('Error writing to MySQL', e);
  }

  // File Backup
  try {
    await fs.promises.writeFile(DATA_FILE, jsonStr);
  } catch (e) {
    try {
      DATA_FILE = '/tmp/app_data.json';
      await fs.promises.writeFile(DATA_FILE, jsonStr);
    } catch (err2) {
      logger.error('Error writing data file', err2);
    }
  }
}

async function setDoc`;

const updated2 = updated1.replace(regexWrite, replacementWrite);

fs.writeFileSync('server.ts', updated2, 'utf8');
console.log("Successfully patched server.ts to use MySQL JSON store");
