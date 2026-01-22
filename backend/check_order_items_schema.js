const db = require('./config/db');

async function checkOrderItemsSchema() {
  try {
    const [rows] = await db.query('DESCRIBE order_items');
    console.log('Order Items Schema:');
    rows.forEach(row => {
      console.log(`${row.Field} (${row.Type})`);
    });
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkOrderItemsSchema();
