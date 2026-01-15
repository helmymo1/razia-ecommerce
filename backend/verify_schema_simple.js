const db = require('./config/db');

async function checkTables() {
  try {
    const [rows] = await db.query('SHOW TABLES');
    console.log('Tables found:', rows.length);
    if (rows.length > 0) {
      console.log('Schema loaded successfully.');
      rows.forEach(row => console.log(Object.values(row)[0]));
    } else {
      console.error('Database connection successful but NO TABLES found.');
    }
    process.exit(0);
  } catch (err) {
    console.error('Schema check failed:', err.message);
    process.exit(1);
  }
}

checkTables();
