const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const regex = /async function writeDataFile\(data: any\) \{[\s\S]*?logger\.error\('Error writing data file', err2\);\n    \}\n  \}\n\}/;

const newWriteData = `async function writeDataFile(data: any) {
  // 1. Write to local JSON file for backup
  try {
    await fs.promises.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    try {
      DATA_FILE = '/tmp/app_data.json';
      await fs.promises.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
    } catch (err2) {
      logger.error('Error writing data file', err2);
    }
  }

  // 2. Persist to MySQL Database if available (Lifetime storage for Hostinger/Cloud)
  try {
    const pool = await getMysqlPool();
    if (pool) {
      const stateString = JSON.stringify(data);
      await pool.query(
        'INSERT INTO mysql_state_store (id, state_json) VALUES (1, ?) ON DUPLICATE KEY UPDATE state_json = ?',
        [stateString, stateString]
      );
      logger.info('Successfully persisted state to MySQL database.');
    }
  } catch (mysqlErr) {
    logger.error('Error persisting state to MySQL:', mysqlErr);
  }
}`;

if (regex.test(code)) {
  code = code.replace(regex, newWriteData);
  fs.writeFileSync('server.ts', code, 'utf8');
  console.log('writeDataFile patched successfully using regex for MySQL persistence!');
} else {
  console.log('Could not match regex in server.ts');
}
