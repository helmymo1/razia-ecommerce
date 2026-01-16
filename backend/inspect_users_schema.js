const db = require('./config/db');

async function inspectSchema() {
  try {
    const [columns] = await db.query('SHOW COLUMNS FROM users');
    console.log('USERS TABLE SCHEMA:');
    console.log(JSON.stringify(columns, null, 2));
    process.exit(0);
  } catch (err) {
    console.error('Error inspecting schema:', err.message);
    process.exit(1);
  }
}

inspectSchema();
