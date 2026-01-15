const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from backend .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function checkConnection() {
  console.log('Testing Database Connection...');
  console.log(`Host: ${process.env.DB_HOST}`);
  console.log(`User: ${process.env.DB_USER}`);
  console.log(`Database: ${process.env.DB_NAME}`);

  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      connectTimeout: 5000 // 5 seconds timeout
    });

    await connection.execute('SELECT 1');
    console.log('✅ Database Connection Successful');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database Connection Failed:', error);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

checkConnection();
