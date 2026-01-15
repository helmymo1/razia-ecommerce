const db = require('../config/db');

async function checkSchema() {
  try {
    const [rows] = await db.query('DESCRIBE order_items');
    console.log('Columns in order_items:', rows.map(r => r.Field));
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}

checkSchema();
