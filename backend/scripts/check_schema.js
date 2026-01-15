const db = require('../config/db');

async function checkSchema() {
  try {
    const [rows] = await db.query('DESCRIBE categories');
    console.log('Columns:', rows.map(r => `${r.Field} (${r.Type})`).join(', '));
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

checkSchema();
