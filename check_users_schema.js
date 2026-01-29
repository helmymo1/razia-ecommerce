const db = require('./backend/config/db');

async function checkSchema() {
  try {
    const [columns] = await db.query('DESCRIBE users');
    console.log('Users Table Columns:');
    console.table(columns);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkSchema();
