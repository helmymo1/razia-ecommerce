
const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

(async () => {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to database.');

    // Check if phone column exists
    const [columns] = await connection.query("SHOW COLUMNS FROM addresses LIKE 'phone'");
    
    if (columns.length === 0) {
        console.log('Phone column missing. Adding...');
        await connection.query("ALTER TABLE addresses ADD COLUMN phone VARCHAR(20) AFTER country");
        console.log('✅ Phone column added.');
    } else {
        console.log('ℹ️ Phone column already exists.');
    }

  } catch (error) {
    console.error('Error modifying table:', error);
  } finally {
    if (connection) await connection.end();
  }
})();
