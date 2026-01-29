const db = require('./backend/config/db');

async function checkSchema() {
  try {
    const [columns] = await db.query('DESCRIBE order_items');
    console.log('Order Items Table Columns:');
    console.table(columns);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkSchema();
