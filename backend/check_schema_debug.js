const db = require('./config/db');

async function checkSchema() {
  try {
    const [rows] = await db.query('DESCRIBE products');
    console.log('Products Table Schema:');
    rows.forEach(row => {
      console.log(`${row.Field} (${row.Type})`);
    });
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkSchema();
